"use client";

import { ExternalLinkIcon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ResourceLink = {
  key: string;
  label: string;
  icon: LucideIcon;
  url: string | null;
};

export function ResourceLinks({
  links,
  owner,
}: {
  links: ResourceLink[];
  owner: string;
}) {
  const available = links.filter((link) => Boolean(link.url));
  if (!available.length)
    return (
      <p className="py-3 text-sm text-muted-foreground">
        Sin recursos vinculados
      </p>
    );
  return (
    <fieldset
      className="flex flex-wrap gap-2"
      aria-label={`Recursos de ${owner}`}
    >
      {available.map(({ key, label, icon: Icon, url }) => (
        <Button
          key={key}
          asChild
          variant="secondary"
          className="h-11 min-h-11 w-36 gap-2 px-3 has-[>svg]:px-3"
        >
          <a
            href={url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} de ${owner} (abre en otra pestaña)`}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
            <ExternalLinkIcon aria-hidden="true" className="size-3" />
          </a>
        </Button>
      ))}
    </fieldset>
  );
}
