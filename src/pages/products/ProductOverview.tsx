import { StatsCard } from "@/customComponent/StatusCard";
import type { Product } from "@/services/products.service"
import { CircleCheck, DollarSign, Package, TrendingUp } from "lucide-react";

interface ProductOverviewProps {
    product: Product
}

export const ProductOverview = ({product}: ProductOverviewProps) => {
    const totalStock = product?.inventoryDetails?.reduce(
    (sum, item) => sum + item.quantity,
    0
  ) ?? 0;

  const reservedStock = product?.inventoryDetails?.reduce(
    (sum, item) => sum + item.reservedQuantity,
    0
  ) ?? 0;

  const availableStock = totalStock - reservedStock;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Selling Price"
        value={`₹${Number(product?.sellingPrice).toLocaleString("en-IN")}`}
        subtitle={`Cost: ₹${Number(product?.costPrice).toLocaleString("en-IN")}`}
        icon={DollarSign}
      />

      <StatsCard
        title="Profit Margin"
        value={`${product?.profitMargin}%`}
        subtitle={`₹${Number(product?.profitPerUnit).toLocaleString(
          "en-IN"
        )} per unit`}
        icon={TrendingUp}
      />

      <StatsCard
        title="Total Stock"
        value={totalStock.toString()}
        subtitle={`${availableStock} available • ${reservedStock} reserved`}
        icon={Package}
      />

      <StatsCard
        title="Status"
        value={product?.status === "ACTIVE" ? "Active" : "Inactive"}
        icon={CircleCheck}
        iconClassName={product?.status === "ACTIVE" ? "text-green-600" : "text-red-600"}
      />
    </div>
  )
}