// nutriDL · Coach: conversación, «¿Qué como?», menú del día, lista de la compra, voz y foto
// Funciona en el dispositivo con tus datos y la base de alimentos. Cada respuesta indica si es un dato tuyo,
// una estimación o una recomendación. No diagnostica ni sustituye a un profesional.
'use strict';

// =====================================================================
//  UTILIDADES COMPARTIDAS
// =====================================================================
const TAGS = { dato: ['Tus datos', 'fa-database'], est: ['Estimación', 'fa-scale-unbalanced'], rec: ['Recomendación', 'fa-lightbulb'], base: ['Base de alimentos', 'fa-book'] };
const tagPill = k => `<span class="nd-tag nd-tag-${k}"><i class="fa-solid ${TAGS[k][1]}"></i>${TAGS[k][0]}</span>`;
const slotLow = s => (SLOT_NAME[s] || 'comida').toLowerCase();
// Con artículo: «el desayuno», «la cena»… (a + el = al)
const SLOT_ART = { B: 'el desayuno', M: 'la media mañana', L: 'la comida', S: 'la merienda', D: 'la cena', X: 'picar' };
const slotArt = s => SLOT_ART[s] || 'la comida';
const toSlot = s => s === 'X' ? 'a otros' : s === 'B' ? 'al desayuno' : 'a ' + slotArt(s);
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
const leftLine = () => { const R = remainingToday(); return R.kcal >= 0 ? `Te quedan <b>${fmt(R.kcal)} kcal</b> y <b>${fmt(Math.max(0, R.p))} g de proteína</b> hoy.` : `Hoy vas <b>${fmt(-R.kcal)} kcal</b> por encima de tu objetivo.`; };

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
    if (P.done) return `<div class="nd-done"><i class="fa-solid fa-circle-check"></i> Añadido ${toSlot(P.slot)}</div>`;
    if (!P.items.length) return '<p class="text-sm text-neutral-400">No queda nada que añadir.</p>';
    const rows = P.items.map((it, i) => {
        const f = getFood(it.fid); if (!f) return '';
        const m = macrosOf(f, it.g);
        const alts = it.open ? `<div class="flex flex-wrap gap-1.5 pt-2">${it.alts.map(a => getFood(a)).filter(Boolean).map(a => `<button type="button" onclick="pendSwap('${id}',${i},'${a.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(a)} ${esc(a.name)}</button>`).join('')}
            <input type="search" placeholder="Buscar otro…" oninput="pendSearch('${id}',${i},this.value)" class="w-full mt-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm" aria-label="Buscar otro alimento"><div id="${id}-s${i}" class="w-full flex flex-wrap gap-1.5"></div></div>` : '';
        return `<div class="nd-crow">
            <div class="flex items-start gap-2">
                <div class="min-w-0 flex-1">
                    <button type="button" onclick="pendOpen('${id}',${i})" class="text-left text-sm font-bold text-neutral-100 leading-snug" aria-label="Cambiar ${esc(f.name)}">${emo(f)} ${esc(f.name)}${f.brand ? ` <span class="text-mint-300/90 font-semibold">${esc(f.brand)}</span>` : ''} <i class="fa-solid fa-chevron-down text-[10px] text-neutral-500"></i></button>
                    <div id="${id}-m${i}" class="text-xs text-neutral-400">${fmt(m.kcal)} kcal · P ${fmt(m.p)} · HC ${fmt(m.c)} · G ${fmt(m.f)}${f.raw ? ' · en crudo' : ''}${it.est ? ' · <span class="nd-est">≈ estimado</span>' : ''}</div>
                </div>
                <label class="nd-gin"><input type="number" inputmode="decimal" min="1" max="3000" value="${it.g}" oninput="pendG('${id}',${i},this.value)" aria-label="Cantidad de ${esc(f.name)}"><span>${f.ml ? 'ml' : 'g'}</span></label>
                <button type="button" onclick="pendDel('${id}',${i})" class="w-9 h-9 shrink-0 rounded-lg text-neutral-500 hover:text-roseAccent-400 hover:bg-neutral-800" aria-label="Quitar ${esc(f.name)}"><i class="fa-solid fa-xmark"></i></button>
            </div>${alts}</div>`;
    }).join('');
    return `<div class="space-y-2">${rows}</div>
        <div id="${id}-tot" class="text-xs font-bold text-neutral-300 pt-1">${pendTotals(id)}</div>
        <div class="flex gap-2 pt-1">
            <select onchange="pend['${id}'].slot=this.value" class="p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-bold" aria-label="Comida del día">${DSLOTS.map(([k, n]) => `<option value="${k}" ${k === P.slot ? 'selected' : ''}>${n === 'Otros / picoteo' ? 'Otros' : n}</option>`).join('')}</select>
            <button type="button" onclick="pendAdd('${id}')" class="flex-1 py-2.5 rounded-xl bg-mint-600 hover:bg-mint-700 text-white text-sm font-extrabold"><i class="fa-solid fa-check"></i> Añadir ${P.items.length === 1 ? '' : P.items.length + ' '}al diario</button>
        </div>`;
}
function pendTotals(id) {
    const P = pend[id], t = P.items.reduce((a, it) => { const f = getFood(it.fid); if (!f) return a; const m = macrosOf(f, it.g); a.k += m.kcal; a.p += m.p; return a; }, { k: 0, p: 0 });
    const after = calc.target ? remainingToday().kcal - t.k : null;
    return `Total ${fmt(t.k)} kcal · ${fmt(t.p)} g de proteína${after != null ? ` · después te quedarán ${after >= 0 ? fmt(after) + ' kcal' : `${fmt(-after)} kcal de más`}` : ''}`;
}
const refreshPend = id => document.querySelectorAll(`[data-pend="${id}"]`).forEach(el => { el.innerHTML = pendHtml(id); });
function pendG(id, i, v) {
    const P = pend[id], it = P.items[i], g = num(v); if (!g || g <= 0 || g > 3000) return;
    it.g = g; it.est = false;
    const f = getFood(it.fid), m = macrosOf(f, g), el = $(`${id}-m${i}`);
    if (el) el.innerHTML = `${fmt(m.kcal)} kcal · P ${fmt(m.p)} · HC ${fmt(m.c)} · G ${fmt(m.f)}${f.raw ? ' · en crudo' : ''}`;
    const tot = $(`${id}-tot`); if (tot) tot.innerHTML = pendTotals(id);
    persistChatPend(id);
}
function pendDel(id, i) { pend[id].items.splice(i, 1); refreshPend(id); persistChatPend(id); }
function pendOpen(id, i) { const it = pend[id].items[i]; it.open = !it.open; refreshPend(id); }
function pendSwap(id, i, fid) { const it = pend[id].items[i]; const old = it.fid; it.alts = [old, ...it.alts.filter(a => a !== fid)].slice(0, 6); it.fid = fid; it.open = false; refreshPend(id); persistChatPend(id); }
function pendSearch(id, i, q) {
    const box = $(`${id}-s${i}`); if (!box) return;
    box.innerHTML = q.trim().length < 2 ? '' : matchFoods(q, 6).map(a => `<button type="button" onclick="pendSwap('${id}',${i},'${a.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(a)} ${esc(a.name)}${a.brand ? ' · ' + esc(a.brand) : ''}</button>`).join('');
}
function pendAdd(id) {
    const P = pend[id]; if (!P || P.done || !P.items.length) return;
    const d = todayISO();
    const ids = P.items.map(it => { const f = getFood(it.fid); return f ? pushDiary(entryFrom(f, it.g, P.slot, it.est), d) : null; }).filter(Boolean);
    P.done = true; persistChatPend(id);
    track('food_logged'); ev('food_logged_' + (P.src || 'text'));
    afterLog(); refreshPend(id);
    if (P.chat) { coachSay(`Apuntado ✓ ${leftLine()}`, 'dato'); }
    else { closeSheet(); toastUndo(`${ids.length} alimento${ids.length === 1 ? '' : 's'} añadido${ids.length === 1 ? '' : 's'} ${toSlot(P.slot)}`, () => { state.diary[d] = (state.diary[d] || []).filter(e => !ids.includes(e.id)); save(); renderDiary(); renderDashboard(); }); }
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
    if (!calc.target) { box.innerHTML = `<div class="nd-card p-4 flex items-center justify-between gap-3"><span class="text-sm text-neutral-300">Completa tu plan para que el Coach conozca tu objetivo.</span><button onclick="${profiles.current ? "showTab('calc')" : 'newProfile()'}" class="px-3 py-2 rounded-xl bg-mint-600 text-white text-xs font-extrabold whitespace-nowrap">Completar</button></div>`; return; }
    const R = remainingToday();
    const chip = (l, v, u) => `<div class="nd-ctx"><span>${l}</span><b>${v < 0 ? '+' + fmt(-v) : fmt(v)}${u}</b></div>`;
    box.innerHTML = `<div class="grid grid-cols-4 gap-2">${chip(R.kcal >= 0 ? 'Quedan' : 'De más', Math.abs(R.kcal), ' kcal')}${chip('Proteína', Math.max(0, R.p), ' g')}${chip('Hidratos', Math.max(0, R.c), ' g')}${chip('Grasas', Math.max(0, R.f), ' g')}</div>`;
}

// =====================================================================
//  COACH: CONVERSACIÓN
// =====================================================================
function renderChat(scroll) {
    renderCoachCtx();
    const log = $('chat-log'); if (!log) return;
    const L = state.chat || [];
    const hello = `<div class="nd-msg-c">${tagPill('rec')}<p>Hola${profiles.current ? ', ' + esc(profiles.list[profiles.current].name) : ''} 👋 Soy tu Coach. Dime lo que has comido y lo apunto, pregúntame qué comer o cómo vas. Respondo con tus datos de nutriDL.</p></div>`;
    log.innerHTML = (L.length ? '' : hello) + L.map(msgHtml).join('');
    $('chat-sugg').innerHTML = chatSuggestions().map(s => `<button type="button" onclick="coachSend(${esc(JSON.stringify(s))})" class="shrink-0 px-3.5 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 hover:border-mint-500/50">${esc(s)}</button>`).join('');
    // La respuesta nueva se ve desde su principio (sin quedar detrás de la caja de texto)
    if (scroll) { const last = log.lastElementChild; if (last) requestAnimationFrame(() => last.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })); }
}
function msgHtml(m) {
    if (m.r === 'u') return `<div class="nd-msg-u">${esc(m.t)}</div>`;
    if (m.p) pend[m.id] = m.p;
    return `<div class="nd-msg-c" data-msg="${m.id}">${m.tags ? m.tags.map(tagPill).join('') : ''}${m.html || ''}
        ${m.logged && !m.p ? (m.logged.undone === 1 ? '<div class="nd-done"><i class="fa-solid fa-rotate-left"></i> Deshecho</div>' : `<div class="grid grid-cols-2 gap-2 mt-3"><button type="button" onclick="logAdjust('${m.id}')" class="nd-mbtn"><i class="fa-solid fa-sliders"></i> Ajustar</button><button type="button" onclick="logUndo('${m.id}')" class="nd-mbtn"><i class="fa-solid fa-rotate-left"></i> Deshacer</button></div>`) : ''}
        ${m.p ? `<div data-pend="${m.id}" class="mt-3">${pendHtml(m.id)}</div>` : ''}
        ${m.opts ? `<div class="mt-3 space-y-2">${m.opts.map((o, i) => mealCard(o, { add: `coachAddOpt('${m.id}',${i})`, added: (m.added || []).includes(i), slot: m.slot, key: m.id + i })).join('')}</div>` : ''}</div>`;
}
function chatSuggestions() {
    const h = new Date().getHours(), slot = h < 11 ? '¿Qué desayuno?' : h < 16 ? '¿Qué como hoy?' : h < 19 ? '¿Qué meriendo?' : '¿Qué ceno?';
    return ['¿Cuánto me queda?', slot, 'He comido pollo con arroz', 'Tengo huevos, patata y espinacas, ¿qué ceno?', 'Compra fitness para la semana', 'Quiero un desayuno de 40 g de proteína', 'Voy a cenar fuera', '¿Cómo llego a mis proteínas?', '¿Cómo voy esta semana?'];
}
function pushMsg(m) {
    m.id = m.id || 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    state.chat = state.chat || []; state.chat.push(m);
    if (state.chat.length > 40) state.chat.splice(0, state.chat.length - 40);
    save(); return m;
}
function coachSay(html, ...tags) { pushMsg({ r: 'c', html: `<p>${html}</p>`, tags }); renderChat(true); }
let coachBusy = false;
function coachSend(text) {
    const inp = $('chat-in'); const t = String(text != null ? text : inp.value).trim().slice(0, 300); if (!t || coachBusy) return;
    inp.value = '';
    pushMsg({ r: 'u', t }); renderChat(true);
    coachBusy = true;
    const log = $('chat-log'); log.insertAdjacentHTML('beforeend', '<div class="nd-msg-c nd-typing" id="nd-typing"><span></span><span></span><span></span></div>');
    setTimeout(() => {
        coachBusy = false;
        let replies;
        try { replies = [].concat(coachReply(t)); } catch (e) { logErr('Coach: ' + e.message); replies = [{ r: 'c', html: '<p>Algo ha fallado al entenderte. Prueba a escribirlo de otra forma.</p>' }]; }
        replies.forEach(pushMsg); renderChat(true);
    }, 260);
    track('coach_msg');
}
function clearChat() { state.chat = []; save(); renderChat(); }

