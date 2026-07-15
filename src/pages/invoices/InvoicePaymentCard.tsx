import { SectionCard } from "@/customComponent/SelectionCard"
import { Progress } from "@/components/ui/progress"
import { CreditCard } from "lucide-react"

interface InvoicePaymentCardProps {
  totalAmount: number
  paidAmount: number
  balanceAmount: number
}

export const InvoicePaymentCard = ({ totalAmount, paidAmount, balanceAmount }: InvoicePaymentCardProps) => {
  const percentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0

  return (
    <SectionCard
      title="Payment Status"
      icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Paid Amount</p>
            <span className="text-lg font-semibold text-green-600">
              ₹{paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Balance Amount</p>
            <span className="text-lg font-semibold text-red-600">
              ₹{balanceAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
