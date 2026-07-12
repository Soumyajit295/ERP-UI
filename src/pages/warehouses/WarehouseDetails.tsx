import { CustomButton } from "@/customComponent/CustomButton"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Breadcrumbs } from "@/customComponent/Breadcrumbs"
import { getWarehouseDetails } from "@/services/warehouse.service"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { WarehouseOverview } from "./WarehouseOverview"
import { WarehouseLocationCard } from "./WarehouseLocationCard"
import { WarehouseContactCard } from "./WarehouseContactCard"
import { WarehouseCapacityCard } from "./WarehouseCapacityCard"
import { WarehouseInventoryCard } from "./WarehouseInventoryCard"

export const WarehouseDetails = () => {
  const { warehouseId } = useParams()
  const navigate = useNavigate()

  const { data: warehouseData } = useQuery({
    queryKey: ["warehouse-details", warehouseId],
    queryFn: () => getWarehouseDetails(warehouseId!),
  })

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Inventory", href: "/inventory" },
          { label: "Warehouses", href: "/warehouses" },
          { label: warehouseData?.warehouseName || "..." },
        ]}
      />
      <PageHeader
        pageName={warehouseData?.warehouseName || ""}
        extraButton={
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/warehouses")}
            className="p-5"
            label="Back"
            icon={<ArrowLeft className="size-4" />}
          />
        }
      />
      <div className="flex flex-col space-y-4">
        {warehouseData && (
          <>
            <WarehouseOverview warehouse={warehouseData} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <WarehouseLocationCard warehouse={warehouseData} />
              <WarehouseContactCard warehouse={warehouseData} />
            </div>
            <WarehouseCapacityCard warehouse={warehouseData} />
            <WarehouseInventoryCard
              inventoryItems={warehouseData.inventoryItems || []}
            />
          </>
        )}
      </div>
    </PageContainer>
  )
}
