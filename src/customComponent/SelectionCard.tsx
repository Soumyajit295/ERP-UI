import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  icon,
  children,
  action,
  className,
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>

          {action}
        </div>

        {children}
      </CardContent>
    </Card>
  );
}