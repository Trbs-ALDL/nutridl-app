// Pruebas del idioma (español / inglés)
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm'), fs = require('node:fs'), path = require('node:path');

function cargar(lang) {
    const store = lang ? { nutridl_lang: lang } : {};
    const noop = () => { };
    const el = new Proxy({}, { get: (t, k) => k === 'classList' ? { add: noop, remove: noop, toggle: noop, contains: () => false } : (k === 'style' || k === 'dataset') ? {} : noop });
    const ctx = {
        console, Intl, Date, Math, JSON, navigator: { language: 'es-ES' },
        localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
        document: { documentElement: {}, querySelectorAll: () => [], getElementById: () => null, createElement: () => el },
    };
    vm.createContext(ctx);
    for (const f of ['data/lang-en', 'i18n']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
    vm.runInContext("const fmt = (n, d = 0) => Number(n).toLocaleString(locale(), { minimumFractionDigits: d, maximumFractionDigits: d });", ctx);
    return code => vm.runInContext(code, ctx);
}

test('Idioma: traduce, y si falta una traducción deja el español (nunca un hueco)', () => {
    const en = cargar('en');
    assert.equal(en("tr('Hoy')"), 'Today');
    assert.equal(en("tr('Borrar todos los datos')"), 'Delete all data');
    // Lo que todavía no está traducido se ve en español, no vacío ni roto
    assert.equal(en("tr('Una frase que no está en el diccionario')"), 'Una frase que no está en el diccionario');
    assert.equal(en("tr('')"), '');
    assert.equal(en("tr(null)"), '');
    // Huecos {}
    assert.equal(en("tr('Te quedan {k} kcal', { k: 300 })"), 'You have 300 kcal left');
    const es = cargar('es');
    assert.equal(es("tr('Hoy')"), 'Hoy', 'en español no traduce');
});

test('Idioma: números, fechas y días de la semana cambian con el idioma', () => {
    const es = cargar('es'), en = cargar('en');
    assert.equal(es("fmt(1234.5, 1)"), '1234,5');
    assert.equal(en("fmt(1234.5, 1)"), '1,234.5');
    assert.match(es("dateTxt('2026-10-20', { weekday: 'long', day: 'numeric', month: 'long' })"), /martes.*octubre/i);
    assert.match(en("dateTxt('2026-10-20', { weekday: 'long', day: 'numeric', month: 'long' })"), /Tuesday.*October/i);
    assert.equal(es("dowLetters().join('')"), 'LMXJVSD');
    assert.equal(en("dowLetters().join('')"), 'MTWTFSS');
});

test('Idioma: se queda guardado y se detecta el del navegador', () => {
    assert.equal(cargar('en')("LANG"), 'en');
    assert.equal(cargar('es')("LANG"), 'es');
    assert.equal(cargar(null)("LANG"), 'es', 'con navegador en español, arranca en español');
    assert.equal(cargar('marciano')("LANG"), 'es', 'un idioma que no existe no rompe nada');
});

test('Idioma: el selector no se enseña hasta que la traducción esté COMPLETA', () => {
    const { sinEn, totalFaltan } = require('../tools/i18n-check.js');
    const listo = /const I18N_READY = (\w+);/.exec(fs.readFileSync(path.join(__dirname, '..', 'js', 'i18n.js'), 'utf8'))[1] === 'true';
    if (listo) {
        assert.equal(sinEn.length, 0, `faltan ${sinEn.length} textos por traducir: ${sinEn.slice(0, 5).join(' · ')}`);
        assert.equal(totalFaltan, 0, `quedan ${totalFaltan} textos en español sin preparar`);
    } else {
        assert.ok(sinEn.length + totalFaltan > 0, 'si ya no falta nada, pon I18N_READY = true');
    }
});
