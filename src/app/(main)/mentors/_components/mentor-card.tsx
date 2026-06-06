"use client";

import { EditIcon, MailIcon, MoreVerticalIcon, PhoneIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { Mentor } from "@/types/mentor";
import { useEditMentor } from "../_context/edit-mentor-context";

interface MentorCardProps {
  mentor: Mentor;
}

/**
 * Returns the initials (max 2 letters) for an avatar fallback.
 * Falls back to "?" when the name is empty or only contains whitespace.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase() || "?";
}

export function MentorCard({ mentor }: MentorCardProps) {
  const { openEditDialog } = useEditMentor();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="text-sm font-semibold">
              {getInitials(mentor.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <CardTitle className="text-base truncate">{mentor.name}</CardTitle>
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
              <DropdownMenuItem onClick={() => openEditDialog(mentor)}>
                <EditIcon />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2">
        {mentor.phone ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PhoneIcon className="size-4 shrink-0" />
            <a
              href={`tel:${mentor.phone}`}
              className="text-foreground hover:underline truncate"
            >
              {mentor.phone}
            </a>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Sin teléfono registrado
          </p>
        )}

        {mentor.email ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MailIcon className="size-4 shrink-0" />
            <a
              href={`mailto:${mentor.email}`}
              className="text-foreground hover:underline truncate"
            >
              {mentor.email}
            </a>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Sin email registrado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
