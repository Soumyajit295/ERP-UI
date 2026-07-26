import { fetchWithAuth } from "@/common/utils"

export interface PermissionOptions {
    label: string
    value: string
}

export interface TogglePermissionDto {
    action: 'ASSIGN' | 'REMOVE',
    permissionId: string
}
export const getPermissionOptionsByModuleId = async(moduleId: string): Promise<PermissionOptions[]> => {
    return await fetchWithAuth(`permissions/${moduleId}`)
}

export interface TogglePermissionResponse {
    message: string
}

export const togglePermission = async(roleId: string,payload: TogglePermissionDto): Promise<TogglePermissionResponse> => {
    return await fetchWithAuth(`permissions/${roleId}/toggle-permission`,{
        method: 'PATCH',
        body: payload
    })
}