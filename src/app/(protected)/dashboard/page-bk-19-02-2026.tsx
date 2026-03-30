"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { LoginActivityCard } from "@/components/dashboard/LoginActivityCard";
import { TicketsCard } from "@/components/dashboard/TicketsCard";
import { ServicePlanCard } from "@/components/dashboard/ServicePlanCard";
import { PlanDatesCard } from "@/components/dashboard/PlanDatesCard";
import { RemainingDaysCard } from "@/components/dashboard/RemainingDaysCard";
import {
  PaymentSectionCard,
  PaymentHistoryCard,
} from "@/components/dashboard/PaymentCards";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      {/* User Section Skeleton */}
      <section>
        <Skeleton className="h-8 w-24 mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-16 w-16 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Service Section Skeleton */}
      <section>
        <Skeleton className="h-8 w-24 mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Payment Section Skeleton */}
      <section>
        <Skeleton className="h-8 w-24 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock data - in a real app, this would come from an API
  const userData = {
    userName: "Account 1 Test",
    loginId: "developer@channelstv.com",
    accountId: "27571225",
    lastLogin: "15th January 2026",
    lastLoginTime: "6 days ago @ 08:13",
    lastLoginDate: "15th January 2026",
  };

  const servicePlan = {
    planName: "Brauz Bronze",
    status: "suspended" as const,
    downloadSpeed: "10",
    uploadSpeed: "10",
    subscriptionDate: "22nd April 2024",
    expiryDate: "...",
    nextRenewal: "service is suspended",
    daysLeft: -1,
    totalDays: 30,
  };

  const payment = {
    lastPaymentDate: "9th August 2022",
    lastPaymentAmount: "NGN 12000",
    status: "success" as const,
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* User Section */}
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                User
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <UserProfileCard
                  userName={userData.userName}
                  loginId={userData.loginId}
                  accountId={userData.accountId}
                  lastLogin={userData.lastLogin}
                />
                <LoginActivityCard
                  lastLoginDate={userData.lastLoginDate}
                  lastLoginTime={userData.lastLoginTime}
                />
                <TicketsCard openTickets={0} />
              </div>
            </section>

            {/* Service Section */}
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Service
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <ServicePlanCard
                  planName={servicePlan.planName}
                  status={servicePlan.status}
                  downloadSpeed={servicePlan.downloadSpeed}
                  uploadSpeed={servicePlan.uploadSpeed}
                />
                <PlanDatesCard
                  subscriptionDate={servicePlan.subscriptionDate}
                  expiryDate={servicePlan.expiryDate}
                  nextRenewal={servicePlan.nextRenewal}
                  isSuspended={servicePlan.status === "suspended"}
                />
                <RemainingDaysCard
                  daysLeft={servicePlan.daysLeft}
                  totalDays={servicePlan.totalDays}
                />
              </div>
            </section>

            {/* Payment Section */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Payment
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <PaymentSectionCard
                  planName={servicePlan.planName}
                  planExpiry={servicePlan.expiryDate}
                  isSuspended={servicePlan.status === "suspended"}
                />
                <PaymentHistoryCard
                  lastPaymentDate={payment.lastPaymentDate}
                  lastPaymentAmount={payment.lastPaymentAmount}
                  status={payment.status}
                />
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
