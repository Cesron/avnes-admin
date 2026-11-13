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
  FieldDescription,
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
import type { GroupOption } from "@/services/groups/get-groups-options";
import { useEditChild } from "../_context/edit-child-context";
import { useEditChildForm } from "../_hooks/use-edit-child-form";

interface EditChildFormProps {
  familiesOptions: FamilyOption[];
  groups: GroupOption[];
}

export function EditChildForm({ familiesOptions, groups }: EditChildFormProps) {
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
              name="groupId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-group">Grupo</FieldLabel>
                  <SearchableSelect
                    id="form-edit-child-group"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading || groups.length === 0}
                    aria-invalid={fieldState.invalid}
                    aria-describedby="form-edit-child-group-description"
                    placeholder="Sin grupo asignado"
                    searchPlaceholder="Buscar grupo o club..."
                    options={groups.map((group) => ({
                      value: group.id,
                      label: `${group.name} (${group.club_name})`,
                    }))}
                  />
                  <FieldDescription id="form-edit-child-group-description">
                    {groups.length === 0
                      ? "No hay grupos disponibles."
                      : "El cambio de grupo se aplicará al guardar la ficha."}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="familyId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-family">
                    Familia (opcional)
                  </FieldLabel>
                  <SearchableSelect
                    id="form-edit-child-family"
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    placeholder="Selecciona una familia"
                    searchPlaceholder="Buscar familia por código..."
                    options={familiesOptions.map((family) => ({
                      value: family.id,
                      label: family.penpal_code,
                    }))}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-child-name">
                    Nombre Completo
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-child-name"
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
