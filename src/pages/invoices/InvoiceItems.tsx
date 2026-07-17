import { type ColumnDef } from "@tanstack/react-table"
import { ResponsiveDataTable } from "@/customComponent/data-table"
import { SectionCard } from "@/customComponent/SelectionCard"
import type { InvoiceItem } from "@/services/invoice.service"
import { ShoppingCart } from "lucide-react"

interface InvoiceItemsProps {
  items: InvoiceItem[]
}

const columns: ColumnDef<InvoiceItem>[] = [
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
          ₹{(price ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
          ₹{(discount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
          ₹{(total ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
]

export const InvoiceItems = ({ items }: InvoiceItemsProps) => {
  return (
    <SectionCard
      title="Invoice Items"
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
