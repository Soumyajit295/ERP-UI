import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import dayjs from "dayjs"

type FormDatePickerProps<T extends FieldValues> = {
  control: Control<T, any, any>
  name: FieldPath<T>
  label?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  extraClassName?: string
  containerClassName?: string
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder = "Pick a date",
  disabled,
  extraClassName,
  containerClassName,
}: FormDatePickerProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-2", containerClassName)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                  extraClassName
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value
                  ? dayjs(field.value).format("DD MMM YYYY")
                  : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")
                  setOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}
