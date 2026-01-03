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
import { useCreateFamilyForm } from "../_hooks/use-create-family-form";

type CreateFamilyFormProps = {
  suggestedPenpalCode: string;
};

export function CreateFamilyForm({
  suggestedPenpalCode,
}: CreateFamilyFormProps) {
  const { form, onSubmit, loading } = useCreateFamilyForm({
    suggestedPenpalCode,
  });

  return (
    <form id="form-create-family" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="penpalCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-family-penpal-code">
                Código Penpal
              </FieldLabel>
              <Input
                {...field}
                id="form-create-family-penpal-code"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: 0001"
                autoComplete="off"
                maxLength={4}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="familyBiographyUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-family-biography-url">
                URL de Biografía Familiar (opcional)
              </FieldLabel>
              <Input
                {...field}
                id="form-create-family-biography-url"
                aria-invalid={fieldState.invalid}
                placeholder="https://..."
                autoComplete="off"
                type="url"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="familyPhotoUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-family-photo-url">
                URL de Foto Familiar (opcional)
              </FieldLabel>
              <Input
                {...field}
                id="form-create-family-photo-url"
                aria-invalid={fieldState.invalid}
                placeholder="https://..."
                autoComplete="off"
                type="url"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Familia"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
