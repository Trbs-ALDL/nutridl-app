# Hoja de ruta

## Hecho en 2.1
Instalable y sin conexión · escáner de código de barras · comidas guardadas · editar/borrar entrenos · progreso por ejercicio · temporizador de descanso · medidas corporales · privacidad y términos · informe de errores local · código dividido en partes con pruebas automáticas.

## Siguiente: cuentas y nube (pendiente de elegir servicio)
Recomendado: **Supabase** (inicio de sesión con email/Google y base de datos; sirve también para el modo entrenador).

1. Crear el proyecto en supabase.com y apuntar su URL y su clave pública (la «anon key»; nunca la clave de servicio).
2. Tablas: `profiles` (datos de la calculadora), `diary_entries`, `weights`, `measures`, `workouts`, `saved_meals`, `custom_foods`, todas con `user_id` y Row Level Security (cada persona solo ve lo suyo).
3. En la app: módulo `js/sync.js` que, con sesión iniciada, sube los cambios y descarga los de otros dispositivos. El guardado local (`save()` en `js/core.js`) se mantiene como copia sin conexión.
4. Al iniciar sesión por primera vez: ofrecer pasar los perfiles locales (`nutridl_profiles`) a la cuenta, sin perder nada.
5. Actualizar la política de privacidad **antes** de activarlo (datos de salud en un servidor: base legal, encargado del tratamiento, ubicación de los datos, plazo de conservación) y pedir consentimiento explícito.
6. «Borrar mi cuenta» que elimine también los datos del servidor.

## Después: modo entrenador
- Rol «entrenador» que invita a clientes; el cliente acepta compartir su diario, peso y entrenos.
- Panel del entrenador con sus clientes, y asignación de días de gym.
- Requiere la nube y revisar de nuevo la privacidad (terceros con acceso a datos de salud).

## Ideas
- Tiendas de apps con Capacitor (Google Play / App Store).
- Recordatorios (notificaciones) para apuntar comidas o entrenar.
- Inglés y libras (lb).
