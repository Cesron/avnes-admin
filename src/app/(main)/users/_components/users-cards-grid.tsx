import { UsersIcon } from "lucide-react";
import { getUsers } from "@/services/users/get-users";
import { UserCard } from "./user-card";

export async function UsersCardsGrid() {
  const users = await getUsers();

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30">
        <UsersIcon className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-medium text-muted-foreground">
          No hay usuarios registrados
        </h3>
        <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
          Comienza agregando un nuevo usuario usando el botón &ldquo;Agregar
          Usuario&rdquo; en la parte superior.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
