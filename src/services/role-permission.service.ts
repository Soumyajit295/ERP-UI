import { fetchWithAuth } from "@/common/utils"

export interface RolesOptionsResponse {
    label: string,
    value: string
}

export const getRolesOptions = async(): Promise<RolesOptionsResponse[]> => {
    return await fetchWithAuth('roles/options')
}