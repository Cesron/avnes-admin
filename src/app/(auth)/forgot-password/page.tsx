import type { Metadata } from "next";
import { connection } from "next/server";
import { isPasswordResetEmailConfigured } from "@/lib/resend";
import { RecoveryPage } from "../_components/recovery-page";
import { RequestResetForm } from "./request-reset-form";

export const metadata: Metadata = { title: "Recuperar contraseña · AVNES" };

export default async function ForgotPasswordPage() {
  await connection();
  const configured = isPasswordResetEmailConfigured();

  return (
    <RecoveryPage
      title="Recuperar contraseña"
      description={
        configured
          ? "Ingresa el correo de tu cuenta para recibir un enlace de recuperación."
          : "La recuperación por correo no está disponible en este momento."
      }
    >
      {configured && <RequestResetForm />}
    </RecoveryPage>
  );
}
