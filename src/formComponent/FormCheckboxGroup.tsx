import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CheckboxOption = {
  value: string;
  label: string;
};

type FormCheckboxGroupProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  options: CheckboxOption[];
  extraClassName?: string;
  containerClassName?: string;
};

export function FormCheckboxGroup<T extends FieldValues>({
  control,
  name,
  label,
  required,
  options,
  extraClassName,
  containerClassName,
}: FormCheckboxGroupProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-2", containerClassName)}>
          {label && (
            <Label>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}
          <div className={cn("space-y-2", extraClassName)}>
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${name}-${opt.value}`}
                  checked={Array.isArray(field.value) && field.value.includes(opt.value)}
                  onCheckedChange={(checked) => {
                    const current = Array.isArray(field.value) ? field.value : [];
                    if (checked) {
                      field.onChange([...current, opt.value]);
                    } else {
                      field.onChange(current.filter((v: string) => v !== opt.value));
                    }
                  }}
                />
                <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </div>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
