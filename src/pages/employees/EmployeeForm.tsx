import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { employeeFormSchema, type EmployeeFormValues } from "@/lib/validation/employee.validation"
import { createUser, updateUser, type UserResponse } from "@/services/user.service"
import { FormInputSelect } from "@/formComponent/FormInputSelect"

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

  const { formState: { isSubmitting }, reset, control } = form

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
    if (isEdit) {
      form.clearErrors("password")
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
          password: values.password,
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
      <form className="space-y-4 pb-4 pt-1" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormInputField control={control} name="fname" label="First name" required placeholder="Enter First Name" />
        <FormInputField control={control} name="lname" label="Last name" required placeholder="Enter Last Name"/>
        <FormInputField control={control} name="email" label="Email" required placeholder="Enter Email" disabled={isEdit}/>
        <FormInputField control={control} name="phone" label="Phone" required placeholder="Enter Phone Number"/>
        {!isEdit && (
          <FormInputField control={control} name="password" label="Password" type="password" required placeholder="Enter Password"/>
        )}
        <FormInputSelect control={control} name="roleId" label="Role ID" options={roleOptions} placeholder="Select role" required />
      </form>
    </CustomSlider>
  )
}
