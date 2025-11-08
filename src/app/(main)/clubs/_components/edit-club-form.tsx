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
import { useEditClub } from "../_context/edit-club-context";
import { useEditClubForm } from "../_hooks/use-edit-club-form";

export function EditClubForm() {
  const { isOpen, closeEditDialog } = useEditClub();
  const { form, onSubmit, loading } = useEditClubForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Club</DialogTitle>
          <DialogDescription>
            Modifica el nombre del club. El nombre debe ser único.
          </DialogDescription>
        </DialogHeader>

        <form id="form-edit-club" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-club-name">
                    Nombre del Club
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-club-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: Moisés"
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
                {loading ? "Actualizando..." : "Actualizar Club"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
