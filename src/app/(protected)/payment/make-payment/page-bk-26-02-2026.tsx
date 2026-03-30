"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  ChevronRight,
  Loader2,
  CreditCard,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function MakePaymentPage() {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "paystack" | "bank_transfer"
  >("paystack");
  const [formData, setFormData] = useState({
    firstName: "Test",
    lastName: "Account 1",
    email: "developer@channelstv.com",
    amount: "12000",
    accountNumber: "27571225",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Handle payment submission
      console.log("Payment submitted:", {
        ...formData,
        method: selectedMethod,
      });
    }, 2000);
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
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
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
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-600 text-sm">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-600 text-sm">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="h-12 border-gray-200 bg-gray-50 focus:border-red-500 focus:ring-red-500 transition-all"
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
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="h-12 font-mono border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all"
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
                    ) : (
                      "Continue to payment"
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
                    Brauz Bronze
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
