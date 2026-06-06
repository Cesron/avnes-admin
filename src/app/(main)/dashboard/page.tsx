import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getSessionUserInfo, verifySession } from "@/lib/auth-utils";
import { AdminDashboard } from "./_components/admin-dashboard";
import { DashboardHeader } from "./_components/dashboard-header";
import { MentorDashboard } from "./_components/mentor-dashboard";

export default async function DashboardPage() {
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
    : `Resumen general • ${todayLabel}`;

  return (
    <>
      <DashboardHeader userName={firstName} subtitle={subtitle} />

      <div className="py-6">
        {isMentor ? (
          <MentorDashboard groupIds={userInfo.groupIds} />
        ) : (
          <AdminDashboard />
        )}
      </div>
    </>
  );
}
