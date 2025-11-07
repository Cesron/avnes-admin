import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMentors } from "@/services/mentors/get-mentors";

export async function MentorsTable() {
  const mentors = await getMentors();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.map((mentor) => (
            <TableRow key={mentor.id}>
              <TableCell>
                <div className="font-medium">{mentor.name}</div>
              </TableCell>
              <TableCell>
                {mentor.phone ? (
                  mentor.phone
                ) : (
                  <span className="text-muted-foreground">No registrado</span>
                )}
              </TableCell>
              <TableCell>
                {mentor.email ? (
                  mentor.email
                ) : (
                  <span className="text-muted-foreground">No registrado</span>
                )}
              </TableCell>
            </TableRow>
          ))}

          {mentors.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No hay mentoras registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
