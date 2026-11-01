import { LoadingRegion } from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <LoadingRegion>
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-24 w-72 max-w-full" />
    </LoadingRegion>
  );
}
