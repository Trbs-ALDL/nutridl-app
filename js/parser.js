// nutriDL · Entender lo que comes en lenguaje natural («200 g de pollo, un plátano y una ensalada»)
// Lo usan el registro por voz, el Coach y la foto. Siempre se muestra una confirmación antes de guardar.
'use strict';

const NUM_WORDS = {
    un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12,
    quince: 15, veinte: 20, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90,
    cien: 100, ciento: 100, doscientos: 200, doscientas: 200, trescientos: 300, trescientas: 300, cuatrocientos: 400, cuatrocientas: 400,
    quinientos: 500, quinientas: 500, medio: .5, media: .5,
};
// Unidad → gramos (null = usar la ración del alimento)
const UNIT_WORDS = [
    [/^(g|gr|grs|gramos?)$/, 'g'], [/^(kg|kilos?|kilogramos?)$/, 'kg'], [/^(ml|mililitros?)$/, 'ml'], [/^(cl|centilitros?)$/, 'cl'], [/^(l|litros?)$/, 'l'],
    [/^(vasos?)$/, 'vaso'], [/^(tazas?|tazones?|boles?|bols)$/, 'taza'], [/^(cucharadas?|cdas?)$/, 'cda'], [/^(cucharaditas?|cdtas?)$/, 'cdta'],
    [/^(latas?)$/, 'lata'], [/^(rebanadas?)$/, 'rebanada'], [/^(tostadas?)$/, 'tostada'], [/^(filetes?)$/, 'filete'], [/^(lomos?)$/, 'filete'],
    [/^(platos?)$/, 'plato'], [/^(raciones|racion|porciones|porcion|trozos?|pedazos?)$/, 'racion'], [/^(punados?)$/, 'punado'],
    [/^(piezas?|unidades?|uds?)$/, 'unidad'], [/^(lonchas?|lonchitas?)$/, 'loncha'], [/^(botellas?)$/, 'botella'], [/^(copas?)$/, 'copa'],
    [/^(canas?)$/, 'cana'], [/^(tercios?)$/, 'tercio'], [/^(botellines?)$/, 'botellin'], [/^(onzas?)$/, 'onza'], [/^(cacitos?|scoops?)$/, 'cacito'],
];
const STOP = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'al', 'a', 'en', 'mi', 'unos', 'unas', 'algo', 'poco', 'un', 'una', 'uno', 'y', 'tambien', 'hoy', 'esta', 'este', 'pues', 'luego', 'despues', 'con']);
// Lo que la gente dice → como se llama en la base
const PHRASES = [
    [/\bpechugas? de pollo\b/g, 'pechuga pollo'], [/\bfiletes? de pollo\b/g, 'pechuga pollo'], [/\bpollo a la plancha\b/g, 'pechuga pollo plancha hecha'],
    [/\bhuevos? (duros?|cocidos?|a la plancha)\b/g, 'huevo'], [/\bhuevos? fritos?\b/g, 'huevo frito'], [/\bhuevos? revueltos?\b/g, 'huevos revueltos'],
    [/\btortilla espanola\b/g, 'tortilla patatas'], [/\btortilla de patatas?\b/g, 'tortilla patatas'], [/\bcafe solo\b/g, 'cafe solo'],
    [/\bcafe\b(?! con| solo)/g, 'cafe con leche'], [/\bensalada mixta\b/g, 'ensalada'], [/\bnueces\b/g, 'nueces'], [/\bnuez\b/g, 'nueces'],
    [/\bchurros con chocolate\b/g, 'churros y chocolate a la taza'],
    [/\b(pan|tostadas?) con tomate( y aceite)?\b/g, 'pantomate'], [/\bpan tostado\b/g, 'pan'], [/\bpatatas fritas de bolsa\b/g, 'patatas fritas bolsa'], [/\bpatatas fritas\b(?! bolsa)/g, 'patatas fritas caseras'],
    [/\b(bocadillo|bocata) de jamon( serrano)?\b/g, 'bocadillo jamon serrano'], [/\b(bocadillo|bocata) de (?!jamon)/g, 'pan barra y '],
    [/\bbocadillo\b(?! jamon)/g, 'pan barra'], [/\bbocata\b/g, 'pan barra'], [/\bcocacola\b|\bcoca cola\b|\bcoca-cola\b/g, 'coca-cola'],
    [/\bproteina en polvo\b|\bbatido de proteinas?\b/g, 'whey'], [/\byogures?\b/g, 'yogur'], [/\byogurt\b/g, 'yogur'],
];
// Palabra sola → el alimento que casi todo el mundo quiere decir («pan» = pan de barra, «atún» = lata al natural…)
const CANON = { pollo: 'pollo', pechuga: 'pollo', arroz: 'arroz', pasta: 'pasta', macarrones: 'pasta', spaghetti: 'pasta', pan: 'pan', leche: 'leche', yogur: 'yognat',
    atun: 'atun', huevo: 'huevo', aceite: 'aove', patata: 'patata', ternera: 'ternera', galleta: 'galletas', galletas: 'galletas', cerveza: 'cerveza', vino: 'vino',
    cafe: 'cafeleche', salmon: 'salmon', merluza: 'merluza', jamon: 'jamon', pavo: 'pavo', cerdo: 'cerdo', lomo: 'cerdo', avena: 'avena', ensalada: 'ensalada',
    chocolate: 'choco', zumo: 'zumo', hamburguesa: 'hamburguesacomp', tostada: 'pan', sushi: 'sushi', kebab: 'kebab', queso: 'burgos', tortilla: 'tortilla', lentejas: 'lentguisadas', garbanzos: 'garbanzos', fruta: 'manzana', pizza: 'pizza' };
