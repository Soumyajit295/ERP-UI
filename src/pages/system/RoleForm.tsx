import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CustomModal } from "@/customComponent/CustomModal"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormCheckboxGroup } from "@/formComponent/FormCheckboxGroup"
import { getModuleOptions } from "@/services/module.service"
import { getPermissionOptionsByModuleId } from "@/services/permission.service"
import { createRole, type CreateRoleRequest } from "@/services/role-permission.service"
import { toast } from "sonner"

interface RoleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ModulePermissionPair {
  moduleId: string
  moduleName: string
  permissionIds: string[]
}

export function RoleForm({ open, onOpenChange }: RoleFormProps) {
  const queryClient = useQueryClient()
  const [selectedModuleId, setSelectedModuleId] = useState("")
  const [addedModules, setAddedModules] = useState<ModulePermissionPair[]>([])


  const form = useForm<{ roleName: string; module: string; permissions: string[] }>({
    defaultValues: { roleName: "", module: "", permissions: [] },
  })
  const { control, watch, setValue } = form

  const { data: moduleOptions = [] } = useQuery({
    queryKey: ["module-options"],
    queryFn: getModuleOptions,
    enabled: open,
  })

  const { data: permissionOptions = [] } = useQuery({
    queryKey: ["permission-options", selectedModuleId],
    queryFn: () => getPermissionOptionsByModuleId(selectedModuleId),
    enabled: !!selectedModuleId,
  })

  const watchedModule = watch("module")

  useEffect(() => {
    if (watchedModule) {
      setSelectedModuleId(watchedModule)
    }
  }, [watchedModule])

  const mutation = useMutation({
    mutationFn: (payload: CreateRoleRequest) => createRole(payload),
    onSuccess: () => {
      toast.success("Role created successfully")
      queryClient.invalidateQueries({ queryKey: ["tenant-roles"] })
      handleClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create role")
    },
  })

  const handleClose = () => {
    form.reset()
    setSelectedModuleId("")
    setAddedModules([])
    onOpenChange(false)
  }

  const handleAddModule = () => {
    const permIds = form.getValues("permissions")
    const mod = moduleOptions.find((m) => m.value === selectedModuleId)
    if (!mod) return

    setAddedModules((prev) => {
      const existing = prev.find((m) => m.moduleId === selectedModuleId)
      if (existing) {
        return prev.map((m) =>
          m.moduleId === selectedModuleId
            ? { ...m, permissionIds: permIds }
            : m
        )
      }
      return [...prev, { moduleId: selectedModuleId, moduleName: mod.label, permissionIds: permIds }]
    })

    setSelectedModuleId("")
    setValue("module", "")
    setValue("permissions", [])
  }

  const handleRemoveModule = (moduleId: string) => {
    setAddedModules((prev) => prev.filter((m) => m.moduleId !== moduleId))
  }

  const handleSubmit = () => {
    const roleName = form.getValues("roleName")
    if (!roleName.trim()) {
      toast.error("Please enter a role name")
      return
    }
    if (addedModules.length === 0) {
      toast.error("Please add at least one module with permissions")
      return
    }

    mutation.mutate({
      roleName: roleName.trim(),
      modules: addedModules.map((m) => ({
        moduleId: m.moduleId,
        permissions: m.permissionIds,
      })),
    })
  }

  const availableModuleOptions = moduleOptions.filter(
    (m) => !addedModules.some((a) => a.moduleId === m.value)
  )

  return (
    <CustomModal
      open={open}
      onOpenChange={handleClose}
      title="Add Role"
      description="Create a new role and assign module permissions"
      submitLabel="Create Role"
      onSubmit={handleSubmit}
      loading={mutation.isPending}
    >
      <div className="space-y-6 p-1">
        <FormInputField
          control={control}
          name="roleName"
          label="Role Name"
          placeholder="Enter role name"
          required
        />

        {addedModules.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Added Modules</p>
            <div className="space-y-2">
              {addedModules.map((mod) => (
                <div
                  key={mod.moduleId}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{mod.moduleName}</p>
                    <p className="text-xs text-muted-foreground">
                      {mod.permissionIds.length} permission(s)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(mod.moduleId)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <FormInputSelect
          control={control}
          name="module"
          label="Add Module"
          options={availableModuleOptions}
          placeholder="Select a module"
          required
        />

        {selectedModuleId && permissionOptions.length > 0 && (
          <div className="space-y-2">
            <FormCheckboxGroup
              control={control}
              name="permissions"
              label={`Permissions for ${moduleOptions.find((m) => m.value === selectedModuleId)?.label}`}
              options={permissionOptions.map((p) => ({ value: p.value, label: p.label }))}
            />
            <button
              type="button"
              onClick={handleAddModule}
              disabled={watch("permissions").length === 0}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Add Module
            </button>
          </div>
        )}
      </div>
    </CustomModal>
  )
}
