import { UsersIcon } from "lucide-react";
import { getClubs } from "@/services/clubs/get-clubs";
import { ClubCard } from "./club-card";

export async function ClubsList() {
  const clubs = await getClubs();

  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30 my-4">
        <UsersIcon className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-medium text-muted-foreground">
          No hay clubes registrados
        </h3>
        <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
          Comienza agregando un nuevo club usando el botón &ldquo;Agregar
          Club&rdquo; en la parte superior.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between px-1 py-3">
        <p className="text-xs text-muted-foreground">
          {clubs.length} {clubs.length === 1 ? "club" : "clubes"}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </>
  );
}
