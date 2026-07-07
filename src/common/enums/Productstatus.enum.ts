export const ProductStatus = {
  ACTIVE : 'ACTIVE',
  INACTIVE : 'INACTIVE',
} as const

export type ProductStatus =
  (typeof ProductStatus)[keyof typeof ProductStatus];
