// src/lib/api.ts
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "json",
  },
  timeout: 15000,
});

// Response interceptor: catch 401 globally and clear auth state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // Check if we are currently on the login page
    const isOnLoginPage =
      typeof window !== "undefined" && window.location.pathname === "/login";

    if (status === 401) {
      // Do NOT show "Session Expired" toast if user is on the login page
      // (they simply don't have a session yet)
      if (!isOnLoginPage) {
        useAuthStore.getState().forceLogout();

        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again.",
        });
      } else {
        // Just clear the auth state silently on login page
        useAuthStore.getState().forceLogout();
      }
    } else if (status !== 404 && status !== 400 && status !== 401) {
      // Show toast for other server errors (exclude 404, 400, and 401 which we handled)
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
