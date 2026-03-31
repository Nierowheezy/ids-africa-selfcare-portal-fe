"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { dashboardService } from "@/services/dashboardService";
import { paymentService } from "@/services/paymentService";
import { DashboardResponse } from "@/types";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="space-y-12">
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
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: lastPayment } = useQuery({
    queryKey: ["lastPayment"],
    queryFn: paymentService.getLastPayment,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Handle 401 (session expired)
  if (isError && (error as any)?.response?.status === 401) {
    toast({
      variant: "destructive",
      title: "Session Expired",
      description: "Please log in again.",
    });
    router.push("/login");
    return null;
  }

  // General error fallback
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Failed to load dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              {(error as any)?.message ||
                "Something went wrong. Please try again."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" onClick={() => router.push("/login")}>
                Log Out & Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <DashboardSkeleton />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Safe guard: data should exist at this point, but TypeScript needs help
  const dashboard = data;
  if (!dashboard || !dashboard.user) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              No Dashboard Data
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load your dashboard information.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* User Section */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            User
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <UserProfileCard
              userName={dashboard.user.name}
              loginId={
                dashboard.user.username
                  ? dashboard.user.username
                  : dashboard.user.id.toString()
              }
              accountId={dashboard.user.id.toString()}
              lastLogin={dashboard.user.lastLogin}
            />
            <LoginActivityCard
              lastLoginDate={dashboard.user.lastLogin}
              lastLoginTime={dashboard.user.daysAgo}
            />
            <TicketsCard openTickets={0} />
          </div>
        </section>

        {/* Service Section */}

        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            Service
          </h2>

          {dashboard?.service?.plan === "Service Information Unavailable" ? (
            <Card className="shadow-sm border-amber-200 bg-amber-50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amber-700 mb-2">
                  Service Information Unavailable
                </h3>
                <p className="text-amber-600 mb-6">
                  We couldn't retrieve your current service details right now.
                  <br />
                  This is usually temporary while we connect to our network
                  system.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Page
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <ServicePlanCard
                planName={dashboard.service.plan}
                status={dashboard.service.status}
                downloadSpeed={dashboard.service.download.toString()}
                uploadSpeed={dashboard.service.upload.toString()}
              />

              <PlanDatesCard
                subscriptionDate={dashboard.service.from}
                expiryDate={dashboard.service.to}
                nextRenewal={dashboard.service.renewal}
                isSuspended={dashboard.service.status === "suspended"}
              />
              <RemainingDaysCard
                daysLeft={
                  typeof dashboard.service.left === "number"
                    ? dashboard.service.left
                    : parseInt(dashboard.service.left as string) || 0
                }
                totalDays={30}
              />
            </div>
          )}
        </section>

        {/* Payment Section */}
        {/* Payment Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            Payment
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <PaymentSectionCard
              planName={dashboard.service.plan}
              planExpiry={dashboard.service.to}
              isSuspended={dashboard.service.status === "suspended"}
            />

            {lastPayment ? (
              <PaymentHistoryCard
                lastPaymentDate={lastPayment.createdDate}
                lastPaymentAmount={lastPayment.amount}
                methodId={lastPayment.methodId}
                note={lastPayment.note}
                creditAmount={lastPayment.creditAmount}
              />
            ) : (
              <Card className="shadow-sm border-amber-200 bg-amber-50">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-amber-700 mb-2">
                    Payment History Unavailable
                  </h3>
                  <p className="text-amber-600 mb-6">
                    We couldn't load your recent payment history right now.
                    <br />
                    This is usually temporary.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Page
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
