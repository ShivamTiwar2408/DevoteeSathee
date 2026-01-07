import { ApiResponse, Profile } from '../types';
import { DEFAULT_USER_PROFILE } from './mockData';
import { logger } from '../utils/logger';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(500 + Math.random() * 1000);

export const profileApi = {
  async getUserProfile(): Promise<ApiResponse<Profile>> {
    const startTime = Date.now();
    await randomDelay();
    
    logger.debug('profileApi.getUserProfile', { 
      profileId: DEFAULT_USER_PROFILE.id, 
      duration: Date.now() - startTime 
    });
    
    return {
      success: true,
      data: DEFAULT_USER_PROFILE,
    };
  },

  async updateUserProfile(profileData: Profile): Promise<ApiResponse<Profile>> {
    const startTime = Date.now();
    await delay(800);
    
    // Validation
    if (!profileData.name || profileData.name.length < 2) {
      const error = 'Name must be at least 2 characters.';
      logger.warn('profileApi.updateUserProfile validation failed', { error });
      throw new Error(error);
    }
    
    if (!profileData.age || profileData.age < 18 || profileData.age > 100) {
      const error = 'Please enter a valid age (18-100).';
      logger.warn('profileApi.updateUserProfile validation failed', { error });
      throw new Error(error);
    }
    
    logger.info('profileApi.updateUserProfile success', { 
      profileId: profileData.id, 
      duration: Date.now() - startTime 
    });
    
    return {
      success: true,
      data: profileData,
      message: 'Profile updated successfully!',
    };
  },
};
