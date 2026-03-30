// src/lib/api.ts
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor - Attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with Silent Refresh
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // Silent Refresh on 401
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log(
          "🔄 [API] Access token expired → Attempting silent refresh...",
        );

        const refreshResponse = await api.post("/api/auth/refresh");
        const { accessToken } = refreshResponse.data?.data || {};

        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
          console.log("✅ [API] Silent refresh successful");

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ [API] Silent refresh failed", refreshError);
      }

      // Refresh failed → Force logout
      console.log("🔴 [API] Refresh failed → Logging user out");
      localStorage.removeItem("access_token");

      // FIXED: Safe way to call forceLogout or logout
      const store = useAuthStore.getState();
      if (store.forceLogout) {
        store.forceLogout();
      } else {
        store.logout();
      }

      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please log in again.",
      });
    }
    // Other errors
    else if (status !== 400 && status !== 404) {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
