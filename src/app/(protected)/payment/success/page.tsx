"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { paymentService } from "@/services/paymentService";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<
    "loading" | "success" | "pending" | "failed"
  >("loading");
  const [payment, setPayment] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pollCountRef = useRef(0);
  const maxPolls = 18; // ~3 minutes at 10s interval

  const fetchStatus = async (isRetry = false) => {
    if (!reference) {
      setErrorMsg("No payment reference found in URL");
      setStatus("failed");
      return;
    }

    try {
      const data = await paymentService.getPaymentStatus(reference);
      setPayment(data);

      // Status logic
      if (data.status === "PAID") {
        if (data.ucrm_sync_status === "completed") {
          setStatus("success");
          if (!isRetry) {
            toast({
              title: "Payment Completed!",
              description: "Your account has been successfully updated.",
            });
          }
        } else {
          setStatus("pending"); // sync in progress
        }
      } else if (data.status === "FAILED") {
        setStatus("failed");
        setErrorMsg("Payment was not successful.");
      } else {
        // Covers PENDING or unknown
        setStatus("pending");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to check payment status");
      setStatus("failed");
    }
  };

  useEffect(() => {
    if (!reference) return;

    // Initial fetch
    fetchStatus();

    const interval = setInterval(() => {
      if (status === "pending" && pollCountRef.current < maxPolls) {
        pollCountRef.current += 1;
        fetchStatus(true);
      } else if (pollCountRef.current >= maxPolls && status === "pending") {
        setErrorMsg(
          "Sync is taking longer than expected. Your payment is confirmed — please check your dashboard or history.",
        );
        clearInterval(interval);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [reference, status]);

  const handleRetry = () => {
    pollCountRef.current = 0;
    setStatus("loading");
    setErrorMsg(null);
    fetchStatus();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="max-w-lg w-full shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-heading">
              Payment Status
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6 py-8">
            {status === "loading" && (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-red-600 mx-auto" />
                <p className="text-lg text-gray-600">
                  Verifying your payment...
                </p>
              </>
            )}

            {status === "success" && payment && (
              <>
                <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                  Payment Successful!
                </h2>
                <div className="mt-6 space-y-3">
                  <p className="text-xl font-semibold text-gray-800">
                    ₦{Number(payment.amount)?.toLocaleString() || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Reference:{" "}
                    <span className="font-mono">
                      {payment.reference || reference}
                    </span>
                  </p>
                  <p className="text-base text-green-700 font-medium">
                    Your account has been updated
                  </p>
                </div>
                <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/payment/history")}
                  >
                    View Payment History
                  </Button>
                </div>
              </>
            )}

            {status === "pending" && (
              <>
                <Clock className="h-16 w-16 text-yellow-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  Payment Received
                </h2>
                <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto">
                  Your payment has been confirmed. We're syncing it to your
                  account — this usually takes just a few moments.
                </p>
                <p className="text-sm text-gray-500 mt-3 font-mono">
                  Reference: {reference}
                </p>
                <div className="mt-8">
                  <p className="text-sm text-gray-500 mb-4">
                    {pollCountRef.current >= maxPolls
                      ? "Sync is taking longer than expected — your payment is safe."
                      : "Checking sync status..."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    disabled={pollCountRef.current >= maxPolls}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Again
                  </Button>
                </div>
              </>
            )}

            {status === "failed" && (
              <>
                <AlertTriangle className="h-20 w-20 text-red-600 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                  Payment Issue
                </h2>
                <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto">
                  {errorMsg ||
                    "We couldn't confirm the payment result. Your card was not charged — please try again or check your payment history."}
                </p>
                <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/payment/make-payment")}
                  >
                    Try Again
                  </Button>
                  <Button onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
