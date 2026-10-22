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
    toast('Registro guardado. Tus calorías y macros se han actualizado');
}
// Confirmación propia: devuelve una promesa (true si el usuario acepta)
function askConfirm(msg, okLabel = 'Aceptar') {
    return new Promise(resolve => {
        const m = $('confirm-modal'), ok = $('confirm-ok'), cancel = $('confirm-cancel');
        $('confirm-msg').textContent = tr(msg); ok.textContent = tr(okLabel);
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
    if (!(await askConfirm(tr('¿Borrar el registro de peso del {d}?', { d: new Date(d + 'T12:00:00').toLocaleDateString(locale()) }), 'Borrar'))) return;
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
        $('trk-chart').innerHTML = '<div class="p-6 rounded-2xl bg-neutral-800/60 border border-dashed border-neutral-700 text-center text-xs text-neutral-400">' + tr('Añade tu primer registro para ver tu gráfica de progreso.') + '</div>';
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
        stat(tr('Primer registro'), `${fmt(first.w, 1)} kg`, new Date(first.d + 'T12:00:00').toLocaleDateString(locale())) +
        stat(tr('Media últimos 7 días'), `${fmt(avgNow, 1)} kg`, tp(L.filter(e => dayNum(e.d) > d1 - 7).length, 'registro', 'registros')) +
        stat(tr('Cambio (medias)'), `<span class="${diff < 0 ? 'text-mint-400' : diff > 0 ? 'text-roseAccent-600' : ''}">${diff > 0 ? '+' : ''}${fmt(diff, 1)} kg</span>`, tr('en {k} días', { k: span })) +
        stat(tr('Ritmo semanal'), rate === null ? '—' : `${rate > 0 ? '+' : ''}${fmt(rate, 2)} kg`, rate === null ? tr('necesita 14+ días') : tr('{p} del peso', { p: pctTxt(fmt(rate / avgNow * 100, 1)) }));

    // Gráfica (a ancho real: se lee bien en el móvil)
    const dLabel = d => new Date(d + 'T12:00:00').toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
    const gw = num(state.goalWeight);
    lineChart($('trk-chart'), {
        // 3.17.1 (Ángel): la línea une TODOS tus registros, no la media de 7 días
        aria: tr('Gráfica de peso'), legend: tr('— tu peso cada vez que lo apuntaste'), dotColor: '#dcc19c',
        points: L.map(e => ({ x: dayNum(e.d), y: e.w, tip: `${dLabel(e.d)}: ${fmt(e.w, 1)} kg` })),
        line: L.map(e => ({ x: dayNum(e.d), y: e.w })),
        goal: gw ? { y: gw, label: tr('Objetivo {k} kg', { k: fmt(gw, 1) }) } : null,
        xLabels: [dLabel(first.d), dLabel(last.d)],
    });

    $('trk-actions').innerHTML =
        `<span class="px-3 py-2.5 text-neutral-400"><i class="fa-solid fa-link text-mint-500"></i> ${tr('Tu último registro ({k} kg) es tu peso actual en la calculadora.', { k: fmt(last.w, 1) })}</span>`;
    $('trk-list').innerHTML = L.slice().reverse().map(e => `<div class="p-2 rounded-xl bg-neutral-800/60 border border-neutral-800 flex items-center justify-between gap-1"><span>${new Date(e.d + 'T12:00:00').toLocaleDateString(locale(), { day: '2-digit', month: 'short' })}: <b>${fmt(e.w, 1)}</b></span><button onclick="delWeight('${e.d}')" class="text-neutral-500 hover:text-roseAccent-600" aria-label="${tr('Borrar registro')}"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
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
const MEASURES = [['waist', tk('Cintura')], ['hip', tk('Cadera')], ['chest', tk('Pecho')], ['arm', tk('Brazo')], ['thigh', tk('Muslo')]];
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
        <div class="min-w-0"><div class="text-xs font-bold text-neutral-400">${new Date(m.d + 'T12:00:00').toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">${MEASURES.filter(([k]) => m[k]).map(([k, l]) => { const dv = first && first[k] && first !== m ? m[k] - first[k] : null; return `<span><span class="text-neutral-400">${tr(l)}</span> <b>${fmt(m[k], m[k] % 1 ? 1 : 0)}</b>${dv ? ` <span class="text-xs ${dv < 0 ? 'text-mint-300' : 'text-neutral-400'}">(${dv > 0 ? '+' : ''}${fmt(dv, 1)})</span>` : ''}</span>`; }).join('')}</div></div>
        <button onclick="delMeasures('${m.d}')" class="w-8 h-8 shrink-0 rounded-lg text-neutral-500 hover:text-roseAccent-400" aria-label="${tr('Borrar medidas del {d}', { d: m.d })}"><i class="fa-solid fa-xmark"></i></button>
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
    // Un objetivo por debajo del peso saludable (IMC < 18,5) no se anima: se avisa con cuidado
    const h = num(state.height) / 100;
    if (state.goalWeight && h > 1 && state.goalWeight / (h * h) < 18.5) { toast('Ese peso queda por debajo del rango saludable para tu estatura (IMC menor de 18,5). Antes de buscarlo, consúltalo con un profesional sanitario.'); return; }
    toast(state.goalWeight ? tr('Peso objetivo: {k} kg', { k: fmt(state.goalWeight, 1) }) : 'Peso objetivo quitado');
}
let msKey = 'waist';
function renderMeasureChart() {
    const box = $('ms-chart-box'); if (!box) return;
    if (!canUse('trends')) { box.innerHTML = (state.measures || []).length > 1 ? `<button type="button" onclick="openPaywall('trends')" class="w-full py-3 rounded-xl border border-dashed border-neutral-700 text-sm font-bold text-neutral-300"><i class="fa-solid fa-lock text-amber-300"></i> ${tr('Gráfica de tus medidas')} · PRO</button>` : ''; return; }
    const have = MEASURES.filter(([k]) => (state.measures || []).some(m => m[k]));
    if (!have.length) { box.innerHTML = ''; return; }
    if (!have.some(([k]) => k === msKey)) msKey = have[0][0];
    const pts = (state.measures || []).filter(m => m[msKey]);
    const dLabel = d => new Date(d + 'T12:00:00').toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
    const diff = pts.length > 1 ? pts[pts.length - 1][msKey] - pts[0][msKey] : null;
    box.innerHTML = `<div class="flex flex-wrap items-center gap-2">${have.map(([k, l]) => `<button type="button" onclick="msKey='${k}';renderMeasureChart()" class="px-3 py-1.5 rounded-xl border text-xs font-bold ${k === msKey ? 'bg-mint-600 text-white border-mint-600' : 'bg-neutral-800/60 text-neutral-300 border-neutral-800'}">${tr(l)}</button>`).join('')}
        ${diff != null ? `<span class="ml-auto text-xs font-bold ${diff < 0 ? 'text-mint-300' : 'text-neutral-400'}">${tr('{k} cm desde el {d}', { k: (diff > 0 ? '+' : '') + fmt(diff, 1), d: dLabel(pts[0].d) })}</span>` : ''}</div>
        <div id="ms-chart"></div>`;
    if (pts.length > 1) lineChart($('ms-chart'), { aria: tr('Gráfica de medidas'), legend: tr((MEASURES.find(m => m[0] === msKey) || [, ''])[1]) + ' (cm)', points: pts.map(m => ({ x: dayNum(m.d), y: m[msKey], tip: `${dLabel(m.d)}: ${fmt(m[msKey], 1)} cm` })), line: pts.map(m => ({ x: dayNum(m.d), y: m[msKey] })), xLabels: [dLabel(pts[0].d), dLabel(pts[pts.length - 1].d)], minPad: .5 });
    else $('ms-chart').innerHTML = '<p class="text-xs text-neutral-400">' + tr('Con dos registros verás aquí tu evolución.') + '</p>';
}
function renderProgress() {
    const box = $('prog-summary'); if (!box) return;
    if ($('trk-goal')) $('trk-goal').value = state.goalWeight || '';
    renderMeasureChart();
    if (!profiles.current) { box.innerHTML = `<div class="nd-card p-6 text-center space-y-3"><p class="text-sm text-neutral-300">${tr('Crea tu perfil para ver tu progreso.')}</p><button onclick="newProfile()" class="nd-btn-primary mx-auto">${tr('Empezar gratis')}</button></div>`; $('prog-ach').innerHTML = ''; return; }
    const S = streakInfo(), W = calWeekStats(), T = weightTrend(), L = insightsList();
    const days = W.days.map((d, i) => { const on = loggedOn(d), t = on ? diaryTotals(d) : null, ok = t && calc.prot && t.p >= calc.prot * .9, fut = d > todayISO(); return `<div class="flex flex-col items-center gap-1 flex-1 ${fut ? 'opacity-40' : ''}"><span class="text-[10px] font-bold ${d === todayISO() ? 'text-mint-300' : 'text-neutral-500'}">${dowLetters()[i]}</span><span class="w-8 h-8 rounded-full grid place-items-center text-xs ${on ? (ok ? 'bg-ok-500 text-ok-900' : 'bg-mint-600/40 text-mint-200') : 'bg-neutral-800 text-neutral-600'}">${on ? (ok ? '<i class="fa-solid fa-check"></i>' : '•') : ''}</span></div>`; }).join('');
    const stat = (l, v, s) => `<div class="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800"><div class="text-[11px] font-bold uppercase text-neutral-400">${l}</div><div class="text-lg font-extrabold text-neutral-50">${v}</div>${s ? `<div class="text-[11px] text-neutral-400">${s}</div>` : ''}</div>`;
    const gw = num(state.goalWeight), toGoal = gw && T ? T.now - gw : null;
    box.innerHTML = `<div class="grid lg:grid-cols-5 gap-4">
        <div class="lg:col-span-3 nd-card p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between gap-3"><h3 class="text-lg font-extrabold text-neutral-50">${tr('Tu semana')}</h3>${tagPill('dato')}</div>
            <div class="flex justify-between gap-1">${days}</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                ${stat(tr('Días registrados'), `${W.logged}/${W.past}`)}${stat(tr('Proteína cumplida'), calc.prot ? `${W.protOk}/${W.past}` : '—')}
                ${stat(tr('Media diaria'), W.logged ? `${fmt(W.avgKcal)} kcal` : '—', calc.target ? tr('objetivo {k}', { k: fmt(calc.target) }) : '')}${stat(tr('Entrenos'), W.workouts)}
            </div>
            <p class="text-[11px] text-neutral-500">${tr('De lunes a domingo. ● registrado · ✓ proteína cumplida.')}</p>
        </div>
        <div class="lg:col-span-2 space-y-3">
            <div class="nd-card p-5 flex items-center gap-4"><span class="nd-ic-lg ${S.cur > 0 ? 'text-ok-400' : ''}">${icon('🔥')}</span><div><div class="text-2xl font-extrabold text-neutral-50">${tr(S.cur === 1 ? '{k} día seguido' : '{k} días seguidos', { k: S.cur })}</div><div class="text-xs text-neutral-400">${tr('Mejor racha: {k}', { k: S.best })} · ${S.today ? tr('hoy ya has apuntado ✓') : tr('apunta algo hoy para mantenerla')}</div></div></div>
            ${S.total ? `<button onclick="shareProgress()" class="w-full py-3 rounded-2xl bg-neutral-800/70 border border-neutral-700 text-sm font-extrabold text-neutral-100 hover:border-mint-400"><i class="fa-solid fa-share-nodes text-mint-400"></i> ${tr('Compartir mi semana')}</button>` : ''}
            ${T ? `<div class="nd-card p-5 space-y-1"><div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">${tr('Peso medio (7 días)')}</div><div class="text-2xl font-extrabold text-neutral-50">${fmt(T.now, 1)} kg</div><div class="text-xs text-neutral-400">${T.week != null ? tr('{k} kg respecto a la semana anterior', { k: (T.week > 0 ? '+' : '') + fmt(T.week, 1) }) : tr('Con 2 semanas de registros verás la tendencia')}${toGoal != null ? ` · ${Math.abs(toGoal) < .3 ? tr('¡en tu objetivo!') : tr('{k} kg para tu objetivo', { k: fmt(Math.abs(toGoal), 1) })}` : ''}</div></div>` : ''}
        </div>
    </div>
    ${L.length && !canUse('trends') ? proTeaser('trends') : ''}${L.length && canUse('trends') ? `<div class="nd-card p-5 sm:p-6 space-y-3"><h3 class="text-lg font-extrabold text-neutral-50">${tr('Lo que dicen tus datos')}</h3>${L.slice(0, 5).map(x => `<div class="flex items-start gap-3"><span class="nd-ic">${icon(x.ic)}</span><span class="flex-1 text-sm text-neutral-200">${esc(x.t)}</span>${tagPill(x.k === 'consejo' ? 'rec' : 'dato')}</div>`).join('')}<p class="text-[11px] text-neutral-500">${tr('Interpretación orientativa de tus registros. No es un diagnóstico.')}</p></div>` : ''}`;
    checkAchievements(true);
    const A = state.ach || {};
    $('prog-ach').innerHTML = `<div class="flex items-center justify-between gap-3"><h3 class="text-lg font-extrabold text-neutral-50">${tr('Logros')}</h3><span class="text-xs font-bold text-neutral-400">${Object.keys(A).length}/${ACHIEVEMENTS.length}</span></div>
        <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">${ACHIEVEMENTS.map(([id, ic, name, desc]) => `<div class="nd-ach ${A[id] ? 'on' : ''}" title="${esc(tr(desc))}"><span class="nd-ic">${icon(A[id] ? ic : '🔒')}</span><span class="text-xs font-extrabold text-neutral-100 leading-tight">${tr(name)}</span><span class="text-[10px] text-neutral-400 leading-tight">${A[id] ? new Date(A[id] + 'T12:00:00').toLocaleDateString(locale(), { day: 'numeric', month: 'short' }) : esc(tr(desc))}</span></div>`).join('')}</div>`;
}

// Semana de calendario (lunes a domingo): lo que llevas de esta semana
// Tarjeta para compartir tu semana (imagen 1080×1350 sin librerías). Por privacidad no lleva peso ni medidas.
const SHARE_URL = 'trbs-aldl.github.io/nutridl-app';
async function shareProgress() {
    const S = streakInfo(), W = calWeekStats(), A = Object.keys(state.ach || {}).length;
    const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350;
    const g = cv.getContext('2d'), F = (w, s) => `${w} ${s}px 'Plus Jakarta Sans', sans-serif`;
    try { await document.fonts.load(F(800, 40)); await document.fonts.load(F(600, 40)); } catch (e) { }
    const bg = g.createLinearGradient(0, 0, 0, 1350); bg.addColorStop(0, '#1d1814'); bg.addColorStop(1, '#0d0b0a');
    g.fillStyle = bg; g.fillRect(0, 0, 1080, 1350);
    const glow = g.createRadialGradient(840, 220, 0, 840, 220, 620); glow.addColorStop(0, 'rgba(154,107,64,.35)'); glow.addColorStop(1, 'rgba(154,107,64,0)');
    g.fillStyle = glow; g.fillRect(0, 0, 1080, 1350);
    const box = (x, y, w, h, r, fill) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); };
    g.textBaseline = 'alphabetic';
    // Marca
    g.fillStyle = '#f2ebe3'; g.font = F(800, 52); g.fillText('nutri', 90, 140); const wn = g.measureText('nutri').width;
    g.fillStyle = '#dcc19c'; g.fillText('DL', 90 + wn, 140);
    g.fillStyle = '#a89c90'; g.font = F(600, 34); g.fillText(tr('Mi semana'), 90, 200);
    // Racha
    g.fillStyle = '#f2ebe3'; g.font = F(800, 260); g.fillText(String(S.cur), 80, 520);
    const wr = g.measureText(String(S.cur)).width;
    g.font = F(800, 64); g.fillStyle = '#dcc19c'; g.fillText('🔥', 110 + wr, 520);
    g.fillStyle = '#e4dcd2'; g.font = F(700, 44); g.fillText(S.cur === 1 ? tr('día seguido cuidando lo que como') : tr('días seguidos cuidando lo que como'), 90, 600);
    // Datos de la semana
    const tiles = [[tr('Días registrados'), `${W.logged}/${W.past}`], [tr('Proteína cumplida'), calc.prot ? `${W.protOk}/${W.past}` : '—'], [tr('Entrenos'), String(W.workouts)], [tr('Logros'), String(A)]];
    tiles.forEach(([l, v], i) => {
        const x = 90 + (i % 2) * 460, y = 680 + Math.floor(i / 2) * 230;
        box(x, y, 440, 200, 36, 'rgba(255,255,255,.06)');
        g.fillStyle = '#a89c90'; g.font = F(700, 30); g.fillText(l.toUpperCase(), x + 40, y + 70);
        g.fillStyle = '#f2ebe3'; g.font = F(800, 84); g.fillText(v, x + 40, y + 160);
    });
    // Llamada a la acción
    box(90, 1170, 900, 110, 55, '#9a6b40');
    g.fillStyle = '#ffffff'; g.font = F(800, 36); g.textAlign = 'center'; g.fillText(tr('Calcula tu plan gratis · {u}', { u: SHARE_URL }), 540, 1238); g.textAlign = 'left';
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    if (!blob) { toast('No se pudo crear la imagen'); return; }
    const file = new File([blob], 'mi-semana-nutridl.png', { type: 'image/png' });
    track('share_progress');
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], text: tr(S.cur === 1 ? 'Llevo {k} día seguido con nutriDL. Calcula tu plan gratis: {u}' : 'Llevo {k} días seguidos con nutriDL. Calcula tu plan gratis: {u}', { k: S.cur, u: `https://${SHARE_URL}/` }) }); return; }
        catch (e) { if (e && e.name === 'AbortError') return; }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Imagen guardada: compártela donde quieras');
}

function calWeekStats() {
    const t0 = todayISO(), dow = (new Date(t0 + 'T12:00:00').getDay() + 6) % 7, mon = shiftISO(t0, -dow);
    const days = Array.from({ length: 7 }, (_, i) => shiftISO(mon, i)), past = days.filter(d => d <= t0);
    const logged = past.filter(loggedOn), tot = logged.map(diaryTotals);
    return {
        days, past: past.length, logged: logged.length,
        protOk: calc.prot ? tot.filter(t => t.p >= calc.prot * .9).length : 0,
        avgKcal: tot.length ? tot.reduce((a, t) => a + t.kcal, 0) / tot.length : 0,
        workouts: state.workouts.filter(w => w.d >= mon && w.d <= t0).length,
    };
}
