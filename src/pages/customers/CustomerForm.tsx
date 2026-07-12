import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormTextArea } from "@/formComponent/FormTextArea"
import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/lib/validation/customer.validation"
import {
  createCustomer,
  updateCustomer,
  type CustomerListItem,
} from "@/services/customer.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface CustomerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: CustomerListItem | null
  onSuccess?: () => void
}

const defaultValues: CustomerFormValues = {
  customerName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  isActive: "true",
}

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
]

export function CustomerForm({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: CustomerFormProps) {
  const isEdit = !!customer

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  })

  const {
    formState: { isSubmitting },
    reset,
    control,
  } = form

  useEffect(() => {
    if (!open) return

    reset(
      customer
        ? {
            customerName: customer.customerName,
            email: customer.customerEmail ?? "",
            phone: customer.customerPhone ?? "",
            city: customer.customerCity ?? "",
            address: "",
            isActive: customer.customerStatus ? "true" : "false",
          }
        : defaultValues,
    )
  }, [customer, open, reset])

  const handleSubmit = async (values: CustomerFormValues) => {
    const payload = {
      customerName: values.customerName,
      email: values.email || undefined,
      phone: values.phone || undefined,
      city: values.city || undefined,
      address: values.address || undefined,
    }

    try {
      if (customer) {
        const updatePayload = {
          ...payload,
          isActive: values.isActive === "true",
        }
        const resp = await updateCustomer(customer.customerId, updatePayload)
        toast.success(resp.message || "Customer updated successfully")
      } else {
        await createCustomer(payload)
        toast.success("Customer created successfully")
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save customer")
    }
  }

  return (
    <CustomSlider
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Customer" : "Create Customer"}
      description={isEdit ? "Update customer details" : "Add a new customer"}
      submitLabel={isEdit ? "Update" : "Create"}
      loading={isSubmitting}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={() => form.reset(defaultValues)}
    >
      <form
        className="space-y-4 pb-4 pt-1"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInputField
          control={control}
          name="customerName"
          label="Name"
          required
          placeholder="Enter Customer Name"
        />
        <FormInputField
          control={control}
          name="email"
          label="Email"
          placeholder="Enter Email"
        />
        <FormInputField
          control={control}
          name="phone"
          label="Phone"
          placeholder="Enter Phone Number"
        />
        <FormInputField
          control={control}
          name="city"
          label="City"
          placeholder="Enter City"
        />
        <FormTextArea
          control={control}
          name="address"
          label="Address"
          placeholder="Enter Address"
        />
        {isEdit && (
          <FormInputSelect
            control={control}
            name="isActive"
            label="Status"
            options={statusOptions}
            placeholder="Select Status"
          />
        )}
      </form>
    </CustomSlider>
  )
}