// ---------- Entender la pregunta ----------
const RX = {
    safety: /\b(embaraz\w*|lactanc\w*|amamant\w*|diabet\w*|insulin\w*|medicac\w*|anorex\w*|bulimi\w*|atracon\w*|trastorno\w* (de la )?(conducta )?alimentari\w*|vomit\w*|purg\w*|laxante\w*|renal|rinon\w*|hipertens\w*|cancer|quimio\w*|menor de edad|tengo 1[0-7] anos)\b/,
    tooLow: /\b([1-9]\d{2})\s*(kcal|calorias)\b.*\b(al dia|diarias|cada dia)\b|\bdejar de comer\b|\bno comer nada\b|\bayun\w* de [3-9] dias\b/,
    hello: /^(hola|buenas|hey|buenos dias|buenas tardes|buenas noches|que tal)\b/,
    left: /((calorias|kcal|proteina\w*) me queda|cuant\w* me queda|que me queda|me queda(n)? (algo|mucho|poco)|cuant\w* llevo|como voy hoy|resumen de hoy|cuant\w* (calorias|kcal) (he|llevo))/,
    logged: /\b(he|me he|hemos|acabo de|ya he)\s+(comido|tomado|cenado|desayunado|merendado|bebido|almorzado|picado)\b/,
    out: /\b(fuera|restaurante\w*|pedir|pido|menu del dia|bar|tapas?|italiano|pizzeria|japones|sushi|chino|hamburgueseria|burger|mexicano|kebab|comida rapida|fast food|cumpleanos|boda|cena de empresa)\b/,
    suggest: /\b(que (puedo )?(como|ceno|desayuno|meriendo|comer|cenar|desayunar|merendar|tomo|pico)|quiero (un|una|algo)|dame|ideas?|sugier\w*|recomiend\w*|opciones|propon\w*|que hago de)\b|\bme quedan? \d+/,
    protein: /\b(lleg\w*|alcanz\w*|cumpl\w*|sub\w*|aument\w*|complet\w*|falt\w*|mas)\b.*\bproteina\w*|\bproteina\w*\b.*\b(lleg\w*|alcanz\w*|cumpl\w*|falt\w*)\b/,
    info: /\b(cuant\w* (calorias|kcal|proteina\w*|hidratos|grasas?)|que (tiene|aporta)|macros de|valor\w* nutricional\w*|informacion de)\b/,
    progress: /\b(como voy|progreso|tendencia|mi semana|esta semana|resumen semanal|evolucion|he bajado|he subido|racha)\b/,
    menu: /\b((genera\w*|crea\w*|haz|hazme|quiero|dame|ver) (un |el |mi )?menu|menu (para hoy|completo|semanal|de hoy)|planifica\w*|plan de comidas)\b/,
    shop: /\b(lista de (la )?compra|que compro|hacer (la |una )?compra|compra (fitness|sana|semanal|para)|haz(me)? (la |una )?compra)\b/,
    fridge: /\b(tengo|me queda\w*|hay)\b.*\b(nevera|frigo|casa|despensa)\b|\b(en (la|mi) nevera|en casa) (tengo|hay|me queda)\b|^tengo\b|\bcon lo que tengo\b/,
    weight: /\b(peso|pesado|bascula)\b.*\b(\d{2,3}([.,]\d)?)\b/,
};
function coachReply(raw) {
    const q = norm(raw).replace(/(\d)\.(\d{3})\b/g, '$1$2'); // «1.200 kcal» → 1200
    if (RX.safety.test(q)) return { r: 'c', tags: ['rec'], html: `<p>En tu situación las necesidades cambian y conviene que lo valore un profesional sanitario: tu médico o un dietista-nutricionista. nutriDL es orientativa y no puede adaptar un plan con seguridad en ese caso.</p><p class="mt-2">Sí puedo ayudarte a apuntar lo que comes para que lo compartas con tu profesional.</p>` };
    if (RX.tooLow.test(q)) return { r: 'c', tags: ['rec'], html: `<p>Comer tan poco no es seguro sin supervisión médica: aumenta la pérdida de músculo y el riesgo de déficit de nutrientes. Tu plan nunca baja de ${fmt(calc.male ? 1500 : 1200)} kcal. Si quieres avanzar más rápido, suma pasos y entrenamiento de fuerza.</p>` };
    if (!calc.target && !RX.logged.test(q)) return { r: 'c', tags: ['rec'], html: `<p>Para responderte con tus números necesito tu plan (2 minutos): objetivo, datos y actividad.</p><button onclick="${profiles.current ? "showTab('calc')" : 'newProfile()'}" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">Completar mi plan</button>` };
    if (RX.hello.test(q) && q.length < 25) return { r: 'c', tags: ['dato'], html: `<p>¡Hola! ${leftLine()} ¿Te propongo algo para ${slotArt((nextMeal() || {}).slot || slotByHour())}?</p>` };
    if (RX.logged.test(q) || (!RX.suggest.test(q) && !RX.left.test(q) && !RX.info.test(q) && !RX.progress.test(q) && !RX.out.test(q) && !RX.protein.test(q) && !RX.menu.test(q) && !RX.shop.test(q) && /^\s*(\d|un |una |dos |medio |media )/.test(q))) {
        const r = replyLog(raw); if (r) return r;
    }
if (RX.menu.test(q)) { if (!canUse('menu')) return proReply('menu'); setTimeout(() => coachView('menu'), 400); return { r: 'c', tags: ['rec'], html: '<p>Te abro tu menú del día: lo calculo con tus calorías, tus macros y tus preferencias. Puedes cambiar cualquier plato.</p>' }; }
    if (RX.shop.test(q)) {
        if (!canUse('shop')) return proReply('shop');
        const wantsPlan = /\b(\d+ dias?|semana|fitness|me gusta|sin |vegetarian|vegan|barat|economic)/.test(q);
        setTimeout(() => { coachView('shop'); if (wantsPlan) shopAsk(raw); }, 400);
        return { r: 'c', tags: ['rec'], html: wantsPlan ? '<p>Te preparo la compra con lo que me dices y te la abro. Luego puedes cambiar lo que quieras: «cambia el salmón por merluza», «quita la leche»…</p>' : '<p>Te abro la compra: dime qué quieres (días, lo que te gusta, lo que no) y te la preparo con cantidades.</p>' };
    }
    if (RX.fridge.test(q)) { const r = replyFridge(raw, q); if (r) return r; }
    if (RX.out.test(q)) return replyOut(q);
    if (RX.protein.test(q)) return replyProtein();
    if (RX.suggest.test(q)) return replySuggest(q);
    if (RX.left.test(q)) return replyLeft();
    if (RX.info.test(q)) { const r = replyInfo(q); if (r) return r; }
    if (RX.progress.test(q)) return replyProgress();
    const r = replyLog(raw, true); if (r) return r;
    return { r: 'c', tags: ['rec'], html: `<p>No estoy seguro de haberte entendido. Puedo:</p><ul class="nd-list"><li>Apuntar lo que has comido: «200 g de pollo y una ensalada»</li><li>Decirte cuánto te queda hoy</li><li>Proponerte qué comer: «¿Qué ceno con 600 kcal?»</li><li>Darte ideas para comer fuera</li><li>Contarte cómo vas esta semana</li></ul>` };
}
function replyLeft() {
    const R = remainingToday(), nm = nextMeal();
    let html = `<p>Hoy llevas <b>${fmt(R.t.kcal)}</b> de ${fmt(calc.target)} kcal. ${R.kcal >= 0 ? `Te quedan <b>${fmt(R.kcal)} kcal</b>: ${fmt(Math.max(0, R.p))} g de proteína, ${fmt(Math.max(0, R.c))} g de hidratos y ${fmt(Math.max(0, R.f))} g de grasa.` : `Vas <b>${fmt(-R.kcal)} kcal</b> por encima. No pasa nada por un día: lo que cuenta es la media de la semana.`}</p>`;
    const tags = ['dato'];
    if (nm && nm.slot && nm.tg.kcal > 120) { html += `<p class="mt-2">Para ${slotArt(nm.slot)} te recomiendo unas <b>${fmt(nm.tg.kcal)} kcal</b> con <b>${fmt(nm.tg.p)} g de proteína</b>.</p><button onclick="coachSend('¿Qué tomo de ${slotLow(nm.slot)}?')" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">Ver opciones</button>`; tags.push('rec'); }
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
    const lines = items.map(it => { const f = getFood(it.fid), m = macrosOf(f, it.g); return `<li>${emo(f)} ${esc(f.name)} · ${amountText(f, it.g)}${it.est ? ' <span class="nd-est">≈</span>' : ''} · <b>${fmt(m.kcal)} kcal</b> <span class="text-neutral-400">· P ${fmt(m.p)} · HC ${fmt(m.c)} · G ${fmt(m.f)}</span></li>`; }).join('');
    const unk = P.unknown.length ? `<p class="text-xs text-amber-200 mt-2">No he encontrado «${esc(P.unknown.join('», «'))}». Apúntalo con una estimación:</p>${quickKcalBtns(P.unknown.join(', '), slot)}` : '';
    return { r: 'c', tags: est ? ['base', 'est'] : ['base'], logged: { d, ids, slot, items },
        html: `<p>✓ Apuntado ${toSlot(slot)}:</p><ul class="nd-list">${lines}</ul><p class="mt-2">Total <b>${fmt(tot.k)} kcal</b> · ${fmt(tot.p)} g de proteína. ${leftLine()}</p>${est ? '<p class="text-xs text-neutral-400 mt-1">≈ = ración habitual (no dijiste cantidad). Si no cuadra, pulsa «Ajustar».</p>' : ''}${unk}` };
}
// Algo que no está en la base: se apunta con una estimación de calorías (y macros de un plato mixto), marcado como estimado
const quickKcalBtns = (name, slot) => `<div class="flex flex-wrap gap-1.5 mt-2">${[200, 350, 500, 700, 900].map(k => `<button type="button" onclick="quickKcal(${esc(JSON.stringify(name))},'${slot}',${k})" class="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-extrabold text-neutral-100 hover:border-mint-500/60">≈ ${k} kcal</button>`).join('')}<button type="button" onclick="quickKcalOther(${esc(JSON.stringify(name))},'${slot}')" class="px-3 py-2 rounded-lg border border-dashed border-neutral-700 text-xs font-bold text-neutral-300">Otra cantidad</button></div>`;
function unknownDish(name, slot) {
    return { r: 'c', tags: ['est'], html: `<p>No tengo «${esc(name || 'eso')}» en la base de alimentos. Para que no se pierda, apúntalo con una estimación (luego puedes corregirla en el diario):</p>${quickKcalBtns(name || 'Comida', slot)}<p class="text-xs text-neutral-400 mt-2">Orientación: un plato combinado ronda 600-800 kcal; un bocadillo, 400-600; un postre, 250-400.</p>` };
}
function quickKcal(name, slot, kcal) {
    const d = todayISO();
    pushDiary({ slot, name: String(name).slice(0, 50) || 'Comida', kcal: Math.round(kcal), p: round1(kcal * .2 / 4), c: round1(kcal * .45 / 4), f: round1(kcal * .35 / 9), fib: 0, est: 1 }, d);
    track('food_logged'); afterLog();
    coachSay(`Apuntado «${esc(name)}» ≈ ${fmt(kcal)} kcal ${toSlot(slot)} (estimado). ${leftLine()}`, 'est');
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
    const ids = parseFoodText(raw.replace(/\b(tengo|en (la|mi) nevera|en casa|hay|me queda\w*|con lo que tengo|que (puedo )?(cenar|comer|desayunar|merendar|hacer|cocinar)|que (ceno|como|hago|cocino))\b/gi, ',')).items.map(i => i.food.id);
    if (!ids.length) return null;
    if (!canUse('fridge')) return proReply('fridge');
    const p = myPrefs(); ids.forEach(id => { if (!p.pantry.includes(id)) p.pantry.push(id); }); save();
    const slot = slotFromText(q) || (nextMeal() || {}).slot || slotByHour();
    const { tg, opts } = fridgeMeals(slot, ids);
    if (!opts.length) return { r: 'c', tags: ['rec'], html: `<p>Con ${ids.map(id => getFood(id).name.toLowerCase()).join(', ')} no me sale un plato completo. Añade alguna proteína (huevos, pollo, atún, legumbres…) y algún hidrato (arroz, pasta, patata, pan…).</p>` };
    return { r: 'c', tags: ['rec', 'base'], slot, opts, html: `<p>Con lo que tienes, para ${slotArt(slot)} (≈ <b>${fmt(tg.kcal)} kcal</b> y <b>${fmt(tg.p)} g de proteína</b>):</p>` };
}
const proReply = feature => ({ r: 'c', tags: ['rec'], html: `<p><b>${esc(PRO_FEATURES[feature][0])}</b> es de nutriDL PRO: ${esc(PRO_FEATURES[feature][1].toLowerCase())}</p><button onclick="openPaywall('${feature}')" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">${proData().trialUsed ? 'Ver nutriDL PRO' : 'Probar 7 días gratis'}</button>` });
function slotFromText(q) {
    if (/desayun/.test(q)) return 'B';
    if (/media manana|almuerz/.test(q)) return planSlots().includes('M') ? 'M' : 'S';
    if (/merend|merienda|snack|picar|picoteo|tentempie/.test(q)) return 'S';
    if (/\bcen(a|ar|o)\b/.test(q)) return 'D';
    if (/\b(comida|al mediodia|para comer|almorzar)\b/.test(q)) return 'L';
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
    const mk = q.match(/(\d{2,4})\s*(kcal|calorias|cal)\b/), mp = q.match(/(\d{1,3})\s*(g|gr|gramos)\s*(de\s+)?proteina/) || q.match(/proteina\w*\s*(de\s*)?(\d{1,3})\s*(g|gr|gramos)?/);
    const tags = [];
    if (mk) { const k = +mk[1], r = k / Math.max(1, tg.kcal); tg = { kcal: k, p: tg.p * r, f: tg.f * r, c: tg.c * r }; }
    if (mp) { const pg = +(mp[1] && /^\d+$/.test(mp[1]) ? mp[1] : mp[2]); if (pg > 0 && pg < 150) tg.p = pg; }
    if (/mucha proteina|alto en proteina|rica? en proteina|proteic|hiperproteic/.test(q)) tg.p = Math.max(tg.p, tg.kcal * .35 / 4);
    if (mp && !mk) tg.kcal = Math.max(tg.kcal, tg.p * 4 / .35);
    if (tg.kcal < 90) return { r: 'c', tags: ['dato', 'rec'], html: `<p>Ya casi has completado tu día (${leftLine()}). Si tienes hambre, elige algo muy ligero: una infusión, verduras crudas, un yogur natural o una pieza de fruta.</p>` };
    const opts = suggestMeals(slot, tg, { n: 3, seed: Date.now() % 100000 });
    if (!opts.length) return { r: 'c', tags: ['rec'], html: '<p>Con tus preferencias no encuentro platos para esa comida. Revisa tus alergias y los alimentos que no te gustan en Preferencias.</p><button onclick="openPrefs()" class="mt-3 px-4 py-2.5 rounded-xl bg-neutral-800 text-sm font-extrabold">Preferencias</button>' };
    tags.push('rec', 'base');
    ev('suggest_' + slot);
    return { r: 'c', tags, slot, opts, html: `<p>Para ${slotArt(slot)} (≈ <b>${fmt(tg.kcal)} kcal</b> y <b>${fmt(tg.p)} g de proteína</b>) te propongo:</p>` };
}
function coachAddOpt(mid, i) {
    const m = state.chat.find(x => x.id === mid); if (!m || !m.opts[i]) return;
    mealToDiary(m.opts[i], m.slot, todayISO());
    m.added = [...(m.added || []), i]; save();
    track('food_logged'); ev('food_logged_suggest');
    afterLog();
    pushMsg({ r: 'c', tags: ['dato'], html: `<p>Añadido ${toSlot(m.slot)} ✓ ${leftLine()}</p>` }); renderChat(true);
}
function replyProtein() {
    const R = remainingToday();
    if (R.p <= 0) return { r: 'c', tags: ['dato'], html: `<p>🏆 Ya has llegado a tu proteína de hoy (${fmt(R.t.p)} g de ${calc.prot} g).</p>` };
    const need = Math.min(R.p, 40), p = myPrefs();
    const ids = ['pollo', 'pavo', 'atun', 'claras', 'skyr', 'batido', 'merluza', 'gambas', 'huevo', 'tofu', 'seitan', 'fiambre', 'cottage', 'whey', 'lentejas', 'edamame', 'tempeh'];
    const L = ids.map(getFood).filter(f => f && foodOk(f, p)).map(f => { const g = Math.round(need / (f.p / 100) / 5) * 5; return { f, g, k: macrosOf(f, g).kcal }; })
        .filter(x => x.g <= 400).sort((a, b) => a.k - b.k).slice(0, 5);
    return { r: 'c', tags: ['dato', 'base', 'rec'], html: `<p>Te faltan <b>${fmt(R.p)} g de proteína</b> y te quedan ${fmt(Math.max(0, R.kcal))} kcal. Para sumar ${fmt(need)} g gastando pocas calorías:</p>
        <ul class="nd-list">${L.map(x => `<li>${emo(x.f)} ${amountText(x.f, x.g)} de ${esc(x.f.name.toLowerCase())} → ${fmt(x.k)} kcal</li>`).join('')}</ul>
        <p class="mt-2">Consejo: reparte la proteína en 3-4 tomas y empieza cada comida por ella.</p>
        <button onclick="coachSend('Me quedan ${Math.round(Math.max(150, R.kcal))} kcal y necesito mucha proteína')" class="mt-3 px-4 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-extrabold">Proponme un plato</button>` };
}
function replyInfo(q) {
    const name = q.replace(RX.info, ' ').replace(/\b(tiene|hay en|un|una|el|la|los|las|de|del|por)\b/g, ' ').replace(/[?¿!.]/g, ' ').trim();
    const f = name.length > 1 && matchFoods(name, 1)[0]; if (!f) return null;
    const d = defaultPortion(f), m = macrosOf(f, d.g), k = kcal100(f);
    return { r: 'c', tags: ['base'], html: `<p>${emo(f)} <b>${esc(f.name)}</b>${f.brand ? ' · ' + esc(f.brand) : ''}</p>
        <p class="mt-1">${portionLabel(d.unit, d.n, f)}: <b>${fmt(m.kcal)} kcal</b> · proteína ${fmt(m.p, 1)} g · hidratos ${fmt(m.c, 1)} g · grasa ${fmt(m.f, 1)} g</p>
        <p class="text-xs text-neutral-400 mt-1">Por 100 ${f.ml ? 'ml' : 'g'}: ${fmt(k)} kcal · P ${fmt(f.p, 1)} · HC ${fmt(f.c, 1)} · G ${fmt(f.f, 1)}${f.raw ? ' (en crudo)' : ''}</p>
        <button onclick="openFoodSheet(); fsOpen('${f.id}')" class="mt-3 px-4 py-2.5 rounded-xl bg-neutral-800 text-sm font-extrabold">Apuntarlo</button>` };
}
function replyProgress() {
    const L = insightsList().slice(0, 4), S = streakInfo();
    if (!L.length) return { r: 'c', tags: ['dato'], html: '<p>Aún tengo pocos datos. Apunta tus comidas unos días y pésate una vez por semana: te contaré cómo vas.</p>' };
    return { r: 'c', tags: ['dato'], html: `<p>${S.cur ? `🔥 Racha de ${S.cur} día${S.cur === 1 ? '' : 's'}. ` : ''}Esto es lo que dicen tus datos:</p><ul class="nd-list">${L.map(x => `<li>${x.ic} ${esc(x.t)}</li>`).join('')}</ul>` };
}
// Comer fuera: consejos y cuánto cabe en lo que te queda (valores medios de la base)
const OUT = {
    italiano: [/italian|pizz|pasta/, [['pizza', 'porción'], ['lasana'], ['macarronestom']], 'Mejor pasta con salsa de tomate y algo de proteína (pollo, atún, gambas) que con nata o cuatro quesos. Si es pizza, compártela y añade una ensalada.'],
    japones: [/japon|sushi/, [['sushi']], 'El sashimi y el nigiri tienen más proteína y menos arroz que los makis fritos o con mayonesa. Sopa miso o edamame para empezar.'],
    burger: [/hamburgues|burger|comida rapida|fast food/, [['hamburguesacomp'], ['patatasfritas'], ['nuggets']], 'Hamburguesa sencilla (sin doble queso ni beicon), ensalada en vez de patatas o patatas pequeñas, y bebida sin azúcar.'],
    tapas: [/tapa|bar\b/, [['tortilla'], ['croquetas'], ['calamaresrom'], ['bravas'], ['ensaladilla'], ['jamon']], 'Prioriza tapas a la plancha (pulpo, gambas, pinchos de pollo, boquerones en vinagre) y jamón. Fritos y salsas, para compartir.'],
    chino: [/chino/, [['arroz3']], 'Pollo o ternera salteados con verduras y arroz blanco en vez de frito. Evita lo rebozado y las salsas dulces.'],
    menu: [/menu del dia/, [['lentguisadas'], ['paella'], ['pollopl'], ['ensalada']], 'Primero de verdura, legumbre o ensalada; segundo a la plancha con guarnición sencilla; fruta o café de postre. El pan, en la medida justa.'],
};
function replyOut(q) {
    const R = remainingToday(), k = Math.max(0, R.kcal);
    const hit = Object.values(OUT).find(([re]) => re.test(q));
    const rows = (hit ? hit[1] : [['ensalada'], ['pollopl'], ['tortilla'], ['pizza']]).map(([id]) => getFood(id)).filter(Boolean).map(f => {
        const d = defaultPortion(f), kc = macrosOf(f, d.g).kcal;
        const n = d.unit.key !== 'g' ? Math.floor(k * .85 / (kc || 1) * 2) / 2 : 0;
        return `<li>${emo(f)} ${esc(f.name)}: ${portionLabel(d.unit, d.n, f)} ≈ ${fmt(kc)} kcal${n >= 1 && f.id === 'sushi' ? ` · te caben unas ${fmt(Math.floor(n))} piezas` : ''}</li>`;
    }).join('');
    return { r: 'c', tags: ['dato', 'est', 'rec'], html: `<p>Te quedan <b>${fmt(k)} kcal</b> y <b>${fmt(Math.max(0, R.p))} g de proteína</b> para hoy.</p>
        <p class="mt-2"><b>Qué pedir:</b> ${hit ? hit[2] : 'Elige plancha, horno o parrilla; salsas aparte; una sola guarnición de hidratos; y agua o bebida sin azúcar. Empieza por la proteína y las verduras.'}</p>
        <p class="mt-2 text-xs text-neutral-400">Valores medios orientativos (cada restaurante cocina distinto):</p><ul class="nd-list">${rows}</ul>
        <p class="mt-2">Cuando vuelvas, dime qué has comido y lo apunto.</p>` };
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
                <div class="text-[15px] font-extrabold text-neutral-50 leading-snug">${esc(meal.name)}</div>
                <div class="text-xs text-neutral-400 mt-0.5">${ing.map(x => `${esc(x.txt)} de ${esc(x.f.name.toLowerCase().replace(/ \(.*\)$/, ''))}`).join(' · ')}</div>
            </div>
            <div class="text-right shrink-0"><div class="text-lg font-extrabold text-neutral-50 leading-none">${fmt(meal.m.kcal)}</div><div class="text-[11px] font-bold text-neutral-400">kcal</div></div>
        </div>
        ${meal.missing && meal.missing.length ? `<div class="text-xs font-bold text-amber-200">🛒 Te falta: ${meal.missing.map(id => getFood(id)).filter(Boolean).map(f => esc(f.name.toLowerCase())).join(', ')}</div>` : ''}
        <div class="flex gap-3 text-xs font-bold text-neutral-300"><span><span class="nd-dot" style="background:#c49a6c"></span>P ${fmt(meal.m.p)} g</span><span><span class="nd-dot" style="background:#e6d3b3"></span>HC ${fmt(meal.m.c)} g</span><span><span class="nd-dot" style="background:#f59e0b"></span>G ${fmt(meal.m.f)} g</span>${meal.min ? `<span class="text-neutral-500"><i class="fa-regular fa-clock"></i> ${meal.min} min</span>` : ''}</div>
        ${open ? `<div class="nd-recipe"><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Ingredientes</div><ul class="nd-list">${ing.map(x => `<li>${emo(x.f)} ${esc(x.txt)} · ${esc(x.f.name)}</li>`).join('')}</ul><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400 pt-2">Pasos</div><ol class="nd-steps">${meal.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}
        <div class="grid ${o.swap ? 'grid-cols-3' : 'grid-cols-2'} gap-2">
            ${o.added ? '<div class="nd-done col-span-1"><i class="fa-solid fa-circle-check"></i> Añadido</div>' : (o.add ? `<button type="button" onclick="${o.add}" class="nd-mbtn nd-mbtn-main"><i class="fa-solid fa-plus"></i> Añadir</button>` : '')}
            ${o.swap ? `<button type="button" onclick="${o.swap}" class="nd-mbtn"><i class="fa-solid fa-rotate"></i> Cambiar</button>` : ''}
            <button type="button" onclick="toggleRecipe('${key}')" class="nd-mbtn"><i class="fa-solid fa-book-open"></i> ${open ? 'Ocultar' : 'Receta'}</button>
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
    openSheet('<i class="fa-solid fa-utensils text-mint-400"></i> ¿Qué como?', '<div id="wte-body"></div>', () => { wte.slot = null; });
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
    toast(`✓ ${meal.name} → ${slotLow(wte.slot)}`);
}
function renderWte() {
    const box = $('wte-body'); if (!box) return;
    const slots = planSlots();
    box.innerHTML = `<div class="space-y-4">
        <div class="flex gap-2 overflow-x-auto nd-noscroll -mx-1 px-1">${slots.map(s => `<button type="button" onclick="wteSlot('${s}')" class="shrink-0 px-3.5 py-2 rounded-full text-xs font-extrabold border ${s === wte.slot ? 'bg-mint-600 border-mint-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-300'}">${SLOT_NAME[s]}</button>`).join('')}</div>
        <div class="nd-card p-4 flex items-center justify-between gap-3"><div><div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Para ${slotArt(wte.slot)}</div><div class="text-lg font-extrabold text-neutral-50">${fmt(wte.tg.kcal)} kcal · ${fmt(wte.tg.p)} g de proteína</div></div>${tagPill('rec')}</div>
        ${wte.opts.length ? wte.shown.map((idx, pos) => mealCard(wte.opts[idx], { key: 'w' + wte.opts[idx].id, add: `wteAdd(${pos})`, added: wte.added.includes(idx), swap: `wteSwap(${pos})` })).join('') : `<p class="text-sm text-neutral-300">${wte.tg.kcal < 90 ? 'Ya casi has completado tu día. Si tienes hambre, algo muy ligero: infusión, verdura cruda, un yogur natural o fruta.' : 'Con tus preferencias no encuentro platos para esta comida.'}</p>`}
        <p class="text-[11px] text-neutral-500">Calorías y macros calculados con la base de alimentos (USDA / BEDCA) para esas cantidades. <button type="button" onclick="closeSheet();openPrefs()" class="underline">Preferencias</button></p>
    </div>`;
}

// =====================================================================
//  MENÚ DEL DÍA
// =====================================================================
function renderMenuView() {
    const box = $('cv-menu'); if (!box) return;
    if (!canUse('menu')) { box.innerHTML = proTeaser('menu'); return; }
    if (!calc.target) { box.innerHTML = emptyPlan('generar tu menú'); return; }
    const mn = state.menu;
    if (!mn || !mn.meals || !mn.meals.length) {
        box.innerHTML = `<div class="nd-card p-6 sm:p-8 text-center space-y-4"><div class="text-4xl">🍽️</div><h3 class="text-xl font-extrabold text-neutral-50">Tu día completo, con gramos exactos</h3><p class="text-sm text-neutral-400 max-w-sm mx-auto">${myPrefs().meals} comidas que suman tus ${fmt(calc.target)} kcal y tus ${calc.prot} g de proteína, según tus preferencias.</p><button onclick="genMenu()" class="nd-btn-primary mx-auto"><i class="fa-solid fa-wand-magic-sparkles"></i> Generar mi menú</button></div>`;
        return;
    }
    const T = menuTotals(mn);
    const bar = (l, v, t, col) => `<div class="space-y-1"><div class="flex justify-between text-[11px] font-bold"><span class="text-neutral-400">${l}</span><span class="text-neutral-200">${fmt(v)}/${fmt(t)}</span></div><div class="h-1.5 rounded-full bg-neutral-800 overflow-hidden"><div class="h-full rounded-full" style="width:${Math.min(100, v / t * 100)}%;background:${col}"></div></div></div>`;
    box.innerHTML = `<div class="nd-card p-5 space-y-4">
            <div class="flex items-end justify-between gap-3"><div><div class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total del menú</div><div class="text-3xl font-extrabold text-neutral-50">${fmt(T.kcal)} <span class="text-sm text-neutral-400">/ ${fmt(calc.target)} kcal</span></div></div>${tagPill('rec')}</div>
            <div class="grid grid-cols-3 gap-3">${bar('Proteína', T.p, calc.prot, '#c49a6c')}${bar('Hidratos', T.c, calc.carbs, '#e6d3b3')}${bar('Grasas', T.f, calc.fat, '#f59e0b')}</div>
            <div class="grid grid-cols-3 gap-2">
                <button onclick="genMenu()" class="nd-mbtn"><i class="fa-solid fa-rotate"></i> Regenerar</button>
                <button onclick="menuAddAll()" class="nd-mbtn nd-mbtn-main"><i class="fa-solid fa-plus"></i> Añadir todo</button>
                <button onclick="coachView('shop')" class="nd-mbtn"><i class="fa-solid fa-basket-shopping"></i> Compra</button>
            </div>
        </div>
        ${mn.meals.map((ml, i) => mealCard(ml, { key: 'mn' + i + ml.id, slotLabel: SLOT_NAME[ml.slot], swap: `menuSwap(${i})`, add: `menuAdd(${i})`, added: (mn.added || []).includes(i) })).join('')}
        <p class="text-[11px] text-neutral-500">Generado el ${new Date(mn.at || Date.now()).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}. Cantidades en crudo salvo que se indique. Calculado con la base de alimentos; las etiquetas pueden variar.</p>`;
}
const emptyPlan = what => `<div class="nd-card p-6 text-center space-y-3"><p class="text-sm text-neutral-300">Completa tu plan para ${what}.</p><button onclick="${profiles.current ? "showTab('calc')" : 'newProfile()'}" class="nd-btn-primary mx-auto">Completar mi plan</button></div>`;
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
    toast(`✓ ${ml.name} → ${slotLow(ml.slot)}`);
}
async function menuAddAll() {
    const left = state.menu.meals.map((_, i) => i).filter(i => !(state.menu.added || []).includes(i));
    if (!left.length) { toast('Ya está todo en tu diario'); return; }
    if (!(await askConfirm(`¿Añadir ${left.length} comida${left.length === 1 ? '' : 's'} del menú a tu diario de hoy?`, 'Añadir'))) return;
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
    const lst = (k, ph) => `<div class="flex flex-wrap gap-1.5">${p[k].map(id => getFood(id)).filter(Boolean).map(f => `<span class="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200">${emo(f)} ${esc(f.name)}<button type="button" onclick="prefDel('${k}','${f.id}')" class="w-6 h-6 rounded text-neutral-500 hover:text-roseAccent-400" aria-label="Quitar ${esc(f.name)}"><i class="fa-solid fa-xmark"></i></button></span>`).join('')}</div>
        <input type="search" placeholder="${ph}" oninput="prefSearch('${k}',this.value)" class="w-full px-3 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-800 text-sm font-semibold" aria-label="${ph}"><div id="pref-s-${k}" class="flex flex-wrap gap-1.5"></div>`;
    return `<div class="space-y-2"><div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">Cómo comes</div><div class="flex flex-wrap gap-2">${Object.entries(DIETS).map(([k, l]) => chip(p.diet === k, `setPref('diet','${k}')`, l)).join('')}</div></div>
        <div class="space-y-2"><div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">Alergias e intolerancias</div><div class="flex flex-wrap gap-2">${Object.entries(ALLERGENS).map(([k, [l]]) => chip(p.allergies.includes(k), `togglePref('allergies','${k}')`, l)).join('')}</div></div>
        <div class="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4"><div class="space-y-2"><div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">Comidas al día</div><div class="flex flex-wrap gap-2">${[3, 4, 5].map(n => chip(p.meals === n, `setPref('meals',${n})`, n)).join('')}</div></div>
        <div class="space-y-2"><div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">Presupuesto</div><div class="flex flex-wrap gap-2">${chip(p.budget === 'low', "setPref('budget','low')", 'Ajustado')}${chip(p.budget !== 'low', "setPref('budget','normal')", 'Normal')}</div></div></div>
        <div class="space-y-2"><div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">No me gusta</div>${lst('dislikes', 'Buscar un alimento que no te guste…')}</div>
        <div class="space-y-2"><div class="text-xs font-bold text-neutral-300 uppercase tracking-wider">Tengo en casa</div>${lst('pantry', 'Buscar lo que tienes en la nevera…')}</div>
        <p class="text-[11px] text-neutral-500">Se usan para «¿Qué como?», el menú y la lista de la compra. Revisa siempre las etiquetas si tienes una alergia.</p>`;
}
function renderPrefs() {
    const box = $('prefs-card'); if (box) box.innerHTML = `<div class="flex items-center gap-3 border-b border-neutral-800 pb-4"><div class="w-10 h-10 rounded-2xl bg-mint-500/15 text-mint-400 flex items-center justify-center text-lg"><i class="fa-solid fa-utensils"></i></div><h2 class="text-lg font-bold text-neutral-100">Preferencias de comida</h2></div>${prefsHtml()}`;
    const sh = $('prefs-sheet'); if (sh) sh.innerHTML = prefsHtml();
}
function openPrefs() { openSheet('<i class="fa-solid fa-sliders text-mint-400"></i> Preferencias', '<div id="prefs-sheet" class="space-y-5"></div>', () => { if (state.tab === 'coach') renderCoach(); }); renderPrefs(); }
function setPref(k, v) { myPrefs()[k] = v; save(); renderPrefs(); track('pref_' + k); }
function togglePref(k, v) { const p = myPrefs(); p[k] = p[k].includes(v) ? p[k].filter(x => x !== v) : p[k].concat(v); save(); renderPrefs(); }
function prefDel(k, id) { const p = myPrefs(); p[k] = p[k].filter(x => x !== id); save(); renderPrefs(); }
function prefAdd(k, id) { const p = myPrefs(); if (!p[k].includes(id)) p[k].push(id); save(); renderPrefs(); }
function prefSearch(k, q) {
    const box = $('pref-s-' + k); if (!box) return;
    box.innerHTML = q.trim().length < 2 ? '' : matchFoods(q, 6).filter(f => !f.brand).map(f => `<button type="button" onclick="prefAdd('${k}','${f.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(f)} ${esc(f.name)}</button>`).join('');
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
    openSheet('<i class="fa-solid fa-microphone text-mint-400"></i> Usar el micrófono', `<div class="space-y-4 text-sm text-neutral-300">
        <p>Para convertir tu voz en texto, tu navegador usa su propio servicio de dictado. En Chrome el audio se procesa en los servidores de Google, y en Safari, en los de Apple.</p>
        <p>nutriDL no guarda ni envía el audio: solo recibe el texto, que se procesa en tu dispositivo.</p>
        <div class="grid grid-cols-2 gap-2"><button onclick="closeSheet();openVoiceLog(true)" class="py-3 rounded-xl border border-neutral-700 font-bold">Prefiero escribir</button><button id="vc-ok" class="py-3 rounded-xl bg-mint-600 text-white font-extrabold">Aceptar y hablar</button></div></div>`);
    $('vc-ok').onclick = () => { setConsent('voice', true); closeSheet(); then(); };
}
function listen(onText, onState) {
    if (!SR) { onState('nosupport'); return; }
    try { if (rec) rec.abort(); } catch (e) { }
    rec = new SR(); rec.lang = 'es-ES'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
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
    openSheet('<i class="fa-solid fa-microphone text-mint-400"></i> Registrar comida', `<div class="space-y-4">
        ${SR && !typeOnly ? `<div class="text-center space-y-3 py-2"><button id="vl-mic" onclick="voiceStart()" class="nd-bigmic" aria-label="Hablar"><i class="fa-solid fa-microphone"></i></button><div id="vl-state" class="text-sm font-bold text-neutral-300">Pulsa y di lo que has comido</div></div>` : `<p class="text-sm text-neutral-400">${SR ? '' : 'Tu navegador no permite dictado aquí. Escríbelo (o usa el micrófono de tu teclado).'}</p>`}
        <textarea id="vl-text" rows="3" maxlength="400" placeholder="Ej: 200 g de pechuga de pollo, 100 g de arroz y una ensalada" class="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl font-semibold text-[15px]" aria-label="Lo que has comido"></textarea>
        <button onclick="voiceParse()" class="w-full py-3 rounded-xl bg-neutral-800 border border-neutral-700 font-extrabold text-sm"><i class="fa-solid fa-wand-magic-sparkles text-mint-400"></i> Entender</button>
        <div id="vl-out"></div></div>`, () => { try { if (rec) rec.abort(); } catch (e) { } });
    if (!SR || typeOnly) setTimeout(() => { const t = $('vl-text'); if (t) t.focus(); }, 80);
    track('voice_open');
}
function voiceStart() {
    listen(t => { $('vl-text').value = t; }, (st, final) => {
        const s = $('vl-state'), b = $('vl-mic'); if (!s) return;
        b.classList.toggle('nd-rec', st === 'listening');
        s.textContent = st === 'listening' ? 'Te escucho…' : st === 'denied' ? 'Sin permiso para el micrófono: escríbelo abajo' : st === 'nospeech' ? 'No te he oído. Pulsa y vuelve a intentarlo' : st === 'error' ? 'El dictado no está disponible: escríbelo abajo' : 'Pulsa y di lo que has comido';
        if (st === 'end' && final) voiceParse();
    });
}
function voiceParse() {
    const t = ($('vl-text').value || '').trim(); if (!t) { toast('Di o escribe lo que has comido'); return; }
    const P = parseFoodText(t), out = $('vl-out');
    if (!P.items.length) { out.innerHTML = `<p class="text-sm text-amber-200">No he reconocido ningún alimento. Prueba con «dos huevos y una tostada con aceite».</p>`; return; }
    voicePid = newPending(P.items, P.slot || slotByHour()); pend[voicePid].src = 'voice';
    out.innerHTML = `<div class="space-y-2"><div class="flex flex-wrap gap-1.5">${tagPill('base')}${P.items.some(i => i.est) ? tagPill('est') : ''}</div>
        ${P.unknown.length ? `<p class="text-xs text-amber-200">No he encontrado: «${esc(P.unknown.join('», «'))}».</p>` : ''}<div data-pend="${voicePid}">${pendHtml(voicePid)}</div></div>`;
}

// =====================================================================
//  FOTO DEL PLATO: tú marcas qué hay y el tamaño de la ración; nosotros estimamos
//  (el reconocimiento automático necesita un servidor seguro: ver docs/IA.md)
// =====================================================================
let photo = null;
const PLATE_QUICK = ['pollopl', 'arrozcocido', 'pastacocida', 'patata', 'ensalada', 'menestra', 'huevo', 'merluza', 'ternera', 'lentguisadas', 'pan', 'aove'];
function portionSet(f) {
    if (f.u && f.u[0] >= 20) return [[1, '1'], [2, '2'], [3, '3']].map(([n, l]) => ({ g: f.u[0] * n, l: `${l} ${n === 1 ? f.u[1] : f.u[2]}` }));
    if (f.cat === 'grasa' && f.f > 90) return [{ g: 5, l: 'Un chorrito' }, { g: 10, l: '1 cucharada' }, { g: 20, l: '2 cucharadas' }];
    const base = f.role === 'protein' ? 130 : f.role === 'veg' ? 150 : f.role === 'fat' ? 30 : f.role === 'fruit' ? (f.fixed || 150) : (f.serv && f.serv[0]) || 160;
    return [{ g: Math.round(base * .65 / 5) * 5, l: 'Pequeña' }, { g: base, l: 'Normal' }, { g: Math.round(base * 1.45 / 5) * 5, l: 'Grande' }];
}
function openPhotoLog() {
    if (needPro('photo')) return;
    // (el estado de la foto se crea después de abrir la hoja: abrir una hoja cierra la anterior y su limpieza)
    openSheet('<i class="fa-solid fa-camera text-mint-400"></i> Foto del plato', `<div class="space-y-4">
        <label class="nd-photo" id="ph-drop"><input id="ph-file" type="file" accept="image/*" capture="environment" class="sr-only" onchange="photoPicked(this)"><span id="ph-prev" class="flex flex-col items-center gap-2 text-neutral-400"><i class="fa-solid fa-camera text-3xl text-mint-400"></i><span class="text-sm font-bold">Hacer o elegir una foto</span><span class="text-xs">Opcional: te ayuda a recordar el plato. No sale de tu móvil.</span></span></label>
        <div class="space-y-2"><div class="text-xs font-extrabold uppercase tracking-wider text-neutral-400">¿Qué hay en el plato?</div>
            <div class="flex flex-wrap gap-1.5">${PLATE_QUICK.map(getFood).filter(Boolean).map(f => `<button type="button" onclick="photoAdd('${f.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(f)} ${esc(f.name.replace(/ \((ya cocido|hecha|lata)\)/, ''))}</button>`).join('')}</div>
            <input type="search" placeholder="Buscar otro alimento…" oninput="photoSearch(this.value)" class="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-semibold" aria-label="Buscar alimento del plato"><div id="ph-s" class="flex flex-wrap gap-1.5"></div>
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
    $('ph-prev').innerHTML = `<img src="${photo.url}" alt="Foto de tu plato" class="w-full max-h-64 object-cover rounded-2xl">`;
    $('ph-drop').classList.add('has');
}
function photoSearch(q) { if (!photo) return; $('ph-s').innerHTML = q.trim().length < 2 ? '' : matchFoods(q, 8).map(f => `<button type="button" onclick="photoAdd('${f.id}')" class="px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-mint-500/60">${emo(f)} ${esc(f.name)}${f.brand ? ' · ' + esc(f.brand) : ''}</button>`).join(''); }
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
        return `<div class="nd-crow space-y-2"><div class="flex items-center gap-2"><div class="flex-1 min-w-0 text-sm font-bold text-neutral-100">${emo(f)} ${esc(f.name)}</div><span id="ph-k${i}" class="text-xs font-bold text-neutral-400">≈ ${fmt(macrosOf(f, it.g).kcal)} kcal</span><button type="button" onclick="photoDel(${i})" class="w-8 h-8 rounded-lg text-neutral-500 hover:text-roseAccent-400" aria-label="Quitar ${esc(f.name)}"><i class="fa-solid fa-xmark"></i></button></div>
            <div class="flex items-center gap-1.5">${ps.map((p, pi) => `<button type="button" onclick="photoPortion(${i},${pi})" class="flex-1 py-2 rounded-lg text-xs font-bold border ${it.pi === pi ? 'bg-mint-600 border-mint-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-300'}">${p.l}</button>`).join('')}
            <label class="nd-gin"><input type="number" inputmode="decimal" min="1" max="3000" value="${it.g}" oninput="photoG(${i},this.value)" aria-label="Gramos de ${esc(f.name)}"><span>${f.ml ? 'ml' : 'g'}</span></label></div></div>`;
    }).join('');
    photoFoot();
}
function photoFoot() {
    if (!photo) return;
    const box = $('ph-foot'); if (!box) return;
    if (!photo.items.length) { box.innerHTML = ''; return; }
    const k = photo.items.reduce((a, it) => a + macrosOf(getFood(it.fid), it.g).kcal, 0);
    box.innerHTML = `<div class="nd-card p-4 space-y-3"><div class="flex items-center justify-between"><div><div class="text-[11px] font-bold uppercase tracking-wider text-amber-300">Estimación aproximada</div><div class="text-xl font-extrabold text-neutral-50">≈ ${fmt(k)} kcal</div></div>${tagPill('est')}</div>
        <p class="text-xs text-neutral-400">Pesos ya cocinados. Si puedes pesarlo, cambia los gramos: será más exacto.</p>
        <div class="flex gap-2"><select id="ph-slot" class="p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm font-bold" aria-label="Comida del día">${DSLOTS.map(([kk, n]) => `<option value="${kk}" ${kk === slotByHour() ? 'selected' : ''}>${n === 'Otros / picoteo' ? 'Otros' : n}</option>`).join('')}</select>
        <button type="button" onclick="photoSave()" class="flex-1 py-2.5 rounded-xl bg-mint-600 hover:bg-mint-700 text-white text-sm font-extrabold"><i class="fa-solid fa-check"></i> Añadir al diario</button></div></div>`;
}
function photoSave() {
    if (!photo || !photo.items.length) return;
    const slot = $('ph-slot').value, d = todayISO();
    const ids = photo.items.map(it => pushDiary(entryFrom(getFood(it.fid), it.g, slot, true), d));
    track('food_logged'); ev('food_logged_photo'); afterLog(); closeSheet();
    toastUndo(`Plato añadido ${toSlot(slot)} (estimado)`, () => { state.diary[d] = (state.diary[d] || []).filter(e => !ids.includes(e.id)); save(); renderDiary(); renderDashboard(); });
}

