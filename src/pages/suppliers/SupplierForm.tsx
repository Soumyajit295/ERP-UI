import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { supplierFormSchema, type SupplierFormValues } from "@/lib/validation/supplier.validation"
import { createSupplier, updateSupplier, type Supplier } from "@/services/supplier.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SupplierFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier | null
  onSuccess?: () => void
}

const defaultValues: SupplierFormValues = {
  supplierName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  taxNumber: "",
}

export function SupplierForm({
  open,
  onOpenChange,
  supplier,
  onSuccess
}: SupplierFormProps) {
  const isEdit = !!supplier

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues,
  })

  const { formState: { isSubmitting }, reset, control } = form

  useEffect(() => {
    if (!open) return

    reset(
      supplier
        ? {
            supplierName: supplier.supplierName,
            contactPerson: supplier.contactPerson ?? "",
            email: supplier.email ?? "",
            phone: supplier.phone ?? "",
            address: supplier.address ?? "",
            taxNumber: supplier.taxNumber ?? "",
          }
        : defaultValues,
    )
  }, [supplier, open, reset])

  const handleSubmit = async (values: SupplierFormValues) => {
    const payload = {
      supplierName: values.supplierName,
      contactPerson: values.contactPerson || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
      taxNumber: values.taxNumber || undefined,
    }

    try {
      if (supplier) {
        const resp = await updateSupplier(supplier.supplierId, payload)
        toast.success(resp.message || "Supplier updated successfully")
      } else {
        await createSupplier(payload)
        toast.success("Supplier created successfully")
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save supplier")
    }
  }

  return (
    <CustomSlider
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Supplier" : "Create Supplier"}
      description={isEdit ? "Update supplier details" : "Add a new supplier"}
      submitLabel={isEdit ? "Update" : "Create"}
      loading={isSubmitting}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={() => form.reset(defaultValues)}
    >
      <form className="space-y-4 pb-4 pt-1" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormInputField control={control} name="supplierName" label="Company Name" required placeholder="Enter Company Name" />
        <FormInputField control={control} name="contactPerson" label="Contact Name" placeholder="Enter Contact Name" />
        <FormInputField control={control} name="email" label="Contact Email" placeholder="Enter Contact Email" />
        <FormInputField control={control} name="phone" label="Contact Phone" placeholder="Enter Contact Phone" />
        <FormInputField control={control} name="address" label="City" placeholder="Enter City" />
        <FormInputField control={control} name="taxNumber" label="GST Number" placeholder="Enter GST Number" />
      </form>
    </CustomSlider>
  )
}
