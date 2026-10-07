# Negocio: Gratis / PRO, métricas y primeros usuarios

## Posicionamiento
**nutriDL, tu entrenador nutricional personal.** No es otro contador de calorías: responde a «¿qué hago ahora para acercarme a mi objetivo?». Diferencia: nutrición + Coach + objetivo físico + acompañamiento diario + privacidad (sin cuentas, sin anuncios).

## Gratis y PRO (`js/plans.js`)
- **Gratis siempre**: plan (calorías, macros, cómo se calcula), diario, escáner, peso, medidas, progreso básico, Coach básico, gym, sin anuncios.
- **PRO (4,99 €/mes · 39,99 €/año)**: IA conversacional, foto con reconocimiento, voz, menú y planificación semanal, lista de la compra inteligente, análisis avanzado, sincronización, informes avanzados.
- **Beta**: `BETA_ALL_OPEN = true` → todo abierto, nada se cobra. El botón «Me interesa PRO» mide el interés (en el dispositivo).
- Para cobrar hacen falta: cuentas (Supabase), un proveedor de pago (Stripe; en las tiendas de apps, sus propios pagos), términos de venta, derecho de desistimiento y facturación. **No activar pagos antes.**

## Métricas
**Métrica clave (North Star):** personas que apuntan comidas y vuelven al menos 7 días.

Hoy se miden en cada dispositivo (`js/analytics.js`, visibles en «Informe de errores»): primer uso, días activos, días con comidas, plan completado, primera comida, retención a 1, 7 y 30 días, interés en PRO.
Para verlas de todos los usuarios: Plausible o Umami (sin cookies, ~9 €/mes o gratis autoalojado), solo eventos anónimos y con aviso en la política de privacidad. `ANALYTICS_ENDPOINT` está preparado y vacío.

## Presupuesto inicial: 500 €
| Prioridad | Gasto | Para qué |
|---|---|---|
| 1. Producto | 0 € | GitHub Pages es gratis |
| 2. Dominio | ~15 €/año | nutridl.es o similar (más confianza) |
| 3. Validación | 0-9 €/mes | Analítica sin cookies cuando haya 50+ usuarios |
| 4. Legal | ~150-300 € | Revisión de privacidad/términos por un especialista antes de cobrar |
| 5. IA | Reservar ~100 € | Créditos del modelo para la beta PRO, con límites por usuario |
| Publicidad | 0 € | **No** hasta demostrar retención a 7 días |

## Primeros 100 usuarios (sin anuncios)
1. Amigos, familia y gente del gym: pedirles que la instalen y la usen 7 días; preguntar qué falta.
2. Entrenadores personales y dietistas locales: herramienta gratis para sus clientes (PDF del plan).
3. Contenido corto (TikTok/Instagram/Reels): «¿Qué ceno con 600 kcal?» resuelto con la app en 15 segundos.
4. Comunidades (Reddit r/fitnessES, foros, Discord de gym): aportar valor, sin spam.
5. Medir cada semana: cuántos completan el plan, apuntan su primera comida y vuelven a los 7 días.

Después: 500 usuarios (mejorar lo que más se usa) → 1.000 (activar cuentas, sincronización y PRO).
