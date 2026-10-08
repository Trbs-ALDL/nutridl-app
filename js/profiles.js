// nutriDL · Perfiles en el dispositivo y copias de seguridad
'use strict';

// =====================================================================
//  PERFILES (varias personas en el mismo dispositivo)
// =====================================================================
function mergeState(s) {
    const d = JSON.parse(JSON.stringify(DEFAULT_STATE));
    s = s || {};
    const arr = v => Array.isArray(v) ? v : [];
    const m = { ...d, ...s, diet: { ...d.diet, ...(s.diet || {}) }, gym: { ...d.gym, ...(s.gym || {}) }, diary: (s.diary && typeof s.diary === 'object') ? s.diary : {},
        weights: arr(s.weights), workouts: arr(s.workouts), customFoods: arr(s.customFoods) };
    if (!s.prefs) m.tab = 'home'; // perfiles de la 2.x: la app abre en «Hoy», no en la calculadora
    m.prefs = { ...d.prefs, ...(s.prefs || {}) };
    m.ach = (s.ach && typeof s.ach === 'object') ? s.ach : {}; m.cel = (s.cel && typeof s.cel === 'object') ? s.cel : {};
    m.chat = arr(s.chat).slice(-40); m.measures = arr(s.measures); m.meals = arr(s.meals);
    m.gym.eq = 'gym'; // la rutina es solo de gimnasio
    if (s.calcOk === undefined) m.calcOk = PAIRS_OK(m);
    delete m.gym.style; // el método FST-7 se quitó: todas las rutinas son las basadas en evidencia
    return m;
}
function persistProfiles() { try { profiles.v = 1; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); } catch (e) { } }
function refreshAll() {
    calcEditing = false;
    syncCustomFoods();
    diaryDate = null; diarySel = null; gymDay = 0;
    syncInputsFromState();
    update(); renderTracker(); renderMeasures(); renderProfileChip(); renderDiary(); renderDashboard(); updateSticky(); renderPrefs(); renderTrainCard();
    if (state.tab === 'coach') renderCoach();
    if (state.tab === 'progress') renderProgress();
}
function newProfile() {
    closeProfileMenu();
    wz.prevProfile = profiles.current;
    if (profiles.current) { save(); profiles.current = null; state = mergeState(null); refreshAll(); }
    openWizard('create');
}
function finishProfileFromWizard() {
    wz.done = true;
    if (wz.mode === 'create' || !profiles.current) {
        const id = 'p' + Date.now().toString(36);
        profiles.list[id] = { name: wz.name || 'Yo', created: todayISO(), state };
        profiles.current = id;
    } else profiles.list[profiles.current].name = wz.name || profiles.list[profiles.current].name;
    // El peso del asistente queda registrado como peso de hoy
    const t = todayISO();
    state.weights = state.weights.filter(e => e.d !== t).concat([{ d: t, w: state.weight }]).sort((a, b) => a.d.localeCompare(b.d));
    wz.prevProfile = null;
    save();
}
function switchProfile(id, silent) {
    if (!profiles.list[id]) return;
    save();
    profiles.current = id;
    state = mergeState(profiles.list[id].state);
    profiles.list[id].state = state;
    persistProfiles();
    closeProfileMenu();
    refreshAll(); showTab('home');
    if (!silent) toast(`Perfil de ${profiles.list[id].name}`);
}
async function deleteProfile(id) {
    id = id || profiles.current;
    const target = profiles.list[id]; if (!target) return;
    closeProfileMenu();
    if (!(await askConfirm(`¿Borrar el perfil de ${target.name}? Se borrarán sus datos, su diario, sus pesos y sus entrenamientos. No se puede deshacer.`, 'Borrar perfil'))) return;
    const wasCurrent = id === profiles.current;
    if (!wasCurrent) save();
    delete profiles.list[id];
    if (wasCurrent) {
        profiles.current = Object.keys(profiles.list)[0] || null;
        state = mergeState(profiles.current ? profiles.list[profiles.current].state : null);
        if (profiles.current) profiles.list[profiles.current].state = state;
    }
    persistProfiles(); save();
    if (wasCurrent) { refreshAll(); showTab('home'); } else renderProfileChip();
    toast(`Perfil de ${target.name} borrado`);
}
const initial = n => { const m = String(n || '').match(/\p{L}|\p{N}/u); return esc(m ? m[0].toUpperCase() : '?'); };
function renderProfileChip() {
    const box = $('profile-chip'); if (!box) return;
    const cur = profiles.list[profiles.current];
    if (!cur) {
        box.innerHTML = `<div class="flex items-center gap-2"><button onclick="newProfile()" class="px-4 py-2 rounded-xl bg-mint-600 hover:bg-mint-700 text-white text-sm font-extrabold flex items-center gap-2"><i class="fa-solid fa-user-plus"></i><span class="whitespace-nowrap">Crear perfil</span></button>
            <button onclick="importProfiles()" class="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-mint-500/50" title="Cargar una copia de seguridad" aria-label="Cargar una copia de seguridad"><i class="fa-solid fa-upload"></i></button></div>`;
        return;
    }
    const others = Object.entries(profiles.list);
    box.innerHTML = `<button onclick="toggleProfileMenu(event)" class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-mint-500/50" aria-haspopup="true" aria-expanded="false" id="profile-btn">
            <span class="w-8 h-8 rounded-xl bg-mint-600 text-white font-extrabold grid place-items-center">${initial(cur.name)}</span>
            <span class="hidden sm:block text-sm font-bold text-neutral-100 max-w-[120px] truncate" title="${esc(cur.name)}">${esc(cur.name)}</span>
            <i class="fa-solid fa-chevron-down text-[10px] text-neutral-500"></i>
        </button>
        <div id="profile-menu" class="hidden absolute right-0 mt-2 w-64 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 text-sm z-50">
            <div class="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Perfiles en este dispositivo</div>
            ${others.map(([id, p]) => `<div class="flex items-center gap-1 rounded-xl hover:bg-neutral-800">
                <button onclick="switchProfile('${id}')" class="flex-1 min-w-0 flex items-center gap-3 px-3 py-2 text-left">
                    <span class="w-7 h-7 rounded-lg ${id === profiles.current ? 'bg-mint-600 text-white' : 'bg-neutral-800 text-neutral-300'} font-extrabold grid place-items-center text-xs">${initial(p.name)}</span>
                    <span class="flex-1 truncate font-semibold" title="${esc(p.name)}">${esc(p.name)}</span>${id === profiles.current ? '<i class="fa-solid fa-check text-mint-500"></i>' : ''}</button>
                <button onclick="event.stopPropagation();deleteProfile('${id}')" class="w-9 h-9 shrink-0 rounded-lg text-neutral-500 hover:text-roseAccent-600 hover:bg-neutral-700" aria-label="Borrar el perfil de ${esc(p.name)}" title="Borrar este perfil"><i class="fa-solid fa-trash text-xs"></i></button>
            </div>`).join('')}
            <div class="my-2 border-t border-neutral-800"></div>
            <button onclick="closeProfileMenu();openWizard('edit')" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-pen w-7 text-center text-neutral-400"></i>Editar mis datos</button>
            <button onclick="newProfile()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-user-plus w-7 text-center text-neutral-400"></i>Añadir otra persona</button>
            <button onclick="exportProfiles()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-download w-7 text-center text-neutral-400"></i>Guardar copia de seguridad</button>
            <button onclick="importProfiles()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-upload w-7 text-center text-neutral-400"></i>Cargar una copia</button>
            <button onclick="deleteProfile(profiles.current)" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left text-roseAccent-600"><i class="fa-solid fa-trash w-7 text-center"></i>Borrar mi perfil</button>
            <div class="my-2 border-t border-neutral-800"></div>
            <button onclick="openPro()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-crown w-7 text-center text-amber-300"></i>nutriDL PRO <span class="nd-pro-badge ml-auto">${isPro() ? 'Activo' : 'Probar'}</span></button>
            <button onclick="openSync()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-rotate w-7 text-center text-neutral-400"></i>Móvil y ordenador</button>
            <button data-install onclick="installApp()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-mobile-screen-button w-7 text-center text-mint-400"></i>Instalar la app</button>
                <button onclick="openReport()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-bug w-7 text-center text-neutral-400"></i>Informe de errores</button>
            <a href="privacidad.html" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left"><i class="fa-solid fa-shield-halved w-7 text-center text-neutral-400"></i>Privacidad</a>
            <button onclick="wipeAll()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 text-left text-roseAccent-600"><i class="fa-solid fa-eraser w-7 text-center"></i>Borrar todos los datos</button>
        </div>`;
}
function toggleProfileMenu(e) {
    if (e) e.stopPropagation();
    renderInstall();
    const m = $('profile-menu'); if (!m) return;
    m.classList.toggle('hidden');
    $('profile-btn').setAttribute('aria-expanded', String(!m.classList.contains('hidden')));
}
function closeProfileMenu() { const m = $('profile-menu'); if (m) m.classList.add('hidden'); }

