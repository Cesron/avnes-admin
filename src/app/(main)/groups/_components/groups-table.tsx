import { getGroups } from "@/services/groups/get-groups";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GroupActions } from "./group-actions";

function getClubBadgeVariant(clubName: string) {
  if (clubName === "Jouse") return "blue-subtle";
  if (clubName === "Samuel") return "green-subtle";
  if (clubName === "Moises Parvulos") return "purple-subtle";
  if (clubName === "Moises Maternal") return "pink-subtle";

  return "blue-subtle";
}

export async function GroupsTable() {
  const groups = await getGroups();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Grupo</TableHead>
            <TableHead>Mentora</TableHead>
            <TableHead>Club</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>
                <div className="font-medium">{group.name}</div>
              </TableCell>
              <TableCell>{group.mentor_name}</TableCell>
              <TableCell>
                <Badge variant={getClubBadgeVariant(group.club_name)}>
                  {group.club_name}
                </Badge>
              </TableCell>
              <TableCell>
                <GroupActions group={group} />
              </TableCell>
            </TableRow>
          ))}

          {groups.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No hay grupos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
