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
- Usar `CustomError` para errores personalizados

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
  }

  return { form, onSubmit, loading };
}
```

**Directrices:**

- Usar `react-hook-form` con `zodResolver`
- Manejar estado de `loading`
- Mostrar toasts en español (loading, error, success)
- Resetear el formulario después de creación exitosa

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
- Incluir DialogHeader con título y descripción claros

### Editar un Registro (EDIT/UPDATE)

Para implementar la funcionalidad de edición de registros, sigue estos pasos:

#### 1. Crear el Contexto de Edición

Archivo: `_context/edit-[entidad]-context.tsx`

```typescript
"use client";

import type { [Entidad] } from "@/types/[entidad]";
import { createContext, useContext, useState, type ReactNode } from "react";

type Edit[Entidad]ContextType = {
  isOpen: boolean;
  [entidad]ToEdit: [Entidad] | null;
  openEditDialog: ([entidad]: [Entidad]) => void;
  closeEditDialog: () => void;
};

const Edit[Entidad]Context = createContext<Edit[Entidad]ContextType | undefined>(
  undefined
);

export function Edit[Entidad]Provider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [[entidad]ToEdit, set[Entidad]ToEdit] = useState<[Entidad] | null>(null);

  const openEditDialog = ([entidad]: [Entidad]) => {
    set[Entidad]ToEdit([entidad]);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    // Limpiamos el registro después de que se cierre la animación del modal
    setTimeout(() => set[Entidad]ToEdit(null), 200);
  };

  return (
    <Edit[Entidad]Context.Provider
      value={{
        isOpen,
        [entidad]ToEdit,
        openEditDialog,
        closeEditDialog,
      }}
    >
      {children}
    </Edit[Entidad]Context.Provider>
  );
}

export function useEdit[Entidad]() {
  const context = useContext(Edit[Entidad]Context);
  if (context === undefined) {
    throw new Error("useEdit[Entidad] must be used within an Edit[Entidad]Provider");
  }
  return context;
}
```

**Directrices:**

- Usar `"use client"` al inicio
- Crear un contexto para manejar el estado del modal y el registro a editar
- El timeout en `closeEditDialog` permite que la animación del modal termine antes de limpiar el estado
- Exportar un custom hook para acceder al contexto fácilmente
- Validar que el hook se use dentro del provider

#### 2. Crear el Schema de Validación para Edición

Archivo: `_lib/edit-[entidad].schema.ts`

```typescript
import { z } from "zod";

export const edit[Entidad]Schema = z.object({
  id: z.number(),
  name: z.string(),
  // Agregar más campos según sea necesario
});

export type Edit[Entidad]FormData = z.infer<typeof edit[Entidad]Schema>;
```

**Directrices:**

- Incluir el campo `id` para identificar el registro a actualizar
- Usar las mismas validaciones que en el schema de creación
- Mantener consistencia en los mensajes de error

#### 3. Crear el Server Action para Actualizar

Archivo: `_lib/edit-[entidad].action.ts`

```typescript
"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { edit[Entidad]Schema } from "./edit-[entidad].schema";

export const edit[Entidad]Action = actionClient
  .inputSchema(edit[Entidad]Schema)
  .action(async ({ parsedInput: { id, name } }) => {
    // Lógica para validar y actualizar el registro en la base de datos
  });
```

**Directrices:**

- Usar `"use server"` al inicio del archivo
- Validar que el registro exista antes de actualizar
- Verificar que no haya duplicados (excluyendo el registro actual con `id != $2`)

#### 4. Crear el Custom Hook para el Formulario de Edición

Archivo: `_hooks/use-edit-[entidad]-form.ts`

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEdit[Entidad] } from "../_context/edit-[entidad]-context";
import { edit[Entidad]Action } from "../_lib/edit-[entidad].action";
import {
  Edit[Entidad]FormData,
  edit[Entidad]Schema,
} from "../_lib/edit-[entidad].schema";

export function useEdit[Entidad]Form() {
  const [loading, setLoading] = useState(false);
  const { [entidad]ToEdit, closeEditDialog } = useEdit[Entidad]();

  const form = useForm<Edit[Entidad]FormData>({
    resolver: zodResolver(edit[Entidad]Schema),
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  // Actualizar el formulario cuando cambie el registro a editar
  useEffect(() => {
    if ([entidad]ToEdit) {
      form.reset({
        id: [entidad]ToEdit.id,
        name: [entidad]ToEdit.name,
        // Agregar más campos según sea necesario
      });
    }
  }, [[entidad]ToEdit, form]);

  async function onSubmit(data: Edit[Entidad]FormData) {
    const toastId = toast.loading("Actualizando...");
    setLoading(true);

    const { serverError } = await edit[Entidad]Action(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Registro actualizado exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
```

**Directrices:**

