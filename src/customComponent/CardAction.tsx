import type { Row } from "@tanstack/react-table"
import type { Action } from "./data-table/types"
import { Button } from "@/components/ui/button"

function CardActions<TData>({
  actions,
  row,
}: {
  actions: Action<TData>[]
  row: Row<TData>
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            onClick={() => action.onClick(row.original)}
          >
            <Icon />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

export default CardActions