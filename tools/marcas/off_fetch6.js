// 3.6 · Bebidas muy usadas en España (para marcas_v6.json): refrescos, isotónicas, tés fríos, energéticas y zumos.
// Uso: node tools/marcas/off_fetch6.js   (pausa de 3 s entre páginas) → cache_off/v6_<marca>_p<n>.json
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const JOBS = [['coca-cola', 2], ['aquarius', 1], ['nestea', 1], ['fanta', 1], ['sprite', 1], ['pepsi', 1], ['seven-up', 1], ['red-bull', 1], ['monster-energy', 1], ['burn', 1], ['kas', 1], ['schweppes', 1], ['trina', 1], ['lipton', 1], ['fuze-tea', 1], ['powerade', 1], ['isostar', 1], ['gatorade', 1], ['don-simon', 1], ['granini', 1], ['zumosol', 1], ['minute-maid', 1], ['tropicana', 1], ['casera', 1], ['la-casera', 1], ['bifrutas', 1], ['sunny-delight', 1], ['vitaminwater', 1], ['starbucks', 1], ['kaiku-caffe-latte', 1]];
const FIELDS = 'code,product_name,product_name_es,brands,nutriments,nutrition_data_per,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags,categories_tags';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    const todo = [];
    JOBS.forEach(([b, n]) => { for (let i = 1; i <= n; i++) todo.push([b, i]); });
    for (const [b, i] of todo) {
        const file = path.join(dir, `v6_${b}_p${i}.json`);
        if (fs.existsSync(file)) continue;
        const url = `https://search.openfoodfacts.org/search?q=brands_tags:${b}&sort_by=-unique_scans_n&page=${i}&page_size=100&fields=${FIELDS}`;
        let ok = false;
        for (let tries = 0; tries < 4 && !ok; tries++) {
            try {
                const r = await fetch(url, { headers: { 'User-Agent': 'NutriDL/3.6 (app de nutricion sin animo de lucro)' } });
                const txt = await r.text();
                if (!r.ok || !txt.startsWith('{')) { console.log(b, i, 'espera', r.status); await sleep(15000); continue; }
                const j = JSON.parse(txt);
                fs.writeFileSync(file, JSON.stringify(j.hits || []));
                console.log(b, 'página', i, (j.hits || []).length);
                ok = true;
            } catch (e) { console.log(b, i, 'error', e.message); await sleep(10000); }
        }
        await sleep(3000);
    }
    console.log('FIN');
})();
