import { ResponsiveDataTable, type ColumnDef } from "@/customComponent/data-table"
import { SectionCard } from "@/customComponent/SelectionCard"
import { Warehouse } from "lucide-react"

interface WarehouseRow {
  warehouseName: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
}

interface WarehouseStockCardProps {
  inventoryDetails: {
    warehouseName: string
    quantity: number
    reservedQuantity: number
  }[]
}

const columns: ColumnDef<WarehouseRow>[] = [
  {
    id: "warehouseName",
    header: "Warehouse Name",
    accessorKey: "warehouseName",
    meta: { mobileLabel: "Warehouse" },
  },
  {
    id: "quantity",
    header: "Quantity",
    accessorKey: "quantity",
    meta: { mobileLabel: "Quantity" },
  },
  {
    id: "reservedQuantity",
    header: "Reserved Quantity",
    accessorKey: "reservedQuantity",
    meta: { mobileLabel: "Reserved" },
  },
  {
    id: "availableQuantity",
    header: "Available Quantity",
    accessorKey: "availableQuantity",
    meta: { mobileLabel: "Available" },
  },
]

export const WarehouseStockCard = ({ inventoryDetails }: WarehouseStockCardProps) => {
  const data: WarehouseRow[] = inventoryDetails.map((item) => ({
    ...item,
    availableQuantity: item.quantity - item.reservedQuantity,
  }))

  return (
    <SectionCard
      title="Warehouse Stock"
      icon={<Warehouse className="h-5 w-5 text-muted-foreground" />}
    >
      <ResponsiveDataTable columns={columns} data={data} />
    </SectionCard>
  )
}
