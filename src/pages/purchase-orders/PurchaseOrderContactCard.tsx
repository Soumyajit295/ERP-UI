import { DetailItem } from "@/customComponent/DetailItem"
import { SectionCard } from "@/customComponent/SelectionCard"
import type { SupplierInformation } from "@/services/purchase-order.service"
import { User } from "lucide-react"

interface PurchaseOrderContactCardProps {
  supplier: SupplierInformation
}

export const PurchaseOrderContactCard = ({ supplier }: PurchaseOrderContactCardProps) => {
  return (
    <SectionCard
      title="Contact Information"
      icon={<User className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
        <DetailItem label="Supplier Name">
          <span className="font-medium">{supplier.supplierName}</span>
        </DetailItem>

        <DetailItem label="Contact Person">
          <span className="font-medium">{supplier.supplierContactPerson}</span>
        </DetailItem>

        <DetailItem label="Email">
          <span className="font-medium">{supplier.supplierEmail}</span>
        </DetailItem>

        <DetailItem label="Phone">
          <span className="font-medium">{supplier.supplierPhone}</span>
        </DetailItem>

        <div className="md:col-span-2">
          <DetailItem label="Address">
            <span className="font-medium">{supplier.supplierAddress}</span>
          </DetailItem>
        </div>
      </div>
    </SectionCard>
  )
}
