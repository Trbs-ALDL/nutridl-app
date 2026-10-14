# nutriDL 3.4 · Revisión de seguridad, calidad y requisitos para publicar en tiendas

Fecha: 14 de octubre de 2026 · Versión revisada: 3.4.0

## Cómo es la app (y por qué algunos puntos no aplican)

nutriDL es una **PWA sin servidor**:
- **Sin servidor propio:** no hay base de datos, cuentas ni inicio de sesión, y los pagos no están conectados.
- **Datos:** todo lo que apuntas se guarda en el navegador de cada persona (localStorage).
- **Peticiones externas:** la única que hace la app es a **Open Food Facts**, para buscar un código de barras.

| Punto pedido | Resultado |
|---|---|
| API keys y secretos en el frontend | **Ninguno**. `gitleaks` sobre todo el historial git (12 commits) y sobre los archivos actuales: *no leaks found*. Los códigos PRO solo están como huellas SHA-256 truncadas; el archivo de códigos está fuera del repositorio. |
| Permisos de la base de datos y políticas RLS | **No aplica**: no hay base de datos en servidor. Si se añaden cuentas (p. ej. Supabase), habrá que activar RLS con políticas `auth.uid() = user_id` en todas las tablas antes de publicar. |
| Autenticación | **No aplica**: no hay cuentas. Los perfiles son locales a cada dispositivo. |
| Que un usuario no vea los datos de otro | **Garantizado por diseño**: cada navegador solo puede leer su propio almacenamiento (misma origen). Varias personas en el mismo dispositivo comparten ese almacenamiento por diseño («Añadir otra persona»). |
| Inyección SQL | **No aplica** (no hay SQL). |
| XSS | Revisado. En la 3.2 se cerró la vía real (copias de seguridad trucadas); `semgrep --config auto` no encuentra nada en el código de la app; los avisos de `innerHTML` del plugin de seguridad son de textos fijos o escapados con `esc()`. CSP estricta: solo scripts del propio sitio y conexión solo a Open Food Facts. |
| Límites de petición | Añadido: como mucho **8 consultas/minuto** a Open Food Facts, una a la vez, sin repetir el mismo código en la sesión y con **8 s** de espera máxima. |
| Dependencias vulnerables | `osv-scanner`: 2 avisos (`braces` alto, `postcss-selector-parser` medio), **solo de herramientas de desarrollo** (Tailwind 3, para generar el CSS en el ordenador). No van dentro de la app publicada (`npm audit --omit=dev`: 0). Se arreglan del todo al migrar a Tailwind 4. |
| Endpoints de API | Único endpoint: `world.openfoodfacts.org/api/v2/product/{código}` → responde 200. El buscador antiguo de OFF (`/api/v2/search`) da 503 con frecuencia; la app no lo usa (solo las herramientas internas, que ahora usan `search.openfoodfacts.org`). |
| Gestión de errores | Errores globales y promesas sin capturar → registro local. Nuevo: **pantalla de rescate** si la app no arranca (descargar datos / recargar). Nuevo: si los datos guardados estuvieran dañados, se apartan en `nutridl_profiles_rescate` antes de que nada los pise. Mensajes claros si Open Food Facts no responde o se supera el límite. |
| Registro sin información sensible | Nuevo: antes de guardar un error se quitan correos, teléfonos, números largos y textos entre comillas. Solo se guardan los 30 últimos, en el dispositivo. |
| Pagos y webhooks | **No hay nada conectado todavía**: `PAY_LINK` está vacío y no hay webhooks. El PRO funciona con prueba de 7 días y códigos. Ver «Tiendas» más abajo: en Play Store y App Store los pagos digitales tienen que ir por su sistema de compras. |
| Backups y restauración | Ya existía: copia en archivo (menú del perfil → «Guardar copia de seguridad» / «Cargar una copia»). Nuevo: **copias automáticas diarias** (3 últimas) con «Restaurar» en el menú del perfil, y petición al navegador de **almacenamiento persistente** para que no borre los datos. |
| Responsive | Todas las pestañas y ventanas comprobadas a 320 px, 375 px, 768 px y escritorio, con los nombres de producto más largos: sin desbordes ni errores. |
| Llamadas a la API y tiempos de carga | Quitada la espera de hasta **4 s** al abrir (el service worker esperaba a la red). Ahora abre al instante con lo guardado (7 ms medidos) y se actualiza por detrás. Scripts con `defer`, fuentes precargadas. Lighthouse móvil: **Rendimiento 91 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100** (primer pintado 6,3 s → 1,7 s). |
| Accesibilidad | Lighthouse 100. Contrastes ≥ 4,5:1 medidos en la 3.2/3.3, foco visible, «Saltar al contenido», zonas táctiles de 40 px, respeta «reducir movimiento». |
| Monitorización de errores y cierres | Local: registro de errores + **detección de cierres inesperados** (la app anota si la última vez se cerró de golpe). Para verlos de todos los usuarios haría falta un servicio externo (p. ej. Sentry, plan gratuito): necesita cuenta y que la política de privacidad lo explique; no se ha activado. |
| Política de privacidad | Versión 4.1: copias automáticas, registro limpio, fuentes de datos, límites, **responsable y contacto** (aannggeelltrabajos@gmail.com) y derecho a reclamar ante la AEPD. |

