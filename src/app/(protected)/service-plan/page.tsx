"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Upload,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import { DashboardResponse } from "@/types";
import { toast } from "@/components/ui/use-toast";

export default function ServicePlanPage() {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
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

  // General error fallback (network error, timeout, 500, etc.)
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Failed to load service plan
            </h2>
            <p className="text-gray-600 mb-6">
              {(error as any)?.message ||
                "Something went wrong. Please try again."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" onClick={() => router.push("/login")}>
                Log In Again
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
          <ServicePlanSkeleton />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Safe data check: no data or no service plan
  const service = data?.service;
  if (!service) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              No Active Service Plan
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any active service plan on your account.
              Subscribe to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/payment/make-payment">
                <Button>Subscribe Now</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Success: service exists
  const planData = {
    planName: service.plan || "N/A",
    status: (service.status || "unknown") as "active" | "suspended" | "unknown",
    downloadSpeed: service.download?.toString() || "N/A",
    uploadSpeed: service.upload?.toString() || "N/A",
    subscriptionDate: service.from || "N/A",
    expiryDate: service.to || "N/A",
    nextRenewal: service.renewal || "N/A",
    remainingDays:
      typeof service.left === "number"
        ? service.left
        : parseInt(service.left as string) || 0,
    billingCycle: "Monthly",
    autoRenewal: false,
  };

  const TOTAL_DAYS = 30;

  const progressPercentage = Math.max(
    0,
    Math.min(100, (planData.remainingDays / TOTAL_DAYS) * 100),
  );

  // NEW LOGIC:
  // - Badge & status always green when "active" (ignore days left)
  // - Time Remaining section: green if >7 days, red if ≤7 days (urgency)
  const isActive = planData.status === "active";

  const progressColor =
    planData.remainingDays <= 0 || planData.status === "suspended"
      ? "bg-red-600"
      : planData.remainingDays <= 7
        ? "bg-red-600"
        : "bg-green-600";

  const cardBgClass =
    planData.remainingDays <= 0 || planData.status === "suspended"
      ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
      : planData.remainingDays <= 7
        ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        : "bg-gradient-to-br from-green-50 to-green-100 border-green-200";

  const iconBgClass =
    planData.remainingDays <= 0 || planData.status === "suspended"
      ? "bg-red-600"
      : planData.remainingDays <= 7
        ? "bg-red-600"
        : "bg-green-600";

  const textColorClass =
    planData.remainingDays <= 0 || planData.status === "suspended"
      ? "text-red-900"
      : planData.remainingDays <= 7
        ? "text-red-900"
        : "text-green-900";

  const badgeClass = isActive
    ? "bg-green-100 text-green-700 hover:bg-green-100 text-base px-4 py-1"
    : "bg-red-100 text-red-700 hover:bg-red-100 text-base px-4 py-1";

  const getRemainingDaysText = () => {
    if (planData.remainingDays > 1) {
      return `${planData.remainingDays} days left`;
    }
    if (planData.remainingDays === 1) {
      return "Expires tomorrow";
    }
    if (planData.remainingDays === 0) {
      return "Expires today";
    }
    return "Expired";
  };

  const isExpiredOrSuspended =
    planData.status === "suspended" || planData.remainingDays <= 0;

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
          <span className="text-gray-600">Service Plan</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-heading font-bold">
                      {planData.planName}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">Current Service Plan</p>
                  </div>
                  <Badge
                    variant={isActive ? "default" : "destructive"}
                    className={badgeClass}
                  >
                    {planData.status.charAt(0).toUpperCase() +
                      planData.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Remaining */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900">
                    Time Remaining
                  </h3>
                  <div className={`p-6 rounded-lg border ${cardBgClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${iconBgClass} flex items-center justify-center`}
                        >
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <p className={`text-sm font-medium ${textColorClass}`}>
                          {getRemainingDaysText()}
                        </p>
                      </div>
                      {planData.remainingDays > 0 && (
                        <p className={`text-sm font-medium ${textColorClass}`}>
                          {progressPercentage.toFixed(0)}%
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    <p className={`text-sm ${textColorClass} mt-3`}>
                      {planData.remainingDays > 0
                        ? `Expires on ${planData.expiryDate}`
                        : "Service access has ended"}
                    </p>
                  </div>
                </div>

                {/* Bandwidth Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900">
                    Bandwidth Specifications
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <Download className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-blue-900">
                          Download Speed
                        </p>
                      </div>
                      <p className="text-4xl font-bold text-blue-900">
                        {planData.downloadSpeed}
                        <span className="text-xl ml-2">Mbps</span>
                      </p>
                    </div>

                    <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                          <Upload className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-green-900">
                          Upload Speed
                        </p>
                      </div>
                      <p className="text-4xl font-bold text-green-900">
                        {planData.uploadSpeed}
                        <span className="text-xl ml-2">Mbps</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-heading font-semibold text-gray-900">
                    Plan Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="text-gray-700">
                        Unlimited Data Usage
                      </span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="text-gray-700">
                        24/7 Customer Support
                      </span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="text-gray-700">No Speed Throttling</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="text-gray-700">
                        Monthly Billing Cycle
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Details */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading">
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Subscription Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {planData.subscriptionDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Expiry Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {planData.expiryDate}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-600 mb-1">Next Renewal</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {planData.nextRenewal}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-600 mb-1">Billing Cycle</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {planData.billingCycle}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-600 mb-1">Auto Renewal</p>
                    <Badge
                      variant="secondary"
                      className={
                        planData.autoRenewal
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }
                    >
                      {planData.autoRenewal ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Link href="/payment/make-payment" className="block">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-ui transition-all hover:scale-[1.02] active:scale-[0.98] group">
                      Renew Service
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full font-ui transition-all hover:border-red-300 hover:text-red-600"
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isExpiredOrSuspended && (
              <Card className="shadow-sm border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
                    <div className="space-y-2">
                      <h4 className="font-heading font-semibold text-red-900">
                        {planData.status === "suspended"
                          ? "Service Suspended"
                          : "Service Expired"}
                      </h4>
                      <p className="text-sm text-red-800">
                        {planData.status === "suspended"
                          ? "Your service has been suspended. Please renew to continue."
                          : "Your service has expired. Renew now to restore access."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}

function ServicePlanSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-5 w-32 mt-2" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
            <div className="pt-4 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
