# Estado de nutriDL y plan «todo por encima del 7»

> **Para Claude: lee este archivo antes de explorar el código o medir nada.**
> Evita repetir lighthouse, greps de estructura y auditorías ya hechas.
> Si una cifra tiene más de un mes o tocas la zona, vuelve a medirla y actualiza aquí.

Última medición: **20 de octubre de 2026** · versión **3.8.1**

> **22-10-2026 · 3.13.0:** ronda con las skills de negocio. Competencia y voz del cliente en `docs/COMPETENCIA.md` (580 reseñas de Play ES: el dolor nº 1 del mercado es «todo es de pago»). Hecho: aviso de fin de prueba PRO, «Seguir gratis» en la pantalla PRO, enlace a la app en PDF y lista de la compra, notas propias + 5 rankings en las páginas SEO (1.920 direcciones en el sitemap), ficha de Play optimizada. Pruebas: 54 pasan. Copia: «appdura 19.0» = 3.12.0 (la próxima es la 20.0).
> **Pendiente de decisión de Ángel:** promesa pública «lo gratis seguirá gratis», nuevo titular de portada, recomposición corporal + macros a mano + exportar a CSV (lo más pedido en las reseñas), capturas de Play con textos.

## 1. Lo que ya está medido (no repetir)

| Medición | Resultado | Cómo se midió |
|---|---|---|
| Lighthouse escritorio | 99 / 100 / 100 / 100 | `lighthouse <url> --preset=desktop` |
| Lighthouse móvil | 88 / 100 / 100 / 100 | `lighthouse <url>` |
| LCP móvil | 3,1 s · CLS 0 · TBT 170 ms | idem |
| Peso de la portada | 364 KiB | idem |
| Pruebas | 34 pasan, 0 fallan | `npm test` |
| Alimentos | 2.280 (1.909 con azúcares, 1.508 de marca) | `js/data/foods.js` |
| Páginas SEO | 1.913 en `alimentos/` + sitemap de 1.915 | `npm run seo` |
| Código JS | 4.687 líneas en 19 archivos | `wc -l js/*.js` |
| Secretos | gitleaks limpio | `gitleaks detect --source . --redact` |
| Dependencias | 2 avisos, solo herramientas de construcción | `osv-scanner scan source -r .` |

Archivos más grandes: `coach.js` 688 · `diary.js` 560 · `gym.js` 489 · `engine.js` 360.

## 2. Puntuación por apartados (20-10-2026)

**Por encima del 7 — no tocar, ya están bien:**
velocidad escritorio 9,9 · velocidad móvil 8,8 · accesibilidad 9 · buenas prácticas 10 ·
SEO técnico 10 · sin internet 9 · sensación de app 9 · seguridad 8 ·
funciones 9 · base de alimentos 8,5 · diseño 8 · primera vez 8 · legal 7,5

**Por debajo del 7 — objetivo de este plan:**

| Apartado | Ahora | Meta | Decisión de Ángel (20-10-2026) |
|---|---|---|---|
| Saber cuánta gente la usa | 2 | 8 | Cloudflare Web Analytics (gratis, sin cookies) |
| ~~Idiomas~~ | ~~3~~ **8,5** | ✅ | HECHA en la 3.12.0 · ES/EN completo; faltan los nombres de marca y las páginas SEO |
| Estar en Play Store | 3 | 7 | Guía en `PLAY-STORE.md`; falta cuenta y 12 testers |
| Cobrar | 3 | 7 | Códigos a mano ahora; Stripe cuando llegue el momento |
| Guardar datos en la nube | 4 | 8 | **Supabase gratis**: cuentas, sincronización y PRO no falseable |
| ~~Coach «inteligente»~~ | ~~5~~ **7,5** | ✅ | Hecho en la 3.9.0 · reglas, sin IA |
| ~~Que la gente vuelva~~ | ~~5,5~~ **7,5** | ✅ | Hecho en la 3.10.0 · push real queda para la F5 |
| Pruebas automáticas | 6,5 → **7,5** | 9 | 51 pruebas. Para un 9 hacen falta ~100 (diario, perfiles, gym) |

## 3. Plan por fases

Marca cada fase como HECHA aquí al terminarla.

- [x] **F1 · Coach que parece IA** — HECHA en la 3.9.0 (20-10-2026). Nota 5 → 7,5.
  Memoria de 20 min (`coachCtx`, `followUp()` en `js/coach.js`), 13 temas nuevos en `RX`,
  frases variables con `vary()`, y una pregunta ya no se apunta sola en el diario.
  Pruebas en `tests/v39.test.js`. Pendiente si se quiere subir más: notas de voz y
  que recuerde entre días (ahora el chat se borra cada día, a propósito).
- [ ] **F2 · Analítica** · Ángel crea cuenta en Cloudflare → una línea en `index.html`.
- [x] **F3 · Enganche** — HECHA en la 3.10.0 (20-10-2026). Nota 5,5 → 7,5.
  `dayMoment()` en `js/insights.js` + tarjeta `.nd-moment` arriba de «Hoy»: racha en peligro,
  resumen semanal (lunes a miércoles), vuelta tras 3+ días y oferta del recordatorio `.ics`.
  Como mucho un aviso al día (`state.moments`). Pruebas en `tests/v310.test.js`.
  **Lo que falta para un 9**: avisos de verdad al móvil (push), y eso necesita servidor → va con la F5.
