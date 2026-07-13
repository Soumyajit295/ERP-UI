import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormDatePicker } from "@/formComponent/FormDatePicker"
import {
  salesOrderFormSchema,
  type SalesOrderFormValues,
} from "@/lib/validation/sales-order.validation"
import {
  createSalesOrder,
  updateSalesOrderStatus,
  type SalesOrderDetailsResponse,
} from "@/services/sales-order.service"
import { getCustomersOptions } from "@/services/customer.service"
import { getWarehouseOptions } from "@/services/warehouse.service"
import { getProductOptions } from "@/services/products.service"
import { SalesOrderStatus } from "@/common/enums/SalesOrderStatus.enum"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SalesOrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: SalesOrderDetailsResponse | null
  isEdit?: boolean
  onSuccess?: () => void
}

const statusOptions = Object.values(SalesOrderStatus).map((s) => ({
  value: s,
  label: s.charAt(0) + s.slice(1).toLowerCase(),
}))

const defaultValues: SalesOrderFormValues = {
  customerId: "",
  warehouseId: "",
  orderDate: "",
  status: "DRAFT",
  items: [{ productId: "", quantity: 1, sellingPrice: 0, discount: 0 }],
}

export function SalesOrderForm({
  open,
  onOpenChange,
  order,
  isEdit = false,
  onSuccess,
}: SalesOrderFormProps) {
  const form = useForm<SalesOrderFormValues>({
    resolver: zodResolver(salesOrderFormSchema),
    defaultValues,
  })

  const {
    formState: { isSubmitting },
    reset,
    control,
    watch,
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const { data: customerOptions } = useQuery({
    queryKey: ["customer-options"],
    queryFn: getCustomersOptions,
  })

  const { data: warehouseOptions } = useQuery({
    queryKey: ["warehouse-options"],
    queryFn: getWarehouseOptions,
  })

  const { data: productOptions } = useQuery({
    queryKey: ["product-options"],
    queryFn: getProductOptions,
  })

  const watchedItems = watch("items")

  useEffect(() => {
    if (!open) return

    if (order && isEdit) {
      const customerId = customerOptions?.find((o) => o.label === order.customerInfo.customerName)?.value || ""
      const warehouseId = warehouseOptions?.find((o) => o.label === order.warehouseInfo.warehouseName)?.value || ""

      reset({
        customerId,
        warehouseId,
        orderDate: order.orderDate,
        status: order.orderStatus,
        items: order.items.map((item) => ({
          productId: item.productName,
          quantity: item.quantity,
          sellingPrice: item.unitPrice,
          discount: item.discount,
        })),
      })
    } else {
      reset(defaultValues)
    }
  }, [order, open, isEdit, reset, customerOptions, warehouseOptions])

  const handleSubmit = async (values: SalesOrderFormValues) => {
    try {
      if (isEdit && order) {
        const resp = await updateSalesOrderStatus(order.salesOrderId, {
          status: values.status as any,
        })
        toast.success(resp.message || "Status updated successfully")
      } else {
        await createSalesOrder({
          customerId: values.customerId,
          warehouseId: values.warehouseId,
          orderDate: values.orderDate,
          items: values.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            sellingPrice: item.sellingPrice,
            discount: item.discount,
          })),
        })
        toast.success("Sales order created successfully")
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save sales order")
    }
  }

  return (
    <CustomSlider
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Sales Order" : "Create Sales Order"}
      description={
        isEdit ? "Update order status" : "Add a new sales order"
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
          name="warehouseId"
          label="Warehouse"
          required
          placeholder="Select warehouse"
          options={warehouseOptions || []}
          extraClassName={isEdit ? "opacity-50 pointer-events-none" : ""}
        />

        <FormDatePicker
          control={control}
          name="orderDate"
          label="Order Date"
          required
          disabled={isEdit}
        />

        {isEdit && (
          <FormInputSelect
            control={control}
            name="status"
            label="Status"
            required
            placeholder="Select status"
            options={statusOptions}
          />
        )}

        {!isEdit && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Products</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: "", quantity: 1, sellingPrice: 0, discount: 0 })}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>

            {fields.map((field, index) => {
              const quantity = watchedItems?.[index]?.quantity || 0
              const sellingPrice = watchedItems?.[index]?.sellingPrice || 0
              const discount = watchedItems?.[index]?.discount || 0
              const total = (quantity * sellingPrice) - discount

              return (
                <div key={field.id} className="rounded-lg border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Item {index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <FormInputSelect
                    control={control}
                    name={`items.${index}.productId`}
                    placeholder="Select product"
                    options={productOptions || []}
                  />

                  <FormInputField
                    control={control}
                    name={`items.${index}.quantity`}
                    label="Quantity"
                    type="number"
                    placeholder="0"
                  />

                  <FormInputField
                    control={control}
                    name={`items.${index}.sellingPrice`}
                    label="Selling Price"
                    type="number"
                    placeholder="0.00"
                  />

                  <FormInputField
                    control={control}
                    name={`items.${index}.discount`}
                    label="Discount"
                    type="number"
                    placeholder="0.00"
                  />

                  <div className="flex justify-end">
                    <span className="text-sm font-medium">
                      Total: ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {isEdit && (
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Order Items
            </p>
            {order?.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.productName}</span>
                <span className="text-muted-foreground">
                  {item.quantity} × ₹{item.unitPrice.toLocaleString("en-IN")} = ₹
                  {item.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </form>
    </CustomSlider>
  )
}
