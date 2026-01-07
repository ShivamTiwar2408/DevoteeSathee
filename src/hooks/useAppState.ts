/**
 * Custom hooks that wrap the global store for easier component usage
 * These provide a cleaner API and handle common patterns
 */

import { useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { 
  useUser, 
  useMatchesStore, 
  useChatStore, 
  useInbox, 
  useUI,
  userActions,
  matchesActions,
  chatActions,
  uiActions,
} from '../store';
import { Profile, Match, Message } from '../types';
import { chatApi } from '../api';
import { logger } from '../utils/logger';

/**
 * Hook for user profile management
 */
export function useAppProfile() {
  const { user, dispatch } = useUser();

  const fetchProfile = useCallback(() => {
    return userActions.fetchProfile()(dispatch);
  }, [dispatch]);

  const updateProfile = useCallback(async (profile: Profile): Promise<boolean> => {
    const success = await userActions.updateProfile(profile)(dispatch);
    if (success) {
      Alert.alert('Success', 'Profile updated!');
    }
    return success;
  }, [dispatch]);

  const clearError = useCallback(() => {
    userActions.clearError()(dispatch);
  }, [dispatch]);

  return {
    profile: user.profile,
    isLoading: user.isLoading,
    isSaving: user.isSaving,
    error: user.error,
    fetchProfile,
    updateProfile,
    clearError,
  };
}

/**
 * Hook for matches management
 */
export function useAppMatches() {
  const { matches, dispatch } = useMatchesStore();

  const fetchMatches = useCallback(() => {
    return matchesActions.fetchMatches()(dispatch);
  }, [dispatch]);

  const setCurrentIndex = useCallback((index: number) => {
    matchesActions.setCurrentIndex(index)(dispatch);
  }, [dispatch]);

  const sendInterest = useCallback(async (matchId: string, matchName: string) => {
    const success = await matchesActions.sendInterest(matchId)(dispatch);
    if (success) {
      Alert.alert(
        'Request Sent! 💕',
        `Your connection request has been sent to ${matchName}.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', 'Failed to send request. Please try again.');
    }
    return success;
  }, [dispatch]);

  const clearError = useCallback(() => {
    matchesActions.clearError()(dispatch);
  }, [dispatch]);

  return {
    matches: matches.items,
    isLoading: matches.isLoading,
    error: matches.error,
    currentIndex: matches.currentIndex,
    fetchMatches,
    setCurrentIndex,
    sendInterest,
    clearError,
  };
}

/**
 * Hook for chat functionality with auto-response support
 */
export function useAppChat(conversationId: string, participantId: string) {
  const { chat, dispatch } = useChatStore();
  const isMountedRef = useRef(true);
  const autoResponseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUserId = 'user1'; // TODO: Get from auth state
  const messages = chat.messages[conversationId] || [];
  const isTyping = chat.typingStatus[conversationId] || false;

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (autoResponseTimeoutRef.current) {
        clearTimeout(autoResponseTimeoutRef.current);
      }
    };
  }, []);

  const fetchMessages = useCallback(() => {
    return chatActions.fetchMessages(conversationId)(dispatch);
  }, [conversationId, dispatch]);

  const setTyping = useCallback((typing: boolean) => {
    dispatch({ type: 'CHAT_SET_TYPING', payload: { conversationId, isTyping: typing } });
  }, [conversationId, dispatch]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    try {
      const message = await chatActions.sendMessage(conversationId, text.trim(), currentUserId)(dispatch);
      
      // Clear any pending auto-response
      if (autoResponseTimeoutRef.current) {
        clearTimeout(autoResponseTimeoutRef.current);
      }

      // Set typing indicator
      setTyping(true);

      // Trigger auto-response
      autoResponseTimeoutRef.current = setTimeout(async () => {
        try {
          const autoResponse = await chatApi.getAutoResponse(conversationId, participantId);
          if (isMountedRef.current) {
            chatActions.addMessage(conversationId, autoResponse.data)(dispatch);
          }
        } catch (err) {
          logger.warn('Auto-response failed', { conversationId });
        } finally {
          if (isMountedRef.current) {
            setTyping(false);
          }
        }
      }, 500);

      return message;
    } catch (err) {
      logger.error('Failed to send message', { conversationId });
      throw err;
    }
  }, [conversationId, participantId, dispatch, setTyping]);

  const clearError = useCallback(() => {
    chatActions.clearError()(dispatch);
  }, [dispatch]);

  return {
    messages,
    isLoading: chat.isLoading,
    isSending: chat.isSending,
    isTyping,
    error: chat.error,
    currentUserId,
    fetchMessages,
    sendMessage,
    clearError,
  };
}

/**
 * Hook for inbox/notifications
 */
export function useAppInbox() {
  const { inbox, dispatch } = useInbox();

  const markAsRead = useCallback((itemId: string) => {
    dispatch({ type: 'INBOX_MARK_READ', payload: itemId });
  }, [dispatch]);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'INBOX_MARK_ALL_READ' });
  }, [dispatch]);

  return {
    items: inbox.items,
    unreadCount: inbox.unreadCount,
    isLoading: inbox.isLoading,
    error: inbox.error,
    markAsRead,
    markAllAsRead,
  };
}

/**
 * Hook for UI state management
 */
export function useAppUI() {
  const { ui, dispatch } = useUI();

  const setTab = useCallback((tab: 'home' | 'inbox' | 'chat' | 'profile') => {
    uiActions.setTab(tab)(dispatch);
  }, [dispatch]);

  const setDrawer = useCallback((isOpen: boolean) => {
    uiActions.setDrawer(isOpen)(dispatch);
  }, [dispatch]);

  const openChat = useCallback((matchId: string) => {
    uiActions.openChat(matchId)(dispatch);
  }, [dispatch]);

  const closeChat = useCallback(() => {
    uiActions.closeChat()(dispatch);
  }, [dispatch]);

  return {
    activeTab: ui.activeTab,
    isDrawerOpen: ui.isDrawerOpen,
    currentScreen: ui.currentScreen,
    selectedMatchId: ui.selectedMatchId,
    setTab,
    setDrawer,
    openChat,
    closeChat,
  };
}
