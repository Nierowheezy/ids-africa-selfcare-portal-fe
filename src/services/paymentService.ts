// src/services/paymentService.ts
import api from "@/lib/api";

export interface Payment {
  id: number;
  clientId: number;
  methodId: string;
  checkNumber: string | null;
  createdDate: string;
  amount: number;
  currencyCode: string;
  note: string;
  receiptSentDate: string | null;
  providerName: string | null;
  providerPaymentId: string | null;
  providerPaymentTime: string | null;
  creditAmount: number;
  userId: number;
  attributes: any[];
  paymentCovers?: Array<{
    id: number;
    invoiceId: number;
    paymentId: number;
    creditNoteId: number | null;
    refundId: number | null;
    amount: number;
  }>;
}

export interface PaymentHistoryResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  data: Payment[];
}

export interface PaymentInitSuccessResponse {
  success: true;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
    internal_reference?: string;
  };
}

export interface PaymentInitErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export type PaymentInitResponse =
  | PaymentInitSuccessResponse
  | PaymentInitErrorResponse;

export const paymentService = {
  async getHistory(page = 1, limit = 10): Promise<PaymentHistoryResponse> {
    try {
      const response = await api.get<PaymentHistoryResponse>(
        "/api/payments/history",
        {
          params: { page, limit },
        },
      );

      if (!response.data?.success) {
        throw new Error("Failed to fetch payment history");
      }

      return response.data;
    } catch (error: any) {
      const serverError =
        error.response?.data?.error || error.response?.data?.message;
      throw new Error(
        serverError || error.message || "Failed to load payment history",
      );
    }
  },

  async getLastPayment(): Promise<Payment | null> {
    try {
      const history = await paymentService.getHistory(1, 1);
      return history.data[0] || null;
    } catch {
      return null;
    }
  },

  async initializePayment(
    amount: number,
    email: string,
  ): Promise<PaymentInitSuccessResponse["data"]> {
    if (!amount || amount <= 0) {
      throw new Error("Valid amount greater than 0 is required");
    }

    if (!email || !email.trim().includes("@")) {
      throw new Error("Valid email address is required");
    }

    try {
      const response = await api.post<PaymentInitResponse>(
        "/api/payments/initialize",
        {
          amount: Number(amount),
          email: email.trim().toLowerCase(),
        },
      );

      if (!response.data.success) {
        const errData = response.data as PaymentInitErrorResponse;
        throw new Error(
          errData.error || errData.message || "Failed to initialize payment",
        );
      }

      return (response.data as PaymentInitSuccessResponse).data;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize Paystack payment";

      throw new Error(errorMsg);
    }
  },

  async getPaymentStatus(reference: string): Promise<any> {
    if (!reference) {
      throw new Error("No reference provided");
    }

    try {
      const response = await api.get(
        `/orders/success?reference=${encodeURIComponent(reference)}`,
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.error || "Failed to fetch payment status",
        );
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to verify payment status",
      );
    }
  },
};
