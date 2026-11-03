"use client";

import {
  ChevronDownIcon,
  FileTextIcon,
  ImageIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import { EditButton } from "@/components/edit-button";
import { ResourceLinks } from "@/components/resource-links";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FamilyWithChildren } from "@/services/families/get-families";
import {
  convertGoogleDriveImageUrl,
  extractSurnames,
  getSurnameInitials,
} from "@/utils/family-helpers";
import { useEditFamily } from "../_context/edit-family-context";
import { FamilyPhoto } from "./family-photo";

export function FamilyCard({ family }: { family: FamilyWithChildren }) {
  const { openEditDialog } = useEditFamily();
  const headingId = useId();
  const photoUrl = convertGoogleDriveImageUrl(family.family_photo_url);
  const surnames = extractSurnames(family.first_child_name);
  const familyName = surnames
    ? `Familia ${surnames}`
    : `Familia ${family.penpal_code}`;
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
  ];

  return (
    <article aria-labelledby={headingId} className="h-full min-w-0">
      <Card className="h-full gap-0 overflow-hidden p-0 shadow-none">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted sm:aspect-[4/3]">
          {photoUrl ? (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={`Ver foto de la familia ${family.penpal_code} en grande`}
                  className="absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  <FamilyPhoto
                    src={photoUrl}
                    alt={familyName}
                    className="object-contain"
                    sizes="(min-width: 1280px) calc((100vw - 352px) / 2), (min-width: 768px) calc(100vw - 320px), calc(100vw - 32px)"
                  />
                </button>
              </DialogTrigger>
              <DialogContent
                aria-describedby={undefined}
                className="border-0 bg-background p-2 sm:max-w-3xl md:max-w-5xl [&_[data-slot=dialog-close]]:size-11 [&_[data-slot=dialog-close]]:bg-background [&_[data-slot=dialog-close]]:opacity-100"
              >
                <DialogTitle className="sr-only">
                  Foto de {familyName}
                </DialogTitle>
                <div className="relative h-[80vh] w-full">
                  <FamilyPhoto
                    src={photoUrl}
                    alt={familyName}
                    sizes="(max-width: 767px) 100vw, 1024px"
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex h-full items-center justify-center text-5xl font-semibold text-muted-foreground">
              {getSurnameInitials(surnames) || "?"}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <h2
                id={headingId}
                className="text-lg font-semibold leading-snug break-words"
              >
                {familyName}
              </h2>
              <p className="text-sm text-muted-foreground">
                Código familiar{" "}
                <span className="font-medium tabular-nums text-foreground break-all">
                  {family.penpal_code}
                </span>
              </p>
            </div>
            <EditButton
              className="-mr-2 shrink-0 size-11"
              aria-label={`Editar familia ${family.penpal_code}`}
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
            />
          </div>
          {family.children.length ? (
            <details className="group/children">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                <UsersIcon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                <span className="tabular-nums">
                  {family.children.length}{" "}
                  {family.children.length === 1
                    ? "niño registrado"
                    : "niños registrados"}
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="ml-auto size-4 text-muted-foreground group-open/children:rotate-180"
                />
              </summary>
              <ul className="mt-1 space-y-1 border-l ml-5 pl-3">
                {family.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/children/${child.id}/attendance`}
                      className="flex min-h-11 items-center rounded-md px-2 py-2 text-sm break-words hover:bg-accent hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                      aria-label={`Historial de asistencia de ${child.name}`}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <p className="py-3 text-sm text-muted-foreground">
              Sin niños registrados
            </p>
          )}
          <div className="mt-auto border-t pt-4">
            <ResourceLinks links={quickLinks} owner={familyName} />
          </div>
        </div>
      </Card>
    </article>
  );
}
