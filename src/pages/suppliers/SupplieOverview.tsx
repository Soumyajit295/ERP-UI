import { StatsCard } from "@/customComponent/StatusCard"
import type { SupplierDetails } from "@/services/supplier.service"

interface SupplierOverviewProps {
    supplier: SupplierDetails
}

export const SupplierOverview = ({supplier}: SupplierOverviewProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StatsCard
                title="Total Orders"
                value={supplier?.totalOrders?.toString() || '-'}
            />
            <StatsCard
                title="Total Spent"
                value={supplier?.totalSpents?.toString() || '-'}
            />
            <StatsCard
                title="Status"
                value={supplier?.supplierStatus === true ? "Active" : "Inactive"}
                iconClassName={supplier?.supplierStatus === true ? "text-green-600" : "text-red-600"}
            />
        </div>
    )
}
