import { ApiResponse, Match } from '../types';
import { MATCHES_DATA } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(500 + Math.random() * 1000);

export const matchesApi = {
  async getMatches(): Promise<ApiResponse<Match[]>> {
    await randomDelay();
    
    if (Math.random() < 0.1) {
      throw new Error('Failed to fetch matches. Please try again.');
    }
    
    return {
      success: true,
      data: MATCHES_DATA,
      total: MATCHES_DATA.length,
    };
  },

  async likeProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(300);
    return {
      success: true,
      data: { matchId },
      message: 'Profile liked!',
    };
  },

  async unlikeProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(300);
    return {
      success: true,
      data: { matchId },
      message: 'Like removed.',
    };
  },

  async sendInterest(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(500);
    return {
      success: true,
      data: { matchId },
      message: 'Interest sent successfully!',
    };
  },

  async skipProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(200);
    return {
      success: true,
      data: { matchId },
    };
  },

  async shortlistProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(300);
    return {
      success: true,
      data: { matchId },
      message: 'Added to shortlist!',
    };
  },
};
