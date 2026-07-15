import type { SalesOrderStatus } from "@/common/enums/SalesOrderStatus.enum";
import { fetchWithAuth } from "@/common/utils";

export interface CreateSalesOrderRequest {
  customerId: string;
  warehouseId: string;
  orderDate: string;
  items: CreateSalesOrderItem[];
}

export interface CreateSalesOrderItem {
  productId: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
}

export interface UpdateSalesOrderStatus {
    status: SalesOrderStatus
}

export interface GetSalesOrderQueryDto {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: SalesOrderStatus;
  search?: string;
}

export interface SalesOrderListResponse {
  records: SalesOrderListItem[];
  meta: PaginationMeta;
}

export interface SalesOrderOptionQueryDto {
  customerId?: string;
}

export interface SalesOrderListItem {
  salesOrderId: string;
  salesOrderNumber: string;
  customerName: string;
  warehouseName: string;
  status: SalesOrderStatus;
  orderDate: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SalesOrderDetailsResponse {
  salesOrderId: string;
  salesOrderNumber: string;
  orderDate: string;
  orderStatus: SalesOrderStatus;
  totalAmount: number;
  customerInfo: CustomerInfo;
  warehouseInfo: WarehouseInfo;
  items: SalesOrderItem[];
}

export interface CustomerInfo {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export interface WarehouseInfo {
  warehouseName: string;
  warehouseAddress: string;
  warehouseContactPerson: string;
  warehousePhone: string;
}

export interface SalesOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface SalesOrderOptions {
    label: string
    value: string
}

export const createSalesOrder = async(payload: CreateSalesOrderRequest) => {
    return await fetchWithAuth('sales-orders',{
        method: 'POST',
        body: payload
    })
}

export const updateSalesOrderStatus = async(salesOrderId: string, payload: UpdateSalesOrderStatus): Promise<{message: string}> => {
    return await fetchWithAuth(`sales-orders/${salesOrderId}`,{
        method: 'PATCH',
        body: payload
    })
}

export const getSalesOrderOptions = async(query?: SalesOrderOptionQueryDto): Promise<SalesOrderOptions[]> => {
    return await fetchWithAuth(`sales-orders/options`,{query})
}

export const getSalesOrders = async(getSalesOrderQueryDto: GetSalesOrderQueryDto): Promise<SalesOrderListResponse> => {
    return await fetchWithAuth(`sales-orders`,{query: getSalesOrderQueryDto})
}

export const getSlaesOrderDetails = async(salesOrderId: string): Promise<SalesOrderDetailsResponse> => {
    return await fetchWithAuth(`sales-orders/details/${salesOrderId}`)
}

export const downloadSalesOrderPDF = async(salesOrderId: string) => {
    return await fetchWithAuth(`sales-orders/${salesOrderId}/download-pdf`,{responseType: 'blob'})
}