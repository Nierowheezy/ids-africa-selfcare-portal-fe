"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, checkAuth } = useAuthStore();

  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    console.log("🔵 [LoginPage] Login attempt started...");

    try {
      await login(accountNumber.trim(), password);

      console.log("✅ [LoginPage] Login successful");

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Important: Refresh auth state before redirect
      await checkAuth();

      // Reliable redirect
      console.log("🔵 [LoginPage] Redirecting to /dashboard...");
      router.replace("/dashboard");
    } catch (err: any) {
      console.error("❌ [LoginPage] Login failed:", err?.message || err);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err?.message || "Invalid account number or password",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail("");
      toast({
        title: "Reset Link Sent",
        description: "Check your email for instructions.",
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="shadow-xl border-gray-200 overflow-hidden">
            <CardContent className="p-8">
              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-8">
                Login to your dashboard
              </h1>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="accountNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="Please provide your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-200 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-200"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-auto h-11 bg-red-600 hover:bg-red-700 text-white font-ui text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>

                <p className="text-sm text-gray-600 pt-4">
                  By continuing, you agree to the FTTH Service{" "}
                  <Link
                    href="#"
                    className="text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
                  >
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
                  >
                    Privacy Notice
                  </Link>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">
              Let's get you back in
            </DialogTitle>
            <DialogDescription>
              Enter your registered email address and we'll send you a reset
              link
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Reset form content remains the same */}
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Please provide your registered email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="h-12 border-gray-300"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-ui transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Go back
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
