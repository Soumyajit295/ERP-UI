import { PERMISSIONS } from "@/common/constants/permissions.constant"
import { hasPermission } from "@/common/utils"
import { ResponsiveDataTable, type Action, type ColumnDef } from "@/customComponent/data-table"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import {
  deleteCustomers,
  getCustomers,
  type CustomerListItem,
} from "@/services/customer.service"
import { useQuery } from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { CustomerForm } from "./CustomerForm"

const columns: ColumnDef<CustomerListItem>[] = [
  {
    id: "customerName",
    header: "Name",
    accessorKey: "customerName",
    meta: { mobileLabel: "Name" },
  },
  {
    id: "customerEmail",
    header: "Email",
    accessorKey: "customerEmail",
    meta: { mobileLabel: "Email" },
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    id: "customerPhone",
    header: "Phone",
    accessorKey: "customerPhone",
    meta: { mobileLabel: "Phone" },
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    id: "customerCity",
    header: "City",
    accessorKey: "customerCity",
    meta: { mobileLabel: "City" },
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    id: "customerStatus",
    header: "Status",
    accessorKey: "customerStatus",
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

export const CustomerPage = () => {
  const [customerFormOpen, setCustomerFormOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListItem | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: customerData, isFetching, refetch } = useQuery({
    queryKey: ["customers", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getCustomers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  })

  const deleteSelectedCustomer = async (customerId: string) => {
    try {
      const resp = await deleteCustomers(customerId)
      refetch()
      toast.success(resp.message || "Customer deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete customer")
    }
  }

  const openAddCustomer = () => {
    setSelectedCustomer(null)
    setCustomerFormOpen(true)
  }

  const onSuccess = () => {
    setCustomerFormOpen(false)
    setSelectedCustomer(null)
    refetch()
  }

  const actions: Action<CustomerListItem>[] = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: (row) => {
        setSelectedCustomer(row)
        setCustomerFormOpen(true)
      },
      permission: hasPermission(PERMISSIONS.Customers.Modify),
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onClick: (row) => deleteSelectedCustomer(row.customerId),
      permission: hasPermission(PERMISSIONS.Customers.Modify),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        pageName="Customers"
        pageSubName="Manage your customer relationships"
        actionButtonLabel="Add Customer"
        onActionButtonClick={openAddCustomer}
        addPermission={hasPermission(PERMISSIONS.Customers.Create)}
      />
      <ResponsiveDataTable
        columns={columns}
        data={customerData?.records || []}
        loading={isFetching}
        pageSize={pagination.pageSize}
        pageCount={customerData?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        actions={actions}
      />
      <CustomerForm
        open={customerFormOpen}
        onOpenChange={setCustomerFormOpen}
        customer={selectedCustomer}
        onSuccess={onSuccess}
      />
    </PageContainer>
  )
}
