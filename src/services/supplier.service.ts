import { fetchWithAuth } from "@/common/utils";

export interface SupplierListResponse {
  records: Supplier[];
  meta: PaginationMeta;
}

export interface Supplier {
  supplierId: string;
  supplierName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string | null;
  isActive: boolean;
  totalOrders: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetSupplierQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

export interface SupplierDetails {
  supplierId: string;
  supplierName: string;
  supplierStatus: boolean;
  totalOrders: number;
  totalSpents: number;
  contactInformation: SupplierContactInformation;
  latestPurchaseOrders: PurchaseOrderSummary[];
}

export interface SupplierContactInformation {
  supplierContactPerson: string;
  supplierPhone: string;
  supplierEmail: string;
  supplierAddress: string;
}

export interface PurchaseOrderSummary {
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  orderStatus: string;
  orderDate: string; 
  totalAmount: number;
}

export interface CreateSupplierDto {
  supplierName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {
  isActive?: boolean;
}

export interface SupplierOption {
    label: string
    value: string
}

export const createSupplier = async(payload: CreateSupplierDto) => {
    return await fetchWithAuth('suppliers',{
        method: 'POST',
        body: payload
    })
}

export const updateSupplier = async(supplierId: string,payload: UpdateSupplierDto): Promise<{message: string}> => {
    return await fetchWithAuth(`suppliers/${supplierId}`,{method: 'PATCH',body: payload})
}

export const getSuppliers = async(getSupplierDto: GetSupplierQueryDto): Promise<SupplierListResponse> => {
    return await fetchWithAuth('suppliers',{query: getSupplierDto})
}

export const getSupplierOptions = async(): Promise<SupplierOption[]> => {
    return await fetchWithAuth('suppliers/options')
}

export const getSupplierDetails = async(supplierId: string): Promise<SupplierDetails> => {
    return await fetchWithAuth(`suppliers/${supplierId}`)
}

export const deleteSupplier = async(supplierId: string): Promise<{message: string}> => {
    return await fetchWithAuth(`suppliers/${supplierId}`,{method: 'DELETE'})
}