/**
 * Global store types
 */

import { Profile, Match, Message } from '../types';

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  isLoading: boolean;
}

// User Profile State
export interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

// Matches State
export interface MatchesState {
  items: Match[];
  isLoading: boolean;
  error: string | null;
  currentIndex: number;
}

// Conversations/Chat State
export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantPhoto: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  typingStatus: Record<string, boolean>; // conversationId -> isTyping
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

// Notifications/Inbox State
export interface InboxItem {
  id: string;
  type: 'interest' | 'accept' | 'view' | 'shortlist';
  fromUserId: string;
  fromUserName: string;
  fromUserPhoto: string;
  timestamp: string;
  isRead: boolean;
}

export interface InboxState {
  items: InboxItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

// UI State
export interface UIState {
  activeTab: 'home' | 'inbox' | 'chat' | 'profile';
  isDrawerOpen: boolean;
  currentScreen: 'splash' | 'welcome' | 'register' | 'login' | 'otp' | 'createPassword' | 'main' | 'chat';
  selectedMatchId: string | null;
  registrationEmail: string | null;
  resetToken: string | null;
  authToken: string | null;
}

// Root State
export interface RootState {
  auth: AuthState;
  user: UserState;
  matches: MatchesState;
  chat: ChatState;
  inbox: InboxState;
  ui: UIState;
}

// Action Types
export type ActionType =
  // Auth Actions
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: { userId: string } }
  | { type: 'AUTH_LOGIN_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  
  // User Actions
  | { type: 'USER_FETCH_START' }
  | { type: 'USER_FETCH_SUCCESS'; payload: Profile }
  | { type: 'USER_FETCH_FAILURE'; payload: string }
  | { type: 'USER_UPDATE_START' }
  | { type: 'USER_UPDATE_SUCCESS'; payload: Profile }
  | { type: 'USER_UPDATE_FAILURE'; payload: string }
  | { type: 'USER_CLEAR_ERROR' }
  
  // Matches Actions
  | { type: 'MATCHES_FETCH_START' }
  | { type: 'MATCHES_FETCH_SUCCESS'; payload: Match[] }
  | { type: 'MATCHES_FETCH_FAILURE'; payload: string }
  | { type: 'MATCHES_SET_INDEX'; payload: number }
  | { type: 'MATCHES_CLEAR_ERROR' }
  
  // Chat Actions
  | { type: 'CHAT_FETCH_CONVERSATIONS_START' }
  | { type: 'CHAT_FETCH_CONVERSATIONS_SUCCESS'; payload: Conversation[] }
  | { type: 'CHAT_FETCH_CONVERSATIONS_FAILURE'; payload: string }
  | { type: 'CHAT_SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'CHAT_FETCH_MESSAGES_START'; payload: string }
  | { type: 'CHAT_FETCH_MESSAGES_SUCCESS'; payload: { conversationId: string; messages: Message[] } }
  | { type: 'CHAT_SEND_MESSAGE_START' }
  | { type: 'CHAT_SEND_MESSAGE_SUCCESS'; payload: { conversationId: string; message: Message } }
  | { type: 'CHAT_SEND_MESSAGE_FAILURE'; payload: string }
  | { type: 'CHAT_ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'CHAT_SET_TYPING'; payload: { conversationId: string; isTyping: boolean } }
  | { type: 'CHAT_CLEAR_ERROR' }
  
  // Inbox Actions
  | { type: 'INBOX_FETCH_START' }
  | { type: 'INBOX_FETCH_SUCCESS'; payload: InboxItem[] }
  | { type: 'INBOX_FETCH_FAILURE'; payload: string }
  | { type: 'INBOX_MARK_READ'; payload: string }
  | { type: 'INBOX_MARK_ALL_READ' }
  
  // UI Actions
  | { type: 'UI_SET_TAB'; payload: UIState['activeTab'] }
  | { type: 'UI_SET_DRAWER'; payload: boolean }
  | { type: 'UI_SET_SCREEN'; payload: UIState['currentScreen'] }
  | { type: 'UI_SET_SELECTED_MATCH'; payload: string | null }
  | { type: 'UI_SET_REGISTRATION_EMAIL'; payload: string | null }
  | { type: 'UI_SET_RESET_TOKEN'; payload: string | null }
  | { type: 'UI_SET_AUTH_TOKEN'; payload: string | null };
