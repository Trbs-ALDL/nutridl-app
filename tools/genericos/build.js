// Enlaza una lista (lista.js o lista_platos.js) con la base del USDA y escribe el JSON para embed.js.
// · Genéricos: node tools/genericos/build.js <sr.json>                        (SR Legacy → usda.json)
// · Platos:    node tools/genericos/build.js <fndds.json> lista_platos.js platos.json <fndds_portions.json>
// Hidratos = «por diferencia» − fibra (criterio de las etiquetas europeas); kcal = la oficial del USDA.
// En los platos, la ración en gramos es la «ración típica» de FNDDS (Quantity not specified).
const fs = require('fs'), path = require('path');
const SR = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const LIST = require('./' + (process.argv[3] || 'lista.js'));
const OUT = process.argv[4] || 'usda.json';
const PORT = process.argv[5] ? JSON.parse(fs.readFileSync(process.argv[5], 'utf8')) : null;
const byDesc = new Map(SR.map(x => [x.d.toLowerCase(), x]));
const r1 = v => Math.round(v * 10) / 10;
const out = [], miss = [];
for (const [id, name, cat, desc, servIn, flags] of LIST) {
    const x = byDesc.get(desc.toLowerCase());
    if (!x) {
        const head = desc.toLowerCase().split(',').slice(0, 2).join(',');
        miss.push(`${id}: «${desc}»\n      parecidos: ${SR.filter(s => s.d.toLowerCase().startsWith(head)).slice(0, 6).map(s => s.d).join(' | ')}`);
        continue;
    }
    let serv = servIn;
    if (PORT && typeof servIn[0] === 'string') {
        const P = (PORT[x.d] || []).filter(p => p[1] > 0);
        const typical = P.find(p => /quantity not specified/i.test(p[0])) || P.find(p => /^1 /.test(p[0])) || P[0];
        if (!typical) { miss.push(`${id}: sin ración oficial`); continue; }
        serv = [Math.round(typical[1]), servIn[0], servIn[1]];
    }
    const fib = x.fib || 0, c = Math.max(0, (x.c || 0) - fib);
    out.push({ id, name, cat, fdc: x.id, usda: x.d, kcal: Math.round(x.kcal), p: r1(x.p), f: r1(x.f), c: r1(c), fib: r1(fib), alc: r1(x.alc || 0), sug: x.sug != null ? r1(Math.min(x.sug, c)) : null, serv, flags });
}
fs.writeFileSync(path.join(__dirname, OUT), JSON.stringify(out, null, 1));
console.log(out.length, 'enlazados ·', miss.length, 'sin encontrar');
miss.forEach(m => console.log(' -', m));
