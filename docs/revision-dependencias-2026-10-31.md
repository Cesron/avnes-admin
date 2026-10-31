# Revisión del proyecto y actualización de dependencias

Fecha: 31 de octubre de 2026.

## Resultado

Next.js se actualizó de **16.1.4 a 16.4.3**, la versión estable publicada en el canal `latest` al realizar esta revisión. React y React DOM se actualizaron juntos a **19.3.1** y Better Auth a **1.7.14**.

La auditoría pasó de **10 paquetes vulnerables** (2 críticos, 7 altos y 1 moderado) a **1 paquete con vulnerabilidad alta: Zod**. Estos números corresponden a paquetes afectados, no al número de avisos de seguridad ni a una comprobación de que todos fueran explotables en esta aplicación.

Se ejecutaron instalaciones normales y `npm audit fix`, sin `--force`, sin `--legacy-peer-deps` y sin añadir overrides. Los overrides de tipos de React que ya existían se alinearon con las versiones directas actualizadas.

## Cómo funciona la aplicación

### Capas y flujo de datos

- `src/app`: App Router de Next.js, layouts, páginas, handlers HTTP y Server Actions. Las páginas del grupo `(main)` requieren sesión mediante su layout. El grupo `(auth)` contiene login y registro.
- `src/services`: consultas SQL de cada módulo y cálculos de indicadores. No hay un ORM para los módulos de negocio: se utiliza directamente el pool de `pg` de `src/lib/sql.ts`, normalmente con parámetros `$1`, `$2`, etc.
- `src/lib/auth.ts`: Better Auth con PostgreSQL, correo/contraseña, plugin `admin` y `nextCookies` para integrar las cookies con Server Actions. `src/app/api/auth/[...all]/route.ts` expone los handlers de Better Auth.
- `src/lib/auth-utils.ts`: obtiene la sesión, verifica permisos de páginas y resuelve la mentora y los grupos asociados al usuario.
- `src/lib/permissions.ts`: define las rutas de administrador, coordinador y mentora; también alimenta el menú lateral.
- `src/lib/safe-action.ts`: cliente de `next-safe-action`, validación de entrada y traducción de `CustomError` a mensajes. **Este cliente no añade autenticación ni autorización por sí mismo.**
- Cada CRUD agrupa `_components`, `_hooks`, `_lib` y, cuando necesita edición, `_context`. Los formularios usan React Hook Form y resolvers de Zod; Sonner muestra el resultado. Las mutaciones suelen llamar a `revalidatePath` para refrescar las páginas.
- `src/components/ui`: componentes compartidos basados en Radix y Base UI. Tailwind CSS 4 genera los estilos; `next-themes` administra el tema.

### Modelo de negocio

| Módulo | Responsabilidad y relaciones |
| --- | --- |
| Clubes | Agrupan los grupos de atención. |
| Mentoras | Se asignan a grupos y pueden vincularse con un usuario mediante `mentors.user_id`. |
| Grupos | Pertenecen a un club y tienen una mentora. `children_groups` relaciona niños y grupos, con un indicador de membresía activa. |
| Familias | Mantienen el código penpal y enlaces a recursos compartidos. |
| Niños | Datos individuales, familia opcional, recursos y grupos activos; permiten búsquedas y filtros. |
| Usuarios | Gestión mediante Better Auth y SQL para los roles propios y la vinculación con mentoras. |
| Actividades | Se asignan a uno o varios grupos. Pueden ser únicas o recurrentes. |
| Asistencia | Trabaja con fechas concretas de actividad (`activity_occurrences`) y registra presente, ausente o justificado mediante UPSERT por niño y ocurrencia. |
| Dashboard | Usa consultas de resumen distintas para administrador/coordinador y mentoras: indicadores, actividades, asistencia por club/grupo y niños con baja asistencia. |

Las recurrencias se guardan en `activity_recurrences`; `src/utils/generate-occurrences.ts` genera las fechas al crear o editar una actividad. El calendario consulta las ocurrencias por rango de fechas, club y grupo. Las vistas de mentora intentan restringir los datos a sus grupos.

### Ejecución y despliegue

- `npm run dev`: desarrollo con el bundler predeterminado de Next.js.
- `npm run build`: compilación con Webpack; se conserva el script existente.
- `next.config.ts`: salida `standalone`.
- `Dockerfile`: build y ejecución con Node.js 24; copia el servidor standalone, `public` y los recursos estáticos. El healthcheck usa `/api/health`, que responde `OK` y no comprueba PostgreSQL.
- PostgreSQL se configura mediante `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`. Better Auth también consume sus variables de entorno habituales.
- `src/db/schema.sql` es un script de inicialización con `DROP TABLE`, no un sistema de migraciones incremental. No se ejecutó este archivo ni el seed durante la revisión.

