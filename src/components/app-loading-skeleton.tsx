"use client";

import { usePathname } from "next/navigation";
import {
  AppShellSkeleton,
  AttendanceListSkeleton,
  AttendanceSkeleton,
  DashboardSkeleton,
  HeaderSkeleton,
  KpisSkeleton,
  type ListKind,
  ListPageSkeleton,
  OccurrenceHeaderSkeleton,
} from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

const listRoutes = new Set<string>([
  "families",
  "children",
  "clubs",
  "groups",
  "mentors",
  "users",
  "activities",
]);

export function AppLoadingSkeleton() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  if (listRoutes.has(segment)) {
    return (
      <AppShellSkeleton>
        <ListPageSkeleton kind={segment as ListKind} />
      </AppShellSkeleton>
    );
  }
  const occurrence = pathname.startsWith("/attendance/");
  return (
    <AppShellSkeleton>
      {occurrence ? <OccurrenceHeaderSkeleton /> : <HeaderSkeleton />}
      <div className="space-y-6 py-6">
        {segment === "dashboard" ? (
          <DashboardSkeleton />
        ) : occurrence ? (
          <AttendanceListSkeleton />
        ) : segment === "attendance" ? (
          <AttendanceSkeleton />
        ) : (
          <>
            <Skeleton className="h-16 max-w-lg" />
            <KpisSkeleton />
          </>
        )}
      </div>
    </AppShellSkeleton>
  );
}
