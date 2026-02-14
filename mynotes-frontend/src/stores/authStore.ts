import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { authService } from '@/services/authService';

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userEmail', email); // ← EKLE
      set({ 
        token: response.token, 
        isAuthenticated: true,
        user: { email } as User,
      });
    } catch (error) {
      throw error;
    }
  },

  register: async (email: string, password: string, username: string) => {
    try {
      const response = await authService.register(email, password, username);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userEmail', email); // ← EKLE
      set({ 
        token: response.token, 
        isAuthenticated: true,
        user: { email, username } as User,
      });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    localStorage.removeItem('userEmail'); // ← EKLE
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
