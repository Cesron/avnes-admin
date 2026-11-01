"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-4 rounded-xl border p-8 my-6" role="alert">
      <h2 className="text-lg font-semibold">No pudimos cargar el dashboard</h2>
      <p className="text-sm text-muted-foreground">
        Intenta nuevamente para consultar los datos de asistencia.
      </p>
      <Button variant="outline" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
