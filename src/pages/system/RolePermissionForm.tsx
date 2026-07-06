import { useForm } from "react-hook-form"
import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormInputToggle } from "@/formComponent/FormInputToggle"

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
  const { reset, control } = form

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
      <div className="space-y-6 p-1">
        <FormInputSelect control={control} name="roleId" label="Role" options={roleOptions} placeholder="Select a role" required />
        <FormInputSelect control={control} name="module" label="Module" options={moduleOptions} placeholder="Select a module" required />

        <div className="space-y-2">
          <p className="text-sm font-medium leading-none">
            Permissions <span className="text-destructive">*</span>
          </p>
          <div className="space-y-2">
            <FormInputToggle control={control} name="create" label="Create" />
            <FormInputToggle control={control} name="read" label="Read" />
            <FormInputToggle control={control} name="modify" label="Modify" />
          </div>
        </div>
      </div>
    </CustomSlider>
  )
}
