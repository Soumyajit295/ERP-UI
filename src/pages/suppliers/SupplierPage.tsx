import { type PaginationState } from "@tanstack/react-table"
import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table";
import { deleteSupplier, getSuppliers, type Supplier } from "@/services/supplier.service";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ResponsiveDataTable, type Action } from "@/customComponent/data-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { hasPermission } from "@/common/utils";
import { PERMISSIONS } from "@/common/constants/permissions.constant";
import { PageContainer } from "@/customComponent/PageContainer";
import { PageHeader } from "@/customComponent/PageHeader";
import { CustomButton } from "@/customComponent/CustomButton";
import { SupplierForm } from "./SupplierForm";

export const columns: ColumnDef<Supplier>[] = [
  {
    id: "supplierName",
    header: "Supplier",
    accessorKey: "supplierName",
    meta: { mobileLabel: "Supplier" },
  },
  {
    id: "contactPerson",
    header: "Contact Person",
    accessorKey: "contactPerson",
    meta: { mobileLabel: "Contact Person" },
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    meta: { mobileLabel: "Email" },
  },
  {
    id: "phone",
    header: "Phone",
    accessorKey: "phone",
    meta: { mobileLabel: "Phone" },
  },
  {
    id: "address",
    header: "Address",
    accessorKey: "address",
    meta: { mobileLabel: "Address" },
  },
  {
    id: "taxNumber",
    header: "GST Number",
    accessorKey: "taxNumber",
    meta: { mobileLabel: "GST Number" },
    cell: ({ getValue }) => getValue<string | null>() ?? "-",
  },
  {
    id: "totalOrders",
    header: "Orders",
    accessorKey: "totalOrders",
    meta: { mobileLabel: "Orders" },
  },
  {
    id: "isActive",
    header: "Status",
    accessorKey: "isActive",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const isActive = getValue<boolean>();

      return (
        <span
          className={
            isActive
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];

export const SupplierPage = () => {
    const [supplierFormOpen,setSupplierFormOpen] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [pagination,setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })
    const navigate = useNavigate()

    const {data: supplierData,isFetching,refetch} = useQuery({
        queryKey: ['suppliers',pagination.pageIndex,pagination.pageSize],
        queryFn: () => getSuppliers({page: pagination.pageIndex+1,limit: pagination.pageSize})
    })

    const deleteSelectedSupplier = async (supplierId: string) => {
        try {
            const resp = await deleteSupplier(supplierId)
            refetch()
            toast.success(resp.message || "Supplier deleted successfully")
        } catch (error: any) {
            toast.error(error.message || "Failed to delete supplier")
        }
    }

    const openAddSupplier = () => {
        setSelectedSupplier(null)
        setSupplierFormOpen(true)
    }

    const onSuccess = () => {
        setSupplierFormOpen(false)
        setSelectedSupplier(null)
        refetch()
    }

    const actions: Action<Supplier>[] = [
        {
            label: "View Deatils",
            icon: Eye,
            onClick: (row) => {
                navigate(`/suppliers/${row.supplierId}`)
            },
            permission: hasPermission(PERMISSIONS.Suppliers.Read)
        },
        {
            label: "Edit",
            icon: Pencil,
            onClick: (row) => {
                setSelectedSupplier(row)
                setSupplierFormOpen(true)
            },
            permission: hasPermission(PERMISSIONS.Suppliers.Modify)
        },
        {
            label: "Delete",
            icon: Trash2,
            variant: "destructive",
            onClick: (row) => deleteSelectedSupplier(row.supplierId),
            permission: hasPermission(PERMISSIONS.Suppliers.Modify)
        }
    ]

    return (
        <PageContainer>
            <PageHeader
                pageName="Suppliers"
                pageSubName="Manage your vendors and suppliers"
                actionButtonLabel="Add Supplier"
                onActionButtonClick={openAddSupplier}
                addPermission={hasPermission(PERMISSIONS.Suppliers.Create)}
            />
            <ResponsiveDataTable
                columns={columns}
                data={supplierData?.records || []}
                loading={isFetching}
                pageSize={pagination.pageSize}
                pageCount={supplierData?.meta?.totalPages}
                pagination={pagination}
                onPaginationChange={setPagination}
                manualPagination
                actions={actions}
            />
            <SupplierForm
                open={supplierFormOpen}
                onOpenChange={setSupplierFormOpen}
                supplier={selectedSupplier}
                onSuccess={onSuccess}
            />
        </PageContainer>
    )
}