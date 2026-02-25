import { verifySession } from "@/lib/auth-utils";
import { getAvailableMentorsOptions } from "@/services/mentors/get-available-mentors-options";
import { EditUserForm } from "./_components/edit-user-form";
import { UsersHeader } from "./_components/users-header";
import { UsersTable } from "./_components/users-table";
import { EditUserProvider } from "./_context/edit-user-context";

export default async function UsersPage() {
  await verifySession();

  const mentorsOptions = await getAvailableMentorsOptions();

  return (
    <EditUserProvider>
      <UsersHeader mentorsOptions={mentorsOptions} />

      <UsersTable />

      <EditUserForm mentorsOptions={mentorsOptions} />
    </EditUserProvider>
  );
}
