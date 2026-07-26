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
import { Checkbox } from "@/components/ui/checkbox"
import { getModuleOptions } from "@/services/module.service"
import { RoleForm } from "./RoleForm"

interface ModulePermission {
  moduleId: string
  moduleName: string
  create: boolean
  read: boolean
  modify: boolean
}

function transformPermissions(
  allModules: { label: string; value: string }[],
  records: PemissionsResponse[],
): ModulePermission[] {
  const permMap = new Map<string, { create: boolean; read: boolean; modify: boolean }>()

  for (const p of records) {
    if (!permMap.has(p.moduleId)) {
      permMap.set(p.moduleId, { create: false, read: false, modify: false })
    }
    const entry = permMap.get(p.moduleId)!
    if (p.permissionName === "CREATE") entry.create = true
    if (p.permissionName === "READ") entry.read = true
    if (p.permissionName === "MODIFY") entry.modify = true
  }

  return allModules.map((mod) => {
    const perm = permMap.get(mod.value)
    return {
      moduleId: mod.value,
      moduleName: mod.label,
      create: perm?.create ?? false,
      read: perm?.read ?? false,
      modify: perm?.modify ?? false,
    }
  })
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
    cell: ({ row }) => <Checkbox checked={row.original.create} disabled />,
  },
  {
    id: "read",
    header: "Read",
    meta: { mobileLabel: "Read" },
    cell: ({ row }) => <Checkbox checked={row.original.read} disabled />,
  },
  {
    id: "modify",
    header: "Modify",
    meta: { mobileLabel: "Modify" },
    cell: ({ row }) => <Checkbox checked={row.original.modify} disabled />,
  },
]

export const RolePermissionPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [initialized, setInitialized] = useState(false)
  const [roleFormOpen, setRoleFormOpen] = useState(false)

  const { data: roleOptions } = useQuery({
    queryKey: ["tenant-roles"],
    queryFn: getRolesOptions,
  })

  const { data: allModules } = useQuery({
    queryKey: ["tenant-modules"],
    queryFn: getModuleOptions,
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

  const tableData =
    allModules && permissions
      ? transformPermissions(allModules, permissions)
      : allModules
        ? allModules.map((mod) => ({
            moduleId: mod.value,
            moduleName: mod.label,
            create: false,
            read: false,
            modify: false,
          }))
        : []

  return (
    <PageContainer>
      <PageHeader
        pageName="Role Permission"
        pageSubName="Manage roles and their permissions"
        actionButtonLabel="Add Role"
        onActionButtonClick={() => setRoleFormOpen(true)}
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
      <RoleForm open={roleFormOpen} onOpenChange={setRoleFormOpen} />
    </PageContainer>
  )
}
