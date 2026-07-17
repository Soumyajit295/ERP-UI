import { type ColumnDef } from "@tanstack/react-table"
import { ResponsiveDataTable } from "@/customComponent/data-table"
import { SectionCard } from "@/customComponent/SelectionCard"
import { formatDate } from "@/common/utils"
import { PAYMENT_DIRECTIONS } from "@/common/enums/Payment.enum"
import type { PaymentDetails, RelatedInvoice, RelatedPurchaseOrder } from "@/services/payment.service"
import { FileText, ShoppingCart } from "lucide-react"

interface PaymentRelatedOrdersProps {
  payment: PaymentDetails
}

type RelatedOrder = (RelatedInvoice & { type: "invoice" }) | (RelatedPurchaseOrder & { type: "purchaseOrder" })

const columns: ColumnDef<RelatedOrder>[] = [
  {
    id: "orderNumber",
    header: "Order #",
    accessorKey: "invoiceNumber",
    meta: { mobileLabel: "Order #" },
    cell: ({ row }) => {
      const data = row.original
      return (
        <span className="font-medium">
          {data.type === "invoice" ? data.invoiceNumber : data.purchaseOrderNumber}
        </span>
      )
    },
  },
  {
    id: "date",
    header: "Date",
    accessorKey: "issueDate",
    meta: { mobileLabel: "Date" },
    cell: ({ row }) => {
      const data = row.original
      const date = data.type === "invoice" ? data.issueDate : data.orderDate
      return formatDate(date, "D MMM YYYY")
    },
  },
  {
    id: "totalAmount",
    header: "Total Amount",
    accessorKey: "totalAmount",
    meta: { mobileLabel: "Total Amount" },
    cell: ({ getValue }) => {
      const amount = getValue<number>()
      return (
        <span className="font-medium">
          ₹{(amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
  {
    id: "paidAmount",
    header: "Paid Amount",
    accessorKey: "paidAmount",
    meta: { mobileLabel: "Paid Amount" },
    cell: ({ getValue }) => {
      const amount = getValue<number>()
      return (
        <span className="font-medium">
          ₹{(amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
  {
    id: "balanceAmount",
    header: "Balance",
    accessorKey: "balanceAmount",
    meta: { mobileLabel: "Balance" },
    cell: ({ getValue }) => {
      const amount = getValue<number>()
      return (
        <span className="font-medium">
          ₹{(amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const status = getValue<string>()
      const colorMap: Record<string, string> = {
        UNPAID: "bg-red-50 text-red-700",
        PARTIALLY_PAID: "bg-yellow-50 text-yellow-700",
        PAID: "bg-green-50 text-green-700",
        PENDING: "bg-yellow-50 text-yellow-700",
        COMPLETED: "bg-green-50 text-green-700",
        CANCELLED: "bg-gray-50 text-gray-700",
      }
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorMap[status] || "bg-gray-50 text-gray-700"}`}
        >
          {status.replace(/_/g, " ")}
        </span>
      )
    },
  },
]

export const PaymentRelatedOrders = ({ payment }: PaymentRelatedOrdersProps) => {
  const isReceived = payment?.paymentDirection === PAYMENT_DIRECTIONS.RECEIVED

  const relatedOrders: RelatedOrder[] = []

  if (isReceived && payment?.relatedInvoice) {
    relatedOrders.push({ ...payment.relatedInvoice, type: "invoice" })
  } else if (!isReceived && payment?.relatedPurchaseOrder) {
    relatedOrders.push({ ...payment.relatedPurchaseOrder, type: "purchaseOrder" })
  }

  const title = isReceived ? "Related Invoice" : "Related Purchase Order"
  const icon = isReceived ? (
    <FileText className="h-5 w-5 text-muted-foreground" />
  ) : (
    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
  )

  return (
    <SectionCard title={title} icon={icon}>
      <ResponsiveDataTable
        columns={columns}
        data={relatedOrders}
        pageSize={relatedOrders.length}
      />
    </SectionCard>
  )
}
