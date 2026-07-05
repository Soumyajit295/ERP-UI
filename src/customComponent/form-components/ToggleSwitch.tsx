import { useFormContext, Controller } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ToggleSwitchProps {
  name: string
  label: string
  required?: boolean
  disabled?: boolean
}

export function ToggleSwitch({ name, label, required, disabled }: ToggleSwitchProps) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <Switch
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        </div>
      )}
    />
  )
}
