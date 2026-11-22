"use client";

import Link from "next/link";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const minPasswordLength = 8;
const maxPasswordLength = 128;

export function PasswordForm({ token }: { token?: string }) {
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [invalidToken, setInvalidToken] = useState(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const newPassword = String(values.get("newPassword") ?? "");
    const currentPassword = String(values.get("currentPassword") ?? "");
    setSaved(false);
    setError("");

    if (newPassword !== values.get("confirmPassword")) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setPending(true);
    try {
      const result = token
        ? await authClient.resetPassword({ token, newPassword })
        : await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
          });

      if (!result.error) {
        form.reset();
        setSaved(true);
        return;
      }

      switch (result.error.code) {
        case "INVALID_TOKEN":
          setInvalidToken(true);
          break;
        case "INVALID_PASSWORD":
          setError("La contraseña actual es incorrecta.");
          break;
        case "CREDENTIAL_ACCOUNT_NOT_FOUND":
          setError(
            "Tu cuenta no tiene una contraseña. Solicita un enlace de recuperación para crearla.",
          );
          break;
        default:
          setError(
            result.error.status === 429
              ? "Has hecho varios intentos. Espera un momento e inténtalo de nuevo."
              : "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
          );
      }
    } catch {
      setError("No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  if (invalidToken) {
    return (
      <div className="space-y-3">
        <p role="alert" className="text-sm text-destructive">
          El enlace venció o ya se usó.
        </p>
        <Button asChild className="w-full">
          <Link href="/forgot-password" replace>
            Solicitar otro enlace
          </Link>
        </Button>
      </div>
    );
  }

  if (token && saved) {
    return (
      <output className="block rounded-lg border bg-card p-4 text-sm">
        Contraseña actualizada. Ya puedes iniciar sesión con tu nueva
        contraseña.
      </output>
    );
  }

  return (
    <form className="space-y-4" method="post" onSubmit={submit}>
      {!token && (
        <Field className="gap-2">
          <FieldLabel htmlFor="current-password">Contraseña actual</FieldLabel>
          <Input
            id="current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
      )}
      <Field className="gap-2">
        <FieldLabel htmlFor="new-password">Nueva contraseña</FieldLabel>
        <Input
          id="new-password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={minPasswordLength}
          maxLength={maxPasswordLength}
          aria-describedby="new-password-hint"
          required
        />
        <FieldDescription id="new-password-hint">
          Mínimo {minPasswordLength} caracteres.
        </FieldDescription>
      </Field>
      <Field className="gap-2">
        <FieldLabel htmlFor="confirm-password">
          Confirmar nueva contraseña
        </FieldLabel>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          maxLength={maxPasswordLength}
          required
        />
      </Field>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {saved && (
        <output className="block text-sm text-blue-subtle-foreground">
          Contraseña actualizada.
        </output>
      )}
      <Button
        type="submit"
        disabled={pending}
        className={token ? "w-full" : "w-full sm:w-auto"}
      >
        {pending
          ? "Guardando…"
          : token
            ? "Restablecer contraseña"
            : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
