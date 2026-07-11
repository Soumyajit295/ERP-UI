import { SectionCard } from "@/customComponent/SelectionCard"
import { ResponsiveDataTable } from "@/customComponent/data-table"
import type { PurchaseOrderSummary } from "@/services/supplier.service"
import type { ColumnDef } from "@tanstack/react-table"
import { ClipboardList } from "lucide-react"

const columns: ColumnDef<PurchaseOrderSummary>[] = [
  {
    id: "purchaseOrderNumber",
    header: "Order Number",
    accessorKey: "purchaseOrderNumber",
    meta: { mobileLabel: "Order Number" },
  },
  {
    id: "orderDate",
    header: "Date",
    accessorKey: "orderDate",
    meta: { mobileLabel: "Date" },
    cell: ({ getValue }) => {
      const date = getValue<string>()
      return date ? new Date(date).toLocaleDateString("en-IN") : "—"
    },
  },
  {
    id: "totalAmount",
    header: "Amount",
    accessorKey: "totalAmount",
    meta: { mobileLabel: "Amount" },
    cell: ({ getValue }) => {
      const amount = getValue<number>()
      return `₹${Number(amount).toLocaleString("en-IN")}`
    },
  },
  {
    id: "orderStatus",
    header: "Status",
    accessorKey: "orderStatus",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const status = getValue<string>()
      return (
        <span
          className={
            status === "DELIVERED"
              ? "text-green-600 font-medium"
              : status === "CANCELLED"
                ? "text-red-600 font-medium"
                : "text-yellow-600 font-medium"
          }
        >
          {status}
        </span>
      )
    },
  },
]

interface SupplierPurchaseOrdersProps {
  orders: PurchaseOrderSummary[]
}

export const SupplierPurchaseOrders = ({ orders }: SupplierPurchaseOrdersProps) => {
  return (
    <SectionCard
      title="Recent Purchase Orders"
      icon={<ClipboardList className="h-5 w-5 text-muted-foreground" />}
    >
      <ResponsiveDataTable
        columns={columns}
        data={orders}
      />
    </SectionCard>
  )
}
