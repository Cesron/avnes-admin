import { HeaderSkeleton, ListSkeleton } from "@/components/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <div className="space-y-7 py-6">
        <Skeleton className="h-20 w-2/3" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
        <ListSkeleton kind="children" />
      </div>
    </>
  );
}
