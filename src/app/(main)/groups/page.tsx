import { verifySession } from "@/lib/auth-utils";
import { GroupsHeader } from "./_components/groups-header";
import { GroupsTable } from "./_components/groups-table";

export default async function GroupsPage() {
  await verifySession();

  return (
    <>
      <GroupsHeader />

      <GroupsTable />
    </>
  );
}
