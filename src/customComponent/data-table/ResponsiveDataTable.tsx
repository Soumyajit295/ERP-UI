import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Loader2 } from "lucide-react"
import { DataTablePagination } from "./DataTablePagination"
import { DesktopTable } from "./DesktopTable"
import { MobileCardList } from "./MobileCardList"
import { useIsMobile } from "@/hooks/useIsMobile"
import type { ResponsiveDataTableProps } from "./types"

export function ResponsiveDataTable<TData>({
  columns,
  data,
  loading,
  pageSize = 10,
  pageCount,
  pagination,
  onPaginationChange,
  manualPagination = false,
  mobileBreakpoint = 640,
  actions
}: ResponsiveDataTableProps<TData>) {
  const isMobile = useIsMobile(mobileBreakpoint)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    manualPagination,
    pageCount,
    state: pagination ? { pagination } : undefined,
    onPaginationChange,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
     <div className="relative flex min-h-0 min-w-0 flex-1 flex-col" aria-busy={loading}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto">
        {isMobile
          ? <MobileCardList table={table} actions={actions} />
          : <DesktopTable table={table} actions={actions} />}
      </div>
      {pagination && <DataTablePagination table={table} />}
    </div>
  )
}
