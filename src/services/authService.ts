// src/services/authService.ts
import api from "@/lib/api";
import { User } from "@/types";

const ACCESS_TOKEN_KEY = "access_token";

export const authService = {
  async login(accountNumber: string, password: string): Promise<User> {
    console.log(
      "🔵 [authService.login] Started with account:",
      accountNumber.trim(),
    );

    try {
      const response = await api.post("/api/auth/login", {
        accountNumber: accountNumber.trim(),
        password,
      });

      console.log("🔵 [authService.login] /api/auth/login response:", {
        status: response.status,
        success: response.data?.success,
        message: response.data?.message,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Login failed");
      }

      const { accessToken, user } = response.data.data;

      // === NEW: Save access token to localStorage ===
      if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        console.log(
          "✅ [authService.login] Access token saved to localStorage",
        );
      } else {
        console.warn(
          "⚠️ [authService.login] No accessToken received from backend",
        );
      }

      console.log("✅ [authService.login] Login successful");

      // We no longer need to call /me here because backend already returns the user
      return user as User;
    } catch (error: any) {
      console.error("❌ [authService.login] Error occurred:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async logout(): Promise<void> {
    console.log("🔴 [authService.logout] Logging out...");

    // Clear token from localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    try {
      await api.post("/api/auth/logout");
      console.log("✅ [authService.logout] Server logout successful");
    } catch (err) {
      console.warn(
        "⚠️ [authService.logout] Server logout failed, but local token cleared",
      );
    }

    console.log("✅ [authService.logout] Logout completed");
  },

  async fetchCurrentUser(): Promise<User | null> {
    console.log("🔵 [authService.fetchCurrentUser] Checking current user...");

    try {
      const response = await api.get("/api/auth/me");

      console.log("🔵 [authService.fetchCurrentUser] /me response:", {
        success: response.data?.success,
        hasUser: !!response.data?.data?.user,
      });

      if (response.data?.success) {
        console.log("✅ [authService.fetchCurrentUser] User authenticated");
        return response.data.data.user as User;
      }

      console.log("⚠️ [authService.fetchCurrentUser] No active session");
      localStorage.removeItem(ACCESS_TOKEN_KEY); // Clean up invalid token
      return null;
    } catch (err: any) {
      console.log(
        "⚠️ [authService.fetchCurrentUser] Failed (expected if not logged in):",
        err.message,
      );
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      return null;
    }
  },
};
