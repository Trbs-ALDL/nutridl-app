// nutriDL · Gratis y PRO
// Preparado para cuando haya pagos (necesita cuentas y un proveedor de pago seguro: ver docs/NEGOCIO.md).
// Mientras la app está en beta, TODO está abierto: nada se bloquea ni se cobra.
'use strict';

const BETA_ALL_OPEN = true;
const PRO_PRICE = { month: 4.99, year: 39.99 };
// [función, gratis, pro]
const PLAN_FEATURES = [
    ['Calorías, macros y tu plan explicado', true, true],
    ['Diario, peso, medidas y progreso básico', true, true],
    ['Base de alimentos, marcas y escáner', true, true],
    ['Registro de entrenos del gym', true, true],
    ['Coach: «¿Qué como?» y respuestas con tus datos', true, true],
    ['Coach avanzado con IA conversacional', false, true],
    ['Foto del plato con reconocimiento automático', false, true],
    ['Registro por voz', false, true],
    ['Menú del día y planificación semanal', false, true],
    ['Lista de la compra inteligente', false, true],
    ['Análisis y tendencias avanzadas', false, true],
    ['Sincronización móvil + ordenador', false, true],
    ['Informes avanzados en PDF', false, true],
    ['Sin anuncios', true, true],
];
const isPro = () => false; // llegará con las cuentas
const canUse = () => BETA_ALL_OPEN || isPro();

function proTable() {
    const ck = on => on ? '<i class="fa-solid fa-check text-mint-400"></i>' : '<span class="text-neutral-600">—</span>';
    return `<div class="rounded-2xl border border-neutral-800 overflow-hidden text-sm">
        <div class="grid grid-cols-[1fr_4rem_4rem] bg-neutral-900 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400"><span>Función</span><span class="text-center">Gratis</span><span class="text-center text-mint-300">PRO</span></div>
        ${PLAN_FEATURES.map(([l, f, p]) => `<div class="grid grid-cols-[1fr_4rem_4rem] px-4 py-2.5 border-t border-neutral-800 items-center"><span class="text-neutral-200">${l}</span><span class="text-center">${ck(f)}</span><span class="text-center">${ck(p)}</span></div>`).join('')}
    </div>`;
}
function proPrices() {
    const save = Math.round((1 - PRO_PRICE.year / (PRO_PRICE.month * 12)) * 100);
    return `<div class="grid grid-cols-2 gap-3">
        <div class="nd-price"><div class="text-xs font-bold text-neutral-400">Mensual</div><div class="text-2xl font-extrabold text-neutral-50">${fmt(PRO_PRICE.month, 2)} €</div><div class="text-xs text-neutral-400">al mes</div></div>
        <div class="nd-price nd-price-best"><div class="text-xs font-bold text-mint-300">Anual · ahorra ${save} %</div><div class="text-2xl font-extrabold text-neutral-50">${fmt(PRO_PRICE.year, 2)} €</div><div class="text-xs text-neutral-400">al año (${fmt(PRO_PRICE.year / 12, 2)} €/mes)</div></div>
    </div>`;
}
function openPro() {
    closeProfileMenu();
    openSheet('<span class="nd-pro-badge">PRO</span> nutriDL PRO', `<div class="space-y-4">
        <div class="p-4 rounded-2xl bg-mint-600/15 border border-mint-500/30 text-sm text-neutral-200"><b>Estás en la beta:</b> todas las funciones están abiertas y gratis. Cuando llegue PRO, lo básico seguirá siendo gratis siempre.</div>
        ${proPrices()}
        ${proTable()}
        <button onclick="proInterest()" class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold">Me interesa PRO</button>
        <p class="text-[11px] text-neutral-500">Precios orientativos. Aún no hay pagos: no se te cobrará nada.</p>
    </div>`);
    track('pro_open');
}
function proInterest() { track('pro_interest'); closeSheet(); toast('¡Gracias! Lo tendremos en cuenta: cuando PRO esté listo lo verás aquí'); }
function renderLandingPro() {
    const box = $('landing-pro'); if (!box || box.dataset.done) return;
    box.dataset.done = 1;
    box.innerHTML = `<div class="grid lg:grid-cols-2 gap-8 items-start">
        <div class="space-y-4"><span class="nd-eyebrow">Gratis y PRO</span><h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-50">Lo importante, gratis. Siempre.</h2>
            <p class="text-neutral-300">Calcula tu plan, apunta tus comidas, pesa tu progreso y usa el Coach sin pagar. PRO añadirá IA avanzada, foto, planificación y sincronización. <b class="text-neutral-100">Durante la beta, todo está abierto.</b></p>${proPrices()}</div>
        ${proTable()}
    </div>`;
}
