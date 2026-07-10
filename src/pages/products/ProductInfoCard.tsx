import { DetailItem } from "@/customComponent/DetailItem"
import { SectionCard } from "@/customComponent/SelectionCard"
import type { Product } from "@/services/products.service"
import { Package } from "lucide-react"

interface ProductInfoCardProps {
  product: Product
}

export const ProductInfoCard = ({ product }: ProductInfoCardProps) => {
  const totalUnits =
    product?.inventoryDetails?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <SectionCard
      title="Product Details"
      icon={<Package className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
        <DetailItem label="SKU">
          <span className="font-medium">{product?.sku}</span>
        </DetailItem>

        <DetailItem label="Barcode">
          <span className="font-medium">{product?.barcode}</span>
        </DetailItem>

        <DetailItem label="Category">
          <span className="font-medium">{product?.categoryName}</span>
        </DetailItem>

        <DetailItem label="Total Units">
          <span className="font-medium">{totalUnits}</span>
        </DetailItem>

        <DetailItem label="Cost Price">
          <span className="text-xl font-semibold">
            ₹{Number(product?.costPrice).toLocaleString("en-IN")}
          </span>
        </DetailItem>

        <DetailItem label="Selling Price">
          <span className="text-xl font-semibold">
            ₹{Number(product?.sellingPrice).toLocaleString("en-IN")}
          </span>
        </DetailItem>

        <DetailItem label="Created At">
          <span>{product?.createdAt ? new Date(product.createdAt).toLocaleDateString("en-IN") : "—"}</span>
        </DetailItem>

        <DetailItem label="Updated At">
          <span>{product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString("en-IN") : "—"}</span>
        </DetailItem>

        <div className="md:col-span-2">
          <DetailItem label="Description">
            <p>{product?.description}</p>
          </DetailItem>
        </div>
      </div>
    </SectionCard>
  )
}
