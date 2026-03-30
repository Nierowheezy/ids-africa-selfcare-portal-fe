import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface LoginActivityCardProps {
  lastLoginDate: string; // absolute date: "22nd January 2026"
  lastLoginTime: string; // relative: "3 days ago @ 13:42"
}

export function LoginActivityCard({
  lastLoginDate,
  lastLoginTime,
}: LoginActivityCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-heading text-gray-700">
          Login Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Last login</p>
            <p className="text-lg font-semibold text-gray-900">
              {lastLoginTime}
            </p>{" "}
            {/* Main: relative time */}
            <p className="text-sm text-gray-500 italic">{lastLoginDate}</p>{" "}
            {/* Subtitle: absolute date */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
