// nutriDL · Calculadora: datos, calorías (Mifflin-St Jeor), objetivo, IMC (OMS) y macros
'use strict';

// =====================================================================
//  INPUTS
// =====================================================================
const PAIRS = { age: [18, 90], weight: [35, 250], height: [130, 220] };
const PAIR_NAME = { age: 'edad', weight: 'peso', height: 'estatura' };
function PAIRS_OK(s) { return Object.entries(PAIRS).every(([k, [mn, mx]]) => s[k] >= mn && s[k] <= mx); }
const calcReady = () => !!state.calcOk && PAIRS_OK(state);
// Aceptar: con edad, peso y estatura válidos se calcula todo (IMC, kcal, macros…)
function acceptData() {
    ['age', 'weight', 'height'].forEach(k => { const v = num($('n-' + k).value); state[k] = v || 0; });
    const bad = Object.keys(PAIRS).filter(k => !(state[k] >= PAIRS[k][0] && state[k] <= PAIRS[k][1]));
    Object.keys(PAIRS).forEach(k => $('n-' + k).classList.toggle('nd-invalid', bad.includes(k)));
    if (bad.length) {
        $('calc-err').innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + bad.map(k => `${PAIR_NAME[k][0].toUpperCase() + PAIR_NAME[k].slice(1)}: entre ${PAIRS[k][0]} y ${PAIRS[k][1]}`).join(' · ');
        $('calc-err').classList.remove('hidden');
        $('n-' + bad[0]).focus();
        return;
    }
    $('calc-err').classList.add('hidden');
    state.calcOk = true;
    syncInputsFromState(); update();
    if (innerWidth < 1024) goTo('sec-resultados');
    toast('✅ Datos guardados: ya tienes tu IMC y tus calorías');
}
function onPair(key, el) {
    const v = parseFloat(el.value);
    el.classList.remove('nd-invalid');
    if (isNaN(v)) { if (el.type !== 'range') { state[key] = 0; state.calcOk = false; update(); } return; }
    const [mn, mx] = PAIRS[key];
    if (el.type === 'range') $('n-' + key).value = v;
    else { if (v < mn || v > mx) return; $('r-' + key).value = v; }
    state[key] = v;
    update();
}
function clampPair(key) {
    const [mn, mx] = PAIRS[key];
    let v = parseFloat($('n-' + key).value);
    if (isNaN(v)) return; // vacío: se queda vacío hasta que lo rellenes
    v = Math.min(mx, Math.max(mn, v));
    $('n-' + key).value = v; $('r-' + key).value = v;
    state[key] = v; update();
}
function setField(k, v) { state[k] = v; update(); }
function setGender(g) { state.gender = g; update(); }

function resetInputs() {
    $('calc-err') && $('calc-err').classList.add('hidden');
    const keep = { weights: state.weights, tab: state.tab, gym: state.gym, workouts: state.workouts, diary: state.diary, customFoods: state.customFoods };
    state = { ...JSON.parse(JSON.stringify(DEFAULT_STATE)), ...keep, calcOk: false };
    syncInputsFromState();
    update();
}

function syncInputsFromState() {
    ['age', 'weight', 'height'].forEach(k => { $('n-' + k).value = state[k] || ''; $('r-' + k).value = state[k] || PAIRS[k][0]; });
    $('input-activity').value = String(state.activity);
}

function renderStaticToggles() {
    const act = 'bg-mint-600 text-white border-mint-600 shadow-sm';
    const actM = 'bg-mint-600 text-white border-mint-600 shadow-sm';
    const off = 'bg-neutral-800 text-neutral-300 border-neutral-800 hover:bg-neutral-700';
    const base = 'py-3 px-4 rounded-2xl font-extrabold text-xs transition border flex items-center justify-center gap-2 ';
    $('btn-gender-female').className = base + (state.gender === 'female' ? act : off);
    $('btn-gender-male').className = base + (state.gender === 'male' ? actM : off);

    document.querySelectorAll('#strategy-btns button').forEach(b => {
        b.className = 'px-3 py-1.5 rounded-xl ' + (b.dataset.strat === state.strategy ? 'bg-neutral-900 text-neutral-100 shadow-sm' : 'text-neutral-300 hover:text-white');
    });

}

// =====================================================================
//  CÁLCULOS METABÓLICOS
// =====================================================================
function num(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }

