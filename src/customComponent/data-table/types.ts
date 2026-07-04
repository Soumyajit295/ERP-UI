import type {
  ColumnDef as TanStackColumnDef,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table"
import type { ComponentType } from "react"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    mobileLabel?: string
  }
}

export type ColumnDef<TData> = TanStackColumnDef<TData>

export interface Action<TData> {
  label: string
  icon: ComponentType<{ className?: string }>
  onClick: (row: TData) => void
  variant?: "default" | "destructive",
  permission?: boolean | ((row: TData) => boolean)
}


export interface ResponsiveDataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  pageSize?: number
  pageCount?: number
  pagination?: PaginationState
  loading?: boolean
  onPaginationChange?: OnChangeFn<PaginationState>
  manualPagination?: boolean
  mobileBreakpoint?: number
  actions?: Action<TData>[]
}
