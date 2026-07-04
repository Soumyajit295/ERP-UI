import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { CustomSlider } from "@/customComponent/CustomSlider"
import { InputField } from "@/customComponent/form-components/InputField"
import { employeeFormSchema, type EmployeeFormValues } from "@/lib/validation/employee.validation"
import { createUser, updateUser, type UserResponse } from "@/services/user.service"
import { SelectDropdown } from "@/customComponent/form-components/SelectDropdown"

interface EmployeeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: UserResponse | null
  onSuccess?: () => void
  roleOptions: {label: string,value: string}[]
}

const defaultValues: EmployeeFormValues = {
  fname: "",
  lname: "",
  email: "",
  phone: "",
  password: "",
  roleId: "",
}

export function EmployeeForm({
  open,
  onOpenChange,
  employee,
  onSuccess,
  roleOptions
}: EmployeeFormProps) {
  const isEdit = !!employee

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
  })

  const { formState: { isSubmitting }, reset } = form

  useEffect(() => {
    if (!open) return

    reset(
      employee
        ? {
          fname: employee.fname,
          lname: employee.lname,
          email: employee.email,
          phone: employee.phone ?? "",
          password: "",
          roleId: employee.roleId,
        }
        : defaultValues,
    )
  }, [employee, open, reset])

  const handleSubmit = async (values: EmployeeFormValues) => {
    const password = values.password ?? ""

    if (!isEdit && !password) {
      form.setError("password", { message: "Password is required" })
      return
    }

    if (!isEdit && password.length < 5) {
      form.setError("password", { message: "Password must be at least 5 characters" })
      return
    }

    try {
      if (employee) {
        await updateUser(employee.userId, {
          fname: values.fname,
          lname: values.lname,
          phone: values.phone,
          roleId: values.roleId,
        })
        toast.success("Employee updated successfully")
      } else {
        await createUser({
          fname: values.fname,
          lname: values.lname,
          email: values.email,
          phone: values.phone,
          password,
          roleId: values.roleId,
        })
        toast.success("Employee created successfully")
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save employee")
    }
  }

  return (
    <CustomSlider
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit employee" : "Add employee"}
      description={isEdit ? "Update employee details and role" : "Create a new employee account"}
      submitLabel={isEdit ? "Update" : "Create"}
      loading={isSubmitting}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={() => form.reset(defaultValues)}
    >
      <FormProvider {...form}>
        <form className="space-y-4 pb-4 pt-1" onSubmit={form.handleSubmit(handleSubmit)}>
          <InputField name="fname" label="First name" required placeholder="Enter First Name" />
          <InputField name="lname" label="Last name" required placeholder="Enter Last Name"/>
          <InputField name="email" label="Email" required placeholder="Enter Email" disabled={isEdit}/>
          <InputField name="phone" label="Phone" required placeholder="Enter Phone Number"/>
          {!isEdit && (
            <InputField name="password" label="Password" type="password" required placeholder="Enter Password"/>
          )}
          <SelectDropdown
            name="roleId"
            options={roleOptions}
            label="Role ID"
            placeholder="Select role"
            searchable
            searchPlaceholder="Search role"
            required
          />
        </form>
      </FormProvider>
    </CustomSlider>
  )
}
