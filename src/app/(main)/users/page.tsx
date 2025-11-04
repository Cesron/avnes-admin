import { verifySession } from "@/lib/auth-utils";
import { UsersHeader } from "./_components/users-header";
import { UsersTable } from "./_components/users-table";

export default async function UsersPage() {
  await verifySession();

  return (
    <>
      <UsersHeader />

      <UsersTable />
    </>
  );
}
