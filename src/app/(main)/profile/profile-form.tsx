"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { profileName, profilePhone, profilePhoto } from "@/lib/profile-fields";

const profileSchema = z.object({
  name: profileName,
  phone: profilePhone,
  photo: z.string().trim().pipe(z.literal("").or(profilePhoto)),
});

type ProfileFields = z.infer<typeof profileSchema>;

export function ProfileForm({
  email,
  ...profile
}: ProfileFields & { email: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });
  const { defaultValues, errors, isDirty, isSubmitting } = form.formState;
  const initials = (defaultValues?.name || profile.name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  async function submit(values: ProfileFields) {
    setSaved(false);

    try {
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.photo || null,
        phone: values.phone,
      });

      if (error) {
        form.setError("root", {
          message: "No se pudo guardar tu perfil. Inténtalo de nuevo.",
        });
        return;
      }

      form.reset(values);
      setSaved(true);
      router.refresh();
    } catch {
      form.setError("root", {
        message:
          "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.",
      });
    }
  }

  return (
    <form
      className="space-y-4"
      method="post"
      onSubmit={form.handleSubmit(submit)}
    >
      <Avatar className="size-16">
        <AvatarImage
          src={defaultValues?.photo || undefined}
          alt="Foto de perfil"
          referrerPolicy="no-referrer"
          className="object-cover"
        />
        <AvatarFallback className="text-lg font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <Field className="gap-2" data-invalid={Boolean(errors.name)}>
        <FieldLabel htmlFor="profile-name">Nombre</FieldLabel>
        <Input
          id="profile-name"
          autoComplete="name"
          maxLength={100}
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "profile-name-error" : undefined}
          {...form.register("name")}
        />
        <FieldError id="profile-name-error" errors={[errors.name]} />
      </Field>
      <Field className="gap-2">
        <FieldLabel htmlFor="profile-email">Correo electrónico</FieldLabel>
        <Input
          id="profile-email"
          type="email"
          autoComplete="username"
          value={email}
          readOnly
          className="bg-muted/40"
        />
      </Field>
      <Field className="gap-2" data-invalid={Boolean(errors.phone)}>
        <FieldLabel htmlFor="profile-phone">Teléfono</FieldLabel>
        <Input
          id="profile-phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "profile-phone-error" : undefined}
          {...form.register("phone")}
        />
        <FieldError id="profile-phone-error" errors={[errors.phone]} />
      </Field>
      <Field className="gap-2" data-invalid={Boolean(errors.photo)}>
        <FieldLabel htmlFor="profile-photo">URL de la foto</FieldLabel>
        <Input
          id="profile-photo"
          type="url"
          inputMode="url"
          autoComplete="off"
          maxLength={2048}
          aria-invalid={Boolean(errors.photo)}
          aria-describedby={
            errors.photo ? "profile-photo-error" : "profile-photo-hint"
          }
          {...form.register("photo")}
        />
        {errors.photo ? (
          <FieldError id="profile-photo-error" errors={[errors.photo]} />
        ) : (
          <FieldDescription id="profile-photo-hint">
            Usa un enlace directo a una imagen. Borra la URL para quitar la
            foto.
          </FieldDescription>
        )}
      </Field>
      {errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}
      {saved && !isDirty && (
        <output className="block text-sm text-blue-subtle-foreground">
          Perfil actualizado.
        </output>
      )}
      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
