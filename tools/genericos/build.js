// Enlaza tools/genericos/lista.js con la base USDA SR Legacy (sr.json, generado del CSV oficial) y escribe usda.json.
// Hidratos = «por diferencia» − fibra (criterio de las etiquetas europeas); kcal = la oficial del USDA.
// Uso: node tools/genericos/build.js <ruta a sr.json>
const fs = require('fs'), path = require('path');
const SR = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const byDesc = new Map(SR.map(x => [x.d.toLowerCase(), x]));
const LIST = require('./lista.js');
const r1 = v => Math.round(v * 10) / 10;
const out = [], miss = [];
for (const [id, name, cat, desc, serv, flags] of LIST) {
    const x = byDesc.get(desc.toLowerCase());
    if (!x) {
        const head = desc.toLowerCase().split(',').slice(0, 2).join(',');
        miss.push(`${id}: «${desc}»\n      parecidos: ${SR.filter(s => s.d.toLowerCase().startsWith(head)).slice(0, 6).map(s => s.d).join(' | ')}`);
        continue;
    }
    const fib = x.fib || 0, c = Math.max(0, (x.c || 0) - fib);
    out.push({ id, name, cat, fdc: x.id, usda: x.d, kcal: Math.round(x.kcal), p: r1(x.p), f: r1(x.f), c: r1(c), fib: r1(fib), alc: r1(x.alc || 0), serv, flags });
}
fs.writeFileSync(path.join(__dirname, 'usda.json'), JSON.stringify(out, null, 1));
console.log(out.length, 'enlazados ·', miss.length, 'sin encontrar');
miss.forEach(m => console.log(' -', m));
