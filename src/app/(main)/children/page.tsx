import { verifySession } from "@/lib/auth-utils";
import { ChildrenHeader } from "./_components/children-header";
import { ChildrenTable } from "./_components/children-table";
import { EditChildProvider } from "./_context/edit-child-context";
import { EditChildForm } from "./_components/edit-child-form";

export default async function ChildrenPage() {
  await verifySession();

  return (
    <EditChildProvider>
      <ChildrenHeader />

      <ChildrenTable />

      <EditChildForm />
    </EditChildProvider>
  );
}
