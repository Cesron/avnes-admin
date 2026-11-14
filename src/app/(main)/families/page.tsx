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
  const { user } = await authorize("/families");
  const canCreate = user.role === "admin" || user.role === "coordinator";
  const mentorUserId = user.role === "mentor" ? user.id : undefined;

  return (
    <EditFamilyProvider>
      <Suspense fallback={<HeaderSkeleton />}>
        <FamiliesHeader canCreate={canCreate} />
      </Suspense>

      <div className="py-6">
        <Suspense fallback={<ListSkeleton kind="families" />}>
          <FamilyResults
            searchParams={searchParams}
            mentorUserId={mentorUserId}
            canCreate={canCreate}
          />
        </Suspense>
      </div>

      <EditFamilyForm canEditPenpalCode={canCreate} />
    </EditFamilyProvider>
  );
}

async function FamilyResults({
  searchParams,
  mentorUserId,
  canCreate,
}: {
  searchParams: Promise<SearchParams>;
  mentorUserId?: string;
  canCreate: boolean;
}) {
  const query = await searchParams;
  const families = await getFamilies({
    mentorUserId,
    search: singleParam(query.search),
    after: singleParam(query.after),
    before: singleParam(query.before),
  });

  return <FamiliesListView initialFamilies={families} canCreate={canCreate} />;
}
