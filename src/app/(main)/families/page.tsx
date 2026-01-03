import { verifySession } from "@/lib/auth-utils";
import { FamiliesHeader } from "./_components/families-header";
import { FamiliesTable } from "./_components/families-table";
import { EditFamilyProvider } from "./_context/edit-family-context";
import { EditFamilyForm } from "./_components/edit-family-form";

export default async function FamiliesPage() {
  await verifySession();

  return (
    <EditFamilyProvider>
      <FamiliesHeader />

      <FamiliesTable />

      <EditFamilyForm />
    </EditFamilyProvider>
  );
}
