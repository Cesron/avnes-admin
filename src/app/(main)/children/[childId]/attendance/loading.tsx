import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section
      className="space-y-6 py-6"
      aria-busy="true"
      aria-label="Cargando historial de asistencia"
    >
      <Skeleton className="h-12 w-64 max-w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </section>
  );
}
