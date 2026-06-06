import { UsersIcon } from "lucide-react";
import type { Mentor } from "@/types/mentor";
import { MentorCard } from "./mentor-card";

interface MentorsCardsGridProps {
  mentors: Mentor[];
}

export function MentorsCardsGrid({ mentors }: MentorsCardsGridProps) {
  if (mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30">
        <UsersIcon className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-medium text-muted-foreground">
          No hay mentoras registradas
        </h3>
        <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
          Comienza agregando una nueva mentora usando el botón &ldquo;Agregar
          Mentora&rdquo; en la parte superior.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  );
}
