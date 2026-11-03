import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/loading-skeletons";
import { getSessionUserInfo, verifySession } from "@/lib/auth-utils";
import { type SearchParams, singleParam } from "@/lib/pagination";
import { AdminDashboard } from "./_components/admin-dashboard";
import { AdminDashboardSkeleton } from "./_components/admin-dashboard-skeleton";
import { DashboardHeader } from "./_components/dashboard-header";
import { MentorDashboard } from "./_components/mentor-dashboard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const [session, userInfo] = await Promise.all([
    verifySession(),
    getSessionUserInfo(),
  ]);

  const userName = session.user.name ?? "";
  const firstName = userName.split(" ")[0] || userName;

  const todayLabel = format(new Date(), "EEEE d 'de' MMMM, yyyy", {
    locale: es,
  });

  const isMentor = userInfo.role === "mentor";
  const subtitle = isMentor
    ? userInfo.groupIds.length === 0
      ? "No tienes grupos asignados"
      : `Tus grupos • ${todayLabel}`
    : "Supervisión de clubes y grupos";

  return (
    <>
      <DashboardHeader userName={firstName} subtitle={subtitle} />

      <div className="py-6">
        {isMentor ? (
          <Suspense fallback={<DashboardSkeleton mentor />}>
            <MentorDashboard groupIds={userInfo.groupIds} />
          </Suspense>
        ) : userInfo.role === "admin" || userInfo.role === "coordinator" ? (
          <Suspense
            key={JSON.stringify(query)}
            fallback={<AdminDashboardSkeleton />}
          >
            <AdminDashboard
              weekInput={singleParam(query.week)}
              monthInput={singleParam(query.month)}
              viewInput={singleParam(query.view)}
              clubInput={singleParam(query.club)}
            />
          </Suspense>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tu cuenta no tiene un rol habilitado para consultar este dashboard.
          </p>
        )}
      </div>
    </>
  );
}
