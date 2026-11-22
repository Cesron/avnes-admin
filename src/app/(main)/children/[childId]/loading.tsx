import { HeaderSkeleton, LoadingRegion } from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <LoadingRegion className="space-y-6 py-6">
        <Skeleton className="h-72 rounded-xl sm:h-64" />
        <Skeleton className="h-44 rounded-xl" />
      </LoadingRegion>
    </>
  );
}
