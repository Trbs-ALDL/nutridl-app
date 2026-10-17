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
// Una serie guardada: { kg, reps } y, si es dropset, drop: [{ kg, reps }, …] con las bajadas que siguen a la primera.
// Los entrenos antiguos no tienen «drop»: son series normales y se leen igual que siempre.
const isDrop = s => Array.isArray(s && s.drop) && s.drop.length > 0;
const setText = (s, x = ' × ') => `${s.kg ? kgTxt(s.kg) + ' kg' + x : ''}${s.reps}${isDrop(s) ? s.drop.map(d => ` ↓ ${d.kg ? kgTxt(d.kg) + x : ''}${d.reps}`).join('') : ''}`;
const setVol = s => s.kg * s.reps + (isDrop(s) ? s.drop.reduce((a, d) => a + d.kg * d.reps, 0) : 0); // el volumen cuenta todas las bajadas
const exVol = e => e.sets.reduce((a, s) => a + setVol(s), 0);
const perfText = sets => sets.slice(0, 4).map(s => setText(s)).join(' · ');
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
function changeMyDays() { openGymSettings(); }
const DOW_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], DOW_LONG = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const todayDow = () => (new Date(todayISO() + 'T12:00:00').getDay() + 6) % 7; // 0 = lunes
let gymAutoDay = false, gsDraft = null;
function openGymSettings() {
    const g = myGym();
    gsDraft = { n: gymDays() || 3, wd: (g.wd || []).slice(), rest: g.rest || 90 };
    openSheet('<i class="fa-solid fa-gear text-mint-400"></i> Ajustes del gym', '<div id="gs-body" class="space-y-5"></div>');
    renderGymSettings();
}
function renderGymSettings() {
    const b = $('gs-body'); if (!b) return;
    const d = gsDraft;
    b.innerHTML = `<div class="space-y-2"><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Días de entreno a la semana</div>
            <div class="grid grid-cols-7 gap-1.5">${[1, 2, 3, 4, 5, 6, 7].map(n => `<button type="button" onclick="gsDraft.n=${n};gsDraft.wd=gsDraft.wd.slice(0,${n});renderGymSettings()" class="py-3 rounded-xl text-sm font-extrabold border ${d.n === n ? 'bg-mint-600 border-mint-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-300'}">${n}</button>`).join('')}</div></div>
        <div class="space-y-2"><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Qué días (opcional) · ${d.wd.length}/${d.n}</div>
            <div class="grid grid-cols-7 gap-1.5">${DOW_SHORT.map((l, i) => { const on = d.wd.includes(i); return `<button type="button" onclick="gsToggle(${i})" aria-pressed="${on}" class="py-3 rounded-xl text-xs font-extrabold border ${on ? 'bg-mint-600 border-mint-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-300'}">${l}</button>`; }).join('')}</div>
            <p class="text-[11px] text-neutral-500">Si los eliges, cada día del plan lleva su día de la semana y al abrir el gym verás el de hoy.</p></div>
        <div class="space-y-2"><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Descanso entre series</div>
            <div class="grid grid-cols-4 gap-2">${[60, 90, 120, 180].map(sec => `<button type="button" onclick="gsDraft.rest=${sec};renderGymSettings()" class="py-2.5 rounded-xl text-xs font-bold border ${d.rest === sec ? 'bg-mint-600 border-mint-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-300'}">${fmtDur(sec)}</button>`).join('')}</div></div>
        <button type="button" onclick="gsSave()" class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold">Guardar ajustes</button>
        <p class="text-[11px] text-neutral-500">Tus ejercicios y tus entrenos guardados no se borran nunca al cambiar los días.</p>`;
}
function gsToggle(i) {
    const d = gsDraft;
    if (d.wd.includes(i)) d.wd = d.wd.filter(x => x !== i);
    else if (d.wd.length < d.n) d.wd.push(i);
    else { toast(`Ya has elegido ${d.n} día${d.n === 1 ? '' : 's'}: quita uno primero`); return; }
    d.wd.sort((a, b) => a - b); renderGymSettings();
}
async function gsSave() {
    const g = myGym(), d = gsDraft, prev = gymDays();
    if (prev && d.n < prev && !(await askConfirm(`¿Pasar de ${prev} a ${d.n} días? Los días que sobran se guardan por si vuelves a subir el número.`, 'Cambiar'))) return;
    g.wd = d.wd.slice(); g.rest = d.rest; gymAutoDay = false;
    setMyDays(d.n); closeSheet(); renderTrainCard(); toast('Ajustes del gym guardados');
}
// Tarjeta «Entrenamiento» en Mi plan
function renderTrainCard() {
    const box = $('train-card'); if (!box) return;
    const g = myGym(), N = gymDays();
    box.innerHTML = `<div class="flex items-center justify-between gap-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-2xl bg-mint-500/15 text-mint-400 flex items-center justify-center text-lg"><i class="fa-solid fa-dumbbell"></i></div>
        <div><h2 class="text-lg font-bold text-neutral-100">Entrenamiento</h2><div class="text-sm text-neutral-400">${N ? `${N} día${N === 1 ? '' : 's'} a la semana${g.wd && g.wd.length ? ' · ' + g.wd.map(i => DOW_SHORT[i]).join(', ') : ''}` : 'Sin días elegidos'}</div></div></div>
        <button type="button" onclick="openGymSettings()" class="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-extrabold text-neutral-100 hover:border-mint-500/50 whitespace-nowrap">${N ? 'Cambiar' : 'Elegir'}</button></div>`;
}
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
    if (!gymAutoDay) { gymAutoDay = true; const i = (g.wd || []).indexOf(todayDow()); if (i >= 0 && i < N) gymDay = i; }
    const W = weekInfo(), pct = Math.min(100, W.done / N * 100), full = W.done >= N;
    if (full && !g.unlocked) { g.unlocked = true; save(); }
    const day = g.plan[gymDay];
    const dayName = i => (g.wd && g.wd[i] != null ? `<span class="opacity-70">${DOW_SHORT[g.wd[i]]}</span> · ` : '') + esc(g.plan[i].name || `Día ${i + 1}`);
    box.innerHTML = `
        <div class="gym-hero rounded-3xl p-5 sm:p-6 space-y-5">
            <div class="flex items-start justify-between gap-4">
                <div><div class="text-4xl font-extrabold text-neutral-100 leading-none">${W.done}<span class="text-lg text-neutral-400"> / ${N} ${N === 1 ? 'día' : 'días'}</span></div><div class="text-sm font-semibold text-neutral-400 mt-1">entrenados esta semana</div></div>

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
            ${sessHtml()}
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
        ${gymHistoryHtml()}`;
    renderGymSearch();
    clearInterval(sessT); sessT = null;
    if (g.sess && !g.sess.pausedAt) sessT = setInterval(sessTick, 1000);
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
        ${e.s.map((s, i) => { const drop = s.t === 'drop', ld = (lp[i] && lp[i].drop) || []; return `<div class="gset-grid items-center">
            <button type="button" onclick="toggleDrop(${k},${i})" class="nd-settype ${drop ? 'is-drop' : ''}" aria-pressed="${drop}" aria-label="Serie ${i + 1}: ${drop ? 'dropset' : 'normal'}. Pulsa para cambiar a ${drop ? 'normal' : 'dropset'}">${i + 1}${drop ? '<small>D</small>' : ''}</button>
            <input type="number" inputmode="decimal" step="0.5" min="0" value="${esc(String(s.kg))}" placeholder="${lp[i] && lp[i].kg ? lp[i].kg : 0}" oninput="gymSet(${k},${i},'kg',this.value)" class="w-full p-2.5 rounded-xl border border-neutral-800 bg-neutral-800 text-center font-bold" aria-label="Kilos serie ${i + 1}">
            <input type="number" inputmode="numeric" min="0" value="${esc(String(s.r))}" placeholder="${lp[i] ? lp[i].reps : 0}" oninput="gymSet(${k},${i},'r',this.value)" class="w-full p-2.5 rounded-xl border border-neutral-800 bg-neutral-800 text-center font-bold" aria-label="Repeticiones serie ${i + 1}">
            <button onclick="removeGymSet(${k},${i})" class="w-8 h-8 mx-auto rounded-lg text-neutral-600 hover:text-roseAccent-400" aria-label="Quitar serie ${i + 1}" ${e.s.length < 2 ? 'disabled style="visibility:hidden"' : ''}><i class="fa-solid fa-xmark"></i></button>
        </div>${drop ? (s.d || []).map((d, j) => `<div class="gset-grid items-center nd-droprow">
            <span class="text-center text-xs font-extrabold text-amber-300" aria-hidden="true">↓</span>
            <input type="number" inputmode="decimal" step="0.5" min="0" value="${esc(String(d.kg))}" placeholder="${ld[j] && ld[j].kg ? ld[j].kg : 0}" oninput="gymDrop(${k},${i},${j},'kg',this.value)" class="w-full p-2 rounded-xl border border-amber-400/25 bg-neutral-800/70 text-center font-bold" aria-label="Kilos bajada ${j + 2} de la serie ${i + 1}">
            <input type="number" inputmode="numeric" min="0" value="${esc(String(d.r))}" placeholder="${ld[j] ? ld[j].reps : 0}" oninput="gymDrop(${k},${i},${j},'r',this.value)" class="w-full p-2 rounded-xl border border-amber-400/25 bg-neutral-800/70 text-center font-bold" aria-label="Repeticiones bajada ${j + 2} de la serie ${i + 1}">
            <button type="button" onclick="removeDrop(${k},${i},${j})" class="w-8 h-8 mx-auto rounded-lg text-neutral-600 hover:text-roseAccent-400" aria-label="Quitar bajada ${j + 2} de la serie ${i + 1}"><i class="fa-solid fa-xmark"></i></button>
        </div>`).join('') + `<button type="button" onclick="addDrop(${k},${i})" class="nd-adddrop"><i class="fa-solid fa-plus"></i> Bajada</button>` : ''}`; }).join('')}
        <button onclick="addGymSet(${k})" class="w-full py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-bold hover:bg-neutral-700"><i class="fa-solid fa-plus"></i> Añadir serie</button>
        ${k === 0 ? '<p class="text-[11px] text-neutral-500">Toca el número de una serie para hacerla dropset y apuntar cada bajada de peso.</p>' : ''}
    </div>`;
}
// Dropsets en el plan del día: s.t = 'drop' y s.d = [{ kg, r }] (las bajadas que siguen a la primera)
function toggleDrop(k, i) {
    const s = curDay().ex[k].s[i];
    if (s.t === 'drop') { delete s.t; }
    else { s.t = 'drop'; if (!Array.isArray(s.d) || !s.d.length) s.d = [{ kg: '', r: '' }]; }
    save(); renderGym();
}
function gymDrop(k, i, j, f, v) { const d = curDay().ex[k].s[i].d; if (d && d[j]) { d[j][f] = v; gymSave(); } }
function addDrop(k, i) {
    const s = curDay().ex[k].s[i]; s.d = Array.isArray(s.d) ? s.d : [];
    if (s.d.length >= 5) { toast('Como mucho 6 pesos dentro de una dropset'); return; }
    s.d.push({ kg: '', r: '' }); save(); renderGym();
}
function removeDrop(k, i, j) {
    const s = curDay().ex[k].s[i]; if (!Array.isArray(s.d)) return;
    s.d.splice(j, 1); if (!s.d.length) delete s.t;
    save(); renderGym();
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
    const m = EX.find(e => norm(e.name) === norm(q)), mine = m ? null : myExercises().find(n => norm(n) === norm(q));
    addGymEx(m ? m.id : '', m ? m.name : mine || q);
}
// Tus ejercicios: los que escribiste tú (no están en la lista), sacados de tus días y de tus entrenos guardados; los más recientes primero
let myExShown = [];
function myExercises() {
    const seen = new Set(), out = [];
    const add = name => { name = String(name || '').trim(); const k = norm(name); if (name && !seen.has(k)) { seen.add(k); out.push(name); } };
    const list = a => Array.isArray(a) ? a : [];
    for (let i = state.workouts.length - 1; i >= 0; i--) list(state.workouts[i] && state.workouts[i].ex).forEach(e => { if (e && !e.id) add(e.name); });
    myGym().plan.forEach(d => list(d && d.ex).forEach(e => { if (e && !e.id) add(e.n); }));
    return out;
}
function addMyEx(i) { const n = myExShown[i]; if (n) addGymEx('', n); }
const myExBtn = (n, i, big) => big
    ? `<button onclick="addMyEx(${i})" class="text-left px-3 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-800 hover:border-mint-500/40 text-sm font-bold text-neutral-100 flex items-center justify-between gap-2"><span class="truncate">${esc(n)}</span><span class="text-[11px] font-semibold text-mint-300 whitespace-nowrap"><i class="fa-solid fa-user"></i> Tuyo</span></button>`
    : `<button onclick="addMyEx(${i})" class="px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-800 hover:border-mint-500/40 text-xs font-bold text-neutral-200"><i class="fa-solid fa-plus text-mint-400"></i> ${esc(n)}</button>`;
// Buscador de ejercicios + recomendaciones opcionales (multiarticulares básicos primero)
function renderGymSearch() {
    const qi = $('gym-q'); if (!qi) return;
    const q = norm(qi.value.trim()), d = curDay(), have = new Set(d.ex.map(exKey));
    const pool = EX.filter(e => e.eq.includes('g') && !have.has(e.id));
    const mine = myExercises().filter(n => !have.has('n:' + norm(n)));
    if (q) {
        myExShown = mine.filter(n => norm(n).includes(q)).slice(0, 5);
        const exact = myExShown.some(n => norm(n) === q);
        const hits = pool.filter(e => norm(e.name).includes(q) || norm(e.group).includes(q)).slice(0, 8);
        $('gym-results').innerHTML = myExShown.map((n, i) => myExBtn(n, i, 1)).join('') + hits.map(e => `<button onclick="addGymEx('${e.id}', getEx('${e.id}').name)" class="text-left px-3 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-800 hover:border-mint-500/40 text-sm font-bold text-neutral-100 flex items-center justify-between gap-2"><span class="truncate">${esc(e.name)}</span><span class="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">${e.group}</span></button>`).join('') +
            (exact ? '' : `<button onclick="addTypedEx()" class="text-left px-3 py-2.5 rounded-xl border border-dashed border-mint-500/40 text-sm font-bold text-mint-300 hover:bg-mint-500/10"><i class="fa-solid fa-plus"></i> Añadir «${esc(qi.value.trim())}»</button>`);
        $('gym-sugg').innerHTML = '';
        return;
    }
    $('gym-results').innerHTML = '';
    const top = pool.filter(e => e.top);
    const off = (gymDay * 5) % Math.max(1, top.length);
    const sugg = [...top.slice(off), ...top.slice(0, off)].slice(0, 6);
    myExShown = mine.slice(0, 8);
    $('gym-sugg').innerHTML = (myExShown.length ? `<div class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Tus ejercicios</div>
        <div class="flex flex-wrap gap-2 mb-3">${myExShown.map((n, i) => myExBtn(n, i)).join('')}</div>` : '') + (sugg.length ? `<div class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Recomendados</div>
        <div class="flex flex-wrap gap-2">${sugg.map(e => `<button onclick="addGymEx('${e.id}', getEx('${e.id}').name)" class="px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-800 hover:border-mint-500/40 text-xs font-bold text-neutral-200"><i class="fa-solid fa-plus text-mint-400"></i> ${esc(e.name)}</button>`).join('')}</div>` : '');
}
function saveGymDay() {
    const d = curDay();
    const kr = x => ({ kg: Math.max(0, num(x.kg) || 0), reps: Math.max(0, Math.round(num(x.r) || 0)) });
    const ex = d.ex.map(e => ({ id: e.id || '', name: e.n, sets: e.s.map(s => {
        const set = kr(s);
        if (s.t === 'drop') { const drop = (s.d || []).map(kr).filter(x => x.reps > 0); if (drop.length) set.drop = drop; }
        return set;
    }).filter(s => s.reps > 0) })).filter(e => e.sets.length);
    if (!ex.length) { toast('Apunta al menos las repeticiones de una serie'); return; }
    const t = todayISO(), title = d.name || `Día ${gymDay + 1}`;
    const before = weekInfo().done;
    const dur = sessSeconds(), w = { id: Date.now(), d: t, t: title, di: gymDay, ex };
    if (dur >= 60 && dur <= 6 * 3600) w.dur = dur; // duración real del entreno (si se usó el cronómetro y es creíble)
    // Si ese día ya se guardó hoy, se sustituye (no se duplica)
    state.workouts = state.workouts.filter(x => !(x.d === t && x.di === gymDay));
    state.workouts.push(w); track('workout_saved');
    stopSession(true);
    d.ex.forEach(e => e.s.forEach(s => { s.kg = ''; s.r = ''; if (Array.isArray(s.d)) s.d.forEach(x => { x.kg = ''; x.r = ''; }); }));
    const N = gymDays(), W = weekInfo(), g = myGym();
    const justUnlocked = W.done >= N && before < N;
    if (justUnlocked) g.unlocked = true;
    save(); renderGym(); renderDashboard();
    if (navigator.vibrate) navigator.vibrate(15);
    toast(justUnlocked ? 'Semana completada: ya puedes ver tus pesos más altos' : `${title} guardado${w.dur ? ' · ' + durTxt(w.dur) : ''}`);
}

// ----- Cronómetro del entreno -----
// Se guarda la HORA de inicio (no un contador): sigue contando aunque cierres la app o se bloquee el móvil.
// g.sess = { start: ms, pausedAt: ms | null, pausedMs: ms acumulados en pausa }
const durTxt = s => { const m = Math.round(s / 60); return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min` : `${m} min`; };
const clockTxt = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
function sessSeconds() {
    const S = myGym().sess; if (!S || !S.start || !Number.isFinite(+S.start)) return 0;
    const end = S.pausedAt || Date.now();
    return Math.max(0, Math.round((end - S.start - (S.pausedMs || 0)) / 1000));
}
let sessT = null;
function sessTick() {
    const el = $('gs-clock');
    if (!myGym().sess || !el) { clearInterval(sessT); sessT = null; return; }
    el.textContent = clockTxt(sessSeconds());
}
function startSession() {
    myGym().sess = { start: Date.now(), pausedAt: null, pausedMs: 0 };
    save(); renderGym(); if (navigator.vibrate) navigator.vibrate(10);
}
function pauseSession() {
    const S = myGym().sess; if (!S) return;
    if (S.pausedAt) { S.pausedMs = (S.pausedMs || 0) + (Date.now() - S.pausedAt); S.pausedAt = null; }
    else S.pausedAt = Date.now();
    save(); renderGym();
}
async function stopSession(silent) {
    if (!myGym().sess) return;
    if (!silent && !(await askConfirm('¿Parar el cronómetro sin guardar el entreno? Tus series apuntadas se quedan.', 'Parar'))) return;
    delete myGym().sess; clearInterval(sessT); sessT = null;
    save(); if (!silent) renderGym();
}
function sessHtml() {
    const S = myGym().sess;
    if (!S) return `<button type="button" onclick="startSession()" class="nd-sess-start"><i class="fa-solid fa-play"></i> Empezar entreno <span>cronómetro</span></button>`;
    const paused = !!S.pausedAt;
    return `<div class="nd-sess ${paused ? 'is-paused' : ''}" role="timer" aria-live="off">
        <i class="fa-solid fa-stopwatch"></i><div class="min-w-0 flex-1"><div class="nd-sess-lbl">${paused ? 'En pausa' : 'Entreno en marcha'}</div><div id="gs-clock" class="nd-sess-time">${clockTxt(sessSeconds())}</div></div>
        <button type="button" onclick="pauseSession()" class="nd-mbtn" aria-label="${paused ? 'Reanudar' : 'Pausar'} cronómetro"><i class="fa-solid ${paused ? 'fa-play' : 'fa-pause'}"></i> ${paused ? 'Seguir' : 'Pausa'}</button>
        <button type="button" onclick="stopSession()" class="nd-mbtn" aria-label="Parar cronómetro sin guardar"><i class="fa-solid fa-stop"></i></button>
    </div>`;
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
const gh = { n: 20, q: '' };
function gymHistoryHtml() {
    const all = state.workouts.slice().sort((a, b) => b.d.localeCompare(a.d) || b.id - a.id);
    if (!all.length) return '';
    const q = norm(gh.q.trim());
    const L = q ? all.filter(w => norm(w.t).includes(q) || w.ex.some(e => norm(e.name).includes(q))) : all;
    const shown = L.slice(0, gh.n);
    let month = '', rows = '';
    shown.forEach(w => {
        const m = new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        if (m !== month) { month = m; rows += `<div class="pt-3 pb-1 text-xs font-extrabold uppercase tracking-wider text-neutral-400 first-letter:uppercase">${m}</div>`; }
        const n = w.ex.reduce((a, e) => a + e.sets.length, 0), vol = w.ex.reduce((a, e) => a + exVol(e), 0);
        rows += `<button type="button" onclick="openWorkout(${+w.id || 0})" class="w-full flex items-center gap-3 py-2.5 text-left border-b border-neutral-800/70">
            <div class="w-11 shrink-0 text-center"><div class="text-[10px] font-bold uppercase text-neutral-500">${new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short' })}</div><div class="text-lg font-extrabold text-neutral-100 leading-none">${+w.d.slice(8)}</div></div>
            <div class="flex-1 min-w-0"><div class="text-sm font-bold text-neutral-100 truncate">${esc(w.t)}</div><div class="text-xs text-neutral-400 truncate">${w.ex.length} ejercicio${w.ex.length === 1 ? '' : 's'} · ${n} serie${n === 1 ? '' : 's'}${w.dur ? ` · ${durTxt(w.dur)}` : ''}${vol ? ` · ${fmt(vol)} kg movidos` : ''}</div></div>
            <i class="fa-solid fa-chevron-right text-neutral-600"></i></button>`;
    });
    return `<div class="glass-card rounded-3xl p-4 sm:p-6 space-y-2 border border-neutral-800">
        <div class="flex items-center justify-between gap-3"><h3 class="text-lg font-extrabold text-neutral-100">Historial</h3><span class="text-xs font-bold text-neutral-400">${all.length} entreno${all.length === 1 ? '' : 's'}</span></div>
        <input type="search" value="${esc(gh.q)}" oninput="gh.q=this.value;gh.n=20;ghRefresh()" placeholder="Buscar: press banca, pierna…" class="w-full px-3 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-800 text-sm font-semibold" aria-label="Buscar en el historial">
        <div id="gh-list">${rows || '<p class="text-sm text-neutral-400 py-4 text-center">Nada con esa búsqueda.</p>'}</div>
        ${L.length > gh.n ? `<button type="button" onclick="gh.n+=30;ghRefresh()" class="w-full mt-2 py-2.5 rounded-xl bg-neutral-800 text-sm font-bold text-neutral-200">Ver más (${L.length - gh.n} más)</button>` : ''}
    </div>`;
}
function ghRefresh() {
    const box = $('gym-app'); if (!box) return;
    const old = box.lastElementChild; if (!old) return;
    const tmp = document.createElement('div'); tmp.innerHTML = gymHistoryHtml();
    const fresh = tmp.firstElementChild; if (!fresh) return;
    old.replaceWith(fresh);
    const inp = fresh.querySelector('input[type=search]'); if (inp && document.activeElement !== inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
}
// Ver un entreno completo
function openWorkout(id) {
    const w = state.workouts.find(x => x.id === id); if (!w) return;
    const vol = w.ex.reduce((a, e) => a + exVol(e), 0);
    openSheet(`<i class="fa-solid fa-dumbbell text-mint-400"></i> ${esc(w.t)}`, `<div class="space-y-4">
        <div class="text-sm text-neutral-400 first-letter:uppercase">${new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${w.dur ? ` · <i class="fa-solid fa-stopwatch"></i> ${durTxt(w.dur)}` : ''}${vol ? ` · ${fmt(vol)} kg movidos` : ''}</div>
        ${w.ex.map(e => `<div class="rounded-2xl bg-neutral-800/50 border border-neutral-800 p-3 space-y-1.5"><button type="button" onclick="closeSheet();openProgress('${exKey(e).replace(/'/g, '')}')" class="text-sm font-extrabold text-mint-300 text-left">${esc(e.name)} <i class="fa-solid fa-chart-line text-[11px] text-neutral-500"></i></button>
            ${e.sets.map((st, i) => `<div class="flex justify-between gap-3 text-sm"><span class="text-neutral-400 shrink-0">Serie ${i + 1}${isDrop(st) ? ' <span class="nd-droptag">Dropset</span>' : ''}</span><span class="font-bold text-neutral-100 text-right">${setText(st)} reps</span></div>`).join('')}</div>`).join('')}
        <div class="grid grid-cols-2 gap-2"><button type="button" onclick="editWorkout(${+w.id || 0})" class="py-3 rounded-xl bg-neutral-800 font-bold text-sm"><i class="fa-solid fa-pen"></i> Editar</button><button type="button" onclick="closeSheet();delWorkout(${+w.id || 0})" class="py-3 rounded-xl border border-neutral-700 text-roseAccent-400 font-bold text-sm"><i class="fa-solid fa-trash-can"></i> Borrar</button></div>
    </div>`);
}
function savedWorkoutsHtml() {
    const W = state.workouts.slice().reverse().slice(0, 12);
    if (!W.length) return '';
    return `<div class="glass-card rounded-3xl p-4 sm:p-6 space-y-3 border border-neutral-800">
        <h3 class="text-lg font-extrabold text-neutral-100">Entrenos guardados</h3>
        <div class="divide-y divide-neutral-800">${W.map(w => { const n = w.ex.reduce((a, e) => a + e.sets.length, 0); return `<div class="flex items-center gap-2 py-2.5">
            <div class="flex-1 min-w-0"><div class="text-sm font-bold text-neutral-100 truncate">${esc(w.t)}</div>
                <div class="text-xs text-neutral-400">${new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} · ${w.ex.length} ejercicio${w.ex.length === 1 ? '' : 's'} · ${n} serie${n === 1 ? '' : 's'}</div></div>
            <button onclick="editWorkout(${+w.id || 0})" class="px-3 py-2 rounded-xl bg-neutral-800 text-xs font-bold text-neutral-200 hover:bg-neutral-700"><i class="fa-solid fa-pen"></i> Editar</button>
            <button onclick="delWorkout(${+w.id || 0})" class="w-9 h-9 rounded-xl text-neutral-500 hover:text-roseAccent-400 hover:bg-neutral-800" aria-label="Borrar entreno del ${w.d}"><i class="fa-solid fa-trash-can"></i></button>
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
                    <input data-w="${k}-${i}-reps" type="number" inputmode="numeric" min="0" value="${s.reps || ''}" placeholder="0" class="w-full p-2.5 rounded-xl border border-neutral-800 bg-neutral-800 text-center font-bold" aria-label="Repeticiones serie ${i + 1}"><span>${isDrop(s) ? '<span class="nd-droptag">D</span>' : ''}</span></div>${isDrop(s) ? s.drop.map((d, j) => `<div class="gset-grid items-center nd-droprow"><span class="text-center text-xs font-extrabold text-amber-300" aria-hidden="true">↓</span>
                    <input data-w="${k}-${i}-d${j}-kg" type="number" inputmode="decimal" step="0.5" min="0" value="${d.kg || ''}" placeholder="0" class="w-full p-2 rounded-xl border border-amber-400/25 bg-neutral-800/70 text-center font-bold" aria-label="Kilos bajada ${j + 2} de la serie ${i + 1}">
                    <input data-w="${k}-${i}-d${j}-reps" type="number" inputmode="numeric" min="0" value="${d.reps || ''}" placeholder="0" class="w-full p-2 rounded-xl border border-amber-400/25 bg-neutral-800/70 text-center font-bold" aria-label="Repeticiones bajada ${j + 2} de la serie ${i + 1}"><span></span></div>`).join('') : ''}`).join('')}
            </div>`).join('')}
            <p class="text-[11px] text-neutral-500">Deja las repeticiones a 0 para quitar una serie.</p>
            <button class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold">Guardar cambios</button>
        </form>`);
}
function saveWorkoutEdit(id) {
    const w = state.workouts.find(x => x.id === id); if (!w) return;
    const val = (k, i, f) => num(document.querySelector(`#nd-sheet [data-w="${k}-${i}-${f}"]`).value) || 0;
    w.ex = w.ex.map((e, k) => ({ ...e, sets: e.sets.map((s, i) => {
        const set = { kg: Math.max(0, val(k, i, 'kg')), reps: Math.max(0, Math.round(val(k, i, 'reps'))) };
        if (isDrop(s)) { const drop = s.drop.map((d, j) => ({ kg: Math.max(0, val(k, i, `d${j}-kg`)), reps: Math.max(0, Math.round(val(k, i, `d${j}-reps`))) })).filter(d => d.reps > 0); if (drop.length) set.drop = drop; }
        return set;
    }).filter(s => s.reps > 0) })).filter(e => e.sets.length);
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
        if (!left) { clearInterval(restT); bar.classList.add('hidden'); if (navigator.vibrate) navigator.vibrate([200, 100, 200]); toast('Descanso terminado: a por la siguiente serie'); }
    };
    tick(); restT = setInterval(tick, 500);
}
function restAdd(d) { const bar = $('rest-bar'); if (bar.classList.contains('hidden')) return; bar.dataset.end = +bar.dataset.end + d * 1000; bar.dataset.total = Math.max(5, +bar.dataset.total + d); }
function restStop() { clearInterval(restT); $('rest-bar').classList.add('hidden'); }
const fmtDur = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
