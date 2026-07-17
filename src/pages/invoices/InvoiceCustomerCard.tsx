import { DetailItem } from "@/customComponent/DetailItem"
import { SectionCard } from "@/customComponent/SelectionCard"
import type { CustomerInfo } from "@/services/invoice.service"
import { User } from "lucide-react"

interface InvoiceCustomerCardProps {
  customer: CustomerInfo
}

export const InvoiceCustomerCard = ({ customer }: InvoiceCustomerCardProps) => {
  return (
    <SectionCard
      title="Customer Information"
      icon={<User className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
        <DetailItem label="Customer Name">
          <span className="font-medium">{customer?.customerName || "—"}</span>
        </DetailItem>

        <DetailItem label="Email">
          <span className="font-medium">{customer?.customerEmail || "—"}</span>
        </DetailItem>

        <DetailItem label="Phone">
          <span className="font-medium">{customer?.customerPhone || "—"}</span>
        </DetailItem>

        <div className="md:col-span-2">
          <DetailItem label="Address">
            <span className="font-medium">{customer?.customerAddress || "—"}</span>
          </DetailItem>
        </div>
      </div>
    </SectionCard>
  )
}
