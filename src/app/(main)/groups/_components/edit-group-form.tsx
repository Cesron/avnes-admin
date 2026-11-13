"use client";

import { Controller } from "react-hook-form";
import { SearchableSelect } from "@/components/searchable-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useEditGroup } from "../_context/edit-group-context";
import { useEditGroupForm } from "../_hooks/use-edit-group-form";

type EditGroupFormProps = {
  clubs: { id: number; name: string }[];
  mentors: { id: number; name: string }[];
};

export function EditGroupForm({ clubs, mentors }: EditGroupFormProps) {
  const { isOpen, closeEditDialog } = useEditGroup();
  const { form, onSubmit, loading } = useEditGroupForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Grupo</DialogTitle>
          <DialogDescription>Modifica los datos del grupo.</DialogDescription>
        </DialogHeader>

        <form id="form-edit-group" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-group-name">
                    Nombre del Grupo
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-group-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: Grupo Alpha"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="clubId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-group-club">Club</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-edit-group-club"
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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="mentorId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-group-mentor">
                    Mentora
                  </FieldLabel>
                  <SearchableSelect
                    id="form-edit-group-mentor"
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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Grupo"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
