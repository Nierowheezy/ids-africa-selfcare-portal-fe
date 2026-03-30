"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChevronRight,
  Loader2,
  CreditCard,
  Building2,
  CheckCircle2,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dashboardService } from "@/services/dashboardService";
import { paymentService } from "@/services/paymentService"; // ← added import

export default function MakePaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "paystack" | "bank_transfer"
  >("paystack");

  // Fetch real user & service data from backend (same as dashboard)
  const {
    data,
    isLoading: isDataLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
    staleTime: 5 * 60 * 1000,
  });

  if (isDataLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your information...</p>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Failed to load your details
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.message ||
                "We couldn't load your account information. Please try again."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.refresh()}>Retry</Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  const user = data.user;
  const service = data.service;

  // Pre-fill from real backend data (all fields disabled)
  const formData = {
    firstName: user.name?.split(" ")[0] || "N/A",
    lastName: user.name?.split(" ").slice(1).join(" ") || "N/A",
    email: user.email || "N/A",
    amount: "12000", // TODO: Replace with real plan price from service later
    accountNumber: user.id?.toString() || "N/A",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedMethod === "paystack") {
      try {
        // Now using the service — clean & reusable
        const { authorization_url } = await paymentService.initializePayment(
          Number(formData.amount),
          formData.email.trim(),
        );

        // Redirect to Paystack checkout
        window.location.href = authorization_url;
      } catch (err: any) {
        console.error("Payment init failed:", err);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: err.message || "Something went wrong. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast({
        title: "Bank Transfer Selected",
        description: "Please follow the instructions below.",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center space-x-2 text-sm animate-in fade-in duration-300">
          <Link
            href="/dashboard"
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Make Payment</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customer Information Form */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-4 duration-500">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">
                  Customer information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-gray-600 text-sm"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        disabled
                        className="h-12 border-gray-200 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-gray-600 text-sm"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        disabled
                        className="h-12 border-gray-200 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-600 text-sm">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="h-12 border-gray-200 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-600 text-sm">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        value={formData.amount}
                        disabled
                        className="h-12 border-gray-200 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="accountNumber"
                        className="text-gray-600 text-sm"
                      >
                        Account number
                      </Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        disabled
                        className="h-12 font-mono border-gray-200 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <Label className="text-gray-900 font-semibold">
                      Select Payment Method
                    </Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedMethod("paystack")}
                        className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                          selectedMethod === "paystack"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {selectedMethod === "paystack" && (
                          <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-red-600" />
                        )}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">
                              Paystack
                            </h4>
                            <p className="text-sm text-gray-500">
                              Pay with card
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMethod("bank_transfer")}
                        className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                          selectedMethod === "bank_transfer"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {selectedMethod === "bank_transfer" && (
                          <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-red-600" />
                        )}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">
                              Bank Transfer
                            </h4>
                            <p className="text-sm text-gray-500">
                              Direct bank payment
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-ui px-8 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : selectedMethod === "paystack" ? (
                      "Pay with Paystack"
                    ) : (
                      "View Bank Transfer Details"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Service Renewal Summary */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <Card className="shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-heading">
                  Service renewal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b pb-6">
                  <p className="text-sm text-gray-500 mb-1">plan</p>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                    {service?.plan || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bandwidth: upload: 10 - download: 10
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-heading font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      N {parseInt(formData.amount || "0").toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Payment via</p>
                  <div className="flex items-center space-x-2">
                    {selectedMethod === "paystack" ? (
                      <>
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Paystack</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Bank Transfer</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bank Transfer Instructions */}
                {selectedMethod === "bank_transfer" && (
                  <div className="pt-4 border-t bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-3 mb-4">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        <strong>Note:</strong> Bank transfers are manual and may
                        take up to 24 hours to reflect. Please transfer funds
                        and send proof to support.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-white">
                        <p className="font-medium text-gray-900">
                          Polaris Bank
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-mono text-lg">1770073206</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("1770073206")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          IDS Africa Limited
                        </p>
                      </div>

                      <div className="border rounded-lg p-4 bg-white">
                        <p className="font-medium text-gray-900">Union Bank</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-mono text-lg">0204756830</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("0204756830")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          IDS Africa Limited
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-amber-800">
                      <p className="font-medium">Next Steps:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Include your User ID in the narration</li>
                        <li>
                          Send proof to <strong>helpdesk@ids-africa.com</strong>
                        </li>
                        <li>Or WhatsApp: +234 913 504 6353</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
