import { LoadingRegion } from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <LoadingRegion className="w-full max-w-sm">
        <Skeleton className="h-28" />
        <Skeleton className="mt-6 h-64" />
      </LoadingRegion>
    </div>
  );
}