function bmrFormulas(w, h, a, male, ffm) {
    return {
        mifflin: 10 * w + 6.25 * h - 5 * a + (male ? 5 : -161),
        hb: male ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a,
        katch: ffm ? 370 + 21.6 * ffm : null,
    };
}

// ---------- Objetivo personalizado ----------
// Perder grasa: déficit del 10-25 % según tu IMC y tu estrés diario, sin pasar del 1 % del peso por semana
//   (ritmo 0,5-1 %/sem: Garthe 2011, Helms 2014). Ganar músculo: superávit moderado según tu experiencia
//   entrenando (mayor si empiezas, menor si eres avanzado: Iraki et al., 2019).
const GOAL_TYPES = { lose: ['Perder grasa', 'fa-fire'], maintain: ['Mantener', 'fa-scale-balanced'], gain: ['Ganar músculo', 'fa-dumbbell'] };
function goalTypeOf() { return state.goalType || (state.goal < 0 ? 'lose' : state.goal > 0 ? 'gain' : 'maintain'); }
function personalGoal(bmi, w, tdee) {
    const t = goalTypeOf(), adj = state.goalAdj || 0;
    if (!state.goalType) state.goalType = t; // perfiles anteriores: se fija el tipo de objetivo
    if (t === 'maintain') return { t, pct: 0, why: 'Comes lo mismo que gastas: tu peso se mantiene y, entrenando fuerza, mejoras tu composición corporal.' };
    if (t === 'gain') {
        const exp = state.exp || state.gym.level || 'beginner';
        const base = { beginner: 0.15, intermediate: 0.10, advanced: 0.05 }[exp];
        const pct = Math.min(0.20, Math.max(0.03, base + adj * 0.05));
        return { t, exp, pct, why: exp === 'beginner' ? 'Si empiezas, el músculo crece más rápido: un superávit algo mayor lo aprovecha.' : exp === 'intermediate' ? 'Con experiencia el músculo crece más despacio: un superávit moderado evita ganar grasa de más.' : 'Cerca de tu potencial, el músculo crece lento: un superávit pequeño basta.' };
    }
    const stress = state.stress || 'mid';
    let base = bmi >= 30 ? 0.25 : bmi >= 25 ? 0.20 : 0.15;
    base += { low: 0, mid: -0.025, high: -0.05 }[stress];
    let pct = Math.min(0.25, Math.max(0.10, base + adj * 0.05));
    // Tope: nunca más del 1 % del peso por semana
    const maxDef = 0.01 * w * KCAL_PER_KG / 7;
    let capped = false;
    if (pct * tdee > maxDef) { pct = maxDef / tdee; capped = true; }
    const why = (bmi >= 30 ? 'Con tu IMC puedes permitirte un déficit mayor' : bmi >= 25 ? 'Con tu IMC, un déficit moderado' : 'Con un IMC en rango saludable conviene un déficit suave para no perder músculo')
        + (stress === 'high' ? ', y como llevas un día a día exigente lo hemos suavizado.' : stress === 'low' ? '.' : ', algo suavizado para que sea llevadero.')
        + (capped ? ' Limitado para no perder más del 1 % de tu peso por semana.' : '');
    return { t, stress, pct: -pct, why, capped };
}
function setGoalType(t) {
    state.goalType = t; state.goalAdj = 0;
    if (t === 'gain' && !state.exp) state.exp = state.gym.level || 'beginner';
    update();
}
function renderGoalPanel() {
    const c = calc, G = c.G, t = G.t;
    const chip = (on, onclick, label) => `<button type="button" onclick="${onclick}" class="px-3 py-2 rounded-xl border text-xs font-bold ${on ? 'bg-mint-600 text-white border-mint-600' : 'bg-neutral-800/60 text-neutral-300 border-neutral-800 hover:bg-neutral-700'}">${label}</button>`;
    const types = Object.entries(GOAL_TYPES).map(([k, [l, ic]]) => `<button type="button" onclick="setGoalType('${k}')" class="py-3 px-2 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1 ${t === k ? 'bg-mint-600 text-white border-mint-600' : 'bg-neutral-800/60 text-neutral-300 border-neutral-800 hover:bg-neutral-700'}"><i class="fa-solid ${ic} text-base"></i>${l}</button>`).join('');
    let ctx = '';
    if (t === 'lose') ctx = `<div class="space-y-2"><div class="text-xs font-bold text-neutral-300">¿Cómo es tu día a día?</div><div class="flex flex-wrap gap-2">${chip(G.stress === 'low', "setField('stress','low')", 'Tranquilo')}${chip(G.stress === 'mid', "setField('stress','mid')", 'Normal')}${chip(G.stress === 'high', "setField('stress','high')", 'Mucho estrés')}</div></div>`;
    if (t === 'gain') ctx = `<div class="space-y-2"><div class="text-xs font-bold text-neutral-300">¿Cuánto llevas entrenando fuerza?</div><div class="flex flex-wrap gap-2">${chip(G.exp === 'beginner', "setField('exp','beginner')", 'Menos de 1 año')}${chip(G.exp === 'intermediate', "setField('exp','intermediate')", '1-3 años')}${chip(G.exp === 'advanced', "setField('exp','advanced')", 'Más de 3 años')}</div></div>`;
    const adj = state.goalAdj || 0;
    const kcal = Math.round(c.target - c.tdee);
    const res = t === 'lose' && c.goal === 0 ? '<div class="text-sm font-extrabold text-neutral-100">Sin déficit: con tu IMC no se recomienda perder peso</div>'
        : t === 'maintain' ? `<div class="text-sm font-extrabold text-neutral-100">${fmt(c.target)} kcal/día · mantenimiento</div>`
        : `<div class="flex flex-wrap items-baseline justify-between gap-2"><div class="text-sm font-extrabold text-neutral-100">${t === 'lose' ? 'Déficit' : 'Superávit'} recomendado: <span class="text-mint-400">${G.pct > 0 ? '+' : '−'}${fmt(Math.abs(c.goal) * 100, 0)} %</span></div><div class="text-xs font-bold text-neutral-400">${kcal > 0 ? '+' : '−'}${fmt(Math.abs(kcal))} kcal/día</div></div>
           <div class="flex flex-wrap gap-2">${chip(adj === -1, "setField('goalAdj',-1)", t === 'lose' ? 'Más suave' : 'Más limpio')}${chip(adj === 0, "setField('goalAdj',0)", 'Recomendado')}${chip(adj === 1, "setField('goalAdj',1)", 'Más rápido')}</div>`;
    $('goal-list').innerHTML = `<div class="grid grid-cols-3 gap-2">${types}</div>${ctx}
        <div class="p-3 rounded-2xl bg-mint-500/10 border border-mint-500/30 space-y-2">${res}</div>`;
}
function compute() {
    const male = state.gender === 'male';
    const w = state.weight, hcm = state.height, a = state.age, h = hcm / 100;
    const alerts = [];
    const bmiRaw = w / (h * h);
    // IMC redondeado a 1 decimal ANTES de clasificar: la categoría coincide siempre con la cifra mostrada (criterio CDC)
    const bmi = Math.round(bmiRaw * 10) / 10;
    const bf = null, bfSrc = '', ffm = null;
    // Mifflin-St Jeor: la ecuación más precisa en población general (Frankenfield et al., 2005)
    const B = bmrFormulas(w, hcm, a, male, null);
    const formula = 'mifflin';
    const bmr = B[formula];
    const tdeeEst = bmr * state.activity;
    const tdee = tdeeEst; // la calibración manual se quitó (2026-10-06)

    const G = personalGoal(bmi, w, tdee);
    let goal = G.pct;
    if (bmi < 18.5 && goal < 0) {
        goal = 0;
        alerts.push({ t: 'danger', m: 'Tu IMC indica bajo peso. No recomendamos hacer déficit calórico: te mostramos calorías de mantenimiento. Consulta con un profesional.' });
    }
    let target = tdee * (1 + goal);
    const floor = male ? 1500 : 1200;
    if (goal < 0 && target < floor) {
        const newT = Math.min(floor, tdee);
        if (newT > target) {
            target = newT;
            alerts.push({ t: 'warn', m: `Hemos subido tus calorías al mínimo seguro de ${fmt(floor)} kcal (sin supervisión médica no se recomienda comer menos). Para perder más, aumenta tu actividad diaria (pasos).` });
        }
    }
    if (goal <= -0.25 && bmi < 27) alerts.push({ t: 'warn', m: 'Con tu IMC, un déficit del 25 % aumenta el riesgo de perder músculo. Recomendamos −20 % o menos.' });
    target = Math.round(target);

    const weeklyKg = (target - tdee) * 7 / KCAL_PER_KG;
    const weeklyPct = weeklyKg / w * 100;
    if (weeklyPct < -1) alerts.push({ t: 'warn', m: `Ritmo previsto: ${fmt(weeklyPct, 1)} % de tu peso por semana. Por encima del 1 % semanal aumenta la pérdida de masa muscular.` });
    if (a >= 65) alerts.push({ t: 'info', m: 'A partir de 65 años las necesidades de proteína son mayores (≥ 1,2 g/kg) y el IMC saludable se desplaza algo hacia arriba. Valida el plan con un profesional.' });

    // Macros
    const refWeight = bmi >= 30 ? 25 * h * h : w;
    const gkg = { highprotein: goal < 0 ? 2.0 : 1.8, balanced: 1.6, lowcarb: 1.8 }[state.strategy];
    const fatPct = { highprotein: 0.25, balanced: 0.30, lowcarb: 0.40 }[state.strategy];
    let prot = Math.round(gkg * refWeight);
    if (prot * 4 > 0.40 * target) prot = Math.round(0.40 * target / 4);
    let fat = Math.round(Math.max(fatPct * target, 0.20 * target, 0.6 * refWeight * 9) / 9);
    const fiber = Math.max(25, Math.round(14 * target / 1000));
    let carbs = Math.round((target - prot * 4 - fat * 9 - fiber * 2) / 4);
    if (carbs < 0) {
        fat = Math.round(0.20 * target / 9);
        carbs = Math.max(0, Math.round((target - prot * 4 - fat * 9 - fiber * 2) / 4));
    }

    const minIdeal = 18.5 * h * h, maxIdeal = 24.9 * h * h;
    const actExtra = { 1.2: 0, 1.375: 0.25, 1.55: 0.5, 1.725: 0.75, 1.9: 1.0 }[state.activity] || 0;
    const water = (male ? 2.0 : 1.6) + actExtra;
    const whtr = null;

    state.goal = Math.round(goal * 1000) / 1000;
    calc = { male, w, h, hcm, a, bmi, bmiRaw, G, bf, bfSrc, ffm, B, formula, bmr, tdeeEst, tdee, goal, target, weeklyKg, weeklyPct, refWeight, gkg, prot, fat, carbs, fiber, minIdeal, maxIdeal, water, whtr, alerts };
}

