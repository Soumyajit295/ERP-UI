import { type PaginationState } from "@tanstack/react-table"
import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table";
import { getInvoices, getInvoiceDetails, downloadInvoice, type InvoiceListItem, type InvoiceDetailsResponse } from "@/services/invoice.service";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ResponsiveDataTable, type Action } from "@/customComponent/data-table";
import { Eye, FileDown, Pencil } from "lucide-react";
import { hasPermission } from "@/common/utils";
import { PERMISSIONS } from "@/common/constants/permissions.constant";
import { PageContainer } from "@/customComponent/PageContainer";
import { PageHeader } from "@/customComponent/PageHeader";
import { formatDate } from "@/common/utils";
import { InvoiceForm } from "./InvoiceForm";

export const columns: ColumnDef<InvoiceListItem>[] = [
  {
    id: "invoiceNumber",
    header: "Invoice",
    accessorKey: "invoiceNumber",
    meta: { mobileLabel: "Invoice" },
  },
  {
    id: "customername",
    header: "Customer",
    accessorKey: "customername",
    meta: { mobileLabel: "Customer" },
  },
  {
    id: "invoiceDate",
    header: "Issue Date",
    accessorKey: "invoiceDate",
    meta: { mobileLabel: "Issue Date" },
    cell: ({ getValue }) => formatDate(getValue<string>(), "D MMM YYYY"),
  },
  {
    id: "dueDate",
    header: "Due Date",
    accessorKey: "dueDate",
    meta: { mobileLabel: "Due Date" },
    cell: ({ getValue }) => formatDate(getValue<string>(), "D MMM YYYY"),
  },
  {
    id: "totalAmount",
    header: "Amount",
    accessorKey: "totalAmount",
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
    id: "paidAmount",
    header: "Paid Amount",
    accessorKey: "paidAmount",
    meta: { mobileLabel: "Paid Amount" },
    cell: ({ getValue }) => {
      const paid = getValue<number>();
      return (
        <span className="font-medium">
          ₹{paid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        PAID: "text-green-600",
        PARTIALLY_PAID: "text-yellow-600",
        UNPAID: "text-red-600",
        CANCELLED: "text-muted-foreground",
      };
      return (
        <span className={`font-medium ${colorMap[status] || "text-muted-foreground"}`}>
          {status}
        </span>
      );
    },
  },
];

export const InvoicePage = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [editInvoice, setEditInvoice] = useState<InvoiceListItem | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const navigate = useNavigate()

  const { data: invoiceData, isFetching, refetch } = useQuery({
    queryKey: ["invoices", pagination.pageIndex, pagination.pageSize],
    queryFn: () => getInvoices({ page: pagination.pageIndex + 1, limit: pagination.pageSize }),
  })

  const handleDownloadPdf = async (row: InvoiceListItem) => {
    try {
      const blob = await downloadInvoice(row.invoiceId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${row.invoiceNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      toast.error(error.message || "Failed to download PDF")
    }
  }

  const actions: Action<InvoiceListItem>[] = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: async (row) => {
        try {
          setEditInvoice(row)
          setFormOpen(true)
        } catch (error: any) {
          toast.error(error.message || "Failed to load invoice details")
        }
      },
      permission: hasPermission(PERMISSIONS.Finance.Modify),
    },
    {
      label: "View Details",
      icon: Eye,
      onClick: (row) => {
        navigate(`/invoices/${row.invoiceId}`)
      },
      permission: hasPermission(PERMISSIONS.Finance.Read),
    },
    {
      label: "Download PDF",
      icon: FileDown,
      onClick: (row) => handleDownloadPdf(row),
      permission: hasPermission(PERMISSIONS.Finance.Read),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        pageName="Invoices"
        pageSubName="Manage your invoices"
        actionButtonLabel="Create Invoice"
        onActionButtonClick={() => { setEditInvoice(null); setFormOpen(true) }}
        addPermission={hasPermission(PERMISSIONS.Finance.Create)}
      />
      <ResponsiveDataTable
        columns={columns}
        data={invoiceData?.records || []}
        loading={isFetching}
        pageSize={pagination.pageSize}
        pageCount={invoiceData?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        actions={actions}
      />
      <InvoiceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        invoice={editInvoice!}
        isEdit={!!editInvoice}
        onSuccess={() => { setEditInvoice(null); refetch() }}
      />
    </PageContainer>
  )
}
