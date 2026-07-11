import { z } from "zod"

export const supplierFormSchema = z.object({
  supplierName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>
