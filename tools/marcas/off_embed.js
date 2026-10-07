// Mete marcas.json (generado por off_build.js) en js/data/foods.js, entre los marcadores // <marcas> y // </marcas>
// Uso: node tools/marcas/off_embed.js
// Proceso completo para añadir productos: off_fetch.js → off_fetch2.js → off_build.js (valida kcal y rangos) → off_embed.js
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, '..', '..', 'js', 'data', 'foods.js');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, 'marcas.json'), 'utf8'));
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const seen = new Set();
const rows = M.map(m => {
    let id = 'm_' + slug(m.brand).slice(0, 10) + '_' + slug(m.label).slice(0, 24);
    while (seen.has(id)) id += '2';
    seen.add(id);
    // [id, nombre, marca, kcal, P, HC, G, fibra, [ración g, nombre, plural], emoji, ml, crudo, código de barras]
    return JSON.stringify([id, m.label, m.brand, m.kcal, m.p, m.c, m.f, m.fib, m.serv, m.em, m.ml, m.raw, m.off]);
});
const block = `// <marcas> (lo genera tools/marcas/off_embed.js · datos: Open Food Facts, licencia ODbL · ${new Date().toISOString().slice(0, 10)})
const BRAND_FOODS = [
    ${rows.join(',\n    ')}
];
BRAND_FOODS.forEach(([id, name, brand, kcal, p, c, f, fib, serv, em, ml, raw, off]) => {
    const role = p * 4 >= Math.max(c * 4, f * 9) ? 'protein' : f * 9 > c * 4 ? 'fat' : 'carb';
    FOODS.push({ id, name, brand, cat: 'marca', role, meals: 'BSLD', p, f, c, fib, kcal, min: 0, max: 0, flags: '', diaryOnly: 1, serv, em, ...(ml ? { ml: 1 } : {}), ...(raw ? { raw: 1 } : {}), off });
});
// </marcas>`;
let js = fs.readFileSync(file, 'utf8');
const re = /\/\/ <marcas>[\s\S]*?\/\/ <\/marcas>/;
if (!re.test(js)) { console.log('No están los marcadores // <marcas> … // </marcas> en js/data/foods.js'); process.exit(1); }
fs.writeFileSync(file, js.replace(re, () => block));
console.log(`${rows.length} productos de marca incluidos en js/data/foods.js`);
