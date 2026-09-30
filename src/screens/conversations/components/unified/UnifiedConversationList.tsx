import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import i18n from '@/i18n';
import { tailwind } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Avatar } from '@/components-next/common/avatar';
import { useUnifiedConversations } from '@/hooks/useUnifiedConversations';
import type { UnifiedConversation } from '@/services/unifiedConversations';
import { openConversationInAccount } from '@/utils/sessionUtils';
import { selectSessionAccounts, selectUnifiedExcluded } from '@/store/sessions/sessionsSelectors';
import { toggleUnifiedAccount } from '@/store/sessions/sessionsSlice';
import { formatRelativeTime, formatTimeToShortForm } from '@/utils/dateTimeUtils';

const Row = ({ item, onPress }: { item: UnifiedConversation; onPress: () => void }) => {
  const { conversation, accountName } = item;
  const sender = conversation.meta?.sender;
  const name = sender?.name || `#${conversation.id}`;
  const preview = conversation.lastNonActivityMessage?.content || '';
  const time = conversation.lastActivityAt
    ? formatTimeToShortForm(formatRelativeTime(conversation.lastActivityAt))
    : '';

  return (
    <Pressable onPress={onPress} style={tailwind.style('flex-row px-4 py-3')}>
      <Avatar size="4xl" src={{ uri: sender?.thumbnail || undefined }} name={name} />
      <View style={tailwind.style('flex-1 ml-3 border-b-[1px] border-blackA-A3 pb-3')}>
        <View style={tailwind.style('flex-row items-center justify-between')}>
          <Text
            numberOfLines={1}
            style={tailwind.style('flex-1 text-base font-inter-medium-24 text-gray-950')}
          >
            {name} <Text style={tailwind.style('text-gray-700')}>{`#${conversation.id}`}</Text>
          </Text>
          <Text style={tailwind.style('ml-2 text-sm text-gray-700')}>{time}</Text>
        </View>
        <Text numberOfLines={2} style={tailwind.style('pt-1 text-sm text-gray-900')}>
          {preview}
        </Text>
        <View style={tailwind.style('flex-row items-center pt-1.5')}>
          <Text
            style={tailwind.style(
              'text-xs font-inter-medium-24 text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full overflow-hidden',
            )}
          >
            {accountName}
          </Text>
          {conversation.unreadCount > 0 && (
            <Text style={tailwind.style('ml-2 text-xs font-inter-medium-24 text-blue-800')}>
              {`● ${conversation.unreadCount}`}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

// One chip per account: tap to include or leave it out; the badge counts unread conversations.
const AccountChips = ({ unreadByAccount }: { unreadByAccount: Record<string, number> }) => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectSessionAccounts);
  const excluded = useAppSelector(selectUnifiedExcluded);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tailwind.style('px-4 py-2 gap-2')}
    >
      {accounts.map(account => {
        const included = !excluded.includes(account.key);
        const unread = unreadByAccount[account.key] ?? 0;
        return (
          <Pressable
            key={account.key}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: included }}
            onPress={() => dispatch(toggleUnifiedAccount(account.key))}
            style={tailwind.style(
              'flex-row items-center px-3 py-1.5 rounded-full border-[1px]',
              included ? 'bg-blue-100 border-blue-100' : 'border-blackA-A4',
            )}
          >
            <Text
              style={tailwind.style(
                'text-sm font-inter-medium-24',
                included ? 'text-blue-800' : 'text-gray-700',
              )}
            >
              {account.name}
            </Text>
            {included && unread > 0 && (
              <Text
                style={tailwind.style(
                  'ml-1.5 px-1.5 text-xs font-inter-semibold-20 rounded-full overflow-hidden bg-accent text-accent-contrast',
                )}
              >
                {unread}
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

// Conversations of every signed-in account in one list; opening one switches to its account.
export const UnifiedConversationList = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { conversations, failedAccounts, unreadByAccount, isLoading, isRefreshing, refresh } =
    useUnifiedConversations();
  const excluded = useAppSelector(selectUnifiedExcluded);
  const accounts = useAppSelector(selectSessionAccounts);
  const noneSelected = accounts.every(account => excluded.includes(account.key));

  const open = (item: UnifiedConversation) => {
    const pushHere = openConversationInAccount(
      dispatch,
      item.sessionId,
      item.accountId,
      item.conversation.id,
    );
    if (pushHere) {
      navigation.dispatch(
        StackActions.push('ChatScreen', { conversationId: item.conversation.id }),
      );
    }
  };

  if (isLoading) {
    return <ActivityIndicator style={tailwind.style('mt-10')} />;
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={item => item.key}
      renderItem={({ item }) => <Row item={item} onPress={() => open(item)} />}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      ListHeaderComponent={
        <>
          <AccountChips unreadByAccount={unreadByAccount} />
          {failedAccounts.length ? (
            <Text style={tailwind.style('px-4 py-2 text-sm text-ruby-900')}>
              {i18n.t('UNIFIED.FAILED', { accounts: failedAccounts.join(', ') })}
            </Text>
          ) : null}
        </>
      }
      ListEmptyComponent={
        <Text style={tailwind.style('mt-10 px-6 text-center text-gray-700')}>
          {i18n.t(noneSelected ? 'UNIFIED.NONE_SELECTED' : 'UNIFIED.EMPTY')}
        </Text>
      }
    />
  );
};
