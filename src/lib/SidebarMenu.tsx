import { type LucideIcon, LayoutDashboard, Users, Package, Truck, ShoppingCart, Warehouse, UserCheck, FileText, Wallet, Receipt, CreditCard } from "lucide-react"

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
          { label: "All Products", path: "#"},
          { label: "Categories", path: "#"}
        ]
      },
      {
        label: "Suppliers",
        icon: Truck,
        path: "#",
      },
      {
        label: "Purchases",
        icon: ShoppingCart,
        path: "#",
      },
      {
        label: "Inventory",
        icon: Warehouse,
        children: [
          { label: "Stock Overview", path: "#"},
          { label: "Warehouses", path: "#"}
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
        path: "#"
      },
      {
        label: "Sales Order",
        icon: FileText,
        path: "#"
      },
      {
        label: "Finance",
        icon: Wallet,
        path: "#"
      },
      {
        label: "Invoices",
        icon: Receipt,
        path: "#"
      },
      {
        label: "Payments",
        icon: CreditCard,
        path: "#"
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
