import type { LucideIcon } from "lucide-react";
import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type KpiTone = "blue" | "green" | "red" | "amber" | "purple" | "pink";

/**
 * Subtle / refined KPI palette.
 * Each tone maps the project's semantic `--{color}-subtle*` tokens to the
 * icon container, foreground glyph, and progress track / bar.
 */
const TONE_STYLES: Record<
  KpiTone,
  { iconBg: string; iconFg: string; bar: string; track: string }
> = {
  blue: {
    iconBg: "bg-blue-subtle",
    iconFg: "text-blue-subtle-foreground",
    bar: "bg-blue-subtle-foreground/70",
    track: "bg-blue-subtle/50",
  },
  green: {
    iconBg: "bg-green-subtle",
    iconFg: "text-green-subtle-foreground",
    bar: "bg-green-subtle-foreground/70",
    track: "bg-green-subtle/50",
  },
  red: {
    iconBg: "bg-red-subtle",
    iconFg: "text-red-subtle-foreground",
    bar: "bg-red-subtle-foreground/70",
    track: "bg-red-subtle/50",
  },
  amber: {
    iconBg: "bg-amber-subtle",
    iconFg: "text-amber-subtle-foreground",
    bar: "bg-amber-subtle-foreground/70",
    track: "bg-amber-subtle/50",
  },
  purple: {
    iconBg: "bg-purple-subtle",
    iconFg: "text-purple-subtle-foreground",
    bar: "bg-purple-subtle-foreground/70",
    track: "bg-purple-subtle/50",
  },
  pink: {
    iconBg: "bg-pink-subtle",
    iconFg: "text-pink-subtle-foreground",
    bar: "bg-pink-subtle-foreground/70",
    track: "bg-pink-subtle/50",
  },
};

export type KpiTrend = {
  /** Percentage change. Always positive; direction controls the icon and tone. */
  value: number;
  direction: "up" | "down" | "flat";
};

export type KpiCardProps = {
  /** Small uppercase eyebrow text shown above the value. */
  label: string;
  /** Headline number (or string). Rendered with `tabular-nums`. */
  value: number | string;
  /** Optional supporting line below the value. */
  description?: string;
  /** Lucide icon used in the circular chip in the top-right. */
  icon: LucideIcon;
  /** Subtle palette token. Defaults to `blue`. */
  tone?: KpiTone;
  /** 0–100. When provided, renders a thin progress bar at the bottom edge. */
  progress?: number;
  /** Optional trend pill rendered next to the value. */
  trend?: KpiTrend;
  /** 0-based index used to stagger the entrance animation. */
  index?: number;
};

/**
 * Unified KPI card used across the home and attendance pages.
 *
 * Aesthetic notes:
 * - Circular icon chip on a subtle token-backed background.
 * - Tabular-nums on the headline value to prevent layout shift.
 * - Thin progress bar pinned to the bottom edge via absolute positioning
 *   so the card's rounded corners clip it (concentric radius).
 * - Hover: shadow lift + icon scale 1.05 (no `transition: all`).
 * - Entrance: fade + slide-up, staggered by `index * 80ms`.
 */
export function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "blue",
  progress,
  trend,
  index = 0,
}: KpiCardProps) {
  const t = TONE_STYLES[tone];
  const safeProgress =
    progress === undefined ? undefined : Math.min(100, Math.max(0, progress));

  return (
    <Card
      className={cn(
        "group relative gap-3 overflow-hidden p-5",
        "animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both",
        "transition-shadow duration-200 hover:shadow-md",
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <CardDescription className="font-medium text-[0.6875rem] uppercase tracking-wider text-pretty">
          {label}
        </CardDescription>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            "transition-transform duration-300 group-hover:scale-105",
            t.iconBg,
          )}
          aria-hidden="true"
        >
          <Icon className={cn("size-[1.125rem]", t.iconFg)} />
        </div>
      </div>

      <div className="space-y-0.5">
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-3xl font-bold tracking-tight tabular-nums text-balance">
            {value}
          </CardTitle>
          {trend && <KpiTrendBadge trend={trend} />}
        </div>
        {description ? (
          <p className="text-xs text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>

      {safeProgress !== undefined && (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-1 overflow-hidden",
            t.track,
          )}
          aria-hidden="true"
        >
          <div
            className={cn("h-full", t.bar)}
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      )}
    </Card>
  );
}

function KpiTrendBadge({ trend }: { trend: KpiTrend }) {
  const Icon =
    trend.direction === "up"
      ? ArrowUpRightIcon
      : trend.direction === "down"
        ? ArrowDownRightIcon
        : MinusIcon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
        "text-[0.6875rem] font-medium tabular-nums",
        trend.direction === "up" &&
          "bg-green-subtle text-green-subtle-foreground",
        trend.direction === "down" &&
          "bg-red-subtle text-red-subtle-foreground",
        trend.direction === "flat" && "bg-muted text-muted-foreground",
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {Math.abs(trend.value)}%
    </span>
  );
}
