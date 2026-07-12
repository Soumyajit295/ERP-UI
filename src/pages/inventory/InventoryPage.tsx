import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { CustomButton } from "@/customComponent/CustomButton"
import { getInventoryDashboard, getInventoryProducts } from "@/services/inventory.service"
import { useQuery } from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"
import { Warehouse } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { InventoryOverview } from "./InventoryOverview"

export const InventoryPage = () => {
    const navigate = useNavigate()
    const [pagination,setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })

    const {data: inventoryDashboardData,isFetching} = useQuery({
        queryKey: ['inventory-dashboard'],
        queryFn: getInventoryDashboard
    })

    const {data: inventoryProducts,isFetching: productFetching} = useQuery({
        queryKey: ['inventory-products',pagination.pageIndex,pagination.pageSize],
        queryFn: () => getInventoryProducts({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize
        })
    })

    return (
        <PageContainer>
            <PageHeader
                pageName="Inventory"
                pageSubName="Track stock levels across warehouses"
                extraButton={
                    <CustomButton 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/warehouses')} 
                        className="p-5" 
                        label="Warehouse" 
                        icon={<Warehouse className="size-4" />}
                    />
                }
            />
            <InventoryOverview 
                inventory={inventoryDashboardData!}
                products={inventoryProducts?.records || []}
                loading={productFetching}
                pagination={pagination}
                onPaginationChange={setPagination}
            />
        </PageContainer>
    )
}