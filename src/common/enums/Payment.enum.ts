export const PAYMENT_DIRECTIONS = {
  RECEIVED: "RECEIVED",
  MADE: "MADE",
} as const;

export type PaymentDirection =
  (typeof PAYMENT_DIRECTIONS)[keyof typeof PAYMENT_DIRECTIONS];

export const PAYMENT_METHODS = {
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
  CARD: "CARD",
  CHEQUE: "CHEQUE",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];