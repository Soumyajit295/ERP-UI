import { ResponsiveDataTable } from "@/customComponent/data-table"
import type { ColumnDef, Action } from "@/customComponent/data-table"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { type PaginationState } from "@tanstack/react-table"
import { deleteUser, getTenantUsers, type UserResponse } from "@/services/user.service"
import { EmployeeForm } from "./EmployeeForm"
import { getRolesOptions } from "@/services/role-permission.service"
import { PERMISSIONS } from "@/common/constants/permissions.constant"
import { hasPermission } from "@/common/utils"

const columns: ColumnDef<UserResponse>[] = [
  {
    id: "name",
    header: "Name",
    meta: { mobileLabel: "Name" },
    cell: ({ row }) => `${row.original.fname} ${row.original.lname}`,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    meta: { mobileLabel: "Email" },
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "roleName",
    meta: { mobileLabel: "Role" },
  },
  {
    id: "phone",
    header: "Phone",
    accessorKey: "phone",
    meta: { mobileLabel: "Phone" },
    cell: ({ getValue }) => getValue() || "-",
  },
]

export const EmployePage = () => {
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const {data,isFetching,refetch} = useQuery({
    queryKey: ["tenant-users", pagination.pageIndex, pagination.pageSize],
    queryFn: () => getTenantUsers({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
  })

  const {data: roleOptions} = useQuery({
    queryKey: ['tenant-roles'],
    queryFn: getRolesOptions
  })


  const deleteSelectedUser = async(userId: string) => {
    try {
      await deleteUser(userId)
      refetch()
      toast.success('User deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user')
    }
  }

  const openAddEmployee = () => {
    setSelectedEmployee(null)
    setEmployeeFormOpen(true)
  }

  const onSuccess = () => {
    setEmployeeFormOpen(false)
    refetch()
  }

  const hasDeletePermission = hasPermission(PERMISSIONS.User.Modify)

  const actions: Action<UserResponse>[] = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: (row) => {
        setSelectedEmployee(row)
        setEmployeeFormOpen(true)
      },
      permission: hasPermission(PERMISSIONS.User.Modify)
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onClick: (row) => deleteSelectedUser(row.userId),
      permission: (row) => hasDeletePermission && row?.createdBy !== "SYSTEM",
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        pageName="Employees"
        pageSubName="Manage your team members and their roles"
        actionButtonLabel="Add Employee"
        onActionButtonClick={openAddEmployee}
        addPermission={hasPermission(PERMISSIONS.User.Create)}
      />
      <ResponsiveDataTable
        columns={columns}
        data={data?.records || []}
        loading={isFetching}
        pageSize={pagination.pageSize}
        pageCount={data?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        actions={actions}
      />
      <EmployeeForm
        open={employeeFormOpen}
        onOpenChange={setEmployeeFormOpen}
        employee={selectedEmployee}
        onSuccess={onSuccess}
        roleOptions={roleOptions || []}
      />
    </PageContainer>
  )
}
