"use client";

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
import { Controller } from "react-hook-form";
import { useEditMentor } from "../_context/edit-mentor-context";
import { useEditMentorForm } from "../_hooks/use-edit-mentor-form";

export function EditMentorForm() {
  const { isOpen, closeEditDialog } = useEditMentor();
  const { form, onSubmit, loading } = useEditMentorForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Mentor</DialogTitle>
          <DialogDescription>Modifica los datos del mentor.</DialogDescription>
        </DialogHeader>

        <form id="form-edit-mentor" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-mentor-name">
                    Nombre Completo
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-mentor-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: Juan Pérez"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-mentor-phone">
                    Teléfono (opcional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-mentor-phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: +502 1234-5678"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-mentor-email">
                    Email (opcional)
                  </FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="form-edit-mentor-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: mentor@ejemplo.com"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Mentor"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
