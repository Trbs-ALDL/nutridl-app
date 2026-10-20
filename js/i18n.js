// nutriDL · Idioma de la app (español / inglés)
// La clave del diccionario es el propio texto en español. Si falta una traducción se ve en español:
// así nunca aparece un hueco vacío ni se rompe la pantalla.
'use strict';

const LANGS = { es: 'Español', en: 'English' };
// Mientras la traducción al inglés no esté terminada, el selector no se enseña:
// media app en inglés y media en español es peor que dejarlo en español.
// Lo vigila tests/v311.test.js: no se puede poner en true si queda algo sin traducir.
const I18N_READY = false;
const LANG_KEY = 'nutridl_lang';
const LOCALES = { es: 'es-ES', en: 'en-GB' };

function detectLang() {
    try { const s = localStorage.getItem(LANG_KEY); if (s && LANGS[s]) return s; } catch (e) { }
    const n = String((typeof navigator !== 'undefined' && navigator.language) || 'es').slice(0, 2).toLowerCase();
    return LANGS[n] ? n : 'es';
}
let LANG = detectLang();
const locale = () => LOCALES[LANG] || LOCALES.es;

// Traduce. `v` sustituye {trozos}: tr('Te quedan {k} kcal', { k: 300 })
// Se llama `tr` y no `t` a propósito: `t` se usa como variable local en varios sitios del código
// y una local tapando a la global haría que la traducción reventara dentro de esa función.
function tr(s, v) {
    let out = s == null ? '' : String(s);
    if (LANG !== 'es') { const d = (typeof LANG_EN !== 'undefined' && LANG === 'en') ? LANG_EN : null; if (d && d[out] != null) out = d[out]; }
    if (v) for (const k in v) out = out.split('{' + k + '}').join(v[k]);
    return out;
}
// Plural sencillo: tp(2, 'día', 'días') → «2 días» · en inglés usa el diccionario de cada forma
const tp = (n, uno, varios) => `${typeof fmt === 'function' ? fmt(n) : n} ${tr(n === 1 ? uno : varios)}`;

// Fechas y horas en el idioma activo
const dateTxt = (iso, opts) => new Date(String(iso).length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString(locale(), opts);
// Iniciales de los días de la semana, empezando en lunes
const dowLetters = () => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 1 + i); // 1 de enero de 2024 fue lunes
    return d.toLocaleDateString(locale(), { weekday: 'narrow' }).toUpperCase();
});

// Textos fijos del HTML: data-t (contenido), data-t-ph (placeholder), data-t-al (aria-label), data-t-ti (title)
function applyStaticI18n(root) {
    const r = root || document;
    r.querySelectorAll('[data-t]').forEach(el => { const k = el.getAttribute('data-t'); if (k) el.textContent = tr(k); });
    [['data-t-ph', 'placeholder'], ['data-t-al', 'aria-label'], ['data-t-ti', 'title']].forEach(([a, p]) => {
        r.querySelectorAll('[' + a + ']').forEach(el => { const k = el.getAttribute(a); if (k) el.setAttribute(p, tr(k)); });
    });
}

function setLang(l) {
    if (!LANGS[l] || l === LANG) return;
    LANG = l;
    try { localStorage.setItem(LANG_KEY, l); } catch (e) { }
    document.documentElement.lang = l;
    applyStaticI18n();
    if (typeof refreshAll === 'function') refreshAll();           // vuelve a pintar todo con el idioma nuevo
    if (typeof renderChat === 'function' && state && state.tab === 'coach') renderChat();
    if (typeof track === 'function') track('lang_' + l);
    if (typeof toast === 'function') toast(tr('Idioma cambiado'));
}
