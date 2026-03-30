// src/lib/api.ts
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore"; // ← import store

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001",
  withCredentials: true,
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
      // Immediately clear auth store
      useAuthStore.getState().logout(); // or forceLogout if you add it

      // Show toast (optional - you can remove if handled elsewhere)
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please log in again.",
      });

      // Optional: redirect here too, but better to let page/component handle it
      // router.push('/login') — avoid here, causes issues in non-page contexts
    } else if (status !== 404 && status !== 400) {
      // Show toast for other errors (optional)
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
