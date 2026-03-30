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
  forceLogout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (accountNumber: string, password: string) => {
    console.log(
      "🔵 [Store.login] Starting login for account:",
      accountNumber.trim(),
    );
    set({ isLoading: true, error: null });

    try {
      const user = await authService.login(accountNumber, password);

      console.log("✅ [Store.login] SUCCESS - User authenticated");
      console.log("✅ [Store.login] User name:", user?.name);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log("✅ [Store.login] Final state after login:", {
        isAuthenticated: true,
        hasUser: !!user,
        userName: user?.name,
      });
    } catch (err: any) {
      const message = err.message || "Login failed. Please try again.";
      console.error("❌ [Store.login] FAILED:", message);

      set({
        error: message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw err;
    }
  },

  logout: async () => {
    console.log("🔴 [Store.logout] Starting logout...");
    set({ isLoading: true });

    try {
      await authService.logout();
      console.log("✅ [Store.logout] Server logout successful");
    } catch (err) {
      console.warn(
        "⚠️ [Store.logout] Server logout failed, clearing local state anyway",
      );
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    console.log("✅ [Store.logout] Local state cleared");
  },

  forceLogout: () => {
    console.log("🔴 [Store.forceLogout] Forcing logout (e.g. from 401)");
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    console.log("🔵 [Store.checkAuth] Called - checking authentication status");
    set({ isLoading: true });

    try {
      const user = await authService.fetchCurrentUser();

      console.log(
        "🔵 [Store.checkAuth] fetchCurrentUser result:",
        user ? "✅ USER FOUND" : "❌ NO USER",
      );

      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });

      console.log("✅ [Store.checkAuth] Final state:", {
        isAuthenticated: !!user,
        hasUser: !!user,
        userName: user?.name || "N/A",
      });
    } catch (err: any) {
      console.log("⚠️ [Store.checkAuth] Error during checkAuth:", err.message);
      get().forceLogout();
    }
  },

  clearError: () => {
    console.log("🔵 [Store.clearError] Clearing error message");
    set({ error: null });
  },
}));
