import { useQuery } from "@tanstack/react-query"
import { DollarSign, ShoppingCart, Clock, Package, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { StatsCard } from "@/customComponent/StatusCard"
import { RevenueChart } from "@/customComponent/RevenueChart"
import { getDashboardData } from "@/services/dashboard.service"

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  })

  const formatCurrency = (value: number) =>
    `₹${(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`

  const renderTrendBadge = (trend: "UP" | "DOWN" | "SAME", percentage: number) => {
    const config = {
      UP: { icon: ArrowUp, color: "text-emerald-600", prefix: "+" },
      DOWN: { icon: ArrowDown, color: "text-red-600", prefix: "-" },
      SAME: { icon: Minus, color: "text-muted-foreground", prefix: "" },
    }[trend]
    const Icon = config.icon
    return (
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${config.color}`}>
          <Icon className="size-3" />
          {config.prefix}{percentage}%
        </span>
        <span className="text-xs text-muted-foreground">from last month</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading...</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        pageName="Dashboard"
        pageSubName="Welcome back! Here's what's happening with your business."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data?.revenue?.value ?? 0)}
          icon={DollarSign}
          iconClassName="text-emerald-600"
          badge={renderTrendBadge(data?.revenue?.trend ?? "SAME", data?.revenue?.percentage ?? 0)}
        />
        <StatsCard
          title="Total Orders"
          value={String(data?.orders?.count ?? 0)}
          icon={ShoppingCart}
          iconClassName="text-blue-600"
          badge={renderTrendBadge(data?.orders?.trend ?? "SAME", data?.orders?.percentage ?? 0)}
        />
        <StatsCard
          title="Pending Payments"
          value={String(data?.pendingPayments?.count ?? 0)}
          icon={Clock}
          iconClassName="text-amber-600"
          badge={renderTrendBadge(data?.pendingPayments?.trend ?? "SAME", data?.pendingPayments?.percentage ?? 0)}
        />
        <StatsCard
          title="Inventory Value"
          value={formatCurrency(data?.inventoryValue ?? 0)}
          icon={Package}
          iconClassName="text-violet-600"
        />
      </div>

      <div className="mt-6">
        <RevenueChart />
      </div>
    </PageContainer>
  )
}
