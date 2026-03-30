"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronRight, Ticket, Plus, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function TicketsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API fetch (replace with real API later)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Simulate no tickets - you can remove this when you add real data fetch
      // setTickets([]); // or fetch real tickets
    }, 1200);

    // Simulate error (uncomment to test)
    // setTimeout(() => {
    //   setLoading(false);
    //   setError("Failed to load tickets. Please try again.");
    // }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock tickets array (replace with real data fetch when ready)
  const tickets: Array<{
    id: string;
    title: string;
    status: "open" | "closed" | "pending";
    priority: "low" | "medium" | "high";
    createdAt: string;
    category: string;
  }> = [];

  // Handle session expired / auth error (add real check when you have auth)
  if (error?.includes("401") || error?.includes("unauthorized")) {
    toast({
      variant: "destructive",
      title: "Session Expired",
      description: "Please log in again.",
    });
    router.push("/login");
    return null;
  }

  // General error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Failed to load tickets
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1200);
                }}
              >
                Retry
              </Button>
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
          <span className="text-gray-600">Tickets</span>
        </div>

        <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Support Tickets
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your support tickets
            </p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-ui transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-5 w-5 mr-2" />
            New Ticket
          </Button>
        </div>

        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        ) : tickets.length === 0 ? (
          <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <Ticket className="h-12 w-12 text-green-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-heading font-semibold text-gray-900">
                    No Open Tickets
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You don&apos;t have any support tickets at the moment. If
                    you need help, create a new ticket and our team will assist
                    you promptly.
                  </p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white font-ui px-8 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-heading font-semibold text-gray-900">
                          {ticket.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={
                            ticket.status === "open"
                              ? "bg-blue-100 text-blue-700"
                              : ticket.status === "closed"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {ticket.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            ticket.priority === "high"
                              ? "border-red-300 text-red-700"
                              : ticket.priority === "medium"
                                ? "border-orange-300 text-orange-700"
                                : "border-gray-300 text-gray-700"
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>#{ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>{ticket.createdAt}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="font-ui">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
