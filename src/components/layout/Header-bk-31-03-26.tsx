"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // ← added useRouter
import { Menu, X, ChevronDown, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter(); // ← added for redirect after logout
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [notificationCount] = useState(3);

  const isActive = (path: string) => pathname === path;
  const isPaymentActive = pathname?.startsWith("/payment");

  const handleLogout = async () => {
    try {
      await logout(); // clears cookies + resets store
      router.push("/login"); // ← redirect to login page
      router.refresh(); // optional: force refresh any server components
    } catch (err) {
      console.error("Logout failed:", err);
      // Optional: add toast error here later if needed
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/images/ids-logo.png"
              alt="IDS Africa"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className={`px-4 py-2 text-sm font-ui font-medium transition-colors rounded-md ${
                  isActive("/dashboard")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={`px-4 py-2 text-sm font-ui font-medium transition-colors rounded-md ${
                  isActive("/profile")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                My Profile
              </Link>
              <Link
                href="/service-plan"
                className={`px-4 py-2 text-sm font-ui font-medium transition-colors rounded-md ${
                  isActive("/service-plan")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                Service Plan
              </Link>
              <Link
                href="/tickets"
                className={`px-4 py-2 text-sm font-ui font-medium transition-colors rounded-md ${
                  isActive("/tickets")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                Tickets
              </Link>

              {/* Payment Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center px-4 py-2 text-sm font-ui font-medium transition-colors rounded-md ${
                      isPaymentActive
                        ? "text-red-600 bg-red-50"
                        : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    }`}
                  >
                    Payment
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48 animate-in fade-in-0 zoom-in-95 duration-200"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/payment/history" className="cursor-pointer">
                      Payment History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/payment/make-payment"
                      className="cursor-pointer"
                    >
                      Make Payment
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          )}

          {/* Right Side - User Menu or Login */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                      <Bell className="h-5 w-5" />
                      {notificationCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 hover:bg-red-600">
                          {notificationCount}
                        </Badge>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 animate-in fade-in-0 zoom-in-95 duration-200"
                  >
                    <div className="px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="py-2">
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            Service Renewal Reminder
                          </span>
                          <span className="text-xs text-gray-500">
                            Your subscription expires in 3 days
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            Payment Received
                          </span>
                          <span className="text-xs text-gray-500">
                            NGN 12,000 payment confirmed
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            New Feature Available
                          </span>
                          <span className="text-xs text-gray-500">
                            Check out our new AI assistant
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="px-4 py-2 text-center text-red-600 cursor-pointer">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <button className="flex items-center space-x-2 rounded-full hover:opacity-80 transition-opacity">
                      <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-red-100 transition-all">
                        <AvatarImage
                          src={user?.avatar ?? "/images/profile.png"}
                          alt={user?.name ?? "User"}
                        />
                        <AvatarFallback className="bg-red-100 text-red-600">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || "User"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 animate-in fade-in-0 zoom-in-95 duration-200"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={handleLogout} // ← now calls function with redirect
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-ui transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                className={`px-4 py-3 text-sm font-ui font-medium rounded-md ${
                  isActive("/dashboard")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={`px-4 py-3 text-sm font-ui font-medium rounded-md ${
                  isActive("/profile")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/service-plan"
                className={`px-4 py-3 text-sm font-ui font-medium rounded-md ${
                  isActive("/service-plan")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Service Plan
              </Link>
              <Link
                href="/tickets"
                className={`px-4 py-3 text-sm font-ui font-medium rounded-md ${
                  isActive("/tickets")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Tickets
              </Link>

              {/* Payment Section in Mobile */}
              <div className="px-4 py-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </span>
              </div>
              <Link
                href="/payment/history"
                className={`px-4 py-3 text-sm font-ui font-medium rounded-md ml-4 ${
                  isActive("/payment/history")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Payment History
              </Link>
              <Link
                href="/payment/make-payment"
                className={`px-4 py-3 text-sm font-ui font-medium rounded-md ml-4 ${
                  isActive("/payment/make-payment")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Make Payment
              </Link>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.avatar ?? "/images/profile.png"}
                      alt={user?.name}
                    />
                    <AvatarFallback className="bg-red-100 text-red-600">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout(); // ← calls function with redirect
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-ui font-medium text-red-600 hover:bg-red-50 rounded-md block w-full text-left"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
