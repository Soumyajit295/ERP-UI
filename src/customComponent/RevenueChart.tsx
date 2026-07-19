import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getRevenueData } from "@/services/dashboard.service"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const CURRENT_YEAR = new Date().getFullYear()

const yearOptions = Array.from(
  { length: CURRENT_YEAR - 2000 + 1 },
  (_, i) => {
    const year = 2000 + i
    return { value: String(year), label: String(year) }
  }
).reverse()

export function RevenueChart() {
  const [selectedYear, setSelectedYear] = useState(String(CURRENT_YEAR))

  const { data, isLoading } = useQuery({
    queryKey: ["revenue-details", selectedYear],
    queryFn: () =>
      getRevenueData({
        year: selectedYear,
      }),
  })

  // Always show all 12 months
  const chartData = MONTHS.map((month, index) => {
    const monthNum = index + 1
    const item = data?.find((d) => Number(d.month) === monthNum)

    return {
      month,
      revenue: parseFloat(String(item?.revenue)) || 0,
      orders: Number(item?.orderCount) || 0,
    }
  })

  if (isLoading) {
    return (
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>

        <CardContent className="h-[380px] flex items-center justify-center text-muted-foreground">
          Loading chart...
        </CardContent>
      </Card>
    )
  }

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1000)
  const roundedMax = Math.ceil(maxRevenue / 15000) * 15000

  return (
    <Card className="border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">
          Revenue Overview
        </CardTitle>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px] border-zinc-800 ">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent
            position="item-aligned"
            className="max-h-[300px] overflow-y-auto border-zinc-800 "
          >
            {yearOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={360}
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 10,
              right: 20,
              top: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="revenue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2a2a2d"
                  stopOpacity={0.55}
                />
                <stop
                  offset="100%"
                  stopColor="#2a2a2d"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#242428"
              strokeDasharray="4 4"
              vertical
            />

            <XAxis
              dataKey="month"
              interval={0}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#7c7c85",
                fontSize: 13,
              }}
            />

            <YAxis
              domain={[0, roundedMax]}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#7c7c85",
                fontSize: 13,
              }}
              tickFormatter={(value) => {
                if (value >= 100000)
                  return `₹${value / 100000}L`

                if (value >= 1000)
                  return `₹${value / 1000}k`

                return `₹${value}`
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#ffffff",
                strokeWidth: 1,
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null

                const item = payload[0].payload

                return (
                  <div className="rounded-2xl border border-zinc-800 bg-[#111113] px-5 py-4 shadow-2xl">
                    <p className="mb-2 text-lg font-semibold text-white">
                      {label}
                    </p>

                    <p className="text-zinc-300">
                      Revenue:{" "}
                      <span className="font-semibold text-white">
                        ₹
                        {item.revenue.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </p>

                    <p className="text-zinc-300">
                      Orders:{" "}
                      <span className="font-semibold text-white">
                        {item.orders}
                      </span>
                    </p>
                  </div>
                )
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#36363d"
              strokeWidth={2}
              fill="url(#revenue)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#0B0B0D",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}