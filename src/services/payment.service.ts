import type { InvoiceStatus } from "@/common/enums/InvoiceStatus.enum";
import type { PurchaseOrderPaymentStatus } from "@/common/enums/PurchaseOrderstatus.enum";
import type { PaymentDirection, PaymentMethod } from "@/common/enums/Payment.enum";
import { fetchWithAuth } from "@/common/utils";

export interface PaymentDto {
  paymentDirection: PaymentDirection;
  amount: number;
  paymentMethod: PaymentMethod;
  invoiceId?: string;
  purchaseOrderId?: string;
  paymentDate: string;
  transactionId?: string;
  notes?: string;
}

export interface GetPaymentQueryDto {
  page?: number;
  limit?: number;
  paymentDirection?: PaymentDirection;
  search?: string;
  paymentMethod?: PaymentMethod;
}

export interface PaymentListItem {
  paymentId: string;
  paymentNumber: string;
  paymentDirection: PaymentDirection;
  customerOrSupplierName: string;
  orderNumber: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentListResponse {
  records: PaymentListItem[];
  meta: PaginationMeta;
}

export interface PaymentDetails {
  paymentId: string;
  paymentNumber: string;
  amount: number;
  paymentDate: string; 
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentDirection: PaymentDirection;
  createdAt: string; 
  updatedAt: string; 
  entityInformation: PaymentEntityInformation;
  relatedInvoice?: RelatedInvoice;
  relatedPurchaseOrder?: RelatedPurchaseOrder;
}

export interface PaymentEntityInformation {
  name: string;
  email: string;
  phone: string;
}

export interface RelatedInvoice {
  invoiceId: string;
  invoiceNumber: string;
  issueDate: string; 
  dueDate: string; 
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
}

export interface RelatedPurchaseOrder {
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  orderDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: PurchaseOrderPaymentStatus;
}

export const createPayment = async(payload: PaymentDto) => {
    return await fetchWithAuth('payments',{
        method: 'POST',
        body: payload
    })
}

export const getPaymentRecords = async(query: GetPaymentQueryDto): Promise<PaymentListResponse> => {
    return await fetchWithAuth('payments',{query})
}

export const getPaymentDetails = async(paymentId: string): Promise<PaymentDetails> => {
    return await fetchWithAuth(`payments/${paymentId}`)
}

export const downloadPaymentRecipt = async(paymentId: string) => {
    return await fetchWithAuth(`payments/${paymentId}/download-recipt`,{responseType: 'blob'})
}