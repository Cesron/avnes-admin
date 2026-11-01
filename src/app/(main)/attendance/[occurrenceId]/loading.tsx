import {
  AttendanceListSkeleton,
  OccurrenceHeaderSkeleton,
} from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <>
      <OccurrenceHeaderSkeleton />
      <div className="py-6">
        <AttendanceListSkeleton />
      </div>
    </>
  );
}
