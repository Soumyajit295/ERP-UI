import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Breadcrumbs } from "@/customComponent/Breadcrumbs"
import { getSlaesOrderDetails, downloadSalesOrderPDF } from "@/services/sales-order.service"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { CustomButton } from "@/customComponent/CustomButton"
import { ArrowLeft, FileDown, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { SalesOrderOverview } from "./SalesOrderOverview"
import { SalesOrderContactCard } from "./SalesOrderContactCard"
import { SalesOrderWarehouseCard } from "./SalesOrderWarehouseCard"
import { SalesOrderItems } from "./SalesOrderItems"

export const SalesOrderDetails = () => {
  const { salesOrderId } = useParams()
  const navigate = useNavigate()

  const { data: orderData, isPending } = useQuery({
    queryKey: ["sales-order-details", salesOrderId],
    queryFn: () => getSlaesOrderDetails(salesOrderId!),
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

  const handleDownloadPdf = async () => {
    if (!salesOrderId || !orderData) return
    setDownloading(true)
    try {
      const blob = await downloadSalesOrderPDF(salesOrderId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${orderData.salesOrderNumber}.pdf`
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
          { label: "Sales Orders", href: "/sales-orders" },
          { label: orderData?.salesOrderNumber || "..." },
        ]}
      />
      <PageHeader
        pageName={orderData?.salesOrderNumber || ""}
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
              onClick={() => navigate("/sales-orders")}
              className="p-5"
              label="Back"
              icon={<ArrowLeft className="size-4" />}
            />
          </div>
        }
      />
      <div className="flex flex-col space-y-4">
        {orderData && (
          <>
            <SalesOrderOverview order={orderData} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SalesOrderContactCard customer={orderData.customerInfo} />
              <SalesOrderWarehouseCard warehouse={orderData.warehouseInfo} />
            </div>
            <SalesOrderItems items={orderData.items} />
          </>
        )}
      </div>
    </PageContainer>
  )
}
