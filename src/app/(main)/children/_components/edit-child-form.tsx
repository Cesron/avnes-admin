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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FamilyOption } from "@/services/families/get-families-options";
import { Controller } from "react-hook-form";
import { useEditChild } from "../_context/edit-child-context";
import { useEditChildForm } from "../_hooks/use-edit-child-form";

interface EditChildFormProps {
  familiesOptions: FamilyOption[];
}

export function EditChildForm({ familiesOptions }: EditChildFormProps) {
  const { isOpen, closeEditDialog } = useEditChild();
  const { form, onSubmit, loading } = useEditChildForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeEditDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Niño/Niña</DialogTitle>
          <DialogDescription>
            Modifica los datos del niño o niña.
          </DialogDescription>
        </DialogHeader>

        <form id="form-edit-child" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="familyId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-family">
                    Familia
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-edit-child-family"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecciona una familia" />
                    </SelectTrigger>
                    <SelectContent>
                      {familiesOptions.map((family) => (
                        <SelectItem key={family.id} value={family.id}>
                          {family.penpal_code}
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
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-first-name">
                    Nombre
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-child-first-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: Juan"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-last-name">
                    Apellido
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-child-last-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej: Pérez"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-gender">Sexo</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-edit-child-gender"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecciona el sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="birthDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-birth-date">
                    Fecha de Nacimiento
                  </FieldLabel>
                  <Input
                    {...field}
                    type="date"
                    id="form-edit-child-birth-date"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="childPhotoUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-photo-url">
                    URL Foto Individual (opcional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-child-photo-url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://ejemplo.com/foto.jpg"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="pamphletUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-pamphlet-url">
                    URL Panfleto (opcional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-child-pamphlet-url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://ejemplo.com/panfleto.pdf"
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
                {loading ? "Actualizando..." : "Actualizar Niño/Niña"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
