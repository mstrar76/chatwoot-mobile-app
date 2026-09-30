import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { useAppSelector } from '@/hooks';
import { selectSessions, selectUnifiedExcluded } from '@/store/sessions/sessionsSelectors';
import { selectFilters } from '@/store/conversation/conversationFilterSlice';
import {
  fetchUnifiedConversations,
  type UnifiedConversation,
} from '@/services/unifiedConversations';

const REFRESH_INTERVAL_MS = 30_000;

// Conversations from every signed-in account, refreshed every 30s while the screen is focused.
export const useUnifiedConversations = () => {
  const sessions = useAppSelector(selectSessions);
  const filters = useAppSelector(selectFilters);
  const excludedAccounts = useAppSelector(selectUnifiedExcluded);
  const isFocused = useIsFocused();

  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [failedAccounts, setFailedAccounts] = useState<string[]>([]);
  const [unreadByAccount, setUnreadByAccount] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(
    async (manual = false) => {
      const id = ++requestId.current;
      if (manual) {
        setIsRefreshing(true);
      }
      const result = await fetchUnifiedConversations(sessions, filters, excludedAccounts);
      // Ignore a slower, older request that finished after a newer one.
      if (id !== requestId.current) {
        return;
      }
      setConversations(result.conversations);
      setFailedAccounts(result.failedAccounts);
      setUnreadByAccount(result.unreadByAccount);
      setIsLoading(false);
      setIsRefreshing(false);
    },
    [sessions, filters, excludedAccounts],
  );

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    load();
    const timer = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isFocused, load]);

  return {
    conversations,
    failedAccounts,
    unreadByAccount,
    isLoading,
    isRefreshing,
    refresh: () => load(true),
  };
};
