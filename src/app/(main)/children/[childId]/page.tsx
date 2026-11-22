import { ArrowLeftIcon, ArrowRightIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FamilyOverview } from "@/app/(main)/families/_components/family-overview";
import { PhotoPreview } from "@/components/record-photo";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authorize } from "@/lib/auth-utils";
import { getChildProfile } from "@/services/children/get-child-profile";
import type { UserRole } from "@/types/user";
import { convertGoogleDriveImageUrl } from "@/utils/family-helpers";
import { ChildRecordDetails } from "../_components/child-record-details";

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { user } = await authorize("/children");
  const { childId } = await params;
  const child = await getChildProfile(childId, {
    userId: user.id,
    role: user.role as UserRole | null,
  });
  if (!child) notFound();

  const photoUrl = convertGoogleDriveImageUrl(child.child_photo_url);
  const family = child.family;

  return (
    <>
      <header className="flex min-h-20 items-center gap-2 border-b py-4">
        <SidebarTrigger className="-ms-1" />
        <Button asChild variant="ghost" className="min-h-11">
          <Link href="/children">
            <ArrowLeftIcon aria-hidden="true" />
            Volver a niños
          </Link>
        </Button>
      </header>

      <div className="space-y-8 py-6 sm:py-8">
        <section
          aria-labelledby="child-profile-name"
          className="grid items-start gap-5 rounded-xl border bg-card p-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:p-6 lg:gap-8"
        >
          <div className="relative aspect-square max-h-72 w-full overflow-hidden rounded-lg border bg-muted">
            {photoUrl ? (
              <PhotoPreview
                src={photoUrl}
                title={`Foto de ${child.name}`}
                label={`Ampliar foto de ${child.name}`}
                sizes="(min-width: 640px) 224px, 100vw"
                eager
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <UserRoundIcon aria-hidden="true" className="size-8" />
                Sin foto individual
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-5">
            <h1
              id="child-profile-name"
              className="text-2xl font-semibold tracking-tight wrap-anywhere sm:text-3xl"
            >
              {child.name}
            </h1>
            <ChildRecordDetails
              child={child}
              showPrivateDetails={child.can_view_private_details}
            />
          </div>
        </section>

        <section aria-labelledby="child-profile-family" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <h2 id="child-profile-family" className="text-lg font-semibold">
                Familia
              </h2>
              {family && (
                <p className="text-sm text-muted-foreground">
                  Código Penpal{" "}
                  <span className="font-medium tabular-nums text-foreground">
                    {family.penpal_code}
                  </span>
                </p>
              )}
            </div>
            {family && (
              <Button asChild variant="outline" className="min-h-11">
                <Link href={`/families/${family.id}`}>
                  Ver ficha familiar
                  <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
            )}
          </div>
          {family ? (
            <>
              <FamilyOverview
                family={family}
                familyName={`Familia ${family.penpal_code}`}
                historyHeading="h3"
              />
              {family.other_children.length > 0 && (
                <div className="space-y-2 rounded-xl border bg-card p-5">
                  <h3 className="text-base font-semibold">
                    Otros niños de la familia
                  </h3>
                  <ul className="divide-y">
                    {family.other_children.map((member) => (
                      <li key={member.id}>
                        <Link
                          href={`/children/${member.id}`}
                          aria-label={`Ver perfil de ${member.name}`}
                          className="flex min-h-11 items-center justify-between gap-3 rounded-md px-2 text-sm wrap-anywhere hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {member.name}
                          <ArrowRightIcon
                            aria-hidden="true"
                            className="size-4 shrink-0"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              {child.can_view_private_details
                ? "Sin familia vinculada"
                : "Información familiar no disponible"}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
