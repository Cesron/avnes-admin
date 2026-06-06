"use client";

import {
  CalendarIcon,
  EditIcon,
  MailIcon,
  MoreVerticalIcon,
  UserRoundIcon,
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
import type { UserRole } from "@/types/user";
import { formatDate } from "@/utils/format-date";
import type { UserWithMentor } from "@/services/users/get-users";
import { useEditUser } from "../_context/edit-user-context";

interface UserCardProps {
  user: UserWithMentor;
}

const ROLE_CONFIG: Record<
  string,
  { label: string; variant: "purple-subtle" | "blue-subtle" | "default" }
> = {
  admin: { label: "Administrador", variant: "purple-subtle" },
  coordinator: { label: "Coordinador", variant: "blue-subtle" },
  mentor: { label: "Mentora", variant: "default" },
};

function getRoleConfig(role: UserRole | null) {
  if (!role || !ROLE_CONFIG[role]) {
    return { label: "Sin rol", variant: "default" as const };
  }
  return ROLE_CONFIG[role];
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

export function UserCard({ user }: UserCardProps) {
  const { openEditDialog } = useEditUser();
  const roleConfig = getRoleConfig(user.role);
  const hasImage = Boolean(user.image);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="size-12 shrink-0">
            {hasImage ? (
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
            ) : null}
            <AvatarFallback className="text-sm font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <CardTitle className="text-base truncate">{user.name}</CardTitle>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
              <MailIcon className="size-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
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
              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                <EditIcon />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="size-4 shrink-0" />
            <span>
              Creado el{" "}
              <span className="text-foreground font-medium">
                {formatDate(user.createdAt)}
              </span>
            </span>
          </div>

          {user.mentor_name ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRoundIcon className="size-4 shrink-0" />
              <span>
                Mentora vinculada:{" "}
                <span className="text-foreground font-medium">
                  {user.mentor_name}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRoundIcon className="size-4 shrink-0" />
              <span className="italic">Sin mentora vinculada</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
