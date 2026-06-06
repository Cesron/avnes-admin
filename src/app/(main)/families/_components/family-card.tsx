"use client";

import {
  EditIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ImageIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/cn";
import type {
  ChildSummary,
  FamilyWithChildren,
} from "@/services/families/get-families";
import {
  convertGoogleDriveImageUrl,
  extractSurnames,
  getFirstInitial,
  getFirstName,
  getSurnameInitials,
} from "@/utils/family-helpers";
import { useEditFamily } from "../_context/edit-family-context";

interface FamilyCardProps {
  family: FamilyWithChildren;
}

export function FamilyCard({ family }: FamilyCardProps) {
  const { openEditDialog } = useEditFamily();

  // Foto: convertimos la URL de Google Drive a un src directo de imagen.
  const photoUrl = convertGoogleDriveImageUrl(family.family_photo_url);
  const hasPhoto = Boolean(photoUrl);

  // Apellidos: los extraemos del nombre completo del primer niño.
  const surnames = extractSurnames(family.first_child_name);
  const hasSurnames = Boolean(surnames);

  // Iniciales: primera letra de cada apellido (p. ej. "Abrego Ramirez" → "AR").
  const initials = getSurnameInitials(surnames);

  // Hijos: al hacer hover sobre el botón se muestran todos dentro del tooltip.
  const hasChildren = family.children.length > 0;
  const childrenCountLabel = hasChildren
    ? `${family.children_count} ${family.children_count === 1 ? "niño" : "niños"}`
    : "Sin niños";

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
    <Card className="group overflow-hidden p-0 hover:shadow-md transition-all duration-300">
      <div className="flex">
        {/* Foto familiar: cuadrada, ocupa todo el alto de la card. */}
        <div className="relative w-42 sm:w-56 shrink-0 overflow-hidden bg-linear-to-br from-primary/25 via-primary/8 to-amber-200/50 dark:from-primary/30 dark:via-primary/10 dark:to-amber-900/30">
          {hasPhoto ? (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={`Ver foto de la familia ${family.penpal_code} en grande`}
                  className="absolute inset-0 cursor-pointer"
                >
                  {/* biome-ignore lint/performance/noImgElement: las URLs de Google Drive no admiten next/image sin proxy. */}
                  <img
                    src={photoUrl ?? ""}
                    alt={
                      hasSurnames ? surnames : `Familia ${family.penpal_code}`
                    }
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              </DialogTrigger>
              <DialogContent
                className={cn(
                  "bg-black/90 border-0 p-2 sm:max-w-3xl md:max-w-5xl",
                  "[&_[data-slot=dialog-close]]:bg-white/20",
                  "[&_[data-slot=dialog-close]]:text-white",
                  "[&_[data-slot=dialog-close]]:rounded-full",
                  "[&_[data-slot=dialog-close]]:size-8",
                  "[&_[data-slot=dialog-close]]:p-2",
                  "[&_[data-slot=dialog-close]]:opacity-100",
                  "[&_[data-slot=dialog-close]]:hover:bg-white/30",
                )}
              >
                <DialogTitle className="sr-only">
                  {hasSurnames
                    ? `Foto de la familia ${surnames}`
                    : `Foto de la familia ${family.penpal_code}`}
                </DialogTitle>
                {/* biome-ignore lint/performance/noImgElement: misma razón que la foto principal. */}
                <img
                  src={photoUrl ?? ""}
                  alt={hasSurnames ? surnames : `Familia ${family.penpal_code}`}
                  className="max-h-[88vh] w-full object-contain"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none text-3xl sm:text-4xl font-bold tracking-tight text-primary/45 dark:text-primary/40">
                {initials || "?"}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/10 via-transparent to-white/5" />
        </div>

        {/* Contenido */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
          {/* Header: etiqueta + título + acciones */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {/* Etiqueta "Familia · 0001" */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Familia
                </span>
                <span className="text-sm text-muted-foreground/40">·</span>
                <span className="text-sm font-mono font-bold tracking-wider text-primary">
                  {family.penpal_code}
                </span>
              </div>

              {/* Título principal: apellidos del primer niño */}
              <CardTitle
                className="truncate text-xl font-bold tracking-tight leading-tight sm:text-2xl"
                title={hasSurnames ? surnames : `Familia ${family.penpal_code}`}
              >
                {hasSurnames ? (
                  surnames
                ) : (
                  <span className="font-normal italic text-muted-foreground">
                    Sin nombre
                  </span>
                )}
              </CardTitle>
            </div>

            <CardAction className="-mt-1 -mr-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Editar familia ${family.penpal_code}`}
                className="size-8"
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
              </Button>
            </CardAction>
          </div>

          {/* Botón "X niños": al hacer hover (desktop) o tap (mobile) muestra los niños. */}
          <div className="flex flex-wrap items-center gap-1.5">
            <HoverCard openDelay={150} closeDelay={120}>
              <HoverCardTrigger asChild>
                <Button
                  variant={hasChildren ? "secondary" : "outline"}
                  disabled={!hasChildren}
                  className="h-7 gap-1.5 px-2.5 text-sm font-medium"
                  aria-label={
                    hasChildren
                      ? `Ver ${family.children.length} ${family.children.length === 1 ? "niño" : "niños"} de la familia`
                      : "Esta familia no tiene niños registrados"
                  }
                >
                  <UsersIcon className="size-3.5" />
                  {childrenCountLabel}
                </Button>
              </HoverCardTrigger>
              {hasChildren && (
                <HoverCardContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="max-w-xs p-2"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {family.children.map((child) => (
                      <ChildChip key={child.id} child={child} />
                    ))}
                  </div>
                </HoverCardContent>
              )}
            </HoverCard>
          </div>

          {/* Acciones / recursos: botones grandes y clickeables */}
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
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    <Icon className="size-3.5" />
                    {link.label}
                    <ExternalLinkIcon className="size-3 opacity-60" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Estado vacío: sin niños y sin recursos */}
          {quickLinks.length === 0 && family.children.length === 0 && (
            <p className="text-xs italic text-muted-foreground">
              Sin recursos vinculados
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface ChildChipProps {
  child: ChildSummary;
}

function ChildChip({ child }: ChildChipProps) {
  const firstName = getFirstName(child.name);
  const childPhotoUrl = convertGoogleDriveImageUrl(child.photo_url);
  const hasChildPhoto = Boolean(childPhotoUrl);

  return (
    <div
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 pl-0.5 pr-2.5 transition-colors hover:bg-foreground/10",
      )}
      title={child.name}
    >
      <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/45 to-primary/15">
        {hasChildPhoto ? (
          // biome-ignore lint/performance/noImgElement: misma razón que la foto principal (URLs de Google Drive).
          <img
            src={childPhotoUrl ?? ""}
            alt={firstName}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-[10px] font-bold text-primary/90">
            {getFirstInitial(child.name) || "?"}
          </span>
        )}
      </div>
      <span className="max-w-[90px] truncate text-sm font-medium text-popover-foreground">
        {firstName || "—"}
      </span>
    </div>
  );
}
