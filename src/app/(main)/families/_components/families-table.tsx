import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFamilies } from "@/services/families/get-families";
import { FamilyActions } from "./family-actions";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export async function FamiliesTable() {
  const families = await getFamilies();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Código Penpal</TableHead>
            <TableHead>Niños Asociados</TableHead>
            <TableHead>Biografía</TableHead>
            <TableHead>Foto Familiar</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {families.map((family) => (
            <TableRow key={family.id}>
              <TableCell>
                <Badge variant="outline" className="font-mono text-base">
                  {family.penpal_code}
                </Badge>
              </TableCell>
              <TableCell>
                {family.children_count > 0 ? (
                  <div>
                    <span className="font-medium">{family.children_count}</span>
                    <span className="text-muted-foreground ml-1">
                      {family.children_count === 1 ? "niño" : "niños"}
                    </span>
                    {family.children_names && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {family.children_names}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Sin niños</span>
                )}
              </TableCell>
              <TableCell>
                {family.family_biography_url ? (
                  <Link
                    href={family.family_biography_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Ver biografía
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {family.family_photo_url ? (
                  <Link
                    href={family.family_photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Ver foto
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <FamilyActions family={family} />
              </TableCell>
            </TableRow>
          ))}

          {families.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No hay familias registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
