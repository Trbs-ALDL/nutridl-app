# Cambios de nutriDL

## 3.0.1 · 8 de octubre de 2026

**Arreglado**
- En portátiles (1024-1279 px) las pestañas, «Crear perfil» y los botones de la portada ya no se parten en dos líneas.

## 3.0.0 · 8 de octubre de 2026 · «Tu entrenador nutricional personal»

**Nuevo**
- **Hoy**: tu objetivo, calorías y macros de un vistazo, «¿Qué hago ahora?» (próxima comida con calorías y proteína recomendadas), accesos rápidos (voz, foto, buscar, escanear), racha y el dato de tu semana.
- **Coach**: pregúntale «¿Cuánto me queda?», «¿Qué ceno?», «Voy a cenar fuera», «Quiero un desayuno de 40 g de proteína» o dile lo que has comido y lo apunta (siempre con confirmación). Cada respuesta indica si es un dato tuyo, una estimación o una recomendación. Funciona en tu dispositivo.
- **¿Qué como?**: platos con los gramos ajustados a lo que te queda, según tu dieta, alergias, lo que no te gusta, tu presupuesto y lo que tienes en casa. Con receta.
- **Menú del día** (3, 4 o 5 comidas) con gramos exactos y **lista de la compra** para hoy, 3 días o la semana, agrupada y para compartir.
- **Registro por voz** y **foto del plato** (estimación aproximada, editable).
- **Mi progreso**: tu semana, racha, tendencia del peso medio, peso objetivo, gráfica de medidas, mensajes que interpretan tus datos y 12 logros.
- Celebraciones discretas: proteína conseguida, día completado, rachas de 7 a 100 días.
- Asistente más completo: entrenamiento, dieta, alergias y número de comidas, y «Tu plan personal» explicado.
- Landing para quien llega por primera vez, pantalla nutriDL PRO (en beta todo es gratis) y recordatorio diario en el calendario.
- Diario: macros de cada alimento, duplicar en otra comida u otro día y «≈ estimado» en lo aproximado.
- 10 platos típicos (cocido, fabada, salmorejo, churros…) y raciones habituales para café, cerveza, vino y refrescos.

**Arreglado**
- «Restablecer» en Mi plan pide confirmación y ya no borra medidas, comidas guardadas ni preferencias (solo los datos de la calculadora).
- El menú del perfil se desplaza en móviles de pantalla baja.

**Cambiado**
- La calculadora pasa a llamarse «Mi plan» (con «Cómo se ha calculado» y tus preferencias de comida); la app abre en «Hoy».
- Barra inferior de 5 secciones (Hoy, Diario, Coach, Progreso, Gym); en pantallas grandes, barra superior.

**Por dentro**
- Nuevos módulos: engine, parser, insights, coach, plans y analytics (medición de uso solo en el dispositivo).
- Política de seguridad de contenidos (CSP) y privacidad actualizada.
- 7 pruebas automáticas nuevas (14 en total).
- La copia en un solo archivo (tools/bundle.js) vuelve a funcionar con las marcas de versión.

## 2.1.4 · 7 de octubre de 2026

**Arreglado**
- Las actualizaciones llegan al momento: con internet la app siempre carga la versión más nueva (sin conexión usa la copia guardada) y, si se publica una versión con la app abierta, se recarga sola una vez.
- Cada archivo lleva una marca de versión para que nunca se mezclen archivos de versiones distintas.

## 2.1.3 · 7 de octubre de 2026

**Cambiado**
- Calculadora: tras pulsar «Aceptar», edad, peso y estatura quedan bloqueados para no moverlos sin querer al deslizar en el móvil. Para cambiarlos, «Editar datos» y después «Aceptar».

## 2.1.2 · 7 de octubre de 2026

**Arreglado**
- Móvil: la fila de fechas del diario se salía de la pantalla al cambiar de día y el botón «Volver a hoy» quedaba cortado y difícil de pulsar. Ahora la fila siempre cabe (comprobado a 320 y 375 px).

**Nuevo**
- Aviso cuando hay una versión nueva de la app mientras la tienes abierta.

## 2.1.1 · 7 de octubre de 2026

**Arreglado**
- Diario: el botón «Hoy» ahora indica el día que ves; en otro día pasa a «Volver a hoy» y el resumen dice «Ayer», «Mañana» o la fecha.
- Las gráficas de peso y de progreso del gym se dibujan al ancho real de la pantalla: en el móvil la letra se lee bien y tienen líneas de referencia con los kilos.

**Por dentro**
- Nueva herramienta tools/bundle.js para guardar la app en un solo archivo HTML.

## 2.1.0 · 7 de octubre de 2026

**Nuevo**
- Se instala en el móvil como una app (icono propio, pantalla completa, accesos directos) y funciona sin conexión.
- Escáner de código de barras en el diario (cámara o escribiendo el código), con los datos de Open Food Facts; el producto queda guardado en «Mis alimentos».
- Comidas guardadas: guarda una comida del diario («mi desayuno de siempre») y añádela de un toque.
- Gym: entrenos guardados con opción de editar o borrar, gráfica de progreso de cada ejercicio (desde «Mis pesos más altos») y temporizador de descanso opcional.
- Medidas corporales (cintura, cadera, pecho, brazo, muslo) con la diferencia desde la primera medida.
- Páginas de privacidad y términos de uso, «Borrar todos los datos» e informe de errores que se guarda solo en el dispositivo.
- Pruebas automáticas que se ejecutan en GitHub en cada cambio.

**Quitado**
- El menú del día automático (y la lista de la compra, el menú semanal, los favoritos y «no me gusta»).
- Código que ya no se usaba: generador de rutinas antiguo, sesión de entreno a pantalla completa, WhatsApp, proyección de peso.

**Arreglado**
- El asistente decía «Paso 1 de 9» cuando son 5 pasos.
- Algunos textos que debían ir en una línea se partían en varias.
- El panel de inicio mostraba cifras antiguas si un perfil se quedaba sin datos.

**Por dentro**
- La app pasa de un solo archivo a varios (HTML, CSS, JavaScript por partes, fuentes e iconos), con herramientas para regenerarlos.

## 2.0 · 7 de octubre de 2026
- Calculadora con campos vacíos y botón «Aceptar».
- Gym a tu medida: eliges tus días y apuntas tus ejercicios y pesos; «Mis pesos más altos» al completar la semana.

## 1.0 · 7 de octubre de 2026
- Primera versión publicada.
