import axios from 'axios';
import type { Conversation } from '@/types';
import type { StoredSession } from '@/store/sessions/sessionsSlice';
import type { FilterState } from '@/store/conversation/conversationFilterSlice';
import type { ConversationListAPIResponse } from '@/store/conversation/conversationTypes';
import { transformConversation } from '@/utils/camelCaseKeys';

export interface UnifiedConversation {
  key: string;
  sessionId: string;
  accountId: number;
  accountName: string;
  conversation: Conversation;
}

export interface UnifiedFetchResult {
  conversations: UnifiedConversation[];
  // Accounts whose request failed (offline server, expired token...), by name.
  failedAccounts: string[];
  // Conversations with unread messages among the loaded ones, by `sessionId/accountId`.
  unreadByAccount: Record<string, number>;
}

// Talks to each installation directly with its own credentials, so the unified list does not
// depend on (or disturb) the active session used by the rest of the app.
const fetchAccountConversations = async (
  session: StoredSession,
  accountId: number,
  filters: FilterState,
): Promise<Conversation[]> => {
  const response = await axios.get<ConversationListAPIResponse>(
    `${session.installationUrl}api/v1/accounts/${accountId}/conversations`,
    {
      timeout: 15000,
      headers: {
        'access-token': session.headers['access-token'],
        uid: session.headers.uid,
        client: session.headers.client,
      },
      params: {
        assignee_type: filters.assignee_type,
        status: filters.status,
        sort_by: filters.sort_by,
        page: 1,
      },
    },
  );
  return (response.data.data.payload ?? []).map(transformConversation);
};

export const fetchUnifiedConversations = async (
  sessions: StoredSession[],
  filters: FilterState,
  excludedAccounts: string[] = [],
): Promise<UnifiedFetchResult> => {
  const targets = sessions
    .flatMap(session =>
      (session.user.accounts ?? []).map(account => ({
        session,
        accountId: Number(account.id),
        accountName: account.name,
      })),
    )
    .filter(({ session, accountId }) => !excludedAccounts.includes(`${session.id}/${accountId}`));

  const results = await Promise.allSettled(
    targets.map(({ session, accountId }) => fetchAccountConversations(session, accountId, filters)),
  );

  const conversations: UnifiedConversation[] = [];
  const failedAccounts: string[] = [];
  const unreadByAccount: Record<string, number> = {};
  results.forEach((result, index) => {
    const { session, accountId, accountName } = targets[index];
    if (result.status === 'rejected') {
      failedAccounts.push(accountName);
      return;
    }
    unreadByAccount[`${session.id}/${accountId}`] = result.value.filter(
      conversation => conversation.unreadCount > 0,
    ).length;
    result.value.forEach(conversation => {
      conversations.push({
        key: `${session.id}/${accountId}/${conversation.id}`,
        sessionId: session.id,
        accountId,
        accountName,
        conversation,
      });
    });
  });

  conversations.sort(
    (a, b) => (b.conversation.lastActivityAt ?? 0) - (a.conversation.lastActivityAt ?? 0),
  );
  return { conversations, failedAccounts, unreadByAccount };
};
