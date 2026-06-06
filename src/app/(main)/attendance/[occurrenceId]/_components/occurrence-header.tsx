"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { OccurrenceDetail } from "@/types/attendance";

interface OccurrenceHeaderProps {
  occurrence: OccurrenceDetail;
  /**
   * When provided (mentor users), only badges for groups inside this list are
   * shown. Admin / coordinator pass `undefined` and see every group that
   * belongs to the activity.
   */
  mentorGroupIds?: string[];
}

export function OccurrenceHeader({
  occurrence,
  mentorGroupIds,
}: OccurrenceHeaderProps) {
  // Format time for display
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(occurrence.start_datetime);
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // For mentors, restrict the visible badges to the groups they own.
  const visibleGroups =
    mentorGroupIds === undefined
      ? occurrence.groups
      : occurrence.groups.filter((g) => mentorGroupIds.includes(g.id));

  return (
    <header className="flex flex-col gap-4 min-h-20 py-4 shrink-0 transition-all ease-linear border-b">
      <div className="flex flex-wrap gap-3 items-center">
        <SidebarTrigger className="-ms-1" />
        <div className="max-lg:hidden lg:contents">
          <Separator
            orientation="vertical"
            className="me-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/attendance">
                  Tomar Asistencia
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{occurrence.activity_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{occurrence.activity_name}</h1>
        <p className="text-muted-foreground">{capitalizedDate}</p>
        <p className="text-sm text-muted-foreground">
          {formatTime(occurrence.start_datetime)} -{" "}
          {formatTime(occurrence.end_datetime)}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {visibleGroups.map((group) => (
            <span
              key={group.id}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {group.name} ({group.club_name})
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
