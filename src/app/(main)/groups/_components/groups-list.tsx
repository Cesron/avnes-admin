import { UsersRoundIcon } from "lucide-react";
import { getGroups } from "@/services/groups/get-groups";
import { GroupCard } from "./group-card";

export async function GroupsList() {
  const groups = await getGroups();

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30 my-4">
        <UsersRoundIcon className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-medium text-muted-foreground">
          No hay grupos registrados
        </h3>
        <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
          Comienza agregando un nuevo grupo usando el botón &ldquo;Agregar
          Grupo&rdquo; en la parte superior.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between px-1 py-3">
        <p className="text-xs text-muted-foreground">
          {groups.length} {groups.length === 1 ? "grupo" : "grupos"}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </>
  );
}
