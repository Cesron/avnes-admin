import { getChildren } from "@/services/children/get-children";
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

export async function ChildrenTable() {
  const children = await getChildren();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Género</TableHead>
            <TableHead>Fecha de Nacimiento</TableHead>
            <TableHead>Edad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((child) => {
            const age = calculateAge(child.birth_date);
            return (
              <TableRow key={child.id}>
                <TableCell>
                  <div className="font-medium">{child.first_name}</div>
                </TableCell>
                <TableCell>{child.last_name}</TableCell>
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
              </TableRow>
            );
          })}

          {children.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
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
