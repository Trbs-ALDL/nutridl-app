// nutriDL · Coach: conversación, «¿Qué como?», menú del día, lista de la compra, voz y foto
// Funciona en el dispositivo con tus datos y la base de alimentos. Cada respuesta indica si es un dato tuyo,
// una estimación o una recomendación. No diagnostica ni sustituye a un profesional.
'use strict';

// =====================================================================
//  UTILIDADES COMPARTIDAS
// =====================================================================
const TAGS = { dato: [tk('Tus datos'), 'fa-database'], est: [tk('Estimación'), 'fa-scale-unbalanced'], rec: [tk('Recomendación'), 'fa-lightbulb'], base: [tk('Base de alimentos'), 'fa-book'] };
const tagPill = k => `<span class="nd-tag nd-tag-${k}"><i class="fa-solid ${TAGS[k][1]}"></i>${tr(TAGS[k][0])}</span>`;
// Nombre de la comida en minúscula, en el idioma activo («cena» / «dinner»)
const slotLow = s => tr(SLOT_NAME[s] || 'Comida').toLowerCase();
// En español siempre: para las frases que el Coach se manda a sí mismo («que tomo de cena»)
const slotEs = s => (SLOT_NAME[s] || 'comida').toLowerCase();
// Con artículo: «el desayuno», «la cena»… (a + el = al)
const SLOT_ART = { B: tk('el desayuno'), M: tk('la media mañana'), L: tk('la comida'), S: tk('la merienda'), D: tk('la cena'), X: tk('picar') };
const slotArt = s => tr(SLOT_ART[s] || 'la comida');
const toSlot = s => s === 'X' ? tr('a otros') : s === 'B' ? tr('al desayuno') : tr('a {x}', { x: slotArt(s) });
function remainingToday() {
    const t = diaryTotals(todayISO());
    return { t, kcal: calc.target - t.kcal, p: calc.prot - t.p, f: calc.fat - t.f, c: calc.carbs - t.c };
}
// Una línea del diario a partir de un alimento y sus gramos
function entryFrom(f, g, slot, est) {
    const m = macrosOf(f, g);
    const e = { slot, fid: f.id, name: f.name, brand: f.brand || '', g: round1(g), ml: !!f.ml, kcal: Math.round(m.kcal), p: round1(m.p), f: round1(m.f), c: round1(m.c), fib: round1(m.fib) };
    if (est) e.est = 1;
    if (f.u && g >= f.u[0] && Math.abs(g / f.u[0] - Math.round(g / f.u[0])) < .01) Object.assign(e, { u: f.u[1], up: f.u[2], n: Math.round(g / f.u[0]) });
    return e;
}
function afterLog() { save(); renderDiary(); renderDashboard(); if (state.tab === 'coach') renderCoachCtx(); checkDayMoments(); checkAchievements(); }
const leftLine = () => { const R = remainingToday(); return R.kcal >= 0 ? tr('Te quedan <b>{k} kcal</b> y <b>{p} g de proteína</b> hoy.', { k: fmt(R.kcal), p: fmt(Math.max(0, R.p)) }) : tr('Hoy vas <b>{k} kcal</b> por encima de tu objetivo.', { k: fmt(-R.kcal) }); };

const kcalMacros = m => `${fmt(m.kcal)} kcal · ${tr('P')} ${fmt(m.p)} · ${tr('HC')} ${fmt(m.c)} · ${tr('G')} ${fmt(m.f)}`;

