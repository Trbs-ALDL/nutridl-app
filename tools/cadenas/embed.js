// 3.6 · Mete la comida rápida (valores OFICIALES de cada cadena en España) en js/data/foods.js, entre // <cadenas> y // </cadenas>.
// Fuentes: mcdonalds.json (mcdonalds.es), burgerking.json (bk_fetch.js), kfc.json (PDF oficial de kfc.es).
// Regla de siempre: kcal ≈ 4·P + 4·HC + 9·G + 2·fibra (±15 % o ±10 kcal); lo que no cuadra no entra.
// Los ids salen de la cadena + el nombre: no cambiar los nombres ya publicados (los diarios guardan el id).
// Uso: node tools/cadenas/embed.js
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, '..', '..', 'js', 'data', 'foods.js');
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[®™*]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const r1 = v => Math.round(v * 10) / 10;
const rows = [], skip = [];
const add = (brand, name, kcal, p, c, sug, f, fib, g, unit, s1, s2, src) => {
    const calc = 4 * p + 4 * c + 9 * f + 2 * (fib || 0);
    if (!(kcal >= 0) || Math.abs(calc - kcal) > Math.max(10, kcal * 0.15)) { skip.push(`${brand} · ${name}`); return; }
    const id = 'k_' + slug(brand).slice(0, 10) + '_' + slug(name).slice(0, 32);
    if (rows.some(r => r.id === id)) { skip.push(`${brand} · ${name} (repetido)`); return; }
    rows.push({ id, name, brand, kcal: Math.round(kcal), p: r1(p), c: r1(c), f: r1(f), fib: r1(fib || 0), sug: sug == null ? null : r1(Math.min(sug, c)), serv: g ? [g, s1 || 'ración', s2 || 'raciones'] : null, ml: unit === 'ml' ? 1 : 0, src });
};
const mc = JSON.parse(fs.readFileSync(path.join(__dirname, 'mcdonalds.json'), 'utf8'));
mc.productos.forEach(([n, k, p, c, s, f, fib, g, u, s1, s2]) => add("McDonald's", n, k, p, c, s, f, fib, g, u, s1, s2, 'mcdonalds.es'));
JSON.parse(fs.readFileSync(path.join(__dirname, 'burgerking.json'), 'utf8'))
    .forEach(b => add('Burger King', b.label, b.kcal, b.p, b.c, b.sug, b.f, b.fib, b.serv[0], b.ml ? 'ml' : 'g', b.serv[1], b.serv[2], 'burgerking.es'));
const kfc = JSON.parse(fs.readFileSync(path.join(__dirname, 'kfc.json'), 'utf8'));
kfc.productos.forEach(([n, k, p, c, s, f, g, s1, s2]) => add('KFC', n, k, p, c, s, f, 0, g, 'g', s1, s2, 'kfc.es (PDF oficial)'));

const block = `// <cadenas> (lo genera tools/cadenas/embed.js · valores oficiales publicados por cada cadena en España · ${new Date().toISOString().slice(0, 10)})
const CHAIN_FOODS = ${JSON.stringify(rows.map(r => [r.id, r.name, r.brand, r.kcal, r.p, r.c, r.f, r.fib, r.sug, r.serv, r.ml, r.src]))};
CHAIN_FOODS.forEach(([id, name, brand, kcal, p, c, f, fib, sug, serv, ml, src]) => {
    const role = p * 4 >= Math.max(c * 4, f * 9) ? 'protein' : f * 9 > c * 4 ? 'fat' : 'carb';
    FOODS.push({ id, name, brand, cat: 'marca', fast: 1, role, meals: 'BSLD', p, f, c, fib, kcal, min: 0, max: 0, flags: '', diaryOnly: 1, ...(serv ? { serv } : {}), ...(sug != null ? { sug } : {}), ...(ml ? { ml: 1 } : {}), src });
});
// </cadenas>
`;
let js = fs.readFileSync(file, 'utf8');
const re = /\/\/ <cadenas>[\s\S]*?\/\/ <\/cadenas>\n/;
js = re.test(js) ? js.replace(re, () => block) : js.replace('// <marcas>', () => block + '// <marcas>');
fs.writeFileSync(file, js);
console.log(rows.length, 'productos de cadenas ·', skip.length, 'fuera:', skip.join(' | '));
