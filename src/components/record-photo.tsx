"use client";

import Image from "next/image";
import { type ReactElement, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PhotoDialog({
  src,
  title,
  children,
}: {
  src: string;
  title: string;
  children: ReactElement;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="border-0 bg-background p-2 sm:max-w-3xl md:max-w-5xl [&_[data-slot=dialog-close]]:size-11 [&_[data-slot=dialog-close]]:bg-background [&_[data-slot=dialog-close]]:opacity-100"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative h-[80dvh] w-full">
          <RecordPhoto
            src={src}
            alt={title}
            sizes="(max-width: 767px) 100vw, 1024px"
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PhotoPreview({
  src,
  title,
  label,
  sizes,
  eager,
}: {
  src: string;
  title: string;
  label: string;
  sizes: string;
  eager?: boolean;
}) {
  // Radix needs to clone a trigger that belongs to this client boundary.
  return (
    <PhotoDialog src={src} title={title}>
      <button
        type="button"
        aria-label={label}
        className="absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <RecordPhoto
          src={src}
          alt={title}
          sizes={sizes}
          className="object-contain"
          eager={eager}
        />
      </button>
    </PhotoDialog>
  );
}

function RecordPhoto({
  src,
  alt,
  sizes,
  className,
  eager,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={`Foto no disponible: ${alt}`}
        className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-muted-foreground"
      >
        Foto no disponible
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={className}
      // Only Drive's public images go through the configured optimizer/cache.
      // Preserve other image hosts without exposing an arbitrary server proxy.
      unoptimized={
        !/^https:\/\/lh3\.googleusercontent\.com\/d\/[\w-]+$/.test(src)
      }
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
    />
  );
}
