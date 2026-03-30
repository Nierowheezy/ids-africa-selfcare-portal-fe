import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, Upload, ArrowRight } from "lucide-react";

interface ServicePlanCardProps {
  planName: string;
  status: "active" | "suspended" | "ended" | "inactive"; // ← full union from backend
  downloadSpeed: string;
  uploadSpeed: string;
}

export function ServicePlanCard({
  planName,
  status,
  downloadSpeed,
  uploadSpeed,
}: ServicePlanCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-heading text-gray-700">
          Service Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current plan</p>
              <h3 className="text-2xl font-heading font-bold text-gray-900">
                {planName}
              </h3>
            </div>
            <Badge
              variant={
                status === "active"
                  ? "default"
                  : status === "suspended"
                    ? "destructive"
                    : status === "ended"
                      ? "secondary"
                      : "outline"
              }
              className={
                status === "active"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : status === "suspended"
                    ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                    : status === "ended"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-sm text-gray-600 font-medium">Plan details</p>
            <div className="flex items-center space-x-2 text-gray-700">
              <Download className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Download</span>
              <span className="text-sm font-mono font-semibold">
                {downloadSpeed} Mbps
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Upload className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Upload</span>
              <span className="text-sm font-mono font-semibold">
                {uploadSpeed} Mbps
              </span>
            </div>
          </div>
        </div>

        <Link href="/service-plan">
          <Button
            variant="ghost"
            className="w-full text-gray-600 hover:text-red-600 group transition-colors"
          >
            See details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
