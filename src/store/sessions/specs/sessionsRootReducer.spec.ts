import { appReducer } from '@/store/reducers';
import { createSessionsRootReducer } from '../sessionsRootReducer';
import { beginAddSession, cancelAddSession, setUnifiedView, switchSession } from '../sessionsSlice';
import { setFilters } from '@/store/conversation/conversationFilterSlice';
import type { User } from '@/types/User';

jest.mock('react-native-permissions', () => jest.requireActual('react-native-permissions/mock'));
jest.mock('@react-native-firebase/messaging', () => jest.fn());
jest.mock('@sentry/react-native', () => ({ captureException: jest.fn() }));
jest.mock('react-native-device-info', () => ({}));
jest.mock('@/i18n', () => ({ t: (key: string) => key }));
jest.mock('@/utils/toastUtils', () => ({ showToast: jest.fn() }));
jest.mock('@/utils/navigationUtils', () => ({ navigate: jest.fn() }));

const rootReducer = createSessionsRootReducer(appReducer);

const makeUser = (id: number, accountIds: number[]) =>
  ({
    id,
    email: `agent${id}@example.com`,
    account_id: accountIds[0],
    accounts: accountIds.map(accountId => ({
      id: accountId,
      name: `Acc ${accountId}`,
      role: 'agent',
    })),
  }) as unknown as User;

const headers = (token: string) => ({ 'access-token': token, uid: 'uid', client: 'client' });

// Simulates configuring an installation URL and signing in on it.
const signIn = (state: ReturnType<typeof rootReducer>, host: string, user: User, token: string) => {
  const withUrl = rootReducer(state, {
    type: 'settings/setInstallationUrl/fulfilled',
    payload: {
      installationUrl: `https://${host}/`,
      baseUrl: host,
      webSocketUrl: `wss://${host}/cable`,
    },
  });
  return rootReducer(withUrl, {
    type: 'auth/login/fulfilled',
    payload: { user, headers: headers(token) },
  });
};

describe('sessionsRootReducer', () => {
  const initial = rootReducer(undefined, { type: 'INIT' });

  it('stores the signed-in session', () => {
    const state = signIn(initial, 'a.example.com', makeUser(1, [1]), 'tokA');
    expect(state.sessions.list).toHaveLength(1);
    expect(state.sessions.activeId).toBe('a.example.com#1');
    expect(state.sessions.list[0].headers['access-token']).toBe('tokA');
  });

  it('keeps both sessions after adding a second installation and can switch back', () => {
    let state = signIn(initial, 'a.example.com', makeUser(1, [1, 2]), 'tokA');
    state = rootReducer(state, beginAddSession());
    expect(state.auth.user).toBeNull();
    expect(state.sessions.returnToId).toBe('a.example.com#1');

    state = signIn(state, 'b.example.com', makeUser(7, [1]), 'tokB');
    expect(state.sessions.list.map(s => s.id)).toEqual(['a.example.com#1', 'b.example.com#7']);
    expect(state.sessions.activeId).toBe('b.example.com#7');
    expect(state.settings.installationUrl).toBe('https://b.example.com/');

    state = rootReducer(state, switchSession({ sessionId: 'a.example.com#1', accountId: 2 }));
    expect(state.settings.installationUrl).toBe('https://a.example.com/');
    expect(state.settings.webSocketUrl).toBe('wss://a.example.com/cable');
    expect(state.auth.headers?.['access-token']).toBe('tokA');
    expect(state.auth.user?.account_id).toBe(2);
    // The stored copy follows the account chosen inside the installation.
    expect(state.sessions.list.find(s => s.id === 'a.example.com#1')?.user.account_id).toBe(2);
  });

  it('drops data loaded for the previous installation on switch', () => {
    let state = signIn(initial, 'a.example.com', makeUser(1, [1]), 'tokA');
    state = rootReducer(state, beginAddSession());
    state = signIn(state, 'b.example.com', makeUser(7, [1]), 'tokB');
    const dirty = { ...state, conversations: { ...state.conversations, marker: true } };
    const switched = rootReducer(
      dirty as typeof state,
      switchSession({ sessionId: 'a.example.com#1' }),
    );
    expect((switched.conversations as unknown as { marker?: boolean }).marker).toBeUndefined();
  });

  it('cancels adding and returns to the previous session', () => {
    let state = signIn(initial, 'a.example.com', makeUser(1, [1]), 'tokA');
    state = rootReducer(state, beginAddSession());
    state = rootReducer(state, cancelAddSession());
    expect(state.auth.user?.id).toBe(1);
    expect(state.sessions.activeId).toBe('a.example.com#1');
    expect(state.sessions.returnToId).toBeNull();
  });

  it('logout only removes the active session and falls back to another', () => {
    let state = signIn(initial, 'a.example.com', makeUser(1, [1]), 'tokA');
    state = rootReducer(state, beginAddSession());
    state = signIn(state, 'b.example.com', makeUser(7, [1]), 'tokB');
    state = rootReducer(state, { type: 'auth/logout' });
    expect(state.sessions.list.map(s => s.id)).toEqual(['a.example.com#1']);
    expect(state.auth.headers?.['access-token']).toBe('tokA');

    state = rootReducer(state, { type: 'auth/logout' });
    expect(state.sessions.list).toHaveLength(0);
    expect(state.auth.user).toBeNull();
  });

  it('keeps the chosen conversation filter across installations and logout', () => {
    let state = signIn(initial, 'a.example.com', makeUser(1, [1]), 'tokA');
    state = rootReducer(state, setFilters({ key: 'assignee_type', value: 'me' }));
    state = rootReducer(state, beginAddSession());
    expect(state.conversationFilter.filters.assignee_type).toBe('me');

    state = signIn(state, 'b.example.com', makeUser(7, [1]), 'tokB');
    state = rootReducer(state, switchSession({ sessionId: 'a.example.com#1' }));
    expect(state.conversationFilter.filters.assignee_type).toBe('me');

    state = rootReducer(state, { type: 'auth/logout' });
    expect(state.conversationFilter.filters.assignee_type).toBe('me');
  });

  it('keeps the unified view across installation switches', () => {
    let state = signIn(initial, 'a.example.com', makeUser(1, [1]), 'tokA');
    state = rootReducer(state, setUnifiedView(true));
    state = rootReducer(state, beginAddSession());
    state = signIn(state, 'b.example.com', makeUser(7, [1]), 'tokB');
    state = rootReducer(state, switchSession({ sessionId: 'a.example.com#1' }));
    expect(state.sessions.unifiedView).toBe(true);
  });

  it('does not create a new state object for unrelated actions', () => {
    const state = signIn(initial, 'a.example.com', makeUser(1, [1]), 'tokA');
    const next = rootReducer(state, { type: 'unrelated/action' });
    expect(next.sessions).toBe(state.sessions);
  });
});
