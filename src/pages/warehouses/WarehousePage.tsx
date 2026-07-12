import { PERMISSIONS } from "@/common/constants/permissions.constant"
import { hasPermission } from "@/common/utils"
import { CustomButton } from "@/customComponent/CustomButton"
import { ResponsiveDataTable, type Action, type ColumnDef } from "@/customComponent/data-table"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import {
  deleteWarehouse,
  getWarehouses,
  type WarehouseListItem,
} from "@/services/warehouse.service"
import { useQuery } from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"
import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { WarehouseForm } from "./WarehouseForm"

const columns: ColumnDef<WarehouseListItem>[] = [
  {
    id: "warehouseName",
    header: "Warehouse",
    accessorKey: "warehouseName",
    meta: { mobileLabel: "Warehouse" },
  },
  {
    id: "address",
    header: "Address",
    accessorKey: "address",
    meta: { mobileLabel: "Address" },
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    id: "phone",
    header: "Phone",
    accessorKey: "phone",
    meta: { mobileLabel: "Phone" },
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    id: "contactPerson",
    header: "Contact Person",
    accessorKey: "contactPerson",
    meta: { mobileLabel: "Contact Person" },
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    id: "capacity",
    header: "Capacity",
    accessorKey: "capacity",
    meta: { mobileLabel: "Capacity" },
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return value != null ? value.toLocaleString() : "-"
    },
  },
  {
    id: "isActive",
    header: "Status",
    accessorKey: "isActive",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const isActive = getValue<boolean>()
      return (
        <span
          className={
            isActive
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      )
    },
  },
]

export const WarehousePage = () => {
  const [warehouseFormOpen, setWarehouseFormOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseListItem | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const navigate = useNavigate()

  const { data: warehouseData, isFetching, refetch } = useQuery({
    queryKey: ["warehouses", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getWarehouses({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  })

  const deleteSelectedWarehouse = async (warehouseId: string) => {
    try {
      const resp = await deleteWarehouse(warehouseId)
      refetch()
      toast.success(resp.message || "Warehouse deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete warehouse")
    }
  }

  const openAddWarehouse = () => {
    setSelectedWarehouse(null)
    setWarehouseFormOpen(true)
  }

  const onSuccess = () => {
    setWarehouseFormOpen(false)
    setSelectedWarehouse(null)
    refetch()
  }

  const actions: Action<WarehouseListItem>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (row) => {
        navigate(`/warehouses/${row.warehouseId}`)
      },
      permission: hasPermission(PERMISSIONS.Inventory.Read),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: (row) => {
        setSelectedWarehouse(row)
        setWarehouseFormOpen(true)
      },
      permission: hasPermission(PERMISSIONS.Inventory.Modify),
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onClick: (row) => deleteSelectedWarehouse(row.warehouseId),
      permission: hasPermission(PERMISSIONS.Inventory.Modify),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        pageName="Warehouses"
        pageSubName="Manage your storage locations"
        actionButtonLabel="Add Warehouse"
        onActionButtonClick={openAddWarehouse}
        addPermission={hasPermission(PERMISSIONS.Inventory.Create)}
        extraButton={
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/inventory")}
            className="p-5"
            label="Back to Inventory"
            icon={<ArrowLeft className="size-4" />}
          />
        }
      />
      <ResponsiveDataTable
        columns={columns}
        data={warehouseData?.records || []}
        loading={isFetching}
        pageSize={pagination.pageSize}
        pageCount={warehouseData?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        actions={actions}
      />
      <WarehouseForm
        open={warehouseFormOpen}
        onOpenChange={setWarehouseFormOpen}
        warehouse={selectedWarehouse}
        onSuccess={onSuccess}
      />
    </PageContainer>
  )
}
