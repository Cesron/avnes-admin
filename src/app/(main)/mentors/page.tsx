import { Suspense } from "react";
import { CardsSkeleton } from "@/components/loading-skeletons";
import { authorize, getSessionUserInfo } from "@/lib/auth-utils";
import { getMentors } from "@/services/mentors/get-mentors";
import { EditMentorForm } from "./_components/edit-mentor-form";
import { MentorsCardsGrid } from "./_components/mentors-cards-grid";
import { MentorsHeader } from "./_components/mentors-header";
import { EditMentorProvider } from "./_context/edit-mentor-context";

export default async function MentorsPage() {
  await authorize("/mentors");
  const userInfo = await getSessionUserInfo();

  // Las mentoras no ven la lista de otras mentoras.

  return (
    <EditMentorProvider>
      <MentorsHeader />

      <div className="py-6">
        <Suspense fallback={<CardsSkeleton kind="mentors" />}>
          <MentorResults isMentor={userInfo.role === "mentor"} />
        </Suspense>
      </div>

      <EditMentorForm />
    </EditMentorProvider>
  );
}

async function MentorResults({ isMentor }: { isMentor: boolean }) {
  return <MentorsCardsGrid mentors={isMentor ? [] : await getMentors()} />;
}
