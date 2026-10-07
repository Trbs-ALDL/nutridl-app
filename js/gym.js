// nutriDL · Gym: tus días, ejercicios, pesos, récords, progreso y descanso
'use strict';

// =====================================================================
//  GYM: tú eliges los días y apuntas tus ejercicios y pesos (sin rutinas prefijadas)
//  state.gym.myDays = días por semana · state.gym.plan[i] = { name, ex: [{ id, n, s: [{ kg, r }] }] }
//  Cada entreno guardado va a state.workouts: { id, d, t, di, ex: [{ id, name, sets: [{ kg, reps }] }] }
// =====================================================================
const getEx = id => EX.find(e => e.id === id);
const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const isoOf = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
let gymDay = 0, gymSaveT;
function myGym() { const g = state.gym; if (!Array.isArray(g.plan)) g.plan = []; return g; }
const gymDays = () => myGym().myDays || 0;
const gymSave = () => { clearTimeout(gymSaveT); gymSaveT = setTimeout(save, 300); };
const exKey = e => e.id || 'n:' + norm(e.name || e.n || '');
function lastPerfOf(e) {
    const k = exKey(e);
    for (let i = state.workouts.length - 1; i >= 0; i--) {
        const x = state.workouts[i].ex.find(y => exKey(y) === k);
        if (x && x.sets.length) return x.sets;
    }
    return null;
}
const kgTxt = kg => fmt(kg, kg % 1 ? 1 : 0);
const perfText = sets => sets.slice(0, 4).map(s => `${s.kg ? kgTxt(s.kg) + ' kg × ' : ''}${s.reps}`).join(' · ');
function weekInfo() {
    const now = new Date(todayISO() + 'T12:00:00'), dow = (now.getDay() + 6) % 7;
    const start = new Date(now); start.setDate(now.getDate() - dow);
    const sIso = isoOf(start);
    const logs = state.workouts.filter(w => w.d >= sIso && w.d <= todayISO());
    const dates = new Set(logs.map(w => w.d));
    const doneDays = new Set(logs.map(w => typeof w.di === 'number' ? 'd' + w.di : 'f' + w.d));
    const strip = DOW.map((l, i) => { const d = new Date(start); d.setDate(start.getDate() + i); const iso = isoOf(d); return { l, done: dates.has(iso), today: i === dow }; });
    return { strip, done: doneDays.size, doneDi: new Set(logs.filter(w => typeof w.di === 'number').map(w => w.di)) };
}

function setMyDays(n) {
    const g = myGym(); g.myDays = n;
    // Los días que sobran no se borran: se conservan por si vuelves a subir el número
    while (g.plan.length < n) g.plan.push({ name: '', ex: [] });
    if (gymDay >= n) gymDay = 0;
    save(); renderGym();
}
function changeMyDays() { myGym().myDays = 0; save(); renderGym(); }
function pickGymDay(i) { gymDay = i; renderGym(); }

