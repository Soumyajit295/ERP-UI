import { flexRender, type Table } from "@tanstack/react-table"
import type { Action } from "./types"
import ActionsDropdown from "../ActionDropdown"

interface DesktopTableProps<TData> {
  table: Table<TData>,
  actions?: Action<TData>[]
}

export function DesktopTable<TData>({ table, actions }: DesktopTableProps<TData>) {
  return (
    <div className="min-w-full rounded-xl">
      <table className="w-full min-w-max">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border bg-muted/50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="h-10 px-3 text-left text-sm font-medium text-muted-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
              {actions && (
                <th className="h-10 w-14 px-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="h-12 px-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {actions && (
                <td className="h-12 px-3 text-right">
                  <ActionsDropdown actions={actions} row={row} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

