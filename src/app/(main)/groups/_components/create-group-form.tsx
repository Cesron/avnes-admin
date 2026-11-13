"use client";

import { Controller } from "react-hook-form";
import { SearchableSelect } from "@/components/searchable-select";
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
import { useCreateGroupForm } from "../_hooks/use-create-group-form";

type CreateGroupFormProps = {
  clubs: { id: number; name: string }[];
  mentors: { id: number; name: string }[];
};

export function CreateGroupForm({ clubs, mentors }: CreateGroupFormProps) {
  const { form, onSubmit, loading } = useCreateGroupForm();

  return (
    <form id="form-create-group" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-group-name">
                Nombre del Grupo
              </FieldLabel>
              <Input
                {...field}
                id="form-create-group-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: Grupo Alpha"
                autoComplete="off"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="clubId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-group-club">Club</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="form-create-group-club"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Selecciona un club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id.toString()}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="mentorId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-group-mentor">
                Mentora
              </FieldLabel>
              <SearchableSelect
                id="form-create-group-mentor"
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
                placeholder="Selecciona una mentora"
                searchPlaceholder="Buscar mentora..."
                options={mentors.map((mentor) => ({
                  value: mentor.id.toString(),
                  label: mentor.name,
                }))}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Grupo"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
