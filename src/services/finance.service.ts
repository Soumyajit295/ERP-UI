import type { PaymentDirection } from "@/common/enums/Payment.enum";
import { fetchWithAuth } from "@/common/utils";

export interface FinanceDashboardResponseDto {
  cashIn: number;
  cashOut: number;
  receivables: number;
  openPayables: number;
  recentPayments: RecentPaymentDto[];
}

export interface RecentPaymentDto {
  paymentId: string;
  paymentNumber: string;
  paymentType: PaymentDirection;
  paymentDate: string; 
  paymentAmount: number;
}

export const getFinanceDashboardData = async(): Promise<FinanceDashboardResponseDto> => {
    return await fetchWithAuth('finance/dashboard')
}