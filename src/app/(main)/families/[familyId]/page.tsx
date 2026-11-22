import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authorize } from "@/lib/auth-utils";
import { getFamilyDetail } from "@/services/families/get-family-detail";
import type { UserRole } from "@/types/user";
import { extractSurnames } from "@/utils/family-helpers";
import { FamilyOverview } from "../_components/family-overview";
import { FamilyChildCard } from "./_components/family-child-card";

export default async function FamilyDetailPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { user } = await authorize("/families");
  const { familyId } = await params;
  const family = await getFamilyDetail(familyId, {
    userId: user.id,
    role: user.role as UserRole | null,
  });
  if (!family) notFound();

  const surnames = extractSurnames(family.children[0]?.name);
  const familyName = `Familia ${surnames || family.penpal_code}`;

  return (
    <>
      <header className="flex min-h-20 items-center gap-2 border-b py-4">
        <SidebarTrigger className="-ms-1" />
        <Button asChild variant="ghost" className="min-h-11">
          <Link href="/families">
            <ArrowLeftIcon aria-hidden="true" />
            Volver a familias
          </Link>
        </Button>
      </header>

      <div className="space-y-8 py-6 sm:py-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight wrap-anywhere sm:text-3xl">
            {familyName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Código Penpal{" "}
            <span className="font-medium tabular-nums text-foreground">
              {family.penpal_code}
            </span>
          </p>
        </div>

        <FamilyOverview family={family} familyName={familyName} />

        <section aria-labelledby="family-children" className="space-y-4">
          <h2 id="family-children" className="text-lg font-semibold">
            Niños de la familia
          </h2>
          {family.children.length ? (
            <ul className="grid gap-4">
              {family.children.map((child) => (
                <li key={child.id} className="min-w-0">
                  <FamilyChildCard child={child} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              Esta familia aún no tiene niños registrados.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
