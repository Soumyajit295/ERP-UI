import type { Row } from "@tanstack/react-table"
import type { Action } from "./data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

function ActionsDropdown<TData>({
  actions,
  row,
}: {
  actions: Action<TData>[]
  row: Row<TData>
}) {
  const visibleActions = actions.filter((action) => {
    if (typeof action.permission === "function") {
      return action.permission(row.original)
    }

    return action.permission !== false
  })

  if (visibleActions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="-mt-1 -mr-2 shrink-0">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {visibleActions.map((action) => {
          const Icon = action.icon
          const destructive = action.variant === "destructive"
          return (
            <DropdownMenuItem
              key={action.label}
              onClick={() => action.onClick(row.original)}
              className={destructive ? "text-destructive focus:text-destructive focus:bg-destructive/10" : ""}
            >
              <Icon className="size-3.5" />
              <span className="text-xs">{action.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionsDropdown
