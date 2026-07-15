import { z } from "zod"

export const invoiceFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  salesOrderId: z.string().min(1, "Sales order is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
  status: z.string().optional(),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>
