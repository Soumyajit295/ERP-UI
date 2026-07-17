import { PAYMENT_DIRECTIONS, PAYMENT_METHODS } from "@/common/enums/Payment.enum"
import { InvoiceStatus } from "@/common/enums/InvoiceStatus.enum"
import { PurchaseOrderStatus } from "@/common/enums/PurchaseOrderstatus.enum"
import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormDatePicker } from "@/formComponent/FormDatePicker"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormTextArea } from "@/formComponent/FormTextArea"
import { paymentFormSchema, type PaymentFormValues } from "@/lib/validation/payment.validation"
import { createPayment } from "@/services/payment.service"
import { getInvoiceOptions } from "@/services/invoice.service"
import { getPurchaseOrderOptions } from "@/services/purchase-order.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface PaymentFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

const defaultValues: PaymentFormValues = {
    paymentDirection: '',
    amount: 0,
    orderId: '',
    paymentDate: '',
    paymentMethod: '',
    notes: '',
    transactionId: ''
}

const paymentMethodOptions = Object.values(PAYMENT_METHODS).map((m) => ({
    label: m.split('_').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
    value: m
}))

export function PaymentForm({
    open,
    onOpenChange,
    onSuccess
}: PaymentFormProps) {
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues
    })

    const {
        formState: { isSubmitting },
        reset,
        control,
        watch
    } = form

    const paymentDirection = watch("paymentDirection")

    const { data: invoiceOptions } = useQuery({
        queryKey: ["invoice-options", paymentDirection],
        queryFn: () => getInvoiceOptions({ status: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] }),
        enabled: paymentDirection === PAYMENT_DIRECTIONS.RECEIVED
    })

    const { data: purchaseOrderOptions } = useQuery({
        queryKey: ["purchase-order-options", paymentDirection],
        queryFn: () => getPurchaseOrderOptions({ status: [PurchaseOrderStatus.RECEIVED] }),
        enabled: paymentDirection === PAYMENT_DIRECTIONS.MADE
    })

    const orderOptions =
        paymentDirection === PAYMENT_DIRECTIONS.RECEIVED ? (invoiceOptions || [])
        : paymentDirection === PAYMENT_DIRECTIONS.MADE ? (purchaseOrderOptions || [])
        : []

    useEffect(() => {
        if (open) reset(defaultValues)
    }, [open, reset])

    const handleSubmit = async (values: PaymentFormValues) => {
        try {
            const payload = {
                paymentDirection: values.paymentDirection as typeof PAYMENT_DIRECTIONS.RECEIVED | typeof PAYMENT_DIRECTIONS.MADE,
                amount: values.amount,
                paymentMethod: values.paymentMethod as typeof PAYMENT_METHODS.CASH | typeof PAYMENT_METHODS.BANK_TRANSFER | typeof PAYMENT_METHODS.CARD | typeof PAYMENT_METHODS.CHEQUE,
                paymentDate: values.paymentDate,
                ...(values.paymentDirection === PAYMENT_DIRECTIONS.RECEIVED
                    ? { invoiceId: values.orderId }
                    : { purchaseOrderId: values.orderId }
                ),
                ...(values.transactionId ? { transactionId: values.transactionId } : {}),
                ...(values.notes ? { notes: values.notes } : {})
            }

            await createPayment(payload)
            toast.success("Payment created successfully")
            onSuccess?.()
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to save payment")
        }
    }

    return (
        <CustomSlider
            open={open}
            onOpenChange={onOpenChange}
            title="Create Payment"
            description="Record a new payment"
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
                    name="paymentDirection"
                    label="Payment Direction"
                    required
                    placeholder="Select payment direction"
                    options={[
                        { label: 'Received', value: PAYMENT_DIRECTIONS.RECEIVED },
                        { label: 'Made', value: PAYMENT_DIRECTIONS.MADE }
                    ]}
                />

                <FormInputSelect
                    control={control}
                    name="orderId"
                    label="Order"
                    required
                    placeholder={paymentDirection ? "Select order" : "Select payment direction first"}
                    options={orderOptions}
                    extraClassName={!paymentDirection ? "opacity-50 pointer-events-none" : ""}
                />

                <FormInputField
                    control={control}
                    name="amount"
                    label="Amount"
                    required
                    placeholder="Enter amount"
                />

                <FormDatePicker
                    control={control}
                    name="paymentDate"
                    label="Payment Date"
                    required
                />

                <FormInputSelect
                    control={control}
                    name="paymentMethod"
                    label="Payment Method"
                    required
                    placeholder="Select payment method"
                    options={paymentMethodOptions}
                />

                <FormInputField
                    control={control}
                    name="transactionId"
                    label="Transaction ID"
                    placeholder="Enter transaction ID (optional)"
                />

                <FormTextArea
                    control={control}
                    name="notes"
                    label="Notes"
                    placeholder="Enter notes (optional)"
                />
            </form>
        </CustomSlider>
    )
}
