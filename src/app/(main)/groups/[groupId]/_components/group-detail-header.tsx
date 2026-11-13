import { ArrowLeftIcon, CalendarDaysIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Group } from "@/types/group";
import { getClubBadgeVariant } from "@/utils/club-colors";

export function GroupDetailHeader({
  group,
  month,
}: {
  group: Group;
  month: string;
}) {
  return (
    <>
      <header className="flex min-h-20 items-center gap-2 border-b py-4">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="me-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/groups">Grupos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate">{group.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-wrap items-start justify-between gap-4 pt-6">
        <div className="min-w-0 space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight break-words">
            {group.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Badge
              variant={getClubBadgeVariant(group.club_name)}
              className="max-w-full whitespace-normal"
            >
              {group.club_name}
            </Badge>
            <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <UserRoundIcon aria-hidden="true" className="size-4 shrink-0" />
              <span className="break-words">
                Mentora:{" "}
                <span className="font-medium text-foreground">
                  {group.mentor_name}
                </span>
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/groups">
              <ArrowLeftIcon aria-hidden="true" />
              Volver a grupos
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={{
                pathname: "/attendance",
                query: { groupId: group.id, month },
              }}
            >
              <CalendarDaysIcon aria-hidden="true" />
              Ver actividades
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
