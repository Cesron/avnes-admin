import { authorize } from "@/lib/auth-utils";
import { getAvailableMentorsOptions } from "@/services/mentors/get-available-mentors-options";
import { EditUserForm } from "./_components/edit-user-form";
import { UsersCardsGrid } from "./_components/users-cards-grid";
import { UsersHeader } from "./_components/users-header";
import { EditUserProvider } from "./_context/edit-user-context";

export default async function UsersPage() {
  await authorize("/users");

  const mentorsOptions = await getAvailableMentorsOptions();

  return (
    <EditUserProvider>
      <UsersHeader mentorsOptions={mentorsOptions} />

      <div className="py-6">
        <UsersCardsGrid />
      </div>

      <EditUserForm mentorsOptions={mentorsOptions} />
    </EditUserProvider>
  );
}
