// nutriDL · Núcleo: configuración, estado, guardado, utilidades y nutrientes
'use strict';

// =====================================================================
//  CONFIGURACIÓN
// =====================================================================
const KCAL_PER_KG = 7700;
const STORAGE_KEY = 'nutridl_v2';
const PROFILES_KEY = 'nutridl_profiles';
const APP_VERSION = '2.1.2';
const ERR_KEY = 'nutridl_errors', USAGE_KEY = 'nutridl_usage';
// Estado de la persona activa (se guarda en su perfil)
const DEFAULT_STATE = {
    gender: 'female', age: 0, weight: 0, height: 0, calcOk: false, activity: 1.375, goal: -0.20, strategy: 'highprotein',
    goalWeight: '', customFoods: [], weights: [], measures: [], meals: [], tab: 'calc',
    gym: { level: 'beginner', days: 3, eq: 'gym' }, workouts: [], diary: {},
};
let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let calc = {};
// Los errores se guardan solo en este dispositivo (últimos 30) para el «Informe de errores»
function logErr(m) { try { const L = JSON.parse(localStorage.getItem(ERR_KEY) || '[]'); L.push({ t: new Date().toISOString(), m: String(m).slice(0, 300), v: APP_VERSION }); localStorage.setItem(ERR_KEY, JSON.stringify(L.slice(-30))); } catch (e) { } }
window.addEventListener('error', e => /ResizeObserver loop/.test(e.message || '') || logErr(`${e.message} @ ${String(e.filename || '').split('/').pop()}:${e.lineno || 0}`));
window.addEventListener('unhandledrejection', e => logErr('Promesa: ' + ((e.reason && e.reason.message) || e.reason)));
let profiles = { current: null, list: {} }; // list[id] = { name, created, state }

const $ = id => document.getElementById(id);
const fmt = (n, d = 0) => Number(n).toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// =====================================================================
//  PERSISTENCIA
// =====================================================================
function save() {
    try {
        if (profiles.current && profiles.list[profiles.current]) {
            profiles.list[profiles.current].state = state;
            localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
        } else localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { }
}
function load() {
    try {
        try { profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || 'null') || profiles; } catch (e) { }
        const cur = profiles.current && profiles.list[profiles.current];
        const s = cur ? cur.state : JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (s && typeof s === 'object') state = mergeState(s);
        if (cur) cur.state = state;
    } catch (e) { }
    syncCustomFoods();
}
function registerCustom(cf) {
    if (FOODS.some(f => f.id === cf.id)) return;
    FOODS.push(cf);
}
// Cada perfil ve solo SUS alimentos personalizados (antes se quedaban los del perfil anterior al cambiar)
function syncCustomFoods() {
    const mine = new Set((state.customFoods || []).map(cf => cf.id));
    for (let i = FOODS.length - 1; i >= 0; i--) if (FOODS[i].custom && !mine.has(FOODS[i].id)) FOODS.splice(i, 1);
    (state.customFoods || []).forEach(registerCustom);
}

// =====================================================================
//  ALIMENTOS: búsqueda por id y texto sin tildes
// =====================================================================
const getFood = id => FOODS.find(f => f.id === id);
function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

// =====================================================================
//  NUTRIENTES (kcal y macros de una cantidad)
// =====================================================================
// Energía por 100 g: Atwater 4/9/4, fibra 2 kcal/g y alcohol 7 kcal/g (Reglamento UE 1169/2011)
function kcal100(f) { if (f.kcal != null) return f.kcal; return 4 * f.p + 9 * f.f + 4 * f.c + 2 * f.fib + 7 * (f.alc || 0); }
function macrosOf(food, g) {
    const k = g / 100;
    return { p: food.p * k, f: food.f * k, c: food.c * k, fib: food.fib * k, kcal: kcal100(food) * k };
}

