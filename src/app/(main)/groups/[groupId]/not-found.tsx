import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GroupNotFound() {
  return (
    <div className="my-6 space-y-4 rounded-xl border p-6">
      <h1 className="text-xl font-semibold">Grupo no encontrado</h1>
      <p className="text-sm text-muted-foreground">
        El grupo que buscas no existe o ya no está disponible.
      </p>
      <Button asChild variant="outline">
        <Link href="/groups">Volver a grupos</Link>
      </Button>
    </div>
  );
}
