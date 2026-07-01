import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  label: string
  loading?: boolean
  loadLabel?: string
  icon?: React.ReactNode
}

export function CustomButton({
  label = "Save",
  loading,
  loadLabel = "Saving...",
  icon,
  className,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      variant="success"
      loading={loading}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {icon}
      {loading ? loadLabel : label}
    </Button>
  )
}