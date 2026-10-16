// 3.6 · Burger King España: valores nutricionales OFICIALES de su carta (los que publica su web, burgerking.es).
// Se leen del servicio público de contenidos que usa su propia web (Sanity, sin claves) y se pasan a «por 100 g».
// Filtros: todos los valores presentes, peso de la ración, kcal ≈ 4·P + 4·HC + 9·G + 2·fibra (±15 %), sin menús ni packs
// ni promociones, y sin productos repetidos (mismos valores = mismo producto con otro nombre comercial).
// Uso: node tools/cadenas/bk_fetch.js  → tools/cadenas/burgerking.json
const fs = require('fs'), path = require('path');
const URL = 'https://czqk28jt.apicdn.sanity.io/v2023-08-01/graphql/prod_bk_es/gen3?query=';
const Q = '{allItem(limit:2000){_id name{es} nutrition{calories carbohydrates fat proteins sugar fiber weight}}}';
const SKIP = /men[uú]|pack|combo|cubo|promo|oferta|ahorro|family|miércoles|miercoles|lunes|martes|jueves|viernes|2x|dobles|\(\+|\+ |sin pan|personaliza|bolsa|regalo|happy|king jr|caja|bucket|para compartir|xxl/i;
const r1 = v => Math.round(v * 10) / 10;
(async () => {
    const j = await (await fetch(URL + encodeURIComponent(Q))).json();
    // Valores idénticos en productos que no son el mismo = datos copiados por error en su web: se descartan todos
    const base = s => s.toLowerCase().replace(/[®™*]/g, '').replace(/\(.*?\)|x\d+|\d+ ?uds?\.?|peque[ñn]as?|medianas?|grandes?|gigantes?/g, '').replace(/\s+/g, ' ').trim();
    const vecOf = n => [n.calories, n.proteins, n.carbohydrates, n.fat].map(v => Math.round(v)).join('|');
    const byVec = {};
    j.data.allItem.forEach(x => { const n = x.nutrition; if (n && n.calories != null && x.name && x.name.es) (byVec[vecOf(n)] = byVec[vecOf(n)] || new Set()).add(base(x.name.es)); });
    const seenVec = new Set(), seenName = new Set(), out = [], why = { incompleto: 0, menu: 0, kcal: 0, repetido: 0, copiado: 0 };
    for (const x of j.data.allItem) {
        const n = x.nutrition, name = ((x.name && x.name.es) || '').replace(/\s+/g, ' ').trim();
        if (!n || !name || [n.calories, n.carbohydrates, n.fat, n.proteins, n.weight].some(v => v == null) || n.weight <= 0) { why.incompleto++; continue; }
        if (SKIP.test(name)) { why.menu++; continue; }
        if (byVec[vecOf(n)].size > 1) { why.copiado++; continue; }
        const k = n.weight / 100, kcal = n.calories / k, p = n.proteins / k, c = n.carbohydrates / k, f = n.fat / k, fib = (n.fiber || 0) / k, sug = n.sugar != null ? n.sugar / k : null;
        // Como manda la norma europea, BK declara los hidratos ya SIN la fibra (comprobado: error medio 0,4 % así, 3,1 % restándola)
        const cAv = c;
        if (kcal > 950 || Math.abs(4 * p + 4 * cAv + 9 * f + 2 * fib - kcal) > Math.max(10, kcal * 0.15)) { why.kcal++; continue; }
        const vec = [kcal, p, c, f].map(v => Math.round(v)).join('|');
        const key = name.toLowerCase();
        if (seenVec.has(vec) || seenName.has(key)) { why.repetido++; continue; }
        seenVec.add(vec); seenName.add(key);
        const drink = /ml\b|bebida|coca|fanta|sprite|aquarius|nestea|agua|zumo|caf[eé]|batido|shake|monster|cerveza|t[eé] /i.test(name);
        out.push({ brand: 'Burger King', label: name, kcal: Math.round(kcal), p: r1(p), c: r1(cAv), f: r1(f), fib: r1(fib), sug: sug == null ? null : r1(Math.min(sug, cAv)), serv: [Math.round(n.weight), 'ración', 'raciones'], ml: drink ? 1 : 0, src: 'burgerking.es (información nutricional oficial)' });
    }
    out.sort((a, b) => a.label.localeCompare(b.label, 'es'));
    fs.writeFileSync(path.join(__dirname, 'burgerking.json'), JSON.stringify(out, null, 1));
    console.log(out.length, 'productos ·', why);
})();
