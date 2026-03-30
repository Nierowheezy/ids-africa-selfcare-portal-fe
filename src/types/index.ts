// src/types/index.ts
export interface User {
  customerId?: number;
  customerUid?: string;
  name?: string;
  email?: string;
  avatar?: string;
  // phone?: string;
  // createdAt?: string;
}

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
  // paymentHistory?: any[]; // add later when we fetch /payments/history
}
