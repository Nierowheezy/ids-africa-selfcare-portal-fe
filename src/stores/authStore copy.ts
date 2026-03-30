// src/stores/authStore.ts
import { create } from "zustand";
import { authService } from "@/services/authService";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (accountNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forceLogout: () => void; // ← new: instant clear for 401
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (accountNumber: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(accountNumber, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.message || "Login failed. Please try again.";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout(); // calls /logout endpoint to clear server cookies
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      // Even if /logout fails, still clear local state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // New: instant clear for 401 cases (no async, no await)
  forceLogout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.fetchCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch {
      // On checkAuth fail (e.g. 401), force clear
      get().forceLogout();
    }
  },

  clearError: () => set({ error: null }),
}));
