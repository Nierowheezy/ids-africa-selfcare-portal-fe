import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

interface PaymentSectionCardProps {
  planName: string;
  planExpiry: string;
  isSuspended?: boolean;
}

export function PaymentSectionCard({
  planName,
  planExpiry,
  isSuspended = false,
}: PaymentSectionCardProps) {
  return (
    <Card className="shadow-sm bg-gradient-to-br from-gray-700 to-gray-900 text-white border-none hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-300">You are currently on</p>
          <h3 className="text-3xl font-heading font-bold">{planName}</h3>
          {isSuspended ? (
            <p className="text-sm text-orange-300">Plan expires - ...</p>
          ) : (
            <p className="text-sm text-gray-300">Plan expires - {planExpiry}</p>
          )}
        </div>

        <Link href="/payment/make-payment">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-ui transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          >
            Make Payment
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

interface PaymentHistoryCardProps {
  lastPaymentDate?: string | null;
  lastPaymentAmount?: number | null;
  methodId?: string | null;
  note?: string | null;
  creditAmount?: number | null;
}

export function PaymentHistoryCard({
  lastPaymentDate,
  lastPaymentAmount,
  methodId,
  note,
  creditAmount,
}: PaymentHistoryCardProps) {
  const hasPayment = lastPaymentDate != null && lastPaymentAmount != null;

  const formattedDate = lastPaymentDate
    ? format(new Date(lastPaymentDate), "do MMMM yyyy")
    : "N/A";

  // Infer status (same logic, but methodId is now used in history page)
  const inferStatus = () => {
    const lowerNote = (note || "").toLowerCase();

    if (
      lowerNote.includes("paystack") ||
      lowerNote.includes("received") ||
      (creditAmount && creditAmount > 0)
    ) {
      return "success";
    }

    return "unknown";
  };

  const inferredStatus = inferStatus();

  const getStatusBadge = () => {
    const styles = {
      success: "bg-green-100 text-green-700 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      failed: "bg-red-100 text-red-700 hover:bg-red-100",
      unknown: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    };
    const key = inferredStatus as keyof typeof styles;
    return styles[key] || styles.unknown;
  };

  const displayStatus =
    inferredStatus === "unknown"
      ? "Success"
      : inferredStatus.charAt(0).toUpperCase() + inferredStatus.slice(1);

  const getMethodDisplay = (methodId?: string | null) => {
    const lowerMethod = (methodId || "").toLowerCase();

    if (lowerMethod === "d8c1eae9-d41d-479f-aeaf-38497975d7b3")
      return "Paystack";
    if (lowerMethod === "4145b5f5-3bbc-45e3-8fc5-9cda970c62fb")
      return "Bank Transfer";

    return "Unknown";
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className="bg-purple-600 text-white py-3 px-6 rounded-lg">
            <h3 className="text-lg font-heading font-semibold">
              Payment History
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm text-gray-600">Your last payment</p>

            {hasPayment ? (
              <>
                <div className="flex items-baseline space-x-3">
                  <p className="text-4xl font-bold text-gray-900">
                    ₦{(lastPaymentAmount ?? 0).toLocaleString()}
                  </p>
                  <Badge className={getStatusBadge()}>{displayStatus}</Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              </>
            ) : (
              <p className="text-xl font-semibold text-gray-900">
                No payments yet
              </p>
            )}
          </div>

          <Link href="/payment/history">
            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-red-600 mt-4 group transition-colors"
            >
              View Payments
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
