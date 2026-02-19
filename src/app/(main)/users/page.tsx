import { verifySession } from "@/lib/auth-utils";
import { getAvailableMentorsOptions } from "@/services/mentors/get-available-mentors-options";
import { UsersHeader } from "./_components/users-header";
import { UsersTable } from "./_components/users-table";

export default async function UsersPage() {
  await verifySession();

  const mentorsOptions = await getAvailableMentorsOptions();

  return (
    <>
      <UsersHeader mentorsOptions={mentorsOptions} />

      <UsersTable />
    </>
  );
}
