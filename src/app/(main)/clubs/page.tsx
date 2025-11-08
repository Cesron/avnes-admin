import { verifySession } from "@/lib/auth-utils";
import { ClubsHeader } from "./_components/clubs-header";
import { ClubsTable } from "./_components/clubs-table";
import { EditClubProvider } from "./_context/edit-club-context";
import { EditClubForm } from "./_components/edit-club-form";

export default async function ClubsPage() {
  await verifySession();

  return (
    <EditClubProvider>
      <ClubsHeader />

      <ClubsTable />

      <EditClubForm />
    </EditClubProvider>
  );
}
