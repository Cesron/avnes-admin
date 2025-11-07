import { verifySession } from "@/lib/auth-utils";
import { MentorsHeader } from "./_components/mentors-header";
import { MentorsTable } from "./_components/mentors-table";

export default async function MentorsPage() {
  await verifySession();

  return (
    <>
      <MentorsHeader />

      <MentorsTable />
    </>
  );
}
