import { SectionCard } from "@/customComponent/SelectionCard"
import type { SupplierDetails } from "@/services/supplier.service"
import { Mail, Phone, MapPin } from "lucide-react"

interface SupplierInfoCardProps {
  supplier: SupplierDetails
}

export const SupplierInfoCard = ({ supplier }: SupplierInfoCardProps) => {
  const info = supplier?.contactInformation

  return (
    <SectionCard
      title="Contact Information"
      icon={<Mail className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="shrink-0 text-sm text-muted-foreground">Email</span>
          <span className="min-w-0 font-medium truncate">{info?.supplierEmail || "—"}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="shrink-0 text-sm text-muted-foreground">Phone</span>
          <span className="min-w-0 font-medium truncate">{info?.supplierPhone || "—"}</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="shrink-0 text-sm text-muted-foreground">Address</span>
          <span className="min-w-0 font-medium truncate">{info?.supplierAddress || "—"}</span>
        </div>
      </div>
    </SectionCard>
  )
}
