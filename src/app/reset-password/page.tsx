"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1500);
  };

  return (
    <Card className="shadow-xl border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-heading font-bold">
          Reset Password
        </CardTitle>
        <CardDescription className="text-base">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 animate-in fade-in duration-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-ui text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          <div className="text-center pt-4">
            <Link
              href="/login"
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Back to login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <Card className="shadow-xl border-gray-200">
                <CardContent className="py-16 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </CardContent>
              </Card>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
