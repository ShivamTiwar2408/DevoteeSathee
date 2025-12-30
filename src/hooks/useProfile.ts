import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Profile, UserState } from '../types';
import { profileApi } from '../api';

export function useProfile() {
  const [state, setState] = useState<UserState>({
    profile: null,
    isLoading: true,
    error: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await profileApi.getUserProfile();
      setState({
        profile: response.data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Profile): Promise<boolean> => {
    setIsSaving(true);
    try {
      const response = await profileApi.updateUserProfile(profileData);
      setState(prev => ({
        ...prev,
        profile: response.data,
      }));
      Alert.alert('Success', response.message || 'Profile updated!');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      Alert.alert('Error', message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    ...state,
    isSaving,
    updateProfile,
    refetch: fetchProfile,
  };
}
