// Core types for DevoteeSathee app

export interface Profile {
  id: string;
  // Basic Info
  name: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  photo: string;
  introVideo?: string;
  
  // Physical Attributes
  height?: number; // in cm
  weight?: number; // in kg
  bodyType?: 'Slim' | 'Average' | 'Athletic' | 'Heavy';
  complexion?: 'Fair' | 'Wheatish' | 'Dark';
  physicalStatus?: 'Normal' | 'Physically Challenged';
  
  // Location
  place: string;
  state?: string;
  country?: string;
  citizenship?: string;
  residencyStatus?: 'Citizen' | 'Permanent Resident' | 'Work Permit' | 'Student Visa';
  
  // Religious Background
  religion?: string;
  caste?: string;
  subCaste?: string;
  gothra?: string;
  star?: string;
  raasi?: string;
  dosham?: 'Yes' | 'No' | 'Don\'t Know';
  
  // Education & Career
  education: string;
  educationDetail?: string;
  profession: string;
  company?: string;
  workingStatus?: 'Working' | 'Not Working' | 'Student';
  salary?: number; // Annual in LPA
  
  // Family Details
  familyType?: 'Joint' | 'Nuclear';
  familyStatus?: 'Middle Class' | 'Upper Middle Class' | 'Rich' | 'Affluent';
  familyValues?: 'Orthodox' | 'Traditional' | 'Moderate' | 'Liberal';
  fatherOccupation?: string;
  motherOccupation?: string;
  siblings?: number;
  
  // Lifestyle
  diet?: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  smoking?: 'No' | 'Occasionally' | 'Yes';
  drinking?: 'No' | 'Occasionally' | 'Yes';
  
  // Personal
  maritalStatus?: string;
  motherTongue?: string;
  languages?: string[];
  hobbies?: string[];
  about: string;
}

export interface Match extends Profile {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

export * from './chat';
