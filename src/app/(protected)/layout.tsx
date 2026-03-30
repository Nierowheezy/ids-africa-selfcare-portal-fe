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
  const { isAuthenticated, isLoading, checkAuth, user, forceLogout } =
    useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  // Initial auth check when layout mounts
  useEffect(() => {
    console.log(
      "🔵 [ProtectedLayout] Mounting - running initial auth check...",
    );

    checkAuth().finally(() => {
      setHasChecked(true);
    });
  }, [checkAuth]);

  // Handle redirect after auth check
  useEffect(() => {
    if (hasChecked && !isLoading) {
      if (!isAuthenticated) {
        console.log(
          "⚠️ [ProtectedLayout] Not authenticated → Redirecting to /login",
        );
        router.replace("/login");
      } else {
        console.log("✅ [ProtectedLayout] User authenticated:", user?.name);
      }
    }
  }, [isAuthenticated, isLoading, hasChecked, router, user]);

  // Show loading while checking auth
  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  // Safety check - don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
