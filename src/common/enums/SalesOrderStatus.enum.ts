export const SalesOrderStatus = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

export type SalesOrderStatus = (typeof SalesOrderStatus)[keyof typeof SalesOrderStatus]