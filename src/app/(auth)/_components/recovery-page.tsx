import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function RecoveryPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo.png"
            alt="Asociación Vida Nueva en El Salvador"
            width={72}
            height={72}
            className="mb-2 rounded-full"
          />
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </header>
        {children}
        <Button asChild variant="ghost" className="w-full">
          <Link href="/login" replace>
            <ArrowLeftIcon aria-hidden="true" />
            Volver al inicio de sesión
          </Link>
        </Button>
      </div>
    </main>
  );
}
