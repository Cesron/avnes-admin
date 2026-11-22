import { ArrowRightIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { ChildRecordDetails } from "@/app/(main)/children/_components/child-record-details";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ChildRecord } from "@/services/children/child-record";
import { convertGoogleDriveImageUrl } from "@/utils/family-helpers";

export function FamilyChildCard({ child }: { child: ChildRecord }) {
  const photoUrl = convertGoogleDriveImageUrl(child.child_photo_url);

  return (
    <article
      aria-labelledby={`child-${child.id}`}
      className="grid gap-5 rounded-xl border bg-card p-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:p-6"
    >
      <Avatar className="h-48 w-full rounded-lg bg-muted sm:h-40">
        {photoUrl && (
          <AvatarImage
            src={photoUrl}
            alt={`Foto de ${child.name}`}
            className="aspect-auto object-contain"
            referrerPolicy="no-referrer"
          />
        )}
        <AvatarFallback className="flex-col gap-2 rounded-lg text-sm text-muted-foreground">
          <UserRoundIcon aria-hidden="true" className="size-7" />
          Sin foto
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 space-y-4">
        <h3
          id={`child-${child.id}`}
          className="text-lg font-semibold wrap-anywhere"
        >
          {child.name}
        </h3>
        <ChildRecordDetails
          child={child}
          actions={
            <Button asChild variant="outline" className="min-h-11">
              <Link
                href={`/children/${child.id}`}
                aria-label={`Ver perfil de ${child.name}`}
              >
                Ver perfil
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      </div>
    </article>
  );
}
