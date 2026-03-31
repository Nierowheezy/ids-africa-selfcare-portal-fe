// src/lib/api.ts
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // ← Updated for proxy
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
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

    if (status === 401) {
      // Use forceLogout (faster, no extra network call)
      useAuthStore.getState().forceLogout();

      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please log in again.",
      });
    } else if (status !== 404 && status !== 400) {
      // Show toast for other non-4xx errors
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
