"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { useLoginForm } from "../_hooks/use-login-form";

export function LoginForm() {
  const { form, onSubmit, setShowPassword, showPassword, loading } =
    useLoginForm();

  return (
    <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-login-email"
                aria-invalid={fieldState.invalid}
                placeholder="nombre@ejemplo.com"
                autoComplete="off"
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
              <FieldLabel htmlFor="form-login-password">Contraseña</FieldLabel>

              <InputGroup>
                <InputGroupInput
                  {...field}
                  type={showPassword ? "text" : "password"}
                  id="form-login-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  autoComplete="off"
                />

                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Mostrar contraseña"
                    size="icon-xs"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <EyeIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal">
              <Checkbox
                id="form-login-remember-me"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel
                htmlFor="form-login-remember-me"
                className="font-normal"
              >
                Recuérdame
              </FieldLabel>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
