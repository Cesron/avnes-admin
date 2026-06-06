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
  const mentors = userInfo.role === "mentor" ? [] : await getMentors();

  return (
    <EditMentorProvider>
      <MentorsHeader />

      <div className="py-6">
        <MentorsCardsGrid mentors={mentors} />
      </div>

      <EditMentorForm />
    </EditMentorProvider>
  );
}
