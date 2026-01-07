/**
 * Global Store Context
 * Provides Redux-like state management using React Context + useReducer
 */

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { RootState, ActionType } from './types';
import { rootReducer, initialState } from './reducers';
import { logger } from '../utils/logger';

// Context Types
interface StoreContextType {
  state: RootState;
  dispatch: React.Dispatch<ActionType>;
}

// Create Context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Logging middleware for debugging
function loggingMiddleware(
  reducer: typeof rootReducer
): typeof rootReducer {
  return (state: RootState, action: ActionType): RootState => {
    const startTime = performance.now();
    const newState = reducer(state, action);
    const duration = performance.now() - startTime;
    
    // Log in development
    if (__DEV__) {
      logger.debug(`Action: ${action.type}`, {
        duration: `${duration.toFixed(2)}ms`,
        payload: 'payload' in action ? action.payload : undefined,
      });
    }
    
    return newState;
  };
}

// Provider Props
interface StoreProviderProps {
  children: ReactNode;
  initialStateOverride?: Partial<RootState>;
}

// Store Provider Component
export function StoreProvider({ children, initialStateOverride }: StoreProviderProps) {
  const mergedInitialState = useMemo(() => ({
    ...initialState,
    ...initialStateOverride,
  }), [initialStateOverride]);

  const enhancedReducer = useMemo(() => loggingMiddleware(rootReducer), []);
  
  const [state, dispatch] = useReducer(enhancedReducer, mergedInitialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to use the store
export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

// Selector hooks for specific state slices (prevents unnecessary re-renders)
export function useAuth() {
  const { state, dispatch } = useStore();
  return { auth: state.auth, dispatch };
}

export function useUser() {
  const { state, dispatch } = useStore();
  return { user: state.user, dispatch };
}

export function useMatchesStore() {
  const { state, dispatch } = useStore();
  return { matches: state.matches, dispatch };
}

export function useChatStore() {
  const { state, dispatch } = useStore();
  return { chat: state.chat, dispatch };
}

export function useInbox() {
  const { state, dispatch } = useStore();
  return { inbox: state.inbox, dispatch };
}

export function useUI() {
  const { state, dispatch } = useStore();
  return { ui: state.ui, dispatch };
}