// =====================================================================
//  UTILIDADES
// =====================================================================
// Añadido: micro-animaciones (WAAPI, solo transform/opacity/filter, curva ease-out fuerte)
function ndAnim(el, frames, ms) {
    if (!el || !el.animate) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.animate(reduce ? [{ opacity: 0.4 }, { opacity: 1 }] : frames, { duration: reduce ? 150 : ms, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}
let toastTimer;
function toast(msg) {
    const t = $('toast'); t.innerText = msg; t.style.pointerEvents = ''; undoFn = null;
    t.style.opacity = '1'; t.style.transform = 'translate(-50%, 0)';
    clearTimeout(toastTimer);
    t.style.transitionDuration = '';
    toastTimer = setTimeout(() => { t.style.transitionDuration = '.18s'; t.style.opacity = '0'; t.style.transform = 'translate(-50%, 10px)'; }, 2600);
}

function update() {
    renderStaticToggles();
    const ok = calcReady();
    $('sec-resultados').classList.toggle('calc-pending', !ok);
    $('goal-block').classList.toggle('hidden', !ok);
    if (!ok) {
        calc = {};
        renderGym(); renderDiary(); renderDashboard(); updateSticky();
        save();
        return;
    }
    compute();
    renderResults();
    renderGym();
    if ($('diary-summary')) renderDiary();
    if ($('dashboard')) renderDashboard();
    save();
}

// =====================================================================
//  AÑADIDO: EMOJIS (solo para los elementos nuevos)
// =====================================================================
const EMOJI = {
    pollo: '🍗', pavo: '🦃', ternera: '🥩', picada: '🍔', cerdo: '🥩', salmon: '🐟', merluza: '🐟', atun: '🥫', gambas: '🦐',
    huevo: '🥚', claras: '🥚', jamon: '🍖', fiambre: '🥪', skyr: '🥛', yogdes: '🥛', yoggr: '🥛', batido: '🥛', cottage: '🧀',
    burgos: '🧀', curado: '🧀', leche: '🥛', bebsoja: '🥛', whey: '💪', guisante: '💪', tofu: '🌱', tempeh: '🌱', seitan: '🌱',
    sojatex: '🌱', lentejas: '🫘', garbanzos: '🫘', alubias: '🫘', hummus: '🥙', arroz: '🍚', arrozint: '🍚', pasta: '🍝',
    pastaint: '🍝', quinoa: '🌾', cuscus: '🌾', patata: '🥔', boniato: '🍠', avena: '🥣', panint: '🍞', pan: '🥖', tortitas: '🍘',
    wrap: '🌯', cereales: '🥣', aove: '🫒', aguacate: '🥑', almendras: '🌰', nueces: '🌰', cacahuete: '🥜', chia: '🌱',
    choco: '🍫', aceitunas: '🫒', platano: '🍌', manzana: '🍎', naranja: '🍊', fresas: '🍓', arandanos: '🫐', kiwi: '🥝',
    pera: '🍐', pina: '🍍', mango: '🥭', brocoli: '🥦', espinacas: '🥬', calabacin: '🥒', ensalada: '🥗', judias: '🫛',
    pimiento: '🫑', champi: '🍄', coliflor: '🥦', esparragos: '🌿', menestra: '🥕', tomate: '🍅',
    muslo: '🍗', hamburguesa: '🍔', conejo: '🥩', jamoncocido: '🥪', chorizo: '🌭', salchichas: '🌭', dorada: '🐟', sardinas: '🐟', atunaceite: '🥫', caballa: '🐟',
    calamares: '🦑', mejillones: '🦪', lechentera: '🥛', lechedes: '🥛', yognat: '🥛', yogsab: '🍦', kefir: '🥛', mozzarella: '🧀', quesolonchas: '🧀',
    panmolde: '🍞', biscotes: '🍞', galletas: '🍪', muesli: '🥣', arrozcocido: '🍚', pastacocida: '🍝', gnocchi: '🍝', tortilla: '🍳', paella: '🥘', pizza: '🍕',
    croquetas: '🧆', ensaladilla: '🥗', lentguisadas: '🍲', gazpacho: '🍅', patatasbolsa: '🥔', patatasfritas: '🍟', uvas: '🍇', sandia: '🍉', melon: '🍈',
    melocoton: '🍑', mandarina: '🍊', cerezas: '🍒', zumo: '🧃', zanahoria: '🥕', berenjena: '🍆', pepino: '🥒', alcachofas: '🥬', guisantes: '🫛', repollo: '🥬',
    cebolla: '🧅', pistachos: '🥜', anacardos: '🥜', pipas: '🌻', mantequilla: '🧈', mayonesa: '🥚', girasol: '🌻', chocoleche: '🍫', cola: '🥤', colazero: '🥤',
    cerveza: '🍺', vino: '🍷', cafeleche: '☕', colacao: '🥛', azucar: '🍬'
};
const emo = f => EMOJI[f.id] || f.em || '⭐';

// =====================================================================
//  GRÁFICA DE LÍNEAS (peso, progreso del gym)
//  Se dibuja al ancho real del contenedor: en el móvil la letra y los puntos se ven a tamaño normal
//  o = { points: [{ x, y, tip }], line: [{ x, y }], goal: { y, label }, xLabels: [izq, dcha], legend, dec, unit }
// =====================================================================
function lineChart(el, o) {
    if (!el || !o.points.length) return;
    const draw = () => {
        const W = Math.max(260, Math.round(el.clientWidth || 600)), H = W < 480 ? 230 : 250;
        const L = 46, R = 16, T = 34, B = 30, dec = o.dec ?? 1;
        const ys = o.points.map(p => p.y).concat((o.line || []).map(p => p.y), o.goal ? [o.goal.y] : []);
        let mn = Math.min(...ys), mx = Math.max(...ys);
        const padY = Math.max((mx - mn) * 0.15, o.minPad ?? 0.5); mn -= padY; mx += padY;
        const xs = o.points.map(p => p.x), x0 = Math.min(...xs), x1 = Math.max(...xs);
        const X = x => L + (W - L - R) * (x1 > x0 ? (x - x0) / (x1 - x0) : 0.5);
        const Y = y => T + (H - T - B) * (1 - (y - mn) / (mx - mn));
        const grid = [0, 0.5, 1].map(f => { const v = mn + (mx - mn) * f, y = Y(v).toFixed(1); return `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="#2e2e2e"/><text x="${L - 8}" y="${(+y + 4).toFixed(1)}" font-size="12" fill="#a3a3a3" text-anchor="end">${fmt(v, dec)}</text>`; }).join('');
        const line = o.line && o.line.length > 1 ? `<polyline points="${o.line.map(p => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ')}" fill="none" stroke="#c49a6c" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` : '';
        const goal = o.goal && o.goal.y > mn && o.goal.y < mx ? `<line x1="${L}" x2="${W - R}" y1="${Y(o.goal.y).toFixed(1)}" y2="${Y(o.goal.y).toFixed(1)}" stroke="#f59e0b" stroke-dasharray="6 5"/><text x="${W - R}" y="${(Y(o.goal.y) - 6).toFixed(1)}" font-size="12" fill="#f59e0b" font-weight="700" text-anchor="end">${o.goal.label}</text>` : '';
        const r = W < 480 ? 4.5 : 4;
        const dots = o.points.map(p => `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${r}" fill="${o.dotColor || '#dcc19c'}"><title>${p.tip || ''}</title></circle>`).join('');
        el.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria || 'Gráfica'}" style="display:block">
            <text x="${L}" y="16" font-size="12" fill="#c49a6c" font-weight="700">${o.legend || ''}</text>
            ${grid}${goal}${line}${dots}
            <text x="${L}" y="${H - 8}" font-size="12" fill="#a3a3a3">${(o.xLabels || [])[0] || ''}</text>
            <text x="${W - R}" y="${H - 8}" font-size="12" fill="#a3a3a3" text-anchor="end">${(o.xLabels || [])[1] || ''}</text>
        </svg>`;
    };
    el._draw = draw; draw();
    if (!el._ro && window.ResizeObserver) {
        let w = el.clientWidth;
        el._ro = new ResizeObserver(() => { if (Math.abs(el.clientWidth - w) > 8) { w = el.clientWidth; requestAnimationFrame(el._draw); } });
        el._ro.observe(el);
    }
}
