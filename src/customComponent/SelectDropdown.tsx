import { useState, useMemo } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectDropdownProps {
  options: SelectOption[]
  /** For single select: string | null. For multi select: string[] */
  value: string | string[] | null
  /** Called when selection changes */
  onChange: (value: string | string[] | null) => void
  /** "single" (default) or "multiple" */
  multiple?: boolean
  /** Enables search input inside dropdown */
  searchable?: boolean
  placeholder?: string
  searchPlaceholder?: string
  label?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

export function SelectDropdown({
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  placeholder = "",
  searchPlaceholder = "",
  label,
  emptyMessage = "No options found",
  disabled = false,
  className,
}: SelectDropdownProps) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const selectedValues = multiple
    ? (value as string[]) ?? []
    : value
      ? [value as string]
      : []

  const filtered = useMemo(
    () => options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  )

  const isSelected = (optValue: string) => selectedValues.includes(optValue)

  const toggle = (optValue: string) => {
    if (multiple) {
      const current = value as string[]
      onChange(
        current.includes(optValue)
          ? current.filter((v) => v !== optValue)
          : [...current, optValue]
      )
    } else {
      onChange(optValue)
      setOpen(false)
    }
  }

  const clearAll = () => {
    onChange(multiple ? [] : null)
  }

  const displayText = (() => {
    if (selectedValues.length === 0) return placeholder
    if (!multiple) return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder
    if (selectedValues.length === 1) return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder
    return `${selectedValues.length} selected`
  })()

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-sm font-medium leading-none">{label}</p>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex h-9 w-full items-center justify-between gap-2 px-3"
          >
            <span className={cn("flex-1 truncate text-left", !selectedValues.length && "text-muted-foreground")}>
              {displayText}
            </span>
            {multiple && selectedValues.length > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); clearAll() }}
                className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] p-0">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 border-none px-0 shadow-none focus-visible:ring-0"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            )}
            {filtered.map((opt) => {
              const selected = isSelected(opt.value)
              return (
                <DropdownMenuItem
                  key={opt.value}
                  onSelect={(e) => { e.preventDefault(); toggle(opt.value) }}
                  disabled={opt.disabled}
                  className={cn(
                    "cursor-pointer gap-2",
                    selected && "bg-muted/50",
                    !multiple && selected && "bg-primary/10 font-medium"
                  )}
                >
                  {multiple ? (
                    <div
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input transition-colors",
                        selected && "border-primary bg-primary text-primary-foreground"
                      )}
                    >
                      {selected && <Check className="size-3" />}
                    </div>
                  ) : (
                    <div className="flex size-4 shrink-0 items-center justify-center">
                      {selected && <Check className="size-4 text-primary" />}
                    </div>
                  )}
                  {opt.label}
                </DropdownMenuItem>
              )
            })}
          </div>
          {multiple && selectedValues.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-1">
                <DropdownMenuItem onSelect={clearAll} className="cursor-pointer justify-center text-sm text-muted-foreground">
                  Clear all
                </DropdownMenuItem>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
