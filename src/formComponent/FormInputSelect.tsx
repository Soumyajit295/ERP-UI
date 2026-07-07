import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type FormInputSelectProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
  extraClassName?: string;
  containerClassName?: string;
};

export function FormInputSelect<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder = "Select...",
  options,
  extraClassName,
  containerClassName,
}: FormInputSelectProps<T>) {
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
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className={extraClassName}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
