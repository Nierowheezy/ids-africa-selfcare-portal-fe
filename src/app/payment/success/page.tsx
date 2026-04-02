// app/payment/success/page.tsx
import { Suspense } from "react";
import PaymentSuccessClient from "./SuccessClient";
import { Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-gray-50">
          <div className="flex-1 flex items-center justify-center py-12 px-4">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto" />
              <p className="mt-6 text-lg text-gray-600">
                Verifying your payment...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
