import {
  AttendanceSkeleton,
  HeaderSkeleton,
} from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <div className="py-6">
        <AttendanceSkeleton />
      </div>
    </>
  );
}
