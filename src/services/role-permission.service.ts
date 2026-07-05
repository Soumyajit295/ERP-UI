import { fetchWithAuth } from "@/common/utils"

export interface RolesOptionsResponse {
    label: string
    value: string
}

export interface PemissionsResponse {
    moduleId: string
    moduleName: string
    permissionId: string
    permissionName: string
}

export const getRolesOptions = async (): Promise<RolesOptionsResponse[]> => {
    return await fetchWithAuth('roles/options')
}

export const getPermissionByRole = async(roleId: string): Promise<PemissionsResponse[]> => {
   return await fetchWithAuth(`roles/role-permissions/${roleId}`)
}
