import { useState } from "react"
import { ChevronDown, PanelLeftClose, PanelLeft, Sun, Moon } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/useSidebar"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { sidebarMenuGroups, type SidebarMenu } from "@/lib/SidebarMenu"

function SidebarMenuItem({ item, collapsed, depth = 0 }: { item: SidebarMenu; collapsed: boolean; depth?: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isLink = !!item.href && !hasChildren
  const Icon = item.icon

  if (collapsed) {
    if (isLink) {
      return (
        <Button variant="ghost" size="icon" className="w-full justify-center px-0" asChild title={item.label}>
          <NavLink
            to={item?.href ?? ''}
            end
            className={({ isActive }) => cn(isActive && "bg-muted")}
          >
            {({ isActive }) => (
              <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
            )}
          </NavLink>
        </Button>
      )
    }
    return (
      <Button variant="ghost" size="icon" className="w-full justify-center px-0" title={item.label}>
        <Icon className="size-4 shrink-0" />
      </Button>
    )
  }

  if (isLink) {
    return (
      <Button
        variant="ghost"
        size="default"
        className={cn("w-full justify-start gap-3 px-3", depth > 0 && "pl-8")}
        asChild
      >
        <NavLink
          to={item?.href ?? ''}
          end
            className={({ isActive }) => cn(
            "flex items-center gap-3",
            isActive && "bg-muted text-primary font-semibold"
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span>{item.label}</span>
        </NavLink>
      </Button>
    )
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="default"
        className={cn("w-full justify-start gap-3 px-3", depth > 0 && "pl-8")}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {hasChildren && (
          <ChevronDown
            className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")}
          />
        )}
      </Button>
      {hasChildren && expanded && (
        <div className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <SidebarMenuItem key={child.label} item={child} collapsed={collapsed} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function AppSidebar() {
  const { open, toggle } = useSidebar()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "group/sidebar flex h-dvh flex-col border-r border-border bg-sidebar transition-[width] duration-300 ease-in-out",
        open ? "w-56" : "w-14",
      )}
    >
      <div className="flex h-12 items-center justify-end px-2">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label={open ? "Collapse sidebar" : "Expand sidebar"}>
          {open ? <PanelLeftClose className="size-4" /> : <PanelLeft className="size-4" />}
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-3 overflow-y-auto px-2 py-2">
        {sidebarMenuGroups.map((group, idx) => (
          <div key={idx}>
            {group.label && open && (
              <p className="px-3 pb-1 pt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.label} item={item} collapsed={!open} />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size={open ? "default" : "icon"}
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className={cn("w-full justify-start gap-3 px-3", !open && "justify-center px-0")}
        >
          {theme === "dark" ? <Sun className="size-4 shrink-0" /> : <Moon className="size-4 shrink-0" />}
          {open && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
        </Button>
      </div>
    </aside>
  )
}
