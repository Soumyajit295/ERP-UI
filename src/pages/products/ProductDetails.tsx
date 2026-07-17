import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Breadcrumbs } from "@/customComponent/Breadcrumbs"
import { getProductDetails } from "@/services/products.service"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { ProductOverview } from "./ProductOverview"
import { ProductInfoCard } from "./ProductInfoCard"
import { WarehouseStockCard } from "./WarehouseStockCard"
import { CustomButton } from "@/customComponent/CustomButton"
import { ArrowLeft, Loader2 } from "lucide-react"

export const ProductDetails = () => {
    const {productId} = useParams()
    const navigate = useNavigate()

    const {data: productData, isPending} = useQuery({
        queryKey: ['product-detils',productId],
        queryFn: () => getProductDetails(productId!)
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

    return (
        <PageContainer>
            <Breadcrumbs items={[
                { label: "Products", href: "/products" },
                { label: productData?.productName || "..." }
            ]} />
            <PageHeader
                pageName={productData?.productName || ''}
                extraButton={
                    <CustomButton
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/products')} 
                        className="p-5" 
                        label="Back" 
                        icon={<ArrowLeft className="size-4" />}
                    />
                }
            />
            <div className="flex flex-col space-y-4">
              {productData && (
                <>
                  <ProductOverview product={productData}/>
                  <ProductInfoCard product={productData}/>
                  <WarehouseStockCard inventoryDetails={productData?.inventoryDetails ?? []}/>
                </>
              )}
            </div>
        </PageContainer>
    )
}
