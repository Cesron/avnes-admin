import { getUsers } from "@/services/users/get-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/utils/format-date";
import type { UserRole } from "@/types/user";

const ROLE_CONFIG: Record<
  string,
  { label: string; variant: "purple-subtle" | "blue-subtle" | "default" }
> = {
  admin: { label: "Administrador", variant: "purple-subtle" },
  coordinator: { label: "Coordinador", variant: "blue-subtle" },
  mentor: { label: "Mentora", variant: "default" },
};

function getRoleConfig(role: UserRole | null) {
  if (!role || !ROLE_CONFIG[role]) {
    return { label: "Sin rol", variant: "default" as const };
  }
  return ROLE_CONFIG[role];
}

export async function UsersTable() {
  const users = await getUsers();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Mentora vinculada</TableHead>
            <TableHead>Fecha de Creación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const roleConfig = getRoleConfig(user.role);

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{user.name}</div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                </TableCell>
                <TableCell>
                  {user.mentor_name ? (
                    <span>{user.mentor_name}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            );
          })}

          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
