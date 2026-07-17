import { SectionCard } from "@/customComponent/SelectionCard"
import { Progress } from "@/components/ui/progress"
import type { WarehouseDetails } from "@/services/warehouse.service"
import { Warehouse } from "lucide-react"

interface WarehouseCapacityCardProps {
  warehouse: WarehouseDetails
}

export const WarehouseCapacityCard = ({ warehouse }: WarehouseCapacityCardProps) => {
  const used = warehouse?.unitsOnHand ?? 0
  const total = warehouse?.warehouseCapacity ?? 0
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0

  return (
    <SectionCard
      title="Capacity"
      icon={<Warehouse className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {used.toLocaleString()} / {total.toLocaleString()} units
          </span>
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </SectionCard>
  )
}
