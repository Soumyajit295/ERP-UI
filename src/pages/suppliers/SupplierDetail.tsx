import { CustomButton } from "@/customComponent/CustomButton"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Breadcrumbs } from "@/customComponent/Breadcrumbs"
import { getSupplierDetails } from "@/services/supplier.service"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { SupplierOverview } from "./SupplieOverview"
import { SupplierInfoCard } from "./SupplierInfoCard"
import { SupplierPurchaseOrders } from "./SupplierPurchaseOrders"

export const SupplierDetails = () => {
    const {supplierId} = useParams()
    const navigate = useNavigate()

    const {data: supplierData, isPending} = useQuery({
        queryKey: ['supplier-details',supplierId],
        queryFn: () => getSupplierDetails(supplierId!)
    })

    if (isPending) {
        return (
            <PageContainer>
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </PageContainer>
        )
    }

    return(
        <PageContainer>
            <Breadcrumbs items={[
                { label: "Suppliers", href: "/suppliers" },
                { label: supplierData?.supplierName || "..." }
            ]}/>
            <PageHeader
                pageName={supplierData?.supplierName || ''}
                extraButton={
                    <CustomButton
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/suppliers')} 
                        className="p-5" 
                        label="Back" 
                        icon={<ArrowLeft className="size-4" />}
                    />
                }
            />
            <div className="flex flex-col space-y-4">
                {supplierData && (
                    <>
                        <SupplierOverview supplier={supplierData}/>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <SupplierInfoCard supplier={supplierData}/>
                            <SupplierPurchaseOrders orders={supplierData.latestPurchaseOrders || []}/>
                        </div>
                    </>
                )}
            </div>
        </PageContainer>
    )
}
