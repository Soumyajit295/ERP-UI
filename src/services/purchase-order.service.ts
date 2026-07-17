import type { PurchaseOrderPaymentStatus, PurchaseOrderStatus } from "@/common/enums/PurchaseOrderstatus.enum";
import { fetchWithAuth } from "@/common/utils";

export interface CreatePurchaseOrderDto {
  supplierId: string;
  warehouseId: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  items: CreatePurchaseOrderItemDto[];
}

export interface UpdatePurchaseOrderDto {
    status: PurchaseOrderStatus;
}

export interface CreatePurchaseOrderItemDto {
  productId: string;
  quantity: number;
  costPrice: number;
}

export interface GetPurchaseOrderQueryDto {
  page?: number;
  limit?: number;
  supplierId?: string;
  warehouseId?: string;
  status?: PurchaseOrderStatus;
  search?: string;
}

export interface PurchaseOrderOptionQueryDto {
  supplierId?: string;
  status?: PurchaseOrderStatus[]
}

export interface PurchaseOrderOptions {
    label: string
    value: string
}

export interface PurchaseOrderListResponse {
  records: PurchaseOrderListItem[];
  meta: PaginationMeta;
}

export interface PurchaseOrderListItem {
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  supplierName: string;
  warehouseName: string;
  status: PurchaseOrderStatus;
  totalCost: number;
  balanceAmount: number;
  paymentStatus: PurchaseOrderPaymentStatus;
  orderDate: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PurchaseOrderDetailsResponse {
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  purchaseOrderStatus: PurchaseOrderStatus;
  paymentStatus: PurchaseOrderPaymentStatus;
  purchaseOrderDate: string;
  purchaseOrderTotalPrice: number;
  paidAmount: number;
  balanceAmount: number;
  supplierInformation: SupplierInformation;
  deliveryInformation: DeliveryInformation;
  productItems: PurchaseOrderProductItem[];
}

export interface SupplierInformation {
  supplierName: string;
  supplierContactPerson: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
}

export interface DeliveryInformation {
  wareHouseName: string;
  wareHouseAddress: string;
  wareHouseContactPerson: string;
  wareHousePhone: string;
}

export interface PurchaseOrderProductItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const createPurchaseOrder = async(payload: CreatePurchaseOrderDto) => {
    return await fetchWithAuth('purchase-orders',{
        method: 'POST',
        body: payload
    })
}

export const updatePurchaseOrderStatus = async(purchaseOrderId: string,payload: UpdatePurchaseOrderDto): Promise<{message: string}> => {
    return await fetchWithAuth(`purchase-orders/update-status/${purchaseOrderId}`,{
        method: 'PATCH',
        body: payload
    })
}

export const deletePurchaseOrder = async(purchaseOrderId: string): Promise<{message: string}> => {
    return await fetchWithAuth(`purchase-orders/${purchaseOrderId}`,{method: 'DELETE'})
}

export const getPurchaseOrderOptions = async(query?: PurchaseOrderOptionQueryDto): Promise<PurchaseOrderOptions[]> => {
    return await fetchWithAuth(`purchase-orders/options`,{query})
}

export const getPurchaseOrders = async(getPurchaseOrderQuery: GetPurchaseOrderQueryDto): Promise<PurchaseOrderListResponse> => {
    return await fetchWithAuth('purchase-orders',{query: getPurchaseOrderQuery})
}

export const getPurchaseOrderDetails = async(purchaseOrderId: string): Promise<PurchaseOrderDetailsResponse> => {
    return await fetchWithAuth(`purchase-orders/${purchaseOrderId}`)
}

export const downloadPurchaseOrder = async(purchaseOrderId: string): Promise<Blob> => {
    return await fetchWithAuth(`purchase-orders/${purchaseOrderId}/download-pdf`, {
        responseType: "blob",
    })
}