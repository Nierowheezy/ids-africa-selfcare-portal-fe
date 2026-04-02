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
    message?: string; // Support for "You have a pending payment..." message
    amount?: number;
    currency?: string;
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
  /**
   * Get payment history from UCRM
   */
  async getHistory(page = 1, limit = 10): Promise<PaymentHistoryResponse> {
    try {
      const response = await api.get<PaymentHistoryResponse>(
        "/payments/history",
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

  /**
   * Get the most recent payment
   */
  async getLastPayment(): Promise<Payment | null> {
    try {
      const history = await paymentService.getHistory(1, 1);
      return history.data[0] || null;
    } catch {
      return null;
    }
  },

  /**
   * Initialize Paystack Payment (with pending payment reuse support)
   */
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
        "/payments/initialize",
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

      const result = (response.data as PaymentInitSuccessResponse).data;

      // Log reuse case for debugging
      if (result.message) {
        console.info("[Payment Reuse]", result.message);
      }

      return result;
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize Paystack payment";

      throw new Error(errorMsg);
    }
  },

  /**
   * Get payment status for success page (used for polling)
   */
  /**
   * Get payment status for success page (used for polling)
   * Updated to match the improved success controller
   */
  /**
   * Get payment status for success page (used for polling)
   * Updated to match the improved success controller
   */
  async getPaymentStatus(reference: string): Promise<any> {
    if (!reference) {
      throw new Error("No reference provided");
    }

    try {
      const response = await api.get(
        `/payment/success?reference=${encodeURIComponent(reference)}`,
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.error || "Failed to fetch payment status",
        );
      }

      const data = response.data.data;

      // Robust normalization and fallback logic
      return {
        ...data,

        // Ensure critical fields always have safe defaults
        ucrm_sync_status: data.ucrm_sync_status ?? "pending",

        // isPaid: Consider it paid if status is paid OR verification succeeded
        isPaid:
          data.isPaid ??
          (data.status === "paid" ||
            data.verification_status === "verified" ||
            data.status?.toUpperCase() === "PAID"),

        // isFullySynced: True only when UCRM sync is explicitly completed
        isFullySynced:
          data.isFullySynced ??
          (data.ucrm_sync_status === "completed" ||
            data.ucrm_sync_status?.toLowerCase() === "completed"),

        // Error detection
        hasSyncError:
          data.hasSyncError ??
          (data.ucrm_sync_status === "failed" ||
            (data.ucrm_error_message &&
              !data.ucrm_error_message.toLowerCase().includes("successful") &&
              !data.ucrm_error_message
                .toLowerCase()
                .includes("already processed"))),

        // Amount normalization
        amount: data.amount || data.paid_amount || 0,

        // Extra safety fields
        reference: data.reference || reference,
        status: data.status || "unknown",
      };
    } catch (error: any) {
      console.error(
        "Payment status fetch failed for reference:",
        reference,
        error,
      );

      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to verify payment status",
      );
    }
  },
};
