// nutriDL · Mi progreso: peso y medidas corporales
'use strict';

// =====================================================================
//  AÑADIDO: MI PROGRESO (registro de peso)
// =====================================================================
const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const dayNum = iso => Math.round(new Date(iso + 'T12:00:00').getTime() / 86400000);
function addWeight() {
    const d = $('trk-date').value || todayISO();
    const w = num($('trk-w').value);
    if (!w || w < 30 || w > 300) { toast('Introduce un peso válido en kg'); return; }
    if (d > todayISO()) { toast('La fecha no puede ser futura'); return; }
    state.weights = state.weights.filter(e => e.d !== d).concat([{ d, w }]).sort((a, b) => a.d.localeCompare(b.d));
    $('trk-w').value = '';
    syncWeightFromLog(); track('weight_logged'); checkAchievements(); if (state.tab === 'progress') renderProgress();
    toast('Registro guardado ✔ Tus calorías y macros se han actualizado');
}
// Confirmación propia: devuelve una promesa (true si el usuario acepta)
function askConfirm(msg, okLabel = 'Aceptar') {
    return new Promise(resolve => {
        const m = $('confirm-modal'), ok = $('confirm-ok'), cancel = $('confirm-cancel');
        $('confirm-msg').textContent = msg; ok.textContent = okLabel;
        m.classList.remove('hidden');
        const done = v => { m.classList.add('hidden'); ok.onclick = cancel.onclick = m.onclick = null; document.removeEventListener('keydown', onKey); resolve(v); };
        const onKey = e => { if (e.key === 'Escape') done(false); };
        ok.onclick = () => done(true);
        cancel.onclick = () => done(false);
        m.onclick = e => { if (e.target === m) done(false); };
        document.addEventListener('keydown', onKey);
        setTimeout(() => cancel.focus(), 30);
    });
}
async function delWeight(d) {
    if (!(await askConfirm(`¿Borrar el registro de peso del ${new Date(d + 'T12:00:00').toLocaleDateString('es-ES')}?`, 'Borrar'))) return;
    state.weights = state.weights.filter(e => e.d !== d);
    syncWeightFromLog();
}
function avgAround(endDay, list) {
    const win = list.filter(e => dayNum(e.d) <= endDay && dayNum(e.d) > endDay - 7);
    return win.length ? win.reduce((a, e) => a + e.w, 0) / win.length : null;
}
function renderTracker() {
    if (!$('trk-stats')) return;
    if (!$('trk-date').value) $('trk-date').value = todayISO();
    $('trk-date').max = todayISO();
    const L = state.weights;
    if (!L.length) {
        $('trk-stats').innerHTML = '';
        $('trk-chart').innerHTML = '<div class="p-6 rounded-2xl bg-neutral-800/60 border border-dashed border-neutral-700 text-center text-xs text-neutral-400">Añade tu primer registro para ver tu gráfica de progreso 📈</div>';
        $('trk-actions').innerHTML = ''; $('trk-list').innerHTML = '';
        return;
    }
    const first = L[0], last = L[L.length - 1];
    const d0 = dayNum(first.d), d1 = dayNum(last.d);
    const avgNow = avgAround(d1, L), avgStart = avgAround(d0 + 6, L);
    const span = d1 - d0;
    const rate = span >= 14 ? (avgNow - avgStart) / ((span - 6) / 7) : null;
    const stat = (l, v, s) => `<div class="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800"><div class="text-[10px] font-bold uppercase text-neutral-400">${l}</div><div class="text-lg font-extrabold">${v}</div>${s ? `<div class="text-[10px] text-neutral-500">${s}</div>` : ''}</div>`;
    const diff = avgNow - avgStart;
    $('trk-stats').innerHTML =
        stat('Primer registro', `${fmt(first.w, 1)} kg`, new Date(first.d + 'T12:00:00').toLocaleDateString('es-ES')) +
        stat('Media últimos 7 días', `${fmt(avgNow, 1)} kg`, (n => `${n} registro${n === 1 ? '' : 's'}`)(L.filter(e => dayNum(e.d) > d1 - 7).length)) +
        stat('Cambio (medias)', `<span class="${diff < 0 ? 'text-mint-400' : diff > 0 ? 'text-roseAccent-600' : ''}">${diff > 0 ? '+' : ''}${fmt(diff, 1)} kg</span>`, `en ${span} días`) +
        stat('Ritmo semanal', rate === null ? '—' : `${rate > 0 ? '+' : ''}${fmt(rate, 2)} kg`, rate === null ? 'necesita 14+ días' : `${fmt(rate / avgNow * 100, 1)} % del peso`);

    // Gráfica (a ancho real: se lee bien en el móvil)
    const dLabel = d => new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const gw = num(state.goalWeight);
    lineChart($('trk-chart'), {
        aria: 'Gráfica de peso', legend: '— media de 7 días   ● registros', dotColor: '#737373',
        points: L.map(e => ({ x: dayNum(e.d), y: e.w, tip: `${dLabel(e.d)}: ${fmt(e.w, 1)} kg` })),
        line: L.map(e => ({ x: dayNum(e.d), y: avgAround(dayNum(e.d), L) })),
        goal: gw ? { y: gw, label: `Objetivo ${fmt(gw, 1)} kg` } : null,
        xLabels: [dLabel(first.d), dLabel(last.d)],
    });

    $('trk-actions').innerHTML =
        `<span class="px-3 py-2.5 text-neutral-400"><i class="fa-solid fa-link text-mint-500"></i> Tu último registro (${fmt(last.w, 1)} kg) es tu peso actual en la calculadora.</span>`;
    $('trk-list').innerHTML = L.slice().reverse().map(e => `<div class="p-2 rounded-xl bg-neutral-800/60 border border-neutral-800 flex items-center justify-between gap-1"><span>${new Date(e.d + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}: <b>${fmt(e.w, 1)}</b></span><button onclick="delWeight('${e.d}')" class="text-neutral-500 hover:text-roseAccent-600" aria-label="Borrar registro"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
}
// El último registro de peso es el peso actual del perfil: todo se recalcula
function syncWeightFromLog() {
    const L = state.weights;
    if (L.length) state.weight = Math.min(250, Math.max(35, L[L.length - 1].w));
    syncInputsFromState(); update(); renderTracker();
}

// =====================================================================
//  MEDIDAS CORPORALES (opcional)
// =====================================================================
const MEASURES = [['waist', 'Cintura'], ['hip', 'Cadera'], ['chest', 'Pecho'], ['arm', 'Brazo'], ['thigh', 'Muslo']];
function addMeasures() {
    const d = $('ms-date').value || todayISO(), rec = { d };
    MEASURES.forEach(([k]) => { const v = num($('ms-' + k).value); if (v && v > 10 && v < 250) rec[k] = round1(v); });
    if (Object.keys(rec).length < 2) { toast('Apunta al menos una medida en cm'); return; }
    state.measures = (state.measures || []).filter(m => m.d !== d).concat([rec]).sort((a, b) => a.d.localeCompare(b.d));
    MEASURES.forEach(([k]) => $('ms-' + k).value = '');
    save(); renderMeasures(); track('measures_logged'); checkAchievements(); toast('Medidas guardadas');
}
function delMeasures(d) {
    const before = state.measures.slice();
    state.measures = state.measures.filter(m => m.d !== d); save(); renderMeasures();
    toastUndo('Medidas borradas', () => { state.measures = before; save(); renderMeasures(); });
}
function renderMeasures() {
    const box = $('ms-list'); if (!box) return;
    if (!$('ms-date').value) $('ms-date').value = todayISO();
    const L = (state.measures || []).slice().reverse();
    const first = (state.measures || [])[0];
    box.innerHTML = L.length ? L.map(m => `<div class="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 flex items-start justify-between gap-3">
        <div class="min-w-0"><div class="text-xs font-bold text-neutral-400">${new Date(m.d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">${MEASURES.filter(([k]) => m[k]).map(([k, l]) => { const dv = first && first[k] && first !== m ? m[k] - first[k] : null; return `<span><span class="text-neutral-400">${l}</span> <b>${fmt(m[k], m[k] % 1 ? 1 : 0)}</b>${dv ? ` <span class="text-xs ${dv < 0 ? 'text-mint-300' : 'text-neutral-400'}">(${dv > 0 ? '+' : ''}${fmt(dv, 1)})</span>` : ''}</span>`; }).join('')}</div></div>
        <button onclick="delMeasures('${m.d}')" class="w-8 h-8 shrink-0 rounded-lg text-neutral-500 hover:text-roseAccent-400" aria-label="Borrar medidas del ${m.d}"><i class="fa-solid fa-xmark"></i></button>
    </div>`).join('') : '';
    renderMeasureChart();
}

// =====================================================================
//  3.0: PESO OBJETIVO, GRÁFICA DE MEDIDAS, RESUMEN SEMANAL, TENDENCIAS Y LOGROS
// =====================================================================
function setGoalWeight(v) {
    const g = num(v);
    state.goalWeight = g && g >= 35 && g <= 250 ? round1(g) : '';
    save(); renderTracker(); renderProgress();
    toast(state.goalWeight ? `Peso objetivo: ${fmt(state.goalWeight, 1)} kg` : 'Peso objetivo quitado');
}
let msKey = 'waist';
function renderMeasureChart() {
    const box = $('ms-chart-box'); if (!box) return;
    const have = MEASURES.filter(([k]) => (state.measures || []).some(m => m[k]));
    if (!have.length) { box.innerHTML = ''; return; }
    if (!have.some(([k]) => k === msKey)) msKey = have[0][0];
    const pts = (state.measures || []).filter(m => m[msKey]);
    const dLabel = d => new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const diff = pts.length > 1 ? pts[pts.length - 1][msKey] - pts[0][msKey] : null;
    box.innerHTML = `<div class="flex flex-wrap items-center gap-2">${have.map(([k, l]) => `<button type="button" onclick="msKey='${k}';renderMeasureChart()" class="px-3 py-1.5 rounded-xl border text-xs font-bold ${k === msKey ? 'bg-mint-600 text-white border-mint-600' : 'bg-neutral-800/60 text-neutral-300 border-neutral-800'}">${l}</button>`).join('')}
        ${diff != null ? `<span class="ml-auto text-xs font-bold ${diff < 0 ? 'text-mint-300' : 'text-neutral-400'}">${diff > 0 ? '+' : ''}${fmt(diff, 1)} cm desde el ${dLabel(pts[0].d)}</span>` : ''}</div>
        <div id="ms-chart"></div>`;
    if (pts.length > 1) lineChart($('ms-chart'), { aria: 'Gráfica de medidas', legend: (MEASURES.find(m => m[0] === msKey) || [, ''])[1] + ' (cm)', points: pts.map(m => ({ x: dayNum(m.d), y: m[msKey], tip: `${dLabel(m.d)}: ${fmt(m[msKey], 1)} cm` })), line: pts.map(m => ({ x: dayNum(m.d), y: m[msKey] })), xLabels: [dLabel(pts[0].d), dLabel(pts[pts.length - 1].d)], minPad: .5 });
    else $('ms-chart').innerHTML = '<p class="text-xs text-neutral-400">Con dos registros verás aquí tu evolución.</p>';
}
function renderProgress() {
    const box = $('prog-summary'); if (!box) return;
    if ($('trk-goal')) $('trk-goal').value = state.goalWeight || '';
    renderMeasureChart();
    if (!profiles.current) { box.innerHTML = `<div class="nd-card p-6 text-center space-y-3"><p class="text-sm text-neutral-300">Crea tu perfil para ver tu progreso.</p><button onclick="newProfile()" class="nd-btn-primary mx-auto">Empezar gratis</button></div>`; $('prog-ach').innerHTML = ''; return; }
    const S = streakInfo(), W = weekStats(), T = weightTrend(), L = insightsList();
    const days = W.days.map(d => { const on = loggedOn(d), t = on ? diaryTotals(d) : null, ok = t && calc.prot && t.p >= calc.prot * .9; return `<div class="flex flex-col items-center gap-1 flex-1"><span class="text-[10px] font-bold text-neutral-500">${'DLMXJVS'[new Date(d + 'T12:00:00').getDay()]}</span><span class="w-8 h-8 rounded-full grid place-items-center text-xs ${on ? (ok ? 'bg-mint-500 text-neutral-950' : 'bg-mint-600/40 text-mint-200') : 'bg-neutral-800 text-neutral-600'}">${on ? (ok ? '<i class="fa-solid fa-check"></i>' : '•') : ''}</span></div>`; }).join('');
    const stat = (l, v, s) => `<div class="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800"><div class="text-[11px] font-bold uppercase text-neutral-400">${l}</div><div class="text-lg font-extrabold text-neutral-50">${v}</div>${s ? `<div class="text-[11px] text-neutral-400">${s}</div>` : ''}</div>`;
    const gw = num(state.goalWeight), toGoal = gw && T ? T.now - gw : null;
    box.innerHTML = `<div class="grid lg:grid-cols-5 gap-4">
        <div class="lg:col-span-3 nd-card p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between gap-3"><h3 class="text-lg font-extrabold text-neutral-50">Tu semana</h3>${tagPill('dato')}</div>
            <div class="flex justify-between gap-1">${days}</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                ${stat('Días registrados', `${W.logged}/7`)}${stat('Proteína cumplida', calc.prot ? `${W.protOk}/7` : '—')}
                ${stat('Media diaria', W.logged ? `${fmt(W.avgKcal)} kcal` : '—', calc.target ? `objetivo ${fmt(calc.target)}` : '')}${stat('Entrenos', W.workouts)}
            </div>
            <p class="text-[11px] text-neutral-500">Últimos 7 días completos. ● registrado · ✓ proteína cumplida.</p>
        </div>
        <div class="lg:col-span-2 space-y-3">
            <div class="nd-card p-5 flex items-center gap-4"><span class="text-4xl leading-none">🔥</span><div><div class="text-2xl font-extrabold text-neutral-50">${S.cur} día${S.cur === 1 ? '' : 's'} seguido${S.cur === 1 ? '' : 's'}</div><div class="text-xs text-neutral-400">Mejor racha: ${S.best} · ${S.today ? 'hoy ya has apuntado ✓' : 'apunta algo hoy para mantenerla'}</div></div></div>
            ${T ? `<div class="nd-card p-5 space-y-1"><div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Peso medio (7 días)</div><div class="text-2xl font-extrabold text-neutral-50">${fmt(T.now, 1)} kg</div><div class="text-xs text-neutral-400">${T.week != null ? `${T.week > 0 ? '+' : ''}${fmt(T.week, 1)} kg respecto a la semana anterior` : 'Con 2 semanas de registros verás la tendencia'}${toGoal != null ? ` · ${Math.abs(toGoal) < .3 ? '¡en tu objetivo!' : `${fmt(Math.abs(toGoal), 1)} kg para tu objetivo`}` : ''}</div></div>` : ''}
        </div>
    </div>
    ${L.length ? `<div class="nd-card p-5 sm:p-6 space-y-3"><h3 class="text-lg font-extrabold text-neutral-50">Lo que dicen tus datos</h3>${L.slice(0, 5).map(x => `<div class="flex items-start gap-3"><span class="text-xl leading-none">${x.ic}</span><span class="flex-1 text-sm text-neutral-200">${esc(x.t)}</span>${tagPill(x.k === 'consejo' ? 'rec' : 'dato')}</div>`).join('')}<p class="text-[11px] text-neutral-500">Interpretación orientativa de tus registros. No es un diagnóstico.</p></div>` : ''}`;
    checkAchievements(true);
    const A = state.ach || {};
    $('prog-ach').innerHTML = `<div class="flex items-center justify-between gap-3"><h3 class="text-lg font-extrabold text-neutral-50">Logros</h3><span class="text-xs font-bold text-neutral-400">${Object.keys(A).length}/${ACHIEVEMENTS.length}</span></div>
        <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">${ACHIEVEMENTS.map(([id, ic, name, desc]) => `<div class="nd-ach ${A[id] ? 'on' : ''}" title="${esc(desc)}"><span class="text-2xl">${A[id] ? ic : '🔒'}</span><span class="text-xs font-extrabold text-neutral-100 leading-tight">${name}</span><span class="text-[10px] text-neutral-400 leading-tight">${A[id] ? new Date(A[id] + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : esc(desc)}</span></div>`).join('')}</div>`;
}
