// nutriDL · Panel de inicio del perfil
'use strict';

// =====================================================================
//  PANEL DE INICIO DEL PERFIL
// =====================================================================
function ring(value, target, size = 132) {
    const r = size / 2 - 10, C = 2 * Math.PI * r, pct = target > 0 ? Math.min(1, value / target) : 0;
    const over = value > target * 1.05;
    return `<svg viewBox="0 0 ${size} ${size}" class="w-full h-auto max-w-[150px]" role="img" aria-label="${fmt(value)} de ${fmt(target)} kcal">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#262626" stroke-width="12"/>
        <circle class="ring-prog" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${over ? '#c2603f' : '#dcc19c'}" stroke-width="12" stroke-linecap="round"
            stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - pct)).toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
        <text x="50%" y="47%" text-anchor="middle" font-size="22" font-weight="800" fill="#f5f5f5">${fmt(value)}</text>
        <text x="50%" y="62%" text-anchor="middle" font-size="10" fill="#a3a3a3">de ${fmt(target)} kcal</text>
    </svg>`;
}
function macroBar(label, val, target, color) {
    const pct = target > 0 ? Math.min(100, val / target * 100) : 0;
    return `<div class="space-y-1"><div class="flex justify-between text-[11px] font-bold"><span class="text-neutral-300">${label}</span><span class="text-neutral-400">${fmt(val)} / ${fmt(target)} g</span></div>
        <div class="h-2 rounded-full bg-neutral-800 overflow-hidden"><div class="h-full rounded-full" style="width:${pct}%;background:${color}"></div></div></div>`;
}
function renderDashboard() {
    const box = $('dashboard'); if (!box) return;
    const cur = profiles.list[profiles.current];
    $('onboarding').classList.toggle('hidden', !!cur);
    box.classList.toggle('hidden', !cur || !calc.target);
    if (!cur || !calc.target) return;
    const c = calc, t = diaryTotals(todayISO());
    const left = c.target - t.kcal;
    const W = state.weights, first = W[0];
    const change = first ? state.weight - first.w : 0;
    const today = dayNum(todayISO());
    const trained = weekInfo().done, gd = gymDays();
    const goalTxt = c.goal < 0 ? 'Perder grasa' : c.goal > 0 ? 'Ganar músculo' : 'Mantener';
    const tile = (icon, l, v, sub) => `<div class="p-4 rounded-2xl bg-white/5 border border-white/10"><div class="text-[10px] font-bold uppercase text-neutral-400"><i class="fa-solid ${icon} text-mint-400 mr-1"></i>${l}</div><div class="text-xl font-extrabold text-white mt-1">${v}</div>${sub ? `<div class="text-[11px] text-neutral-400">${sub}</div>` : ''}</div>`;
    const btn = (onclick, icon, l) => `<button onclick="${onclick}" class="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold text-white flex items-center justify-center gap-2"><i class="fa-solid ${icon} text-mint-400"></i>${l}</button>`;
    box.innerHTML = `<div class="glass-card-dark rounded-3xl p-6 sm:p-8 space-y-6 text-white">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <div class="text-xs font-bold uppercase tracking-wider text-mint-400">${new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                <h1 class="text-2xl sm:text-3xl font-extrabold">Hola, ${esc(cur.name)} 👋</h1>
                <p class="text-sm text-neutral-400">Objetivo: <strong class="text-neutral-200">${goalTxt}</strong></p>
            </div>
            <button onclick="openWizard('edit')" class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold"><i class="fa-solid fa-pen"></i> Editar perfil</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-4 flex flex-col items-center gap-2">
                ${ring(t.kcal, c.target)}
                <div class="text-sm font-bold ${left >= 0 ? 'text-mint-400' : 'text-roseAccent-400'}">${left >= 0 ? `Te quedan ${fmt(left)} kcal hoy` : `Te has pasado ${fmt(-left)} kcal`}</div>
            </div>
            <div class="md:col-span-8 space-y-4">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    ${tile('fa-weight-scale', 'Peso actual', `${fmt(state.weight, 1)} kg`, first && Math.abs(change) >= 0.05 ? `${change > 0 ? '+' : ''}${fmt(change, 1)} kg desde el ${new Date(first.d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}` : (W.length ? `Último registro: ${new Date(W[W.length - 1].d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}` : 'Apúntalo en Mi progreso'))}
                    ${tile('fa-bullseye', 'Objetivo diario', `${fmt(c.target)} kcal`, `P ${c.prot} · G ${c.fat} · HC ${c.carbs} g`)}
                    ${tile('fa-heart-pulse', 'IMC', fmt(c.bmi, 1), c.bmiCat || '')}
                    ${tile('fa-dumbbell', 'Entrenos esta semana', gd ? `${trained} / ${gd}` : `${trained}`, gd ? (trained >= gd ? 'Semana completada 🎉' : 'días entrenados') : 'elige tus días en Gym')}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    ${macroBar('Proteína', t.p, c.prot, '#a0714b')}${macroBar('Grasa', t.f, c.fat, '#f59e0b')}${macroBar('Hidratos', t.c, c.carbs, '#e6d3b3')}
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            ${btn("openFoodSheet()", 'fa-plus', 'Apuntar comida')}
            ${btn("goTo('sec-progreso');setTimeout(()=>$('trk-w').focus(),500)", 'fa-weight-scale', 'Apuntar peso')}
            ${btn("openScanner()", 'fa-barcode', 'Escanear producto')}
            ${btn("showTab('gym')", 'fa-dumbbell', 'Entrenar')}
        </div>
    </div>`;
}
