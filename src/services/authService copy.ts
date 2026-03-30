// src/services/authService.ts
import api from "@/lib/api";
import { User } from "@/types"; // ← now from types

export const authService = {
  async login(accountNumber: string, password: string): Promise<User> {
    const response = await api.post("/api/auth/login", {
      accountNumber: accountNumber.trim(),
      password,
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Login failed");
    }

    const meResponse = await api.get("/api/auth/me");

    if (!meResponse.data?.success) {
      throw new Error("Failed to fetch user profile after login");
    }

    return meResponse.data.data.user as User;
  },

  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  },

  async fetchCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get("/api/auth/me");
      if (response.data?.success) {
        return response.data.data.user as User;
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};