// Palabras que la base escribe de otra forma
const ALIAS_W = { espaguetis: 'espaguetis', spaghetti: 'espaguetis', macarrones: 'macarrones', pasta: 'espaguetis', croissant: 'cruasan', croissants: 'cruasan', donut: 'donut', donuts: 'donut', tostada: 'pan', tostadas: 'pan', hamburguesas: 'hamburguesa', bolonesa: 'bolonesa' };
// Cosas que se comen de varias en varias: sin cantidad, una ración típica (no una sola pieza)
const TYPICAL_N = { sushi: 10, nigiri: 8, gyozas: 6, croquetas: 5, churros: 4, falafel: 5, tacos: 2, empanadilla: 3, montadito: 2, galletas: 4, galletachoco: 3, alitas: 1, nuggets: 1, rollito: 2, boquerones: 1, almendras: 20, pancakes: 3, tortitas: 3 };
const COOKED_ALT = { arroz: 'arrozcocido', arrozint: 'arrozintcocido', pasta: 'pastacocida', pastaint: 'pastaintcocida', pollo: 'pollopl', pavo: 'pavopl', ternera: 'terneraplancha', salmon: 'salmonpl', merluza: 'merluzapl', gambas: 'gambaspl', patata: 'patatacocida', boniato: 'boniatoasado', quinoa: 'quinoacocida', cuscus: 'cuscuscocido', brocoli: 'brocolicocido' };
const SLOT_HINTS = [[/\b(desayun\w*)\b/, 'B'], [/\b(almuerz\w*|media manana)\b/, 'M'], [/\b(merend\w*|merienda)\b/, 'S'], [/\b(cen\w*)\b/, 'D'], [/\b(comida|al mediodia)\b/, 'L']];

const stem = w => w.length > 4 && w.endsWith('es') && !/[aeiou]es$/.test(w.slice(-3)) ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w;
function tokMatch(t, w) {
    if (w.startsWith(t)) return 3;
    const a = stem(t), b = stem(w);
    if (a === b || (a.length >= 4 && b.startsWith(a)) || (b.length >= 4 && a.startsWith(b))) return 2.5;
    return 0;
}
// Los alimentos que más se parecen a lo escrito (el primero es el elegido, el resto son alternativas)
function matchFoods(q, max = 6) {
    const raw = norm(q);
    const wantsCooked = /\b(cocid|hech|plancha|asad|cocinad)/.test(raw);
    const toks = raw.split(/[^a-z0-9ñ%-]+/).filter(t => t && !STOP.has(t));
    const alt = t => [t, (typeof SYN !== 'undefined' && SYN[t]) || t, ALIAS_W[t] || t];
    if (!toks.length) return [];
    const freq = typeof foodFreq === 'function' ? foodFreq() : {};
    const res = [];
    for (const f of FOODS) {
        const words = norm(`${f.name} ${f.brand || ''} ${f.alias || ''}`).split(/[^a-z0-9ñ%-]+/).filter(Boolean);
        let score = 0, hits = 0;
        toks.forEach((t, i) => {
            const best = Math.max(0, ...alt(t).flatMap(a => words.map(w => tokMatch(a, w))));
            if (best) { score += best * (i === 0 ? 1.4 : 1); hits++; } else score -= 2;
        });
        if (!hits || !alt(toks[0]).some(a => words.some(w => tokMatch(a, w))) && hits < 2) continue;
        const nameWords = norm(f.name).split(/[^a-z0-9ñ%-]+/).filter(w => w && !STOP.has(w));
        if (tokMatch(toks[0], nameWords[0] || '')) score += 2;
        score -= Math.max(0, nameWords.length - hits) * .35;
        if (!f.brand) score += 1.2; else if (toks.some(t => norm(f.brand).includes(t))) score += 2;
        if (f.custom) score += .5;
        const canon = CANON[toks[0]] || CANON[stem(toks[0])];
        if (canon === f.id) score += toks.length === 1 ? 6 : 2.5;
        score += Math.min(2, (freq[f.id] || 0) * .5);
        const cookedName = /cocid|hech|plancha|asad/.test(norm(f.name));
        if (wantsCooked && cookedName) score += 2.5; else if (!wantsCooked && cookedName && /\b(ya cocid)/.test(norm(f.name))) score -= .5;
        res.push({ f, score });
    }
    return res.sort((a, b) => b.score - a.score || a.f.name.length - b.f.name.length).slice(0, max).map(x => x.f);
}

