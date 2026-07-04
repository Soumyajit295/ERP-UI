import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { CustomButton } from "./CustomButton"

interface CustomSliderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: () => void
  onCancel?: () => void
  loading?: boolean
  side?: "top" | "bottom" | "left" | "right"
  children?: React.ReactNode
}

export function CustomSlider({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  loading = false,
  side = "right",
  children,
}: CustomSliderProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1">{children}</div>
        <SheetFooter>
          <CustomButton label={cancelLabel} onClick={() => { onCancel?.(); onOpenChange(false) }} className="px-5"/>
          <CustomButton label={submitLabel} onClick={onSubmit} loading={loading} className="px-5" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
