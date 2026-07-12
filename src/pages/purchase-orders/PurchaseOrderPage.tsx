import { type PaginationState } from "@tanstack/react-table"
import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table";
import { getPurchaseOrders, getPurchaseOrderDetails, downloadPurchaseOrder, type PurchaseOrderListItem, type PurchaseOrderDetailsResponse } from "@/services/purchase-order.service";
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
import { PurchaseOrderForm } from "./PurchaseOrderForm";

export const columns: ColumnDef<PurchaseOrderListItem>[] = [
  {
    id: "purchaseOrderNumber",
    header: "Order",
    accessorKey: "purchaseOrderNumber",
    meta: { mobileLabel: "Order" },
  },
  {
    id: "supplierName",
    header: "Supplier",
    accessorKey: "supplierName",
    meta: { mobileLabel: "Supplier" },
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
    id: "totalCost",
    header: "Amount",
    accessorKey: "totalCost",
    meta: { mobileLabel: "Amount" },
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return (
        <span className="font-medium">
          ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const colorMap: Record<string, string> = {
        RECEIVED: "text-green-600",
        APPROVED: "text-blue-600",
        CANCELLED: "text-red-600",
        PENDING: "text-yellow-600",
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

export const PurchaseOrderPage = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [editOrder, setEditOrder] = useState<PurchaseOrderDetailsResponse | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const navigate = useNavigate()

  const { data: orderData, isFetching, refetch } = useQuery({
    queryKey: ["purchase-orders", pagination.pageIndex, pagination.pageSize],
    queryFn: () => getPurchaseOrders({ page: pagination.pageIndex + 1, limit: pagination.pageSize }),
  })

  const handleDownloadPdf = async (row: PurchaseOrderListItem) => {
    try {
      const blob = await downloadPurchaseOrder(row.purchaseOrderId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${row.purchaseOrderNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      toast.error(error.message || "Failed to download PDF")
    }
  }

  const actions: Action<PurchaseOrderListItem>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (row) => {
        navigate(`/purchase-orders/${row.purchaseOrderId}`)
      },
      permission: hasPermission(PERMISSIONS.Purchases.Read),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: async (row) => {
        try {
          const details = await getPurchaseOrderDetails(row.purchaseOrderId)
          setEditOrder(details)
          setFormOpen(true)
        } catch (error: any) {
          toast.error(error.message || "Failed to load order details")
        }
      },
      permission: hasPermission(PERMISSIONS.Purchases.Modify),
    },
    {
      label: "Download PDF",
      icon: FileDown,
      onClick: (row) => handleDownloadPdf(row),
      permission: hasPermission(PERMISSIONS.Purchases.Read),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        pageName="Purchase Orders"
        pageSubName="Manage your purchase orders"
        actionButtonLabel="Add Purchase Order"
        onActionButtonClick={() => { setEditOrder(null); setFormOpen(true) }}
        addPermission={hasPermission(PERMISSIONS.Purchases.Create)}
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
      <PurchaseOrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        order={editOrder}
        isEdit={!!editOrder}
        onSuccess={() => { setEditOrder(null); refetch() }}
      />
    </PageContainer>
  )
}