## Dependencias actualizadas

Las versiones anteriores de esta tabla son las instaladas en el lockfile original, que en algunos casos diferían del mínimo declarado en `package.json`.

| Dependencia | Antes | Después |
| --- | --- | --- |
| `next`, `@next/env`, binarios SWC de Next | 16.1.4 | 16.4.3 |
| `react`, `react-dom` | 19.2.3 | 19.3.1 |
| `@types/react` | 19.2.9 | 19.3.0 |
| `@types/react-dom` | 19.2.3 | 19.3.0 |
| `better-auth` y sus paquetes internos | 1.4.10 | 1.7.14 |
| `baseline-browser-mapping` | 2.9.11 | 2.11.34 |
| `defu` | 6.1.4 | 6.1.7 |
| `kysely` | 0.28.9 | 0.29.7 |
| `nanoid` | 3.3.11 | 3.3.20 |
| `postcss` | ramas anteriores del árbol | 8.5.23 |
| `sharp` | 0.34.4 | 0.35.5 |
| `source-map-js` | 1.2.1 | 1.2.2 |

También cambiaron dependencias internas requeridas por Next.js, React y Better Auth; las versiones y hashes completos están en `package-lock.json`. No se actualizaron masivamente dependencias sin avisos de vulnerabilidad, ni se adoptaron versiones beta/canary o saltos mayores de herramientas ajenas a esta actualización.

### Compatibilidad de Better Auth

Se revisaron las notas de las versiones 1.5, 1.6 y 1.7. La aplicación utiliza correo/contraseña y el plugin de administración, sin OAuth Provider, SSO, SCIM ni otros plugins que requieren migraciones específicas.

Se inspeccionaron las columnas existentes de `user`, `session`, `account` y `verification` dentro de una transacción PostgreSQL de solo lectura. La tabla `account` conserva el esquema sin `issuer`, compatible con Better Auth 1.7.3 y posteriores. La consulta de duplicados por `providerId` y `accountId` devolvió cero. No se aplicaron migraciones ni se cambiaron registros de negocio.

## Actualización pendiente: Zod

Se probó **Zod 4.6.7**, pero se restauró **4.1.12** siguiendo la indicación de dejar aparte las actualizaciones que presentaran inconvenientes.

La expresión `.refine((val) => val === "M" || val === "F")` de los schemas de niños pasa a inferir una salida `"M" | "F"`, mientras la entrada sigue siendo `string`. Los hooks usan `useForm` con un único tipo inferido y valores iniciales vacíos, lo que produce errores de tipos en creación, edición, `handleSubmit` y `reset`:

- `src/app/(main)/children/_lib/create-child.schema.ts`
- `src/app/(main)/children/_lib/edit-child.schema.ts`
- `src/app/(main)/children/_hooks/use-create-child-form.ts`
- `src/app/(main)/children/_hooks/use-edit-child-form.ts`

Para retomar la actualización, revisar por separado los tipos de entrada (`z.input`) y salida (`z.output`) de los formularios y el contrato del resolver. No se cambiaron schemas ni se añadieron casts o excepciones para ocultar el problema.

El aviso pendiente es [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5): agotamiento de memoria al validar colecciones restringidas de gran tamaño; afecta a versiones anteriores a 4.6.6. La auditoría identifica la copia raíz 4.1.12. Better Auth y `@better-auth/core` conservan sus propias copias compatibles de Zod 4.6.7; no se impuso la versión antigua sobre ellas.

## Hallazgos previos del código para atender por separado

Estos hallazgos se obtuvieron por inspección del código; no se ejecutaron ataques ni mutaciones para demostrar su explotación. No se modificó la lógica de negocio como parte de la actualización de dependencias.

