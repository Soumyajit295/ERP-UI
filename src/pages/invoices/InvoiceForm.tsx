import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormDatePicker } from "@/formComponent/FormDatePicker"
import {
  invoiceFormSchema,
  type InvoiceFormValues,
} from "@/lib/validation/invoice.validation"
import {
  createInvoice,
  updateInvoiceStatus,
  type InvoiceDetailsResponse,
} from "@/services/invoice.service"
import { getCustomersOptions } from "@/services/customer.service"
import { getSalesOrderOptions } from "@/services/sales-order.service"
import { InvoiceStatus } from "@/common/enums/InvoiceStatus.enum"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: InvoiceDetailsResponse | null
  isEdit?: boolean
  onSuccess?: () => void
}

const statusOptions = Object.values(InvoiceStatus).map((s) => ({
  value: s,
  label: s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " "),
}))

const defaultValues: InvoiceFormValues = {
  customerId: "",
  salesOrderId: "",
  issueDate: "",
  dueDate: "",
  notes: "",
  status: "",
}

export function InvoiceForm({
  open,
  onOpenChange,
  invoice,
  isEdit = false,
  onSuccess,
}: InvoiceFormProps) {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  })

  const {
    formState: { isSubmitting },
    reset,
    control,
    watch,
    setValue,
  } = form

  const selectedCustomerId = watch("customerId")

  const effectiveCustomerId = isEdit ? (invoice?.customerId || selectedCustomerId) : selectedCustomerId

  console.log("Effective customer id : ",effectiveCustomerId)

  const { data: customerOptions } = useQuery({
    queryKey: ["customer-options"],
    queryFn: getCustomersOptions,
  })

  const { data: salesOrderOptions,refetch } = useQuery({
    queryKey: ["sales-order-options", effectiveCustomerId],
    queryFn: () =>
      getSalesOrderOptions(
        effectiveCustomerId ? { customerId: effectiveCustomerId } : undefined
      ),
    enabled: !!effectiveCustomerId,
  })

  console.log("Invoice data : ",invoice)

  useEffect(() => {
    if (!open) return

    const load = async() => {
      if (invoice && isEdit) {
        await refetch()
        console.log("sales order option now : ",salesOrderOptions)
        reset({
          customerId: invoice.customerId || "",
          salesOrderId: invoice.salesOrderId || "",
          issueDate: invoice.issueDate
            ? format(new Date(invoice.issueDate), "yyyy-MM-dd")
            : "",
          dueDate: invoice.dueDate
            ? format(new Date(invoice.dueDate), "yyyy-MM-dd")
            : "",
          status: invoice.status || "",
          notes: invoice.notes || "",
        })
      } else {
        reset(defaultValues)
      }
    }

    load()
  }, [invoice, open, isEdit, reset])

  useEffect(() => {
    if (isEdit) return
    setValue("salesOrderId", "")
  }, [selectedCustomerId, isEdit, setValue])

  const handleSubmit = async (values: InvoiceFormValues) => {
    try {
      if (isEdit && invoice) {
        const resp = await updateInvoiceStatus(invoice.invoiceId, {
          dueDate: values.dueDate,
          notes: values.notes || ''
        })
        toast.success(resp.message || "Status updated successfully")
      } else {
        await createInvoice({
          customerId: values.customerId,
          salesOrderId: values.salesOrderId,
          issueDate: values.issueDate,
          dueDate: values.dueDate,
          notes: values.notes || '',
        })
        toast.success("Invoice created successfully")
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save invoice")
    }
  }

  return (
    <CustomSlider
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Invoice" : "Create Invoice"}
      description={
        isEdit ? "Update invoice status" : "Create a new invoice from a sales order"
      }
      submitLabel={isEdit ? "Update" : "Create"}
      loading={isSubmitting}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={() => form.reset(defaultValues)}
    >
      <form
        className="space-y-4 pb-4 pt-1"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInputSelect
          control={control}
          name="customerId"
          label="Customer"
          required
          placeholder="Select customer"
          options={customerOptions || []}
          extraClassName={isEdit ? "opacity-50 pointer-events-none" : ""}
        />

        <FormInputSelect
          control={control}
          name="salesOrderId"
          label="Sales Order"
          required
          placeholder="Select sales order"
          options={salesOrderOptions || []}
          extraClassName={isEdit || !selectedCustomerId ? "opacity-50 pointer-events-none" : ""}
        />

        <FormDatePicker
          control={control}
          name="issueDate"
          label="Issue Date"
          required
          disabled={isEdit}
        />

        <FormDatePicker
          control={control}
          name="dueDate"
          label="Due Date"
          required
        />

        <FormInputField
          control={control}
          name="notes"
          label="Notes"
          placeholder="Enter notes (optional)"
        />
      </form>
    </CustomSlider>
  )
}
