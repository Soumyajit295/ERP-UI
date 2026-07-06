import * as React from "react"
import { Checkbox as CheckboxPrimitive, Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, X } from "lucide-react"

type Option = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function MultiSelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="multi-select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
    </PopoverPrimitive.Trigger>
  )
}

function MultiSelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="multi-select-content"
        side="bottom"
        align="start"
        sideOffset={4}
        className={cn(
          "z-50 min-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

function MultiSelectItem({
  className,
  children,
  checked,
  ...props
}: {
  checked: boolean
} & React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <label
      data-slot="multi-select-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
        "hover:bg-muted",
        className,
      )}
    >
      <CheckboxPrimitive.Root
        data-slot="multi-select-checkbox"
        checked={checked}
        className={cn(
          "peer size-4 shrink-0 rounded-sm border border-input shadow-xs",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check className="size-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children}
    </label>
  )
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <MultiSelectTrigger disabled={disabled} className={className}>
        <div className="flex flex-1 flex-wrap gap-1">
          {selected.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {selected.slice(0, 3).map((val) => {
            const opt = options.find((o) => o.value === val)
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded-md border bg-muted px-1.5 py-0.5 text-xs font-medium"
              >
                {opt?.label ?? val}
                <X
                  className="size-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => handleRemove(val, e)}
                />
              </span>
            )
          })}
          {selected.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{selected.length - 3}
            </span>
          )}
        </div>
      </MultiSelectTrigger>
      <MultiSelectContent>
        <div className="max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <MultiSelectItem
              key={opt.value}
              checked={selected.includes(opt.value)}
              onCheckedChange={() => handleToggle(opt.value)}
            >
              {opt.label}
            </MultiSelectItem>
          ))}
        </div>
      </MultiSelectContent>
    </PopoverPrimitive.Root>
  )
}
