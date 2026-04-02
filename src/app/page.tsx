"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserCircle, CreditCard, Headphones, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore(); // ← added isLoading

  // Run checkAuth only once on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect if user is authenticated (after check finishes)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const pathname = window.location.pathname;

    if (pathname === "/" && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Show loading spinner while checking auth status
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 leading-tight">
                  IDS Networks
                </h1>
                <p className="text-xl md:text-2xl text-gray-700">
                  Your gateway to truely
                  <br />
                  <span className="text-red-600 font-semibold">
                    UNLIMITED
                  </span>{" "}
                  Internet Access
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors duration-200">
                      <UserCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                        Manage your profile
                      </h3>
                      <p className="text-gray-600 text-sm">
                        View plan details, change or upgrade service plan &
                        more.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="flex items-start space-x-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors duration-200">
                      <CreditCard className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                        Renew subscription
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Renew your service subscription, settle invoices
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="flex items-start space-x-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors duration-200">
                      <Headphones className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                        24/7 help and support
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Get 24/7 real-time help and support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-ui text-base px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Log in
                </Button>
              </Link>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative z-10 transform hover:scale-[1.02] transition-transform duration-500 ease-out">
                <Image
                  src="/images/ids-africa-wifi-network.png"
                  alt="IDS Africa WiFi Device"
                  width={600}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50 -z-10" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
