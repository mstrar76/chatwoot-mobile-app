import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export const selectSessions = (state: RootState) => state.sessions.list;

export const selectActiveSessionId = (state: RootState) => state.sessions.activeId;

export const selectIsAddingSession = (state: RootState) => state.sessions.returnToId !== null;

export interface SessionAccountEntry {
  key: string;
  sessionId: string;
  accountId: number;
  name: string;
  role: string;
  baseUrl: string;
  email: string;
}

// Every account of every stored installation, flattened for the account switcher.
export const selectSessionAccounts = createSelector([selectSessions], sessions =>
  sessions.flatMap(session =>
    (session.user.accounts ?? []).map(
      (account): SessionAccountEntry => ({
        key: `${session.id}/${account.id}`,
        sessionId: session.id,
        accountId: Number(account.id),
        name: account.name,
        role: account.role,
        baseUrl: session.baseUrl,
        email: session.user.email,
      }),
    ),
  ),
);
