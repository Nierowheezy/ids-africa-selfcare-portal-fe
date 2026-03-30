"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to payment history page
    router.replace("/payment/history");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
