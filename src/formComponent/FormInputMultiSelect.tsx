import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type FormInputMultiSelectProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
  extraClassName?: string;
  containerClassName?: string;
};

export function FormInputMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder = "Select...",
  options,
  extraClassName,
  containerClassName,
}: FormInputMultiSelectProps<T>) {
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
          <MultiSelect
            options={options}
            selected={field.value ?? []}
            onChange={field.onChange}
            placeholder={placeholder}
            className={extraClassName}
          />
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
