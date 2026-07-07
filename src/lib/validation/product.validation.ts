import { ProductStatus } from "@/common/enums/Productstatus.enum";
import z from "zod";

export const ProductFormSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters"),

  sku: z
    .string()
    .min(1, "SKU is required"),

  barcode: z
    .string()
    .optional(),

  categoryId: z
    .string()
    .uuid("Invalid category ID"),

  purchasePrice: z.coerce
    .number()
    .min(0, "Purchase price must be greater than or equal to 0"),

  sellingPrice: z.coerce
    .number()
    .min(0, "Selling price must be greater than or equal to 0"),

  reorderLevel: z.coerce
    .number()
    .int("Reorder level must be an integer")
    .min(0, "Reorder level must be greater than or equal to 0")
    .optional(),

  status: z
    .nativeEnum(ProductStatus),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;