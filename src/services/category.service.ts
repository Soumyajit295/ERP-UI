import { fetchWithAuth } from "@/common/utils";

export interface CreateCategory {
  name: string;
  description: string;
}

export interface EditCategory extends CreateCategory {}

export interface CategoryRecord {
  categoryId: string;
  categoryName: string;
  description: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export interface CategoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryListResponse {
  records: CategoryRecord[];
  meta: CategoryMeta;
}

export interface GetCategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const createCategory = async(payload: CreateCategory) => {
    return await fetchWithAuth('categories',{
        method: 'POST',
        body: payload
    })
}

export const getCategories = async(getCategoryQuery: GetCategoryQuery): Promise<CategoryListResponse> => {
    return await fetchWithAuth('categories',{query: getCategoryQuery})
}

export const getCategoryDetails = async(categoryId: string): Promise<CategoryRecord> => {
    return await fetchWithAuth(`categories/${categoryId}`)
}

export const updateCategory = async(categoryId: string,payload: EditCategory): Promise<{message: string}> => {
    return await fetchWithAuth(`categories/${categoryId}`,{
        method: 'PATCH',
        body: payload
    })
}

export const deleteCategory = async(categoryId: string): Promise<{message: string}> => {
    return await fetchWithAuth(`categories/${categoryId}`,{method: 'DELETE'})
}