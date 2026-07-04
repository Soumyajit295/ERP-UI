import { fetchWithAuth } from "@/common/utils";

export interface CreateUserDto {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  roleId: string;
}

export interface UpdateUserDto {
  fname?: string
  lname?: string
  phone?: string
  roleId?: string
}

export interface UserResponse {
  userId: string;
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  tenantId: string;
  roleId: string;
  roleName: string;
  createdBy: string
}

export interface UserResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse {
  records: UserResponse[];
  meta: UserResponseMeta;
}

export interface GetUsersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
}

export const createUser = async(payload: CreateUserDto) => {
    return await fetchWithAuth('users',{method: 'POST',body: payload})
}

export const updateUser = async(userId: string,payload: UpdateUserDto) => {
    return await fetchWithAuth(`users/${userId}`,{method: 'PATCH',body: payload})
}

export const getTenantUsers = async(usersQuery: GetUsersQueryDto = {}): Promise<UserListResponse> => {
    return await fetchWithAuth<UserListResponse>('users',{query: usersQuery})
}

export const deleteUser = async(userId: string): Promise<{message: string}> => {
    return await fetchWithAuth(`users/${userId}`,{method: 'DELETE'})
}