// ----- Usar nutriDL en varios dispositivos: hoy con copia de seguridad; la sincronización llegará con las cuentas -----
function openSync() {
    closeProfileMenu();
    openSheet('<i class="fa-solid fa-rotate text-mint-400"></i> Móvil y ordenador', `<div class="space-y-4 text-sm text-neutral-300">
        <p>Tus datos viven en este dispositivo. Para pasarlos a otro:</p>
        <ol class="nd-steps"><li>Aquí: <b>Guardar copia de seguridad</b> (descarga un archivo).</li><li>Envíate ese archivo (correo, nube, WhatsApp…).</li><li>En el otro dispositivo: <b>Cargar una copia</b>.</li></ol>
        <div class="grid grid-cols-2 gap-2"><button onclick="closeSheet();exportProfiles()" class="py-3 rounded-xl bg-mint-600 text-white font-extrabold"><i class="fa-solid fa-download"></i> Guardar copia</button><button onclick="closeSheet();importProfiles()" class="py-3 rounded-xl border border-neutral-700 font-bold"><i class="fa-solid fa-upload"></i> Cargar copia</button></div>
        <div class="p-3 rounded-xl bg-neutral-800/60 border border-neutral-800 text-xs text-neutral-400"><b class="text-neutral-200">Próximamente:</b> sincronización automática con una cuenta opcional (PRO). Seguirás pudiendo usar nutriDL sin cuenta.</div>
    </div>`);
    track('sync_open');
}

