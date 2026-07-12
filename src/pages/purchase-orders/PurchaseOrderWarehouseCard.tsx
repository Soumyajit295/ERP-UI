import { DetailItem } from "@/customComponent/DetailItem"
import { SectionCard } from "@/customComponent/SelectionCard"
import type { DeliveryInformation } from "@/services/purchase-order.service"
import { Warehouse } from "lucide-react"

interface PurchaseOrderWarehouseCardProps {
  delivery: DeliveryInformation
}

export const PurchaseOrderWarehouseCard = ({ delivery }: PurchaseOrderWarehouseCardProps) => {
  return (
    <SectionCard
      title="Warehouse Information"
      icon={<Warehouse className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
        <DetailItem label="Warehouse Name">
          <span className="font-medium">{delivery.wareHouseName}</span>
        </DetailItem>

        <DetailItem label="Contact Person">
          <span className="font-medium">{delivery.wareHouseContactPerson}</span>
        </DetailItem>

        <DetailItem label="Phone">
          <span className="font-medium">{delivery.wareHousePhone}</span>
        </DetailItem>

        <div className="md:col-span-2">
          <DetailItem label="Address">
            <span className="font-medium">{delivery.wareHouseAddress}</span>
          </DetailItem>
        </div>
      </div>
    </SectionCard>
  )
}
