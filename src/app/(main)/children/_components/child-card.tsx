"use client";

import {
  ArrowRightIcon,
  CalendarIcon,
  FileTextIcon,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import { EditButton } from "@/components/edit-button";
import { ResourceLinks } from "@/components/resource-links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ChildWithFamily } from "@/services/children/get-children";
import { calculateAge } from "@/utils/calculate-age";
import { convertGoogleDriveImageUrl } from "@/utils/family-helpers";
import { formatDate } from "@/utils/format-date";
import { getGenderLabel } from "@/utils/get-gender-label";
import { useEditChild } from "../_context/edit-child-context";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase() || "?";
}

export function ChildCard({ child }: { child: ChildWithFamily }) {
  const { openEditDialog } = useEditChild();
  const headingId = useId();
  const age = calculateAge(child.birth_date);
  const photoUrl = convertGoogleDriveImageUrl(child.child_photo_url);
  const quickLinks = [
    {
      key: "pamphlet",
      label: "Panfleto",
      icon: FileTextIcon,
      url: child.pamphlet_url,
    },
    {
      key: "biography",
      label: "Biografía",
      icon: FileTextIcon,
      url: child.family_biography_url,
    },
    {
      key: "photo",
      label: "Foto",
      icon: ImageIcon,
      url: child.family_photo_url,
    },
  ].filter((link) => Boolean(link.url));

  return (
    <article aria-labelledby={headingId} className="h-full min-w-0">
      <Card className="h-full gap-0 overflow-hidden p-0 shadow-none">
        <div
          className={cn(
            "relative shrink-0 bg-muted",
            photoUrl ? "h-56 sm:h-64" : "h-40 sm:h-44",
          )}
        >
          <Avatar className="h-full w-full rounded-none">
            {photoUrl ? (
              <AvatarImage
                src={photoUrl}
                alt={`Foto de ${child.name}`}
                className="aspect-auto object-contain"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <AvatarFallback className="rounded-none bg-muted text-4xl font-semibold text-muted-foreground">
              {getInitials(child.name)}
            </AvatarFallback>
          </Avatar>
          <EditButton
            className="absolute right-3 top-3 size-11 border bg-card hover:bg-accent"
            aria-label={`Editar a ${child.name}`}
            onClick={() => openEditDialog(child)}
          />
        </div>
        <CardHeader className="gap-3 p-5 pb-0 sm:px-6 sm:pt-6">
          <h2
            id={headingId}
            className="text-xl font-semibold leading-snug break-words"
          >
            {child.name}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            {age !== null && (
              <span className="tabular-nums">
                {age} {age === 1 ? "año" : "años"}
              </span>
            )}
            <Badge
              variant={child.gender === "M" ? "blue-subtle" : "purple-subtle"}
            >
              {getGenderLabel(child.gender)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-5 px-5 pt-6 sm:px-6">
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Grupo</dt>
            <dd className="font-medium break-words">
              {child.group_name || "Sin grupo asignado"}
            </dd>
            <dt className="text-muted-foreground">Club</dt>
            <dd className="break-words">
              {child.group_club_name || "Sin club asignado"}
            </dd>
            <dt className="text-muted-foreground">Nacimiento</dt>
            <dd className="tabular-nums">
              {child.birth_date
                ? formatDate(child.birth_date)
                : "Sin fecha registrada"}
            </dd>
            {child.penpal_code && (
              <>
                <dt className="text-muted-foreground">Código familiar</dt>
                <dd className="font-medium tabular-nums break-all">
                  {child.penpal_code}
                </dd>
              </>
            )}
          </dl>
          <div className="mt-auto border-t pt-4">
            <ResourceLinks links={quickLinks} owner={child.name} />
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-4 sm:px-6 sm:pb-6">
          <Button
            variant="outline"
            asChild
            className="min-h-11 w-full justify-between gap-2"
          >
            <Link
              href={`/children/${child.id}/attendance`}
              aria-label={`Historial de asistencia de ${child.name}`}
            >
              <span className="flex items-center gap-2">
                <CalendarIcon aria-hidden="true" className="size-4" />
                Historial de asistencia
              </span>
              <ArrowRightIcon aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
}
