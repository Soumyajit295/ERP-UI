import type { InvoiceStatus } from "@/common/enums/InvoiceStatus.enum";
import { fetchWithAuth } from "@/common/utils";

export interface CreateInvoiceDto {
  customerId: string;
  salesOrderId: string;
  issueDate: string; 
  dueDate: string;   
  notes: string;
}

export interface UpdateInvoiceStatus {
  dueDate: string;
  notes: string;
}

export interface GetInvoiceQueryDto {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: InvoiceStatus;
  search?: string;
}

export interface InvoiceListResponse {
  records: InvoiceListItem[];
  meta: PaginationMeta;
}

export interface InvoiceListItem {
  invoiceId: string;
  invoiceNumber: string;
  salesOrderNumber: string;
  customerName: string;
  customerId: string;
  salesOrderId: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InvoiceDetailsResponse {
  invoiceId: string;
  invoiceNumber: string;
  customername: string;
  customerEmail: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  salesOrderId: string;
  notes: string;
  items: InvoiceItem[];
}

export interface CustomerInfo {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
}

export interface InvoiceItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export const createInvoice = async (payload: CreateInvoiceDto) => {
  return await fetchWithAuth("invoice", {
    method: "POST",
    body: payload,
  });
};

export const updateInvoiceStatus = async (
  invoiceId: string,
  payload: UpdateInvoiceStatus
): Promise<{ message: string }> => {
  return await fetchWithAuth(`invoice/${invoiceId}`, {
    method: "PATCH",
    body: payload,
  });
};

export const getInvoices = async (
  query: GetInvoiceQueryDto
): Promise<InvoiceListResponse> => {
  return await fetchWithAuth("invoice", { query });
};

export const getInvoiceDetails = async (
  invoiceId: string
): Promise<InvoiceDetailsResponse> => {
  return await fetchWithAuth(`invoice/details/${invoiceId}`);
};

export const downloadInvoice = async (invoiceId: string) => {
  return await fetchWithAuth(`invoice/${invoiceId}/download-pdf`, {
    responseType: "blob",
  });
};
