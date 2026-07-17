import { StatsCard } from "@/customComponent/StatusCard"
import { formatDate } from "@/common/utils"
import type { PaymentDetails } from "@/services/payment.service"
import { Calendar, CreditCard, DollarSign } from "lucide-react"

interface PaymentOverviewProps {
  payment: PaymentDetails
}

export const PaymentOverview = ({ payment }: PaymentOverviewProps) => {
  const formatMethod = (method: string) =>
    method
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Amount"
        value={`₹${(payment?.amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
      />
      <StatsCard
        title="Payment Date"
        value={formatDate(payment?.paymentDate, "D MMM YYYY")}
        icon={Calendar}
      />
      <StatsCard
        title="Payment Method"
        value={payment?.paymentMethod ? formatMethod(payment.paymentMethod) : "—"}
        icon={CreditCard}
      />
    </div>
  )
}
