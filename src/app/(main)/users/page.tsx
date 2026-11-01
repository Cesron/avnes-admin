import { Suspense } from "react";
import { HeaderSkeleton, ListSkeleton } from "@/components/loading-skeletons";
import { authorize } from "@/lib/auth-utils";
import { getAvailableMentorsOptions } from "@/services/mentors/get-available-mentors-options";
import { EditUserForm } from "./_components/edit-user-form";
import { UsersCardsGrid } from "./_components/users-cards-grid";
import { UsersHeader } from "./_components/users-header";
import { EditUserProvider } from "./_context/edit-user-context";

export default async function UsersPage() {
  await authorize("/users");

  return (
    <EditUserProvider>
      <Suspense fallback={<HeaderSkeleton />}>
        <UserActions />
      </Suspense>

      <div className="py-6">
        <Suspense fallback={<ListSkeleton kind="users" />}>
          <UsersCardsGrid />
        </Suspense>
      </div>
    </EditUserProvider>
  );
}

async function UserActions() {
  const mentorsOptions = await getAvailableMentorsOptions();
  return (
    <>
      <UsersHeader mentorsOptions={mentorsOptions} />
      <EditUserForm mentorsOptions={mentorsOptions} />
    </>
  );
}
