// src/services/dashboardService.ts
import api from "@/lib/api";

export interface DashboardResponse {
  user: {
    id: number;
    name: string;
    username: string | null;
    email: string;
    phone: string;
    address: string;
    lastLogin: string;
    daysAgo: string;
    registrationDate: string;
    accountBalance: string;
    customerUid: string;
  };
  service: {
    plan: string;
    upload: number;
    download: number;
    from: string;
    to: string;
    renewal: string;
    status: "active" | "suspended" | "ended" | "inactive";
    left: number | string;
  };
  // Add payment history later if needed
}

export const dashboardService = {
  /**
   * Fetch complete dashboard data from /api/app/dashboard
   */
  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get("/api/app/dashboard");

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch dashboard data",
      );
    }

    return response.data.data;
  },
};