// =====================================================================
//  RENDER RESULTADOS
// =====================================================================
function renderResults() {
    const c = calc;
    const FNAME = { mifflin: 'Mifflin-St Jeor', katch: 'Katch-McArdle', hb: 'Harris-Benedict rev.' };
    $('res-bmr').innerText = fmt(c.bmr);
    $('res-tdee').innerText = fmt(c.tdee);
    $('res-target-kcal').innerText = fmt(c.target);
    renderGoalPanel();
    const wk = c.weeklyKg;
    $('res-rate').innerHTML = Math.abs(wk) < 0.01 ? 'Peso estable.' :
        `${wk < 0 ? 'Pérdida' : 'Ganancia'} estimada: <strong class="text-white">${fmt(Math.abs(wk), 2)} kg/semana</strong> (${fmt(Math.abs(c.weeklyPct), 1)} % del peso)`;

    const alertCls = { danger: 'bg-roseAccent-50 border-roseAccent-200 text-roseAccent-800', warn: 'bg-amber-500/10 border-amber-500/30 text-amber-200', info: 'bg-blue-500/10 border-blue-500/30 text-blue-200' };
    const alertIcon = { danger: 'fa-circle-exclamation', warn: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    $('alerts').innerHTML = c.alerts.map(al => `<div class="flex gap-3 items-start p-3 rounded-2xl border text-xs font-semibold ${alertCls[al.t]}"><i class="fa-solid ${alertIcon[al.t]} mt-0.5"></i><span>${al.m}</span></div>`).join('');

    // IMC exacto (OMS, adultos ≥ 18 años)
    const b = c.bmi;
    const WHO = [[16, 'Delgadez severa', 'blue'], [17, 'Delgadez moderada', 'blue'], [18.5, 'Delgadez leve', 'blue'], [25, 'Peso normal', 'mint'], [30, 'Sobrepeso (preobesidad)', 'amber'], [35, 'Obesidad de grado I', 'rose'], [40, 'Obesidad de grado II', 'rose'], [999, 'Obesidad de grado III', 'rose']];
    const who = WHO.find(x => b < x[0]);
    const cat = b < 18.5 ? 'Bajo peso' : b < 25 ? 'Peso saludable' : b < 30 ? 'Sobrepeso' : who[1].replace('Obesidad de grado', 'Obesidad grado');
    const CLS = { blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30', mint: 'bg-mint-500/15 text-mint-300 border-mint-500/30', amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30', rose: 'bg-roseAccent-100 text-roseAccent-800 border-roseAccent-200' };
    c.bmiCat = cat;
    $('res-bmi-val').innerText = fmt(b, 1);
    const badge = $('badge-bmi-category'); badge.innerText = cat;
    badge.className = 'px-3 py-1 rounded-full text-xs font-extrabold border whitespace-nowrap ' + CLS[who[2]];
    $('bmi-marker').style.left = ((Math.min(40, Math.max(15, b)) - 15) / 25 * 100) + '%';
    $('res-ideal-weight').innerText = `${fmt(c.minIdeal, 1)} – ${fmt(c.maxIdeal, 1)} kg`;
    $('res-bmi-gap').innerHTML = b < 18.5 ? `<span class="text-blue-300">Ganar ${fmt(c.minIdeal - c.w, 1)} kg</span>` : b > 24.9 ? `<span class="text-amber-300">Perder ${fmt(c.w - c.maxIdeal, 1)} kg</span>` : '<span class="text-mint-400">Ya estás dentro ✓</span>';
    $('res-bmi-prime').innerText = fmt(c.bmiRaw / 25, 2);
    $('res-bmi-who').innerText = who[1];
    $('bmi-table').innerHTML = WHO.map((x, i) => { const lo = i ? WHO[i - 1][0] : null; const rng = lo === null ? '< 16,0' : x[0] === 999 ? '≥ 40,0' : `${fmt(lo, 1)} – ${fmt(x[0] - 0.1, 1)}`; const on = x === who; return `<span class="${on ? 'font-extrabold text-mint-400' : ''}">${x[1]}${on ? ' ← tú' : ''}</span><span class="text-right ${on ? 'font-extrabold text-mint-400' : 'text-neutral-400'}">${rng}</span>`; }).join('');
    const notes = ['El IMC no distingue músculo de grasa: si entrenas fuerza y tienes mucha masa muscular puede salir alto sin que sobre grasa.'];
    if (c.a >= 65) notes.push('Mayor de 65 años: el menor riesgo de mortalidad se observa con un IMC algo más alto, en torno a 24-30 (Winter et al., 2014); por debajo de 23 conviene vigilar la pérdida de músculo.');
    notes.push('En población de origen asiático la OMS propone puntos de acción más bajos: 23 (riesgo aumentado) y 27,5 (riesgo alto).');

    // Macros
    const pk = c.prot * 4, fk = c.fat * 9, ck = c.carbs * 4, tot = c.target;
    const pp = Math.round(pk / tot * 100), fp = Math.round(fk / tot * 100), cp = Math.round(ck / tot * 100);
    $('res-prot-grams').innerText = `${c.prot} g`; $('res-prot-kcal').innerText = `${fmt(pk)} kcal`; $('pct-prot').innerText = `${pp} %`; $('bar-prot').style.width = pp + '%';
    $('res-fats-grams').innerText = `${c.fat} g`; $('res-fats-kcal').innerText = `${fmt(fk)} kcal`; $('pct-fats').innerText = `${fp} %`; $('bar-fats').style.width = fp + '%';
    $('res-carbs-grams').innerText = `${c.carbs} g`; $('res-carbs-kcal').innerText = `${fmt(ck)} kcal`; $('pct-carbs').innerText = `${cp} %`; $('bar-carbs').style.width = cp + '%';
    $('res-fiber').innerText = `${c.fiber} g/día (${fmt(c.fiber * 2)} kcal)`;
    $('res-water').innerText = `≈ ${fmt(c.water, 1)} L/día + 0,5 L por hora de ejercicio`;

}
