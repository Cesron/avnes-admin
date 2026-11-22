import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PasswordForm } from "@/components/account/password-form";
import { Button } from "@/components/ui/button";
import { RecoveryPage } from "../_components/recovery-page";

export const metadata: Metadata = {
  title: "Restablecer contraseña · AVNES",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

type ResetSearchParams = Promise<{
  token?: string | string[];
  error?: string | string[];
}>;

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: ResetSearchParams;
}) {
  return (
    <Suspense fallback={<RecoveryPage title="Restablecer contraseña" />}>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordContent({
  searchParams,
}: {
  searchParams: ResetSearchParams;
}) {
  const { token, error } = await searchParams;

  if (error || typeof token !== "string" || !token) {
    return (
      <RecoveryPage
        title="Enlace no válido"
        description="El enlace de recuperación venció o ya se usó. Solicita uno nuevo para continuar."
      >
        <Button asChild className="w-full">
          <Link href="/forgot-password" replace>
            Solicitar otro enlace
          </Link>
        </Button>
      </RecoveryPage>
    );
  }

  return (
    <RecoveryPage
      title="Restablecer contraseña"
      description="Elige una nueva contraseña para tu cuenta de AVNES."
    >
      <PasswordForm token={token} />
    </RecoveryPage>
  );
}
