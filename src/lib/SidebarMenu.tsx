import { type LucideIcon, LayoutDashboard, Users, FileText, Settings, UserCog, UserPlus, FileSpreadsheet, FilePen, type IconNode } from "lucide-react"

export type SidebarMenu = {
  label: string
  icon: LucideIcon
  href?: string
  children?: SidebarMenu[]
  permission?: string
}

export type SidebarMenuGroup = {
  label?: string
  items: SidebarMenu[]
}

export const sidebarMenuGroups: SidebarMenuGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        permission: "dashboard.view",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Users",
        icon: Users,
        permission: "users.view",
        children: [
          { label: "All Users", icon: UserCog, href: "/users", permission: "users.list" },
          { label: "Invite", icon: UserPlus, href: "/users/invite", permission: "users.invite" },
        ],
      },
      {
        label: "Documents",
        icon: FileText,
        permission: "documents.view",
        children: [
          { label: "Spreadsheets", icon: FileSpreadsheet, href: "/documents/spreadsheets", permission: "documents.spreadsheets" },
          { label: "Reports", icon: FilePen, href: "/documents/reports", permission: "documents.reports" },
        ],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        permission: "settings.view",
      },
    ],
  },
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
