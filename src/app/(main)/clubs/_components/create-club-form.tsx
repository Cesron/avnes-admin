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
import { useCreateClubForm } from "../_hooks/use-create-club-form";

export function CreateClubForm() {
  const { form, onSubmit, loading } = useCreateClubForm();

  return (
    <form id="form-create-club" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-club-name">
                Nombre del Club
              </FieldLabel>
              <Input
                {...field}
                id="form-create-club-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: Moisés"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Club"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
