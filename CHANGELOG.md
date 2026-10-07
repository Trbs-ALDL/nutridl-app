# Cambios de nutriDL

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
