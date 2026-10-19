// Pruebas de la 3.10: los «momentos» de la pestaña Hoy (enganche)
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm'), fs = require('node:fs'), path = require('node:path');

function loadApp() {
    const store = {};
    const noop = () => { };
    const el = new Proxy({}, { get: (t, k) => k === 'classList' ? { add: noop, remove: noop, toggle: noop, contains: () => false } : (k === 'style' || k === 'dataset') ? {} : noop });
    const ctx = {
        console, Intl, Date, Math, JSON, Promise, setTimeout, clearTimeout, setInterval, clearInterval, Map, Set,
        window: { addEventListener: noop }, navigator: {}, location: { protocol: 'file:', hostname: '', search: '' },
        matchMedia: () => ({ matches: false }),
        localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
        document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, createElement: () => el, body: { style: {} } },
    };
    vm.createContext(ctx);
    for (const f of ['core', 'data/foods', 'data/exercises', 'calc', 'analytics', 'progress', 'engine', 'parser', 'insights', 'gym', 'diary', 'profiles', 'dashboard', 'plans', 'kitchen', 'coach', 'app']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
    }
    const run = code => vm.runInContext(code, ctx);
    run('toast = () => {}; toastUndo = () => {}; renderGym = () => {}; renderDashboard = () => {};');
    const json = code => JSON.parse(run(`JSON.stringify(${code})`));
    return { run, json, store };
}
const setupDay = run => run(`state.gym = { myDays: 1, plan: [{ name: 'Pierna', ex: [{ id: 'sq_barra', n: 'Sentadilla', s: [{ kg: '100', r: '8' }, { kg: '80', r: '10', t: 'drop', d: [{ kg: '60', r: '8' }, { kg: '40', r: '6' }] }] }] }] }; state.workouts = []; gymDay = 0;`);


const planHecho = run => run("Object.assign(state, { gender:'male', age:30, height:178, weight:75, activity:1.55, calcOk:true, goalType:'lose' }); compute(); state.diary={}; state.weights=[]; state.workouts=[]; state.moments={};");
// Apunta una comida en un día concreto (para fabricar rachas y semanas)
const apunta = (run, iso) => run(`pushDiary(${JSON.stringify({ fid: 'pollo', g: 150, kcal: 250, p: 45, c: 0, f: 5, fib: 0, slot: 'L' })}, '${iso}')`);

test('Momento: vuelve después de días fuera, sin regañar', () => {
    const { run, json } = loadApp();
    planHecho(run);
    apunta(run, run("shiftISO(todayISO(), -5)"));
    const m = json('dayMoment()');
    assert.equal(m.k, 'back');
    assert.match(m.kicker, /5 días/);
    assert.doesNotMatch(m.sub + m.title, /recuperar lo perdido|has fallado|deberías/i);
    // Si lo aparta, no vuelve a salir hoy
    run("dismissMoment('back')");
    assert.notEqual((json('dayMoment()') || {}).k, 'back');
});

test('Momento: la racha en peligro solo avisa por la tarde y si es verdad', () => {
    const { run, json } = loadApp();
    planHecho(run);
    [3, 2, 1].forEach(n => apunta(run, run(`shiftISO(todayISO(), -${n})`)));
    assert.equal(json('streakInfo()').cur, 3);
    // Por la mañana no molesta
    run("Date.prototype.getHours = () => 9;");
    assert.notEqual((json('dayMoment()') || {}).k, 'risk');
    // Por la tarde sí, porque hoy aún no hay nada
    run("Date.prototype.getHours = () => 20;");
    const m = json('dayMoment()');
    assert.equal(m.k, 'risk');
    assert.match(m.kicker, /3 días/);
    // En cuanto apunta algo hoy, desaparece
    apunta(run, run('todayISO()'));
    assert.notEqual((json('dayMoment()') || {}).k, 'risk');
});

test('Momento: resumen de la semana pasada, una sola vez por semana', () => {
    const { run, json } = loadApp();
    planHecho(run);
    run("Date.prototype.getDay = () => 1;"); // hacemos que hoy sea lunes
    // Lunes de esta semana y 5 días apuntados de la semana anterior
    const lunes = run("mondayOf(todayISO())");
    for (let i = 1; i <= 5; i++) apunta(run, run(`shiftISO('${lunes}', -${i})`));
    const m = json('dayMoment()');
    assert.equal(m.k, 'week');
    assert.match(m.title, /5 de 7/);
    assert.match(m.sub, /kcal/);
    // Sigue estando si solo lo has visto (para que no desaparezca al refrescarse la pantalla)
    assert.equal(json('dayMoment()').k, 'week');
    // Pero en cuanto lo usas, no vuelve esta semana
    run(`momentSeen('week', '${lunes}')`);
    assert.notEqual((json('dayMoment()') || {}).k, 'week');
});

test('Momento: el recordatorio se ofrece una vez y solo tras usar la app', () => {
    const { run, json } = loadApp();
    planHecho(run);
    run("Date.prototype.getHours = () => 12;");
    apunta(run, run("shiftISO(todayISO(), -1)"));
    assert.notEqual((json('dayMoment()') || {}).k, 'remind', 'con un solo día no se ofrece');
    apunta(run, run("shiftISO(todayISO(), -2)"));
    apunta(run, run("todayISO()"));
    const m = json('dayMoment()');
    assert.equal(m.k, 'remind');
    run("momentSeen('remind', 1)");
    assert.equal(json('dayMoment()'), null, 'no queda ningún momento pendiente');
});

test('Momento: sin plan hecho no se enseña ninguno', () => {
    const { run, json } = loadApp();
    run("state.diary={}; state.moments={}; state.calcOk=false; calc={};");
    assert.equal(json('dayMoment()'), null);
});

test('Momento: como mucho un aviso al día, sin encadenar uno tras otro', () => {
    const { run, json } = loadApp();
    planHecho(run);
    run("Date.prototype.getHours = () => 12;");
    [2, 1, 0].forEach(n => apunta(run, run(`shiftISO(todayISO(), -${n})`)));
    assert.equal(json('dayMoment()').k, 'remind');
    // Si hoy ya has atendido otro aviso, el recordatorio espera a mañana
    run("state.moments = { last: todayISO() }");
    assert.equal(json('dayMoment()'), null);
});
