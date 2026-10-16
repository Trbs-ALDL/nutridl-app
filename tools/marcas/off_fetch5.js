// 3.6 · Proteínas y despensa muy usadas en España (para marcas_v5.json). Mismo buscador que off_fetch3.js.
// Uso: node tools/marcas/off_fetch5.js   (pausa de 3 s entre páginas) → cache_off/v5_<marca>_p<n>.json
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const JOBS = [['myprotein', 3], ['hsn', 2], ['prozis', 3], ['optimum-nutrition', 1], ['bulk', 1], ['amix', 1], ['nutella', 1], ['nocilla', 1], ['cola-cao', 1], ['nesquik', 1],
    ['bonne-maman', 1], ['hero', 1], ['helios', 1], ['la-vieja-fabrica', 1], ['st-dalfour', 1], ['quaker', 1], ['kellogg-s', 2], ['oreo', 1], ['barilla', 1], ['president', 1],
    ['philadelphia', 1], ['arla', 1], ['oikos', 1], ['nestle', 2], ['lindt', 1], ['valor', 1], ['milka', 1], ['isabel', 1], ['el-caserio', 1], ['hacendado', 0]];
const FIELDS = 'code,product_name,product_name_es,brands,nutriments,nutrition_data_per,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags,categories_tags';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    const todo = [];
    JOBS.forEach(([b, n]) => { for (let i = 1; i <= n; i++) todo.push([b, i]); });
    for (const [b, i] of todo) {
        const file = path.join(dir, `v5_${b}_p${i}.json`);
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
