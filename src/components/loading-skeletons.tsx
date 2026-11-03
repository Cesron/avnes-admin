import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingRegion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: live region contains block layout, not form output.
    <div role="status" aria-label="Cargando contenido" className={className}>
      <span className="sr-only">Cargando contenido…</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <LoadingRegion>
      <div className="flex min-h-20 items-center justify-between gap-4 border-b py-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>
    </LoadingRegion>
  );
}

export function OccurrenceHeaderSkeleton() {
  return (
    <LoadingRegion>
      <div className="space-y-4 border-b py-4">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-28 w-full max-w-lg" />
      </div>
    </LoadingRegion>
  );
}

export type ListKind =
  | "families"
  | "children"
  | "clubs"
  | "groups"
  | "mentors"
  | "users"
  | "activities";
const heights: Record<ListKind, string> = {
  families: "h-56",
  children: "h-[600px] sm:h-[580px]",
  clubs: "h-44",
  groups: "h-52",
  mentors: "h-44",
  users: "h-44",
  activities: "h-64",
};
export function CardsSkeleton({
  kind,
  count = 4,
}: {
  kind: ListKind;
  count?: number;
}) {
  return (
    <LoadingRegion>
      <div
        className={`grid grid-cols-1 gap-3 sm:gap-4 ${kind === "families" ? "xl:grid-cols-2" : kind === "children" ? "lg:grid-cols-2" : "md:grid-cols-2"}`}
      >
        {Array.from({ length: Math.max(1, count) }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed placeholders have no identity or state.
          <Skeleton key={`card-${i}`} className={heights[kind]} />
        ))}
      </div>
    </LoadingRegion>
  );
}
export function ListSkeleton({ kind }: { kind: ListKind }) {
  const filtered = kind === "families" || kind === "children";
  return (
    <div className="space-y-4">
      {filtered ? (
        <LoadingRegion>
          <Skeleton className="h-16 w-full" />
        </LoadingRegion>
      ) : kind === "clubs" || kind === "groups" ? (
        <div className="h-10" />
      ) : null}
      <CardsSkeleton kind={kind} />
      {filtered && (
        <LoadingRegion>
          <Skeleton className="h-9 w-60 max-w-full ml-auto" />
        </LoadingRegion>
      )}
    </div>
  );
}
export function ListPageSkeleton({ kind }: { kind: ListKind }) {
  return (
    <>
      <HeaderSkeleton />
      <div className="py-6">
        <ListSkeleton kind={kind} />
      </div>
    </>
  );
}
export function KpisSkeleton() {
  return (
    <LoadingRegion>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
    </LoadingRegion>
  );
}
export function DashboardSkeleton({ mentor = false }: { mentor?: boolean }) {
  return (
    <div className="space-y-6">
      {!mentor && (
        <LoadingRegion>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="mt-6 h-10 w-full" />
        </LoadingRegion>
      )}
      <KpisSkeleton />
      <LoadingRegion>
        <div className={mentor ? "grid gap-4 lg:grid-cols-2" : "space-y-6"}>
          <Skeleton className="h-72" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="mt-6 h-56" />
      </LoadingRegion>
    </div>
  );
}
export function CalendarSkeleton({
  agenda = false,
  weeks = 5,
}: {
  agenda?: boolean;
  weeks?: number;
}) {
  return (
    <LoadingRegion>
      <div className={agenda ? "space-y-3" : "space-y-1 pt-7 sm:pt-9"}>
        {Array.from({ length: weeks }, (_, i) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed calendar row placeholders.
            key={`week-${i}`}
            className={agenda ? "h-28" : "h-[88px] sm:h-[120px]"}
          />
        ))}
      </div>
    </LoadingRegion>
  );
}
export function AttendanceSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <LoadingRegion>
        <Skeleton className="h-16" />
        <Skeleton className="mt-6 h-10" />
      </LoadingRegion>
      <CalendarSkeleton />
    </div>
  );
}
export function AttendanceListSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingRegion>
        <Skeleton className="h-16" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="mt-6 h-80" />
      </LoadingRegion>
    </div>
  );
}
export function AppShellSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-sidebar">
      <aside className="hidden w-64 shrink-0 p-4 md:block">
        <LoadingRegion>
          <Skeleton className="mt-4 h-12" />
          <Skeleton className="mt-8 h-96" />
        </LoadingRegion>
      </aside>
      <main className="min-w-0 flex-1 bg-background px-4 md:my-2 md:mr-2 md:rounded-xl md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
