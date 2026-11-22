import type { Metadata } from "next";
import { PasswordForm } from "@/components/account/password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { verifySession } from "@/lib/auth-utils";
import { sql } from "@/lib/sql";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Mi perfil · AVNES" };

export default async function ProfilePage() {
  const { user } = await verifySession();
  const mentor =
    user.role === "mentor"
      ? await sql.query<{ name: string }>(
          "SELECT name FROM mentors WHERE user_id = $1",
          [user.id],
        )
      : null;

  return (
    <>
      <header className="flex min-h-20 items-center gap-3 border-b py-4">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <h1 className="text-xl font-semibold tracking-tight">Mi perfil</h1>
      </header>

      <div className="grid items-start gap-5 py-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Datos personales</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              name={user.name}
              email={user.email}
              photo={user.image ?? ""}
              phone={user.phone ?? ""}
            />
            {mentor && (
              <dl className="mt-6 space-y-1.5 border-t pt-5 text-sm">
                <dt className="font-medium">Mentora vinculada</dt>
                <dd className="break-words">
                  {mentor.rows[0]?.name ?? "Sin asignar"}
                </dd>
                <dd className="text-muted-foreground">
                  La administración gestiona esta asignación.
                </dd>
              </dl>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cambiar contraseña</CardTitle>
            <CardDescription>
              Al guardar, se cerrará tu sesión en los demás dispositivos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
