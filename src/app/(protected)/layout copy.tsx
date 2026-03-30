// src/app/(protected)/layout.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Try to load user / refresh auth state on mount
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  // If it's the Paystack callback → render children even if !isAuthenticated
  // Otherwise → only render if authenticated (middleware already enforced this)
  return <>{children}</>;
}
