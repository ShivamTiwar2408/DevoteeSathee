// Core types for DevoteeSathee app

export interface Profile {
  id: string;
  name: string;
  age: number;
  place: string;
  photo: string;
  profession: string;
  education: string;
  about: string;
  height?: string;
  motherTongue?: string;
  caste?: string;
  salary?: string;
  workingStatus?: 'Working' | 'Not Working' | 'Student';
  religion?: string;
  maritalStatus?: string;
}

export interface Match extends Profile {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export * from './chat';
