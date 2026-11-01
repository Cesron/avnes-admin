import { HeaderSkeleton, KpisSkeleton } from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <div className="py-6">
        <div className="space-y-6">
          <Skeleton className="h-16 max-w-lg" />
          <KpisSkeleton />
        </div>
      </div>
    </>
  );
}
