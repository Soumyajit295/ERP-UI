import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormInputCheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  extraClassName?: string;
  containerClassName?: string;
};

export function FormInputCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  required,
  extraClassName,
  containerClassName,
}: FormInputCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("flex items-center gap-2", containerClassName)}>
          <Checkbox
            id={name}
            className={extraClassName}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
          />
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
