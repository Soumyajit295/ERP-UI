export const PurchaseOrderStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  RECEIVED: "RECEIVED",
  CANCELLED: "CANCELLED",
} as const

export const PurchaseOrderPaymentStatus = {
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
}

export type PurchaseOrderStatus = (typeof PurchaseOrderStatus)[keyof typeof PurchaseOrderStatus]
export type PurchaseOrderPaymentStatus = (typeof PurchaseOrderPaymentStatus)[keyof typeof PurchaseOrderPaymentStatus]