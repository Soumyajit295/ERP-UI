import { StatsCard } from "@/customComponent/StatusCard"
import { ResponsiveDataTable, type ColumnDef } from "@/customComponent/data-table"
import { Progress } from "@/components/ui/progress"
import type { InventoryDashboard, InventoryProductListItem } from "@/services/inventory.service"
import { Boxes, DollarSign, Warehouse, TriangleAlert } from "lucide-react"
import type { PaginationState } from "@tanstack/react-table"

interface InventoryOverviewProps {
  inventory: InventoryDashboard
  products: InventoryProductListItem[]
  loading: boolean
  pagination: PaginationState
  onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void
}

const columns: ColumnDef<InventoryProductListItem>[] = [
  {
    id: "productName",
    header: "Product",
    accessorKey: "productName",
    meta: { mobileLabel: "Product" },
  },
  {
    id: "productSKU",
    header: "SKU",
    accessorKey: "productSKU",
    meta: { mobileLabel: "SKU" },
  },
  {
    id: "warehouseName",
    header: "Warehouse",
    accessorKey: "warehouseName",
    meta: { mobileLabel: "Warehouse" },
  },
  {
    id: "totalQuantity",
    header: "Quantity",
    accessorKey: "totalQuantity",
    meta: { mobileLabel: "Quantity" },
  },
  {
    id: "reorderLevel",
    header: "Reorder Quantity",
    accessorKey: "reorderLevel",
    meta: { mobileLabel: "Reorder Quantity" },
  },
  {
    id: "stockLevel",
    header: "Stock Level",
    accessorKey: "totalQuantity",
    meta: { mobileLabel: "Stock Level" },
    cell: ({ row }) => {
      const { totalQuantity, reorderLevel } = row.original
      const isLow = totalQuantity <= reorderLevel
      const percentage = reorderLevel > 0 
        ? Math.min((totalQuantity / reorderLevel) * 100, 100) 
        : 100

      return (
        <div className="flex items-center gap-2">
          <Progress 
            value={percentage} 
            className={`h-2 w-20 ${isLow ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
          />
          <span className={`text-xs font-medium ${isLow ? 'text-red-600' : 'text-green-600'}`}>
            {isLow ? 'Low' : 'Good'}
          </span>
        </div>
      )
    },
  },
  {
    id: "updatedAt",
    header: "Updated At",
    accessorKey: "updatedAt",
    meta: { mobileLabel: "Updated At" },
    cell: ({ getValue }) => {
      const date = getValue<string>()
      return date ? new Date(date).toLocaleDateString("en-IN") : "-"
    },
  },
]

export const InventoryOverview = ({ 
  inventory, 
  products, 
  loading, 
  pagination, 
  onPaginationChange 
}: InventoryOverviewProps) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Items"
          value={inventory?.totalUnits?.toLocaleString("en-IN")}
          subtitle="Units in stock"
          icon={Boxes}
        />

        <StatsCard
          title="Inventory Value"
          value={`₹${inventory?.totalCost?.toLocaleString("en-IN")}`}
          subtitle="At cost price"
          icon={DollarSign}
        />

        <StatsCard
          title="Warehouses"
          value={inventory?.totalWarehouse?.toString()}
          subtitle="Active locations"
          icon={Warehouse}
        />

        <StatsCard
          title="Low Stock Items"
          value={inventory?.lowStockCount?.toString()}
          subtitle="Need reorder"
          icon={TriangleAlert}
          iconClassName="text-red-500"
        />
      </div>

      <div className="mt-5">
        <ResponsiveDataTable<InventoryProductListItem>
            columns={columns}
            data={products || []}
            loading={loading}
            pageSize={pagination.pageSize}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            manualPagination
        />
      </div>
    </>
  )
}