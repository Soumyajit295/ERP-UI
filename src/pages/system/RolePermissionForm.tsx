import { useForm, FormProvider } from "react-hook-form"
import { CustomSlider } from "@/customComponent/CustomSlider"
import { SelectDropdown } from "@/customComponent/form-components/SelectDropdown"
import { ToggleSwitch } from "@/customComponent/form-components/ToggleSwitch"

interface RoleOption {
  label: string
  value: string
}

interface ModuleOption {
  label: string
  value: string
}

interface RolePermissionFormValues {
  roleId: string
  module: string
  create: boolean
  read: boolean
  modify: boolean
}

interface RolePermissionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleOptions: RoleOption[]
  moduleOptions: ModuleOption[]
}

const defaultValues: RolePermissionFormValues = {
  roleId: "",
  module: "",
  create: false,
  read: false,
  modify: false,
}

export function RolePermissionForm({
  open,
  onOpenChange,
  roleOptions,
  moduleOptions,
}: RolePermissionFormProps) {
  const form = useForm<RolePermissionFormValues>({ defaultValues })
  const { reset } = form

  const handleSubmit = (values: RolePermissionFormValues) => {
    console.log(values)
    onOpenChange(false)
  }

  return (
    <CustomSlider
      open={open}
      onOpenChange={onOpenChange}
      title="Add Role Permission"
      description="Assign permissions to a role for a specific module"
      submitLabel="Save"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <FormProvider {...form}>
        <div className="space-y-6 p-1">
          <SelectDropdown
            name="roleId"
            options={roleOptions}
            label="Role"
            placeholder="Select a role"
            searchable
            searchPlaceholder="Search role"
            required
          />

          <SelectDropdown
            name="module"
            options={moduleOptions}
            label="Module"
            placeholder="Select a module"
            searchable
            searchPlaceholder="Search module"
            required
          />

          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">
              Permissions <span className="text-destructive">*</span>
            </p>
            <div className="space-y-2">
              <ToggleSwitch name="create" label="Create" />
              <ToggleSwitch name="read" label="Read" />
              <ToggleSwitch name="modify" label="Modify" />
            </div>
          </div>
        </div>
      </FormProvider>
    </CustomSlider>
  )
}