// ----- Copia de seguridad de los perfiles (para cambiar de móvil o pasar los datos a la app) -----
function exportProfiles() {
    closeProfileMenu(); save();
    const data = { app: 'nutridl', v: 1, exported: new Date().toISOString(), profiles };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `nutridl-copia-${todayISO()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('Copia descargada: guárdala para recuperar tus perfiles');
}
function importProfiles() {
    closeProfileMenu();
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = () => {
        const file = inp.files && inp.files[0]; if (!file) return;
        const r = new FileReader();
        r.onload = async () => {
            let data; try { data = JSON.parse(r.result); } catch (e) { toast('Ese archivo no es una copia de NutriDL'); return; }
            const list = data && data.app === 'nutridl' && data.profiles && data.profiles.list;
            if (!list || typeof list !== 'object') { toast('Ese archivo no es una copia de NutriDL'); return; }
            save();
            const entries = Object.entries(list).filter(([, p]) => p && typeof p === 'object');
            // Mismo perfil (mismo id) ya en este dispositivo: solo se sustituye si lo confirmas
            const clash = entries.filter(([id]) => profiles.list[id]);
            const replace = clash.length ? await askConfirm(`La copia trae datos de ${clash.map(([id]) => profiles.list[id].name).join(', ')}, que ya ${clash.length === 1 ? 'existe' : 'existen'} en este dispositivo. ¿Sustituirlos por los de la copia? Si eliges no, solo se añadirán los perfiles nuevos.`, 'Sustituir') : false;
            let added = 0, updated = 0;
            entries.forEach(([id, p]) => {
                if (profiles.list[id] && !replace) return;
                const entry = { name: String(p.name || 'Perfil').slice(0, 40), created: p.created || todayISO(), state: mergeState(p.state) };
                if (profiles.list[id]) updated++; else added++;
                profiles.list[id] = entry;
            });
            if (!added && !updated) { toast(clash.length ? 'No se ha cambiado nada' : 'La copia no tenía perfiles'); return; }
            if (!profiles.current || !profiles.list[profiles.current]) profiles.current = Object.keys(profiles.list)[0];
            state = mergeState(profiles.list[profiles.current].state);
            profiles.list[profiles.current].state = state;
            persistProfiles(); refreshAll(); showTab('home');
            toast(`Copia cargada: ${added} perfil${added === 1 ? '' : 'es'} nuevo${added === 1 ? '' : 's'}${updated ? `, ${updated} actualizado${updated === 1 ? '' : 's'}` : ''}`);
        };
        r.readAsText(file);
    };
    inp.click();
}
// Si la web está abierta en dos pestañas, la otra se pone al día en vez de pisar los datos
window.addEventListener('storage', e => {
    if (e.key !== PROFILES_KEY || !e.newValue) return;
    try {
        const p = JSON.parse(e.newValue); if (!p || !p.list) return;
        profiles = p;
        const cur = profiles.current && profiles.list[profiles.current];
        state = mergeState(cur ? cur.state : null);
        if (cur) cur.state = state;
        refreshAll();
    } catch (err) { }
});
