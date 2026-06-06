import { verifySession } from "@/lib/auth-utils";
import { HomeHeader } from "./_components/home-header";
import { HomeKpiCards } from "./_components/home-kpi-cards";

export default async function Home() {
  const session = await verifySession();
  const firstName = session.user.name?.split(" ")[0] ?? "";

  return (
    <>
      <HomeHeader />

      <div className="py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-balance">
            {firstName ? `Hola, ${firstName}` : "Bienvenido"}
          </h1>
          <p className="text-muted-foreground text-pretty">
            Aquí tienes un resumen general del programa.
          </p>
        </div>

        <HomeKpiCards />
      </div>
    </>
  );
}
