import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ScrollView } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import i18n from '@/i18n';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Sheet, type SheetRef } from '@/components-next/common/sheet/Sheet';
import { BottomSheetHeader } from '@/components-next/common/bottomsheet';
import { SwitchInstallationAccount } from '@/components-next/sheet-components/SwitchAccount';
import { selectCurrentUserAccountId } from '@/store/auth/authSelectors';
import { selectActiveSessionId, selectSessionAccounts } from '@/store/sessions/sessionsSelectors';
import { startAddingSession, switchToSessionAccount } from '@/utils/sessionUtils';
import { setUnifiedView } from '@/store/sessions/sessionsSlice';
import { selectUnifiedView } from '@/store/sessions/sessionsSelectors';

// Account list across every signed-in installation, plus "add installation". Shared by the
// Settings screen and the conversation list header.
export const AccountSwitcherSheet = forwardRef<SheetRef>((_, ref) => {
  const sheetRef = useRef<SheetRef>(null);
  useImperativeHandle(ref, () => ({
    present: index => sheetRef.current?.present(index),
    dismiss: () => sheetRef.current?.dismiss(),
    resize: index => sheetRef.current?.resize(index),
  }));

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const entries = useAppSelector(selectSessionAccounts);
  const activeSessionId = useAppSelector(selectActiveSessionId);
  const currentAccountId = useAppSelector(selectCurrentUserAccountId);
  const isUnifiedView = useAppSelector(selectUnifiedView);

  const onSelect = (sessionId: string, accountId: number) => {
    sheetRef.current?.dismiss();
    dispatch(setUnifiedView(false));
    const isSameInstallation = sessionId === activeSessionId;
    switchToSessionAccount(dispatch, sessionId, accountId);
    // Another installation remounts the whole logged-in stack (keyed by session).
    if (isSameInstallation) {
      navigation.dispatch(StackActions.replace('Tab'));
    }
  };

  const onAllAccounts = () => {
    sheetRef.current?.dismiss();
    dispatch(setUnifiedView(true));
  };

  const onAddInstallation = () => {
    sheetRef.current?.dismiss();
    startAddingSession(dispatch);
  };

  return (
    <Sheet ref={sheetRef} detents={[0.6]} scrollable>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BottomSheetHeader headerText={i18n.t('SETTINGS.SWITCH_ACCOUNT')} />
        <SwitchInstallationAccount
          entries={entries}
          activeSessionId={isUnifiedView ? null : activeSessionId}
          currentAccountId={currentAccountId}
          allAccountsLabel={i18n.t('UNIFIED.ALL_ACCOUNTS')}
          isAllAccountsSelected={isUnifiedView}
          onAllAccounts={onAllAccounts}
          onSelect={onSelect}
          onAddInstallation={onAddInstallation}
          addInstallationLabel={i18n.t('SETTINGS.ADD_INSTALLATION')}
        />
      </ScrollView>
    </Sheet>
  );
});

AccountSwitcherSheet.displayName = 'AccountSwitcherSheet';
