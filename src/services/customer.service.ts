import { fetchWithAuth } from "@/common/utils"

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CustomerListItem {
  customerId: string
  customerName: string
  customerCity: string
  customerEmail: string
  customerPhone: string
  customerStatus: boolean
}

export interface CustomerListResponse {
  records: CustomerListItem[]
  meta: PaginationMeta
}

export interface CreateCustomerDto {
  customerName: string
  email?: string
  phone?: string
  city?: string
  address?: string
  isActive?: boolean
}

export interface UpdateCustomerDto {
  customerName?: string
  email?: string
  phone?: string
  city?: string
  address?: string
  isActive?: boolean
}

export interface GetCustomerQueryDto {
  page?: number
  limit?: number
  search?: string
  status?: boolean
}

export interface CustomerOptions {
    label: string
    value: string
}

export const createCustomer = async(payload: CreateCustomerDto) => {
    return await fetchWithAuth('customers',{
        method: 'POST',
        body: payload
    })
}

export const updateCustomer = async(customerId: string, payload: UpdateCustomerDto): Promise<{message: string}> => {
    return await fetchWithAuth(`customers/${customerId}`,{
        method: 'PATCH',
        body: payload
    })
}

export const getCustomers = async(getCustomerQueryDto: GetCustomerQueryDto): Promise<CustomerListResponse> => {
    return await fetchWithAuth('customers',{query: getCustomerQueryDto})
}

export const deleteCustomers = async(customerId: string): Promise<{message: string}> => {
    return await fetchWithAuth(`customers/${customerId}`,{method: 'DELETE'})
}

export const getCustomersOptions = async(): Promise<CustomerOptions[]> => {
    return await fetchWithAuth(`customers/options`)
}