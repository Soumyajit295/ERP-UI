import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormInputToggleProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  extraClassName?: string;
  containerClassName?: string;
};

export function FormInputToggle<T extends FieldValues>({
  control,
  name,
  label,
  required,
  extraClassName,
  containerClassName,
}: FormInputToggleProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("flex items-center justify-between rounded-lg border border-border p-3", containerClassName)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}
          <Switch
            id={name}
            className={extraClassName}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
          />
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
