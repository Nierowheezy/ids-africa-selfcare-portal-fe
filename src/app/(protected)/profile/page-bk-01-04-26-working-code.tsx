"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import { DashboardResponse } from "@/types";
import { toast } from "@/components/ui/use-toast";

export default function ProfilePage() {
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

  // General error fallback
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Failed to load profile
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
          <ProfileSkeleton />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Safe data check: no data or no user
  const user = data?.user;
  const service = data?.service;

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load your profile information. This could be because
              there's no account data or a temporary issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
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

  // Safe profile data
  const profileData = {
    fullName: user.name || "Not provided",
    accountNumber: user.id?.toString() || "N/A",
    accountCreated: user.registrationDate || "N/A",
    accountBalance: user.accountBalance || "N/A",
    servicePlan: service?.plan || "N/A",
    serviceStatus: service?.status || "N/A",
    email: user.email || "Not provided",
    phone: user.phone || "Not provided",
    address: user.address || "Not provided",
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
          <span className="text-gray-600">My Profile</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar + Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-sm">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src="/images/profile.png"
                      alt={profileData.fullName}
                    />
                    <AvatarFallback className="text-4xl">
                      {profileData.fullName.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-gray-900">
                      {profileData.fullName}
                    </h2>
                    <Badge
                      variant="secondary"
                      className={`${
                        profileData.serviceStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : profileData.serviceStatus === "unknown" ||
                              !profileData.serviceStatus
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-100 text-red-700"
                      } hover:opacity-90`}
                    >
                      {profileData.serviceStatus === "unknown" ||
                      !profileData.serviceStatus
                        ? "Service Unavailable"
                        : profileData.serviceStatus.charAt(0).toUpperCase() +
                          profileData.serviceStatus.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Member since {profileData.accountCreated}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Summary Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading">
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Account Balance</span>
                  <span className="font-semibold text-green-700">
                    N {profileData.accountBalance}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Service Plan</span>
                  <span className="font-semibold text-gray-900">
                    {profileData.servicePlan}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Account Number
                    </p>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <p className="font-mono font-semibold text-gray-900">
                        {profileData.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Account Created
                    </p>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <p className="text-gray-900">
                        {profileData.accountCreated}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Email Address
                  </p>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Mobile Phone
                  </p>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-900">{profileData.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-900">{profileData.address}</p>
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

function ProfileSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-sm">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-gray-700">{children}</p>;
}
