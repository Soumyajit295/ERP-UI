import { useEffect, useState } from "react"
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { DataTablePagination } from "./DataTablePagination"
import { DesktopTable } from "./DesktopTable"
import { MobileCardList } from "./MobileCardList"
import type { ResponsiveDataTableProps } from "./types"

function useIsMobile(breakpoint: number) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [breakpoint])

  return isMobile
}

export function ResponsiveDataTable<TData>({
  columns,
  data,
  pageSize = 10,
  mobileBreakpoint = 640,
  actions
}: ResponsiveDataTableProps<TData>) {
  const isMobile = useIsMobile(mobileBreakpoint)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
     <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        {isMobile
          ? <MobileCardList table={table} actions={actions} />
          : <DesktopTable table={table} actions={actions} />}
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
