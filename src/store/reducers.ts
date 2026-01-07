/**
 * Reducers for global state management
 */

import {
  RootState,
  ActionType,
  AuthState,
  UserState,
  MatchesState,
  ChatState,
  InboxState,
  UIState,
} from './types';

// Initial States
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  userId: null,
  isLoading: false,
};

export const initialUserState: UserState = {
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const initialMatchesState: MatchesState = {
  items: [],
  isLoading: false,
  error: null,
  currentIndex: 0,
};

export const initialChatState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingStatus: {},
  isLoading: false,
  isSending: false,
  error: null,
};

export const initialInboxState: InboxState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const initialUIState: UIState = {
  activeTab: 'home',
  isDrawerOpen: false,
  currentScreen: 'splash',
  selectedMatchId: null,
  registrationEmail: null,
  resetToken: null,
  authToken: null,
};

export const initialState: RootState = {
  auth: initialAuthState,
  user: initialUserState,
  matches: initialMatchesState,
  chat: initialChatState,
  inbox: initialInboxState,
  ui: initialUIState,
};

// Individual Reducers
function authReducer(state: AuthState, action: ActionType): AuthState {
  switch (action.type) {
    case 'AUTH_LOGIN_START':
      return { ...state, isLoading: true };
    case 'AUTH_LOGIN_SUCCESS':
      return { ...state, isLoading: false, isAuthenticated: true, userId: action.payload.userId };
    case 'AUTH_LOGIN_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false };
    case 'AUTH_LOGOUT':
      return initialAuthState;
    default:
      return state;
  }
}

function userReducer(state: UserState, action: ActionType): UserState {
  switch (action.type) {
    case 'USER_FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'USER_FETCH_SUCCESS':
      return { ...state, isLoading: false, profile: action.payload, error: null };
    case 'USER_FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'USER_UPDATE_START':
      return { ...state, isSaving: true, error: null };
    case 'USER_UPDATE_SUCCESS':
      return { ...state, isSaving: false, profile: action.payload, error: null };
    case 'USER_UPDATE_FAILURE':
      return { ...state, isSaving: false, error: action.payload };
    case 'USER_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

function matchesReducer(state: MatchesState, action: ActionType): MatchesState {
  switch (action.type) {
    case 'MATCHES_FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'MATCHES_FETCH_SUCCESS':
      return { ...state, isLoading: false, items: action.payload, error: null };
    case 'MATCHES_FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'MATCHES_SET_INDEX':
      return { ...state, currentIndex: action.payload };
    case 'MATCHES_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

function chatReducer(state: ChatState, action: ActionType): ChatState {
  switch (action.type) {
    case 'CHAT_FETCH_CONVERSATIONS_START':
      return { ...state, isLoading: true, error: null };
    case 'CHAT_FETCH_CONVERSATIONS_SUCCESS':
      return { ...state, isLoading: false, conversations: action.payload };
    case 'CHAT_FETCH_CONVERSATIONS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'CHAT_SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.payload };
    case 'CHAT_FETCH_MESSAGES_START':
      return { ...state, isLoading: true };
    case 'CHAT_FETCH_MESSAGES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages,
        },
      };
    case 'CHAT_SEND_MESSAGE_START':
      return { ...state, isSending: true, error: null };
    case 'CHAT_SEND_MESSAGE_SUCCESS':
      return {
        ...state,
        isSending: false,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: [
            ...(state.messages[action.payload.conversationId] || []),
            action.payload.message,
          ],
        },
      };
    case 'CHAT_SEND_MESSAGE_FAILURE':
      return { ...state, isSending: false, error: action.payload };
    case 'CHAT_ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: [
            ...(state.messages[action.payload.conversationId] || []),
            action.payload.message,
          ],
        },
      };
    case 'CHAT_SET_TYPING':
      return {
        ...state,
        typingStatus: {
          ...state.typingStatus,
          [action.payload.conversationId]: action.payload.isTyping,
        },
      };
    case 'CHAT_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

function inboxReducer(state: InboxState, action: ActionType): InboxState {
  switch (action.type) {
    case 'INBOX_FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'INBOX_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        items: action.payload,
        unreadCount: action.payload.filter(item => !item.isRead).length,
      };
    case 'INBOX_FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'INBOX_MARK_READ':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload ? { ...item, isRead: true } : item
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'INBOX_MARK_ALL_READ':
      return {
        ...state,
        items: state.items.map(item => ({ ...item, isRead: true })),
        unreadCount: 0,
      };
    default:
      return state;
  }
}

function uiReducer(state: UIState, action: ActionType): UIState {
  switch (action.type) {
    case 'UI_SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'UI_SET_DRAWER':
      return { ...state, isDrawerOpen: action.payload };
    case 'UI_SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'UI_SET_SELECTED_MATCH':
      return { ...state, selectedMatchId: action.payload };
    case 'UI_SET_REGISTRATION_EMAIL':
      return { ...state, registrationEmail: action.payload };
    case 'UI_SET_RESET_TOKEN':
      return { ...state, resetToken: action.payload };
    case 'UI_SET_AUTH_TOKEN':
      return { ...state, authToken: action.payload };
    default:
      return state;
  }
}

// Root Reducer
export function rootReducer(state: RootState, action: ActionType): RootState {
  return {
    auth: authReducer(state.auth, action),
    user: userReducer(state.user, action),
    matches: matchesReducer(state.matches, action),
    chat: chatReducer(state.chat, action),
    inbox: inboxReducer(state.inbox, action),
    ui: uiReducer(state.ui, action),
  };
}
