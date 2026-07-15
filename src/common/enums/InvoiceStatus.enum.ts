export const InvoiceStatus = {
    UNPAID: 'UNPAID',
    PARTIALLY_PAID: 'PARTIALLY_PAID',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED'
}

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]