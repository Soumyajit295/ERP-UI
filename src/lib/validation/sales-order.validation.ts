import { z } from "zod"

const salesOrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  sellingPrice: z.coerce.number().min(0.01, "Selling price must be greater than 0"),
  discount: z.coerce.number().min(0, "Discount cannot be negative"),
})

export const salesOrderFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
  orderDate: z.string().min(1, "Order date is required"),
  status: z.string().min(1, "Status is required"),
  items: z
    .array(salesOrderItemSchema)
    .min(1, "At least one product item is required"),
})

export type SalesOrderFormValues = z.infer<typeof salesOrderFormSchema>
