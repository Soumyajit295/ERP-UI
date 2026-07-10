import type { ReactNode } from "react";

interface DetailItemProps {
  label: string;
  children: ReactNode;
}

export function DetailItem({ label, children }: DetailItemProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}