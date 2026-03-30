// src/app/(protected)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  // Run checkAuth once when layout mounts
  useEffect(() => {
    console.log("🔵 [ProtectedLayout] Mounting - running checkAuth...");
    checkAuth().finally(() => {
      setHasChecked(true);
    });
  }, [checkAuth]);

  // After auth check completes, decide what to do
  useEffect(() => {
    if (hasChecked && !isLoading) {
      if (!isAuthenticated) {
        console.log(
          "⚠️ [ProtectedLayout] Not authenticated → Redirecting to /login",
        );
        router.replace("/login");
      } else {
        console.log(
          "✅ [ProtectedLayout] User authenticated → Rendering protected content",
          {
            userName: user?.name || "N/A",
          },
        );
      }
    }
  }, [isAuthenticated, isLoading, hasChecked, router, user]);

  // Show loading spinner while checking authentication
  if (isLoading || !hasChecked) {
    console.log("🔵 [ProtectedLayout] Showing loading spinner...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  // Don't render children if not authenticated (router will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
