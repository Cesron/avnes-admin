import { verifySession } from "@/lib/auth-utils";
import { getChildrenForAttendance } from "@/services/attendance/get-children-for-attendance";
import { getOccurrenceDetail } from "@/services/attendance/get-occurrence-detail";
import { notFound } from "next/navigation";
import { AttendanceList } from "./_components/attendance-list";
import { OccurrenceHeader } from "./_components/occurrence-header";

interface OccurrencePageProps {
  params: Promise<{
    occurrenceId: string;
  }>;
}

export default async function OccurrencePage({ params }: OccurrencePageProps) {
  await verifySession();

  const { occurrenceId } = await params;

  const [occurrence, children] = await Promise.all([
    getOccurrenceDetail(occurrenceId),
    getChildrenForAttendance(occurrenceId),
  ]);

  if (!occurrence) {
    notFound();
  }

  return (
    <>
      <OccurrenceHeader occurrence={occurrence} />

      <div className="py-6">
        <AttendanceList
          initialChildren={children}
          occurrenceId={occurrenceId}
        />
      </div>
    </>
  );
}
