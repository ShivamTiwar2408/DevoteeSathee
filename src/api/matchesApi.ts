import { ApiResponse, Match } from '../types';
import { MATCHES_DATA } from './mockData';
import { logger } from '../utils/logger';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(500 + Math.random() * 1000);

export const matchesApi = {
  async getMatches(): Promise<ApiResponse<Match[]>> {
    const startTime = Date.now();
    await randomDelay();
    
    // Simulate occasional failures for testing error handling
    if (Math.random() < 0.1) {
      const error = 'Failed to fetch matches. Please try again.';
      logger.warn('matchesApi.getMatches failed (simulated)', { duration: Date.now() - startTime });
      throw new Error(error);
    }
    
    logger.debug('matchesApi.getMatches success', { 
      count: MATCHES_DATA.length, 
      duration: Date.now() - startTime 
    });
    
    return {
      success: true,
      data: MATCHES_DATA,
      total: MATCHES_DATA.length,
    };
  },

  async likeProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(300);
    logger.debug('matchesApi.likeProfile', { matchId });
    return {
      success: true,
      data: { matchId },
      message: 'Profile liked!',
    };
  },

  async unlikeProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(300);
    logger.debug('matchesApi.unlikeProfile', { matchId });
    return {
      success: true,
      data: { matchId },
      message: 'Like removed.',
    };
  },

  async sendInterest(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(500);
    logger.info('matchesApi.sendInterest', { matchId });
    return {
      success: true,
      data: { matchId },
      message: 'Interest sent successfully!',
    };
  },

  async skipProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(200);
    logger.debug('matchesApi.skipProfile', { matchId });
    return {
      success: true,
      data: { matchId },
    };
  },

  async shortlistProfile(matchId: string): Promise<ApiResponse<{ matchId: string }>> {
    await delay(300);
    logger.debug('matchesApi.shortlistProfile', { matchId });
    return {
      success: true,
      data: { matchId },
      message: 'Added to shortlist!',
    };
  },
};
