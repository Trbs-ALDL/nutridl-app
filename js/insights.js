// nutriDL · Rachas, logros, resumen semanal y mensajes que interpretan tu progreso
// Solo se usan tus datos guardados; nunca se diagnostica nada.
'use strict';

const loggedOn = d => (state.diary[d] || []).length > 0;
const lastDays = (n, from = todayISO()) => Array.from({ length: n }, (_, i) => shiftISO(from, -i)).reverse();

// Racha: días seguidos con alguna comida apuntada. Si hoy aún no has apuntado nada, la racha sigue viva desde ayer.
function streakInfo() {
    const today = todayISO();
    let d = loggedOn(today) ? today : shiftISO(today, -1), cur = 0;
    while (loggedOn(d)) { cur++; d = shiftISO(d, -1); }
    const days = Object.keys(state.diary).filter(loggedOn).sort();
    let best = 0, run = 0, prev = null;
    days.forEach(x => { run = prev && shiftISO(prev, 1) === x ? run + 1 : 1; best = Math.max(best, run); prev = x; });
    return { cur, best: Math.max(best, cur), today: loggedOn(today), total: days.length };
}

// Cómo ha ido una semana (los 7 días anteriores a «hasta», sin incluir hoy si aún no ha terminado)
function weekStats(until = shiftISO(todayISO(), -1)) {
    const days = lastDays(7, until), c = calc;
    const logged = days.filter(loggedOn);
    const tot = logged.map(diaryTotals);
    const protOk = c.prot ? tot.filter(t => t.p >= c.prot * .9).length : 0;
    const kcalOk = c.target ? tot.filter(t => Math.abs(t.kcal - c.target) <= c.target * .1).length : 0;
    const avg = k => tot.length ? tot.reduce((a, t) => a + t[k], 0) / tot.length : 0;
    const wk = state.workouts.filter(w => w.d >= days[0] && w.d <= until).length;
    return { days, logged: logged.length, protOk, kcalOk, avgKcal: avg('kcal'), avgP: avg('p'), workouts: wk };
}

// Tendencia del peso con medias de 7 días (la báscula sube y baja por agua: la media dice la verdad)
function weightTrend() {
    const L = state.weights; if (L.length < 2) return null;
    const lastD = dayNum(L[L.length - 1].d);
    const avg = (end) => { const w = L.filter(e => dayNum(e.d) <= end && dayNum(e.d) > end - 7); return w.length ? w.reduce((a, e) => a + e.w, 0) / w.length : null; };
    const now = avg(lastD), prev = avg(lastD - 7), prev3 = avg(lastD - 21);
    const n21 = L.filter(e => dayNum(e.d) > lastD - 21).length;
    return { now, prev, week: prev != null ? now - prev : null, stable3: prev3 != null && n21 >= 6 && Math.abs(now - prev3) < .3, lastD };
}

// Mensajes de seguimiento: datos (lo que has hecho), tendencias (lo que muestran tus datos) y consejos
function insightsList() {
    const out = [], c = calc, S = streakInfo(), W = weekStats(), T = weightTrend(), goal = typeof goalTypeOf === 'function' ? goalTypeOf() : 'maintain';
    if (S.cur >= 2) out.push({ k: 'dato', ic: '🔥', t: `Has registrado comida ${S.cur} días seguidos.`, pr: S.cur >= 7 ? 9 : 6 });
    if (W.logged >= 3 && c.prot) out.push({ k: 'dato', ic: W.protOk >= 5 ? '🏆' : '🥩', t: `Has cumplido tu objetivo de proteína ${W.protOk}/7 días esta semana.`, pr: W.protOk >= 5 ? 8 : 7 });
    if (W.logged >= 3 && c.target) out.push({ k: 'dato', ic: '🎯', t: `Tus calorías han estado en tu objetivo (±10 %) ${W.kcalOk} de ${W.logged} días registrados.`, pr: 5 });
    if (T && T.week != null && Math.abs(T.week) >= .1) {
        const dir = T.week < 0 ? 'bajado' : 'subido';
        const good = (goal === 'lose' && T.week < 0) || (goal === 'gain' && T.week > 0);
        out.push({ k: 'tendencia', ic: good ? '📉' : '📈', t: `Tu peso medio ha ${dir} ${fmt(Math.abs(T.week), 1)} kg esta semana.${good ? ' Vas en la dirección de tu objetivo.' : ''}`, pr: 8 });
    }
    if (T && T.stable3) out.push({ k: 'tendencia', ic: '⚖️', t: goal === 'lose' ? 'Tu peso lleva 3 semanas estable. Si quieres seguir bajando, revisa que apuntas todo (aceite, salsas, bebidas) o suma pasos al día.' : 'Tu peso lleva 3 semanas estable.', pr: goal === 'maintain' ? 4 : 8 });
    if (W.logged >= 3 && c.prot && W.avgP < c.prot * .8) out.push({ k: 'consejo', ic: '💡', t: `Tu proteína media es de ${fmt(W.avgP)} g de ${c.prot} g. Añadir un lácteo proteico o una ración más de carne, pescado, huevo o legumbre te acerca.`, pr: 7 });
    if (!state.weights.length || (T && dayNum(todayISO()) - T.lastD >= 7)) out.push({ k: 'consejo', ic: '⚖️', t: 'Pésate una vez por semana, en ayunas, para ver tu tendencia real.', pr: 3 });
    if (W.workouts) out.push({ k: 'dato', ic: '💪', t: `Has guardado ${W.workouts} entreno${W.workouts === 1 ? '' : 's'} en los últimos 7 días.`, pr: 4 });
    return out.sort((a, b) => b.pr - a.pr);
}