- [ ] **F4 · Pruebas** · subir de 34 a ~55 cubriendo Coach, diario y perfiles.
- [ ] **F5 · Nube (Supabase)** · la más grande, en 3 pasos: cuentas → sincronizar → PRO real.
- [x] **F6 · Inglés (ES / EN)** — HECHA en la 3.12.0 (21-10-2026). Nota 3 → 8,5.
  Selector ES/EN en el menú del perfil (`I18N_READY = true`). Cobertura del comprobador: **100 %**
  (1.382 textos con inglés, 0 sin marcar). Medir siempre con `node tools/i18n-check.js`
  (y `--faltan` / `--sin-en`); el comprobador ya marca como fallo **cualquier** texto de `index.html`
  con letras que no esté marcado (la lista de excepciones es `IGUAL`, dentro de `tools/i18n-check.js`).
  - Motor: `js/i18n.js` (`tr()`, `tk()`, `tp()`, `setLang()`, `locale()`, `dateTxt()`, `pctTxt()`,
    `eur()`, `foodName()`, `applyStaticI18n()` — que también cambia `content`, `alt` y el `href`
    de las páginas legales con `data-t-hr`). Diccionario: `js/data/lang-en.js`.
  - Nombres de alimentos genéricos en inglés: `js/data/foods-en.js` (772, por id). `foodName(f)` usa
    `f.en` si existe y si no esa tabla. El buscador (`matchFoods`) mira los dos idiomas a la vez.
  - El Coach y el lector de comidas entienden inglés: patrones `RX` y `FOLLOW` (coach.js),
    `NUM_WORDS`, `UNIT_WORDS`, `STOP`, `PHRASES_EN`, `CANON` y `SLOT_HINTS` (parser.js),
    y `SHOP_FILL` / `NEG` / `ALLERGY_WORDS` (kitchen.js). Dictado por voz con `locale()`.
  - Páginas legales en inglés: `privacy.html` y `terms.html`.
  - **Lo que sigue en español, a propósito o pendiente:**
    1. Los 1.508 productos **de marca** (McDonald's, Hacendado, Danone…). Un producto se llama
       como se llama; traducirlos es una decisión, no un fallo. 1.112 llevan alguna palabra
       en español («Hamburguesa con queso»). Si se hace: añadir su `en` a `js/data/foods-en.js`.
    2. Las 1.913 páginas públicas «Calorías de…» (`npm run seo`): decidir si se generan en inglés.
    3. Los mensajes **ya guardados** del chat conservan el idioma en el que se escribieron
       (se guardan como HTML). El chat se vacía cada día, así que se arregla solo.

- [ ] **F8 · Subir a 9 lo que está en 7,5** (encargo del 20-10-2026)
  - **Coach 7,5 → 9**: inglés HECHO en la 3.12.0 (entiende las mismas preguntas en los dos idiomas).
    Queda: más temas y que el lector de comidas acepte frases sueltas mejor. Sin IA externa, por decisión de Ángel.
  - **Enganche 7,5 → 9**: necesita avisos de verdad al móvil (push) → depende de la F5 (servidor).
    Sin servidor no se puede pasar de 7,5 honestamente.
  - **Pruebas 7,5 → 9**: de 51 a ~100, cubriendo diario, perfiles, gym y calculadora.
- [ ] **F7 · Play Store** · cuenta de desarrollador y 12 testers (necesita a Ángel).

## 4. Lo que necesita a Ángel (no lo puede hacer Claude)

1. Cuenta gratis en **cloudflare.com** → Web Analytics → copiar el token. (F2)
2. Cuenta gratis en **supabase.com** → proyecto nuevo → copiar URL y clave pública. (F5)
3. Cuenta de **Google Play** (25 $ una vez) y 12 personas que prueben 14 días. (F7)
4. Dominio propio (opcional, pero subiría el SEO de 7,5 a 9).

## 5. Atajos que ahorran tiempo

- Copia de seguridad **antes de cualquier cambio**:
  `node tools/bundle.js "C:/Users/angel/Desktop/Trbs-aldl/Nutri versions/appdura N.0.html"`
  Hecha hasta la **17.0** → la próxima es la 18.0.
- Tras tocar `js/data/foods.js`: `npm run seo`. Tras tocar clases o iconos: `npm run build`.
- Publicar: subir `APP_VERSION` (js/core.js), `package.json` y `CHANGELOG.md`, luego commit y push a `main`.
- Los códigos PRO están **fuera del repo**, en `Desktop/Trbs-aldl/Nutri versions/`. Nunca mostrarlos.
- **Texto dentro de un `onclick`**: `esc()` solo vale para el contenido HTML. Dentro de un atributo
  `onclick` hay que hacer `esc(JSON.stringify(texto))`, porque el navegador deshace `&#39;` antes de
  leer el JavaScript y un nombre con apóstrofo (o con código) se saldría de la cadena.
