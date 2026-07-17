import { SectionCard } from "@/customComponent/SelectionCard"
import type { WarehouseDetails } from "@/services/warehouse.service"
import { User, Phone } from "lucide-react"

interface WarehouseContactCardProps {
  warehouse: WarehouseDetails
}

export const WarehouseContactCard = ({ warehouse }: WarehouseContactCardProps) => {
  const info = warehouse?.contactInformation

  return (
    <SectionCard
      title="Contact Person"
      icon={<User className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="shrink-0 text-sm text-muted-foreground">Name</span>
          <span className="min-w-0 font-medium truncate">
            {info?.warehouseContactPerson || "—"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="shrink-0 text-sm text-muted-foreground">Phone</span>
          <span className="min-w-0 font-medium truncate">
            {info?.warehousePhone || "—"}
          </span>
        </div>
      </div>
    </SectionCard>
  )
}