function unitGrams(f, unit, n) {
    const lab = re => [f.u, f.serv].find(u => u && re.test(norm(u[1])));
    const byLabel = re => { const u = lab(re); return u ? u[0] : null; };
    switch (unit) {
        case 'g': case 'ml': return n;
        case 'kg': case 'l': return n * 1000;
        case 'cl': return n * 10;
        case 'vaso': return n * (byLabel(/vaso/) || 250);
        case 'taza': return n * (f.ml ? 250 : /avena|cereal|muesli/.test(f.id) ? 50 : 250);
        case 'cda': return n * (byLabel(/cucharada|cda/) || (f.cat === 'grasa' && f.f > 90 ? 10 : 15));
        case 'cdta': return n * (byLabel(/cucharadita/) || 5);
        case 'lata': return n * (byLabel(/lata/) || (f.ml ? 330 : 80));
        case 'rebanada': return n * (byLabel(/rebanada/) || 30);
        case 'tostada': return n * (byLabel(/tostada/) || 40);
        case 'filete': return n * (byLabel(/filete|lomo/) || 125);
        case 'plato': return n * (byLabel(/plato/) || (f.raw && f.cook ? 80 : 300));
        case 'racion': return n * ((f.serv && f.serv[0]) || (f.u && f.u[0]) || f.fixed || 100);
        case 'punado': return n * (byLabel(/punado/) || 30);
        case 'unidad': return n * ((f.u && f.u[0]) || (f.serv && f.serv[0]) || 100);
        case 'loncha': return n * (byLabel(/loncha/) || 15);
        case 'botella': return n * (byLabel(/botella/) || 500);
        case 'copa': return n * (byLabel(/copa/) || 150);
        case 'cana': return n * 200;
        case 'tercio': return n * 330;
        case 'botellin': return n * 250;
        case 'onza': return n * (byLabel(/onza/) || 10);
        case 'cacito': return n * (byLabel(/cacito/) || 30);
    }
    return null;
}
function readQty(words) {
    // Devuelve { n, unit, rest } a partir de las primeras palabras
    let i = 0, n = null, unit = null;
    if (words[0] === 'un' && words[1] === 'par' && words[2] === 'de') { n = 2; i = 3; }
    else if (/^\d+(\.\d+)?$/.test(words[0] || '')) { n = parseFloat(words[0]); i = 1; }
    else if (/^\d+(\.\d+)?(g|gr|kg|ml|l)$/.test(words[0] || '')) { const m = words[0].match(/^(\d+(?:\.\d+)?)([a-z]+)$/); n = parseFloat(m[1]); words.splice(0, 1, m[1], m[2]); i = 1; }
    else if (NUM_WORDS[words[0]] != null) {
        n = NUM_WORDS[words[0]]; i = 1;
        // «ciento cincuenta», «doscientos cincuenta»
        if (n >= 100 && NUM_WORDS[words[1]] != null && NUM_WORDS[words[1]] < 100) { n += NUM_WORDS[words[1]]; i = 2; }
        if (words[i] === 'y' && (words[i + 1] === 'medio' || words[i + 1] === 'media')) { n += .5; i += 2; }
    }
    if (n != null) {
        const u = UNIT_WORDS.find(([re]) => re.test(words[i] || ''));
        if (u) { unit = u[1]; i++; }
        if (words[i] === 'de') i++;
    }
    return { n, unit, rest: words.slice(i) };
}
function parseOne(seg) {
    let words = seg.split(/\s+/).filter(Boolean);
    let q = readQty(words);
    // «pollo 200 g» / «arroz 100 gramos»
    if (q.n == null) {
        const m = seg.match(/^(.*?)\s+(\d+(?:\.\d+)?)\s*(g|gr|gramos?|ml|kg|kilos?)?$/);
        if (m && m[1]) { q = { n: parseFloat(m[2]), unit: m[3] ? (/^k/.test(m[3]) ? 'kg' : m[3] === 'ml' ? 'ml' : 'g') : null, rest: m[1].split(/\s+/) }; }
    }
    let name = q.rest.join(' ').trim();
    // «3 tostadas» → pan (40 g cada una); «2 yogures» → yogur
    if (!name && q.unit === 'tostada') name = 'pan barra';
    if (!name && q.unit) { name = words[words.length - 1]; q.unit = null; }
    if (!name) return null;
    const cands = matchFoods(name);
    if (!cands.length) return { text: seg, food: null };
    let f = cands[0];
    if (/\b(cocid|hech)/.test(name) && COOKED_ALT[f.id] && getFood(COOKED_ALT[f.id])) f = getFood(COOKED_ALT[f.id]);
    let g, est = false, n = null, u = null;
    if (q.n != null && q.unit) g = unitGrams(f, q.unit, q.n);
    else if (q.n != null && !q.unit) {
        const cu = f.u || (f.serv && !/racion/.test(norm(f.serv[1])) ? f.serv : null);
        // «medio aguacate»: la ración es medio, así que la pieza entera vale el doble
        if (cu && q.n < 20) { const half = /^medi/.test(norm(cu[1])); g = (half ? cu[0] * 2 : cu[0]) * q.n; n = q.n; u = half ? null : cu; }
        else if (q.n >= 20) g = q.n;
        else { const d = defaultPortion(f); g = d.g * q.n; est = true; }
    } else {
        const d = defaultPortion(f), k = TYPICAL_N[f.id] || 1; g = d.g * k; est = true;
        if (d.unit.key !== 'g') { n = d.n * k; u = [d.unit.g, d.unit.label, d.unit.plural]; }
    }
    if (!g || g <= 0 || g > 5000) return { text: seg, food: null };
    if (!u && f.u && Math.abs(g / f.u[0] - Math.round(g / f.u[0])) < .01 && g >= f.u[0]) { u = f.u; n = Math.round(g / f.u[0]); }
    const alts = [COOKED_ALT[f.id], ...cands.map(x => x.id)].filter((id, i, a) => id && id !== f.id && getFood(id) && a.indexOf(id) === i).slice(0, 5);
    return { text: seg, food: f, g: Math.round(g * 10) / 10, n, u, est, alts };
}
// Texto libre → lista de alimentos con cantidades
function parseFoodText(text) {
    let s = norm(String(text || '')).replace(/(\d),(\d)/g, '$1.$2').replace(/(\d)\s*(g|gr|ml|kg)\b/g, '$1 $2');
    let slot = null;
    for (const [re, k] of SLOT_HINTS) if (re.test(s)) { slot = k; break; }
    s = s.replace(/\b(tengo|tenemos|hay|me queda|me quedan|en (la|mi) nevera|en casa)\b/g, ' , ')
        .replace(/\b(me he|he|hemos|acabo de|voy a|quiero|para)\s+(comido|tomado|bebido|desayunado|cenado|merendado|almorzado|picado|comer|tomar|cenar|desayunar|merendar)\b/g, ' , ')
        .replace(/\b(de|en el|en la|para)\s+(desayuno|comida|cena|merienda|almuerzo)\b/g, ' , ')
        .replace(/\b(desayuno|comida|cena|merienda|almuerzo|hoy|esta manana|esta tarde|esta noche|anoche)\b\s*:?/g, ' , ');
    PHRASES.forEach(([re, rep]) => { s = s.replace(re, rep); });
    const parts = s.split(/\s*(?:,|;|\+|\.\s|\n|\by\b|\be\b|\bmas\b|\bademas\b|\bjunto con\b|\btambien\b)\s*/).map(x => x.trim()).filter(Boolean);
    const items = [], unknown = [];
    for (const part of parts) {
        // «pollo con arroz» = dos cosas; «café con leche» o «arroz con leche» = una
        const whole = /\bcon\b/.test(part) ? parseOne(part) : null;
        const wn = whole && whole.food ? norm(whole.food.name).replace(/\s*\(.*?\)/g, '') : '';
        // Solo si el orden coincide: «arroz con pollo» es el plato; «pollo con arroz» son dos cosas
        const parts2 = wn.split(' con '), keys = parts2.map(w => w.trim().split(' ').pop()), pos = keys.map(k => part.indexOf(k));
        const keepWhole = /[a-z] con [a-z]/.test(wn) && pos.every(p => p >= 0) && pos.every((p, i) => !i || p > pos[i - 1]);
        const pieces = keepWhole ? [part] : part.split(/\s+con\s+/);
        for (const pc of pieces) {
            const r = parseOne(pc.trim());
            if (!r) continue;
            if (r.food) items.push(r); else if (r.text.replace(/\W/g, '').length > 2) unknown.push(r.text);
        }
    }
    return { items, unknown, slot };
}
// De un plato servido (foto) se ven gramos ya cocinados: se usa el alimento «ya cocido» si existe
const cookedFood = f => (COOKED_ALT[f.id] && getFood(COOKED_ALT[f.id])) || f;
