// Pruebas automáticas de lo crítico (fórmulas, IMC, récords del gym y guardado). Uso: npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm'), fs = require('node:fs'), path = require('node:path');

// Carga los scripts de la app en un entorno sin navegador (con lo mínimo de window/document/localStorage)
function loadApp() {
    const store = {};
    const noop = () => { };
    const el = new Proxy({}, { get: (t, k) => k === 'classList' ? { add: noop, remove: noop, toggle: noop, contains: () => false } : (k === 'style' || k === 'dataset') ? {} : noop });
    const ctx = {
        console, Intl, Date, Math, JSON, Promise, setTimeout, clearTimeout, setInterval, clearInterval,
        window: { addEventListener: noop }, navigator: {}, location: { protocol: 'file:', hostname: '', search: '' },
        matchMedia: () => ({ matches: false }),
        localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
        document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, createElement: () => el, body: { style: {} } },
    };
    vm.createContext(ctx);
    for (const f of ['core', 'data/foods', 'data/exercises', 'calc', 'progress', 'gym', 'diary', 'profiles']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
    }
    const run = code => vm.runInContext(code, ctx);
    return { run, store };
}

test('Mifflin-St Jeor: gasto basal de referencia', () => {
    const { run } = loadApp();
    const B = run("bmrFormulas(78, 178, 30, true, null)");
    assert.equal(B.mifflin, 10 * 78 + 6.25 * 178 - 5 * 30 + 5); // 1747,5 kcal (hombre)
    const M = run("bmrFormulas(65, 165, 40, false, null)");
    assert.equal(M.mifflin, 10 * 65 + 6.25 * 165 - 5 * 40 - 161); // 1320,25 kcal (mujer)
});

test('IMC: se redondea a 1 decimal antes de clasificar (criterio CDC)', () => {
    const { run } = loadApp();
    run("Object.assign(state, { gender: 'male', age: 30, height: 170, weight: 72.1055, activity: 1.375, calcOk: true }); compute();");
    assert.equal(run('calc.bmi'), 25);
    run("state.weight = 72.08; compute();");
    assert.equal(run('calc.bmi'), 24.9);
});

test('Calorías: mantenimiento = basal × actividad y el objetivo respeta el mínimo', () => {
    const { run } = loadApp();
    run("Object.assign(state, { gender: 'female', age: 30, height: 178, weight: 78, activity: 1.375, calcOk: true, goalType: 'maintain' }); compute();");
    assert.equal(Math.round(run('calc.tdee')), Math.round((10 * 78 + 6.25 * 178 - 5 * 30 - 161) * 1.375));
    run("Object.assign(state, { goalType: 'lose', weight: 45, height: 160, age: 60 }); compute();");
    assert.ok(run('calc.target') >= 1200, 'nunca por debajo de 1200 kcal sin supervisión');
});

test('Calculadora: sin edad, peso y estatura no hay resultados', () => {
    const { run } = loadApp();
    assert.equal(run('calcReady()'), false);
    run("Object.assign(state, { age: 30, weight: 78, height: 178 })");
    assert.equal(run('calcReady()'), false, 'falta pulsar Aceptar');
    run('state.calcOk = true');
    assert.equal(run('calcReady()'), true);
});

test('Perfiles antiguos con datos válidos siguen calculando sin pulsar Aceptar', () => {
    const { run } = loadApp();
    assert.equal(run("mergeState({ age: 30, weight: 70, height: 165 }).calcOk"), true);
    assert.equal(run("mergeState(null).calcOk"), false);
    assert.equal(run("mergeState({ age: 30, weight: 0, height: 165 }).calcOk"), false);
});

test('Gym: pesos más altos por ejercicio', () => {
    const { run } = loadApp();
    run(`state.workouts = [
        { id: 1, d: '2026-10-05', t: 'Día 1', di: 0, ex: [{ id: 'banca', name: 'Press banca', sets: [{ kg: 60, reps: 10 }, { kg: 70, reps: 6 }] }] },
        { id: 2, d: '2026-10-07', t: 'Día 1', di: 0, ex: [{ id: 'banca', name: 'Press banca', sets: [{ kg: 70, reps: 8 }] }, { id: '', name: 'Curl', sets: [{ kg: 12, reps: 10 }] }] },
    ];`);
    const L = JSON.parse(run('JSON.stringify(bestLifts())'));
    assert.equal(L.length, 2);
    assert.equal(L[0].name, 'Press banca');
    assert.deepEqual(L[0].s, { kg: 70, reps: 8 }, 'a igual peso gana la serie con más repeticiones');
});

test('Guardado: el perfil se escribe en localStorage y se vuelve a leer', () => {
    const { run, store } = loadApp();
    run("profiles = { current: 'p1', list: { p1: { name: 'Ana', created: '2026-10-07', state } } }; state.weight = 64; save();");
    const saved = JSON.parse(store.nutridl_profiles);
    assert.equal(saved.list.p1.state.weight, 64);
    run("state = mergeState(null); load();");
    assert.equal(run('state.weight'), 64);
});
