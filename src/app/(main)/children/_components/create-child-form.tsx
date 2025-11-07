"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { useCreateChildForm } from "../_hooks/use-create-child-form";

export function CreateChildForm() {
  const { form, onSubmit, loading } = useCreateChildForm();

  return (
    <form id="form-create-child" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-child-first-name">
                Nombre
              </FieldLabel>
              <Input
                {...field}
                id="form-create-child-first-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: Juan"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-child-last-name">
                Apellido
              </FieldLabel>
              <Input
                {...field}
                id="form-create-child-last-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: Pérez"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-child-gender">Sexo</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="form-create-child-gender"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Selecciona el sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="birthDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-child-birth-date">
                Fecha de Nacimiento
              </FieldLabel>
              <Input
                {...field}
                type="date"
                id="form-create-child-birth-date"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Niño/Niña"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
