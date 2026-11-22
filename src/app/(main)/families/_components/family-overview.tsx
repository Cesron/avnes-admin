import { FileTextIcon, ImageIcon } from "lucide-react";
import { PhotoPreview } from "@/components/record-photo";
import { Button } from "@/components/ui/button";
import type { Family } from "@/types/family";
import { convertGoogleDriveImageUrl } from "@/utils/family-helpers";

export function FamilyOverview({
  family,
  familyName,
  historyHeading: HistoryHeading = "h2",
}: {
  family: Pick<Family, "history" | "family_photo_url" | "family_biography_url">;
  familyName: string;
  historyHeading?: "h2" | "h3";
}) {
  const photoUrl = convertGoogleDriveImageUrl(family.family_photo_url);

  return (
    <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
        {photoUrl ? (
          <PhotoPreview
            src={photoUrl}
            title={`Foto de ${familyName}`}
            label={`Ampliar foto de ${familyName}`}
            sizes="(min-width: 1024px) 40vw, 100vw"
            eager
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <ImageIcon aria-hidden="true" className="size-7" />
            Sin foto familiar
          </div>
        )}
      </div>

      <section
        aria-labelledby="family-history"
        className="space-y-4 rounded-xl border bg-card p-5 sm:p-6"
      >
        <HistoryHeading id="family-history" className="text-lg font-semibold">
          Historia
        </HistoryHeading>
        {family.history ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere">
            {family.history}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin historia registrada
          </p>
        )}
        {family.family_biography_url && (
          <Button asChild variant="outline" className="min-h-11">
            <a
              href={family.family_biography_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileTextIcon aria-hidden="true" />
              Abrir biografía
              <span className="sr-only"> (en otra pestaña)</span>
            </a>
          </Button>
        )}
      </section>
    </div>
  );
}
