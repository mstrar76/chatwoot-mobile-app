import type { AppDispatch } from '@/store';
import { getStore } from '@/store/storeAccessor';
import { switchAccount } from '@/utils/accountUtils';
import { beginAddSession, cancelAddSession, switchSession } from '@/store/sessions/sessionsSlice';

// Switches to an account that may live on another installation. Within the active
// installation this is the regular account switch.
export const switchToSessionAccount = (
  dispatch: AppDispatch,
  sessionId: string,
  accountId: number,
) => {
  const { activeId } = getStore().getState().sessions;
  if (sessionId === activeId) {
    switchAccount(dispatch, accountId);
    return;
  }
  dispatch(switchSession({ sessionId, accountId }));
};

export const startAddingSession = (dispatch: AppDispatch) => dispatch(beginAddSession());

export const cancelAddingSession = (dispatch: AppDispatch) => dispatch(cancelAddSession());