function renderGym() {
    const box = $('gym-app'); if (!box) return;
    const g = myGym(), N = gymDays();
    if (!N) {
        box.innerHTML = `<div class="gym-hero rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-neutral-100">¿Cuántos días entrenas a la semana?</h3>
            <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">${[1, 2, 3, 4, 5, 6, 7].map(n => `<button onclick="setMyDays(${n})" class="gym-daybtn aspect-square rounded-2xl text-2xl font-extrabold">${n}<span class="block text-[10px] font-bold uppercase opacity-70">${n === 1 ? 'día' : 'días'}</span></button>`).join('')}</div>
        </div>`;
        return;
    }
    if (gymDay >= N) gymDay = 0;
    const W = weekInfo(), pct = Math.min(100, W.done / N * 100), full = W.done >= N;
    if (full && !g.unlocked) { g.unlocked = true; save(); }
    const day = g.plan[gymDay];
    const dayName = i => esc(g.plan[i].name || `Día ${i + 1}`);
    box.innerHTML = `
        <div class="gym-hero rounded-3xl p-5 sm:p-6 space-y-5">
            <div class="flex items-start justify-between gap-4">
                <div><div class="text-4xl font-extrabold text-neutral-100 leading-none">${W.done}<span class="text-lg text-neutral-400"> / ${N} ${N === 1 ? 'día' : 'días'}</span></div><div class="text-sm font-semibold text-neutral-400 mt-1">entrenados esta semana</div></div>
                <button onclick="changeMyDays()" class="shrink-0 whitespace-nowrap px-3 py-2 rounded-xl bg-neutral-800/80 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/50"><i class="fa-solid fa-calendar-days text-mint-400"></i> Cambiar días</button>
            </div>
            <div class="flex justify-between gap-1">${W.strip.map(x => `<div class="flex flex-col items-center gap-1.5 flex-1"><span class="text-[10px] font-bold ${x.today ? 'text-mint-300' : 'text-neutral-500'}">${x.l}</span><span class="w-8 h-8 rounded-full flex items-center justify-center text-xs ${x.done ? 'bg-mint-600 text-white' : x.today ? 'border-2 border-mint-500 text-mint-300' : 'bg-neutral-800/80 text-neutral-600'}">${x.done ? '<i class="fa-solid fa-check"></i>' : ''}</span></div>`).join('')}</div>
            <div class="h-2 rounded-full bg-neutral-800 overflow-hidden"><div class="h-full rounded-full bg-mint-500 gym-bar" style="width:${pct}%"></div></div>
            ${g.unlocked
                ? `<button onclick="openRecords()" class="w-full py-3.5 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-200 font-extrabold text-sm hover:bg-amber-400/25 flex items-center justify-center gap-2"><i class="fa-solid fa-trophy"></i> Mis pesos más altos</button>`
                : `<div class="w-full py-3.5 rounded-2xl border border-dashed border-neutral-700 text-neutral-400 font-bold text-sm flex items-center justify-center gap-2"><i class="fa-solid fa-lock"></i> Completa tus ${N} días para ver tus pesos más altos</div>`}
        </div>

        <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 gym-tabs" role="tablist" aria-label="Días de entrenamiento">${g.plan.slice(0, N).map((p, i) => `<button role="tab" aria-selected="${i === gymDay}" onclick="pickGymDay(${i})" class="shrink-0 px-4 py-2.5 rounded-2xl text-sm font-extrabold border transition ${i === gymDay ? 'bg-mint-600 text-white border-mint-600' : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-mint-500/40'}">${W.doneDi.has(i) ? '<i class="fa-solid fa-check text-xs"></i> ' : ''}${dayName(i)}</button>`).join('')}</div>

        <div class="glass-card rounded-3xl p-4 sm:p-6 space-y-4 border border-neutral-800">
            <label class="block"><span class="sr-only">Nombre del día</span>
                <input value="${esc(day.name)}" maxlength="40" placeholder="Día ${gymDay + 1} · ponle nombre" oninput="myGym().plan[${gymDay}].name=this.value; gymSave()" onchange="renderGym()" class="w-full bg-transparent text-xl font-extrabold text-neutral-100 placeholder:text-neutral-600 outline-none border-b border-neutral-800 focus:border-mint-500 pb-2"></label>
            <div id="gym-ex" class="space-y-3">${day.ex.length ? day.ex.map((e, k) => gymExHtml(e, k)).join('') : `<div class="p-6 rounded-2xl border border-dashed border-neutral-700 text-center text-sm text-neutral-400"><i class="fa-solid fa-dumbbell text-2xl text-neutral-600 block mb-2"></i>Añade tu primer ejercicio</div>`}</div>
            <div class="space-y-3">
                <div class="relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"></i>
                    <input id="gym-q" type="search" enterkeyhint="done" autocomplete="off" placeholder="Añadir ejercicio: press banca, sentadilla…" oninput="renderGymSearch()" onkeydown="if(event.key==='Enter'){event.preventDefault();addTypedEx()}" class="w-full pl-10 pr-4 py-3 bg-neutral-800/60 border border-neutral-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-mint-500" aria-label="Buscar ejercicio para añadir">
                </div>
                <div id="gym-results" class="grid gap-1.5"></div>
                <div id="gym-sugg"></div>
            </div>
            <div class="space-y-2 text-xs font-bold"><div class="text-neutral-400"><i class="fa-solid fa-stopwatch text-mint-400"></i> Temporizador de descanso</div><div class="grid grid-cols-4 gap-2">${[60, 90, 120, 180].map(s => `<button onclick="startRest(${s})" class="py-2.5 rounded-xl border ${(g.rest || 90) === s ? 'border-mint-500/60 bg-mint-500/10 text-mint-300' : 'border-neutral-800 bg-neutral-800/60 text-neutral-300'} hover:border-mint-500/50">${fmtDur(s)}</button>`).join('')}</div></div>
            <button onclick="saveGymDay()" class="w-full py-4 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold text-base cta-glow flex items-center justify-center gap-2"><i class="fa-solid fa-floppy-disk"></i> Guardar entreno de hoy</button>
        </div>
        ${savedWorkoutsHtml()}`;
    renderGymSearch();
}
function gymExHtml(e, k) {
    const lp = lastPerfOf(e) || [];
    return `<div class="rounded-2xl bg-neutral-900 border border-neutral-800 p-3 space-y-2" data-k="${k}">
        <div class="flex items-start justify-between gap-2">
            <div class="min-w-0"><div class="text-sm font-extrabold text-mint-300 truncate" title="${esc(e.n)}">${esc(e.n)}</div>
                ${lp.length ? `<div class="text-[11px] text-neutral-400 truncate">Última vez: ${perfText(lp)}</div>` : ''}</div>
            <button onclick="removeGymEx(${k})" class="w-8 h-8 shrink-0 rounded-lg text-neutral-500 hover:text-roseAccent-400 hover:bg-neutral-800" aria-label="Quitar ${esc(e.n)}"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        <div class="gset-grid text-[10px] font-bold uppercase text-neutral-500 px-1"><span class="text-center">Serie</span><span class="text-center">kg</span><span class="text-center">Reps</span><span></span></div>
        ${e.s.map((s, i) => `<div class="gset-grid items-center">
            <span class="text-center text-xs font-extrabold text-neutral-300">${i + 1}</span>
            <input type="number" inputmode="decimal" step="0.5" min="0" value="${esc(String(s.kg))}" placeholder="${lp[i] && lp[i].kg ? lp[i].kg : 0}" oninput="gymSet(${k},${i},'kg',this.value)" class="w-full p-2.5 rounded-xl border border-neutral-800 bg-neutral-800 text-center font-bold" aria-label="Kilos serie ${i + 1}">
            <input type="number" inputmode="numeric" min="0" value="${esc(String(s.r))}" placeholder="${lp[i] ? lp[i].reps : 0}" oninput="gymSet(${k},${i},'r',this.value)" class="w-full p-2.5 rounded-xl border border-neutral-800 bg-neutral-800 text-center font-bold" aria-label="Repeticiones serie ${i + 1}">
            <button onclick="removeGymSet(${k},${i})" class="w-8 h-8 mx-auto rounded-lg text-neutral-600 hover:text-roseAccent-400" aria-label="Quitar serie ${i + 1}" ${e.s.length < 2 ? 'disabled style="visibility:hidden"' : ''}><i class="fa-solid fa-xmark"></i></button>
        </div>`).join('')}
        <button onclick="addGymSet(${k})" class="w-full py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-bold hover:bg-neutral-700"><i class="fa-solid fa-plus"></i> Añadir serie</button>
    </div>`;
}
const curDay = () => myGym().plan[gymDay];
function gymSet(k, i, f, v) { curDay().ex[k].s[i][f] = v; gymSave(); }
function addGymSet(k) {
    const s = curDay().ex[k].s; s.push({ kg: s.length ? s[s.length - 1].kg : '', r: '' });
    save(); renderGym();
    const row = document.querySelector(`#gym-ex [data-k="${k}"] .gset-grid:last-of-type`); if (row) ndAnim(row, [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], 180);
}
function removeGymSet(k, i) { const s = curDay().ex[k].s; if (s.length > 1) s.splice(i, 1); save(); renderGym(); }
function removeGymEx(k) {
    const d = curDay(), di = gymDay, [gone] = d.ex.splice(k, 1);
    save(); renderGym();
    toastUndo(`${gone.n} quitado`, () => { myGym().plan[di].ex.splice(k, 0, gone); save(); renderGym(); });
}
function addGymEx(id, name) {
    const d = curDay(); name = (name || '').trim().slice(0, 50); if (!name) return;
    if (d.ex.some(e => exKey(e) === exKey({ id, name }))) { toast('Ese ejercicio ya está en este día'); return; }
    d.ex.push({ id: id || '', n: name, s: [{ kg: '', r: '' }, { kg: '', r: '' }, { kg: '', r: '' }] });
    save(); renderGym();
    const last = document.querySelector('#gym-ex > div:last-child'); if (last) { last.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); ndAnim(last, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], 220); }
}
function addTypedEx() {
    const q = ($('gym-q').value || '').trim(); if (!q) return;
    const m = EX.find(e => norm(e.name) === norm(q));
    addGymEx(m ? m.id : '', m ? m.name : q);
}
// Buscador de ejercicios + recomendaciones opcionales (multiarticulares básicos primero)
function renderGymSearch() {
    const qi = $('gym-q'); if (!qi) return;
    const q = norm(qi.value.trim()), d = curDay(), have = new Set(d.ex.map(exKey));
    const pool = EX.filter(e => e.eq.includes('g') && !have.has(e.id));
    if (q) {
        const hits = pool.filter(e => norm(e.name).includes(q) || norm(e.group).includes(q)).slice(0, 8);
        $('gym-results').innerHTML = hits.map(e => `<button onclick="addGymEx('${e.id}', getEx('${e.id}').name)" class="text-left px-3 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-800 hover:border-mint-500/40 text-sm font-bold text-neutral-100 flex items-center justify-between gap-2"><span class="truncate">${esc(e.name)}</span><span class="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">${e.group}</span></button>`).join('') +
            `<button onclick="addTypedEx()" class="text-left px-3 py-2.5 rounded-xl border border-dashed border-mint-500/40 text-sm font-bold text-mint-300 hover:bg-mint-500/10"><i class="fa-solid fa-plus"></i> Añadir «${esc(qi.value.trim())}»</button>`;
        $('gym-sugg').innerHTML = '';
        return;
    }
    $('gym-results').innerHTML = '';
    const top = pool.filter(e => e.top);
    const off = (gymDay * 5) % Math.max(1, top.length);
    const sugg = [...top.slice(off), ...top.slice(0, off)].slice(0, 6);
    $('gym-sugg').innerHTML = sugg.length ? `<div class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Recomendados</div>
        <div class="flex flex-wrap gap-2">${sugg.map(e => `<button onclick="addGymEx('${e.id}', getEx('${e.id}').name)" class="px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-800 hover:border-mint-500/40 text-xs font-bold text-neutral-200"><i class="fa-solid fa-plus text-mint-400"></i> ${esc(e.name)}</button>`).join('')}</div>` : '';
}
function saveGymDay() {
    const d = curDay();
    const ex = d.ex.map(e => ({ id: e.id || '', name: e.n, sets: e.s.map(s => ({ kg: Math.max(0, num(s.kg) || 0), reps: Math.max(0, Math.round(num(s.r) || 0)) })).filter(s => s.reps > 0) })).filter(e => e.sets.length);
    if (!ex.length) { toast('Apunta al menos las repeticiones de una serie'); return; }
    const t = todayISO(), title = d.name || `Día ${gymDay + 1}`;
    const before = weekInfo().done;
    // Si ese día ya se guardó hoy, se sustituye (no se duplica)
    state.workouts = state.workouts.filter(w => !(w.d === t && w.di === gymDay));
    state.workouts.push({ id: Date.now(), d: t, t: title, di: gymDay, ex }); track('workout_saved');
    d.ex.forEach(e => e.s.forEach(s => { s.kg = ''; s.r = ''; }));
    const N = gymDays(), W = weekInfo(), g = myGym();
    const justUnlocked = W.done >= N && before < N;
    if (justUnlocked) g.unlocked = true;
    save(); renderGym(); renderDashboard();
    if (navigator.vibrate) navigator.vibrate(15);
    toast(justUnlocked ? '🏆 Semana completada: ya puedes ver tus pesos más altos' : `✅ ${title} guardado`);
}

