"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import confetti from "canvas-confetti";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  CheckCircle2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Clock,
} from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { paymentService } from "@/services/paymentService";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<
    "loading" | "confirmed" | "activating" | "success" | "failed"
  >("loading");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const pollCountRef = useRef(0);
  const maxPolls = 25;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fire confetti with different intensity
  const fireConfetti = (intensity: "light" | "heavy" = "light") => {
    const count = intensity === "heavy" ? 300 : 180;
    const spread = intensity === "heavy" ? 100 : 70;

    confetti({
      particleCount: count,
      spread,
      origin: { y: 0.6 },
    });
  };

  // Debug log
  useEffect(() => {
    console.log("✅ Payment Success Page Loaded");
    console.log("Reference:", reference);
  }, [reference]);

  const fetchPaymentStatus = async (isRetry = false) => {
    if (!reference) {
      setErrorMsg("No payment reference found.");
      setStatus("failed");
      return;
    }

    try {
      const rawData = await paymentService.getPaymentStatus(reference);

      const data = {
        ...rawData,
        ucrm_sync_status: rawData.ucrm_sync_status ?? "pending",
        isPaid:
          rawData.isPaid ??
          (rawData.status === "paid" ||
            rawData.verification_status === "verified"),
        isFullySynced:
          rawData.isFullySynced ?? rawData.ucrm_sync_status === "completed",
        hasSyncError: rawData.hasSyncError ?? false,
        amount: rawData.amount || rawData.paid_amount,
      };

      setPaymentData(data);

      console.log("Payment status fetched:", {
        isPaid: data.isPaid,
        isFullySynced: data.isFullySynced,
        ucrm_sync_status: data.ucrm_sync_status,
      }); // ← Helpful for debugging

      // Final clean logic
      if (data.isFullySynced) {
        setStatus("success");
        if (!isRetry) {
          toast({
            title: "🎉 Service Renewed Successfully!",
            description: "Your internet is now active.",
          });
          fireConfetti("heavy");
        }
      } else if (data.isPaid) {
        setStatus("activating");
        if (!isRetry) {
          toast({
            title: "✅ Payment Confirmed",
            description: "We're activating your service...",
          });
          fireConfetti("light");
        }
      } else {
        setStatus("loading");
      }
    } catch (err: any) {
      console.error("Payment status error:", err);
      setErrorMsg(err.message || "Unable to verify payment status");
      setStatus("failed");
    }
  };

  // Main polling effect - Smart & Responsive
  useEffect(() => {
    if (!reference) return;

    // Initial fetch
    fetchPaymentStatus();

    // Faster polling at the beginning, then slow down
    intervalRef.current = setInterval(
      () => {
        pollCountRef.current += 1;

        if (pollCountRef.current < maxPolls) {
          fetchPaymentStatus(true);
        } else if (status === "activating") {
          setErrorMsg(
            "Your payment is confirmed. Syncing is taking a bit longer than usual. You can safely go to your dashboard.",
          );
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      },
      pollCountRef.current < 8 ? 4000 : 7000,
    ); // Faster first 8 polls

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reference]);

  const handleRetry = () => {
    pollCountRef.current = 0;
    setStatus("loading");
    setErrorMsg("");
    fetchPaymentStatus();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="max-w-lg w-full shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-6 bg-gradient-to-b from-white to-gray-50">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Payment Status
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-8 py-10 px-8">
            {/* LOADING */}
            {status === "loading" && (
              <>
                <Loader2 className="h-20 w-20 animate-spin text-red-600 mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Verifying your payment...
                </h2>
                <p className="text-gray-600">Please wait a moment</p>
              </>
            )}

            {/* PAYMENT CONFIRMED + ACTIVATING */}
            {status === "activating" && paymentData && (
              <>
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900">
                  Payment Confirmed!
                </h2>
                <p className="text-lg text-green-700 font-medium">
                  Your payment has been received successfully.
                </p>

                {/* Progress Timeline */}
                <div className="mt-12 px-4">
                  <div className="relative flex justify-between">
                    {/* Step 1 - Paid */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center ring-4 ring-green-100">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-sm mt-3 font-semibold text-green-700">
                        Paid
                      </p>
                    </div>

                    <div className="absolute top-6 left-[22%] right-[22%] h-1 bg-green-200" />

                    {/* Step 2 - Activating */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center ring-4 ring-amber-100 animate-pulse">
                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                      </div>
                      <p className="text-sm mt-3 font-semibold text-amber-600">
                        Activating Service
                      </p>
                    </div>

                    <div className="absolute top-6 left-[55%] right-[18%] h-1 bg-gray-200" />

                    {/* Step 3 - Done */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-gray-100">
                        <Clock className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm mt-3 font-medium text-gray-400">
                        Service Active
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mt-8 max-w-xs mx-auto">
                  We're activating your internet service right now.
                  <br />
                  This usually takes just a few seconds...
                </p>

                <p className="text-xs text-gray-500 font-mono mt-6">
                  Ref: {reference}
                </p>

                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="mt-6"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </Button>
              </>
            )}

            {/* FULL SUCCESS */}
            {status === "success" && paymentData && (
              <>
                <div className="mx-auto w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-20 w-20 text-green-600" />
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  🎉 All Done!
                </h2>
                <p className="text-2xl text-green-700 font-semibold">
                  Your service has been renewed
                </p>

                <div className="bg-green-50 border border-green-200 rounded-3xl p-8 mt-8 text-left space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-bold text-2xl text-green-700">
                      ₦
                      {Number(
                        paymentData.amount || paymentData.paid_amount,
                      )?.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference</span>
                    <span className="font-mono text-sm">{reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">Internet Subscription</span>
                  </div>
                </div>

                <p className="text-green-700 font-medium text-lg mt-6">
                  Your high-speed internet is now active. Enjoy!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex-1 text-lg py-6"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-lg py-6"
                    onClick={() => router.push("/payment/history")}
                  >
                    View Payment History
                  </Button>
                </div>
              </>
            )}

            {/* FAILED */}
            {status === "failed" && (
              <>
                <AlertTriangle className="h-20 w-20 text-red-600 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Payment Issue
                </h2>
                <p className="text-gray-600 mt-4 max-w-sm mx-auto">
                  {errorMsg ||
                    "We couldn't confirm this payment. Please try again."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Button variant="outline" onClick={handleRetry}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button onClick={() => router.push("/payment/make-payment")}>
                    Make New Payment
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
