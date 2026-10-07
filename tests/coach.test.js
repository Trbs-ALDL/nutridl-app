// Pruebas de la 3.0: motor de comidas, entender texto, rachas, lista de la compra y respuestas del Coach. Uso: npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm'), fs = require('node:fs'), path = require('node:path');

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
    for (const f of ['core', 'data/foods', 'data/exercises', 'calc', 'analytics', 'progress', 'engine', 'parser', 'insights', 'gym', 'diary', 'profiles', 'coach']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
    }
    const run = code => vm.runInContext(code, ctx);
    const json = code => JSON.parse(run(`JSON.stringify(${code})`));
    // Perfil de ejemplo: mujer, 30 años, 165 cm, 68 kg, actividad ligera, perder grasa
    run("Object.assign(state, { gender: 'female', age: 30, height: 165, weight: 68, activity: 1.375, calcOk: true, goalType: 'lose' }); compute();");
    return { run, json };
}

test('Motor: todos los platos usan alimentos que existen', () => {
    const { run } = loadApp();
    assert.equal(run("MEALS.flatMap(t => t.items.flatMap(([a]) => a.split('|'))).filter(id => !getFood(id)).length"), 0);
});

test('Menú del día: suma las calorías objetivo (±10 %) y casi toda la proteína', () => {
    const { run, json } = loadApp();
    for (const meals of [3, 4, 5]) {
        run(`state.prefs = { meals: ${meals} }`);
        for (const seed of [1, 7, 42]) {
            const t = json(`menuTotals(makeDayMenu(${seed}))`), target = run('calc.target'), prot = run('calc.prot');
            assert.ok(Math.abs(t.kcal - target) / target <= .1, `${meals} comidas, semilla ${seed}: ${Math.round(t.kcal)} kcal frente a ${target}`);
            assert.ok(t.p >= prot * .85, `${meals} comidas, semilla ${seed}: ${Math.round(t.p)} g de proteína frente a ${prot}`);
        }
    }
});

test('Preferencias: dieta vegana y alergias se respetan en todas las sugerencias', () => {
    const { run, json } = loadApp();
    run("state.prefs = { diet: 'vegan', allergies: ['gluten', 'soja'], meals: 4 }");
    const ids = json("makeMenus(3, 5).flatMap(m => m.meals.flatMap(x => x.items.map(i => i.fid)))");
    assert.ok(ids.length > 0);
    for (const id of ids) {
        const f = json(`getFood('${id}')`);
        assert.match(f.flags, /N/, `${f.name} no es vegano`);
        assert.doesNotMatch(f.flags, /G/, `${f.name} tiene gluten`);
        assert.ok(!['tofu', 'tempeh', 'bebsoja', 'edamame', 'soja', 'sojatex'].includes(id), `${f.name} tiene soja`);
    }
    run("state.prefs = { diet: 'omni', allergies: ['lactosa'], dislikes: ['pollo'], meals: 4 }");
    const ids2 = json("makeMenus(3, 9).flatMap(m => m.meals.flatMap(x => x.items.map(i => i.fid)))");
    assert.ok(!ids2.includes('pollo'), 'no debe salir lo que no gusta');
    for (const id of ids2) assert.doesNotMatch(json(`getFood('${id}')`).flags, /L/, `${id} tiene lactosa`);
});

test('Entender texto: alimentos y cantidades de frases habituales', () => {
    const { json } = loadApp();
    const P = s => json(`parseFoodText(${JSON.stringify(s)}).items.map(i => [i.food.id, i.g, i.est])`);
    assert.deepEqual(P('He comido 200 gramos de pechuga de pollo, 100 gramos de arroz y una ensalada'), [['pollo', 200, false], ['arroz', 100, false], ['ensalada', 200, true]]);
    assert.deepEqual(P('una lata de atún'), [['atun', 52, false]]);
    assert.deepEqual(P('medio aguacate'), [['aguacate', 75, false]]);
    assert.deepEqual(P('dos huevos').map(x => x.slice(0, 2)), [['huevo', 110]]);
    assert.deepEqual(P('café con leche').map(x => x[0]), ['cafeleche']);
    assert.deepEqual(P('pollo con arroz').map(x => x[0]), ['pollo', 'arroz']);
    assert.deepEqual(P('150g de pasta cocida').map(x => x.slice(0, 2)), [['pastacocida', 150]]);
    assert.equal(json("parseFoodText('He cenado una tortilla de patatas').slot"), 'D');
});

test('Racha: días seguidos con comidas; si hoy no hay nada sigue viva desde ayer', () => {
    const { run, json } = loadApp();
    run("const t = todayISO(); state.diary = {}; [1, 2, 3].forEach(n => { state.diary[shiftISO(t, -n)] = [{ id: 'x' + n, slot: 'B', kcal: 100, p: 5, f: 1, c: 10 }]; }); state.diary[shiftISO(t, -6)] = [{ id: 'y', slot: 'L', kcal: 1, p: 0, f: 0, c: 0 }];");
    const S = json('streakInfo()');
    assert.equal(S.cur, 3); assert.equal(S.best, 3); assert.equal(S.today, false); assert.equal(S.total, 4);
});

test('Lista de la compra: suma cantidades de varios menús y agrupa por secciones', () => {
    const { json } = loadApp();
    const L = json("buildShopping([{ meals: [{ items: [{ fid: 'pollo', g: 150 }, { fid: 'arroz', g: 80 }] }] }, { meals: [{ items: [{ fid: 'pollo', g: 200 }, { fid: 'brocoli', g: 150 }] }] }])");
    const by = Object.fromEntries(L.map(x => [x.fid, x]));
    assert.equal(by.pollo.g, 350); assert.equal(by.pollo.group, 'prot');
    assert.equal(by.arroz.group, 'hc'); assert.equal(by.brocoli.group, 'verdura');
    assert.equal(json("shopQty(getFood('huevo'), 330)"), '6 huevos');
});

test('Coach: responde con tus datos, propone platos y avisa en situaciones de salud', () => {
    const { run, json } = loadApp();
    const left = json("coachReply('¿Cuánto me queda?')");
    assert.ok(left.tags.includes('dato'));
    const sug = json("coachReply('Quiero un desayuno de 40 g de proteína')");
    assert.equal(sug.slot, 'B'); assert.equal(sug.opts.length, 3);
    sug.opts.forEach(o => assert.ok(o.m.p >= 30, `${o.name}: ${Math.round(o.m.p)} g de proteína`));
    const safe = json("coachReply('Estoy embarazada, ¿cuánto como?')");
    assert.match(safe.html, /profesional sanitario/);
    const log = json("coachReply('He comido dos huevos y una tostada')");
    assert.ok(log.p && log.p.items.length === 2, 'debe pedir confirmación con 2 alimentos');
    assert.equal(run("state.diary[todayISO()]"), undefined, 'no se guarda nada sin confirmar');
});
