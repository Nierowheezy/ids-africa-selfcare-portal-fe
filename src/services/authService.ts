// src/services/authService.ts
import api from "@/lib/api";
import { User } from "@/types";

const ACCESS_TOKEN_KEY = "access_token";

export const authService = {
  async login(accountNumber: string, password: string): Promise<User> {
    console.log(
      "🔵 [authService.login] Starting login for:",
      accountNumber.trim(),
    );

    try {
      const response = await api.post("/api/auth/login", {
        accountNumber: accountNumber.trim(),
        password,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Login failed");
      }

      const { accessToken, user } = response.data.data;

      // Save access token for Bearer header + silent refresh
      if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        console.log(
          "✅ [authService.login] Access token saved to localStorage",
        );
      } else {
        console.warn(
          "⚠️ [authService.login] No accessToken received from server",
        );
      }

      console.log(
        "✅ [authService.login] Login successful for user:",
        user?.name,
      );
      return user as User;
    } catch (error: any) {
      console.error(
        "❌ [authService.login] Failed:",
        error.response?.data?.message || error.message,
      );
      throw error;
    }
  },

  async logout(): Promise<void> {
    console.log("🔴 [authService.logout] Starting logout...");

    // Clear local token immediately
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    try {
      await api.post("/api/auth/logout");
      console.log("✅ [authService.logout] Server logout successful");
    } catch (err) {
      console.warn(
        "⚠️ [authService.logout] Server logout failed (but local token cleared)",
      );
    }

    console.log("✅ [authService.logout] Completed");
  },

  async fetchCurrentUser(): Promise<User | null> {
    console.log(
      "🔵 [authService.fetchCurrentUser] Checking current session...",
    );

    try {
      const response = await api.get("/api/auth/me");

      if (response.data?.success && response.data?.data?.user) {
        console.log(
          "✅ [authService.fetchCurrentUser] User authenticated:",
          response.data.data.user.name,
        );
        return response.data.data.user as User;
      }

      console.log("⚠️ [authService.fetchCurrentUser] No active user");
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      return null;
    } catch (err: any) {
      console.log(
        "⚠️ [authService.fetchCurrentUser] Session invalid or expired",
      );
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      return null;
    }
  },
};
