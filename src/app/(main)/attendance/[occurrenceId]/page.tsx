import { notFound, redirect } from "next/navigation";
import { getSessionUserInfo } from "@/lib/auth-utils";
import { getChildrenForAttendance } from "@/services/attendance/get-children-for-attendance";
import { getOccurrenceDetail } from "@/services/attendance/get-occurrence-detail";
import { AttendanceList } from "./_components/attendance-list";
import { OccurrenceHeader } from "./_components/occurrence-header";

interface OccurrencePageProps {
  params: Promise<{
    occurrenceId: string;
  }>;
}

export default async function OccurrencePage({ params }: OccurrencePageProps) {
  const userInfo = await getSessionUserInfo();
  const { occurrenceId } = await params;

  const occurrence = await getOccurrenceDetail(occurrenceId);

  if (!occurrence) {
    notFound();
  }

  // Mentors can only see occurrences whose activity includes at least one of
  // their assigned groups. If none of the activity's groups belong to the
  // mentor, we send them back to the main attendance page.
  const mentorGroupIds =
    userInfo.role === "mentor" ? userInfo.groupIds : undefined;

  if (mentorGroupIds !== undefined) {
    const occurrenceGroupIds = occurrence.groups.map((g) => g.id);
    const hasAccess = occurrenceGroupIds.some((id) =>
      mentorGroupIds.includes(id),
    );
    if (!hasAccess) {
      redirect("/attendance");
    }
  }

  const [children, visibleGroups] = await Promise.all([
    getChildrenForAttendance(occurrenceId, mentorGroupIds),
    Promise.resolve(
      mentorGroupIds
        ? occurrence.groups.filter((g) => mentorGroupIds.includes(g.id))
        : occurrence.groups,
    ),
  ]);

  // Derive the unique clubs of the activity from its groups. For mentors, we
  // derive from the (already filtered) `visibleGroups` so the dropdowns only
  // show clubs the mentor is allowed to see.
  const clubsMap = new Map<string, { id: string; name: string }>();
  for (const group of visibleGroups) {
    if (!clubsMap.has(group.club_id)) {
      clubsMap.set(group.club_id, { id: group.club_id, name: group.club_name });
    }
  }
  const visibleClubs = Array.from(clubsMap.values());

  return (
    <>
      <OccurrenceHeader
        occurrence={occurrence}
        mentorGroupIds={mentorGroupIds}
      />

      <div className="py-6">
        <AttendanceList
          initialChildren={children}
          occurrenceId={occurrenceId}
          groups={visibleGroups}
          clubs={visibleClubs}
        />
      </div>
    </>
  );
}
