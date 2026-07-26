import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CustomButton } from "./CustomButton"

interface CustomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: () => void
  onCancel?: () => void
  loading?: boolean
  children?: React.ReactNode
}

export function CustomModal({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  loading = false,
  children,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <DialogFooter>
          <CustomButton
            label={cancelLabel}
            onClick={() => {
              onCancel?.()
              onOpenChange(false)
            }}
            variant="outline"
            className="px-5"
          />
          <CustomButton
            label={submitLabel}
            onClick={onSubmit}
            loading={loading}
            className="px-5"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
