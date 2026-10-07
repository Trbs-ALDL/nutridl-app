# nutriDL

Calculadora de calorías e IMC, diario de comidas con escáner de código de barras y registro de entrenos de gimnasio. Se instala en el móvil como una app y funciona sin conexión.

**Web:** https://trbs-aldl.github.io/nutridl-app/

## Qué incluye

- **Calculadora:** gasto basal (Mifflin-St Jeor), mantenimiento, calorías objetivo según tu caso, IMC con la clasificación de la OMS y macros.
- **Comidas:** diario por comidas con buscador (unos 260 alimentos genéricos y 129 de marca), escáner de código de barras (Open Food Facts), comidas guardadas y alimentos propios.
- **Gym:** tú eliges tus días y apuntas tus ejercicios y pesos; temporizador de descanso, entrenos guardados (editar / borrar), pesos más altos al completar la semana y gráfica de progreso por ejercicio.
- **Progreso:** peso con media de 7 días y medidas corporales.
- **Perfiles** para varias personas, copias de seguridad, PDF para clientes, informe de errores local y borrado total de datos.

Los datos se guardan solo en el dispositivo de cada persona (consulta [privacidad.html](privacidad.html)).

## Estructura

```
index.html            la app (HTML)
css/                  tailwind.css (generado), app.css (estilos propios), icons.css (generado), fonts.css, legal.css
js/core.js            configuración, estado, guardado y utilidades (se carga primero)
js/data/foods.js      base de alimentos (genéricos + marcas entre // <marcas> … // </marcas>)
js/data/exercises.js  ejercicios para el buscador del gym
js/calc.js            calculadora           js/progress.js   peso y medidas
js/diary.js           diario, escáner, comidas guardadas
js/gym.js             gym                   js/pdf.js        PDF e impresión
js/wizard.js          asistente de perfil   js/profiles.js   perfiles y copias
js/dashboard.js       panel de inicio       js/app.js        pestañas, hojas, informe de errores
js/main.js            arranque, instalación como app y modo sin conexión (se carga el último)
sw.js                 service worker (generado)
tests/                pruebas automáticas
tools/                herramientas (ver abajo)
```

## Trabajar en la app

Requisito: Node.js 20 o superior.

```bash
npm install          # una vez: instala Tailwind, Font Awesome y subset-font
npm start            # servidor local en http://localhost:8766 (sin caché)
npm run build        # tras cambiar clases o iconos: regenera iconos, CSS y sw.js
npm test             # pruebas automáticas (también se ejecutan en GitHub en cada cambio)
```

Antes de subir cambios: `npm run build` y `npm test`. Sube también la versión en `js/core.js` (`APP_VERSION`), `package.json` y [CHANGELOG.md](CHANGELOG.md).

En local el modo sin conexión está desactivado para no ver versiones antiguas; para probarlo abre `http://localhost:8766/?sw=1`.

### Productos de marca

`tools/marcas/`: `off_fetch.js` → `off_fetch2.js` (descargan de Open Food Facts a `cache_off/`) → `off_build.js` (elige y **valida** cada producto) → `off_embed.js` (los mete en `js/data/foods.js`). Para añadir un producto, añade una línea `t(...)` en `off_build.js` y repite los dos últimos pasos.

## Datos y licencias

- Alimentos genéricos: USDA FoodData Central y BEDCA. Productos de marca: [Open Food Facts](https://world.openfoodfacts.org), licencia [ODbL](https://opendatacommons.org/licenses/odbl/1-0/).
- Iconos: Font Awesome Free (CC BY 4.0 / SIL OFL 1.1 / MIT). Fuente: Plus Jakarta Sans (SIL OFL 1.1).

## Aviso

nutriDL es una herramienta educativa y orientativa; no sustituye el consejo de un médico o dietista-nutricionista.
