import { fetchWithAuth } from "@/common/utils"

export interface ModuleOptions {
    label: string
    value: string
}

export const getModuleOptions = async(): Promise<ModuleOptions[]> => {
    return await fetchWithAuth('tenant-modules/options')
}