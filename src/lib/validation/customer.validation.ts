import { z } from "zod"

export const customerFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  isActive: z.string().optional(),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
