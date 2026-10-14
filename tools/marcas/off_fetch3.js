// 3.ª pasada (3.4): muchas más páginas de Hacendado y de marcas muy usadas en España, para la ampliación a +500 alimentos.
// Usa el buscador nuevo de Open Food Facts (search.openfoodfacts.org); el antiguo /api/v2/search suele dar 503.
// Uso: node tools/marcas/off_fetch3.js   (pausa de 3 s entre páginas)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const JOBS = [['hacendado', 15], ['milbona', 2], ['carrefour', 2], ['dia', 2], ['eroski', 1], ['elpozo', 1], ['campofrio', 1], ['pascual', 1], ['central-lechera-asturiana', 1], ['danone', 2], ['alpro', 1], ['calvo', 1], ['gallo', 1], ['bimbo', 1], ['kaiku', 1]];
const FIELDS = 'code,product_name,product_name_es,brands,nutriments,nutrition_data_per,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags,categories_tags';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    const todo = [];
    JOBS.forEach(([b, n]) => { for (let i = 1; i <= n; i++) todo.push([b, i]); });
    for (const [b, i] of todo) {
        const file = path.join(dir, `v3_${b}_p${i}.json`);
        if (fs.existsSync(file)) continue;
        const url = `https://search.openfoodfacts.org/search?q=brands_tags:${b}&sort_by=-unique_scans_n&page=${i}&page_size=100&fields=${FIELDS}`;
        let ok = false;
        for (let tries = 0; tries < 4 && !ok; tries++) {
            try {
                const r = await fetch(url, { headers: { 'User-Agent': 'NutriDL/3.4 (app de nutricion sin animo de lucro)' } });
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
