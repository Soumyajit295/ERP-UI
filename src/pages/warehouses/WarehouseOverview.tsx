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
        value={warehouse?.totalProducts?.toString() || "0"}
        icon={Package}
      />
      <StatsCard
        title="Units on Hand"
        value={warehouse?.unitsOnHand?.toLocaleString() || "0"}
        icon={Box}
      />
      <StatsCard
        title="Reserved Quantity"
        value={warehouse?.totalReserved?.toLocaleString() || "0"}
        icon={ShieldAlert}
      />
      <StatsCard
        title="Status"
        value={warehouse?.warehouseStatus ? "Active" : "Inactive"}
        icon={CircleCheck}
        iconClassName={warehouse?.warehouseStatus ? "text-green-600" : "text-red-600"}
      />
    </div>
  )
}