1. **Autorización de Server Actions.** Varias acciones de creación/edición usan el `actionClient` público sin verificar sesión o rol. Ejemplos: `clubs/_lib/create-club.action.ts`, `families/_lib/create-family.action.ts` y `users/_lib/edit-user.action.ts`, bajo `src/app/(main)`. El layout y los permisos de las páginas no protegen la invocación directa de una Server Action. También hay acciones de lectura sin controles propios (`children/_lib/get-children.action.ts`, `families/_lib/get-families.action.ts` y las acciones de calendario). Conviene aplicar controles del servidor por operación y obtener el alcance desde la sesión.
2. **Mentoras sin grupos.** En `src/app/(main)/children/page.tsx` y `attendance/page.tsx`, una mentora con cero grupos termina con `mentorGroupIds = undefined`; los servicios interpretan ese valor como ausencia de filtro. Las acciones de lectura también aceptan el alcance desde el cliente. Debe distinguirse un usuario con acceso global de una mentora con alcance vacío.
3. **Credenciales incluidas en el cliente.** `src/app/(auth)/login/_hooks/use-login-form.ts` contiene correo y contraseña de prueba en `defaultValues`. Se distribuyen dentro del código del navegador. Deben sustituirse por campos vacíos; aquí no se reproducen los valores.
4. **Alta pública de cuentas.** Existe `/sign-up` y `emailAndPassword` permite registro. Revisar si el sistema administrativo debe admitir altas públicas y qué acceso recibe el rol predeterminado `user`, ajeno a los tres roles de negocio.
5. **Integridad de asistencia.** `attendance/_lib/mark-attendance.action.ts` comprueba la pertenencia del niño a los grupos de la mentora, pero no comprueba en la misma acción que la ocurrencia pertenezca a esos grupos ni que el niño participe en la actividad. El UPSERT del servicio no valida esas relaciones.
6. **Operaciones de varios pasos sin transacción.** La creación de actividades y usuarios y algunos cambios de relaciones ejecutan varias escrituras independientes. Un fallo intermedio puede dejar datos parcialmente guardados. Revisar transacciones y concurrencia antes de ampliar esos flujos.
7. **Recurrencias mensuales.** `generate-occurrences.ts` avanza con `Date.setMonth` manteniendo el día del mes. Si el mes destino no tiene ese día, el desbordamiento puede desplazar la cadencia de los siguientes meses, especialmente con intervalos mayores a uno; requiere una revisión propia del comportamiento esperado.

## Validación

| Comprobación | Resultado |
| --- | --- |
| Build original con Next.js 16.1.4 | Correcto. |
| `npm run build` con Next.js 16.4.3 y Zod restaurado | Correcto; genera todas las rutas y la salida standalone. |
| `tsc --noEmit --incremental false` | Correcto antes y después. Los tipos generados por la versión antigua de Next se regeneraron mediante el build. |
| `npm ls --depth=0` | Árbol válido, sin conflictos de peers. |
| `npm ci` con los manifests finales en una carpeta temporal limpia | Correcto; confirma que el lockfile permite reinstalar. |
| Reinstalación en el workspace | `npm ci` encontró un binario de CSS bloqueado por un proceso de desarrollo de Windows; `npm install` restauró las dependencias y terminó correctamente. No se detuvieron procesos del usuario. |
| Servidor de producción standalone | Arranca correctamente con Next.js 16.4.3 en un puerto local de prueba. |
| `/api/health` | HTTP 200, cuerpo `OK`. |
| Rutas privadas sin sesión | `/`, dashboard y los ocho módulos redirigen con HTTP 307 a `/login`. |
| Inicio de sesión con la cuenta facilitada | Correcto mediante el formulario y su Server Action. |
| Cierre de sesión | Correcto; al recargar una ruta privada vuelve a `/login`. |
| Navegación autenticada | Cargan dashboard, familias, niños, grupos, actividades, asistencia, mentoras, clubes y usuarios. |
| Formulario de creación de niños | Abre y muestra los errores esperados para nombre, sexo y fecha vacíos. No se guardaron datos. |
| Consola del navegador durante las comprobaciones | Sin errores registrados. |
| `npm run lint` | Ya fallaba: 341 errores y 42 advertencias; después mantiene exactamente esos totales. No se aplicaron cambios masivos de formato. |
| Auditoría final | 0 críticos, 1 alto, 0 moderados; pendiente Zod. |

No se probaron altas, ediciones ni registros de asistencia sobre la base de datos. El login creó una sesión de prueba de la forma habitual y se cerró al terminar. No se probaron cuentas de coordinador o mentora, ni se construyó la imagen Linux: Docker está instalado, pero su daemon no estaba disponible. El arranque standalone sí se verificó en Windows con Node.js 24.

## Referencias

- [Next.js 16.4.3, publicación oficial](https://github.com/vercel/next.js/releases/tag/v16.4.3).
- [Guía oficial de actualización de Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16).
- [Better Auth 1.5: cambios incompatibles](https://better-auth.com/blog/1-5).
- [Better Auth 1.6: cambios de comportamiento y compatibilidad de hashes](https://better-auth.com/blog/1-6).
- [Better Auth 1.7: guía de actualización](https://better-auth.com/docs/guides/1-7-upgrade-guide).
- [Better Auth: corrección del cambio de esquema de cuentas en 1.7.3](https://better-auth.com/blog/1-7-account-schema).
