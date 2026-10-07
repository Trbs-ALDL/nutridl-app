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
    syncWeightFromLog();
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
    save(); renderMeasures(); toast('Medidas guardadas');
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
}
