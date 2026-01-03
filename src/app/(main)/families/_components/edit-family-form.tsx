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
import { useEditFamily } from "../_context/edit-family-context";
import { useEditFamilyForm } from "../_hooks/use-edit-family-form";

export function EditFamilyForm() {
  const { isOpen, closeEditDialog } = useEditFamily();
  const { form, onSubmit, loading } = useEditFamilyForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Familia</DialogTitle>
          <DialogDescription>
            Modifica los datos de la familia.
          </DialogDescription>
        </DialogHeader>

        <form id="form-edit-family" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="penpalCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-family-penpal-code">
                    Código Penpal
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-family-penpal-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: 0001"
                    autoComplete="off"
                    maxLength={4}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="familyBiographyUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-family-biography-url">
                    URL de Biografía Familiar (opcional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-family-biography-url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://..."
                    autoComplete="off"
                    type="url"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="familyPhotoUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-family-photo-url">
                    URL de Foto Familiar (opcional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-family-photo-url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://..."
                    autoComplete="off"
                    type="url"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Familia"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
