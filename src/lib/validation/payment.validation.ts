import { z } from "zod";

export const paymentFormSchema = z
  .object({
    paymentDirection: z.enum(["RECEIVED", "MADE"], {
      message: "Payment direction is required",
    }),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CARD", "CHEQUE"], {
      message: "Payment method is required",
    }),
    orderId: z.string().min(1, "Order is required"),
    paymentDate: z.string().min(1, "Payment date is required"),
    transactionId: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.orderId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Order is required",
        path: ["orderId"],
      });
    }
  });

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
