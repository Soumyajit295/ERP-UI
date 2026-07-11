import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  badge?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  badge,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <span>{title}</span>
          {Icon && <Icon className={iconClassName} />}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight">{value}</h2>

          {subtitle && (
            <p className="mt-2 text-sm">{subtitle}</p>
          )}

          {badge && <div className="mt-3">{badge}</div>}
        </div>
      </CardContent>
    </Card>
  );
}