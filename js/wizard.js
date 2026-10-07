// nutriDL · Asistente para crear el perfil
'use strict';

// =====================================================================
//  AÑADIDO: ASISTENTE PASO A PASO
// =====================================================================
const WZ_STEPS = ['name', 'goal', 'gender', 'body', 'activity', 'loading', 'done'];
const WZ_Q = WZ_STEPS.indexOf('loading'); // nº de preguntas
const wz = { i: 0, timers: [] };

function openWizard(mode) {
    wz.mode = mode || (profiles.current ? 'edit' : 'create');
    wz.name = profiles.current && wz.mode === 'edit' ? profiles.list[profiles.current].name : (wz.mode === 'create' ? '' : wz.name || '');
    wz.done = false; wz.i = 0; $('wizard').classList.remove('hidden'); document.body.style.overflow = 'hidden'; renderWz();
}
function closeWizard() {
    wz.timers.forEach(clearTimeout); wz.timers = []; $('wizard').classList.add('hidden'); document.body.style.overflow = '';
    // Si se cancela la creación de una persona nueva, se vuelve al perfil que había
    if (wz.mode === 'create' && !wz.done && wz.prevProfile) { const prev = wz.prevProfile; wz.prevProfile = null; switchProfile(prev, true); }
}
function wzSet(k, v) { state[k] = v; wzNext(); }
function wzGoal(t, adj) { state.goalType = t; state.goalAdj = adj; state.goal = t === 'lose' ? -0.15 : t === 'gain' ? 0.10 : 0; if (t === 'gain' && !state.exp) state.exp = state.gym.level || 'beginner'; wzNext(); }
function wzNext() {
    const step = WZ_STEPS[wz.i];
    if (step === 'name') {
        const n = ($('wz-name').value || '').trim();
        if (!n) { toast('Escribe tu nombre para crear tu perfil'); return; }
        wz.name = n.slice(0, 30);
    }
    if (step === 'body') {
        const a = num($('wz-age').value), h = num($('wz-h').value), w = num($('wz-w').value);
        if (!a || a < 18 || a > 90) { toast('Edad entre 18 y 90 años'); return; }
        if (!h || h < 130 || h > 220) { toast('Estatura entre 130 y 220 cm'); return; }
        if (!w || w < 35 || w > 250) { toast('Peso entre 35 y 250 kg'); return; }
        Object.assign(state, { age: a, height: h, weight: w, calcOk: true });
    }
    wz.i++;
    renderWz();
    if (WZ_STEPS[wz.i] === 'loading') wzLoading();
}
function wzBack() {
    if (wz.i <= 0) return;
    wz.i--;
    renderWz();
}
function wzLoading() {
    const n = document.querySelectorAll('#wz-body [data-load]').length;
    for (let k = 0; k < n; k++) {
        wz.timers.push(setTimeout(() => {
            const el = document.querySelector(`#wz-body [data-load="${k}"]`);
            if (el) { el.querySelector('i').className = 'fa-solid fa-circle-check text-mint-600'; el.classList.remove('text-neutral-500'); }
        }, 450 * (k + 1)));
    }
    wz.timers.push(setTimeout(() => {
        finishProfileFromWizard();
        syncInputsFromState();
        update();
        renderTracker(); renderProfileChip(); renderDiary(); renderGym();
        wz.i++; renderWz();
    }, 450 * n + 350));
}
function countUp(el, to) {
    const t0 = performance.now(), dur = 900;
    const tick = now => { const p = Math.min(1, (now - t0) / dur); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
}
function renderWz() {
    const step = WZ_STEPS[wz.i];
    $('wz-bar').style.width = Math.min(100, wz.i / WZ_Q * 100) + '%';
    $('wz-count').innerText = wz.i < WZ_Q ? `Paso ${wz.i + 1} de ${WZ_Q}` : step === 'loading' ? 'Creando tu plan…' : '¡Plan listo!';
    $('wz-back').style.visibility = wz.i > 0 && wz.i < WZ_Q ? 'visible' : 'hidden';
    const title = t => `<h2 id="wz-title" class="text-xl sm:text-2xl font-extrabold text-neutral-100 mb-5">${t}</h2>`; // sin subtítulos
    const tile = (on, onclick, emoji, t, d) => `<button onclick="${onclick}" class="wz-tile w-full text-left p-4 rounded-2xl border-2 flex items-center gap-4 ${on ? 'border-mint-600 bg-mint-500/10' : 'border-neutral-800 hover:border-mint-400 bg-neutral-900'}"><span class="text-3xl">${emoji}</span><span><span class="block font-extrabold text-sm text-neutral-100">${t}</span>${d && step === 'activity' ? `<span class="block text-xs text-neutral-400">${d}</span>` : ''}</span></button>`;
    const next = (label, dis) => `<button onclick="wzNext()" ${dis ? 'disabled' : ''} class="w-full py-4 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold text-sm cta-glow flex items-center justify-center gap-2 ${dis ? 'opacity-50' : ''}">${label || 'Continuar'} <i class="fa-solid fa-arrow-right"></i></button>`;
    let body = '', foot = '';
    switch (step) {
        case 'name':
            body = title(wz.mode === 'edit' ? 'Tu perfil' : '👋 ¡Hola! ¿Cómo te llamas?', wz.mode === 'edit' ? 'Revisa tus datos: todo se recalculará al terminar.' : 'Crearemos tu perfil: la próxima vez que entres estará todo listo (peso, calorías, menú, diario y gym).') +
                `<label class="block p-4 rounded-2xl border-2 border-neutral-800 focus-within:border-mint-500"><span class="text-xs font-bold text-neutral-400 uppercase">Nombre</span><input id="wz-name" type="text" maxlength="30" autocomplete="given-name" value="${esc(wz.name || '')}" placeholder="Ej: Laura" class="w-full text-3xl font-extrabold text-neutral-100 outline-none bg-transparent"></label>
                <p class="text-xs text-neutral-500 mt-3"><i class="fa-solid fa-lock"></i> Sin contraseñas: tu perfil se guarda solo en este dispositivo.</p>`;
            foot = next();
            break;
        case 'goal':
            body = title('¿Qué quieres conseguir?', 'Elige tu objetivo principal. Podrás cambiarlo después.') + `<div class="grid gap-3">` +
                tile(goalTypeOf() === 'lose' && (state.goalAdj || 0) >= 0, "wzGoal('lose',0)", '🔥', 'Perder grasa', 'Bajar de peso a un ritmo saludable y sostenible') +
                tile(goalTypeOf() === 'lose' && state.goalAdj === -1, "wzGoal('lose',-1)", '🌱', 'Perder peso poco a poco', 'Sin prisa y con el mínimo hambre posible') +
                tile(goalTypeOf() === 'maintain', "wzGoal('maintain',0)", '⚖️', 'Mantener mi peso', 'Comer mejor, tener energía y tonificar') +
                tile(goalTypeOf() === 'gain', "wzGoal('gain',0)", '💪', 'Ganar músculo', 'Superávit moderado para minimizar grasa') + `</div>`;
            break;
        case 'gender':
            body = title('¿Cuál es tu sexo biológico?', 'Hombres y mujeres tienen metabolismos distintos: lo necesitamos para la fórmula.') + `<div class="grid grid-cols-2 gap-3">` +
                tile(state.gender === 'female', "wzSet('gender','female')", '👩', 'Mujer', '') +
                tile(state.gender === 'male', "wzSet('gender','male')", '👨', 'Hombre', '') + `</div>`;
            break;
        case 'body': {
            const inp = (id, lab, val, unit, st) => `<label class="block p-4 rounded-2xl border-2 border-neutral-800 focus-within:border-mint-500"><span class="text-xs font-bold text-neutral-400 uppercase">${lab}</span><span class="flex items-baseline gap-2"><input id="${id}" type="number" inputmode="decimal" step="${st}" value="${val || ''}" placeholder="0" class="w-full text-3xl font-extrabold text-neutral-100 outline-none bg-transparent"><span class="text-sm font-bold text-neutral-500">${unit}</span></span></label>`;
            body = title('Cuéntanos sobre tu cuerpo', 'Datos privados: se quedan en tu navegador.') + `<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">` +
                inp('wz-age', 'Edad', state.age, 'años', 1) + inp('wz-h', 'Estatura', state.height, 'cm', 1) + inp('wz-w', 'Peso actual', state.weight, 'kg', 0.1) + `</div>`;
            foot = next();
            break;
        }
        case 'activity':
            body = title('¿Cómo de activo es tu día a día?', 'Sé sincero: casi todos nos sobreestimamos. Si dudas, elige el nivel inferior.') + `<div class="grid gap-3">` +
                tile(state.activity === 1.2, "wzSet('activity',1.2)", '🛋️', 'Sedentario', 'Trabajo sentado, menos de 5.000 pasos, sin ejercicio') +
                tile(state.activity === 1.375, "wzSet('activity',1.375)", '🚶', 'Ligero', '5.000-7.500 pasos o ejercicio 1-3 días/semana') +
                tile(state.activity === 1.55, "wzSet('activity',1.55)", '🏃', 'Moderado', '7.500-10.000 pasos o ejercicio 3-5 días/semana') +
                tile(state.activity === 1.725, "wzSet('activity',1.725)", '🏋️', 'Alto', 'Más de 10.000 pasos y entreno 6-7 días') +
                tile(state.activity === 1.9, "wzSet('activity',1.9)", '⛏️', 'Muy alto', 'Trabajo físico duro y entreno diario') + `</div>`;
            break;
        case 'loading': {
            const items = ['Calculando tu metabolismo basal (Mifflin-St Jeor)', 'Ajustando un déficit seguro para ti', 'Repartiendo proteína, grasa e hidratos', 'Preparando tu diario y tu gym'];
            body = `<div class="py-6 text-center space-y-6"><div class="text-5xl animate-bounce">🥗</div><h2 id="wz-title" class="text-xl font-extrabold">Creando tu plan personalizado…</h2>
                <ul class="text-left max-w-sm mx-auto space-y-3 text-sm font-semibold">${items.map((t, k) => `<li data-load="${k}" class="flex items-center gap-3 text-neutral-500"><i class="fa-solid fa-circle-notch fa-spin text-mint-500"></i>${t}</li>`).join('')}</ul></div>`;
            break;
        }
        case 'done': {
            const c = calc, wk = c.weeklyKg;
            body = `<div class="text-center space-y-1 mb-5"><div class="text-5xl">🎉</div><h2 id="wz-title" class="text-2xl font-extrabold">¡Tu plan está listo!</h2></div>
                <div class="space-y-3">
                    <div class="p-5 rounded-2xl bg-mint-600 text-white text-center">
                        <div class="text-xs font-bold uppercase text-mint-400">Tu objetivo diario</div>
                        <div class="text-4xl font-extrabold"><span id="wz-kcal">0</span> <span class="text-base text-neutral-500">kcal</span></div>
                        <div class="text-xs text-slate-300 mt-1">${Math.abs(wk) < 0.01 ? 'Para mantener tu peso' : `${wk < 0 ? 'Perderás' : 'Ganarás'} ≈ ${fmt(Math.abs(wk), 2)} kg por semana`}</div>
                        <div class="flex flex-wrap justify-center gap-2 mt-3 text-[11px] font-bold">
                            <span class="px-2 py-1 rounded-lg bg-white/10">Proteína ${c.prot} g</span><span class="px-2 py-1 rounded-lg bg-white/10">Grasa ${c.fat} g</span><span class="px-2 py-1 rounded-lg bg-white/10">Hidratos ${c.carbs} g</span>
                        </div>
                    </div>
                    ${c.alerts.filter(a => a.t !== 'info').map(a => `<div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">${a.m}</div>`).join('')}
                </div>`;
            foot = `<button onclick="closeWizard();showTab('food')" class="w-full py-4 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold text-base cta-glow flex items-center justify-center gap-2">Ver mi menú del día <i class="fa-solid fa-arrow-right"></i></button>
                <button onclick="closeWizard();showTab('calc')" class="w-full mt-2 py-2 text-xs font-bold text-neutral-400 hover:text-neutral-200">Ir a mi perfil</button>`;
            break;
        }
    }
    $('wz-body').innerHTML = `<div class="wz-anim">${body}</div>`;
    $('wz-foot').innerHTML = foot;
    $('wz-foot').classList.toggle('hidden', !foot);
    if (step === 'done') countUp($('wz-kcal'), calc.target);
    const firstInput = $('wz-body').querySelector('input[type=number]');
    if (firstInput && window.innerWidth >= 640) firstInput.focus();
}
