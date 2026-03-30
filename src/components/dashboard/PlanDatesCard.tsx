import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface PlanDatesCardProps {
  subscriptionDate: string;
  expiryDate: string;
  nextRenewal: string;
  isSuspended?: boolean;
}

export function PlanDatesCard({
  subscriptionDate,
  expiryDate,
  nextRenewal,
  isSuspended = false,
}: PlanDatesCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-heading text-gray-700">Plan dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Service subscription</p>
            <p className="text-lg font-semibold text-gray-900">{subscriptionDate}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Service expiry</p>
            <p className="text-lg font-semibold text-gray-900">{expiryDate}</p>
          </div>

          {isSuspended ? (
            <div className="mt-4 p-4 rounded-lg bg-red-900 text-white">
              <div className="flex items-start space-x-2">
                <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Next renewal</p>
                  <p className="text-sm font-medium">service is suspended</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Next renewal</p>
              <p className="text-base font-semibold text-gray-900">{nextRenewal}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
