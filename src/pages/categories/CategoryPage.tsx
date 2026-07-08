import { PERMISSIONS } from "@/common/constants/permissions.constant";
import { formatDate, hasPermission } from "@/common/utils";
import { CustomButton } from "@/customComponent/CustomButton";
import { ResponsiveDataTable, type Action, type ColumnDef } from "@/customComponent/data-table";
import { PageContainer } from "@/customComponent/PageContainer";
import { PageHeader } from "@/customComponent/PageHeader";
import { deleteCategory, getCategories, type CategoryRecord } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CategoryForm } from "./CategoryForm";

const columns: ColumnDef<CategoryRecord>[] = [
    {
        id: "categoryName",
        header: "Category Name",
        accessorKey: "categoryName",
        meta: {mobileLabel: "Category Name"}
    },
    {
        id: "description",
        header: "Description",
        accessorKey: "description",
        meta: {mobileLabel: "Description"}
    },
    {
        id: "productCount",
        header: "Total Products",
        accessorKey: "productCount",
        meta: {mobileLabel: "Total Products"}
    },
    {
        id: "createdAt",
        header: "Created",
        accessorKey: "createdAt",
        meta: {mobileLabel: "Created"},
        cell: ({getValue}) => {
            const value = getValue() as string
            return formatDate(value)
        }
    }
]

export const CategoryPage = () => {
    const [categoryFormOpen,setCategoryFormOpen] = useState(false)
    const [selectedCategory,setSelectedCategory] = useState<CategoryRecord | null>(null)
    const [pagination,setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })
    const navigate = useNavigate()

    const {data: categories, refetch, isFetching} = useQuery({
        queryKey: ['categories',pagination.pageIndex,pagination.pageSize],
        queryFn: () => getCategories({page: pagination.pageIndex + 1,limit: pagination.pageSize})
    })

    const deleteSelectedCategory = async(categoryId: string) => {
        try {
            await deleteCategory(categoryId)
            refetch()
            toast.success('Category deleted successfully')
        } catch (error: any) {
            toast.error(error.message || "Failed to delete category")
        }
    }

    const openCategoryForm = () => {
        setSelectedCategory(null)
        setCategoryFormOpen(true)
    }

    const onSuccess = () => {
        setCategoryFormOpen(false)
        setSelectedCategory(null)
        refetch()
    }

    const actions: Action<CategoryRecord>[] = [
        {
            label: "Edit",
            icon: Pencil,
            onClick: (row) => {
                setSelectedCategory(row);
                setCategoryFormOpen(true);
            },
            permission: hasPermission(PERMISSIONS.Product.Modify),
        },
        {
            label: "Delete",
            icon: Trash2,
            variant: "destructive",
            onClick: (row) => deleteSelectedCategory(row.categoryId),
            permission: hasPermission(PERMISSIONS.Product.Modify),
        },
    ]

    return (
        <PageContainer>
            <PageHeader
                pageName="Product Categories"
                pageSubName="Organize your products into categories"
                actionButtonLabel="Add Category"
                onActionButtonClick={openCategoryForm}
                addPermission={hasPermission(PERMISSIONS.Product.Create)}
                extraButton={
                    <CustomButton
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/products')} 
                        className="p-5" 
                        label="Back to products" 
                        icon={<ArrowLeft className="size-4" />}
                    />
                }
            />
            <ResponsiveDataTable
                columns={columns}
                data={categories?.records || []}
                loading={isFetching}
                pageSize={pagination.pageSize}
                pageCount={categories?.meta?.totalPages}
                pagination={pagination}
                onPaginationChange={setPagination}
                manualPagination
                actions={actions}
            />
            <CategoryForm
                open={categoryFormOpen}
                onOpenChange={setCategoryFormOpen}
                category={selectedCategory}
                onSuccess={onSuccess}
            />
        </PageContainer>
    )
}