import { SectionCard } from "@/customComponent/SelectionCard"
import type { WarehouseDetails } from "@/services/warehouse.service"
import { MapPin, Calendar } from "lucide-react"
import { formatDate } from "@/common/utils"

interface WarehouseLocationCardProps {
  warehouse: WarehouseDetails
}

export const WarehouseLocationCard = ({ warehouse }: WarehouseLocationCardProps) => {
  const info = warehouse?.addressInformation

  return (
    <SectionCard
      title="Location Details"
      icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="shrink-0 text-sm text-muted-foreground">Address</span>
          <span className="min-w-0 font-medium truncate">
            {info?.warehouseAddress || "—"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="shrink-0 text-sm text-muted-foreground">Created</span>
          <span className="min-w-0 font-medium truncate">
            {formatDate(info?.warehouseCreatedAt)}
          </span>
        </div>
      </div>
    </SectionCard>
  )
}
