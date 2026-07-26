import { fetchWithAuth } from "@/common/utils"

export interface PermissionOptions {
    label: string
    value: string
}

export const getPermissionOptionsByModuleId = async(moduleId: string): Promise<PermissionOptions[]> => {
    return await fetchWithAuth(`permissions/${moduleId}`)
}