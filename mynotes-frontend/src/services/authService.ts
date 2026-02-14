import apiClient from '@/utils/apiClient';
import { AuthRequest, AuthResponse } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    } as AuthRequest);
    return response.data;
  },

  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      username,
    } as AuthRequest);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },
};
