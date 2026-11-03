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
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { ChildWithFamily } from "@/services/children/get-children";
import { calculateAge } from "@/utils/calculate-age";
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
      <Card className="h-full gap-5 shadow-none">
        <CardHeader className="gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar className="size-14 shrink-0 rounded-xl">
              {child.child_photo_url ? (
                <AvatarImage
                  src={child.child_photo_url}
                  alt=""
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-xl bg-blue-subtle text-base font-semibold text-blue-subtle-foreground">
                {getInitials(child.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-2">
              <h2
                id={headingId}
                className="text-lg font-semibold leading-snug break-words"
              >
                {child.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                {age !== null && (
                  <span className="tabular-nums">
                    {age} {age === 1 ? "año" : "años"}
                  </span>
                )}
                <Badge
                  variant={
                    child.gender === "M" ? "blue-subtle" : "purple-subtle"
                  }
                >
                  {getGenderLabel(child.gender)}
                </Badge>
              </div>
            </div>
          </div>
          <CardAction>
            <EditButton
              className="size-11"
              aria-label={`Editar a ${child.name}`}
              onClick={() => openEditDialog(child)}
            />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
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
          <div className="mt-auto border-t pt-3">
            <ResourceLinks links={quickLinks} owner={child.name} />
          </div>
        </CardContent>
        <CardFooter>
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
