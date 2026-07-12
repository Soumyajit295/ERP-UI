import { z } from "zod"

const purchaseOrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  costPrice: z.coerce.number().min(0.01, "Cost price must be greater than 0"),
})

export const purchaseOrderFormSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
  orderDate: z.string().min(1, "Order date is required"),
  status: z.string().min(1, "Status is required"),
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, "At least one product item is required"),
})

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>
