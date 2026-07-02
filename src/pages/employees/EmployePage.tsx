import { ResponsiveDataTable } from "@/customComponent/data-table"
import type { ColumnDef, Action } from "@/customComponent/data-table"
import { CustomSlider } from "@/customComponent/CustomSlider"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface Employee {
  name: string
  email: string
  role: string
  department: string
  status: "Active" | "Inactive"
}

const mockData: Employee[] = [
  { name: "Alice Johnson", email: "alice@example.com", role: "Developer", department: "Engineering", status: "Active" },
  { name: "Bob Smith", email: "bob@example.com", role: "Designer", department: "Design", status: "Active" },
  { name: "Charlie Brown", email: "charlie@example.com", role: "Manager", department: "Engineering", status: "Active" },
  { name: "Diana Prince", email: "diana@example.com", role: "Analyst", department: "Finance", status: "Inactive" },
  { name: "Eve Davis", email: "eve@example.com", role: "Developer", department: "Engineering", status: "Active" },
  { name: "Frank Miller", email: "frank@example.com", role: "Designer", department: "Design", status: "Inactive" },
  { name: "Grace Lee", email: "grace@example.com", role: "Manager", department: "HR", status: "Active" },
  { name: "Henry Wilson", email: "henry@example.com", role: "Developer", department: "Engineering", status: "Active" },
  { name: "Ivy Chen", email: "ivy@example.com", role: "Analyst", department: "Finance", status: "Active" },
  { name: "Jack Taylor", email: "jack@example.com", role: "Designer", department: "Design", status: "Inactive" },
  { name: "Kate Anderson", email: "kate@example.com", role: "Developer", department: "Engineering", status: "Active" },
  { name: "Leo Thompson", email: "leo@example.com", role: "Manager", department: "HR", status: "Active" },
]

const columns: ColumnDef<Employee>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    meta: { mobileLabel: "Name" },
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    meta: { mobileLabel: "Email" },
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    meta: { mobileLabel: "Role" },
  },
  {
    id: "department",
    header: "Department",
    accessorKey: "department",
    meta: { mobileLabel: "Dept" },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    meta: { mobileLabel: "Status" },
    cell: ({ getValue }) => {
      const value = getValue() as string
      return (
        <span
          className={
            value === "Active"
              ? "rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"
              : "rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
          }
        >
          {value}
        </span>
      )
    },
  },
]

const actions: Action<Employee>[] = [
  {
    label: "Edit",
    icon: Pencil,
    onClick: (row) => toast.info(`Edit ${row.name}`),
  },
  {
    label: "Delete",
    icon: Trash2,
    variant: "destructive",
    onClick: (row) => toast.error(`Delete ${row.name}`),
  },
]

export const EmployePage = () => {
  const [productForm, setProductForm] = useState(false)

  return (
    <PageContainer>
      <PageHeader
        pageName="Employees"
        pageSubName="Manage your team members and their roles"
        actionButtonLabel="Add Employee"
        onActionButtonClick={() => setProductForm(true)}
      />
      <ResponsiveDataTable
        columns={columns}
        data={mockData}
        pageSize={20}
        actions={actions}
      />
      <CustomSlider
        open={productForm}
        onOpenChange={() => setProductForm(false)}
        title="Employee form"
        cancelLabel="close"
        onCancel={() => setProductForm(false)}
      />
    </PageContainer>
  )
}
