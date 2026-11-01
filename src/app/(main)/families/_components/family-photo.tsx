"use client";

import Image from "next/image";
import { useState } from "react";

export function FamilyPhoto({
  src,
  alt,
  sizes,
  className,
  compact = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  compact?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={`Foto no disponible: ${alt}`}
        className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-muted-foreground"
      >
        {compact ? "?" : "Foto no disponible"}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
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
