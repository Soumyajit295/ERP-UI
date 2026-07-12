import { StatsCard } from "@/customComponent/StatusCard"
import type { WarehouseDetails } from "@/services/warehouse.service"
import { CircleCheck, Package, Box, ShieldAlert } from "lucide-react"

interface WarehouseOverviewProps {
  warehouse: WarehouseDetails
}

export const WarehouseOverview = ({ warehouse }: WarehouseOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Products"
        value={warehouse.totalProducts.toString()}
        icon={Package}
      />
      <StatsCard
        title="Units on Hand"
        value={warehouse.unitsOnHand.toLocaleString()}
        icon={Box}
      />
      <StatsCard
        title="Reserved Quantity"
        value={warehouse.totalReserved.toLocaleString()}
        icon={ShieldAlert}
      />
      <StatsCard
        title="Status"
        value={warehouse.warehouseStatus ? "Active" : "Inactive"}
        icon={CircleCheck}
        iconClassName={warehouse.warehouseStatus ? "text-green-600" : "text-red-600"}
      />
    </div>
  )
}
