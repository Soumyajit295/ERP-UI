import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormTextAreaProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  extraClassName?: string;
  containerClassName?: string;
} & React.ComponentProps<"textarea">;

export function FormTextArea<T extends FieldValues>({
  control,
  name,
  label,
  required,
  extraClassName,
  containerClassName,
  ...props
}: FormTextAreaProps<T>) {
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
          <Textarea
            id={name}
            className={extraClassName}
            {...field}
            {...props}
          />
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
