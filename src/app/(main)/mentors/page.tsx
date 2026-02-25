import { authorize } from "@/lib/auth-utils";
import { MentorsHeader } from "./_components/mentors-header";
import { MentorsTable } from "./_components/mentors-table";
import { EditMentorProvider } from "./_context/edit-mentor-context";
import { EditMentorForm } from "./_components/edit-mentor-form";

export default async function MentorsPage() {
  await authorize("/mentors");

  return (
    <EditMentorProvider>
      <MentorsHeader />

      <MentorsTable />

      <EditMentorForm />
    </EditMentorProvider>
  );
}
