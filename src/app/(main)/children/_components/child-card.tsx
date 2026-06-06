"use client";

import {
  CalendarIcon,
  EditIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ImageIcon,
  MoreVerticalIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ChildWithFamily } from "@/services/children/get-children";
import { calculateAge } from "@/utils/calculate-age";
import { formatDate } from "@/utils/format-date";
import { getGenderLabel } from "@/utils/get-gender-label";
import { useEditChild } from "../_context/edit-child-context";

interface ChildCardProps {
  child: ChildWithFamily;
}

/**
 * Returns the initials (max 2 letters) for an avatar fallback.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase() || "?";
}

export function ChildCard({ child }: ChildCardProps) {
  const { openEditDialog } = useEditChild();
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
      icon: UserIcon,
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="size-12 shrink-0">
            {child.child_photo_url ? (
              <AvatarImage src={child.child_photo_url} alt={child.name} />
            ) : null}
            <AvatarFallback className="text-sm font-semibold">
              {getInitials(child.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1 gap-1.5">
            <CardTitle className="text-base truncate">{child.name}</CardTitle>

            <div className="flex flex-wrap items-center gap-1.5">
              {child.penpal_code && (
                <Badge variant="outline" className="font-mono">
                  {child.penpal_code}
                </Badge>
              )}

              {age !== null && <Badge variant="secondary">{age} años</Badge>}

              <Badge
                variant={child.gender === "M" ? "blue-subtle" : "purple-subtle"}
              >
                {getGenderLabel(child.gender)}
              </Badge>
            </div>
          </div>
        </div>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú de acciones"
              >
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(child)}>
                <EditIcon />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4 shrink-0" />
          <span>
            Nacido el{" "}
            <span className="text-foreground font-medium">
              {formatDate(child.birth_date)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UsersIcon className="size-4 shrink-0" />
          {child.group_name ? (
            <span className="truncate">
              Grupo:{" "}
              <span className="text-foreground font-medium">
                {child.group_name}
              </span>
              {child.group_club_name && (
                <>
                  {" "}
                  <span className="text-muted-foreground">
                    ({child.group_club_name})
                  </span>
                </>
              )}
            </span>
          ) : (
            <span className="text-xs italic">Sin grupo asignado</span>
          )}
        </div>

        {quickLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.key}
                  href={link.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:underline px-2.5 py-1 rounded-md bg-muted hover:bg-muted-foreground/10 transition-colors"
                >
                  <Icon className="size-3.5" />
                  {link.label}
                  <ExternalLinkIcon className="size-3" />
                </a>
              );
            })}
          </div>
        )}

        {quickLinks.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            Sin recursos vinculados
          </p>
        )}
      </CardContent>
    </Card>
  );
}
