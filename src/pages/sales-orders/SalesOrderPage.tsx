import { type PaginationState } from "@tanstack/react-table"
import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table";
import { getSalesOrders, getSlaesOrderDetails, downloadSalesOrderPDF, type SalesOrderListItem, type SalesOrderDetailsResponse } from "@/services/sales-order.service";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ResponsiveDataTable, type Action } from "@/customComponent/data-table";
import { Eye, Pencil, FileDown } from "lucide-react";
import { hasPermission } from "@/common/utils";
import { PERMISSIONS } from "@/common/constants/permissions.constant";
import { PageContainer } from "@/customComponent/PageContainer";
import { PageHeader } from "@/customComponent/PageHeader";
import { formatDate } from "@/common/utils";
import { SalesOrderForm } from "./SalesOrderForm";

export const columns: ColumnDef<SalesOrderListItem>[] = [
  {
    id: "salesOrderNumber",
    header: "Order",
    accessorKey: "salesOrderNumber",
    meta: { mobileLabel: "Order" },
  },
  {
    id: "customerName",
    header: "Customer",
    accessorKey: "customerName",
    meta: { mobileLabel: "Customer" },
  },
  {
    id: "warehouseName",
    header: "Warehouse",
    accessorKey: "warehouseName",
    meta: { mobileLabel: "Warehouse" },
  },
  {
    id: "orderDate",
    header: "Order Date",
    accessorKey: "orderDate",
    meta: { mobileLabel: "Order Date" },
    cell: ({ getValue }) => formatDate(getValue<string>(), "D MMM YYYY"),
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const colorMap: Record<string, string> = {
        COMPLETED: "text-green-600",
        CONFIRMED: "text-blue-600",
        CANCELLED: "text-red-600",
        DRAFT: "text-muted-foreground",
      };
      return (
        <span className={`font-medium ${colorMap[status] || "text-muted-foreground"}`}>
          {status}
        </span>
      );
    },
  },
];

export const SalesOrderPage = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [editOrder, setEditOrder] = useState<SalesOrderDetailsResponse | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const navigate = useNavigate()

  const { data: orderData, isFetching, refetch } = useQuery({
    queryKey: ["sales-orders", pagination.pageIndex, pagination.pageSize],
    queryFn: () => getSalesOrders({ page: pagination.pageIndex + 1, limit: pagination.pageSize }),
  })

  const handleDownloadPdf = async (row: SalesOrderListItem) => {
    try {
      const blob = await downloadSalesOrderPDF(row.salesOrderId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${row.salesOrderNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      toast.error(error.message || "Failed to download PDF")
    }
  }

  const actions: Action<SalesOrderListItem>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (row) => {
        navigate(`/sales-orders/${row.salesOrderId}`)
      },
      permission: hasPermission(PERMISSIONS.Sales.Read),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: async (row) => {
        try {
          const details = await getSlaesOrderDetails(row.salesOrderId)
          setEditOrder(details)
          setFormOpen(true)
        } catch (error: any) {
          toast.error(error.message || "Failed to load order details")
        }
      },
      permission: hasPermission(PERMISSIONS.Sales.Modify),
    },
    {
      label: "Download PDF",
      icon: FileDown,
      onClick: (row) => handleDownloadPdf(row),
      permission: hasPermission(PERMISSIONS.Sales.Read),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        pageName="Sales Orders"
        pageSubName="Manage your sales orders"
        actionButtonLabel="Add Sales Order"
        onActionButtonClick={() => { setEditOrder(null); setFormOpen(true) }}
        addPermission={hasPermission(PERMISSIONS.Sales.Create)}
      />
      <ResponsiveDataTable
        columns={columns}
        data={orderData?.records || []}
        loading={isFetching}
        pageSize={pagination.pageSize}
        pageCount={orderData?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        actions={actions}
      />
      <SalesOrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        order={editOrder}
        isEdit={!!editOrder}
        onSuccess={() => { setEditOrder(null); refetch() }}
      />
    </PageContainer>
  )
}
