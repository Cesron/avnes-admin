# Notificaciones, fotos e hidratación de Familias

- Sonner utilizaba `theme="light"`. Ahora sigue `resolvedTheme` de next-themes,
  incluyendo cuando la preferencia es Sistema.
- El diálogo de creación y su botón con `asChild` se renderizan dentro de una
  misma frontera cliente. Se conserva la consulta del código sugerido en el
  servidor. Esto evita pasar un hijo de servidor transmitido de forma diferida
  al Slot de Radix, que omitía el botón en el HTML inicial.
- El aviso del script de ThemeProvider apareció durante la recuperación de ese
  error de hidratación. No se ocultan errores ni se desactiva SSR globalmente.
- Las fotos públicas de Drive utilizan next/image y su caché, con una lista
  permitida limitada a `https://lh3.googleusercontent.com/d/*`. Otros dominios
  conservan la carga directa. La lista usa tamaños de miniatura y carga diferida;
  la vista ampliada solicita una resolución mayor.
- Una foto que falla tiene un estado explícito. Los enlaces originales siguen
  disponibles y no se cambian permisos ni datos de Drive.
- La conversión de URL verifica el host: un parámetro `id` en otro sitio ya no
  se interpreta como un archivo de Drive. URL inválidas y esquemas no HTTP(S)
  no se usan como imágenes.

## Verificación

`node --import tsx --test tests/family-images.test.ts`, TypeScript, Biome y
`npm run build` completados correctamente. En producción se comprobaron:

- Error y éxito en tema oscuro, y éxito al cambiar al tema claro.
- Las 24 fotos de la primera página cargadas, más navegación a la siguiente.
- Apertura de Agregar Familia y foto ampliada, sin guardar datos de familias.
- Consola sin errores de hidratación ni del script en esas comprobaciones.

También se verificó el diálogo y la consola con Turbopack después de reiniciar
el servidor de desarrollo en el puerto 3000.

Se detectó un enlace de Google Docs en el campo Foto de la familia 0117, igual
al de su biografía. Requiere reemplazarlo por el enlace de la foto correspondiente.
No se modificó ese dato.
