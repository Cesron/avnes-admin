import { Suspense } from "react";
import { HeaderSkeleton, ListSkeleton } from "@/components/loading-skeletons";
import { authorize } from "@/lib/auth-utils";
import { type SearchParams, singleParam } from "@/lib/pagination";
import { getFamilies } from "@/services/families/get-families";
import { EditFamilyForm } from "./_components/edit-family-form";
import { FamiliesHeader } from "./_components/families-header";
import { FamiliesListView } from "./_components/families-list-view";
import { EditFamilyProvider } from "./_context/edit-family-context";

export default async function FamiliesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await authorize("/families");

  return (
    <EditFamilyProvider>
      <Suspense fallback={<HeaderSkeleton />}>
        <FamiliesHeader />
      </Suspense>

      <div className="py-6">
        <Suspense fallback={<ListSkeleton kind="families" />}>
          <FamilyResults searchParams={searchParams} />
        </Suspense>
      </div>

      <EditFamilyForm />
    </EditFamilyProvider>
  );
}

async function FamilyResults({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const families = await getFamilies({
    search: singleParam(query.search),
    after: singleParam(query.after),
    before: singleParam(query.before),
  });

  return <FamiliesListView initialFamilies={families} />;
}
