import { StatsCard } from "@/customComponent/StatusCard"
import { formatDate } from "@/common/utils"
import type { SalesOrderDetailsResponse } from "@/services/sales-order.service"
import { Calendar, CircleCheck, DollarSign } from "lucide-react"

interface SalesOrderOverviewProps {
  order: SalesOrderDetailsResponse
}

export const SalesOrderOverview = ({ order }: SalesOrderOverviewProps) => {
  const statusColorMap: Record<string, string> = {
    DRAFT: "text-muted-foreground",
    CONFIRMED: "text-blue-600",
    COMPLETED: "text-green-600",
    CANCELLED: "text-red-600",
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Order Date"
        value={formatDate(order?.orderDate, "D MMM YYYY")}
        icon={Calendar}
      />
      <StatsCard
        title="Total Amount"
        value={`₹${(order?.totalAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
      />
      <StatsCard
        title="Status"
        value={order?.orderStatus || "—"}
        icon={CircleCheck}
        iconClassName={statusColorMap[order?.orderStatus || ""]}
      />
    </div>
  )
}
