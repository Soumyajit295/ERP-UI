import { StatsCard } from "@/customComponent/StatusCard"
import { formatDate } from "@/common/utils"
import type { PurchaseOrderDetailsResponse } from "@/services/purchase-order.service"
import { Calendar, CircleCheck, DollarSign } from "lucide-react"

interface PurchaseOrderOverviewProps {
  order: PurchaseOrderDetailsResponse
}

export const PurchaseOrderOverview = ({ order }: PurchaseOrderOverviewProps) => {
  const statusColorMap: Record<string, string> = {
    DRAFT: "text-muted-foreground",
    PENDING: "text-yellow-600",
    APPROVED: "text-blue-600",
    RECEIVED: "text-green-600",
    CANCELLED: "text-red-600",
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Order Date"
        value={formatDate(order.purchaseOrderDate, "D MMM YYYY")}
        icon={Calendar}
      />
      <StatsCard
        title="Total Amount"
        value={`₹${order.purchaseOrderTotalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        subtitle={`Paid: ₹${order.paidAmount.toLocaleString("en-IN")} • Balance: ₹${order.balanceAmount.toLocaleString("en-IN")}`}
        icon={DollarSign}
      />
      <StatsCard
        title="Status"
        value={order.purchaseOrderStatus}
        icon={CircleCheck}
        iconClassName={statusColorMap[order.purchaseOrderStatus]}
      />
    </div>
  )
}