// =====================================================================
//  CONFIRMAR ALIMENTOS ANTES DE GUARDAR (voz, texto, foto)
// =====================================================================
const pend = {};
let pendSeq = 0;
function newPending(items, slot, opts = {}) {
    const id = opts.id || 'pd' + (++pendSeq) + Date.now().toString(36);
    pend[id] = { items: items.map(it => ({ fid: it.food ? it.food.id : it.fid, g: it.g, est: !!it.est, alts: it.alts || [] })), slot: slot || slotByHour(), done: false, chat: !!opts.chat };
    return id;
}
function pendHtml(id) {
    const P = pend[id]; if (!P) return '';
    if (P.done) return `<div class="nd-done"><i class="fa-solid fa-circle-check"></i> ${tr('Añadido {x}', { x: toSlot(P.slot) })}</div>`;
    if (!P.items.length) return '<p class="text-sm text-neutral-400">' + tr('No queda nada que añadir.') + '</p>';
    const rows = P.items.map((it, i) => {
        const f = getFood(it.fid); if (!f) return '';
        const m = macrosOf(f, it.g);
        const alts = it.open ? `<div class="flex flex-wrap gap-1.5 pt-2">${it.alts.map(a => getFood(a)).filter(Boolean).map(a => `<button type="button" onclick="pendSwap('${id}',${i},'${a.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(a)} ${esc(foodName(a))}</button>`).join('')}
            <input type="search" placeholder="${tr('Buscar otro…')}" oninput="pendSearch('${id}',${i},this.value)" class="w-full mt-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm" aria-label="${tr('Buscar otro alimento')}"><div id="${id}-s${i}" class="w-full flex flex-wrap gap-1.5"></div></div>` : '';
        return `<div class="nd-crow">
            <div class="flex items-start gap-2">
                <div class="min-w-0 flex-1">
                    <button type="button" onclick="pendOpen('${id}',${i})" class="text-left text-sm font-bold text-neutral-100 leading-snug" aria-label="${tr('Cambiar {x}', { x: esc(foodName(f)) })}">${emo(f)} ${esc(foodName(f))}${f.brand ? ` <span class="text-mint-300/90 font-semibold">${esc(f.brand)}</span>` : ''} <i class="fa-solid fa-chevron-down text-[10px] text-neutral-500"></i></button>
                    <div id="${id}-m${i}" class="text-xs text-neutral-400">${kcalMacros(m)}${f.raw ? ' · ' + tr('en crudo') : ''}${it.est ? ' · <span class="nd-est">' + tr('≈ estimado') + '</span>' : ''}</div>
                </div>
                <label class="nd-gin"><input type="number" inputmode="decimal" min="1" max="3000" value="${it.g}" oninput="pendG('${id}',${i},this.value)" aria-label="${tr('Cantidad de {n}', { n: esc(foodName(f)) })}"><span>${f.ml ? 'ml' : 'g'}</span></label>
                <button type="button" onclick="pendDel('${id}',${i})" class="w-9 h-9 shrink-0 rounded-lg text-neutral-500 hover:text-roseAccent-400 hover:bg-neutral-800" aria-label="${tr('Quitar {n}', { n: esc(foodName(f)) })}"><i class="fa-solid fa-xmark"></i></button>
            </div>${alts}</div>`;
    }).join('');
    return `<div class="space-y-2">${rows}</div>
        <div id="${id}-tot" class="text-xs font-bold text-neutral-300 pt-1">${pendTotals(id)}</div>
        <div class="flex gap-2 pt-1">
            <select onchange="pend['${id}'].slot=this.value" class="p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-bold" aria-label="${tr('Comida del día')}">${DSLOTS.map(([k, n]) => `<option value="${k}" ${k === P.slot ? 'selected' : ''}>${tr(n)}</option>`).join('')}</select>
            <button type="button" onclick="pendAdd('${id}')" class="flex-1 py-2.5 rounded-xl bg-mint-600 hover:bg-mint-700 text-white text-sm font-extrabold"><i class="fa-solid fa-check"></i> ${P.items.length === 1 ? tr('Añadir al diario') : tr('Añadir {k} al diario', { k: P.items.length })}</button>
        </div>`;
}
function pendTotals(id) {
    const P = pend[id], t = P.items.reduce((a, it) => { const f = getFood(it.fid); if (!f) return a; const m = macrosOf(f, it.g); a.k += m.kcal; a.p += m.p; return a; }, { k: 0, p: 0 });
    const after = calc.target ? remainingToday().kcal - t.k : null;
    return tr('Total {k} kcal · {p} g de proteína', { k: fmt(t.k), p: fmt(t.p) }) + (after != null ? ' · ' + (after >= 0 ? tr('después te quedarán {k} kcal', { k: fmt(after) }) : tr('después te quedarán {k} kcal de más', { k: fmt(-after) })) : '');
}
const refreshPend = id => document.querySelectorAll(`[data-pend="${id}"]`).forEach(el => { el.innerHTML = pendHtml(id); });
function pendG(id, i, v) {
    const P = pend[id], it = P.items[i], g = num(v); if (!g || g <= 0 || g > 3000) return;
    it.g = g; it.est = false;
    const f = getFood(it.fid), m = macrosOf(f, g), el = $(`${id}-m${i}`);
    if (el) el.innerHTML = `${kcalMacros(m)}${f.raw ? ' · ' + tr('en crudo') : ''}`;
    const tot = $(`${id}-tot`); if (tot) tot.innerHTML = pendTotals(id);
    persistChatPend(id);
}
function pendDel(id, i) { pend[id].items.splice(i, 1); refreshPend(id); persistChatPend(id); }
function pendOpen(id, i) { const it = pend[id].items[i]; it.open = !it.open; refreshPend(id); }
function pendSwap(id, i, fid) { const it = pend[id].items[i]; const old = it.fid; it.alts = [old, ...it.alts.filter(a => a !== fid)].slice(0, 6); it.fid = fid; it.open = false; refreshPend(id); persistChatPend(id); }
function pendSearch(id, i, q) {
    const box = $(`${id}-s${i}`); if (!box) return;
    box.innerHTML = q.trim().length < 2 ? '' : matchFoods(q, 6).map(a => `<button type="button" onclick="pendSwap('${id}',${i},'${a.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(a)} ${esc(foodName(a))}${a.brand ? ' · ' + esc(a.brand) : ''}</button>`).join('');
}
function pendAdd(id) {
    const P = pend[id]; if (!P || P.done || !P.items.length) return;
    const d = todayISO();
    const ids = P.items.map(it => { const f = getFood(it.fid); return f ? pushDiary(entryFrom(f, it.g, P.slot, it.est), d) : null; }).filter(Boolean);
    P.done = true; persistChatPend(id);
    track('food_logged'); ev('food_logged_' + (P.src || 'text'));
    afterLog(); refreshPend(id);
    if (P.chat) { coachSay(`${tr('Apuntado ✓')} ${leftLine()}`, 'dato'); }
    else { closeSheet(); toastUndo(tr(ids.length === 1 ? '{k} alimento añadido {x}' : '{k} alimentos añadidos {x}', { k: ids.length, x: toSlot(P.slot) }), () => { state.diary[d] = (state.diary[d] || []).filter(e => !ids.includes(e.id)); save(); renderDiary(); renderDashboard(); }); }
}
// Los pendientes del chat se guardan con la conversación (sobreviven a recargar)
function persistChatPend(id) { const m = (state.chat || []).find(x => x.id === id); if (m) { m.p = pend[id]; save(); } }

// =====================================================================
//  COACH: VISTAS
// =====================================================================
let coachV = 'chat';
function coachView(v) {
    coachV = v;
    document.querySelectorAll('#coach-seg [data-cv]').forEach(b => { const on = b.dataset.cv === v; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    ['chat', 'menu', 'shop'].forEach(k => $('cv-' + k).classList.toggle('hidden', k !== v));
    if (v === 'chat') renderChat(); if (v === 'menu') renderMenuView(); if (v === 'shop') renderShopView();
    track('coach_' + v);
}
function renderCoach() { coachView(coachV); }
function renderCoachCtx() {
    const box = $('coach-ctx'); if (!box) return;
    if (!calc.target) { box.innerHTML = `<div class="nd-card p-4 flex items-center justify-between gap-3"><span class="text-sm text-neutral-300">${tr('Completa tu plan para que el Coach conozca tu objetivo.')}</span><button onclick="${profiles.current ? "showTab('calc')" : 'newProfile()'}" class="px-3 py-2 rounded-xl bg-mint-600 text-white text-xs font-extrabold whitespace-nowrap">${tr('Completar')}</button></div>`; return; }
    const R = remainingToday();
    const chip = (l, v, u) => `<div class="nd-ctx"><span>${l}</span><b>${v < 0 ? '+' + fmt(-v) : fmt(v)}${u}</b></div>`;
    box.innerHTML = `<div class="grid grid-cols-4 gap-2">${chip(R.kcal >= 0 ? tr('Quedan') : tr('De más'), Math.abs(R.kcal), ' kcal')}${chip(tr('Proteína'), Math.max(0, R.p), ' g')}${chip(tr('Hidratos'), Math.max(0, R.c), ' g')}${chip(tr('Grasas'), Math.max(0, R.f), ' g')}</div>`;
}

// =====================================================================
//  COACH: CONVERSACIÓN
// =====================================================================
// El chat del Coach empieza limpio cada día: solo se guardan los mensajes de hoy
// (la hora sale del id de cada mensaje, «m» + Date.now() en base 36; lo apuntado en el diario no se toca)
const msgDay = m => { const t = parseInt(String(m && m.id || '').slice(1, 9), 36); return Number.isFinite(t) && t > 1e12 ? new Date(t - new Date(t).getTimezoneOffset() * 60000).toISOString().slice(0, 10) : null; };
function freshChat() {
    const d = todayISO();
    if (state.chatDay === d) return;
    state.chat = (state.chat || []).filter(m => msgDay(m) === d);
    state.chatDay = d;
    save();
}
function renderChat(scroll) {
    freshChat();
    renderCoachCtx();
    const log = $('chat-log'); if (!log) return;
    const L = state.chat || [];
    const hello = `<div class="nd-msg-c">${tagPill('rec')}<p>${profiles.current ? tr('Hola, {n}.', { n: esc(profiles.list[profiles.current].name) }) : tr('Hola.')} ${tr('Soy tu Coach. Dime lo que has comido y lo apunto, pregúntame qué comer o cómo vas. Respondo con tus datos de nutriDL.')}</p></div>`;
    log.innerHTML = (L.length ? '' : hello) + L.map(msgHtml).join('');
    $('chat-sugg').innerHTML = chatSuggestions().map(s => `<button type="button" onclick="coachAsk(${esc(JSON.stringify(s))})" class="shrink-0 px-3.5 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 hover:border-mint-500/50">${esc(tr(s))}</button>`).join('');
    // La respuesta nueva se ve desde su principio (sin quedar detrás de la caja de texto)
    if (scroll) { const last = log.lastElementChild; if (last) requestAnimationFrame(() => last.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })); }
}
function msgHtml(m) {
    if (m.r === 'u') return `<div class="nd-msg-u">${esc(m.t)}</div>`;
    if (m.p) pend[m.id] = m.p;
    return `<div class="nd-msg-c" data-msg="${m.id}">${m.tags ? m.tags.map(tagPill).join('') : ''}${deEmoji(m.html)}
        ${m.logged && !m.p ? (m.logged.undone === 1 ? '<div class="nd-done"><i class="fa-solid fa-rotate-left"></i> ' + tr('Deshecho') + '</div>' : `<div class="grid grid-cols-2 gap-2 mt-3"><button type="button" onclick="logAdjust('${m.id}')" class="nd-mbtn"><i class="fa-solid fa-sliders"></i> ${tr('Ajustar')}</button><button type="button" onclick="logUndo('${m.id}')" class="nd-mbtn"><i class="fa-solid fa-rotate-left"></i> ${tr('Deshacer')}</button></div>`) : ''}
        ${m.p ? `<div data-pend="${m.id}" class="mt-3">${pendHtml(m.id)}</div>` : ''}
        ${m.opts ? `<div class="mt-3 space-y-2">${m.opts.map((o, i) => mealCard(o, { add: `coachAddOpt('${m.id}',${i})`, added: (m.added || []).includes(i), slot: m.slot, key: m.id + i })).join('')}</div>` : ''}</div>`;
}
function chatSuggestions() {
    const h = new Date().getHours(), slot = h < 11 ? tk('¿Qué desayuno?') : h < 16 ? tk('¿Qué como hoy?') : h < 19 ? tk('¿Qué meriendo?') : tk('¿Qué ceno?');
    return [tk('¿Cuánto me queda?'), slot, tk('He comido pollo con arroz'), tk('Tengo huevos, patata y espinacas, ¿qué ceno?'), tk('Compra fitness para la semana'), tk('Quiero un desayuno de 40 g de proteína'), tk('Voy a cenar fuera'), tk('¿Cómo llego a mis proteínas?'), tk('¿Cómo voy esta semana?')];
}
function pushMsg(m) {
    m.id = m.id || 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    freshChat();
    state.chat = state.chat || []; state.chat.push(m);
    if (state.chat.length > 40) state.chat.splice(0, state.chat.length - 40);
    save(); return m;
}
function coachSay(html, ...tags) { pushMsg({ r: 'c', html: `<p>${html}</p>`, tags }); renderChat(true); }
let coachBusy = false;
function coachSend(text, read) {
    const inp = $('chat-in'); const t = String(text != null ? text : inp.value).trim().slice(0, 300); if (!t || coachBusy) return;
    inp.value = '';
    pushMsg({ r: 'u', t }); renderChat(true);
    coachBusy = true;
    const log = $('chat-log'); log.insertAdjacentHTML('beforeend', '<div class="nd-msg-c nd-typing" id="nd-typing"><span></span><span></span><span></span></div>');
    setTimeout(() => {
        coachBusy = false;
        let replies;
        try { replies = [].concat(coachReply(read || t)); } catch (e) { logErr('Coach: ' + e.message); replies = [{ r: 'c', html: '<p>' + tr('Algo ha fallado al entenderte. Prueba a escribirlo de otra forma.') + '</p>' }]; }
        replies.forEach(pushMsg); renderChat(true);
    }, 260);
    track('coach_msg');
}
function clearChat() { state.chat = []; save(); renderChat(); }
// Botones con una frase guardada en español: se ve traducida y el Coach la lee en español
const coachAsk = s => coachSend(tr(s), s);
// El mismo botón dentro de un mensaje (atributo onclick ya escapado)
const askBtn = s => `onclick="coachAsk(${esc(JSON.stringify(s))})"`;

// ---------- Entender la pregunta ----------
// Cada patrón reconoce la pregunta en español Y en inglés, para que el Coach funcione igual en los dos idiomas.
// i18n-ignore-start (lo que se ENTIENDE, no se enseña)
const RX = {
    safety: /\b(embaraz\w*|lactanc\w*|amamant\w*|diabet\w*|insulin\w*|medicac\w*|anorex\w*|bulimi\w*|atracon\w*|trastorno\w* (de la )?(conducta )?alimentari\w*|vomit\w*|purg\w*|laxante\w*|renal|rinon\w*|hipertens\w*|cancer|quimio\w*|menor de edad|tengo 1[0-7] anos)\b|\b(pregnan\w*|breastfeed\w*|nursing|diabetic|medication|anorexi\w*|bulimi\w*|binge eat\w*|eating disorder|purging|laxative\w*|kidney (disease|failure)|hypertens\w*|chemo\w*|under 18|i am 1[0-7]|im 1[0-7])\b/,
    tooLow: /\b([1-9]\d{2})\s*(kcal|calorias|calories)\b.*\b(al dia|diarias|cada dia|a day|per day|daily)\b|\bdejar de comer\b|\bno comer nada\b|\bayun\w* de [3-9] dias\b|\bstop eating\b|\bnot eat(ing)? anything\b|\bfast(ing)? for [3-9] days\b/,
    hello: /^(hola|buenas|hey|buenos dias|buenas tardes|buenas noches|que tal|hi|hello|good morning|good afternoon|good evening|how are you)\b/,
    left: /((calorias|kcal|proteina\w*) me queda|cuant\w* me queda|que me queda|me queda(n)? (algo|mucho|poco)|cuant\w* llevo|como voy hoy|resumen de hoy|cuant\w* (calorias|kcal) (he|llevo))|\bhow (much|many)\b.*\b(left|remaining)\b|\bwhat.?s left\b|\bwhat is left\b|\bhow (many|much) (calories|kcal|protein)\b.*\b(do i have|left)\b|\bhow am i doing today\b|\btoday.?s summary\b|\bhow (many|much) (calories|kcal) have i\b/,
    logged: /\b(he|me he|hemos|acabo de|ya he)\s+(comido|tomado|cenado|desayunado|merendado|bebido|almorzado|picado)\b|\bi\s*(just\s+|already\s+)?(ate|had|have eaten|have had|drank)\b(?! too much| too many| way too)/,
    out: /\b(fuera|restaurante\w*|pedir|pido|menu del dia|bar|tapas?|italiano|pizzeria|japones|sushi|chino|hamburgueseria|burger|mexicano|kebab|comida rapida|fast food|cumpleanos|boda|cena de empresa)\b|\b(eating out|eat out|restaurant|takeaway|take away|take-away|order in|italian|japanese|chinese|mexican|birthday|wedding|work dinner)\b/,
    suggest: /\b(que (puedo )?(como|ceno|desayuno|meriendo|comer|cenar|desayunar|merendar|tomo|pico)|quiero (un|una|algo)|dame|ideas?|sugier\w*|recomiend\w*|opciones|propon\w*|que hago de)\b|\bme quedan? \d+|\bwhat (can|should|do) i (eat|have|cook|make)\b|\bwhat.?s for (breakfast|lunch|dinner|supper)\b|\bi want (a|an|some|something)\b|\b(give me|suggest|recommend|options|any ideas?|some ideas?)\b|\bi have \d+ kcal\b/,
    protein: /\b(lleg\w*|alcanz\w*|cumpl\w*|sub\w*|aument\w*|complet\w*|falt\w*|mas)\b.*\bproteina\w*|\bproteina\w*\b.*\b(lleg\w*|alcanz\w*|cumpl\w*|falt\w*)\b|\b(hit|reach|get to|meet|complete|more|missing|increase)\b.*\bprotein\b|\bprotein\b.*\b(hit|reach|left|missing|target|goal)\b/,
    info: /\b(cuant\w* (calorias|kcal|proteina\w*|hidratos|grasas?)|que (tiene|aporta)|macros de|valor\w* nutricional\w*|informacion de)\b|\bhow (many|much) (calories|kcal|protein|carbs|carbohydrates|fat)\b|\bmacros (of|in|for)\b|\bnutrition(al)? (info|information|value|facts)\b|\bwhat.?s in\b/,
    progress: /\b(como voy|progreso|tendencia|mi semana|esta semana|resumen semanal|evolucion|he bajado|he subido|racha)\b|\b(how am i doing|my progress|trend|my week|this week|weekly summary|have i lost|have i gained|streak)\b/,
    menu: /\b((genera\w*|crea\w*|haz|hazme|quiero|dame|ver) (un |el |mi )?menu|menu (para hoy|completo|semanal|de hoy)|planifica\w*|plan de comidas)\b|\b(generate|create|make|give me|show|see|build)( me)? (a |the |my )?(daily )?menu\b|\bmenu for today\b|\b(full|whole) day menu\b|\bmeal plan\b|\bplan my (meals|day)\b/,
    shop: /\b(lista de (la )?compra|que compro|hacer (la |una )?compra|compra (fitness|sana|semanal|para)|haz(me)? (la |una )?compra)\b|\b(shopping list|grocery list|groceries list)\b|\bwhat (do|should) i buy\b|\b(do|make|build|create|give me) (the |my |a )?(shopping|groceries|grocery)\b|\bshopping for \d+\b/,
    fridge: /\b(tengo|me queda\w*|hay)\b.*\b(nevera|frigo|casa|despensa)\b|\b(en (la|mi) nevera|en casa) (tengo|hay|me queda)\b|^tengo\b|\bcon lo que tengo\b|\b(i have|i.?ve got|there (is|are))\b.*\b(fridge|freezer|pantry|at home)\b|\bin (the|my) (fridge|freezer|pantry)\b|^i have\b|^i.?ve got\b|\bwith what i have\b/,
    weight: /\b(peso|pesado|bascula|weigh|weighed|weight|scale)\b.*\b(\d{2,3}([.,]\d)?)\b/,
    // 3.9: temas que antes caían en «no te he entendido»
    quien: /\b(quien eres|eres (una |un )?(ia|inteligencia artificial|robot|bot|chatgpt|humano|persona|real)|como funcionas|de donde sacas|te conectas)\b|\b(who are you|are you (an? )?(ai|artificial intelligence|robot|bot|chatgpt|human|person|real)|how do you work|where do you get (your )?(data|info)|do you connect)\b/,
    ayuda: /\b(que (puedes|sabes) hacer|en que (me )?puedes ayudar|para que sirves|como te uso|^ayuda$)\b|\b(what can you do|how can you help|what are you for|how do i use you)\b|^help$/,
    gracias: /^(gracias|muchas gracias|mil gracias|eres un crack|genial gracias|perfecto gracias|thanks|thank you|thanks a lot|cheers|great thanks|perfect thanks|awesome thanks)\b/,
    comparar: /\b(que es (mejor|peor)|cual es (mejor|peor)|diferencia entre)\b|\bmejor\b[^?]*\s+o\s+|\s+vs\.?\s+|\b(what.?s|what is|which is) (better|worse|healthier)\b|\bdifference between\b|\bbetter\b[^?]*\s+or\s+/,
    puedo: /\b(puedo (comer|tomar|beber|picar)|se puede comer|es malo|son malos|es mala|son malas|engorda\b|engordan\b|esta prohibid|debo evitar|pasa algo si como|me puedo permitir)\b|(?:^|[.!?]\s*)\s*(can i (eat|have|drink|snack)|can i afford)\b|\b(is it (bad|ok|okay|fine)|are they bad|does it make me fat|is .{1,20} forbidden|should i avoid|what happens if i eat)\b/,
    agua: /\bcuanta agua\b|\b(agua|hidratacion|hidratarme|liquidos?)\b.*\b(cuanta|cuanto|litros|vasos|al dia|necesito|debo|tengo que)\b|\bhow much water\b|\b(water|hydration|hydrate|fluids?)\b.*\b(how much|litres?|liters?|glasses|a day|per day|need|should)\b/,
    alcohol: /\b(alcohol|alcoholic\w*|cerveza|birra|cana\b|tercio\b|vino|copa|cubata|gin tonic|whisky|ron\b|sidra)\b|\b(beer|lager|pint|wine|spirits|whiskey|rum|gin|cider|cocktail)\b/,
    ayuno: /\b(ayuno|ayunar|ayunas|intermitente|16\/8|ventana de alimentacion|saltarme el desayuno)\b|\b(fasting|intermittent|eating window|skip(ping)? breakfast)\b/,
    supl: /\b(creatina|suplement\w*|proteina en polvo|batido de proteina|whey\b.*\bsirve|bcaa|quemagrasas|quema grasa|multivitamin\w*|termogenic\w*)\b|\b(creatine|supplements?|protein powder|bcaa|fat burner\w*|fat burning|multivitamin\w*|thermogenic\w*)\b/,
    cuando: /\b(cuando (vere|voy a ver|notare|empiezo a)|cuanto (tardo|tardare)|en cuanto tiempo|cuantas semanas|resultados)\b|\b(when will i (see|notice)|how long (does|will) it take|how many weeks|in how long|see results)\b/,
    estancado: /\b(no (bajo|adelgazo|pierdo|subo)|me he estancado|estancad\w*|no avanzo|sigo igual|no se mueve|llevo semanas)\b|\b(not losing|not dropping|not gaining|i.?m stuck|im stuck|plateau|stalled|no progress|same weight|for weeks)\b/,
    pasado: /\b(me he pasado|me pase|he comido (de )?mas|comi de mas|me he excedido|dia libre|comida trampa|cheat meal|he picado mucho|me siento culpable|culpa)\b|\b(i overate|i over ate|went over|ate too much|i binged|cheat day|day off|snacked a lot|i feel guilty|guilty)\b/,
    sinHambre: /\b(no tengo hambre|sin hambre|no me entra|no puedo comer mas|me cuesta comer|me cuesta llegar)\b|\b(not hungry|no appetite|can.?t eat (any)?more|cannot eat more|i struggle to eat|hard to (eat|hit))\b/,
}; // i18n-ignore-end
// ---------- Memoria de la conversación ----------
// Sin esto cada mensaje empieza de cero y «¿y de cena?» no significa nada.
let coachCtx = { intent: '', q: '', slot: '', offer: '', at: 0 };
const ctxAlive = () => coachCtx.at > 0 && Date.now() - coachCtx.at < 20 * 60000; // 20 minutos
function remember(intent, q, extra = {}) { coachCtx = { intent, q: q || '', slot: '', offer: '', ...extra, at: Date.now() }; }
// Frases que van cambiando para que no conteste siempre igual.
// Varían con el nº de mensajes (no al azar) para que las pruebas sigan siendo estables.
const vary = a => a[((state.chat || []).length) % a.length];
const SLOT_WORD = { desayuno: 'B', 'media manana': 'M', comida: 'L', almuerzo: 'L', merienda: 'S', cena: 'D',
    breakfast: 'B', 'mid morning': 'M', lunch: 'L', snack: 'S', dinner: 'D', supper: 'D' };
// i18n-ignore-start (lo que se ENTIENDE, no se enseña)
const FOLLOW = {
    slot: /^(y\s+|and\s+)?(de\s+|para\s+|for\s+)?(el\s+|la\s+|the\s+|my\s+)?(desayuno|media manana|comida|almuerzo|merienda|cena|breakfast|mid morning|lunch|snack|dinner|supper)\s*\??$/,
    mas: /^(y\s+|and\s+)?(otra|otro|mas|otra opcion|otra idea|otra cosa|dame otra|alguna mas|no me gusta|no me gustan|cambialo|cambia|another|another one|more|other|something else|give me another|any more|i don.?t like (it|them|that)|change it)\s*\??$/,
    si: /^(si|sii+|vale|ok|okey|venga|claro|perfecto|dale|adelante|porfa|por favor|genial|yes|yeah|yep|okay|sure|go ahead|please|great)\s*[.!]?$/,
    comida: /^(y|and)\s+(el\s+|la\s+|los\s+|las\s+|un\s+|una\s+|the\s+|a\s+|an\s+)?(.{2,40}?)\s*\??$/,
}; // i18n-ignore-end
// «¿y de cena?», «otra», «sí», «¿y el arroz?»: se completan con lo último de lo que hablabais
function followUp(raw) {
    if (!ctxAlive() || raw.length > 46) return null;
    const q = raw.replace(/[?¿!¡.,;]/g, ' ').replace(/\s+/g, ' ').trim();
    const ms = q.match(FOLLOW.slot);
    if (ms && SLOT_WORD[ms[4]]) return 'que tomo de ' + ms[4]; // i18n-ignore (frase interna que lee el Coach)
    if (FOLLOW.mas.test(q) && coachCtx.intent === 'suggest' && coachCtx.q) return coachCtx.q;
    if (FOLLOW.si.test(q) && coachCtx.offer) return coachCtx.offer;
    const mf = q.match(FOLLOW.comida);
    if (mf && coachCtx.intent === 'info' && matchFoods(mf[3], 1)[0]) return (coachCtx.verbo || 'cuantas calorias tiene ') + mf[3]; // i18n-ignore (frase interna)
    return null;
}
// Saca el alimento del que habla la frase, quitando las palabras de relleno
const RELLENO = /\b(puedo|puede|comer|tomar|beber|picar|se|si|es|son|esta|estan|mal|malo|mala|malos|malas|bueno|buena|buenos|buenas|engorda|engordan|mucho|mucha|un|una|unos|unas|el|la|lo|los|las|de|del|para|por|mi|me|hoy|ahora|algo|poco|tanto|que|cual|mejor|peor|prohibido|evitar|permitir|noche|cena|comida|desayuno|can|could|i|eat|have|drink|snack|is|are|it|they|bad|good|fine|ok|okay|fat|fattening|a|an|the|of|for|my|today|now|something|much|many|what|which|better|worse|healthier|forbidden|avoid|afford|tonight|dinner|lunch|breakfast|how|does|do)\b/g;
function foodIn(q, rx) {
    const name = q.replace(rx, ' ').replace(/[?¡¿!.,;]/g, ' ').replace(RELLENO, ' ').replace(/\s+/g, ' ').trim();
    return name.length > 1 ? matchFoods(name, 1)[0] : null;
}
function coachReply(raw) {
    let q = norm(raw).replace(/(\d)\.(\d{3})\b/g, '$1$2'); // «1.200 kcal» → 1200
    const fu = followUp(q); // «¿y de cena?», «otra», «sí»: se completan con lo último que hablasteis
    if (fu) { q = fu; raw = fu; }
    if (RX.safety.test(q)) return { r: 'c', tags: ['rec'], html: `<p>${tr('En tu situación las necesidades cambian y conviene que lo valore un profesional sanitario: tu médico o un dietista-nutricionista. nutriDL es orientativa y no puede adaptar un plan con seguridad en ese caso.')}</p><p class="mt-2">${tr('Sí puedo ayudarte a apuntar lo que comes para que lo compartas con tu profesional.')}</p>` };
    if (RX.tooLow.test(q)) return { r: 'c', tags: ['rec'], html: `<p>${tr('Comer tan poco no es seguro sin supervisión médica: aumenta la pérdida de músculo y el riesgo de déficit de nutrientes. Tu plan nunca baja de {k} kcal. Si quieres avanzar más rápido, suma pasos y entrenamiento de fuerza.', { k: fmt(calc.male ? 1500 : 1200) })}</p>` };
    if (!calc.target && !RX.logged.test(q)) return { r: 'c', tags: ['rec'], html: `<p>${tr('Para responderte con tus números necesito tu plan (2 minutos): objetivo, datos y actividad.')}</p><button onclick="${profiles.current ? "showTab('calc')" : 'newProfile()'}" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">${tr('Completar mi plan')}</button>` };
    if (RX.hello.test(q) && q.length < 25) { const sl = (nextMeal() || {}).slot || slotByHour(); remember('hello', '', { offer: 'que tomo de ' + slotEs(sl) }); return { r: 'c', tags: ['dato'], html: `<p>${tr('¡Hola!')} ${leftLine()} ${tr('¿Te propongo algo para {x}?', { x: slotArt(sl) })}</p>` }; } // i18n-ignore (frase interna que lee el Coach)
    if (RX.logged.test(q) || (!RX.suggest.test(q) && !RX.left.test(q) && !RX.info.test(q) && !RX.progress.test(q) && !RX.out.test(q) && !RX.protein.test(q) && !RX.menu.test(q) && !RX.shop.test(q) && /^\s*(\d|un |una |dos |medio |media )/.test(q))) {
        const r = replyLog(raw); if (r) return r;
    }
    if (RX.menu.test(q)) { if (!canUse('menu')) return proReply('menu'); setTimeout(() => coachView('menu'), 400); return { r: 'c', tags: ['rec'], html: '<p>' + tr('Te abro tu menú del día: lo calculo con tus calorías, tus macros y tus preferencias. Puedes cambiar cualquier plato.') + '</p>' }; }
    if (RX.shop.test(q)) {
        if (!canUse('shop')) return proReply('shop');
        const wantsPlan = /\b(\d+ dias?|\d+ days?|semana|week|fitness|me gusta|i like|sin |without |no |vegetarian|vegan|barat|economic|cheap|budget)/.test(q); // i18n-ignore (lo que se entiende)
        setTimeout(() => { coachView('shop'); if (wantsPlan) shopAsk(raw); }, 400);
        return { r: 'c', tags: ['rec'], html: '<p>' + (wantsPlan ? tr('Te preparo la compra con lo que me dices y te la abro. Luego puedes cambiar lo que quieras: «cambia el salmón por merluza», «quita la leche»…') : tr('Te abro la compra: dime qué quieres (días, lo que te gusta, lo que no) y te la preparo con cantidades.')) + '</p>' };
    }
    if (RX.fridge.test(q)) { const r = replyFridge(raw, q); if (r) return r; }
    if (RX.out.test(q)) return replyOut(q);
    if (RX.quien.test(q)) return replyQuien();
    if (RX.gracias.test(q) && q.length < 30) return replyGracias();
    if (RX.ayuda.test(q)) return replyAyuda();
    if (RX.agua.test(q)) return replyAgua();
    if (RX.ayuno.test(q)) return replyAyuno();
    if (RX.supl.test(q)) return replySupl();
    if (RX.alcohol.test(q) && !RX.suggest.test(q)) return replyAlcohol();
    if (RX.comparar.test(q)) { const r = replyComparar(q); if (r) return r; }
    if (RX.puedo.test(q)) return replyPuedo(q);
    if (RX.cuando.test(q)) return replyCuando();
    if (RX.estancado.test(q)) return replyEstancado();
    if (RX.protein.test(q)) return replyProtein();
    if (RX.suggest.test(q)) return replySuggest(q);
    if (RX.pasado.test(q)) return replyPasado();
    if (RX.sinHambre.test(q)) return replySinHambre();
    if (RX.left.test(q)) return replyLeft();
    if (RX.info.test(q)) { const r = replyInfo(q); if (r) return r; }
    if (RX.progress.test(q)) return replyProgress();
    // Una pregunta no es apuntar: «¿y el arroz?» no debe meter arroz en el diario.
    // Solo se apunta en silencio si no es pregunta, o si lleva una cantidad («¿2 huevos?»).
    const esPregunta = /[?¿]/.test(raw) && !/\d/.test(raw);
    if (!esPregunta) { const r = replyLog(raw, true); if (r) return r; }
    // Última oportunidad: si en la frase hay un alimento conocido, mejor hablar de él que decir «no te entiendo»
    const guess = foodIn(q, /\b(que|como|cuanto|cuanta|sobre|dime|oye|cosa|rara|raro|ese|esa|esto)\b/g)
        || q.replace(/[?¿!¡.,;]/g, ' ').replace(RELLENO, ' ').split(/\s+/).filter(w => w.length > 3)
            .sort((a, b) => b.length - a.length).map(w => matchFoods(w, 1)[0]).find(Boolean);
    if (guess) {
        // Se ve en el idioma activo; el Coach lee la frase en español con el nombre de la base
        const ask = (ver, leer) => `onclick="coachSend(${esc(JSON.stringify(ver))},${esc(JSON.stringify(leer))})"`;
        const gn = foodName(guess);
        const leer = [`¿Cuántas calorías tiene ${guess.name}?`, `¿Puedo comer ${guess.name}?`, `He comido ${guess.name}`]; // i18n-ignore (frase interna que lee el Coach)
        return { r: 'c', tags: ['base'], html: `<p>${tr('No estoy seguro de qué me preguntas, pero veo que hablas de {x}. ¿Te refieres a esto?', { x: `${emo(guess)} <b>${esc(gn)}</b>` })}</p>
        <div class="flex flex-wrap gap-2 mt-3">
        <button ${ask(tr('¿Cuántas calorías tiene {n}?', { n: gn }), leer[0])} class="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-extrabold text-neutral-100">${tr('Sus calorías')}</button>
        <button ${ask(tr('¿Puedo comer {n}?', { n: gn }), leer[1])} class="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-extrabold text-neutral-100">${tr('Si me cabe hoy')}</button>
        <button ${ask(tr('He comido {n}', { n: gn }), leer[2])} class="px-3 py-2 rounded-xl bg-mint-600 text-white text-xs font-extrabold">${tr('Apuntarlo')}</button></div>` };
    }
    return { r: 'c', tags: ['rec'], html: `<p>${tr('No estoy seguro de haberte entendido. Puedo:')}</p><ul class="nd-list"><li>${tr('Apuntar lo que has comido: «200 g de pollo y una ensalada»')}</li><li>${tr('Decirte cuánto te queda hoy')}</li><li>${tr('Proponerte qué comer: «¿Qué ceno con 600 kcal?»')}</li><li>${tr('Darte ideas para comer fuera')}</li><li>${tr('Contarte cómo vas esta semana')}</li></ul>` };
}
function replyLeft() {
    const R = remainingToday(), nm = nextMeal();
    let html = `<p>${tr('Hoy llevas <b>{a}</b> de {b} kcal.', { a: fmt(R.t.kcal), b: fmt(calc.target) })} ${R.kcal >= 0 ? tr('Te quedan <b>{k} kcal</b>: {p} g de proteína, {c} g de hidratos y {f} g de grasa.', { k: fmt(R.kcal), p: fmt(Math.max(0, R.p)), c: fmt(Math.max(0, R.c)), f: fmt(Math.max(0, R.f)) }) : tr('Vas <b>{k} kcal</b> por encima. No pasa nada por un día: lo que cuenta es la media de la semana.', { k: fmt(-R.kcal) })}</p>`;
    const tags = ['dato'];
    if (nm && nm.slot && nm.tg.kcal > 120) { const ofr = 'que tomo de ' + slotEs(nm.slot); remember('left', '', { offer: ofr }); html += `<p class="mt-2">${tr('Para {x} te recomiendo unas <b>{k} kcal</b> con <b>{p} g de proteína</b>.', { x: slotArt(nm.slot), k: fmt(nm.tg.kcal), p: fmt(nm.tg.p) })}</p><button onclick="coachSend(${esc(JSON.stringify(tr('¿Qué tomo de {x}?', { x: slotLow(nm.slot) })))},'${ofr}')" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">${tr('Ver opciones')}</button>`; tags.push('rec'); } // i18n-ignore (frase interna que lee el Coach)
    return { r: 'c', tags, html };
}
function replyLog(raw, quiet) {
    const P = parseFoodText(raw);
    if (!P.items.length) {
        if (quiet) return null;
        const name = (P.unknown.join(', ') || norm(raw).replace(/^(me he|he|hemos|acabo de|ya he)\s+\S+\s*/, '')).replace(/^(un|una|unos|unas|el|la)\s+/, '').trim().slice(0, 50);
        return unknownDish(name, P.slot || slotByHour());
    }
    const slot = P.slot || slotByHour(), d = todayISO();
    const items = P.items.map(i => ({ fid: i.food.id, g: i.g, est: !!i.est, alts: i.alts || [] }));
    const ids = items.map(it => pushDiary(entryFrom(getFood(it.fid), it.g, slot, it.est), d));
    track('food_logged'); ev('food_logged_chat'); afterLog();
    const tot = items.reduce((a, it) => { const m = macrosOf(getFood(it.fid), it.g); a.k += m.kcal; a.p += m.p; return a; }, { k: 0, p: 0 });
    const est = items.some(i => i.est);
    const lines = items.map(it => { const f = getFood(it.fid), m = macrosOf(f, it.g); return `<li>${emo(f)} ${esc(foodName(f))} · ${amountText(f, it.g)}${it.est ? ' <span class="nd-est">≈</span>' : ''} · <b>${fmt(m.kcal)} kcal</b> <span class="text-neutral-400">· ${tr('P')} ${fmt(m.p)} · ${tr('HC')} ${fmt(m.c)} · ${tr('G')} ${fmt(m.f)}</span></li>`; }).join('');
    const unk = P.unknown.length ? `<p class="text-xs text-amber-200 mt-2">${tr('No he encontrado «{x}». Apúntalo con una estimación:', { x: esc(P.unknown.join('», «')) })}</p>${quickKcalBtns(P.unknown.join(', '), slot)}` : '';
    return { r: 'c', tags: est ? ['base', 'est'] : ['base'], logged: { d, ids, slot, items },
        html: `<p>${tr('✓ Apuntado {x}:', { x: toSlot(slot) })}</p><ul class="nd-list">${lines}</ul><p class="mt-2">${tr('Total <b>{k} kcal</b> · {p} g de proteína.', { k: fmt(tot.k), p: fmt(tot.p) })} ${leftLine()}</p>${est ? '<p class="text-xs text-neutral-400 mt-1">' + tr('≈ = ración habitual (no dijiste cantidad). Si no cuadra, pulsa «Ajustar».') + '</p>' : ''}${unk}` };
}
// Algo que no está en la base: se apunta con una estimación de calorías (y macros de un plato mixto), marcado como estimado
const quickKcalBtns = (name, slot) => `<div class="flex flex-wrap gap-1.5 mt-2">${[200, 350, 500, 700, 900].map(k => `<button type="button" onclick="quickKcal(${esc(JSON.stringify(name))},'${slot}',${k})" class="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-extrabold text-neutral-100 hover:border-mint-500/60">≈ ${k} kcal</button>`).join('')}<button type="button" onclick="quickKcalOther(${esc(JSON.stringify(name))},'${slot}')" class="px-3 py-2 rounded-lg border border-dashed border-neutral-700 text-xs font-bold text-neutral-300">${tr('Otra cantidad')}</button></div>`;
function unknownDish(name, slot) {
    return { r: 'c', tags: ['est'], html: `<p>${tr('No tengo «{x}» en la base de alimentos. Para que no se pierda, apúntalo con una estimación (luego puedes corregirla en el diario):', { x: esc(name || tr('eso')) })}</p>${quickKcalBtns(name || tr('Comida|plato'), slot)}<p class="text-xs text-neutral-400 mt-2">${tr('Orientación: un plato combinado ronda 600-800 kcal; un bocadillo, 400-600; un postre, 250-400.')}</p>` };
}
function quickKcal(name, slot, kcal) {
    const d = todayISO();
    pushDiary({ slot, name: String(name).slice(0, 50) || tr('Comida|plato'), kcal: Math.round(kcal), p: round1(kcal * .2 / 4), c: round1(kcal * .45 / 4), f: round1(kcal * .35 / 9), fib: 0, est: 1 }, d);
    track('food_logged'); afterLog();
    coachSay(`${tr('Apuntado «{n}» ≈ {k} kcal {x} (estimado).', { n: esc(name), k: fmt(kcal), x: toSlot(slot) })} ${leftLine()}`, 'est');
}
function quickKcalOther(name, slot) { openFoodSheet(slot); fs.mode = 'quick'; fsRender(); setTimeout(() => { const i = $('fq-name'); if (i) i.value = name; const k = $('fq-kcal'); if (k) k.focus(); }, 80); }
function logUndo(mid) {
    const m = (state.chat || []).find(x => x.id === mid); if (!m || !m.logged || m.logged.undone) return;
    const L = m.logged;
    state.diary[L.d] = (state.diary[L.d] || []).filter(e => !L.ids.includes(e.id)); if (!state.diary[L.d].length) delete state.diary[L.d];
    L.undone = 1; save(); afterLog(); renderChat(); toast('Quitado del diario');
}
// Ajustar: se quita lo apuntado y aparece la ficha editable (cantidades, cambiar alimento, comida del día)
function logAdjust(mid) {
    const m = (state.chat || []).find(x => x.id === mid); if (!m || !m.logged || m.logged.undone) return;
    const L = m.logged;
    state.diary[L.d] = (state.diary[L.d] || []).filter(e => !L.ids.includes(e.id)); if (!state.diary[L.d].length) delete state.diary[L.d];
    L.undone = 'adjust';
    newPending(L.items, L.slot, { id: m.id, chat: true }); pend[m.id].src = 'chat'; m.p = pend[m.id];
    save(); afterLog(); renderChat();
}
// «Tengo pollo, arroz y brócoli, ¿qué ceno?»
function replyFridge(raw, q) {
    const ids = parseFoodText(raw.replace(/\b(tengo|en (la|mi) nevera|en casa|hay|me queda\w*|con lo que tengo|que (puedo )?(cenar|comer|desayunar|merendar|hacer|cocinar)|que (ceno|como|hago|cocino))\b/gi, ',')
        .replace(/\b(i have|i.?ve got|there (is|are)|in (the|my) (fridge|freezer|pantry)|at home|with what i have|what (can|should) i (cook|make|have|eat)|what.?s for (dinner|lunch|breakfast))\b/gi, ',')).items.map(i => i.food.id);
    if (!ids.length) return null;
    if (!canUse('fridge')) return proReply('fridge');
    const p = myPrefs(); ids.forEach(id => { if (!p.pantry.includes(id)) p.pantry.push(id); }); save();
    const slot = slotFromText(q) || (nextMeal() || {}).slot || slotByHour();
    const { tg, opts } = fridgeMeals(slot, ids);
    if (!opts.length) return { r: 'c', tags: ['rec'], html: `<p>${tr('Con {x} no me sale un plato completo. Añade alguna proteína (huevos, pollo, atún, legumbres…) y algún hidrato (arroz, pasta, patata, pan…).', { x: esc(ids.map(id => foodName(getFood(id)).toLowerCase()).join(', ')) })}</p>` };
    return { r: 'c', tags: ['rec', 'base'], slot, opts, html: `<p>${tr('Con lo que tienes, para {x} (≈ <b>{k} kcal</b> y <b>{p} g de proteína</b>):', { x: slotArt(slot), k: fmt(tg.kcal), p: fmt(tg.p) })}</p>` };
}
const proReply = feature => ({ r: 'c', tags: ['rec'], html: `<p>${tr('{n} es de nutriDL PRO: {w}', { n: '<b>' + esc(tr(PRO_FEATURES[feature][0])) + '</b>', w: esc(tr(PRO_FEATURES[feature][1]).toLowerCase()) })}</p><button onclick="openPaywall('${feature}')" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">${proData().trialUsed ? tr('Ver nutriDL PRO') : tr('Probar 7 días gratis')}</button>` });
function slotFromText(q) {
    if (/desayun|breakfast/.test(q)) return 'B';
    if (/media manana|almuerz|mid morning/.test(q)) return planSlots().includes('M') ? 'M' : 'S';
    if (/merend|merienda|snack|picar|picoteo|tentempie/.test(q)) return 'S';
    if (/\bcen(a|ar|o)\b|\b(dinner|supper)\b/.test(q)) return 'D';
    if (/\b(comida|al mediodia|para comer|almorzar|lunch)\b/.test(q)) return 'L';
    return null;
}
function targetFor(slot) {
    const nm = nextMeal();
    if (nm && nm.slot === slot) return { ...nm.tg };
    const T = dayTargets()[slot] || dayTargets().S || { kcal: calc.target * .12, p: calc.prot * .12, f: calc.fat * .12, c: calc.carbs * .12 };
    return { ...T };
}
function replySuggest(q) {
    const nm = nextMeal();
    let slot = slotFromText(q) || (nm && nm.slot) || slotByHour();
    let tg = targetFor(slot);
    const mk = q.match(/(\d{2,4})\s*(kcal|calorias|calories|cal)\b/);
    const mp = q.match(/(\d{1,3})\s*(g|gr|gramos|grams?)\s*(de\s+|of\s+)?(proteina|protein)/) || q.match(/(proteina\w*|protein)\s*(de\s*|of\s*)?(\d{1,3})\s*(g|gr|gramos|grams?)?/);
    const pg0 = mp ? +((mp[1] && /^\d+$/.test(mp[1])) ? mp[1] : (mp[3] || mp[2])) : 0;
    const tags = [];
    if (mk) { const k = +mk[1], r = k / Math.max(1, tg.kcal); tg = { kcal: k, p: tg.p * r, f: tg.f * r, c: tg.c * r }; }
    if (mp && pg0 > 0 && pg0 < 150) tg.p = pg0;
    if (/mucha proteina|alto en proteina|rica? en proteina|proteic|hiperproteic|lots of protein|high (in )?protein|protein rich/.test(q)) tg.p = Math.max(tg.p, tg.kcal * .35 / 4);
    if (mp && !mk) tg.kcal = Math.max(tg.kcal, tg.p * 4 / .35);
    if (tg.kcal < 90) return { r: 'c', tags: ['dato', 'rec'], html: `<p>${tr('Ya casi has completado tu día ({x}). Si tienes hambre, elige algo muy ligero: una infusión, verduras crudas, un yogur natural o una pieza de fruta.', { x: leftLine() })}</p>` };
    const opts = suggestMeals(slot, tg, { n: 3, seed: Date.now() % 100000 });
    if (!opts.length) return { r: 'c', tags: ['rec'], html: '<p>' + tr('Con tus preferencias no encuentro platos para esa comida. Revisa tus alergias y los alimentos que no te gustan en Preferencias.') + '</p><button onclick="openPrefs()" class="mt-3 px-4 py-2.5 rounded-xl bg-neutral-800 text-sm font-extrabold">' + tr('Preferencias') + '</button>' };
    tags.push('rec', 'base');
    ev('suggest_' + slot);
    remember('suggest', q, { slot });
    return { r: 'c', tags, slot, opts, html: `<p>${tr('Para {x} (≈ <b>{k} kcal</b> y <b>{p} g de proteína</b>) te propongo:', { x: slotArt(slot), k: fmt(tg.kcal), p: fmt(tg.p) })}</p>` };
}
function coachAddOpt(mid, i) {
    const m = state.chat.find(x => x.id === mid); if (!m || !m.opts[i]) return;
    mealToDiary(m.opts[i], m.slot, todayISO());
    m.added = [...(m.added || []), i]; save();
    track('food_logged'); ev('food_logged_suggest');
    afterLog();
    pushMsg({ r: 'c', tags: ['dato'], html: `<p>${tr('Añadido {x}', { x: toSlot(m.slot) })} ✓ ${leftLine()}</p>` }); renderChat(true);
}
function replyProtein() {
    const R = remainingToday();
    if (R.p <= 0) return { r: 'c', tags: ['dato'], html: `<p>${icon('🏆', 'text-amber-300 mr-1')} ${tr('Ya has llegado a tu proteína de hoy ({a} g de {b} g).', { a: fmt(R.t.p), b: calc.prot })}</p>` };
    const need = Math.min(R.p, 40), p = myPrefs();
    const ids = ['pollo', 'pavo', 'atun', 'claras', 'skyr', 'batido', 'merluza', 'gambas', 'huevo', 'tofu', 'seitan', 'fiambre', 'cottage', 'whey', 'lentejas', 'edamame', 'tempeh'];
    const L = ids.map(getFood).filter(f => f && foodOk(f, p)).map(f => { const g = Math.round(need / (f.p / 100) / 5) * 5; return { f, g, k: macrosOf(f, g).kcal }; })
        .filter(x => x.g <= 400).sort((a, b) => a.k - b.k).slice(0, 5);
    const kq = Math.round(Math.max(150, R.kcal)), leer = `Me quedan ${kq} kcal y necesito mucha proteína`; // i18n-ignore (frase interna que lee el Coach)
    return { r: 'c', tags: ['dato', 'base', 'rec'], html: `<p>${tr('Te faltan <b>{p} g de proteína</b> y te quedan {k} kcal. Para sumar {n} g gastando pocas calorías:', { p: fmt(R.p), k: fmt(Math.max(0, R.kcal)), n: fmt(need) })}</p>
        <ul class="nd-list">${L.map(x => `<li>${emo(x.f)} ${tr('{a} de {n}', { a: amountText(x.f, x.g), n: esc(foodName(x.f).toLowerCase()) })} → ${fmt(x.k)} kcal</li>`).join('')}</ul>
        <p class="mt-2">${tr('Consejo: reparte la proteína en 3-4 tomas y empieza cada comida por ella.')}</p>
        <button onclick="coachSend(${esc(JSON.stringify(tr('Me quedan {k} kcal y necesito mucha proteína', { k: kq })))},${esc(JSON.stringify(leer))})" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">${tr('Proponme un plato')}</button>` };
}
function replyInfo(q) {
    const name = q.replace(RX.info, ' ').replace(/\b(tiene|hay en|un|una|el|la|los|las|de|del|por|has|have|in|is|are|the|a|an|of|per|does|do)\b/g, ' ').replace(/[?¿!.]/g, ' ').trim();
    const f = name.length > 1 && matchFoods(name, 1)[0]; if (!f) return null;
    remember('info', q);
    const d = defaultPortion(f), m = macrosOf(f, d.g), k = kcal100(f);
    return { r: 'c', tags: ['base'], html: `<p>${emo(f)} <b>${esc(foodName(f))}</b>${f.brand ? ' · ' + esc(f.brand) : ''}</p>
        <p class="mt-1">${portionLabel(d.unit, d.n, f)}: <b>${fmt(m.kcal)} kcal</b> · ${macroWords(m)}</p>
        <p class="text-xs text-neutral-400 mt-1">${tr('Por 100 {u}:', { u: f.ml ? 'ml' : 'g' })} ${fmt(k)} kcal · ${tr('P')} ${fmt(f.p, 1)} · ${tr('HC')} ${fmt(f.c, 1)} · ${tr('G')} ${fmt(f.f, 1)}${f.raw ? ' ' + tr('(en crudo)') : ''}</p>
        <button onclick="openFoodSheet(); fsOpen('${f.id}')" class="mt-3 px-4 py-2.5 rounded-xl bg-neutral-800 text-sm font-extrabold">${tr('Apuntarlo')}</button>` };
}
// «proteína 30 g · hidratos 12 g · grasa 5 g»
const macroWords = m => tr('proteína {p} g · hidratos {c} g · grasa {f} g', { p: fmt(m.p, 1), c: fmt(m.c, 1), f: fmt(m.f, 1) });
// ---------- 3.9: respuestas a las preguntas que antes no entendía ----------
function replyQuien() {
    return { r: 'c', tags: ['dato'], html: `<p>${tr('Soy el Coach de nutriDL. Para que lo sepas de verdad: <b>no soy una inteligencia artificial conectada a internet</b>. Funciono con reglas y con tus propios datos: tu plan, tu diario, tus entrenos y una base de {k} alimentos.', { k: fmt(FOODS.length) })}</p>
        <p class="mt-2">${tr('Eso tiene dos ventajas: <b>funciono sin cobertura</b> y <b>tus datos no salen de tu móvil</b>, nunca se envían a ningún servidor.')}</p>
        <p class="mt-2 text-neutral-300">${tr('Lo que no sé hacer: charlar de cualquier tema ni entender preguntas muy abiertas. Para lo tuyo (comer, apuntar y progresar) voy sobrado.')}</p>` };
}
function replyAyuda() {
    return { r: 'c', tags: ['rec'], html: `<p>${tr(vary([tk('Esto es lo que mejor se me da:'), tk('Puedo echarte una mano con esto:'), tk('Pídeme cualquiera de estas cosas:')]))}</p><ul class="nd-list">
        <li>${tr('<b>Apuntar lo que comes</b> escribiéndolo: «200 g de pollo y arroz»')}</li>
        <li>${tr('<b>Decirte cuánto te queda</b> hoy y qué te conviene en la próxima comida')}</li>
        <li>${tr('<b>Proponerte platos</b>: «¿Qué ceno con 600 kcal y mucha proteína?»')}</li>
        <li>${tr('<b>Resolver dudas</b>: «¿puedo comer pizza?», «¿arroz o pasta?», «¿cuánta agua?»')}</li>
        <li>${tr('<b>Comer fuera</b>, <b>tu nevera</b>, <b>el menú del día</b> y <b>la compra</b>')}</li>
        <li>${tr('<b>Contarte cómo vas</b> esta semana')}</li></ul>
        <p class="mt-2 text-neutral-300">${tr('Y me acuerdo de lo que acabamos de hablar: si te propongo cenas, con un «otra» te doy más.')}</p>` };
}
const replyGracias = () => ({ r: 'c', tags: ['dato'], html: `<p>${vary([tr('A ti. Sigue apuntando, que es lo que marca la diferencia.'), tr('Para eso estoy.') + ' ' + leftLine(), tr('Un placer. Lo que de verdad funciona es la constancia, y esa la pones tú.')])}</p>` });
function replyPuedo(q) {
    const f = foodIn(q, RX.puedo), R = remainingToday();
    remember('info', q, { verbo: 'puedo comer ' }); // así «¿y el arroz?» sigue preguntando lo mismo
    const head = tr(vary([tk('Sí, puedes.'), tk('Claro que puedes.'), tk('Sí, sin problema.')]));
    if (!f) return { r: 'c', tags: ['rec'], html: `<p>${head} ${tr('<b>Ningún alimento está prohibido.</b> Lo que decide el resultado es el total de la semana, no un alimento suelto.')} ${leftLine()}</p>
        <p class="mt-2 text-neutral-300">${tr('Dime cuál es y te digo exactamente cuánto te ocupa de lo que te queda hoy.')}</p>` };
    const d = defaultPortion(f), m = macrosOf(f, d.g);
    const pct = calc.target ? Math.round(m.kcal / calc.target * 100) : 0;
    const cabe = R.kcal >= m.kcal;
    return { r: 'c', tags: ['dato', 'base', 'rec'], html: `<p>${head} ${emo(f)} <b>${esc(foodName(f))}</b>, ${portionLabel(d.unit, d.n, f)}: <b>${fmt(m.kcal)} kcal</b>${pct ? ' ' + tr('(un {p} de tu día)', { p: pctTxt(pct) }) : ''} · ${tr('proteína {p} g', { p: fmt(m.p, 1) })}.</p>
        <p class="mt-2">${cabe ? tr('Te cabe hoy sin pasarte: te quedan <b>{k} kcal</b>.', { k: fmt(R.kcal) }) : tr('Hoy te quedan {k} kcal, así que te pasarías un poco. No es grave: toma media ración o ajusta mañana.', { k: fmt(Math.max(0, R.kcal)) })}</p>
        <p class="mt-2 text-neutral-300">${tr(vary([tk('Ningún alimento engorda por sí solo: lo hace el total.'), tk('Un capricho planeado se sostiene mucho mejor que uno prohibido.'), tk('Lo que cuenta es la media de la semana, no un día.')]))}</p>
        <button onclick="openFoodSheet(); fsOpen('${f.id}')" class="mt-3 px-4 py-2.5 rounded-xl bg-neutral-800 text-sm font-extrabold">${tr('Apuntarlo')}</button>` };
}
function replyComparar(q) {
    const seg = q.replace(/^.*\b(mejor|peor|diferencia entre|diferencia|better|worse|healthier|difference between)\b/, ' ').replace(/[?¡¿!.,;]/g, ' ');
    const partes = seg.split(/\s+(?:o|vs\.?|versus|contra|or)\s+/)
        .map(x => x.replace(/\b(el|la|lo|los|las|un|una|unos|unas|de|del|para|mi|comer|tomar|beber|es|son|the|a|an|of|for|my|eat|have|drink|is|are|to)\b/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(x => x.length > 1);
    if (partes.length < 2) return null;
    const A = matchFoods(partes[0], 1)[0], B = matchFoods(partes[1], 1)[0];
    if (!A || !B || A.id === B.id) return null;
    remember('info', q);
    const row = f => { const k = kcal100(f); return { f, k, p: f.p, pk: k > 0 ? f.p / k * 100 : 0 }; };
    const a = row(A), b = row(B);
    const pierde = (calc.goal || 0) < 0;
    // Para perder grasa manda la proteína por caloría; para ganar, que entren calorías sin llenar de más
    const gana = pierde ? (a.pk >= b.pk ? a : b) : (a.k >= b.k ? a : b);
    const otro = gana === a ? b : a;
    const motivo = pierde
        ? tr('aporta más proteína por caloría ({a} g frente a {b} g cada 100 kcal), así que te sacia más gastando menos de tu día', { a: fmt(gana.pk, 1), b: fmt(otro.pk, 1) })
        : tr('te aporta más energía en el mismo volumen ({a} kcal frente a {b}), que es lo que te interesa para ganar', { a: fmt(gana.k), b: fmt(otro.k) });
    return { r: 'c', tags: ['base', 'rec'], html: `<p>${tr('Por cada 100 {u}:', { u: A.ml || B.ml ? 'ml/g' : 'g' })}</p>
        <ul class="nd-list"><li>${emo(A)} <b>${esc(foodName(A))}</b>: ${fmt(a.k)} kcal · ${macroWords(A)}</li>
        <li>${emo(B)} <b>${esc(foodName(B))}</b>: ${fmt(b.k)} kcal · ${macroWords(B)}</li></ul>
        <p class="mt-2">${tr('Para tu objetivo te conviene más <b>{n}</b>: {m}.', { n: esc(foodName(gana.f).toLowerCase()), m: motivo })}</p>
        <p class="mt-2 text-neutral-300">${tr('Dicho esto, la diferencia entre los dos es pequeña comparada con el total del día. Elige el que te guste más y te deje más saciado.')}</p>` };
}
function replyAgua() {
    const L = calc.water || (calc.w ? calc.w * 0.033 : 2);
    return { r: 'c', tags: ['dato', 'rec'], html: `<p>${tr('Para ti, en torno a <b>{l} litros al día</b> (unos {v} vasos), contando lo que bebes y el agua que traen las comidas. Suma medio litro más los días de entreno fuerte o de calor.', { l: fmt(L, 1), v: Math.round(L / 0.25) })}</p>
        <p class="mt-2">${tr('La señal más fácil: <b>la orina clara</b>, como paja. Si sale oscura, bebe más.')}</p>
        <p class="mt-2 text-neutral-300">${tr('Ojo con el mito: el agua no adelgaza por sí sola, pero llena el estómago y muchas veces lo que parece hambre es sed. Un vaso antes de comer ayuda de verdad.')}</p>` };
}
function replyAlcohol() {
    const R = remainingToday(), f = matchFoods('cerveza', 1)[0];
    const kcana = f ? Math.round(kcal100(f) * 2) : 90; // una caña ≈ 200 ml
    const n = kcana > 0 ? Math.floor(Math.max(0, R.kcal) / kcana) : 0;
    return { r: 'c', tags: ['dato', 'rec'], html: `<p>${tr('Puedes beber, pero conviene que sepas lo que cuesta. El alcohol aporta <b>7 kcal por gramo</b> (casi como la grasa) y son calorías que no alimentan ni sacian.')}</p>
        <p class="mt-2">${tr('Orientación: una caña ≈ <b>{a} kcal</b>, un tercio ≈ {b} kcal, una copa de vino ≈ 125 kcal, un cubata ≈ 250 kcal.', { a: fmt(kcana), b: fmt(Math.round(kcana * 1.65)) })}</p>
        <p class="mt-2">${tr(n === 1 ? 'Con lo que te queda hoy ({k} kcal) te entra <b>{n} caña</b> sin pasarte.' : 'Con lo que te queda hoy ({k} kcal) te entran <b>{n} cañas</b> sin pasarte.', { k: fmt(Math.max(0, R.kcal)), n })}</p>
        <p class="mt-2 text-neutral-300">${tr(vary([tk('Además, la noche que se bebe se suele picar más y se duerme peor, y eso cuesta más que las propias calorías.'), tk('Si vas a beber, alterna con agua y cena proteína antes: llegarás menos voraz.'), tk('El alcohol también frena algo la recuperación del entreno; si entrenas al día siguiente, modera.')]))}</p>` };
}
function replyAyuno() {
    return { r: 'c', tags: ['rec'], html: `<p>${tr('El ayuno intermitente <b>funciona si te ayuda a comer menos</b>, no por magia. Los estudios que comparan ayuno con una dieta normal de las mismas calorías dan resultados muy parecidos.')}</p>
        <p class="mt-2">${tr('Si te va bien saltarte el desayuno y así llegas mejor a tus {k} kcal, adelante. Si te deja con hambre voraz por la tarde, no te compensa.', { k: fmt(calc.target) })}</p>
        <p class="mt-2">${tr('Lo que sí te recomiendo cuidar: reparte tus <b>{p} g de proteína</b> en 3 o 4 tomas. Concentrarla en dos comidas muy juntas aprovecha algo peor.', { p: fmt(calc.prot) })}</p>
        <p class="mt-2 text-neutral-300">${tr('En resumen: es una herramienta de horarios, no un atajo. Elige el horario que puedas mantener un año.')}</p>` };
}
function replySupl() {
    return { r: 'c', tags: ['rec'], html: `<p>${tr('Siendo honesto, con lo que hay demostrado:')}</p><ul class="nd-list">
        <li>${tr('<b>Creatina monohidrato</b> (3-5 g al día, a cualquier hora): el de mejor evidencia para fuerza y masa. Barato y seguro en gente sana.')}</li>
        <li>${tr('<b>Proteína en polvo</b>: no es mágica, es <b>comida cómoda</b>. Útil solo si no llegas a tus {p} g con comida normal.', { p: fmt(calc.prot) })}</li>
        <li>${tr('<b>Cafeína</b>: rinde algo más en el entreno. Nada nuevo.')}</li>
        <li>${tr('<b>Quemagrasas y termogénicos</b>: no funcionan. Tira el dinero.')}</li>
        <li>${tr('<b>Multivitamínico</b>: solo si comes muy restringido o lo indica tu médico.')}</li></ul>
        <p class="mt-2 text-neutral-300">${tr('Ningún suplemento compensa comer mal o no dormir. Van después de eso, no antes.')}</p>` };
}
function replyCuando() {
    const wk = calc.weeklyKg || 0;
    if (!Math.abs(wk)) return { r: 'c', tags: ['dato'], html: `<p>${tr('Tu plan está en mantenimiento, así que el peso no debería moverse. Los cambios que verás serán de composición: algo más de músculo si entrenas fuerza y comes tu proteína.')}</p>` };
    const sube = wk > 0, m = Math.abs(wk);
    const semanas = n => tr(sube ? '<b>{w} semanas</b>: unos {k} kg más' : '<b>{w} semanas</b>: unos {k} kg menos', { w: n, k: fmt(m * n, 1) });
    return { r: 'c', tags: ['dato', 'rec'], html: `<p>${tr('A tu ritmo (<b>{k} kg por semana</b>), si lo cumples:', { k: fmt(m, 2) })}</p><ul class="nd-list">
        <li>${semanas(4)}</li>
        <li>${semanas(12)}</li></ul>
        <p class="mt-2">${tr('Y lo que vas a notar de verdad:')}</p><ul class="nd-list">
        <li>${tr('<b>Semana 1-2</b>: la báscula se mueve mucho, pero es agua. No te fíes todavía.')}</li>
        <li>${tr('<b>Semana 4-6</b>: empiezas a notarlo tú, sobre todo en cómo te queda la ropa.')}</li>
        <li>${tr('<b>Semana 8-12</b>: lo nota la gente de alrededor.')}</li></ul>
        <p class="mt-2 text-neutral-300">${tr('Pésate siempre igual (en ayunas, después del baño) y mira la media de la semana, no el día suelto.')}</p>` };
}
function replyEstancado() {
    const S = streakInfo();
    return { r: 'c', tags: ['rec'], html: `<p>${tr('Pasa, y casi siempre es una de estas cuatro, por orden de probabilidad:')}</p><ol class="nd-list">
        <li>${tr('<b>No es un estancamiento real.</b> El peso sube y baja 1-2 kg por agua, sal y digestión. Si no llevas <b>3 semanas</b> igual, aún no cuenta.')}</li>
        <li>${tr('<b>Se cuela más de lo que crees.</b> El aceite de cocinar, los picoteos y los fines de semana suman mucho. Apunta 7 días seguidos <i>todo</i>, también el finde.')}</li>
        <li>${tr('<b>Te mueves menos sin darte cuenta.</b> Al comer menos el cuerpo se ahorra movimiento. Súmalo con pasos, que no quitan hambre.')}</li>
        <li>${tr('<b>De verdad toca ajustar.</b> Si pesas menos, gastas menos. Pero solo después de descartar lo anterior.')}</li></ol>
        <p class="mt-2">${S.cur ? tr(S.cur === 1 ? 'Llevas {k} día apuntando: ese es justo el dato que lo aclara.' : 'Llevas {k} días apuntando: ese es justo el dato que lo aclara.', { k: S.cur }) : tr('Apunta unos días seguidos y te digo cuál de las cuatro es la tuya.')}</p>
        <button ${askBtn('¿Cómo voy esta semana?')} class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">${tr('Ver mi semana')}</button>` };
}
function replyPasado() {
    const R = remainingToday(), over = R.kcal < 0 ? -R.kcal : 0;
    const media = Math.round(over / 7);
    return { r: 'c', tags: ['dato', 'rec'], html: `<p>${tr(vary([tk('Tranquilo, de verdad.'), tk('No ha pasado nada.'), tk('Respira, que no se ha roto nada.')]))} ${over ? tr('Hoy vas <b>{k} kcal</b> por encima: repartido en la semana son <b>{m} kcal al día</b>, prácticamente nada.', { k: fmt(over), m: media }) : tr('Por lo que llevas apuntado hoy ni siquiera te has pasado.')}</p>
        <p class="mt-2">${tr('Hacen falta unas 7.700 kcal de más para ganar 1 kg de grasa. Un día no te saca del plan; lo que te saca es <b>abandonar por culpa</b> de ese día.')}</p>
        <p class="mt-2">${tr('Qué hacer ahora: <b>nada especial</b>. No te saltes la próxima comida ni te castigues con cardio. Mañana sigue con tus {k} kcal normales.', { k: fmt(calc.target) })}</p>
        <p class="mt-2 text-neutral-300">${tr('Si quieres, apúntalo igual aunque te dé pereza: ver el número real quita más culpa que esconderlo.')}</p>` };
}
function replySinHambre() {
    const R = remainingToday(), p = myPrefs();
    const ids = ['aceite', 'frutossecos', 'cacahuetes', 'crematurron', 'aguacate', 'batido', 'platano', 'avena', 'queso', 'aceitunas', 'chocolate', 'datiles'];
    const L = ids.map(getFood).filter(f => f && foodOk(f, p)).slice(0, 5);
    return { r: 'c', tags: ['rec', 'base'], html: `<p>${tr('Te quedan <b>{k} kcal</b> y no te entra más. Lo normal: cuesta más comer de más que de menos.', { k: fmt(Math.max(0, R.kcal)) })}</p>
        <p class="mt-2">${tr('Trucos que funcionan, de más a menos fácil:')}</p><ul class="nd-list">
        <li>${tr('<b>Bebe tus calorías</b>: un batido con leche, avena, plátano y crema de cacahuete entra sin esfuerzo.')}</li>
        <li>${tr('<b>Añade grasa buena</b>: un chorro de aceite, un puñado de frutos secos o aguacate suman mucho y ocupan poco.')}</li>
        <li>${tr('<b>Menos volumen</b>: cambia la ensalada enorme por algo más concentrado.')}</li>
        <li>${tr('<b>Más tomas pequeñas</b> en vez de tres platos grandes.')}</li></ul>
        ${L.length ? `<p class="mt-2">${tr('De tu base, los que más calorías dan por bocado: {x}.', { x: L.map(f => `${emo(f)} ${esc(foodName(f).toLowerCase())}`).join(', ') })}</p>` : ''}
        <p class="mt-2 text-neutral-300">${tr('Y si hoy no llegas, no pasa nada: cuenta la media de la semana.')}</p>` };
}
function replyProgress() {
    const L = insightsList().slice(0, 4), S = streakInfo();
    if (!L.length) return { r: 'c', tags: ['dato'], html: '<p>' + tr('Aún tengo pocos datos. Apunta tus comidas unos días y pésate una vez por semana: te contaré cómo vas.') + '</p>' };
    return { r: 'c', tags: ['dato'], html: `<p>${S.cur ? `${icon('🔥', 'text-amber-400 mr-1')} ${tr('Racha de {x}.', { x: tp(S.cur, 'día', 'días') })} ` : ''}${tr('Esto es lo que dicen tus datos:')}</p><ul class="nd-list">${L.map(x => `<li>${icon(x.ic, 'text-mint-400 mr-1')} ${esc(x.t)}</li>`).join('')}</ul>` };
}
// Comer fuera: consejos y cuánto cabe en lo que te queda (valores medios de la base)
const OUT = {
    italiano: [/italian|pizz|pasta/, [['pizza', 'porción'], ['lasana'], ['macarronestom']], tk('Mejor pasta con salsa de tomate y algo de proteína (pollo, atún, gambas) que con nata o cuatro quesos. Si es pizza, compártela y añade una ensalada.')], // i18n-ignore (dato)
    japones: [/japon|sushi|japanese/, [['sushi']], tk('El sashimi y el nigiri tienen más proteína y menos arroz que los makis fritos o con mayonesa. Sopa miso o edamame para empezar.')],
    burger: [/hamburgues|burger|comida rapida|fast food/, [['hamburguesacomp'], ['patatasfritas'], ['nuggets']], tk('Hamburguesa sencilla (sin doble queso ni beicon), ensalada en vez de patatas o patatas pequeñas, y bebida sin azúcar.')],
    tapas: [/tapa|bar\b/, [['tortilla'], ['croquetas'], ['calamaresrom'], ['bravas'], ['ensaladilla'], ['jamon']], tk('Prioriza tapas a la plancha (pulpo, gambas, pinchos de pollo, boquerones en vinagre) y jamón. Fritos y salsas, para compartir.')],
    chino: [/chino|chinese/, [['arroz3']], tk('Pollo o ternera salteados con verduras y arroz blanco en vez de frito. Evita lo rebozado y las salsas dulces.')],
    menu: [/menu del dia|set menu|menu of the day/, [['lentguisadas'], ['paella'], ['pollopl'], ['ensalada']], tk('Primero de verdura, legumbre o ensalada; segundo a la plancha con guarnición sencilla; fruta o café de postre. El pan, en la medida justa.')],
};
function replyOut(q) {
    const R = remainingToday(), k = Math.max(0, R.kcal);
    const hit = Object.values(OUT).find(([re]) => re.test(q));
    const rows = (hit ? hit[1] : [['ensalada'], ['pollopl'], ['tortilla'], ['pizza']]).map(([id]) => getFood(id)).filter(Boolean).map(f => {
        const d = defaultPortion(f), kc = macrosOf(f, d.g).kcal;
        const n = d.unit.key !== 'g' ? Math.floor(k * .85 / (kc || 1) * 2) / 2 : 0;
        return `<li>${emo(f)} ${esc(foodName(f))}: ${portionLabel(d.unit, d.n, f)} ≈ ${fmt(kc)} kcal${n >= 1 && f.id === 'sushi' ? ' · ' + tr('te caben unas {k} piezas', { k: fmt(Math.floor(n)) }) : ''}</li>`;
    }).join('');
    return { r: 'c', tags: ['dato', 'est', 'rec'], html: `<p>${tr('Te quedan <b>{k} kcal</b> y <b>{p} g de proteína</b> para hoy.', { k: fmt(k), p: fmt(Math.max(0, R.p)) })}</p>
        <p class="mt-2"><b>${tr('Qué pedir:')}</b> ${tr(hit ? hit[2] : 'Elige plancha, horno o parrilla; salsas aparte; una sola guarnición de hidratos; y agua o bebida sin azúcar. Empieza por la proteína y las verduras.')}</p>
        <p class="mt-2 text-xs text-neutral-400">${tr('Valores medios orientativos (cada restaurante cocina distinto):')}</p><ul class="nd-list">${rows}</ul>
        <p class="mt-2">${tr('Cuando vuelvas, dime qué has comido y lo apunto.')}</p>` };
}

// =====================================================================
//  TARJETA DE PLATO (opciones, menú) Y RECETA
// =====================================================================
const openRecipes = new Set();
function mealCard(meal, o = {}) {
    const ing = mealIngredients(meal), key = o.key || meal.id, open = openRecipes.has(key);
    return `<div class="nd-meal">
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
                ${o.slotLabel ? `<div class="text-[11px] font-bold uppercase tracking-wider text-mint-400">${o.slotLabel}</div>` : ''}
                <div class="text-[15px] font-extrabold text-neutral-50 leading-snug">${esc(mealText(meal).name)}</div>
                <div class="text-xs text-neutral-400 mt-0.5">${ing.map(x => esc(tr('{a} de {n}', { a: x.txt, n: foodName(x.f).toLowerCase().replace(/ \(.*\)$/, '') }))).join(' · ')}</div>
            </div>
            <div class="text-right shrink-0"><div class="text-lg font-extrabold text-neutral-50 leading-none">${fmt(meal.m.kcal)}</div><div class="text-[11px] font-bold text-neutral-400">kcal</div></div>
        </div>
        ${meal.missing && meal.missing.length ? `<div class="text-xs font-bold text-amber-200">${icon('🛒', 'mr-1')} ${tr('Te falta: {x}', { x: meal.missing.map(id => getFood(id)).filter(Boolean).map(f => esc(foodName(f).toLowerCase())).join(', ') })}</div>` : ''}
        <div class="flex gap-3 text-xs font-bold text-neutral-300"><span><span class="nd-dot" style="background:#c49a6c"></span>${tr('P')} ${fmt(meal.m.p)} g</span><span><span class="nd-dot" style="background:#e6d3b3"></span>${tr('HC')} ${fmt(meal.m.c)} g</span><span><span class="nd-dot" style="background:#f59e0b"></span>${tr('G')} ${fmt(meal.m.f)} g</span>${meal.min ? `<span class="text-neutral-500"><i class="fa-regular fa-clock"></i> ${meal.min} min</span>` : ''}</div>
        ${open ? `<div class="nd-recipe"><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400">${tr('Ingredientes')}</div><ul class="nd-list">${ing.map(x => `<li>${emo(x.f)} ${esc(x.txt)} · ${esc(foodName(x.f))}</li>`).join('')}</ul><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400 pt-2">${tr('Pasos')}</div><ol class="nd-steps">${mealText(meal).steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}
        <div class="grid ${o.swap ? 'grid-cols-3' : 'grid-cols-2'} gap-2">
            ${o.added ? '<div class="nd-done col-span-1"><i class="fa-solid fa-circle-check"></i> ' + tr('Añadido') + '</div>' : (o.add ? `<button type="button" onclick="${o.add}" class="nd-mbtn nd-mbtn-main"><i class="fa-solid fa-plus"></i> ${tr('Añadir')}</button>` : '')}
            ${o.swap ? `<button type="button" onclick="${o.swap}" class="nd-mbtn"><i class="fa-solid fa-rotate"></i> ${tr('Cambiar')}</button>` : ''}
            <button type="button" onclick="toggleRecipe('${key}')" class="nd-mbtn"><i class="fa-solid fa-book-open"></i> ${open ? tr('Ocultar') : tr('Receta')}</button>
        </div>
    </div>`;
}
function toggleRecipe(key) {
    openRecipes.has(key) ? openRecipes.delete(key) : openRecipes.add(key);
    if (!$('nd-sheet').classList.contains('hidden') && wte.slot) renderWte();
    if (state.tab === 'coach') { if (coachV === 'chat') renderChat(); if (coachV === 'menu') renderMenuView(); }
    if (!openRecipes.has(key)) return; track('recipe_open');
}

// =====================================================================
//  «¿QUÉ COMO?» (hoja con opciones para la próxima comida)
// =====================================================================
const wte = { slot: null, tg: null, opts: [], seed: 1, added: [] };
function openWhatToEat(slot) {
    if (!calc.target) { toast('Primero completa tu plan'); showTab(profiles.current ? 'calc' : 'home'); return; }
    const nm = nextMeal();
    wte.slot = slot || (nm && nm.slot) || slotByHour(); wte.seed = Date.now() % 100000; wte.added = [];
    wteCompute();
    openSheet('<i class="fa-solid fa-utensils text-mint-400"></i> ' + tr('¿Qué como?'), '<div id="wte-body"></div>', () => { wte.slot = null; });
    renderWte(); track('wte_open');
}
function wteCompute() { wte.tg = targetFor(wte.slot); wte.opts = wte.tg.kcal >= 90 ? suggestMeals(wte.slot, wte.tg, { n: 6, seed: wte.seed }) : []; wte.shown = [0, 1, 2].filter(i => wte.opts[i]); }
function wteSlot(s) { wte.slot = s; wte.added = []; wteCompute(); renderWte(); }
function wteSwap(pos) {
    const used = new Set(wte.shown); const next = wte.opts.findIndex((_, i) => !used.has(i));
    if (next < 0) {
        wte.seed += 101; const cur = wte.shown.map(i => wte.opts[i]);
        const more = suggestMeals(wte.slot, wte.tg, { n: 6, seed: wte.seed, exclude: cur.map(o => o.id) });
        if (!more.length) { toast('No hay más opciones para esta comida'); return; }
        wte.opts = cur.concat(more); wte.shown = cur.map((_, i) => i); wte.added = []; return wteSwap(pos);
    }
    wte.shown[pos] = next; renderWte();
}
function wteAdd(pos) {
    const meal = wte.opts[wte.shown[pos]]; if (!meal) return;
    mealToDiary(meal, wte.slot, todayISO()); wte.added.push(wte.shown[pos]);
    track('food_logged'); ev('food_logged_suggest'); afterLog(); renderWte();
    toast(`✓ ${mealText(meal).name} → ${slotLow(wte.slot)}`);
}
function renderWte() {
    const box = $('wte-body'); if (!box) return;
    const slots = planSlots();
    box.innerHTML = `<div class="space-y-4">
        <div class="flex gap-2 overflow-x-auto nd-noscroll -mx-1 px-1">${slots.map(s => `<button type="button" onclick="wteSlot('${s}')" class="shrink-0 px-3.5 py-2 rounded-full text-xs font-extrabold border ${s === wte.slot ? 'bg-mint-600 border-mint-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-300'}">${tr(SLOT_NAME[s])}</button>`).join('')}</div>
        <div class="nd-card p-4 flex items-center justify-between gap-3"><div><div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">${tr('Para {x}', { x: slotArt(wte.slot) })}</div><div class="text-lg font-extrabold text-neutral-50">${tr('{k} kcal · {p} g de proteína', { k: fmt(wte.tg.kcal), p: fmt(wte.tg.p) })}</div></div>${tagPill('rec')}</div>
        ${wte.opts.length ? wte.shown.map((idx, pos) => mealCard(wte.opts[idx], { key: 'w' + wte.opts[idx].id, add: `wteAdd(${pos})`, added: wte.added.includes(idx), swap: `wteSwap(${pos})` })).join('') : `<p class="text-sm text-neutral-300">${wte.tg.kcal < 90 ? tr('Ya casi has completado tu día. Si tienes hambre, algo muy ligero: infusión, verdura cruda, un yogur natural o fruta.') : tr('Con tus preferencias no encuentro platos para esta comida.')}</p>`}
        <p class="text-[11px] text-neutral-500">${tr('Calorías y macros calculados con la base de alimentos (USDA / BEDCA) para esas cantidades.')} <button type="button" onclick="closeSheet();openPrefs()" class="underline">${tr('Preferencias')}</button></p>
    </div>`;
}

// =====================================================================
//  MENÚ DEL DÍA
// =====================================================================
function renderMenuView() {
    const box = $('cv-menu'); if (!box) return;
    if (!canUse('menu')) { box.innerHTML = proTeaser('menu'); return; }
    if (!calc.target) { box.innerHTML = emptyPlan(tk('generar tu menú')); return; }
    const mn = state.menu;
    if (!mn || !mn.meals || !mn.meals.length) {
        box.innerHTML = `<div class="nd-card p-6 sm:p-8 text-center space-y-4"><div class="nd-ic-xl mx-auto">${icon('🍽️')}</div><h3 class="text-xl font-extrabold text-neutral-50">${tr('Tu día completo, con gramos exactos')}</h3><p class="text-sm text-neutral-400 max-w-sm mx-auto">${tr('{n} comidas que suman tus {k} kcal y tus {p} g de proteína, según tus preferencias.', { n: myPrefs().meals, k: fmt(calc.target), p: calc.prot })}</p><button onclick="genMenu()" class="nd-btn-primary mx-auto"><i class="fa-solid fa-wand-magic-sparkles"></i> ${tr('Generar mi menú')}</button></div>`;
        return;
    }
    const T = menuTotals(mn);
    const bar = (l, v, t, col) => `<div class="space-y-1"><div class="flex justify-between text-[11px] font-bold"><span class="text-neutral-400">${l}</span><span class="text-neutral-200">${fmt(v)}/${fmt(t)}</span></div><div class="h-1.5 rounded-full bg-neutral-800 overflow-hidden"><div class="h-full rounded-full" style="width:${Math.min(100, v / t * 100)}%;background:${col}"></div></div></div>`;
    box.innerHTML = `<div class="nd-card p-5 space-y-4">
            <div class="flex items-end justify-between gap-3"><div><div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">${tr('Total del menú')}</div><div class="text-3xl font-extrabold text-neutral-50">${fmt(T.kcal)} <span class="text-sm text-neutral-400">/ ${fmt(calc.target)} kcal</span></div></div>${tagPill('rec')}</div>
            <div class="grid grid-cols-3 gap-3">${bar(tr('Proteína'), T.p, calc.prot, '#c49a6c')}${bar(tr('Hidratos'), T.c, calc.carbs, '#e6d3b3')}${bar(tr('Grasas'), T.f, calc.fat, '#f59e0b')}</div>
            <div class="grid grid-cols-3 gap-2">
                <button onclick="genMenu()" class="nd-mbtn"><i class="fa-solid fa-rotate"></i> ${tr('Regenerar')}</button>
                <button onclick="menuAddAll()" class="nd-mbtn nd-mbtn-main"><i class="fa-solid fa-plus"></i> ${tr('Añadir todo')}</button>
                <button onclick="coachView('shop')" class="nd-mbtn"><i class="fa-solid fa-basket-shopping"></i> ${tr('Compra')}</button>
            </div>
        </div>
        ${mn.meals.map((ml, i) => mealCard(ml, { key: 'mn' + i + ml.id, slotLabel: tr(SLOT_NAME[ml.slot]), swap: `menuSwap(${i})`, add: `menuAdd(${i})`, added: (mn.added || []).includes(i) })).join('')}
        <p class="text-[11px] text-neutral-500">${tr('Generado el {d}. Cantidades en crudo salvo que se indique. Calculado con la base de alimentos; las etiquetas pueden variar.', { d: new Date(mn.at || Date.now()).toLocaleDateString(locale(), { day: 'numeric', month: 'long' }) })}</p>`;
}
const emptyPlan = what => `<div class="nd-card p-6 text-center space-y-3"><p class="text-sm text-neutral-300">${tr('Completa tu plan para {x}.', { x: tr(what) })}</p><button onclick="${profiles.current ? "showTab('calc')" : 'newProfile()'}" class="nd-btn-primary mx-auto">${tr('Completar mi plan')}</button></div>`;
function genMenu() {
    if (needPro('menu')) return;
    const mn = makeDayMenu(Date.now() % 1000000);
    if (!mn || !mn.meals.length) { toast('Con tus preferencias no encuentro platos: revisa Preferencias'); return; }
    state.menu = { ...mn, at: Date.now(), added: [] }; save(); renderMenuView(); track('menu_generated'); checkAchievements();
}
function menuSwap(i) { if (swapMenuMeal(state.menu, i, Date.now() % 1000000)) { state.menu.added = (state.menu.added || []).filter(x => x !== i); save(); renderMenuView(); } else toast('No hay más opciones para esa comida'); }
function menuAdd(i) {
    const ml = state.menu.meals[i]; mealToDiary(ml, ml.slot, todayISO());
    state.menu.added = [...(state.menu.added || []), i]; track('food_logged'); ev('food_logged_menu'); afterLog(); renderMenuView();
    toast(`✓ ${mealText(ml).name} → ${slotLow(ml.slot)}`);
}
async function menuAddAll() {
    const left = state.menu.meals.map((_, i) => i).filter(i => !(state.menu.added || []).includes(i));
    if (!left.length) { toast('Ya está todo en tu diario'); return; }
    if (!(await askConfirm(tr('¿Añadir {x} del menú a tu diario de hoy?', { x: tp(left.length, 'comida|plato', 'comidas|plato') }), 'Añadir'))) return;
    left.forEach(i => { const ml = state.menu.meals[i]; mealToDiary(ml, ml.slot, todayISO()); });
    state.menu.added = state.menu.meals.map((_, i) => i); track('food_logged'); ev('food_logged_menu'); afterLog(); renderMenuView();
    toast('Menú añadido a tu diario de hoy');
}

// =====================================================================
//  PREFERENCIAS (en «Mi plan» y como hoja desde el Coach)
// =====================================================================
function prefsHtml() {
    const p = myPrefs();
    const chip = (on, click, label) => `<button type="button" onclick="${click}" aria-pressed="${on}" class="px-3 py-2 rounded-xl border text-xs font-bold ${on ? 'bg-mint-600 text-white border-mint-600' : 'bg-neutral-800/60 text-neutral-300 border-neutral-800 hover:bg-neutral-700'}">${label}</button>`;
    const lst = (k, ph) => `<div class="flex flex-wrap gap-1.5">${p[k].map(id => getFood(id)).filter(Boolean).map(f => `<span class="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200">${emo(f)} ${esc(foodName(f))}<button type="button" onclick="prefDel('${k}','${f.id}')" class="w-6 h-6 rounded text-neutral-500 hover:text-roseAccent-400" aria-label="${tr('Quitar {n}', { n: esc(foodName(f)) })}"><i class="fa-solid fa-xmark"></i></button></span>`).join('')}</div>
        <input type="search" placeholder="${tr(ph)}" oninput="prefSearch('${k}',this.value)" class="w-full px-3 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-800 text-sm font-semibold" aria-label="${tr(ph)}"><div id="pref-s-${k}" class="flex flex-wrap gap-1.5"></div>`;
    const head = l => `<div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">${tr(l)}</div>`;
    return `<div class="space-y-2">${head(tk('Cómo comes'))}<div class="flex flex-wrap gap-2">${Object.entries(DIETS).map(([k, l]) => chip(p.diet === k, `setPref('diet','${k}')`, tr(l))).join('')}</div></div>
        <div class="space-y-2">${head(tk('Alergias e intolerancias'))}<div class="flex flex-wrap gap-2">${Object.entries(ALLERGENS).map(([k, [l]]) => chip(p.allergies.includes(k), `togglePref('allergies','${k}')`, tr(l))).join('')}</div></div>
        <div class="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4"><div class="space-y-2">${head(tk('Comidas al día'))}<div class="flex flex-wrap gap-2">${[3, 4, 5].map(n => chip(p.meals === n, `setPref('meals',${n})`, n)).join('')}</div></div>
        <div class="space-y-2">${head(tk('Presupuesto'))}<div class="flex flex-wrap gap-2">${chip(p.budget === 'low', "setPref('budget','low')", tr('Ajustado'))}${chip(p.budget !== 'low', "setPref('budget','normal')", tr('Normal'))}</div></div></div>
        <div class="space-y-2">${head(tk('No me gusta'))}${lst('dislikes', tk('Buscar un alimento que no te guste…'))}</div>
        <div class="space-y-2">${head(tk('Tengo en casa'))}${lst('pantry', tk('Buscar lo que tienes en la nevera…'))}</div>
        <p class="text-[11px] text-neutral-500">${tr('Se usan para «¿Qué como?», el menú y la lista de la compra. Revisa siempre las etiquetas si tienes una alergia.')}</p>`;
}
function renderPrefs() {
    const box = $('prefs-card'); if (box) box.innerHTML = `<div class="flex items-center gap-3 border-b border-neutral-800 pb-4"><div class="w-10 h-10 rounded-2xl bg-mint-500/15 text-mint-400 flex items-center justify-center text-lg"><i class="fa-solid fa-utensils"></i></div><h2 class="text-lg font-bold text-neutral-100">${tr('Preferencias de comida')}</h2></div>${prefsHtml()}`;
    const sh = $('prefs-sheet'); if (sh) sh.innerHTML = prefsHtml();
}
function openPrefs() { openSheet('<i class="fa-solid fa-sliders text-mint-400"></i> ' + tr('Preferencias'), '<div id="prefs-sheet" class="space-y-5"></div>', () => { if (state.tab === 'coach') renderCoach(); }); renderPrefs(); }
function setPref(k, v) { myPrefs()[k] = v; save(); renderPrefs(); track('pref_' + k); }
function togglePref(k, v) { const p = myPrefs(); p[k] = p[k].includes(v) ? p[k].filter(x => x !== v) : p[k].concat(v); save(); renderPrefs(); }
function prefDel(k, id) { const p = myPrefs(); p[k] = p[k].filter(x => x !== id); save(); renderPrefs(); }
function prefAdd(k, id) { const p = myPrefs(); if (!p[k].includes(id)) p[k].push(id); save(); renderPrefs(); }
function prefSearch(k, q) {
    const box = $('pref-s-' + k); if (!box) return;
    box.innerHTML = q.trim().length < 2 ? '' : matchFoods(q, 6).filter(f => !f.brand).map(f => `<button type="button" onclick="prefAdd('${k}','${f.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(f)} ${esc(foodName(f))}</button>`).join('');
}

// =====================================================================
//  REGISTRO POR VOZ (dictado del navegador) Y POR TEXTO
// =====================================================================
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const CONSENT_KEY = 'nutridl_consent';
const consent = k => { try { return !!JSON.parse(localStorage.getItem(CONSENT_KEY) || '{}')[k]; } catch (e) { return false; } };
const setConsent = (k, v) => { try { const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || '{}'); c[k] = v ? todayISO() : 0; localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch (e) { } };
let rec = null;
function askVoiceConsent(then) {
    if (consent('voice')) return then();
    openSheet('<i class="fa-solid fa-microphone text-mint-400"></i> ' + tr('Usar el micrófono'), `<div class="space-y-4 text-sm text-neutral-300">
        <p>${tr('Para convertir tu voz en texto, tu navegador usa su propio servicio de dictado. En Chrome el audio se procesa en los servidores de Google, y en Safari, en los de Apple.')}</p>
        <p>${tr('nutriDL no guarda ni envía el audio: solo recibe el texto, que se procesa en tu dispositivo.')}</p>
        <div class="grid grid-cols-2 gap-2"><button onclick="closeSheet();openVoiceLog(true)" class="py-3 rounded-xl border border-neutral-700 font-bold">${tr('Prefiero escribir')}</button><button id="vc-ok" class="py-3 rounded-xl bg-mint-600 text-white font-extrabold">${tr('Aceptar y hablar')}</button></div></div>`);
    $('vc-ok').onclick = () => { setConsent('voice', true); closeSheet(); then(); };
}
function listen(onText, onState) {
    if (!SR) { onState('nosupport'); return; }
    try { if (rec) rec.abort(); } catch (e) { }
    rec = new SR(); rec.lang = locale(); rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    let final = '';
    rec.onresult = e => { let txt = ''; for (const r of e.results) { txt += r[0].transcript; if (r.isFinal) final = txt; } onText(txt, false); };
    rec.onerror = e => onState(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'denied' : e.error === 'no-speech' ? 'nospeech' : 'error');
    rec.onend = () => { rec = null; onState('end', final); };
    try { rec.start(); onState('listening'); } catch (e) { onState('error'); }
}
function coachMic() {
    if (needPro('voice')) return;
    if (!SR) { toast('Tu navegador no permite dictado: usa el micrófono del teclado'); $('chat-in').focus(); return; }
    askVoiceConsent(() => {
        const b = $('chat-mic');
        listen(t => { $('chat-in').value = t; }, (st, final) => {
            b.classList.toggle('nd-rec', st === 'listening');
            if (st === 'end' && final) coachSend(final);
            if (st === 'denied') toast('Sin permiso para el micrófono');
        });
    });
}
let voicePid = null;
function openVoiceLog(typeOnly) {
    if (needPro('voice')) return;
    if (!typeOnly && SR && !consent('voice')) return askVoiceConsent(() => openVoiceLog());
    voicePid = null;
    openSheet('<i class="fa-solid fa-microphone text-mint-400"></i> ' + tr('Registrar comida'), `<div class="space-y-4">
        ${SR && !typeOnly ? `<div class="text-center space-y-3 py-2"><button id="vl-mic" onclick="voiceStart()" class="nd-bigmic" aria-label="${tr('Hablar')}"><i class="fa-solid fa-microphone"></i></button><div id="vl-state" class="text-sm font-bold text-neutral-300">${tr('Pulsa y di lo que has comido')}</div></div>` : `<p class="text-sm text-neutral-400">${SR ? '' : tr('Tu navegador no permite dictado aquí. Escríbelo (o usa el micrófono de tu teclado).')}</p>`}
        <textarea id="vl-text" rows="3" maxlength="400" placeholder="${tr('Ej: 200 g de pechuga de pollo, 100 g de arroz y una ensalada')}" class="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl font-semibold text-[15px]" aria-label="${tr('Lo que has comido')}"></textarea>
        <button onclick="voiceParse()" class="w-full py-3 rounded-xl bg-neutral-800 border border-neutral-700 font-extrabold text-sm"><i class="fa-solid fa-wand-magic-sparkles text-mint-400"></i> ${tr('Entender')}</button>
        <div id="vl-out"></div></div>`, () => { try { if (rec) rec.abort(); } catch (e) { } });
    if (!SR || typeOnly) setTimeout(() => { const t = $('vl-text'); if (t) t.focus(); }, 80);
    track('voice_open');
}
function voiceStart() {
    listen(t => { $('vl-text').value = t; }, (st, final) => {
        const s = $('vl-state'), b = $('vl-mic'); if (!s) return;
        b.classList.toggle('nd-rec', st === 'listening');
        const msg = { listening: tk('Te escucho…'), denied: tk('Sin permiso para el micrófono: escríbelo abajo'), nospeech: tk('No te he oído. Pulsa y vuelve a intentarlo'), error: tk('El dictado no está disponible: escríbelo abajo') };
        s.textContent = tr(msg[st] || 'Pulsa y di lo que has comido');
        if (st === 'end' && final) voiceParse();
    });
}
function voiceParse() {
    const t = ($('vl-text').value || '').trim(); if (!t) { toast('Di o escribe lo que has comido'); return; }
    const P = parseFoodText(t), out = $('vl-out');
    if (!P.items.length) { out.innerHTML = `<p class="text-sm text-amber-200">${tr('No he reconocido ningún alimento. Prueba con «dos huevos y una tostada con aceite».')}</p>`; return; }
    voicePid = newPending(P.items, P.slot || slotByHour()); pend[voicePid].src = 'voice';
    out.innerHTML = `<div class="space-y-2"><div class="flex flex-wrap gap-1.5">${tagPill('base')}${P.items.some(i => i.est) ? tagPill('est') : ''}</div>
        ${P.unknown.length ? `<p class="text-xs text-amber-200">${tr('No he encontrado: «{x}».', { x: esc(P.unknown.join('», «')) })}</p>` : ''}<div data-pend="${voicePid}">${pendHtml(voicePid)}</div></div>`;
}

// =====================================================================
//  FOTO DEL PLATO: tú marcas qué hay y el tamaño de la ración; nosotros estimamos
//  (el reconocimiento automático necesita un servidor seguro: ver docs/IA.md)
// =====================================================================
let photo = null;
const PLATE_QUICK = ['pollopl', 'arrozcocido', 'pastacocida', 'patata', 'ensalada', 'menestra', 'huevo', 'merluza', 'ternera', 'lentguisadas', 'pan', 'aove'];
function portionSet(f) {
    if (f.u && f.u[0] >= 20) return [[1, '1'], [2, '2'], [3, '3']].map(([n, l]) => ({ g: f.u[0] * n, l: `${l} ${tr(n === 1 ? f.u[1] : f.u[2])}` }));
    if (f.cat === 'grasa' && f.f > 90) return [{ g: 5, l: tr('Un chorrito') }, { g: 10, l: tr('1 cucharada') }, { g: 20, l: tr('2 cucharadas') }];
    const base = f.role === 'protein' ? 130 : f.role === 'veg' ? 150 : f.role === 'fat' ? 30 : f.role === 'fruit' ? (f.fixed || 150) : (f.serv && f.serv[0]) || 160;
    return [{ g: Math.round(base * .65 / 5) * 5, l: tr('Pequeña') }, { g: base, l: tr('Normal') }, { g: Math.round(base * 1.45 / 5) * 5, l: tr('Grande') }];
}
function openPhotoLog() {
    if (needPro('photo')) return;
    // (el estado de la foto se crea después de abrir la hoja: abrir una hoja cierra la anterior y su limpieza)
    openSheet('<i class="fa-solid fa-camera text-mint-400"></i> ' + tr('Foto del plato'), `<div class="space-y-4">
        <label class="nd-photo" id="ph-drop"><input id="ph-file" type="file" accept="image/*" capture="environment" class="sr-only" onchange="photoPicked(this)"><span id="ph-prev" class="flex flex-col items-center gap-2 text-neutral-400"><i class="fa-solid fa-camera text-3xl text-mint-400"></i><span class="text-sm font-bold">${tr('Hacer o elegir una foto')}</span><span class="text-xs">${tr('Opcional: te ayuda a recordar el plato. No sale de tu móvil.')}</span></span></label>
        <div class="space-y-2"><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400">${tr('¿Qué hay en el plato?')}</div>
            <div class="flex flex-wrap gap-1.5">${PLATE_QUICK.map(getFood).filter(Boolean).map(f => `<button type="button" onclick="photoAdd('${f.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(f)} ${esc(foodName(f).replace(/ \((ya cocido|hecha|lata|cooked|canned)\)/, ''))}</button>`).join('')}</div>
            <input type="search" placeholder="${tr('Buscar otro alimento…')}" oninput="photoSearch(this.value)" class="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-semibold" aria-label="${tr('Buscar alimento del plato')}"><div id="ph-s" class="flex flex-wrap gap-1.5"></div>
        </div>
        <div id="ph-items" class="space-y-2"></div>
        <div id="ph-foot"></div>
    </div>`, () => { if (photo && photo.url) URL.revokeObjectURL(photo.url); photo = null; });
    photo = { url: null, items: [] }; renderPhoto(); track('photo_open');
}
function photoPicked(inp) {
    if (!photo) return;
    const file = inp.files && inp.files[0]; if (!file) return;
    if (photo.url) URL.revokeObjectURL(photo.url);
    photo.url = URL.createObjectURL(file);
    $('ph-prev').innerHTML = `<img src="${photo.url}" alt="${tr('Foto de tu plato')}" class="w-full max-h-64 object-cover rounded-2xl">`;
    $('ph-drop').classList.add('has');
}
function photoSearch(q) { if (!photo) return; $('ph-s').innerHTML = q.trim().length < 2 ? '' : matchFoods(q, 8).map(f => `<button type="button" onclick="photoAdd('${f.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(f)} ${esc(foodName(f))}${f.brand ? ' · ' + esc(f.brand) : ''}</button>`).join(''); }
function photoAdd(id) {
    if (!photo) return;
    const f0 = getFood(id); if (!f0) return;
    const f = cookedFood(f0); if (photo.items.some(x => x.fid === f.id)) return;
    const ps = portionSet(f); photo.items.push({ fid: f.id, g: ps[1].g, pi: 1 }); renderPhoto();
}
function photoPortion(i, pi) { const it = photo.items[i], ps = portionSet(getFood(it.fid)); it.pi = pi; it.g = ps[pi].g; renderPhoto(); }
function photoG(i, v) { const g = num(v); if (!g || g <= 0 || g > 3000) return; photo.items[i].g = g; photo.items[i].pi = -1; const f = getFood(photo.items[i].fid), el = $('ph-k' + i); if (el) el.textContent = `≈ ${fmt(macrosOf(f, g).kcal)} kcal`; photoFoot(); }
function photoDel(i) { photo.items.splice(i, 1); renderPhoto(); }
function renderPhoto() {
    if (!photo) return;
    const box = $('ph-items'); if (!box) return;
    box.innerHTML = photo.items.map((it, i) => {
        const f = getFood(it.fid), ps = portionSet(f);
        return `<div class="nd-crow space-y-2"><div class="flex items-center gap-2"><div class="flex-1 min-w-0 text-sm font-bold text-neutral-100">${emo(f)} ${esc(foodName(f))}</div><span id="ph-k${i}" class="text-xs font-bold text-neutral-400">≈ ${fmt(macrosOf(f, it.g).kcal)} kcal</span><button type="button" onclick="photoDel(${i})" class="w-8 h-8 rounded-lg text-neutral-500 hover:text-roseAccent-400" aria-label="${tr('Quitar {n}', { n: esc(foodName(f)) })}"><i class="fa-solid fa-xmark"></i></button></div>
            <div class="flex items-center gap-1.5">${ps.map((p, pi) => `<button type="button" onclick="photoPortion(${i},${pi})" class="flex-1 py-2 rounded-lg text-xs font-bold border ${it.pi === pi ? 'bg-mint-600 border-mint-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-300'}">${p.l}</button>`).join('')}
            <label class="nd-gin"><input type="number" inputmode="decimal" min="1" max="3000" value="${it.g}" oninput="photoG(${i},this.value)" aria-label="${tr('Gramos de {n}', { n: esc(foodName(f)) })}"><span>${f.ml ? 'ml' : 'g'}</span></label></div></div>`;
    }).join('');
    photoFoot();
}
function photoFoot() {
    if (!photo) return;
    const box = $('ph-foot'); if (!box) return;
    if (!photo.items.length) { box.innerHTML = ''; return; }
    const k = photo.items.reduce((a, it) => a + macrosOf(getFood(it.fid), it.g).kcal, 0);
    box.innerHTML = `<div class="nd-card p-4 space-y-3"><div class="flex items-center justify-between"><div><div class="text-[11px] font-bold uppercase tracking-wider text-amber-300">${tr('Estimación aproximada')}</div><div class="text-xl font-extrabold text-neutral-50">≈ ${fmt(k)} kcal</div></div>${tagPill('est')}</div>
        <p class="text-xs text-neutral-400">${tr('Pesos ya cocinados. Si puedes pesarlo, cambia los gramos: será más exacto.')}</p>
        <div class="flex gap-2"><select id="ph-slot" class="p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-bold" aria-label="${tr('Comida del día')}">${DSLOTS.map(([kk, n]) => `<option value="${kk}" ${kk === slotByHour() ? 'selected' : ''}>${tr(n)}</option>`).join('')}</select>
        <button type="button" onclick="photoSave()" class="flex-1 py-2.5 rounded-xl bg-mint-600 hover:bg-mint-700 text-white text-sm font-extrabold"><i class="fa-solid fa-check"></i> ${tr('Añadir al diario')}</button></div></div>`;
}
function photoSave() {
    if (!photo || !photo.items.length) return;
    const slot = $('ph-slot').value, d = todayISO();
    const ids = photo.items.map(it => pushDiary(entryFrom(getFood(it.fid), it.g, slot, true), d));
    track('food_logged'); ev('food_logged_photo'); afterLog(); closeSheet();
    toastUndo(tr('Plato añadido {x} (estimado)', { x: toSlot(slot) }), () => { state.diary[d] = (state.diary[d] || []).filter(e => !ids.includes(e.id)); save(); renderDiary(); renderDashboard(); });
}

// =====================================================================
//  RECORDATORIO DIARIO (evento en tu calendario: sin notificaciones de la web ni servidores)
// =====================================================================
function openReminder() {
    openSheet('<i class="fa-regular fa-bell text-mint-400"></i> ' + tr('Recordatorio diario'), `<div class="space-y-4">
        <p class="text-sm text-neutral-300">${tr('Añade a tu calendario un aviso diario para apuntar tus comidas. Lo controlas tú: puedes cambiarlo o borrarlo desde el calendario.')}</p>
        <label class="block"><span class="text-xs font-bold text-neutral-400">${tr('Hora del aviso')}</span><input id="rm-time" type="time" value="21:00" class="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl font-bold"></label>
        <button onclick="downloadReminder()" class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold"><i class="fa-solid fa-calendar-plus"></i> ${tr('Añadir a mi calendario')}</button>
        <p class="text-[11px] text-neutral-500">${tr('Se descarga un archivo de calendario (.ics) que abre tu app de calendario.')}</p></div>`);
}
function downloadReminder() {
    const [h, m] = ($('rm-time').value || '21:00').split(':').map(Number);
    const d = todayISO().replace(/-/g, ''), t = `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    const end = `${String((h + (m + 10 >= 60 ? 1 : 0)) % 24).padStart(2, '0')}${String((m + 10) % 60).padStart(2, '0')}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//nutriDL//ES', 'BEGIN:VEVENT', `UID:nutridl-${Date.now()}@nutridl`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
        `DTSTART:${d}T${t}`, `DTEND:${d}T${end}`, 'RRULE:FREQ=DAILY', 'SUMMARY:nutriDL · ' + tr('Apunta tus comidas de hoy'), 'DESCRIPTION:' + tr('Abre nutriDL y revisa tu día.'), 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:nutriDL', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'nutridl-recordatorio.ics'; // i18n-ignore (nombre de archivo)
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    closeSheet(); toast('Abre el archivo para añadirlo a tu calendario'); track('reminder'); ev('reminder_set');
}
