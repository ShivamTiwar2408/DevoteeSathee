import { logger } from '../utils/logger';

const API_BASE = 'https://devoteesaathi-dev.connecttokrishna.com/api';

export interface RegistrationData {
  profileIsFor: 'Self' | 'Son' | 'Daughter' | 'Brother' | 'Sister' | 'Friend';
  gender: 'Male' | 'Female';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  religionId: number;
  community: string;
  email: string;
  country: string;
  mobileNumber: string;
  cityId: number;
  subCommunity: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  termsAgreed: boolean;
}

export interface RegistrationResponse {
  message: string;
  data?: {
    id: number;
    registrationID: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  errors?: string[];
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresInMinutes?: number;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface LoginResponse {
  token: string;
  userId: string;
  accountId: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CurrentUserResponse {
  userId: string;
  email: string;
  name: string;
  accountId: number;
}

export const authApi = {
  async register(data: RegistrationData): Promise<RegistrationResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE}/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      logger.debug('authApi.register', { 
        status: response.status,
        duration: Date.now() - startTime,
      });

      if (!response.ok) {
        throw new Error(result.errors?.[0] || result.message || 'Registration failed');
      }

      return result;
    } catch (error) {
      logger.error('authApi.register failed', { error });
      throw error;
    }
  },

  async sendRegistrationOTP(email: string): Promise<SendOTPResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE}/auth/send-registration-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      logger.debug('authApi.sendRegistrationOTP', { 
        status: response.status,
        duration: Date.now() - startTime,
      });

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send OTP');
      }

      return result;
    } catch (error) {
      logger.error('authApi.sendRegistrationOTP failed', { error });
      throw error;
    }
  },

  async verifyRegistrationOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
    const startTime = Date.now();
    
    logger.debug('authApi.verifyRegistrationOTP request', { email, otp });
    
    try {
      const response = await fetch(`${API_BASE}/auth/verify-registration-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();
      
      logger.debug('authApi.verifyRegistrationOTP response', { 
        status: response.status,
        duration: Date.now() - startTime,
        result,
      });

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid or expired OTP');
      }

      return result;
    } catch (error) {
      logger.error('authApi.verifyRegistrationOTP failed', { error });
      throw error;
    }
  },

  async setPassword(email: string, resetToken: string, newPassword: string): Promise<SetPasswordResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE}/auth/registration-set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetToken, newPassword }),
      });

      const result = await response.json();
      
      logger.debug('authApi.setPassword', { 
        status: response.status,
        duration: Date.now() - startTime,
      });

      if (!response.ok || !result.success) {
        throw new Error(result.errors?.[0] || result.message || 'Failed to set password');
      }

      return result;
    } catch (error) {
      logger.error('authApi.setPassword failed', { error });
      throw error;
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      logger.debug('authApi.login', { 
        status: response.status,
        duration: Date.now() - startTime,
      });

      if (!response.ok) {
        throw new Error(result.message || 'Invalid email or password');
      }

      return result;
    } catch (error) {
      logger.error('authApi.login failed', { error });
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<CurrentUserResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      logger.debug('authApi.getCurrentUser', { 
        status: response.status,
        duration: Date.now() - startTime,
      });

      if (!response.ok) {
        throw new Error(result.message || 'Unauthorized');
      }

      return result;
    } catch (error) {
      logger.error('authApi.getCurrentUser failed', { error });
      throw error;
    }
  },
};