- Usar `useEffect` para actualizar el formulario cuando cambie el registro a editar
- Usar `form.reset()` para rellenar el formulario con los valores actuales
- Cerrar el dialog después de una actualización exitosa
- No resetear el formulario después de editar (se cierra el modal)

#### 5. Crear el Componente de Formulario de Edición

Archivo: `_components/edit-[entidad]-form.tsx`

```typescript
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
import { useEdit[Entidad] } from "../_context/edit-[entidad]-context";
import { useEdit[Entidad]Form } from "../_hooks/use-edit-[entidad]-form";

export function Edit[Entidad]Form() {
  const { isOpen, closeEditDialog } = useEdit[Entidad]();
  const { form, onSubmit, loading } = useEdit[Entidad]Form();

  return (
    <Dialog open={isOpen} onOpenChange={closeEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar [Entidad]</DialogTitle>
          <DialogDescription>
            Modifica los datos del registro.
          </DialogDescription>
        </DialogHeader>

        <form id="form-edit-[entidad]" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-[entidad]-name">
                    Nombre
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-edit-[entidad]-name"
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
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Directrices:**

- El Dialog es controlado desde el contexto (`open={isOpen}`)
- Usar `onOpenChange` para cerrar el dialog cuando el usuario hace click fuera o presiona ESC
- El formulario va directamente dentro del DialogContent (no usar DialogTrigger aquí)
- Este componente se renderiza una sola vez en la página, no por cada fila de la tabla

#### 6. Crear el Componente de Acciones

Archivo: `_components/[entidad]-actions.tsx`

```typescript
"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { [Entidad] } from "@/types/[entidad]";
import { EditIcon } from "lucide-react";
import { useEdit[Entidad] } from "../_context/edit-[entidad]-context";

type [Entidad]ActionsProps = {
  [entidad]: [Entidad];
};

export function [Entidad]Actions({ [entidad] }: [Entidad]ActionsProps) {
  const { openEditDialog } = useEdit[Entidad]();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog([entidad])}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar [Entidad]</TooltipContent>
      </Tooltip>
    </div>
  );
}
```

**Directrices:**

- Usar `"use client"` al inicio
- Usar el icono `EditIcon` de lucide-react
- Incluir un Tooltip descriptivo
- El botón llama a `openEditDialog` pasando el registro completo
- Este componente se renderiza en cada fila de la tabla

#### 7. Modificar la Tabla para Agregar Columna de Acciones

Archivo: `_components/[modulo]-table.tsx`

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { get[Entidades] } from "@/services/[modulo]/get-[entidades]";
import { [Entidad]Actions } from "./[entidad]-actions";

export async function [Modulo]Table() {
  const [entidades] = await get[Entidades]();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[entidades].map(([entidad]) => (
            <TableRow key={[entidad].id}>
              <TableCell className="font-medium">{[entidad].id}</TableCell>
              <TableCell>
                <div className="font-medium text-base">{[entidad].name}</div>
              </TableCell>
              <TableCell>
                <[Entidad]Actions [entidad]={[entidad]} />
              </TableCell>
            </TableRow>
          ))}

          {[entidades].length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                No hay registros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

**Directrices:**

- Agregar una columna `<TableHead>` para "Acciones" con ancho fijo (`w-[100px]`)
- Agregar `<TableCell>` con el componente de acciones en cada fila
- Actualizar el `colSpan` en el mensaje de "no hay registros" para incluir todas las columnas
- Pasar el registro completo al componente de acciones

#### 8. Envolver la Página con el Provider

Archivo: `page.tsx`

```typescript
import { verifySession } from "@/lib/auth-utils";
import { [Modulo]Header } from "./_components/[modulo]-header";
import { [Modulo]Table } from "./_components/[modulo]-table";
import { Edit[Entidad]Provider } from "./_context/edit-[entidad]-context";
import { Edit[Entidad]Form } from "./_components/edit-[entidad]-form";

export default async function [Modulo]Page() {
  await verifySession();

  return (
    <Edit[Entidad]Provider>
      <[Modulo]Header />

      <[Modulo]Table />

      <Edit[Entidad]Form />
    </Edit[Entidad]Provider>
  );
}
```

**Directrices:**

- Envolver todo el contenido con el `Edit[Entidad]Provider`
- Renderizar el `Edit[Entidad]Form` **una sola vez** al final, fuera de la tabla

#### Estructura Final para Edición

```
app/(main)/[modulo]/
├── page.tsx (modificado - envolver con provider)
├── _components/
│   ├── [modulo]-table.tsx (modificado - agregar columna de acciones)
│   ├── [entidad]-actions.tsx (nuevo)
│   └── edit-[entidad]-form.tsx (nuevo)
├── _context/
│   └── edit-[entidad]-context.tsx (nuevo)
├── _hooks/
│   └── use-edit-[entidad]-form.ts (nuevo)
└── _lib/
    ├── edit-[entidad].schema.ts (nuevo)
    └── edit-[entidad].action.ts (nuevo)
```

---

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
