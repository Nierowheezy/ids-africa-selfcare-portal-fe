// src/lib/api.ts
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    const isOnLoginPage =
      typeof window !== "undefined" && window.location.pathname === "/login";

    if (status === 401) {
      if (!isOnLoginPage) {
        useAuthStore.getState().forceLogout();
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again.",
        });
      } else {
        useAuthStore.getState().forceLogout(); // silent on login page
      }
    } else if (status !== 404 && status !== 400 && status !== 401) {
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
