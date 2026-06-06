import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";

type KpiCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon container background, e.g. "bg-blue-500/10 text-blue-600" */
  iconClassName?: string;
};

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: KpiCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            iconClassName ?? "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
