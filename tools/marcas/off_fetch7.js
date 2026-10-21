// 3.15 · Los productos MÁS ESCANEADOS en España en Open Food Facts, de cualquier marca (para marcas_v7.json).
// Es la mejor medida pública de lo que la gente apunta de verdad en las apps de calorías.
// Uso: node tools/marcas/off_fetch7.js [páginas=6]   (100 productos por página, pausa de 7 s: límite de OFF)
//      → cache_off/v7_<marca>_p1.json (agrupados por marca, para off_build3.js v7)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const PAGES = +process.argv[2] || 6;
const FIELDS = 'code,product_name,product_name_es,brands,brands_tags,nutriments,nutrition_data_per,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags,categories_tags';
const UA = 'nutriDL/3.15 (aannggeelltrabajos@gmail.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const slug = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
async function page(n) {
    const url = `https://world.openfoodfacts.org/api/v2/search?countries_tags_en=spain&sort_by=unique_scans_n&page_size=100&page=${n}&fields=${FIELDS}`;
    for (let intento = 1; intento <= 4; intento++) {
        try {
            const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(40000) });
            const t = await r.text();
            if (t.trim().startsWith('{')) return JSON.parse(t).products || [];
            console.log(`  página ${n}: el servidor no respondió bien (intento ${intento})`);
        } catch (e) { console.log(`  página ${n}: ${e.message} (intento ${intento})`); }
        await sleep(15000 * intento);
    }
    return null;
}
(async () => {
    const all = [];
    for (let n = 1; n <= PAGES; n++) {
        const p = await page(n);
        if (!p) { console.log(`Página ${n} sin datos: sigo con lo que hay`); continue; }
        all.push(...p); console.log(`página ${n}: ${p.length} productos`);
        await sleep(7000);
    }
    fs.writeFileSync(path.join(dir, 'v7__todo.json'), JSON.stringify(all)); // copia en bruto por si algo falla después
    const byBrand = {};
    for (const p of all) { const b = slug((p.brands_tags && p.brands_tags[0]) || String(p.brands || '').split(',')[0]).replace(/^xx-/, '') || 'sin-marca'; (byBrand[b] = byBrand[b] || []).push(p); }
    for (const f of fs.readdirSync(dir).filter(f => f.startsWith('v7_') && f !== 'v7__todo.json')) fs.unlinkSync(path.join(dir, f)); // la tanda v7 se rehace entera
    for (const [b, list] of Object.entries(byBrand)) fs.writeFileSync(path.join(dir, `v7_${b}_p1.json`), JSON.stringify(list));
    console.log(`${all.length} productos de ${Object.keys(byBrand).length} marcas guardados en cache_off/v7_*`);
})();