// ----- Pesos más altos de cada ejercicio -----
function bestLifts() {
    const best = {};
    state.workouts.forEach(w => w.ex.forEach(e => {
        const k = exKey(e);
        e.sets.forEach(s => {
            const b = best[k];
            if (!b || s.kg > b.s.kg || (s.kg === b.s.kg && s.reps > b.s.reps)) best[k] = { key: k, name: e.name, s, n: e.sets.length, d: w.d };
        });
    }));
    return Object.values(best).sort((a, b) => b.s.kg - a.s.kg || a.name.localeCompare(b.name));
}
function openRecords() {
    const L = bestLifts(), m = $('gym-records');
    $('gym-records-list').innerHTML = L.length ? L.map((b, i) => `<button type="button" onclick="closeRecords(); openProgress('${b.key}')" class="w-full text-left flex items-center gap-3 p-3 rounded-2xl ${i < 3 ? 'bg-amber-400/10 border border-amber-400/30' : 'bg-neutral-800/60 border border-neutral-800'}">
            <div class="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-extrabold text-sm ${i < 3 ? 'bg-amber-400 text-neutral-900' : 'bg-neutral-800 text-neutral-400'}">${i + 1}</div>
            <div class="min-w-0 flex-1"><div class="font-extrabold text-neutral-100 truncate" title="${esc(b.name)}">${esc(b.name)}</div>
                <div class="text-[11px] text-neutral-400">${b.n} ${b.n === 1 ? 'serie' : 'series'} ese día · ${new Date(b.d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div></div>
            <div class="text-right shrink-0"><div class="text-xl font-extrabold ${i < 3 ? 'text-amber-300' : 'text-neutral-100'}">${b.s.kg ? kgTxt(b.s.kg) + ' kg' : 'Sin peso'}</div><div class="text-xs font-bold text-neutral-400">× ${b.s.reps} reps</div></div>
            <i class="fa-solid fa-chart-line text-neutral-500"></i>
        </button>`).join('') : '<p class="text-sm text-neutral-400 text-center py-6">Aún no hay series guardadas.</p>';
    m.classList.remove('hidden'); document.body.style.overflow = 'hidden';
    setTimeout(() => { const c = m.querySelector('[data-close]'); if (c && matchMedia('(pointer: fine)').matches) c.focus(); }, 30);
}
function closeRecords() { $('gym-records').classList.add('hidden'); document.body.style.overflow = ''; }

