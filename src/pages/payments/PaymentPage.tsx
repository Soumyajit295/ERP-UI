import { type PaginationState } from "@tanstack/react-table"
import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { getPaymentRecords, downloadPaymentRecipt, type PaymentListItem } from "@/services/payment.service"
import { useQuery } from "@tanstack/react-query"
import { ResponsiveDataTable, type Action } from "@/customComponent/data-table"
import { Download, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { hasPermission } from "@/common/utils"
import { PERMISSIONS } from "@/common/constants/permissions.constant"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { formatDate } from "@/common/utils"
import { PaymentForm } from "./PaymentForm"
import { PAYMENT_DIRECTIONS } from "@/common/enums/Payment.enum"
import { toast } from "sonner"

export const columns: ColumnDef<PaymentListItem>[] = [
  {
    id: "paymentNumber",
    header: "Payment #",
    accessorKey: "paymentNumber",
    meta: { mobileLabel: "Payment #" },
  },
  {
    id: "paymentDirection",
    header: "Payment Type",
    accessorKey: "paymentDirection",
    meta: { mobileLabel: "Payment Type" },
    cell: ({ getValue }) => {
      const direction = getValue<string>()
      const isReceived = direction === PAYMENT_DIRECTIONS.RECEIVED
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            isReceived
              ? "bg-green-50 text-green-700"
              : "bg-orange-50 text-orange-700"
          }`}
        >
          {isReceived ? "Incoming" : "Outgoing"}
        </span>
      )
    },
  },
  {
    id: "customerOrSupplierName",
    header: "Customer / Supplier",
    accessorKey: "customerOrSupplierName",
    meta: { mobileLabel: "Customer / Supplier" },
  },
  {
    id: "orderNumber",
    header: "Order",
    accessorKey: "orderNumber",
    meta: { mobileLabel: "Order" },
    cell: ({ getValue, row }) => {
      const direction = row.original.paymentDirection
      const orderNumber = getValue<string>()
      if (direction === PAYMENT_DIRECTIONS.RECEIVED) {
        return <span className="font-medium">{orderNumber}</span>
      }
      return <span className="text-muted-foreground">NA</span>
    },
  },
  {
    id: "paymentDate",
    header: "Date",
    accessorKey: "paymentDate",
    meta: { mobileLabel: "Date" },
    cell: ({ getValue }) => formatDate(getValue<string>(), "D MMM YYYY"),
  },
  {
    id: "paymentMethod",
    header: "Payment Method",
    accessorKey: "paymentMethod",
    meta: { mobileLabel: "Payment Method" },
    cell: ({ getValue }) => {
      const method = getValue<string>()
      return method
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ")
    },
  },
  {
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
    meta: { mobileLabel: "Amount" },
    cell: ({ getValue }) => {
      const amount = getValue<number>()
      return (
        <span className="font-medium">
          ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
  },
]

export const PaymentPage = () => {
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: paymentData, isFetching, refetch } = useQuery({
    queryKey: ["payments", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getPaymentRecords({ page: pagination.pageIndex + 1, limit: pagination.pageSize }),
  })

  const actions: Action<PaymentListItem>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (row) => {
        navigate(`/payments/${row.paymentId}`)
      },
      permission: hasPermission(PERMISSIONS.Finance.Read),
    },
    {
      label: "Download Receipt",
      icon: Download,
      onClick: async (row) => {
        try {
          const blob = await downloadPaymentRecipt(row.paymentId)
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `payment-${row.paymentNumber}.pdf`
          a.click()
          URL.revokeObjectURL(url)
        } catch (error: any) {
          toast.error(error.message || "Failed to download receipt")
        }
      },
      permission: hasPermission(PERMISSIONS.Finance.Modify),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        pageName="Payments"
        pageSubName="Track incoming and outgoing payments"
        actionButtonLabel="Record Payment"
        onActionButtonClick={() => {
          setFormOpen(true)
        }}
        addPermission={hasPermission(PERMISSIONS.Finance.Create)}
      />
      <ResponsiveDataTable
        columns={columns}
        data={paymentData?.records || []}
        loading={isFetching}
        pageSize={pagination.pageSize}
        pageCount={paymentData?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        actions={actions}
      />
      <PaymentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          refetch()
        }}
      />
    </PageContainer>
  )
}
