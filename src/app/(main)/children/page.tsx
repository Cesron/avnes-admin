import { verifySession } from "@/lib/auth-utils";
import { ChildrenHeader } from "./_components/children-header";
import { ChildrenTable } from "./_components/children-table";

export default async function ChildrenPage() {
  await verifySession();

  return (
    <>
      <ChildrenHeader />

      <ChildrenTable />
    </>
  );
}
