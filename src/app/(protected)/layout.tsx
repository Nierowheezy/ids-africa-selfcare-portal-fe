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

  // 1️⃣ Run auth check on mount
  useEffect(() => {
    console.log("🔵 [ProtectedLayout] Running initial auth check...");
    checkAuth()
      .catch((err) => console.error("[ProtectedLayout] Auth error:", err))
      .finally(() => setHasChecked(true));
  }, [checkAuth]);

  // 2️⃣ Redirect if not authenticated after check
  useEffect(() => {
    if (hasChecked && !isLoading) {
      if (!isAuthenticated) {
        console.log("⚠️ [ProtectedLayout] Not authenticated → /login");
        router.replace("/login");
      } else {
        console.log("✅ [ProtectedLayout] Authenticated user:", user?.name);
      }
    }
  }, [hasChecked, isLoading, isAuthenticated, router, user]);

  // 3️⃣ Loading state while checking auth
  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  // 4️⃣ Safety fallback: don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Authenticated: render all protected pages
  return <>{children}</>;
}
