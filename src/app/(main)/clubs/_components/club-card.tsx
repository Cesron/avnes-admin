"use client";

import { UsersIcon } from "lucide-react";
import { EditButton } from "@/components/edit-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Club } from "@/types/club";
import { useEditClub } from "../_context/edit-club-context";

interface ClubCardProps {
  club: Club;
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

export function ClubCard({ club }: ClubCardProps) {
  const { openEditDialog } = useEditClub();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
              {getInitials(club.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <CardTitle className="text-base truncate">{club.name}</CardTitle>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <UsersIcon className="size-3.5" />
              Club
            </p>
          </div>
        </div>

        <CardAction>
          <EditButton onClick={() => openEditDialog(club)} />
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-xs text-muted-foreground">
          Gestiona los grupos y niños asignados a este club desde la sección
          correspondiente.
        </p>
      </CardContent>
    </Card>
  );
}