// =====================================================================
//  RECORDATORIO DIARIO (evento en tu calendario: sin notificaciones de la web ni servidores)
// =====================================================================
function openReminder() {
    openSheet('<i class="fa-regular fa-bell text-mint-400"></i> Recordatorio diario', `<div class="space-y-4">
        <p class="text-sm text-neutral-300">Añade a tu calendario un aviso diario para apuntar tus comidas. Lo controlas tú: puedes cambiarlo o borrarlo desde el calendario.</p>
        <label class="block"><span class="text-xs font-bold text-neutral-400">Hora del aviso</span><input id="rm-time" type="time" value="21:00" class="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl font-bold"></label>
        <button onclick="downloadReminder()" class="w-full py-3.5 rounded-2xl bg-mint-600 hover:bg-mint-700 text-white font-extrabold"><i class="fa-solid fa-calendar-plus"></i> Añadir a mi calendario</button>
        <p class="text-[11px] text-neutral-500">Se descarga un archivo de calendario (.ics) que abre tu app de calendario.</p></div>`);
}
function downloadReminder() {
    const [h, m] = ($('rm-time').value || '21:00').split(':').map(Number);
    const d = todayISO().replace(/-/g, ''), t = `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
    const end = `${String((h + (m + 10 >= 60 ? 1 : 0)) % 24).padStart(2, '0')}${String((m + 10) % 60).padStart(2, '0')}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//nutriDL//ES', 'BEGIN:VEVENT', `UID:nutridl-${Date.now()}@nutridl`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
        `DTSTART:${d}T${t}`, `DTEND:${d}T${end}`, 'RRULE:FREQ=DAILY', 'SUMMARY:nutriDL · Apunta tus comidas de hoy', 'DESCRIPTION:Abre nutriDL y revisa tu día.', 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:nutriDL', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'nutridl-recordatorio.ics';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    closeSheet(); toast('Abre el archivo para añadirlo a tu calendario'); track('reminder'); ev('reminder_set');
}
