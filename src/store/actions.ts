/**
 * Action creators and async thunks
 * These provide a clean API for dispatching actions with side effects
 */

import { Dispatch } from 'react';
import { ActionType } from './types';
import { Profile, Match } from '../types';
import { profileApi, matchesApi, chatApi } from '../api';
import { logger } from '../utils/logger';

// User Actions
export const userActions = {
  fetchProfile: () => async (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'USER_FETCH_START' });
    try {
      const response = await profileApi.getUserProfile();
      dispatch({ type: 'USER_FETCH_SUCCESS', payload: response.data });
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      logger.error('userActions.fetchProfile failed', { error: message });
      dispatch({ type: 'USER_FETCH_FAILURE', payload: message });
      throw err;
    }
  },

  updateProfile: (profile: Profile) => async (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'USER_UPDATE_START' });
    try {
      const response = await profileApi.updateUserProfile(profile);
      dispatch({ type: 'USER_UPDATE_SUCCESS', payload: response.data });
      logger.info('Profile updated successfully', { profileId: profile.id });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      logger.error('userActions.updateProfile failed', { error: message });
      dispatch({ type: 'USER_UPDATE_FAILURE', payload: message });
      return false;
    }
  },

  clearError: () => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'USER_CLEAR_ERROR' });
  },
};

// Matches Actions
export const matchesActions = {
  fetchMatches: () => async (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'MATCHES_FETCH_START' });
    try {
      const response = await matchesApi.getMatches();
      dispatch({ type: 'MATCHES_FETCH_SUCCESS', payload: response.data });
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch matches';
      logger.error('matchesActions.fetchMatches failed', { error: message });
      dispatch({ type: 'MATCHES_FETCH_FAILURE', payload: message });
      throw err;
    }
  },

  setCurrentIndex: (index: number) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'MATCHES_SET_INDEX', payload: index });
  },

  sendInterest: (matchId: string) => async (dispatch: Dispatch<ActionType>) => {
    try {
      await matchesApi.sendInterest(matchId);
      logger.info('Interest sent', { matchId });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send interest';
      logger.error('matchesActions.sendInterest failed', { matchId, error: message });
      return false;
    }
  },

  clearError: () => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'MATCHES_CLEAR_ERROR' });
  },
};

// Chat Actions
export const chatActions = {
  setActiveConversation: (conversationId: string | null) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'CHAT_SET_ACTIVE_CONVERSATION', payload: conversationId });
  },

  fetchMessages: (conversationId: string) => async (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'CHAT_FETCH_MESSAGES_START', payload: conversationId });
    try {
      const response = await chatApi.getMessages(conversationId);
      dispatch({
        type: 'CHAT_FETCH_MESSAGES_SUCCESS',
        payload: { conversationId, messages: response.data },
      });
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch messages';
      logger.error('chatActions.fetchMessages failed', { conversationId, error: message });
      dispatch({ type: 'CHAT_SEND_MESSAGE_FAILURE', payload: message });
      throw err;
    }
  },

  sendMessage: (conversationId: string, text: string, senderId: string) => async (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'CHAT_SEND_MESSAGE_START' });
    try {
      const response = await chatApi.sendMessage(conversationId, text, senderId);
      dispatch({
        type: 'CHAT_SEND_MESSAGE_SUCCESS',
        payload: { conversationId, message: response.data },
      });
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      logger.error('chatActions.sendMessage failed', { conversationId, error: message });
      dispatch({ type: 'CHAT_SEND_MESSAGE_FAILURE', payload: message });
      throw err;
    }
  },

  addMessage: (conversationId: string, message: any) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'CHAT_ADD_MESSAGE', payload: { conversationId, message } });
  },

  clearError: () => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'CHAT_CLEAR_ERROR' });
  },
};

// Inbox Actions
export const inboxActions = {
  markAsRead: (itemId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'INBOX_MARK_READ', payload: itemId });
  },

  markAllAsRead: () => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'INBOX_MARK_ALL_READ' });
  },
};

// UI Actions
export const uiActions = {
  setTab: (tab: 'home' | 'inbox' | 'chat' | 'profile') => (dispatch: Dispatch<ActionType>) => {
    logger.debug('Tab changed', { tab });
    dispatch({ type: 'UI_SET_TAB', payload: tab });
  },

  setDrawer: (isOpen: boolean) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'UI_SET_DRAWER', payload: isOpen });
  },

  setScreen: (screen: 'splash' | 'welcome' | 'register' | 'login' | 'otp' | 'createPassword' | 'main' | 'chat') => (dispatch: Dispatch<ActionType>) => {
    logger.debug('Screen changed', { screen });
    dispatch({ type: 'UI_SET_SCREEN', payload: screen });
  },

  setRegistrationEmail: (email: string | null) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'UI_SET_REGISTRATION_EMAIL', payload: email });
  },

  setResetToken: (token: string | null) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'UI_SET_RESET_TOKEN', payload: token });
  },

  setAuthToken: (token: string | null) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'UI_SET_AUTH_TOKEN', payload: token });
  },

  setSelectedMatch: (matchId: string | null) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'UI_SET_SELECTED_MATCH', payload: matchId });
  },

  openChat: (matchId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'UI_SET_SELECTED_MATCH', payload: matchId });
    dispatch({ type: 'UI_SET_SCREEN', payload: 'chat' });
  },

  closeChat: () => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'UI_SET_SELECTED_MATCH', payload: null });
    dispatch({ type: 'UI_SET_SCREEN', payload: 'main' });
  },
};

// Auth Actions
export const authActions = {
  login: (userId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'AUTH_LOGIN_START' });
    // Simulate login - in production this would call an auth API
    dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: { userId } });
    logger.info('User logged in', { userId });
  },

  logout: () => (dispatch: Dispatch<ActionType>) => {
    dispatch({ type: 'AUTH_LOGOUT' });
    logger.info('User logged out');
  },
};
