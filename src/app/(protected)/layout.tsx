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
    console.log(
      "🔵 [ProtectedLayout] useEffect triggered - Mounting / Re-rendering",
    );
    console.log("🔵 [ProtectedLayout] Current state before checkAuth:", {
      isAuthenticated,
      isLoading,
    });

    checkAuth();
  }, [checkAuth]);

  // Log every render to see what's happening
  console.log("🔵 [ProtectedLayout] Render Cycle →", {
    isAuthenticated,
    isLoading,
    timestamp: new Date().toISOString(),
  });

  if (isLoading) {
    console.log(
      "🔵 [ProtectedLayout] Showing loading spinner (isLoading = true)",
    );
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "⚠️ [ProtectedLayout] User is NOT authenticated - children will still render but middleware should have redirected",
    );
  } else {
    console.log(
      "✅ [ProtectedLayout] User is authenticated - rendering protected content",
    );
  }

  return <>{children}</>;
}
