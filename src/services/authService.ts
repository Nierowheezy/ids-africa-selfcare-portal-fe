// src/services/authService.ts
import api from "@/lib/api";
import { User } from "@/types";

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

      console.log("✅ [authService.login] Login successful, fetching /me...");

      const meResponse = await api.get("/api/auth/me");

      console.log("🔵 [authService.login] /api/auth/me response:", {
        status: meResponse.status,
        success: meResponse.data?.success,
        hasUserData: !!meResponse.data?.data?.user,
      });

      if (!meResponse.data?.success) {
        throw new Error("Failed to fetch user profile after login");
      }

      console.log(
        "✅ [authService.login] /me successful - returning user data",
      );
      return meResponse.data.data.user as User;
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
    console.log("🔵 [authService.logout] Logging out...");
    await api.post("/api/auth/logout");
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
      return null;
    } catch (err: any) {
      console.log(
        "⚠️ [authService.fetchCurrentUser] Failed (expected if not logged in):",
        err.message,
      );
      return null;
    }
  },
};
