export type UserRole = 'producer' | 'cooperative' | 'consultant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  acceptedTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}