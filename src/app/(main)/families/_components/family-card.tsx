"use client";

import {
  EditIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ImageIcon,
  MoreVerticalIcon,
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
import type { FamilyWithChildren } from "@/services/families/get-families";
import { useEditFamily } from "../_context/edit-family-context";

interface FamilyCardProps {
  family: FamilyWithChildren;
}

export function FamilyCard({ family }: FamilyCardProps) {
  const { openEditDialog } = useEditFamily();

  const quickLinks = [
    {
      key: "biography",
      label: "Biografía",
      icon: FileTextIcon,
      url: family.family_biography_url,
    },
    {
      key: "photo",
      label: "Foto",
      icon: ImageIcon,
      url: family.family_photo_url,
    },
  ].filter((link) => Boolean(link.url));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="size-12 shrink-0">
            {family.family_photo_url ? (
              <AvatarImage
                src={family.family_photo_url}
                alt={family.penpal_code}
              />
            ) : null}
            <AvatarFallback className="text-sm font-semibold">F</AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0 flex-1 gap-1.5">
            <CardTitle className="text-base font-mono truncate">
              {family.penpal_code}
            </CardTitle>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant={family.children_count > 0 ? "secondary" : "outline"}
              >
                <UsersIcon className="size-3" />
                {family.children_count > 0
                  ? `${family.children_count} ${family.children_count === 1 ? "niño" : "niños"}`
                  : "Sin niños"}
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
              <DropdownMenuItem
                onClick={() =>
                  openEditDialog({
                    id: family.id,
                    penpal_code: family.penpal_code,
                    family_biography_url: family.family_biography_url,
                    family_photo_url: family.family_photo_url,
                    created_at: family.created_at,
                    updated_at: family.updated_at,
                  })
                }
              >
                <EditIcon />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {family.children_names && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {family.children_names}
          </p>
        )}

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

        {quickLinks.length === 0 && !family.children_names && (
          <p className="text-xs text-muted-foreground italic">
            Sin recursos vinculados
          </p>
        )}
      </CardContent>
    </Card>
  );
}
