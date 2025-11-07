import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClubs } from "@/services/clubs/get-clubs";

export async function ClubsTable() {
  const clubs = await getClubs();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre del Club</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell className="font-medium">{club.id}</TableCell>
              <TableCell>
                <div className="font-medium text-base">{club.name}</div>
              </TableCell>
            </TableRow>
          ))}

          {clubs.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                No hay clubes registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