## Requisitos para publicar en Google Play

Forma recomendada: **Trusted Web Activity (TWA)** con Bubblewrap o PWABuilder (envuelve la web tal cual).

- [ ] Cuenta de desarrollador de Google Play (pago único de 25 $).
- [ ] Generar el paquete con PWABuilder/Bubblewrap.
- [ ] Publicar `assetlinks.json` (con la huella del certificado de firma) para que la app se abra sin barra de navegador. **Ojo:** tiene que estar en la raíz del dominio (`https://trbs-aldl.github.io/.well-known/assetlinks.json`), no dentro de `/nutridl-app/`. Hay que crear el repositorio `Trbs-ALDL.github.io` solo con ese archivo, o usar un dominio propio.
- [x] **Política de privacidad pública** con contacto: `https://trbs-aldl.github.io/nutridl-app/privacidad.html`.
- [ ] Formulario **Seguridad de los datos**: «No se recogen datos» (todo queda en el dispositivo); el código de barras va a Open Food Facts sin datos personales; la voz la procesa el servicio del sistema.
- [ ] **Apps de salud**: declarar en la Consola que es una app de salud/fitness; incluir el aviso de que no sustituye a un profesional (ya está en la app).
- [ ] Clasificación de contenido (cuestionario IARC) y público objetivo **18+** (la app ya lo indica).
- [ ] **Pagos**: el PRO es contenido digital → en la versión de Play debe venderse con **Google Play Billing**. Los códigos de activación y un enlace de pago externo no se permiten dentro de la app de Play (salvo programas específicos por país).
- [ ] Capturas, icono 512 px, gráfico destacado 1024×500, textos de la ficha.
- [ ] Prueba cerrada con 12 testers durante 14 días (obligatorio para cuentas personales nuevas).

## Requisitos para publicar en App Store (iPhone)

- [ ] Cuenta Apple Developer (99 €/año) y un Mac con Xcode (o un servicio de compilación en la nube).
- [ ] Envolver la web en una app nativa (**Capacitor** recomendado). Ojo con la norma **4.2 (funcionalidad mínima)**: Apple rechaza apps que son solo una web. Ayudan las funciones nativas: notificaciones, widget, HealthKit (peso), cámara nativa para el escáner.
- [ ] **Pagos (norma 3.1.1)**: el PRO debe venderse con **compras dentro de la app de Apple**. Los códigos de activación solo con «Códigos de oferta» de Apple.
- [ ] **Privacidad (5.1.1)**: política con contacto, «Etiquetas de privacidad» en App Store Connect («Datos no recogidos») y textos de permiso para cámara y micrófono.
- [ ] **Salud (1.4.1)**: el aviso médico ya está; no prometer resultados médicos.
- [ ] Borrado de cuenta: no aplica (no hay cuentas); «Borrar todos los datos» ya existe.

## Pendiente (necesita decisión o datos de Ángel)

1. ~~Contacto del responsable~~ → hecho en la 3.4.1: aannggeelltrabajos@gmail.com en la política, los términos y el pie de la app; añadido el derecho a reclamar ante la AEPD.
2. Pasarela de pago para la web (`PAY_LINK`) y, para tiendas, Play Billing / compras de Apple.
3. Si se quiere ver los errores de todos los usuarios: elegir servicio (p. ej. Sentry) y añadirlo a la política.
4. Migrar el CSS a Tailwind 4 para quitar los dos avisos de dependencias de desarrollo.

## Base de alimentos (3.4)

- **1.448 alimentos** en total (antes 498):
  - 279 genéricos crudos y cocinados con su ficha oficial del USDA (SR Legacy).
  - 671 productos de marca nuevos de Open Food Facts, 420 de ellos Hacendado.
- **Validación:**
  - En las marcas, las kcal de la etiqueta deben coincidir con 4·P + 4·HC + 9·G + 2·fibra (±12 %). Se descartan los nombres en otros idiomas, los productos fuera de España y los repetidos.
  - Los genéricos de siempre se compararon con el USDA. Coinciden salvo diferencias de criterio de cálculo de kcal. Se corrigieron los hidratos de los anacardos.
- **Herramientas:**
  - Marcas: `tools/marcas/off_fetch3.js` → `off_build3.js` → `off_embed.js`.
  - Genéricos: `tools/genericos/lista.js` → `build.js` (con `sr.json` del CSV oficial) → `embed.js`.
  - Auditoría: `tools/genericos/auditar.js`.
- **Importante:**
  - No cambiar los nombres ya publicados de `marcas.json` ni de `marcas_v3.json` (ni su orden): el id de cada producto sale de su marca y su nombre, y los diarios guardan ese id. Si se vuelve a descargar Open Food Facts, añadir los productos nuevos en un archivo aparte.
  - Cada entrada del diario guarda sus propias calorías y macros, así que corregir un alimento no cambia los días ya apuntados.