// =====================================================================
//  GYM: entrenos guardados (editar / borrar), progreso por ejercicio y temporizador de descanso
// =====================================================================
function savedWorkoutsHtml() {
    const W = state.workouts.slice().reverse().slice(0, 12);
    if (!W.length) return '';
    return `<div class="glass-card rounded-3xl p-4 sm:p-6 space-y-3 border border-neutral-800">
        <h3 class="text-lg font-extrabold text-neutral-100">Entrenos guardados</h3>
        <div class="divide-y divide-neutral-800">${W.map(w => { const n = w.ex.reduce((a, e) => a + e.sets.length, 0); return `<div class="flex items-center gap-2 py-2.5">
            <div class="flex-1 min-w-0"><div class="text-sm font-bold text-neutral-100 truncate">${esc(w.t)}</div>
                <div class="text-xs text-neutral-400">${new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} · ${w.ex.length} ejercicio${w.ex.length === 1 ? '' : 's'} · ${n} serie${n === 1 ? '' : 's'}</div></div>
            <button onclick="editWorkout(${w.id})" class="px-3 py-2 rounded-xl bg-neutral-800 text-xs font-bold text-neutral-200 hover:bg-neutral-700"><i class="fa-solid fa-pen"></i> Editar</button>
            <button onclick="delWorkout(${w.id})" class="w-9 h-9 rounded-xl text-neutral-500 hover:text-roseAccent-400 hover:bg-neutral-800" aria-label="Borrar entreno del ${w.d}"><i class="fa-solid fa-trash-can"></i></button>
        </div>`; }).join('')}</div>
    </div>`;
}
function delWorkout(id) {
    const i = state.workouts.findIndex(w => w.id === id); if (i < 0) return;
    const [gone] = state.workouts.splice(i, 1);
    save(); renderGym(); renderDashboard();
    toastUndo('Entreno borrado', () => { state.workouts.splice(i, 0, gone); save(); renderGym(); renderDashboard(); });
}
function editWorkout(id) {
    const w = state.workouts.find(x => x.id === id); if (!w) return;
    openSheet('<i class="fa-solid fa-pen text-mint-400"></i> Editar entreno', `
        <form onsubmit="event.preventDefault(); saveWorkoutEdit(${id})" class="space-y-4">
            <div class="text-sm text-neutral-400">${esc(w.t)} · ${new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            ${w.ex.map((e, k) => `<div class="rounded-2xl bg-neutral-800/50 border border-neutral-800 p-3 space-y-2">
                <div class="text-sm font-extrabold text-mint-300">${esc(e.name)}</div>
                <div class="gset-grid text-[10px] font-bold uppercase text-neutral-500"><span class="text-center">Serie</span><span class="text-center">kg</span><span class="text-center">Reps</span><span></span></div>
                ${e.sets.map((s, i) => `<div class="gset-grid items-center"><span class="text-center text-xs font-extrabold text-neutral-300">${i + 1}</span>
                    <input data-w="${k}-${i}-kg" type="number" inputmode="decimal" step="0.5" min="0" value="${s.kg || ''}" placeholder="0" class="w-full p-2.5 rounded-xl border border-neutral-800 bg-neutral-800 text-center font-bold" aria-label="Kilos serie ${i + 1}">
                    <input data-w="${k}-${i}-reps" type="number" inputmode="numeric" min="0" value="${s.reps || ''}" placeholder="0" class="w-full p-2.5 rounded-xl border border-neutral-800 bg-neutral-800 text-center font-bold" aria-label="Repeticiones serie ${i + 1}"><span></span></div>`).join('')}
            </div>`).join('')}
            <p class="text-[11px] text-neutral-500">Deja las repeticiones a 0 para quitar una serie.</p>
            <button class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold">Guardar cambios</button>
        </form>`);
}
function saveWorkoutEdit(id) {
    const w = state.workouts.find(x => x.id === id); if (!w) return;
    const val = (k, i, f) => num(document.querySelector(`#nd-sheet [data-w="${k}-${i}-${f}"]`).value) || 0;
    w.ex = w.ex.map((e, k) => ({ ...e, sets: e.sets.map((s, i) => ({ kg: Math.max(0, val(k, i, 'kg')), reps: Math.max(0, Math.round(val(k, i, 'reps'))) })).filter(s => s.reps > 0) })).filter(e => e.sets.length);
    if (!w.ex.length) state.workouts = state.workouts.filter(x => x.id !== id);
    save(); closeSheet(); renderGym(); renderDashboard(); toast('Entreno actualizado');
}
// Progreso de un ejercicio: el peso más alto de cada entreno
function openProgress(key) {
    const pts = [];
    state.workouts.slice().sort((a, b) => a.d.localeCompare(b.d) || a.id - b.id).forEach(w => w.ex.forEach(e => {
        if (exKey(e) !== key) return;
        const top = e.sets.reduce((a, s) => s.kg > a.kg || (s.kg === a.kg && s.reps > a.reps) ? s : a, e.sets[0]);
        pts.push({ d: w.d, kg: top.kg, reps: top.reps, name: e.name });
    }));
    if (!pts.length) return;
    const name = pts[pts.length - 1].name;
    const first = pts[0], last = pts[pts.length - 1], diff = last.kg - first.kg;
    openSheet(`<i class="fa-solid fa-chart-line text-mint-400"></i> ${esc(name)}`, `
        <div class="space-y-4">
            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800"><div class="text-[10px] font-bold uppercase text-neutral-400">Primero</div><div class="text-lg font-extrabold">${kgTxt(first.kg)} kg</div></div>
                <div class="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800"><div class="text-[10px] font-bold uppercase text-neutral-400">Último</div><div class="text-lg font-extrabold">${kgTxt(last.kg)} kg</div></div>
                <div class="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800"><div class="text-[10px] font-bold uppercase text-neutral-400">Cambio</div><div class="text-lg font-extrabold ${diff > 0 ? 'text-mint-300' : ''}">${diff > 0 ? '+' : ''}${kgTxt(diff)} kg</div></div>
            </div>
            <div id="pg-chart"></div>
            <div class="divide-y divide-neutral-800 text-sm">${pts.slice().reverse().slice(0, 10).map(p => `<div class="flex justify-between py-2"><span class="text-neutral-400">${new Date(p.d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span><span class="font-bold">${kgTxt(p.kg)} kg × ${p.reps}</span></div>`).join('')}</div>
        </div>`);
    const dl = d => new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    lineChart($('pg-chart'), {
        aria: 'Progreso de ' + name, legend: 'Peso más alto de cada entreno (kg)', dec: 0, minPad: 2.5,
        points: pts.map((p, i) => ({ x: i, y: p.kg, tip: `${dl(p.d)}: ${kgTxt(p.kg)} kg × ${p.reps}` })),
        line: pts.map((p, i) => ({ x: i, y: p.kg })),
        xLabels: [dl(first.d), pts.length > 1 ? dl(last.d) : ''],
    });
}
// Temporizador de descanso (opcional)
let restT = null;
function startRest(sec) {
    clearInterval(restT);
    myGym().rest = sec; gymSave();
    const end = Date.now() + sec * 1000, bar = $('rest-bar');
    bar.dataset.end = end; bar.dataset.total = sec; bar.classList.remove('hidden');
    const tick = () => {
        const left = Math.max(0, Math.round((+bar.dataset.end - Date.now()) / 1000));
        $('rest-time').textContent = fmtDur(left);
        $('rest-prog').style.width = `${Math.min(100, left / +bar.dataset.total * 100)}%`;
        if (!left) { clearInterval(restT); bar.classList.add('hidden'); if (navigator.vibrate) navigator.vibrate([200, 100, 200]); toast('💪 A por la siguiente serie'); }
    };
    tick(); restT = setInterval(tick, 500);
}
function restAdd(d) { const bar = $('rest-bar'); if (bar.classList.contains('hidden')) return; bar.dataset.end = +bar.dataset.end + d * 1000; bar.dataset.total = Math.max(5, +bar.dataset.total + d); }
function restStop() { clearInterval(restT); $('rest-bar').classList.add('hidden'); }
const fmtDur = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
