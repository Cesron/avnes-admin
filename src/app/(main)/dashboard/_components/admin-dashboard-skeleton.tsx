import { Skeleton } from "@/components/ui/skeleton";
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-7">
      <output className="sr-only">Cargando informe…</output>
      <div aria-hidden="true" className="space-y-7">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid gap-6 border-y py-5 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-4 w-44 max-w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}
