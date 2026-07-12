import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormTextArea } from "@/formComponent/FormTextArea"
import {
  warehouseFormSchema,
  type WarehouseFormValues,
} from "@/lib/validation/warehouse.validation"
import {
  createWarehouse,
  updateWarehouse,
  type WarehouseListItem,
} from "@/services/warehouse.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface WarehouseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse?: WarehouseListItem | null
  onSuccess?: () => void
}

const defaultValues: WarehouseFormValues = {
  warehouseName: "",
  address: "",
  contactPerson: "",
  phone: "",
  capacity: undefined,
  isActive: "true",
}

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
]

export function WarehouseForm({
  open,
  onOpenChange,
  warehouse,
  onSuccess,
}: WarehouseFormProps) {
  const isEdit = !!warehouse

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
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
      warehouse
        ? {
            warehouseName: warehouse.warehouseName,
            address: warehouse.address ?? "",
            contactPerson: warehouse.contactPerson ?? "",
            phone: warehouse.phone ?? "",
            capacity: warehouse.capacity ?? undefined,
            isActive: warehouse.isActive ? "true" : "false",
          }
        : defaultValues,
    )
  }, [warehouse, open, reset])

  const handleSubmit = async (values: WarehouseFormValues) => {
    const payload = {
      warehouseName: values.warehouseName,
      address: values.address || undefined,
      contactPerson: values.contactPerson || undefined,
      phone: values.phone || undefined,
      capacity: values.capacity || undefined,
    }

    try {
      if (warehouse) {
        const updatePayload = {
          ...payload,
          isActive: values.isActive === "true",
        }
        const resp = await updateWarehouse(warehouse.warehouseId, updatePayload)
        toast.success(resp.message || "Warehouse updated successfully")
      } else {
        await createWarehouse(payload)
        toast.success("Warehouse created successfully")
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save warehouse")
    }
  }

  return (
    <CustomSlider
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Warehouse" : "Create Warehouse"}
      description={isEdit ? "Update warehouse details" : "Add a new warehouse"}
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
          name="warehouseName"
          label="Warehouse Name"
          required
          placeholder="Enter Warehouse Name"
        />
        <FormTextArea
          control={control}
          name="address"
          label="Address"
          placeholder="Enter Warehouse Address"
        />
        <FormInputField
          control={control}
          name="contactPerson"
          label="Contact Person"
          placeholder="Enter Contact Person"
        />
        <FormInputField
          control={control}
          name="phone"
          label="Phone"
          placeholder="Enter Phone Number"
        />
        <FormInputField
          control={control}
          name="capacity"
          label="Capacity"
          placeholder="Enter Capacity"
          type="number"
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
