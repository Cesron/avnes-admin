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

export async function ChildrenTable() {
  const children = await getChildren();

  const calculateAge = (birthDate: Date | null): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

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
            <TableHead>Estado</TableHead>
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
                  {child.gender ? (
                    <Badge
                      variant={
                        child.gender.toLowerCase() === "masculino" ||
                        child.gender.toLowerCase() === "m"
                          ? "blue-subtle"
                          : "purple-subtle"
                      }
                    >
                      {child.gender}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No registrado</span>
                  )}
                </TableCell>
                <TableCell>
                  {child.birth_date ? (
                    formatDate(child.birth_date)
                  ) : (
                    <span className="text-muted-foreground">No registrado</span>
                  )}
                </TableCell>
                <TableCell>
                  {age !== null ? (
                    `${age} años`
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="green-subtle">Activo</Badge>
                </TableCell>
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
