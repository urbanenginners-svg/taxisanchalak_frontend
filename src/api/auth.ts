import { api } from './client';
import type { ApiResponse, AuthPayload, User } from '../types';

export interface DriverRegisterInput {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  state: string;
  city: string;
  profilePic?: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  registerDriver: (data: DriverRegisterInput) =>
    api.post<ApiResponse<AuthPayload>>('/auth/driver/register', data),

  driverLogin: (data: LoginInput) =>
    api.post<ApiResponse<AuthPayload>>('/auth/driver/login', data),

  adminLogin: (data: LoginInput) =>
    api.post<ApiResponse<AuthPayload>>('/auth/admin/login', data),

  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};
