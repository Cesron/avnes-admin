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
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useEditUser } from "../_context/edit-user-context";
import { useEditUserForm } from "../_hooks/use-edit-user-form";

type MentorOption = { id: string; name: string };

interface EditUserFormProps {
  mentorsOptions: MentorOption[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  coordinator: "Coordinador",
  mentor: "Mentora",
};

export function EditUserForm({ mentorsOptions }: EditUserFormProps) {
  const { isOpen, closeEditDialog, userToEdit } = useEditUser();
  const { form, onSubmit, loading } = useEditUserForm();
  const selectedRole = form.watch("role");

  const mentorOptionsForEdit = useMemo(() => {
    if (userToEdit?.mentor_id && userToEdit?.mentor_name) {
      const currentMentor = {
        id: userToEdit.mentor_id,
        name: userToEdit.mentor_name,
      };
      if (!mentorsOptions.some((m) => m.id === currentMentor.id)) {
        return [currentMentor, ...mentorsOptions];
      }
    }
    return mentorsOptions;
  }, [userToEdit, mentorsOptions]);

  return (
    <Dialog open={isOpen} onOpenChange={closeEditDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario. Si el rol es Mentora, deberás
            vincularlo a una mentora existente.
          </DialogDescription>
        </DialogHeader>

        <form id="form-edit-user" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-user-name">Nombre</FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-user-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nombre completo"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-user-role">Rol</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-edit-user-role"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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

            {selectedRole === "mentor" && (
              <Controller
                name="mentorId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-edit-user-mentor">
                      Mentora vinculada
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="form-edit-user-mentor"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Selecciona una mentora" />
                      </SelectTrigger>
                      <SelectContent>
                        {mentorOptionsForEdit.map((mentor) => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {mentorOptionsForEdit.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No hay mentoras disponibles sin usuario vinculado
                      </p>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
