import { useState } from "react"
import { ChevronDown, PanelLeftClose, PanelLeft, Sun, Moon, LogOut, Building2 } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/useSidebar"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { sidebarMenuGroups, type SidebarMenu } from "@/lib/SidebarMenu"
import { useAuthStore } from "@/stores/auth.store"

function SidebarMenuItem({ item, collapsed, depth = 0 }: { item: SidebarMenu; collapsed: boolean; depth?: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isLink = !!item.path && !hasChildren
  const Icon = item.icon

  if (collapsed) {
    if (isLink) {
      return (
        <Button variant="ghost" size="icon" className="w-full justify-center px-0" asChild title={item.label}>
          <NavLink
            to={item?.path ?? ''}
            end
            className={({ isActive }) => cn(isActive && "bg-muted")}
          >
            {({ isActive }) => (
              Icon ? <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} /> : null
            )}
          </NavLink>
        </Button>
      )
    }
    return (
      <Button variant="ghost" size="icon" className="w-full justify-center px-0" title={item.label}>
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
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
          to={item?.path ?? ''}
          end
            className={({ isActive }) => cn(
            "flex items-center gap-3",
            isActive && "bg-muted text-primary font-semibold"
          )}
        >
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
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
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
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
  const {user} = useAuthStore()

  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "flex h-dvh flex-col border-r border-border bg-sidebar transition-[width] duration-300 ease-in-out",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="border-b border-border p-2">
        {open ? (
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500">
                  <Building2 className="h-6 w-6"/>
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold ">
                    {user?.companyName}
                  </h2>

                  <p className="truncate text-xs">
                    Enterprise ERP
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-2 py-3">
        {sidebarMenuGroups.map((group, idx) => (
          <div key={idx}>
            {group.label && open && (
              <p className="px-3 pb-2 text-xs uppercase tracking-wider text-muted-foreground font-bold">
                {group.label}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarMenuItem
                  key={item.label}
                  item={item}
                  collapsed={!open}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2 space-y-2">
        <Button
          variant="ghost"
          size={open ? "default" : "icon"}
          onClick={toggleTheme}
          className={cn(
            "w-full justify-start gap-3 cursor-pointer",
            open ? "px-3" : "justify-center px-0"
          )}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 shrink-0" />
          )}

          {open && (
            <span>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
