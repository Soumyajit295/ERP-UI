import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Breadcrumbs } from "@/customComponent/Breadcrumbs"
import { getInvoiceDetails, downloadInvoice } from "@/services/invoice.service"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { CustomButton } from "@/customComponent/CustomButton"
import { ArrowLeft, FileDown } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { InvoiceOverview } from "./InvoiceOverview"
import { InvoiceCustomerCard } from "./InvoiceCustomerCard"
import { InvoicePaymentCard } from "./InvoicePaymentCard"
import { InvoiceItems } from "./InvoiceItems"

export const InvoiceDetails = () => {
  const { invoiceId } = useParams()
  const navigate = useNavigate()

  const { data: invoiceData } = useQuery({
    queryKey: ["invoice-details", invoiceId],
    queryFn: () => getInvoiceDetails(invoiceId!),
  })

  const [downloading, setDownloading] = useState(false)

  const handleDownloadPdf = async () => {
    if (!invoiceId || !invoiceData) return
    setDownloading(true)
    try {
      const blob = await downloadInvoice(invoiceId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${invoiceData.invoiceNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      toast.error(error.message || "Failed to download PDF")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Invoices", href: "/invoices" },
          { label: invoiceData?.invoiceNumber || "..." },
        ]}
      />
      <PageHeader
        pageName={invoiceData?.invoiceNumber || ""}
        extraButton={
          <div className="flex gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              loading={downloading}
              loadLabel="Downloading..."
              className="p-5"
              label="Download PDF"
              icon={<FileDown className="size-4" />}
            />
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/invoices")}
              className="p-5"
              label="Back"
              icon={<ArrowLeft className="size-4" />}
            />
          </div>
        }
      />
      <div className="flex flex-col space-y-4">
        {invoiceData && (
          <>
            <InvoiceOverview invoice={invoiceData} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <InvoiceCustomerCard customer={invoiceData.customerInfo} />
              <InvoicePaymentCard
                totalAmount={invoiceData.totalAmount}
                paidAmount={invoiceData.paidAmount}
                balanceAmount={invoiceData.balanceAmount}
              />
            </div>
            <InvoiceItems items={invoiceData.items} />
          </>
        )}
      </div>
    </PageContainer>
  )
}
