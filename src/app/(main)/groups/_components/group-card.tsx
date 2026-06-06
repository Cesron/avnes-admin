"use client";

import { EditIcon, MoreVerticalIcon, UserRoundIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { Group } from "@/types/group";
import { getClubBadgeVariant } from "@/utils/club-colors";
import { useEditGroup } from "../_context/edit-group-context";

interface GroupCardProps {
  group: Group;
}

/**
 * Returns the initials (max 2 letters) for the avatar fallback.
 * Los grupos no tienen foto, por lo que siempre se muestra el fallback.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase() || "?";
}

export function GroupCard({ group }: GroupCardProps) {
  const { openEditDialog } = useEditGroup();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="text-sm font-semibold">
              {getInitials(group.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1 gap-1.5">
            <CardTitle className="text-base truncate">{group.name}</CardTitle>

            <Badge
              variant={getClubBadgeVariant(group.club_name)}
              className="w-fit"
            >
              {group.club_name}
            </Badge>
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
              <DropdownMenuItem onClick={() => openEditDialog(group)}>
                <EditIcon />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserRoundIcon className="size-4 shrink-0" />
          <span className="truncate">
            <span className="text-muted-foreground">Mentora: </span>
            <span className="text-foreground font-medium">
              {group.mentor_name}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
