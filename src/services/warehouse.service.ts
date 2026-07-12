import { fetchWithAuth } from "@/common/utils"

export interface WarehouseOptions {
    label: string
    value: string
}

export const getWarehouseOptions = async(): Promise<WarehouseOptions[]> => {
    return await fetchWithAuth('warehouses/options')
}