import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { ResponsiveDataTable } from "@/customComponent/data-table"
import type { ColumnDef } from "@/customComponent/data-table"
import { getPermissionByRole, getRolesOptions, type PemissionsResponse } from "@/services/role-permission.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PERMISSIONS } from "@/common/constants/permissions.constant"
import { hasPermission } from "@/common/utils"
import { RolePermissionForm } from "./RolePermissionForm"

interface ModulePermission {
  moduleId: string
  moduleName: string
  create: boolean
  read: boolean
  modify: boolean
}

function transformPermissions(records: PemissionsResponse[]): ModulePermission[] {
  const map = new Map<string, ModulePermission>()

  for (const p of records) {
    if (!map.has(p.moduleId)) {
      map.set(p.moduleId, {
        moduleId: p.moduleId,
        moduleName: p.moduleName,
        create: false,
        read: false,
        modify: false,
      })
    }
    const entry = map.get(p.moduleId)!
    if (p.permissionName === "CREATE") entry.create = true
    if (p.permissionName === "READ") entry.read = true
    if (p.permissionName === "MODIFY") entry.modify = true
  }

  return Array.from(map.values())
}

const columns: ColumnDef<ModulePermission>[] = [
  {
    id: "moduleName",
    header: "Module Name",
    accessorKey: "moduleName",
    meta: { mobileLabel: "Module Name" },
  },
  {
    id: "create",
    header: "Create",
    meta: { mobileLabel: "Create" },
    cell: ({ row }) => (row.original.create ? "Yes" : "No"),
  },
  {
    id: "read",
    header: "Read",
    meta: { mobileLabel: "Read" },
    cell: ({ row }) => (row.original.read ? "Yes" : "No"),
  },
  {
    id: "modify",
    header: "Modify",
    meta: { mobileLabel: "Modify" },
    cell: ({ row }) => (row.original.modify ? "Yes" : "No"),
  },
]

export const RolePermissionPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [initialized, setInitialized] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const { data: roleOptions } = useQuery({
    queryKey: ["tenant-roles"],
    queryFn: getRolesOptions,
  })

  useEffect(() => {
    if (roleOptions && !initialized) {
      const admin = roleOptions.find(
        (r) => r.label.toLowerCase() === "admin"
      )
      if (admin) {
        setSelectedRoleId(admin.value)
      }
      setInitialized(true)
    }
  }, [roleOptions, initialized])

  const { data: permissions, isFetching } = useQuery({
    queryKey: ["role-permissions", selectedRoleId],
    queryFn: () => getPermissionByRole(selectedRoleId),
    enabled: !!selectedRoleId,
  })

  const tableData = permissions ? transformPermissions(permissions) : []

  const moduleOptions = Object.keys(PERMISSIONS).map((key) => ({
    label: key,
    value: key,
  }))

  return (
    <PageContainer>
      <PageHeader
        pageName="Role Permission"
        pageSubName="Manage roles and their permissions"
        actionButtonLabel="Add Role Permission"
        onActionButtonClick={() => setFormOpen(true)}
        addPermission={hasPermission(PERMISSIONS.User.Create)}
      />
      <div className="flex items-center gap-4 pb-2">
        <span className="text-sm font-medium whitespace-nowrap">Select Role</span>
        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions?.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        <ResponsiveDataTable
          columns={columns}
          data={tableData}
          loading={isFetching}
        />
      <RolePermissionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        roleOptions={roleOptions || []}
        moduleOptions={moduleOptions}
      />
    </PageContainer>
  )
}
