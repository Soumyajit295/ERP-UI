import { StatsCard } from "@/customComponent/StatusCard"
import { formatDate } from "@/common/utils"
import type { InvoiceDetailsResponse } from "@/services/invoice.service"
import { Calendar, CircleCheck, DollarSign } from "lucide-react"

interface InvoiceOverviewProps {
  invoice: InvoiceDetailsResponse
}

export const InvoiceOverview = ({ invoice }: InvoiceOverviewProps) => {
  const statusColorMap: Record<string, string> = {
    UNPAID: "text-red-600",
    PARTIALLY_PAID: "text-yellow-600",
    PAID: "text-green-600",
    CANCELLED: "text-muted-foreground",
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Invoice Date"
        value={formatDate(invoice.invoiceDate, "D MMM YYYY")}
        icon={Calendar}
      />
      <StatsCard
        title="Total Amount"
        value={`₹${invoice.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        subtitle={`Paid: ₹${invoice.paidAmount.toLocaleString("en-IN")} • Balance: ₹${invoice.balanceAmount.toLocaleString("en-IN")}`}
        icon={DollarSign}
      />
      <StatsCard
        title="Status"
        value={invoice.invoiceStatus}
        icon={CircleCheck}
        iconClassName={statusColorMap[invoice.invoiceStatus]}
      />
    </div>
  )
}
