# Skeletons de carga

Cada página tiene un `loading.tsx`, incluyendo Inicio, Dashboard, las listas,
Asistencia, el detalle de una actividad, Login y Registro. El layout protegido
también muestra un espejo de la ruta mientras verifica la sesión.

Los bloques reutilizables viven en `src/components/loading-skeletons.tsx`.
Utilizan el Skeleton existente (`rounded-md`, colores del tema), un bloque por
tarjeta o sección y las mismas columnas, anchos y separaciones del contenido.
Las alturas representan la estructura habitual; el contenido variable puede
crecer después de cargar. No se dibujan iconos ni textos pequeños simulados.

Las consultas están dentro de límites Suspense: el contenido disponible se
conserva mientras llegan las listas, indicadores y encabezados con consultas.
Las consultas independientes de Niños y Actividades se inician en paralelo.
Los formularios de edición cerrados no tienen fallback visible.

Familias y Niños muestran bloques en la cuadrícula durante búsqueda y
paginación; conservan los controles y la cantidad de tarjetas de la página
anterior para limitar saltos. Asistencia reemplaza el spinner por filas de
calendario o bloques de agenda. El Dashboard reinicia su límite al cambiar
semana o club. No se añaden demoras artificiales: con datos ya disponibles o
prefetch, el skeleton puede no llegar a verse.

Los estados de carga tienen un anuncio accesible; los rectángulos son
decorativos. Las validaciones de permisos continúan antes de mostrar datos.

Se revisaron tipos, formato, compilación y navegación en las rutas principales.
Se observaron y capturaron las transiciones reales de búsqueda de Familias y
cambio de mes. Se corrigieron los límites cliente de los encabezados de
Mentoras y Actividades para evitar errores de hidratación de Radix.
