import { HeaderSkeleton, LoadingRegion } from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <LoadingRegion className="space-y-6 py-6">
        <Skeleton className="h-16 w-2/3 max-w-sm" />
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </LoadingRegion>
    </>
  );
}
