// nutriDL · Ejercicios de gimnasio (para el buscador y las recomendaciones)
'use strict';

// =====================================================================
//  AÑADIDO: GYM — ejercicios (eq: g gimnasio · d mancuernas en casa · b sin material)
// =====================================================================
const EX = [];
function X(id, name, pat, eq, type, group, sec, cue, o = {}) { EX.push({ id, name, pat, eq, type, group, sec, cue, ...o }); }
// Sentadilla / dominante de rodilla
X('sq_barra', 'Sentadilla con barra', 'squat', 'g', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Pies a la anchura de los hombros; baja controlando hasta que el muslo quede paralelo y sube empujando el suelo.', { ev: 'Bajar profundo (muslo por debajo de la paralela) hace crecer más glúteo y aductores que la media sentadilla (Kubo 2019).', top: 1 });
X('prensa', 'Prensa de piernas', 'squat', 'g', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Espalda bien apoyada; baja hasta 90° de rodilla sin despegar la zona lumbar.', { easy: 1, ev: 'Permite mucho volumen de cuádriceps con poca fatiga lumbar. Baja lo más profundo que puedas sin despegar la lumbar.' });
X('hack', 'Sentadilla hack (máquina)', 'squat', 'g', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Espalda pegada al respaldo; baja profundo controlando y sube sin bloquear rodillas.', { easy: 1, ev: 'Máquina estable que permite bajar profundo con seguridad: ideal para cargar mucho el cuádriceps.' });
X('multipower', 'Sentadilla en multipower', 'squat', 'g', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Pies algo adelantados; baja recto con la espalda neutra.');
X('goblet', 'Sentadilla goblet', 'squat', 'gd', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Mancuerna pegada al pecho, torso erguido y codos entre las rodillas.', { easy: 1 });
X('bulgara', 'Sentadilla búlgara', 'squat', 'gdb', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Pie trasero sobre un banco; baja en vertical hasta casi tocar el suelo con la rodilla.', { ev: 'Trabaja cuádriceps y glúteo en posición estirada, una pierna cada vez.' });
X('zancada', 'Zancadas', 'squat', 'gdb', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Paso largo; baja la rodilla trasera hacia el suelo y empuja con el talón delantero.', { easy: 1 });
X('stepup', 'Subida al banco (step-up)', 'squat', 'gdb', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Sube empujando con la pierna de arriba, sin impulsarte con la de abajo.', { easy: 1 });
X('sq_bw', 'Sentadilla con peso corporal (lenta)', 'squat', 'b', 'comp', 'Cuádriceps', 'Isquios y glúteos', 'Baja en 3 s, pausa 1 s abajo y sube con fuerza.', { easy: 1 });
// Bisagra de cadera
X('rumano_barra', 'Peso muerto rumano con barra', 'hinge', 'g', 'comp', 'Isquios y glúteos', 'Espalda', 'Rodillas algo flexionadas; lleva la cadera atrás con la espalda neutra hasta notar estiramiento.', { ev: 'Carga los isquios estirados: de los mejores para la parte posterior del muslo. Combínalo con un curl femoral.', top: 1 });
X('pm_conv', 'Peso muerto convencional', 'hinge', 'g', 'comp', 'Isquios y glúteos', 'Espalda', 'Barra pegada a las piernas, espalda neutra; empuja el suelo y extiende cadera y rodillas a la vez.');
X('rumano_mc', 'Peso muerto rumano con mancuernas', 'hinge', 'gd', 'comp', 'Isquios y glúteos', 'Espalda', 'Mancuernas pegadas a las piernas; cadera atrás y espalda neutra.', { easy: 1 });
X('hipthrust', 'Hip thrust', 'hinge', 'gd', 'comp', 'Isquios y glúteos', '', 'Espalda alta apoyada en un banco; sube la cadera apretando glúteos y aguanta 1 s arriba.', { ev: 'Para el glúteo, el hip thrust y la sentadilla dan un crecimiento parecido (Plotkin 2023): úsalo como complemento, no como sustituto.' });
X('hiperext', 'Hiperextensiones a 45°', 'hinge', 'g', 'comp', 'Isquios y glúteos', 'Espalda', 'Bisagra desde la cadera; sube hasta alinear el cuerpo sin hiperextender la zona lumbar.', { easy: 1 });
X('pullthrough', 'Pull-through en polea', 'hinge', 'g', 'comp', 'Isquios y glúteos', '', 'De espaldas a la polea, lleva la cadera atrás y extiende apretando glúteos.', { easy: 1 });
X('pm1', 'Peso muerto a una pierna', 'hinge', 'db', 'comp', 'Isquios y glúteos', '', 'Cadera atrás, la pierna libre se estira hacia atrás y la espalda queda neutra.');
X('hipthrust1', 'Hip thrust a una pierna', 'hinge', 'db', 'comp', 'Isquios y glúteos', '', 'Espalda en el sofá o un banco; sube la cadera con una sola pierna.');
X('puente', 'Puente de glúteo', 'hinge', 'b', 'comp', 'Isquios y glúteos', '', 'Talones cerca del cuerpo; sube la cadera sin arquear la zona lumbar.', { easy: 1 });
// Empuje horizontal (pecho)
X('banca', 'Press de banca con barra', 'hpush', 'g', 'comp', 'Pecho', 'Tríceps', 'Escápulas juntas; baja la barra a la parte baja del pecho y empuja.', { ev: 'Básico de empuje: pecho, deltoides anterior y tríceps con mucha carga.', top: 1 });
X('press_maq', 'Press de pecho en máquina', 'hpush', 'g', 'comp', 'Pecho', 'Tríceps', 'Asiento a la altura del pecho; empuja sin despegar la espalda.', { easy: 1 });
X('press_mc', 'Press de pecho con mancuernas', 'hpush', 'gd', 'comp', 'Pecho', 'Tríceps', 'Codos a unos 45° del cuerpo; baja hasta notar estiramiento en el pecho.', { easy: 1, ev: 'Las mancuernas permiten más recorrido y estiramiento del pecho abajo.' });
X('inclinado', 'Press inclinado con mancuernas', 'hpush', 'gd', 'comp', 'Pecho', 'Hombros', 'Banco a 30°; empuja hacia arriba y ligeramente hacia dentro.', { ev: 'El banco inclinado reparte más trabajo hacia la parte alta (clavicular) del pecho.', top: 1 });
X('fondos', 'Fondos en paralelas', 'hpush', 'g', 'comp', 'Pecho', 'Tríceps', 'Torso algo inclinado; baja hasta 90° de codo. Usa la máquina asistida si hace falta.', { ev: 'Gran estiramiento del pecho bajo y mucho tríceps. Usa la máquina asistida si aún no puedes con tu peso.' });
X('aperturas', 'Aperturas con mancuernas', 'fly', 'gd', 'iso', 'Pecho', '', 'Codos semiflexionados fijos; abre hasta notar estiramiento y cierra en arco.');
X('cruce', 'Cruce de poleas', 'fly', 'g', 'iso', 'Pecho', '', 'Un pie adelantado; junta las manos delante del pecho en arco.', { easy: 1 });
X('flexiones', 'Flexiones', 'hpush', 'gdb', 'comp', 'Pecho', 'Tríceps', 'Cuerpo en línea recta; baja hasta casi tocar el suelo con el pecho.', { easy: 1 });
X('flex_inc', 'Flexiones con manos elevadas', 'hpush', 'b', 'comp', 'Pecho', 'Tríceps', 'Manos en un banco o mesa estable: más fácil que en el suelo.', { easy: 1 });
X('flex_decl', 'Flexiones con pies elevados', 'hpush', 'b', 'comp', 'Pecho', 'Hombros', 'Pies en una silla: más difícil y trabaja más la parte alta del pecho.');
// Empuje vertical (hombro)
X('militar', 'Press militar con barra', 'vpush', 'g', 'comp', 'Hombros', 'Tríceps', 'De pie, glúteos y abdomen firmes; empuja la barra por encima de la cabeza.', { ev: 'Empuje vertical con barra: deltoides anterior y tríceps.' });
X('press_hmaq', 'Press de hombros en máquina', 'vpush', 'g', 'comp', 'Hombros', 'Tríceps', 'Espalda apoyada; empuja sin bloquear los codos arriba.', { easy: 1 });
X('press_hombro', 'Press de hombros con mancuernas', 'vpush', 'gd', 'comp', 'Hombros', 'Tríceps', 'Sentado con respaldo; empuja sin arquear la zona lumbar.', { easy: 1 });
X('arnold', 'Press Arnold', 'vpush', 'gd', 'comp', 'Hombros', 'Tríceps', 'Empieza con las palmas hacia ti y gíralas mientras empujas.');
X('pica', 'Flexiones en pica', 'vpush', 'b', 'comp', 'Hombros', 'Tríceps', 'Cadera alta formando una V; baja la cabeza entre las manos.', { easy: 1 });
X('pica_elev', 'Flexiones en pica con pies elevados', 'vpush', 'b', 'comp', 'Hombros', 'Tríceps', 'Pies en una silla para cargar más peso en los hombros.');
// Tirón horizontal (espalda)
X('remo_barra', 'Remo con barra', 'hpull', 'g', 'comp', 'Espalda', 'Bíceps', 'Torso inclinado ~45° y espalda neutra; tira de la barra hacia el ombligo.', { ev: 'Tirón horizontal pesado: grosor de la espalda (dorsal, trapecio medio, romboides).' });
X('remo_polea', 'Remo en polea baja', 'hpull', 'g', 'comp', 'Espalda', 'Bíceps', 'Pecho alto; lleva los codos atrás juntando escápulas.', { easy: 1 });
X('remo_maq', 'Remo en máquina con pecho apoyado', 'hpull', 'g', 'comp', 'Espalda', 'Bíceps', 'Pecho pegado al apoyo; tira con los codos hacia atrás.', { easy: 1, ev: 'Con el pecho apoyado no cansa la zona lumbar: toda la fuerza va a la espalda.', top: 1 });
X('remo_mc', 'Remo con mancuerna a una mano', 'hpull', 'gd', 'comp', 'Espalda', 'Bíceps', 'Mano y rodilla en el banco; lleva el codo hacia la cadera.', { easy: 1 });
X('remo_incl', 'Remo con mancuernas en banco inclinado', 'hpull', 'gd', 'comp', 'Espalda', 'Bíceps', 'Boca abajo en el banco a 30-45°; tira de las dos mancuernas a la vez.');
X('remo_inv', 'Remo invertido bajo una mesa firme', 'hpull', 'b', 'comp', 'Espalda', 'Bíceps', 'Cuerpo recto; tira del pecho hacia el borde de la mesa.');
X('remo_mochila', 'Remo inclinado con mochila cargada', 'hpull', 'b', 'comp', 'Espalda', 'Bíceps', 'Torso inclinado y espalda neutra; tira de la mochila hacia el ombligo.', { easy: 1 });
// Tirón vertical (espalda)
X('jalon', 'Jalón al pecho', 'vpull', 'g', 'comp', 'Espalda', 'Bíceps', 'Pecho alto; lleva la barra a la clavícula sin balancearte.', { easy: 1, ev: 'Tirón vertical: el dorsal ancho trabaja desde una posición muy estirada.', top: 1 });
X('jalon_neutro', 'Jalón con agarre estrecho neutro', 'vpull', 'g', 'comp', 'Espalda', 'Bíceps', 'Lleva el agarre al pecho bajando los codos pegados al cuerpo.', { easy: 1 });
X('dominadas', 'Dominadas (o asistidas)', 'vpull', 'gdb', 'comp', 'Espalda', 'Bíceps', 'Sube hasta pasar la barbilla de la barra. Si aún no puedes, usa la máquina de dominadas asistidas.', { ev: 'El mejor tirón vertical con tu propio peso. Si aún no te salen, usa la máquina asistida o el jalón.' });
X('dom_neg', 'Dominadas negativas', 'vpull', 'gdb', 'comp', 'Espalda', 'Bíceps', 'Sube de un salto o con un banco y baja muy despacio (3-5 s).', { easy: 1 });
X('pullover', 'Pullover con mancuerna', 'vpull', 'd', 'comp', 'Espalda', 'Pecho', 'Tumbado en el banco, baja la mancuerna detrás de la cabeza con los codos semiflexionados.', { easy: 1 });
// Hombro lateral y posterior
X('elev_lat', 'Elevaciones laterales con mancuernas', 'lateral', 'gd', 'iso', 'Hombros', '', 'Codos algo flexionados; sube hasta la altura de los hombros sin impulso.', { easy: 1, ev: 'El deltoides lateral apenas trabaja en los presses: necesita trabajo directo para dar anchura de hombros.' });
X('elev_lat_polea', 'Elevaciones laterales en polea', 'lateral', 'g', 'iso', 'Hombros', '', 'Polea baja por detrás del cuerpo; sube el brazo hasta la altura del hombro.', { ev: 'La polea mantiene la tensión también abajo, donde la mancuerna apenas pesa.', top: 1 });
X('elev_lat_maq', 'Elevaciones laterales en máquina', 'lateral', 'g', 'iso', 'Hombros', '', 'Codos apoyados en los rodillos; sube controlando.', { easy: 1 });
X('elev_lat_b', 'Elevaciones laterales con botellas o mochila', 'lateral', 'b', 'iso', 'Hombros', '', 'Usa botellas de agua o una mochila; sube lento hasta la altura del hombro.', { easy: 1 });
X('facepull', 'Face pull en polea', 'reardelt', 'g', 'iso', 'Hombros', 'Espalda', 'Tira de la cuerda hacia la cara separando las manos al final.', { easy: 1, ev: 'Deltoides posterior y parte alta de la espalda: equilibra todo el trabajo de empuje.', top: 1 });
X('contractor', 'Contractor inverso (máquina)', 'reardelt', 'g', 'iso', 'Hombros', 'Espalda', 'Brazos casi rectos; abre hacia atrás juntando escápulas.', { easy: 1 });
X('pajaros', 'Pájaros con mancuernas', 'reardelt', 'gd', 'iso', 'Hombros', 'Espalda', 'Torso inclinado; abre los brazos en cruz sin impulso.');
X('yt', 'Elevaciones Y-T en el suelo', 'reardelt', 'gdb', 'iso', 'Hombros', 'Espalda', 'Boca abajo, eleva los brazos en forma de Y y luego de T apretando escápulas.', { easy: 1 });
// Brazos
X('curl_barra', 'Curl de bíceps con barra', 'biceps', 'g', 'iso', 'Bíceps', '', 'Codos pegados al cuerpo; sube sin balancear el tronco.');
X('curl_polea', 'Curl de bíceps en polea', 'biceps', 'g', 'iso', 'Bíceps', '', 'Codos fijos; aprieta arriba y baja controlando.', { easy: 1 });
X('curl_mc', 'Curl de bíceps con mancuernas', 'biceps', 'gd', 'iso', 'Bíceps', '', 'Gira la palma hacia arriba al subir; baja en 2-3 s.', { easy: 1 });
X('curl_incl', 'Curl inclinado con mancuernas', 'biceps', 'gd', 'iso', 'Bíceps', '', 'Banco a 45°, brazos colgando por detrás del cuerpo: más estiramiento.', { ev: 'Con el brazo por detrás del cuerpo el bíceps trabaja estirado; entrenar el músculo en posición estirada tiende a dar más hipertrofia (Wolf 2023).', top: 1 });
X('martillo', 'Curl martillo', 'biceps', 'gd', 'iso', 'Bíceps', '', 'Palmas enfrentadas durante todo el movimiento.', { easy: 1 });
X('curl_mochila', 'Curl con mochila cargada', 'biceps', 'b', 'iso', 'Bíceps', '', 'Agarra la mochila por el asa; codos pegados al cuerpo.', { easy: 1 });
X('ext_polea', 'Extensión de tríceps en polea', 'triceps', 'g', 'iso', 'Tríceps', '', 'Codos fijos junto al cuerpo; estira del todo abajo.', { easy: 1, ev: 'Fácil de aprender y de progresar; complementa bien a la extensión por encima de la cabeza.' });
X('ext_cabeza', 'Extensión de tríceps sobre la cabeza en polea', 'triceps', 'g', 'iso', 'Tríceps', '', 'De espaldas a la polea; estira los codos por encima de la cabeza.', { ev: 'Por encima de la cabeza la porción larga del tríceps trabaja estirada: creció bastante más que con la extensión con los brazos abajo (Maeo 2023).', top: 1 });
X('frances', 'Press francés con mancuernas', 'triceps', 'gd', 'iso', 'Tríceps', '', 'Tumbado, baja las mancuernas junto a la cabeza moviendo solo los codos.');
X('patada', 'Patada de tríceps con mancuerna', 'triceps', 'gd', 'iso', 'Tríceps', '', 'Torso inclinado y codo pegado al cuerpo; estira el brazo hacia atrás.', { easy: 1 });
X('fondos_silla', 'Fondos en banco', 'triceps', 'gdb', 'iso', 'Tríceps', 'Pecho', 'Manos en el borde de un banco y piernas estiradas; baja hasta 90° de codo.', { easy: 1 });
X('flex_diam', 'Flexiones diamante (manos juntas)', 'triceps', 'b', 'iso', 'Tríceps', 'Pecho', 'Manos juntas bajo el pecho y codos pegados al cuerpo.');
// Añadidos: más opciones de gimnasio para hipertrofia
X('pecdeck', 'Contractor de pecho (pec deck)', 'fly', 'g', 'iso', 'Pecho', '', 'Codos a la altura del pecho; abre hasta notar estiramiento y cierra sin chocar las manos.', { easy: 1, ev: 'Aislamiento estable de pecho: permite acercarse al fallo con seguridad al final de la sesión.', top: 1 });
X('incl_multi', 'Press inclinado en multipower', 'hpush', 'g', 'comp', 'Pecho', 'Hombros', 'Banco a 30°; baja la barra a la parte alta del pecho y empuja sin bloquear.', { easy: 1, ev: 'El banco inclinado reparte más trabajo hacia la parte alta del pecho; la guía da estabilidad para cargar más.' });
X('remo_t', 'Remo en T (barra o máquina)', 'hpull', 'g', 'comp', 'Espalda', 'Bíceps', 'Torso a 45° o pecho apoyado; tira llevando los codos hacia atrás.', { ev: 'Tirón horizontal pesado y estable para el grosor de la espalda.' });
X('jalon_1', 'Jalón unilateral en polea', 'vpull', 'g', 'comp', 'Espalda', 'Bíceps', 'Un brazo cada vez; deja que suba del todo arriba y lleva el codo hacia la cadera.', { ev: 'Un brazo cada vez permite más recorrido y estiramiento del dorsal.' });
X('curl_scott', 'Curl en banco Scott (predicador)', 'biceps', 'g', 'iso', 'Bíceps', '', 'Axila pegada al banco; baja hasta casi estirar el codo controlando.', { easy: 1, ev: 'Carga mucho el bíceps con el codo estirado, donde el músculo está más alargado.' });
X('curl_bayes', 'Curl en polea con el brazo atrás (bayesiano)', 'biceps', 'g', 'iso', 'Bíceps', '', 'De espaldas a la polea baja, brazo por detrás del cuerpo; sube sin adelantar el codo.', { ev: 'Como el curl inclinado, trabaja el bíceps estirado y la polea mantiene la tensión en todo el recorrido.' });
X('ext_cabeza_mc', 'Extensión de tríceps sobre la cabeza con mancuerna', 'triceps', 'g', 'iso', 'Tríceps', '', 'Sentado con respaldo; baja la mancuerna detrás de la cabeza y estira los codos.', { easy: 1, ev: 'Por encima de la cabeza la porción larga del tríceps trabaja estirada (Maeo 2023).' });
X('gem_maq', 'Elevación de talones en máquina de pie', 'calves', 'g', 'iso', 'Gemelos', '', 'Hombros bajo los apoyos; baja hasta estirar del todo, pausa 1 s y sube.', { easy: 1, ev: 'Recorrido completo con pausa abajo: la parte estirada es la que más hace crecer el gemelo (Kassiano 2023).', top: 1 });
X('abductor', 'Abducción de cadera en máquina', 'glute', 'g', 'iso', 'Isquios y glúteos', '', 'Sentado, abre las piernas contra la resistencia; inclínate algo hacia delante para más glúteo.', { easy: 1, ev: 'Trabaja el glúteo medio, que las sentadillas y el peso muerto apenas estimulan.' });
X('kickback', 'Patada de glúteo en polea o máquina', 'glute', 'g', 'iso', 'Isquios y glúteos', '', 'Torso estable; lleva la pierna atrás apretando el glúteo sin arquear la lumbar.', { ev: 'Aislamiento de glúteo mayor para sumar volumen sin cargar la espalda.' });
// Gemelos
X('gemelos', 'Elevación de talones de pie', 'calves', 'gdb', 'iso', 'Gemelos', '', 'Pausa de 1 s arriba y baja hasta estirar del todo.', { easy: 1, ev: 'Recorrido completo con pausa abajo: la parte estirada es la que más hace crecer el gemelo (Kassiano 2023).' });
X('gem_sentado', 'Elevación de talones sentado', 'calves', 'g', 'iso', 'Gemelos', '', 'Rodillas a 90°; recorrido completo con pausa abajo.', { easy: 1, ev: 'Con la rodilla doblada trabaja sobre todo el sóleo; complementa a los gemelos de pie.' });
X('gem_prensa', 'Gemelos en prensa', 'calves', 'g', 'iso', 'Gemelos', '', 'Solo la punta de los pies en la plataforma; estira y empuja.', { ev: 'Recorrido completo con pausa abajo: la parte estirada es la que más hace crecer el gemelo (Kassiano 2023).' });
X('gem_1', 'Elevación de talones a una pierna', 'calves', 'db', 'iso', 'Gemelos', '', 'En un escalón, apoyándote con una mano; recorrido completo.');
// Core
X('plancha', 'Plancha', 'core', 'gdb', 'iso', 'Core', '', 'Glúteos y abdomen apretados, cuerpo en línea recta.', { easy: 1, time: 1 });
X('plancha_lat', 'Plancha lateral', 'core', 'gdb', 'iso', 'Core', '', 'Apoyado en el antebrazo; cadera alta y cuerpo recto.', { easy: 1, time: 1 });
X('deadbug', 'Dead bug', 'core', 'gdb', 'iso', 'Core', '', 'Zona lumbar pegada al suelo; extiende brazo y pierna contrarios despacio.', { easy: 1 });
X('crunch', 'Crunch abdominal', 'core', 'gdb', 'iso', 'Core', '', 'Despega solo los hombros del suelo, sin tirar del cuello.', { easy: 1 });
X('crunch_polea', 'Crunch en polea', 'core', 'g', 'iso', 'Core', '', 'De rodillas, flexiona el tronco llevando los codos a los muslos.');
X('pallof', 'Pallof press en polea', 'core', 'g', 'iso', 'Core', '', 'De lado a la polea; estira los brazos sin dejar que el tronco gire.');
X('elev_piernas', 'Elevación de piernas colgado', 'core', 'gb', 'iso', 'Core', '', 'Colgado de la barra; sube las rodillas sin balancearte.');
// Femoral y cuádriceps aislados
X('curl_fem', 'Curl femoral tumbado (máquina)', 'legcurl', 'g', 'iso', 'Isquios y glúteos', '', 'Cadera pegada al banco; sube y baja controlando.', { easy: 1, ev: 'Buena opción si no hay máquina sentada; la sentada da algo más de crecimiento (Maeo 2021).' });
X('curl_fem_s', 'Curl femoral sentado (máquina)', 'legcurl', 'g', 'iso', 'Isquios y glúteos', '', 'Muslo bien sujeto; flexiona la rodilla del todo.', { easy: 1, ev: 'Sentado, el femoral trabaja más estirado: produjo más hipertrofia que el curl tumbado (Maeo 2021).', top: 1 });
X('nordico', 'Curl nórdico (asistido)', 'legcurl', 'gb', 'iso', 'Isquios y glúteos', '', 'Talones sujetos; baja el cuerpo lo más lento posible y ayúdate con las manos.');
X('curl_toalla', 'Curl femoral deslizante con toalla', 'legcurl', 'db', 'iso', 'Isquios y glúteos', '', 'Tumbado con los talones sobre una toalla en suelo liso; cadera arriba y flexiona rodillas.', { easy: 1 });
X('puente1', 'Puente de glúteo a una pierna', 'legcurl', 'db', 'iso', 'Isquios y glúteos', '', 'Una pierna estirada al aire; sube la cadera con el talón apoyado.', { easy: 1 });
X('ext_cuad', 'Extensión de cuádriceps', 'legext', 'g', 'iso', 'Cuádriceps', '', 'Estira la rodilla del todo y baja en 2-3 s.', { easy: 1, ev: 'Es el ejercicio que mejor trabaja el recto femoral, la parte del cuádriceps que las sentadillas apenas hacen crecer.', top: 1 });
X('sissy', 'Sissy squat asistida', 'legext', 'db', 'iso', 'Cuádriceps', '', 'Agarrado a un apoyo, lleva las rodillas hacia delante inclinando el cuerpo atrás.');
X('pared', 'Sentadilla isométrica en pared', 'legext', 'db', 'iso', 'Cuádriceps', '', 'Espalda contra la pared y rodillas a 90°.', { easy: 1, time: 1 });

// Plantillas de día: primero los multiarticulares, después aislamiento (el orden es la prioridad).
// Cada plantilla tiene más huecos de los que se usan: el reparto de series elige cuáles se hacen.
// Todas las divisiones entrenan cada músculo ~2 veces por semana (Schoenfeld 2016)
// Rango de series semanales EFECTIVAS (directas + ½ de las indirectas) para GANAR MASA MUSCULAR.
// La hipertrofia sigue aumentando con el volumen, cada vez menos (Schoenfeld 2017; Pelland 2024):
// principiante ≈ 8-12 en músculos grandes, intermedio 12-18 y avanzado 14-22 (Baz-Valle 2022)
// Series DIRECTAS mínimas: aunque presses y remos trabajen brazos y hombro de forma indirecta,
// se incluye trabajo directo de bíceps, tríceps, deltoides lateral, gemelos y core
// Mínimo por sesión: ninguna sesión se queda en 2-3 ejercicios
// Máximo de series directas de un mismo músculo en una sesión (más allá, cada serie aporta muy poco)
// En cuerpo completo (2-3 días) el ACSM (2009) recomienda 8-10 ejercicios por sesión: se amplía el límite

// Repeticiones: la hipertrofia es parecida entre ~6 y ~30 reps si la serie acaba cerca del fallo (Schoenfeld 2017;
// Lopez 2021, Med Sci Sports Exerc); se usan los rangos medios prácticos: multiarticulares 6-10 (8-12 al empezar), aislamiento 10-15 y
// músculos pequeños (gemelos, deltoides) 12-20 (Schoenfeld et al. 2021, Sports, «repetition continuum»)
// Orden de reparto: primero los músculos grandes; su trabajo indirecto se descuenta de los pequeños
// Recorte final: ningún músculo pasa del máximo de su rango semanal (cuenta también el trabajo indirecto).
// Se quita una serie al ejercicio que más aporta a ese músculo, sin bajar de 2 series ni de los mínimos directos.
