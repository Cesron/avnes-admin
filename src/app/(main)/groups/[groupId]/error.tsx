"use client";

import { Button } from "@/components/ui/button";

export default function GroupError({ reset }: { reset: () => void }) {
  return (
    <div className="my-6 space-y-4 rounded-xl border p-6" role="alert">
      <h2 className="text-lg font-semibold">No pudimos cargar el grupo</h2>
      <p className="text-sm text-muted-foreground">
        Intenta nuevamente para consultar los niños y la asistencia de este
        grupo.
      </p>
      <Button variant="outline" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
