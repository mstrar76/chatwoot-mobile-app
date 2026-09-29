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

// A conversation to open once the app has switched to the installation that owns it; the
// logged-in stack remounts on an installation switch, so the tabs pick this up on mount.
let pendingConversationId: number | null = null;

export const takePendingConversation = () => {
  const conversationId = pendingConversationId;
  pendingConversationId = null;
  return conversationId;
};

// Opens a conversation from the unified list. Returns true when the caller should push
// the chat screen itself (same installation); otherwise the switch remounts the tabs and
// they open it from the pending slot.
export const openConversationInAccount = (
  dispatch: AppDispatch,
  sessionId: string,
  accountId: number,
  conversationId: number,
): boolean => {
  const { sessions, auth } = getStore().getState();
  if (sessionId === sessions.activeId) {
    if (Number(auth.user?.account_id) !== accountId) {
      switchAccount(dispatch, accountId);
    }
    return true;
  }
  pendingConversationId = conversationId;
  dispatch(switchSession({ sessionId, accountId }));
  return false;
};
