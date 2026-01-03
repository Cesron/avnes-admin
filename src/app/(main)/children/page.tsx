import { verifySession } from "@/lib/auth-utils";
import { getFamiliesOptions } from "@/services/families/get-families-options";
import { ChildrenHeader } from "./_components/children-header";
import { ChildrenTable } from "./_components/children-table";
import { EditChildProvider } from "./_context/edit-child-context";
import { EditChildForm } from "./_components/edit-child-form";

export default async function ChildrenPage() {
  await verifySession();

  const familiesOptions = await getFamiliesOptions();

  return (
    <EditChildProvider>
      <ChildrenHeader familiesOptions={familiesOptions} />

      <ChildrenTable />

      <EditChildForm familiesOptions={familiesOptions} />
    </EditChildProvider>
  );
}
