"use client";

import { MailCheckIcon } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function RequestResetForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    setPending(true);
    setError("");

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (!result.error) {
        setSent(true);
      } else if (result.error.status === 429) {
        setError(
          "Has hecho varias solicitudes. Espera un minuto e inténtalo de nuevo.",
        );
      } else {
        setError("No se pudo completar la solicitud. Inténtalo de nuevo.");
      }
    } catch {
      setError("No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <output className="flex gap-3 rounded-lg border bg-card p-4">
        <MailCheckIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-blue-subtle-foreground"
        />
        <span className="space-y-1 text-sm">
          <span className="block font-medium">Revisa tu correo</span>
          <span className="block text-muted-foreground">
            Si el correo está registrado, recibirás un enlace para restablecer
            tu contraseña. Revisa también la carpeta de correo no deseado.
          </span>
        </span>
      </output>
    );
  }

  return (
    <form className="space-y-4" method="post" onSubmit={submit}>
      <Field className="gap-2">
        <FieldLabel htmlFor="reset-email">Correo electrónico</FieldLabel>
        <Input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </Field>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando solicitud…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
