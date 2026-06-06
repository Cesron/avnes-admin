import { authorize } from "@/lib/auth-utils";
import { getFamilies } from "@/services/families/get-families";
import { EditFamilyForm } from "./_components/edit-family-form";
import { FamiliesHeader } from "./_components/families-header";
import { FamiliesListView } from "./_components/families-list-view";
import { EditFamilyProvider } from "./_context/edit-family-context";

export default async function FamiliesPage() {
  await authorize("/families");

  const families = await getFamilies();

  return (
    <EditFamilyProvider>
      <FamiliesHeader />

      <div className="py-6">
        <FamiliesListView initialFamilies={families} />
      </div>

      <EditFamilyForm />
    </EditFamilyProvider>
  );
}
