import { ProductStatus } from "@/common/enums/Productstatus.enum";
import { fetchWithAuth } from "@/common/utils";

export interface ProductGetResponse {
  records: ProductRecord[];
  meta: PaginationMeta;
}

export interface ProductRecord {
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  status: ProductStatus;
  purchasePrice: number;
  sellingPrice: number;
  reorderLevel: number;
  categoryName: string;
  categoryId: string;
}

export interface Product {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  barcode: string;
  costPrice: string;
  sellingPrice: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  profitPerUnit: string;
  profitMargin: string;
  inventoryDetails: {
    warehouseName: string;
    quantity: number;
    reservedQuantity: number;
  }[];
}

export interface ProductDetailsResponse extends ProductRecord {
  description: string
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
}

export interface CreateProductRequestDto {
  name: string;
  sku: string;
  barcode: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  reorderLevel: number;
  status: ProductStatus;
  description: string;
}

export interface UpdateProductRequestDto {
  name?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  reorderLevel?: number;
  status?: ProductStatus;
  description?: string;
}

export interface ProductOptions {
    label: string
    value: string
}

export type CategoryOptions = ProductOptions[];

export const createProduct = async(payload: CreateProductRequestDto) => {
    return await fetchWithAuth('products',{
        method: 'POST',
        body: payload
    })
}

export const getProducts = async(getProductQueryDto: GetProductsQuery): Promise<ProductGetResponse> => {
    return await fetchWithAuth('products',{query: getProductQueryDto})
}

export const getProductDetails = async(productId: string): Promise<Product> => {
    return await fetchWithAuth(`products/${productId}`)
}

export const getProductOptions = async(): Promise<ProductOptions> => {
    return await fetchWithAuth('products/options')
}

export const updateProduct = async(productId: string,payload: UpdateProductRequestDto): Promise<{message: string}> => {
    return await fetchWithAuth(`products/${productId}`,{
        method: 'PATCH',
        body: payload
    })
}

export const deleteProduct = async(productId: string): Promise<{message: string}> => {
    return await fetchWithAuth(`products/${productId}`,{
        method: 'DELETE'
    })
}

export const getCategoryOptions = async(): Promise<CategoryOptions> => {
    return await fetchWithAuth(`products/categories`)
}