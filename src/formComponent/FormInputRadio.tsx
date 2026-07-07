import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type RadioOption = {
  value: string;
  label: string;
};

type FormInputRadioProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  options: RadioOption[];
  extraClassName?: string;
  containerClassName?: string;
};

export function FormInputRadio<T extends FieldValues>({
  control,
  name,
  label,
  required,
  options,
  extraClassName,
  containerClassName,
}: FormInputRadioProps<T>) {
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
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className={extraClassName}
          >
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
                <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
