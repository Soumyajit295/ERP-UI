import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Breadcrumbs } from "@/customComponent/Breadcrumbs"
import { getPaymentDetails, downloadPaymentRecipt } from "@/services/payment.service"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { CustomButton } from "@/customComponent/CustomButton"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { PaymentOverview } from "./PaymentOverview"
import { PaymentInfoCard } from "./PaymentInfoCard"
import { PaymentRelatedOrders } from "./PaymentRelatedOrders"

export const PaymentDetails = () => {
  const { paymentId } = useParams()
  const navigate = useNavigate()

  const { data: paymentData, isPending } = useQuery({
    queryKey: ["payment-details", paymentId],
    queryFn: () => getPaymentDetails(paymentId!),
  })

  const [downloading, setDownloading] = useState(false)

  if (isPending) {
    return (
      <PageContainer>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    )
  }

  const handleDownloadReceipt = async () => {
    if (!paymentId) return
    setDownloading(true)
    try {
      const blob = await downloadPaymentRecipt(paymentId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `receipt-${paymentData?.paymentNumber || paymentId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      toast.error(error.message || "Failed to download receipt")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Payments", href: "/payments" },
          { label: paymentData?.paymentNumber || "..." },
        ]}
      />
      <PageHeader
        pageName={paymentData?.paymentNumber || ""}
        extraButton={
          <div className="flex gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleDownloadReceipt}
              loading={downloading}
              loadLabel="Downloading..."
              className="p-5"
              label="Download Receipt"
              icon={<Download className="size-4" />}
            />
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/payments")}
              className="p-5"
              label="Back"
              icon={<ArrowLeft className="size-4" />}
            />
          </div>
        }
      />
      <div className="flex flex-col space-y-4">
        {paymentData && (
          <>
            <PaymentOverview payment={paymentData} />
            <PaymentInfoCard payment={paymentData} />
            <PaymentRelatedOrders payment={paymentData} />
          </>
        )}
      </div>
    </PageContainer>
  )
}
