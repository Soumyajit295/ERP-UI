import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
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
import { togglePermission, getPermissionOptionsByModuleId } from "@/services/permission.service"
import { toast } from "sonner"

interface ModulePermission {
  moduleId: string
  moduleName: string
  create: boolean
  read: boolean
  modify: boolean
  createPermissionId?: string
  readPermissionId?: string
  modifyPermissionId?: string
}

function transformPermissions(
  allModules: { label: string; value: string }[],
  records: PemissionsResponse[],
): ModulePermission[] {
  const permMap = new Map<string, { create: string | undefined; read: string | undefined; modify: string | undefined }>()

  for (const p of records) {
    if (!permMap.has(p.moduleId)) {
      permMap.set(p.moduleId, { create: undefined, read: undefined, modify: undefined })
    }
    const entry = permMap.get(p.moduleId)!
    if (p.permissionName === "CREATE") entry.create = p.permissionId
    if (p.permissionName === "READ") entry.read = p.permissionId
    if (p.permissionName === "MODIFY") entry.modify = p.permissionId
  }

  return allModules.map((mod) => {
    const perm = permMap.get(mod.value)
    return {
      moduleId: mod.value,
      moduleName: mod.label,
      create: !!perm?.create,
      read: !!perm?.read,
      modify: !!perm?.modify,
      createPermissionId: perm?.create,
      readPermissionId: perm?.read,
      modifyPermissionId: perm?.modify,
    }
  })
}

function getColumns(
  isToggling: boolean,
  onToggleAll: (row: ModulePermission) => void,
  onToggleSingle: (row: ModulePermission, field: "create" | "read" | "modify") => void,
): ColumnDef<ModulePermission>[] {
  return [
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.create}
          disabled={isToggling}
          onCheckedChange={() => onToggleSingle(row.original, "create")}
        />
      ),
    },
    {
      id: "read",
      header: "Read",
      meta: { mobileLabel: "Read" },
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.read}
          disabled={isToggling}
          onCheckedChange={() => onToggleSingle(row.original, "read")}
        />
      ),
    },
    {
      id: "modify",
      header: "Modify",
      meta: { mobileLabel: "Modify" },
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.modify}
          disabled={isToggling}
          onCheckedChange={() => onToggleSingle(row.original, "modify")}
        />
      ),
    },
    {
      id: "all",
      header: "All",
      meta: { mobileLabel: "All" },
      cell: ({ row }) => {
        const all = row.original.create && row.original.read && row.original.modify
        return (
          <Checkbox
            checked={all}
            disabled={isToggling}
            onCheckedChange={() => onToggleAll(row.original)}
          />
        )
      },
    },
  ]
}

export const RolePermissionPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [initialized, setInitialized] = useState(false)
  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const queryClient = useQueryClient()

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

  const handleToggleAll = async (row: ModulePermission) => {
    if (!selectedRoleId) return
    setIsToggling(true)
    try {
      const allChecked = row.create && row.read && row.modify
      const permissionIds: string[] = []

      if (allChecked) {
        if (row.createPermissionId) permissionIds.push(row.createPermissionId)
        if (row.readPermissionId) permissionIds.push(row.readPermissionId)
        if (row.modifyPermissionId) permissionIds.push(row.modifyPermissionId)
      } else {
        if (!row.createPermissionId) permissionIds.push("create")
        if (!row.readPermissionId) permissionIds.push("read")
        if (!row.modifyPermissionId) permissionIds.push("modify")
      }

      for (const permissionId of permissionIds) {
        if (["create", "read", "modify"].includes(permissionId)) {
          const permOptions = await getPermissionOptionsByModuleId(row.moduleId)
          const fieldMap: Record<string, string> = {
            create: "CREATE",
            read: "READ",
            modify: "MODIFY",
          }
          const found = permOptions.find(
            (opt) => opt.label.toUpperCase() === fieldMap[permissionId]
          )
          if (found) {
            const res = await togglePermission(selectedRoleId, {
              action: "ASSIGN",
              permissionId: found.value,
            })
            toast.success(res.message)
          }
        } else {
          const res = await togglePermission(selectedRoleId, {
            action: allChecked ? "REMOVE" : "ASSIGN",
            permissionId,
          })
          toast.success(res.message)
        }
      }

      queryClient.invalidateQueries({ queryKey: ["role-permissions", selectedRoleId] })
    } finally {
      setIsToggling(false)
    }
  }

  const handleToggleSingle = async (
    row: ModulePermission,
    field: "create" | "read" | "modify",
  ) => {
    if (!selectedRoleId) return
    setIsToggling(true)
    try {
      const isChecked = row[`${field}`]
      const permIdField = `${field}PermissionId` as keyof ModulePermission
      let permissionId = row[permIdField] as string | undefined

      if (!permissionId) {
        const permOptions = await getPermissionOptionsByModuleId(row.moduleId)
        const fieldMap: Record<string, string> = {
          create: "CREATE",
          read: "READ",
          modify: "MODIFY",
        }
        const found = permOptions.find(
          (opt) => opt.label.toUpperCase() === fieldMap[field]
        )
        permissionId = found?.value
      }

      if (permissionId) {
        const res = await togglePermission(selectedRoleId, {
          action: isChecked ? "REMOVE" : "ASSIGN",
          permissionId,
        })
        toast.success(res.message)
        queryClient.invalidateQueries({ queryKey: ["role-permissions", selectedRoleId] })
      }
    } finally {
      setIsToggling(false)
    }
  }

  const columns = getColumns(isToggling, handleToggleAll, handleToggleSingle)

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
