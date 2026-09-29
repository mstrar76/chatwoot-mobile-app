import React from 'react';
import { Pressable, Text, Animated, View } from 'react-native';

import { TickIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { useHaptic } from '@/utils';
import { Icon } from '@/components-next/common/icon';
import { Account } from '@/types';

type AccountCellProps = {
  item: Account;
  index: number;
  currentAccountId: number | undefined;
  changeAccount: (accountId: number) => void;
  isLastItem: boolean;
  isSelected?: boolean;
  caption?: string;
};

const AccountCell = ({
  item,
  index,
  currentAccountId,
  changeAccount,
  isLastItem,
  isSelected: isSelectedProp,
  caption,
}: AccountCellProps) => {
  const hapticSelection = useHaptic();

  const handlePress = () => {
    hapticSelection?.();
    changeAccount(item.id);
  };

  const isSelected = isSelectedProp ?? item.id === currentAccountId;

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={tailwind.style('flex flex-row items-center')}>
        <Animated.View
          style={tailwind.style(
            'flex-1 ml-3 flex-row justify-between py-[11px] pr-3',
            !isLastItem && 'border-b-[1px] border-blackA-A3',
          )}>
          <View>
            <Text
              style={tailwind.style(
                'text-base capitalize text-gray-950 font-inter-420-20 leading-[21px] tracking-[0.16px]',
              )}>
              {item.name}
            </Text>
            <Text
              style={tailwind.style(
                'text-sm text-gray-900 font-inter-420-20 leading-[18px] tracking-[0.16px] capitalize',
              )}>
              {item.role}
            </Text>
            {!!caption && (
              <Text
                style={tailwind.style(
                  'text-xs text-gray-700 font-inter-420-20 leading-[16px] tracking-[0.16px]',
                )}>
                {caption}
              </Text>
            )}
          </View>
          {isSelected && <Icon icon={<TickIcon />} size={20} />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export const SwitchAccount = ({
  currentAccountId,
  changeAccount,
  accounts,
}: {
  currentAccountId: number | undefined;
  changeAccount: (accountId: number) => void;
  accounts: Account[];
}) => (
  <Animated.View style={tailwind.style('py-1 pl-3')}>
    {accounts.map((item, index) => (
      <AccountCell
        key={item.name}
        item={item}
        index={index}
        currentAccountId={currentAccountId}
        changeAccount={changeAccount}
        isLastItem={index === accounts.length - 1}
      />
    ))}
  </Animated.View>
);

export type InstallationAccount = {
  key: string;
  sessionId: string;
  accountId: number;
  name: string;
  role: string;
  baseUrl: string;
  email: string;
};

// Accounts across every installation the user is signed in to, plus "add installation".
export const SwitchInstallationAccount = ({
  entries,
  activeSessionId,
  currentAccountId,
  onSelect,
  onAddInstallation,
  addInstallationLabel,
  allAccountsLabel,
  isAllAccountsSelected,
  onAllAccounts,
}: {
  entries: InstallationAccount[];
  activeSessionId: string | null;
  currentAccountId: number | undefined;
  onSelect: (sessionId: string, accountId: number) => void;
  onAddInstallation: () => void;
  addInstallationLabel: string;
  allAccountsLabel?: string;
  isAllAccountsSelected?: boolean;
  onAllAccounts?: () => void;
}) => {
  const hapticSelection = useHaptic();
  return (
    <Animated.View style={tailwind.style('py-1 pl-3')}>
      {!!onAllAccounts && entries.length > 1 && (
        <AccountCell
          item={{ id: -1, name: allAccountsLabel, role: '' } as unknown as Account}
          index={-1}
          currentAccountId={undefined}
          isSelected={!!isAllAccountsSelected}
          changeAccount={() => onAllAccounts()}
          isLastItem={false}
        />
      )}
      {entries.map((entry, index) => (
        <AccountCell
          key={entry.key}
          item={{ id: entry.accountId, name: entry.name, role: entry.role } as Account}
          index={index}
          currentAccountId={currentAccountId}
          isSelected={
            entry.sessionId === activeSessionId && entry.accountId === Number(currentAccountId)
          }
          caption={`${entry.baseUrl} · ${entry.email}`}
          changeAccount={accountId => onSelect(entry.sessionId, accountId)}
          isLastItem={false}
        />
      ))}
      <Pressable
        onPress={() => {
          hapticSelection?.();
          onAddInstallation();
        }}>
        <View style={tailwind.style('ml-3 py-[11px] pr-3')}>
          <Text
            style={tailwind.style(
              'text-base text-blue-800 font-inter-medium-24 leading-[21px] tracking-[0.16px]',
            )}>
            {addInstallationLabel}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};
