import { createAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User';
import type { AuthHeaders } from '@/store/auth/authTypes';

// A signed-in user on one Chatwoot installation. Several can be kept at once; the active one
// is mirrored into `auth` and `settings`, so the rest of the app keeps working unchanged.
export interface StoredSession {
  id: string;
  baseUrl: string;
  installationUrl: string;
  webSocketUrl: string;
  user: User;
  headers: AuthHeaders;
}

export interface SessionsState {
  list: StoredSession[];
  activeId: string | null;
  // Session to go back to when "add installation" is cancelled.
  returnToId: string | null;
  // Conversation list shows every signed-in account at once.
  unifiedView?: boolean;
  // Accounts (`sessionId/accountId`) left out of the unified list.
  unifiedExcluded?: string[];
}

export const initialSessionsState: SessionsState = {
  list: [],
  activeId: null,
  returnToId: null,
};

export const setUnifiedView = createAction<boolean>('sessions/setUnifiedView');
export const toggleUnifiedAccount = createAction<string>('sessions/toggleUnifiedAccount');

// Cross-slice transitions are applied in `sessionsRootReducer`; this reducer only owns the
// unified-view preferences.
const sessionsReducer = (
  state: SessionsState = initialSessionsState,
  action: { type: string; payload?: unknown },
): SessionsState => {
  if (setUnifiedView.match(action)) {
    return { ...state, unifiedView: action.payload };
  }
  if (toggleUnifiedAccount.match(action)) {
    const excluded = state.unifiedExcluded ?? [];
    return {
      ...state,
      unifiedExcluded: excluded.includes(action.payload)
        ? excluded.filter(key => key !== action.payload)
        : [...excluded, action.payload],
    };
  }
  return state;
};

export const switchSession = createAction<{ sessionId: string; accountId?: number }>(
  'sessions/switch',
);
export const beginAddSession = createAction('sessions/beginAdd');
export const cancelAddSession = createAction('sessions/cancelAdd');

export const buildSessionId = (baseUrl: string, userId: number | string) =>
  `${baseUrl.toLowerCase()}#${userId}`;

export default sessionsReducer;
