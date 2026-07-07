import { useState } from "react";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormInputFieldProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  extraClassName?: string;
  containerClassName?: string;
} & React.ComponentProps<"input">;

export function FormInputField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  extraClassName,
  containerClassName,
  ...props
}: FormInputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  const { type: _type, ...rest } = props;

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
          <div className="relative">
            <Input
              id={name}
              className={cn(isPassword && "pr-10", extraClassName)}
              type={isPassword && showPassword ? "text" : props.type}
              {...field}
              {...rest}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            )}
          </div>
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
