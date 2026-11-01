import { Suspense } from "react";
import { ListSkeleton } from "@/components/loading-skeletons";
import { authorize } from "@/lib/auth-utils";
import { ClubsHeader } from "./_components/clubs-header";
import { ClubsList } from "./_components/clubs-list";
import { EditClubForm } from "./_components/edit-club-form";
import { EditClubProvider } from "./_context/edit-club-context";

export default async function ClubsPage() {
  await authorize("/clubs");

  return (
    <EditClubProvider>
      <ClubsHeader />

      <div className="py-6">
        <Suspense fallback={<ListSkeleton kind="clubs" />}>
          <ClubsList />
        </Suspense>
      </div>

      <EditClubForm />
    </EditClubProvider>
  );
}