// =====================================================================
//  LOGROS
// =====================================================================
const ACHIEVEMENTS = [
    ['first_food', '🍽️', 'Primera comida', 'Apunta tu primera comida', () => streakInfo().total >= 1],
    ['streak7', '🔥', '7 días', '7 días seguidos registrando', () => streakInfo().best >= 7],
    ['streak14', '🔥', '14 días', '14 días seguidos registrando', () => streakInfo().best >= 14],
    ['streak30', '🏅', '30 días', '30 días seguidos registrando', () => streakInfo().best >= 30],
    ['streak60', '🏆', '60 días', '60 días seguidos registrando', () => streakInfo().best >= 60],
    ['streak100', '👑', '100 días', '100 días seguidos registrando', () => streakInfo().best >= 100],
    ['protein5', '🥩', 'Semana proteica', 'Proteína cumplida 5 de 7 días', () => weekStats(todayISO()).protOk >= 5],
    ['first_weight', '⚖️', 'Primer pesaje', 'Apunta tu peso', () => state.weights.length >= 1],
    ['weights8', '📈', 'Constancia', '8 pesajes registrados', () => state.weights.length >= 8],
    ['first_workout', '💪', 'Primer entreno', 'Guarda un entreno', () => state.workouts.length >= 1],
    ['workouts20', '🏋️', '20 entrenos', '20 entrenos guardados', () => state.workouts.length >= 20],
    ['measures', '📏', 'Medidas', 'Guarda tus medidas', () => (state.measures || []).length >= 1],
];
// Comprueba logros nuevos y los celebra (una sola vez cada uno)
function checkAchievements(silent) {
    if (!profiles.current) return [];
    state.ach = state.ach || {};
    const fresh = ACHIEVEMENTS.filter(([id, , , , ok]) => !state.ach[id] && ok());
    fresh.forEach(([id]) => { state.ach[id] = todayISO(); });
    if (fresh.length) { save(); if (!silent) { const [, ic, name] = fresh[fresh.length - 1]; celebrate(ic, name, 'Logro desbloqueado'); } }
    return fresh;
}

// Momentos del día: proteína conseguida y día completado (una vez al día)
function checkDayMoments() {
    if (!profiles.current || !calc.target) return;
    const d = todayISO(), t = diaryTotals(d);
    state.cel = state.cel || {};
    const done = state.cel[d] || (state.cel[d] = {});
    // Solo se guarda lo de los últimos 10 días
    Object.keys(state.cel).forEach(k => { if (k < shiftISO(d, -10)) delete state.cel[k]; });
    if (!done.prot && t.p >= calc.prot) { done.prot = 1; save(); celebrate('🏆', 'Objetivo de proteína conseguido', `${fmt(t.p)} g de ${calc.prot} g`); return; }
    if (!done.day && t.p >= calc.prot * .9 && t.kcal >= calc.target * .9 && t.kcal <= calc.target * 1.05) { done.day = 1; save(); celebrate('🔥', 'Día completado', 'Calorías y proteína en tu objetivo'); return; }
    const S = streakInfo();
    if (S.today && [7, 14, 30, 60, 100].includes(S.cur) && !done['s' + S.cur]) { done['s' + S.cur] = 1; save(); celebrate('🔥', `${S.cur} días seguidos`, 'Tu racha sigue creciendo'); }
}

// Aviso de celebración (discreto, arriba, 3 s)
let celT;
function celebrate(icon, title, sub) {
    const el = $('nd-celebrate'); if (!el) return;
    el.innerHTML = `<span class="text-2xl leading-none">${icon}</span><span class="min-w-0"><span class="block text-sm font-extrabold text-neutral-50">${esc(title)}</span>${sub ? `<span class="block text-xs text-neutral-300">${esc(sub)}</span>` : ''}</span>`;
    el.classList.add('show');
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) try { navigator.vibrate(12); } catch (e) { }
    clearTimeout(celT); celT = setTimeout(() => el.classList.remove('show'), 3200);
    track('celebrate');
}
