import { ApiResponse, Profile } from '../types';
import { DEFAULT_USER_PROFILE } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(500 + Math.random() * 1000);

export const profileApi = {
  async getUserProfile(): Promise<ApiResponse<Profile>> {
    await randomDelay();
    return {
      success: true,
      data: DEFAULT_USER_PROFILE,
    };
  },

  async updateUserProfile(profileData: Profile): Promise<ApiResponse<Profile>> {
    await delay(800);
    
    if (!profileData.name || profileData.name.length < 2) {
      throw new Error('Name must be at least 2 characters.');
    }
    
    if (!profileData.age || profileData.age < 18 || profileData.age > 100) {
      throw new Error('Please enter a valid age (18-100).');
    }
    
    return {
      success: true,
      data: profileData,
      message: 'Profile updated successfully!',
    };
  },
};
