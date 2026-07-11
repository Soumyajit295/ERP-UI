import { flexRender, type Table } from "@tanstack/react-table"
import { Card, CardContent } from "@/components/ui/card"
import type { Action } from "./types"
import ActionsDropdown from "../ActionDropdown"

interface MobileCardListProps<TData> {
  table: Table<TData>,
  actions?: Action<TData>[]
}

export function MobileCardList<TData>({ table, actions }: MobileCardListProps<TData>) {
  return (
    <div className="space-y-3">
      {table.getRowModel().rows.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No results.
        </div>
      ) : (
        table.getRowModel().rows.map((row) => (
          <Card key={row.id}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-2">
                  {row.getVisibleCells().map((cell) => {
                    const label = cell.column.columnDef.meta?.mobileLabel
                      ?? cell.column.id
                    return (
                      <div key={cell.id} className="flex items-start gap-2">
                        <span className="min-w-20 shrink-0 text-xs font-medium text-muted-foreground">
                          {label}
                        </span>
                        <span className="min-w-0 flex-1 text-sm break-all">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {actions && (
                  <ActionsDropdown actions={actions} row={row} />
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

