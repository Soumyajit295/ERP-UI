import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowUp, CreditCard, HandCoins, Receipt, Wallet } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { StatsCard } from "@/customComponent/StatusCard"
import { CustomButton } from "@/customComponent/CustomButton"
import { getFinanceDashboardData, type RecentPaymentDto } from "@/services/finance.service"
import { formatDate } from "@/common/utils"
import { PAYMENT_DIRECTIONS } from "@/common/enums/Payment.enum"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const FinancePage = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["finance-dashboard"],
    queryFn: getFinanceDashboardData,
  })

  const formatCurrency = (value: number) =>
    `₹${(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`

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
        pageName="Finance"
        pageSubName="Monitor receivables, payables, and cash movement"
        extraButton={
          <div className="flex items-center gap-2">
            <CustomButton
              icon={<Receipt className="size-4" />}
              label="Invoices"
              onClick={() => navigate("/invoices")}
            />
            <CustomButton
              icon={<CreditCard className="size-4" />}
              label="Payments"
              onClick={() => navigate("/payments")}
            />
          </div>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Cash In"
          value={formatCurrency(data?.cashIn ?? 0)}
          icon={ArrowDown}
          iconClassName="text-green-600"
        />
        <StatsCard
          title="Cash Out"
          value={formatCurrency(data?.cashOut ?? 0)}
          icon={ArrowUp}
          iconClassName="text-red-600"
        />
        <StatsCard
          title="Receivables"
          value={formatCurrency(data?.receivables ?? 0)}
          icon={HandCoins}
          iconClassName="text-amber-600"
        />
        <StatsCard
          title="Open Payables"
          value={formatCurrency(data?.openPayables ?? 0)}
          icon={Wallet}
          iconClassName="text-blue-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentPaymentsTable payments={data?.recentPayments ?? []} />
        </CardContent>
      </Card>
    </PageContainer>
  )
}

const RecentPaymentsTable = ({ payments }: { payments: RecentPaymentDto[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payment #</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No recent payments
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow key={payment.paymentId}>
              <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
              <TableCell>
                <span
                  className={
                    payment.paymentType === PAYMENT_DIRECTIONS.RECEIVED
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {payment.paymentType === PAYMENT_DIRECTIONS.RECEIVED ? "Received" : "Made"}
                </span>
              </TableCell>
              <TableCell>{formatDate(payment.paymentDate, "DD/MM/YY")}</TableCell>
              <TableCell className="text-right font-medium">
                ₹{(payment.paymentAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
