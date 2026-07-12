import { z } from "zod"

export const warehouseFormSchema = z.object({
  warehouseName: z.string().min(1, "Warehouse name is required"),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  capacity: z.coerce.number().min(0, "Capacity must be a positive number").optional(),
  isActive: z.string().optional(),
})

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>
