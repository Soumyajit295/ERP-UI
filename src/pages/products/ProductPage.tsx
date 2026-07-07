import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type PaginationState } from "@tanstack/react-table";
import { Pencil, Trash2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ColumnDef, Action } from "@/customComponent/data-table";
import { ResponsiveDataTable } from "@/customComponent/data-table";
import { PageContainer } from "@/customComponent/PageContainer";
import { PageHeader } from "@/customComponent/PageHeader";
import {
  getProducts,
  getProductDetails,
  deleteProduct,
  type ProductRecord,
} from "@/services/products.service";
import { PERMISSIONS } from "@/common/constants/permissions.constant";
import { hasPermission } from "@/common/utils";
import { ProductForm } from "./ProductForm";
import { getCategoryOptions } from "@/services/products.service";

const columns: ColumnDef<ProductRecord>[] = [
  {
    id: "productName",
    header: "Product Name",
    accessorKey: "productName",
    meta: { mobileLabel: "Product Name" },
  },
  {
    id: "sku",
    header: "SKU",
    accessorKey: "sku",
    meta: { mobileLabel: "SKU" },
  },
  {
    id: "barcode",
    header: "Barcode",
    accessorKey: "barcode",
    meta: { mobileLabel: "Barcode" },
  },
  {
    id: "categoryName",
    header: "Category",
    accessorKey: "categoryName",
    meta: { mobileLabel: "Category" },
  },
  {
    id: "purchasePrice",
    header: "Purchase Price",
    accessorKey: "purchasePrice",
    meta: { mobileLabel: "Purchase Price" },
  },
  {
    id: "sellingPrice",
    header: "Selling Price",
    accessorKey: "sellingPrice",
    meta: { mobileLabel: "Selling Price" },
  },
  {
    id: "reorderLevel",
    header: "Reorder Level",
    accessorKey: "reorderLevel",
    meta: { mobileLabel: "Reorder Level" },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span
          className={
            value === "ACTIVE"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {value === "ACTIVE" ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];

export const ProductPage = () => {
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["products", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getProducts({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  const { data: categoryOptions } = useQuery({
    queryKey: ["category-options"],
    queryFn: getCategoryOptions,
  });

  const { data: selectedProduct } = useQuery({
    queryKey: ["product-details", selectedProductId],
    queryFn: () => getProductDetails(selectedProductId!),
    enabled: !!selectedProductId,
  });

  const deleteSelectedProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      refetch();
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const openAddProduct = () => {
    setSelectedProductId(null);
    setProductFormOpen(true);
  };

  const onSuccess = () => {
    setProductFormOpen(false);
    setSelectedProductId(null);
    refetch();
  };

  const actions: Action<ProductRecord>[] = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: (row) => {
        setSelectedProductId(row.productId);
        setProductFormOpen(true);
      },
      permission: hasPermission(PERMISSIONS.Product.Modify),
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onClick: (row) => deleteSelectedProduct(row.productId),
      permission: hasPermission(PERMISSIONS.Product.Modify),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        pageName="Products"
        pageSubName="Manage your products inventory"
        actionButtonLabel="Add Product"
        onActionButtonClick={openAddProduct}
        addPermission={hasPermission(PERMISSIONS.Product.Create)}
        extraButton={
          <Button variant="outline" size="sm" onClick={() => {}}>
            <List className="size-4" />
            Categories
          </Button>
        }
      />
      <ResponsiveDataTable<ProductRecord>
        columns={columns}
        data={data?.records || []}
        loading={isFetching}
        pageSize={pagination.pageSize}
        pageCount={data?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        actions={actions}
      />
      <ProductForm
        open={productFormOpen}
        onOpenChange={setProductFormOpen}
        product={selectedProduct ?? null}
        onSuccess={onSuccess}
        categoryOptions={categoryOptions || []}
      />
    </PageContainer>
  );
};
