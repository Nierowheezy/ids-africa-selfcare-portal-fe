"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  paymentService,
  Payment,
  PaymentHistoryResponse,
} from "@/services/paymentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  CreditCard,
  Building2,
  ArrowUpDown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Payment>("createdDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const limit = 10;

  const { data, isLoading, isError, error, refetch } =
    useQuery<PaymentHistoryResponse>({
      queryKey: ["paymentHistory", page, limit],
      queryFn: () => paymentService.getHistory(page, limit),
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

  // === Payment History Unavailable (CRM failed) - Clean Fallback ===
  if (isError || !data?.success) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center space-x-2 text-sm">
            <Link
              href="/dashboard"
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Payment History</span>
          </div>

          <Card className="shadow-sm max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-3">
                Payment History Unavailable
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't load your payment history right now.
                <br />
                This is usually temporary while we connect to our payment
                system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => refetch()} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Page
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  const payments = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch = (
        payment.providerPaymentId || String(payment.id || "")
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesMethod =
        methodFilter === "all" ||
        (payment.methodId || "").toLowerCase() === methodFilter.toLowerCase();

      return matchesSearch && matchesMethod;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue ?? "").toLowerCase();
      const bStr = String(bValue ?? "").toLowerCase();
      return sortDirection === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getMethodIcon = (methodId?: string | null) => {
    const lowerMethod = (methodId || "").toLowerCase();

    if (lowerMethod === "d8c1eae9-d41d-479f-aeaf-38497975d7b3")
      return <CreditCard className="h-4 w-4 text-blue-600" />;

    if (lowerMethod === "4145b5f5-3bbc-45e3-8fc5-9cda970c62fb")
      return <Building2 className="h-4 w-4 text-green-600" />;

    return null;
  };

  const getMethodDisplay = (methodId?: string | null) => {
    const lowerMethod = (methodId || "").toLowerCase();

    if (lowerMethod === "d8c1eae9-d41d-479f-aeaf-38497975d7b3")
      return "Paystack";
    if (lowerMethod === "4145b5f5-3bbc-45e3-8fc5-9cda970c62fb")
      return "Bank Transfer";

    return "Unknown";
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/dashboard"
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Payment History</span>
          </div>
          <Link href="/payment/make-payment">
            <Button className="bg-red-600 hover:bg-red-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
              Make Payment
            </Button>
          </Link>
        </div>

        <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-2xl font-heading">
                Payment History
              </CardTitle>
              <Button variant="outline" size="sm" className="w-fit">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex gap-3">
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-[160px] h-11">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="d8c1eae9-d41d-479f-aeaf-38497975d7b3">
                      Paystack
                    </SelectItem>
                    <SelectItem value="4145b5f5-3bbc-45e3-8fc5-9cda970c62fb">
                      Bank Transfer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table / States */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Payment History
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't made any payments yet. Make your first payment to
                  see history here.
                </p>
                <Link href="/payment/make-payment">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Make Payment
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead
                          className="cursor-pointer select-none"
                          onClick={() => handleSort("createdDate")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Date</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment, index) => (
                        <TableRow
                          key={payment.id}
                          className="animate-in fade-in slide-in-from-left-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="font-medium">
                            {format(
                              new Date(payment.createdDate),
                              "do MMM yyyy",
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {payment.providerPaymentId || payment.id}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₦{payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getMethodIcon(payment.methodId)}
                              <span className="capitalize">
                                {getMethodDisplay(payment.methodId)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 capitalize">
                              Success
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {total > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, total)} of {total} payments
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
