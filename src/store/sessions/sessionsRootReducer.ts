import type { AnyAction } from '@reduxjs/toolkit';
import type { appReducer } from '@/store/reducers';
import {
  beginAddSession,
  buildSessionId,
  cancelAddSession,
  StoredSession,
  switchSession,
} from './sessionsSlice';

type AppState = ReturnType<typeof appReducer>;
type AppReducer = typeof appReducer;

// Loads a stored session into auth/settings on top of a fresh state, so no data from the
// previous installation (conversations, contacts, inboxes...) survives the switch.
const activateSession = (
  reducer: AppReducer,
  state: AppState,
  sessionId: string | null,
  accountId?: number,
): AppState => {
  const target = state.sessions.list.find(session => session.id === sessionId);
  if (!target) {
    return state;
  }
  const fresh = reducer(undefined, { type: 'INIT' });
  const user = accountId ? { ...target.user, account_id: accountId } : target.user;
  return {
    ...fresh,
    conversationFilter: keepFilterPreference(fresh, state),
    settings: {
      ...state.settings,
      baseUrl: target.baseUrl,
      installationUrl: target.installationUrl,
      webSocketUrl: target.webSocketUrl,
      notificationSettings: fresh.settings.notificationSettings,
      version: '',
    },
    auth: { ...fresh.auth, user, headers: target.headers },
    sessions: { list: state.sessions.list, activeId: target.id, returnToId: null },
  };
};

// The conversation filter the user chose is a device preference, not per-installation data.
const keepFilterPreference = (fresh: AppState, previous: AppState) => {
  const { remembered } = previous.conversationFilter;
  return remembered
    ? { filters: { ...fresh.conversationFilter.filters, ...remembered }, remembered }
    : fresh.conversationFilter;
};

// Keeps the stored copy of the active session in step with `auth` (login, profile refresh,
// account switch inside the same installation).
const syncActiveSession = (state: AppState): AppState => {
  const { user, headers } = state.auth;
  const { baseUrl, installationUrl, webSocketUrl } = state.settings;
  if (!user || !headers || !baseUrl) {
    return state;
  }
  const id = buildSessionId(baseUrl, user.id);
  const { list, activeId } = state.sessions;
  const existing = list.find(session => session.id === id);
  if (
    existing &&
    activeId === id &&
    existing.user === user &&
    existing.headers === headers &&
    existing.installationUrl === installationUrl &&
    existing.webSocketUrl === webSocketUrl
  ) {
    return state;
  }
  const session: StoredSession = { id, baseUrl, installationUrl, webSocketUrl, user, headers };
  const nextList = existing
    ? list.map(item => (item.id === id ? session : item))
    : [...list, session];
  return { ...state, sessions: { list: nextList, activeId: id, returnToId: null } };
};

export const createSessionsRootReducer =
  (reducer: AppReducer) =>
  (state: AppState | undefined, action: AnyAction): AppState => {
    if (state) {
      if (action.type === 'auth/logout') {
        // Sign out of the active installation only; fall back to another stored one if any.
        const remaining = state.sessions.list.filter(
          session => session.id !== state.sessions.activeId,
        );
        if (remaining.length) {
          return syncActiveSession(
            activateSession(
              reducer,
              { ...state, sessions: { ...state.sessions, list: remaining } },
              remaining[0].id,
            ),
          );
        }
        const fresh = reducer(undefined, { type: 'INIT' });
        return {
          ...fresh,
          settings: state.settings,
          conversationFilter: keepFilterPreference(fresh, state),
        };
      }
      if (switchSession.match(action)) {
        return syncActiveSession(
          activateSession(reducer, state, action.payload.sessionId, action.payload.accountId),
        );
      }
      if (beginAddSession.match(action)) {
        const fresh = reducer(undefined, { type: 'INIT' });
        return {
          ...fresh,
          conversationFilter: keepFilterPreference(fresh, state),
          settings: {
            ...state.settings,
            notificationSettings: fresh.settings.notificationSettings,
          },
          sessions: {
            list: state.sessions.list,
            activeId: null,
            returnToId: state.sessions.activeId,
          },
        };
      }
      if (cancelAddSession.match(action)) {
        return syncActiveSession(activateSession(reducer, state, state.sessions.returnToId));
      }
    }
    return syncActiveSession(reducer(state, action));
  };
