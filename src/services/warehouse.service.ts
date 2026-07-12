import { fetchWithAuth } from "@/common/utils"

export interface WarehouseOptions {
    label: string
    value: string
}

export interface CreateWarehouseDto {
  warehouseName: string
  address?: string
  contactPerson?: string
  phone?: string
  capacity?: number
}

export interface UpdateWarehouseDto {
  warehouseName?: string
  address?: string
  contactPerson?: string
  phone?: string
  capacity?: number
  isActive?: boolean
}

export interface GetWarehouseQueryDto {
  page?: number
  limit?: number
  search?: string
  status?: boolean
}

export interface WarehouseListItem {
  warehouseId: string
  warehouseName: string
  address: string
  contactPerson: string
  phone: string
  capacity: number
  isActive: boolean
}

export interface WarehouseListResponse {
  records: WarehouseListItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface WarehouseDetails {
  warehouseId: string
  warehouseName: string
  warehouseStatus: boolean
  totalProducts: number
  warehouseCapacity: number
  unitsOnHand: number
  totalReserved: number
  addressInformation: WarehouseAddressInformation
  contactInformation: WarehouseContactInformation
  inventoryItems: WarehouseInventoryItem[]
}

export interface WarehouseAddressInformation {
  warehouseAddress: string
  warehouseCreatedAt: string
}

export interface WarehouseContactInformation {
  warehouseContactPerson: string
  warehousePhone: string
}

export interface WarehouseInventoryItem {
  productName: string
  productSku: string
  productQuantity: number
  reservedProductQuantity: number
  lastUpdated: string
}

export const createWarehouse = async(payload: CreateWarehouseDto) => {
    return await fetchWithAuth('warehouses',{
        method: 'POST',
        body: payload
    })
}

export const updateWarehouse = async(warehouseId: string, payload: UpdateWarehouseDto): Promise<{message: string}> => {
    return await fetchWithAuth(`warehouses/${warehouseId}`,{
        method: 'PATCH',
        body: payload
    })
}

export const getWarehouses = async(warehouseQueryDto: GetWarehouseQueryDto): Promise<WarehouseListResponse> => {
    return await fetchWithAuth('warehouses',{query: warehouseQueryDto})
}

export const getWarehouseDetails = async(warehouseId: string): Promise<WarehouseDetails> => {
    return await fetchWithAuth(`warehouses/${warehouseId}`)
}

export const deleteWarehouse = async(warehouseId: string): Promise<{message: string}> => {
    return await fetchWithAuth(`warehouses/${warehouseId}`,{method: 'DELETE'})
}

export const getWarehouseOptions = async(): Promise<WarehouseOptions[]> => {
    return await fetchWithAuth('warehouses/options')
}