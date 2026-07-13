import { type ColumnDef } from "@tanstack/react-table"
import { ResponsiveDataTable } from "@/customComponent/data-table"
import { SectionCard } from "@/customComponent/SelectionCard"
import type { SalesOrderItem } from "@/services/sales-order.service"
import { ShoppingCart } from "lucide-react"

interface SalesOrderItemsProps {
  items: SalesOrderItem[]
}

const columns: ColumnDef<SalesOrderItem>[] = [
  {
    id: "productName",
    header: "Product Name",
    accessorKey: "productName",
    meta: { mobileLabel: "Product" },
  },
  {
    id: "quantity",
    header: "Quantity",
    accessorKey: "quantity",
    meta: { mobileLabel: "Quantity" },
  },
  {
    id: "unitPrice",
    header: "Unit Price",
    accessorKey: "unitPrice",
    meta: { mobileLabel: "Unit Price" },
    cell: ({ getValue }) => {
      const price = getValue<number>()
      return (
        <span className="font-medium">
          ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
  {
    id: "discount",
    header: "Discount",
    accessorKey: "discount",
    meta: { mobileLabel: "Discount" },
    cell: ({ getValue }) => {
      const discount = getValue<number>()
      return (
        <span className="font-medium">
          ₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
  {
    id: "totalPrice",
    header: "Total",
    accessorKey: "totalPrice",
    meta: { mobileLabel: "Total" },
    cell: ({ getValue }) => {
      const total = getValue<number>()
      return (
        <span className="font-medium">
          ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
]

export const SalesOrderItems = ({ items }: SalesOrderItemsProps) => {
  return (
    <SectionCard
      title="Order Items"
      icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />}
    >
      <ResponsiveDataTable
        columns={columns}
        data={items}
        pageSize={items.length}
      />
    </SectionCard>
  )
}
