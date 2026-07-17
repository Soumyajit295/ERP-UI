import { DetailItem } from "@/customComponent/DetailItem"
import { SectionCard } from "@/customComponent/SelectionCard"
import { formatDate } from "@/common/utils"
import { PAYMENT_DIRECTIONS } from "@/common/enums/Payment.enum"
import type { PaymentDetails } from "@/services/payment.service"
import { ArrowDownCircle, ArrowUpCircle, User, Building2 } from "lucide-react"

interface PaymentInfoCardProps {
  payment: PaymentDetails
}

export const PaymentInfoCard = ({ payment }: PaymentInfoCardProps) => {
  const isReceived = payment?.paymentDirection === PAYMENT_DIRECTIONS.RECEIVED

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SectionCard
        title="Payment Details"
        icon={
          isReceived ? (
            <ArrowDownCircle className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowUpCircle className="h-5 w-5 text-orange-600" />
          )
        }
      >
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
          <DetailItem label="Type">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                isReceived
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              {isReceived ? (
                <ArrowDownCircle className="h-3.5 w-3.5" />
              ) : (
                <ArrowUpCircle className="h-3.5 w-3.5" />
              )}
              {isReceived ? "Incoming" : "Outgoing"}
            </span>
          </DetailItem>

          <DetailItem label="Reference Number">
            <span className="font-medium">{payment?.transactionId || "N/A"}</span>
          </DetailItem>

          <DetailItem label="Created At">
            <span className="font-medium">
              {formatDate(payment?.createdAt, "D MMM YYYY, h:mm A")}
            </span>
          </DetailItem>

          <DetailItem label="Updated At">
            <span className="font-medium">
              {formatDate(payment?.updatedAt, "D MMM YYYY, h:mm A")}
            </span>
          </DetailItem>
        </div>
      </SectionCard>

      <SectionCard
        title={isReceived ? "Customer Information" : "Supplier Information"}
        icon={
          isReceived ? (
            <User className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Building2 className="h-5 w-5 text-muted-foreground" />
          )
        }
      >
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
          <DetailItem label={isReceived ? "Customer Name" : "Supplier Name"}>
            <span className="font-medium">{payment?.entityInformation?.name || "—"}</span>
          </DetailItem>

          <DetailItem label="Email">
            <span className="font-medium">{payment?.entityInformation?.email || "—"}</span>
          </DetailItem>

          <DetailItem label="Phone">
            <span className="font-medium">{payment?.entityInformation?.phone || "—"}</span>
          </DetailItem>
        </div>
      </SectionCard>
    </div>
  )
}
