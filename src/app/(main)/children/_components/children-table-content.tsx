"use client";

import type { ChildWithFamily } from "@/services/children/get-children";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import { getGenderLabel } from "@/utils/get-gender-label";
import { calculateAge } from "@/utils/calculate-age";
import { ChildActions } from "./child-actions";
import { ExternalLinkIcon } from "lucide-react";

function UrlLink({ url, label }: { url: string | null; label: string }) {
  if (!url) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {label}
      <ExternalLinkIcon className="size-3" />
    </a>
  );
}

interface ChildrenTableContentProps {
  children: ChildWithFamily[];
}

export function ChildrenTableContent({ children }: ChildrenTableContentProps) {
  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Género</TableHead>
            <TableHead>Fecha de nacimiento</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Panfleto</TableHead>
            <TableHead>Biografía</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((child) => {
            const age = calculateAge(child.birth_date);
            return (
              <TableRow key={child.id}>
                <TableCell>{child.penpal_code ?? "—"}</TableCell>
                <TableCell>
                  <div className="font-medium">{child.name}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      child.gender === "M" ? "blue-subtle" : "purple-subtle"
                    }
                  >
                    {getGenderLabel(child.gender)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(child.birth_date)}</TableCell>
                <TableCell>{age} años</TableCell>
                <TableCell>
                  <UrlLink url={child.pamphlet_url} label="Panfleto" />
                </TableCell>
                <TableCell>
                  <UrlLink url={child.family_biography_url} label="Biografía" />
                </TableCell>
                <TableCell>
                  <UrlLink url={child.family_photo_url} label="Foto" />
                </TableCell>
                <TableCell>
                  <ChildActions child={child} />
                </TableCell>
              </TableRow>
            );
          })}

          {children.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-muted-foreground"
              >
                No hay niños registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
