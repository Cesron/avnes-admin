"use client";

import { Controller } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useCreateUserForm } from "../_hooks/use-create-user-form";

type MentorOption = { id: string; name: string };

interface CreateUserFormProps {
  mentorsOptions: MentorOption[];
  onSuccess?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  coordinator: "Coordinador",
  mentor: "Mentora",
};

export function CreateUserForm({
  mentorsOptions,
  onSuccess,
}: CreateUserFormProps) {
  const { form, onSubmit, loading } = useCreateUserForm(onSuccess);
  const selectedRole = form.watch("role");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-user-name">Nombre</FieldLabel>
              <Input
                id="form-create-user-name"
                placeholder="Nombre completo"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-user-email">Email</FieldLabel>
              <Input
                id="form-create-user-email"
                type="email"
                placeholder="correo@ejemplo.com"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-user-password">
                Contraseña
              </FieldLabel>
              <Input
                id="form-create-user-password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-user-role">Rol</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="form-create-user-role"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {selectedRole === "mentor" && (
          <Controller
            name="mentorId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-create-user-mentor">
                  Mentora vinculada
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="form-create-user-mentor"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Selecciona una mentora" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentorsOptions.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {mentorsOptions.length === 0 && (
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
          {loading ? "Creando..." : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
}
