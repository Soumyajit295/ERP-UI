import { type LucideIcon, LayoutDashboard, Users, Package, Truck, ShoppingCart, Warehouse, UserCheck, FileText, Wallet, Receipt, CreditCard, Shield } from "lucide-react"

export type SidebarMenu = {
  label: string
  icon?: LucideIcon
  path?: string
  children?: SidebarMenu[]
  permission?: string
}

export type SidebarMenuGroup = {
  label?: string
  items: SidebarMenu[]
}

export const sidebarMenuGroups: SidebarMenuGroup[] = [
  {
    label: "Main Menu",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        permission: "dashboard.view",
      },
      {
        label: "Employees",
        icon: Users,
        path: "/employee",
      },
      {
        label: "Products",
        icon: Package,
        children: [
          { label: "All Products", path: "/products"},
          { label: "Categories", path: "/categories"}
        ]
      },
      {
        label: "Suppliers",
        icon: Truck,
        path: "/suppliers",
      },
      {
        label: "Purchases",
        icon: ShoppingCart,
        path: "/purchase-orders",
      },
      {
        label: "Inventory",
        icon: Warehouse,
        children: [
          { label: "Stock Overview", path: "/inventory"},
          { label: "Warehouses", path: "/warehouses"}
        ]
      },
    ],
  },
  {
    label: "Sales & Finance",
    items: [
      {
        label: "Customers",
        icon: UserCheck,
        path: "/customers"
      },
      {
        label: "Sales Order",
        icon: FileText,
        path: "/sales-orders"
      },
      {
        label: "Finance",
        icon: Wallet,
        path: "#"
      },
      {
        label: "Invoices",
        icon: Receipt,
        path: "/invoices"
      },
      {
        label: "Payments",
        icon: CreditCard,
        path: "/payments"
      }
    ]
  },
  {
    label: "System",
    items: [
      {
        label: "Role Permission",
        icon: Shield,
        path: "/role-permission",
      }
    ]
  }
]

export function filterMenusByPermission(
  menus: SidebarMenuGroup[],
  userPermissions: string[],
): SidebarMenuGroup[] {
  function hasPermission(menu: SidebarMenu): boolean {
    if (!menu.permission) return true
    if (userPermissions.includes(menu.permission)) return true
    return false
  }

  function filterMenu(menu: SidebarMenu): SidebarMenu | null {
    if (!hasPermission(menu)) return null
    let children: SidebarMenu[] | undefined
    if (menu.children) {
      children = menu.children
        .map(filterMenu)
        .filter((m): m is SidebarMenu => m !== null)
      if (children.length === 0) return null
    }
    return { ...menu, children }
  }

  return menus
    .map((group) => ({
      ...group,
      items: group.items.map(filterMenu).filter((m): m is SidebarMenu => m !== null),
    }))
    .filter((group) => group.items.length > 0)
}
