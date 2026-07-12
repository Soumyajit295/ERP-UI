import { ResponsiveDataTable, type ColumnDef } from "@/customComponent/data-table"
import { SectionCard } from "@/customComponent/SelectionCard"
import { formatDate } from "@/common/utils"
import type { WarehouseInventoryItem } from "@/services/warehouse.service"
import { Package } from "lucide-react"

interface WarehouseInventoryCardProps {
  inventoryItems: WarehouseInventoryItem[]
}

const columns: ColumnDef<WarehouseInventoryItem>[] = [
  {
    id: "productName",
    header: "Product",
    accessorKey: "productName",
    meta: { mobileLabel: "Product" },
  },
  {
    id: "productSku",
    header: "SKU",
    accessorKey: "productSku",
    meta: { mobileLabel: "SKU" },
  },
  {
    id: "productQuantity",
    header: "Quantity",
    accessorKey: "productQuantity",
    meta: { mobileLabel: "Quantity" },
  },
  {
    id: "reservedProductQuantity",
    header: "Reserved",
    accessorKey: "reservedProductQuantity",
    meta: { mobileLabel: "Reserved" },
  },
  {
    id: "lastUpdated",
    header: "Last Updated",
    accessorKey: "lastUpdated",
    meta: { mobileLabel: "Last Updated" },
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
]

export const WarehouseInventoryCard = ({ inventoryItems }: WarehouseInventoryCardProps) => {
  return (
    <SectionCard
      title="Inventory Items"
      icon={<Package className="h-5 w-5 text-muted-foreground" />}
    >
      <ResponsiveDataTable columns={columns} data={inventoryItems} />
    </SectionCard>
  )
}
