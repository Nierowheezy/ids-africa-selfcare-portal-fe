"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import confetti from "canvas-confetti"; // Make sure you installed: npm install canvas-confetti

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
  Calendar,
  CreditCard,
} from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { paymentService } from "@/services/paymentService";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<
    "loading" | "success" | "pending" | "failed"
  >("loading");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const pollCountRef = useRef(0);
  const maxPolls = 30;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Debug log
  useEffect(() => {
    console.log("✅ Payment Success Page Loaded");
    console.log("Path:", pathname);
    console.log("Reference:", reference);
  }, [pathname, reference]);

  const fetchPaymentStatus = async (isRetry = false) => {
    if (!reference) {
      setErrorMsg("No payment reference found.");
      setStatus("failed");
      return;
    }

    try {
      const data = await paymentService.getPaymentStatus(reference);
      setPaymentData(data);

      if (data.status === "PAID") {
        if (data.ucrm_sync_status === "completed") {
          setStatus("success");

          if (!isRetry) {
            toast({
              title: "🎉 Payment Successful!",
              description: "Your service has been renewed.",
            });

            // Fire confetti
            confetti({
              particleCount: 200,
              spread: 80,
              origin: { y: 0.6 },
            });
          }
        } else {
          setStatus("pending");
        }
      } else if (data.status === "FAILED") {
        setStatus("failed");
        setErrorMsg("Payment was declined or failed.");
      } else {
        setStatus("pending");
      }
    } catch (err: any) {
      console.error("Payment status error:", err);
      setErrorMsg(err.message || "Unable to verify payment status");
      setStatus("failed");
    }
  };

  // Main polling effect
  useEffect(() => {
    if (!reference) return;

    fetchPaymentStatus();

    intervalRef.current = setInterval(() => {
      pollCountRef.current += 1;

      if (pollCountRef.current < maxPolls) {
        fetchPaymentStatus(true);
      } else if (status === "pending") {
        setErrorMsg(
          "Payment is confirmed but syncing is taking longer than expected. Please check your dashboard later.",
        );
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 7000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reference]);

  // Unified retry
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
        <Card className="max-w-lg w-full shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-heading">
              Payment Status
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-8 py-8">
            {/* Loading */}
            {status === "loading" && (
              <>
                <Loader2 className="h-20 w-20 animate-spin text-red-600 mx-auto" />
                <h2 className="text-xl font-semibold">
                  Verifying your payment...
                </h2>
                <p className="text-gray-600">Please wait a moment</p>
              </>
            )}

            {/* SUCCESS */}
            {status === "success" && paymentData && (
              <>
                <CheckCircle2 className="h-24 w-24 text-green-600 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Payment Successful!
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6 space-y-4 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-semibold text-xl">
                      ₦
                      {Number(
                        paymentData.amount || paymentData.paid_amount,
                      )?.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference</span>
                    <span className="font-mono">{reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span>
                      {new Date().toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">
                      {paymentData.plan || "Internet Subscription"}
                    </span>
                  </div>
                </div>

                <p className="text-green-700 font-medium">
                  Your account has been successfully renewed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/payment/history")}
                  >
                    View History
                  </Button>
                </div>
              </>
            )}

            {/* PENDING - Beautiful Progress Timeline */}
            {status === "pending" && (
              <>
                <Clock className="h-20 w-20 text-amber-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Received
                </h2>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Your payment has been confirmed by Paystack.
                </p>

                {/* 3-Step Progress Timeline */}
                <div className="mt-10 px-6">
                  <div className="relative flex justify-between">
                    {/* Step 1 - Paid */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      </div>
                      <p className="text-xs mt-3 font-medium text-green-600">
                        Paid
                      </p>
                    </div>

                    <div className="absolute top-5 left-[18%] right-[18%] h-1 bg-green-200" />

                    {/* Step 2 - Activating */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center animate-pulse">
                        <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
                      </div>
                      <p className="text-xs mt-3 font-medium text-amber-600">
                        Activating Service
                      </p>
                    </div>

                    <div className="absolute top-5 left-[52%] right-[18%] h-1 bg-gray-200" />

                    {/* Step 3 - Done */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="w-7 h-7 text-gray-400" />
                      </div>
                      <p className="text-xs mt-3 font-medium text-gray-400">
                        Service Active
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-mono mt-6">
                  Ref: {reference}
                </p>

                <Button
                  variant="outline"
                  onClick={handleRetry}
                  disabled={pollCountRef.current >= maxPolls}
                  className="mt-4"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Again
                </Button>
              </>
            )}

            {/* FAILED */}
            {status === "failed" && (
              <>
                <AlertTriangle className="h-20 w-20 text-red-600 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Payment Issue
                </h2>
                <p className="text-gray-600 mt-4">
                  {errorMsg || "We couldn't confirm this payment."}
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
