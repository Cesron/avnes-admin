import { verifySession } from "@/lib/auth-utils";
import { ClubsHeader } from "./_components/clubs-header";
import { ClubsTable } from "./_components/clubs-table";

export default async function ClubsPage() {
  await verifySession();

  return (
    <>
      <ClubsHeader />

      <ClubsTable />
    </>
  );
}
