"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { useCreateMentorForm } from "../_hooks/use-create-mentor-form";

export function CreateMentorForm() {
  const { form, onSubmit, loading } = useCreateMentorForm();

  return (
    <form id="form-create-mentor" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-mentor-name">
                Nombre Completo
              </FieldLabel>
              <Input
                {...field}
                id="form-create-mentor-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: Juan Pérez"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-mentor-phone">
                Teléfono (opcional)
              </FieldLabel>
              <Input
                {...field}
                id="form-create-mentor-phone"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: +502 1234-5678"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-mentor-email">
                Email (opcional)
              </FieldLabel>
              <Input
                {...field}
                type="email"
                id="form-create-mentor-email"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: mentor@ejemplo.com"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Mentor"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
