# AVNES Admin

Sistema de administración para AVNES construido con Next.js.

## Guía de Desarrollo

### Estructura de Carpetas para CRUDs

Cada módulo de CRUD sigue la siguiente estructura de carpetas:

```
app/(main)/[modulo]/
├── page.tsx
├── _components/
│   ├── [modulo]-header.tsx
│   ├── [modulo]-table.tsx
│   └── create-[entidad]-form.tsx
├── _hooks/
│   └── use-create-[entidad]-form.ts
└── _lib/
    ├── create-[entidad].schema.ts
    └── create-[entidad].action.ts
```

### Crear un Nuevo Registro (CREATE)

Para implementar la funcionalidad de creación de registros, sigue estos pasos:

#### 1. Crear el Schema de Validación

Archivo: `_lib/create-[entidad].schema.ts`

```typescript
import { z } from "zod";

export const create[Entidad]Schema = z.object({
  name: z
    .string(),
  // Agregar más campos según sea necesario
});

export type Create[Entidad]FormData = z.infer<typeof create[Entidad]Schema>;
```

**Directrices:**

- Usar validaciones apropiadas según el tipo de dato
- Incluir mensajes de error descriptivos en español
- Aplicar `.trim()` a campos de texto
- Exportar el tipo inferido para TypeScript

#### 2. Crear el Server Action

Archivo: `_lib/create-[entidad].action.ts`

```typescript
"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { normalizeString } from "@/utils/normalize-string";
import { create[Entidad]Schema } from "./create-[entidad].schema";

export const create[Entidad]Action = actionClient
  .inputSchema(create[Entidad]Schema)
  .action(async ({ parsedInput: { name } }) => {
    // Logica para la validación e inserción en la base de datos
  });
```

**Directrices:**

- Usar `"use server"` al inicio del archivo
- Usar `actionClient` de safe-action
- Normalizar strings para comparaciones (sin tildes, minúsculas)
- Guardar los datos tal como el usuario los escribe (solo trim)
- Usar `CustomError` para errores personalizados
- Retornar el registro creado

#### 3. Crear el Custom Hook

Archivo: `_hooks/use-create-[entidad]-form.ts`

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { create[Entidad]Action } from "../_lib/create-[entidad].action";
import {
  Create[Entidad]FormData,
  create[Entidad]Schema,
} from "../_lib/create-[entidad].schema";

export function useCreate[Entidad]Form() {
  const [loading, setLoading] = useState(false);

  const form = useForm<Create[Entidad]FormData>({
    resolver: zodResolver(create[Entidad]Schema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: Create[Entidad]FormData) {
    const toastId = toast.loading("Creando...");
    setLoading(true);

    const { serverError } = await create[Entidad]Action(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Registro creado exitosamente", { id: toastId });
    setLoading(false);
    form.reset();
  }

  return { form, onSubmit, loading };
}
```

**Directrices:**

- Usar `react-hook-form` con `zodResolver`
- Manejar estado de `loading`
- Mostrar toasts en español (loading, error, success)
- Resetear el formulario después de creación exitosa
- No manejar redirecciones (se hacen desde el componente padre)

#### 4. Crear el Componente de Formulario

Archivo: `_components/create-[entidad]-form.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { useCreate[Entidad]Form } from "../_hooks/use-create-[entidad]-form";

export function Create[Entidad]Form() {
  const { form, onSubmit, loading } = useCreate[Entidad]Form();

  return (
    <form id="form-create-[entidad]" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-[entidad]-name">
                Nombre
              </FieldLabel>
              <Input
                {...field}
                id="form-create-[entidad]-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ingresa el nombre"
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
            {loading ? "Creando..." : "Crear"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
```

**Directrices:**

- Usar `"use client"` al inicio
- No incluir lógica de Dialog en el formulario
- Usar `Controller` de react-hook-form para cada campo
- Incluir validación visual con `data-invalid`
- Mostrar errores con `FieldError`
- IDs descriptivos para accesibilidad
- Deshabilitar botón durante loading

#### 5. Integrar en el Header con Dialog

Archivo: `_components/[modulo]-header.tsx`

```typescript
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { Create[Entidad]Form } from "./create-[entidad]-form";

export function [Modulo]Header() {
  return (
    <header>
      {/* Breadcrumbs y otros elementos... */}

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircleIcon />
            Agregar [Entidad]
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva [Entidad]</DialogTitle>
            <DialogDescription>
              Ingresa los datos de la nueva [entidad].
            </DialogDescription>
          </DialogHeader>

          <Create[Entidad]Form />
        </DialogContent>
      </Dialog>
    </header>
  );
}
```

**Directrices:**

- El Dialog se maneja de forma no controlada
- El DialogTrigger envuelve el botón de acción
- El formulario va dentro del DialogContent
- Incluir DialogHeader con título y descripción claros

### Utilidades Disponibles

#### `normalizeString(str: string): string`

Normaliza un string eliminando tildes y convirtiéndolo a minúsculas. Útil para comparaciones.

**Uso:**

```typescript
import { normalizeString } from "@/utils/normalize-string";

const normalized = normalizeString("José"); // "jose"
```

#### `CustomError`

Clase para crear errores personalizados con códigos de estado HTTP.

**Uso:**

```typescript
import { CustomError } from "@/utils/custom-error";

throw CustomError.badRequest("Mensaje de error");
throw CustomError.unauthorized("No autorizado");
```

---
