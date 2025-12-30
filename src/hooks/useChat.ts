import { useState, useCallback, useRef } from 'react';
import { Message, ChatState } from '../types';
import { chatApi } from '../api';

const CURRENT_USER_ID = 'user1'; // In production, get from auth context

interface UseChatOptions {
  conversationId: string;
  participantId: string;
}

export function useChat({ conversationId, participantId }: UseChatOptions) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isSending: false,
    error: null,
  });
  const [isTyping, setIsTyping] = useState(false);
  const autoResponseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadMessages = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await chatApi.getMessages(conversationId);
      setState(prev => ({
        ...prev,
        messages: response.data,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setState(prev => ({ ...prev, isSending: true }));

    try {
      // Send user message
      const response = await chatApi.sendMessage(conversationId, text.trim(), CURRENT_USER_ID);
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, response.data],
        isSending: false,
      }));

      // Clear any pending auto-response
      if (autoResponseTimeoutRef.current) {
        clearTimeout(autoResponseTimeoutRef.current);
      }

      // Trigger auto-response after a short delay
      setIsTyping(true);
      
      autoResponseTimeoutRef.current = setTimeout(async () => {
        try {
          const autoResponse = await chatApi.getAutoResponse(conversationId, participantId);
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, autoResponse.data],
          }));
        } catch (err) {
          // Silently fail for auto-response
          console.warn('Auto-response failed:', err);
        } finally {
          setIsTyping(false);
        }
      }, 500);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setState(prev => ({ ...prev, isSending: false, error: message }));
    }
  }, [conversationId, participantId]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    isTyping,
    currentUserId: CURRENT_USER_ID,
    loadMessages,
    sendMessage,
    clearError,
  };
}
