import { fetchWithAuth } from "@/common/utils"

export interface InventoryDashboard {
    totalUnits: number
    totalCost: number
    totalWarehouse: number
    lowStockCount: number
}

export interface InventoryProductListItem {
  productName: string
  categoryName: string
  productSKU: string
  warehouseName: string
  totalQuantity: number
  reorderLevel: number
  updatedAt: string
}

export interface InventoryProductListResponse {
  records: InventoryProductListItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface GetInventoryProductDto {
  page?: number
  limit?: number
  search?: string
  warehouseId?: string
  categoryId?: string
}

export const getInventoryDashboard = async(): Promise<InventoryDashboard> => {
    return await fetchWithAuth('inventory/dashboard')
}

export const getInventoryProducts = async(getInventoryProductQueryDto: GetInventoryProductDto): Promise<InventoryProductListResponse> => {
    return await fetchWithAuth('inventory/products',{query: getInventoryProductQueryDto})
}