// Páginas extra de las marcas con muchos productos (Hacendado, Danone, Nestlé…) para encontrar los más usados
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off');
const JOBS = [['hacendado', 10], ['danone', 3], ['nestle', 3], ['kellogg-s', 2], ['myprotein', 3], ['prozis', 2], ['alpro', 2], ['lindt', 2], ['coca-cola', 2], ['milbona', 2]];
const FIELDS = 'code,product_name,product_name_es,brands,nutriments,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    const todo = [];
    JOBS.forEach(([b, n]) => { for (let i = 2; i <= n; i++) todo.push([b, i]); });
    // reintentar las marcas que fallaron en la primera pasada
    ['monster-energy', 'elpozo', 'cola-cao', 'isabel', 'kaiku', 'el-caserio', 'carbonell', 'brillante', 'milbona', 'pilos', 'arla'].forEach(b => { if (!fs.existsSync(path.join(dir, b + '.json'))) todo.unshift([b, 1]); });
    for (const [b, i] of todo) {
        const file = path.join(dir, i === 1 ? `${b}.json` : `${b}_p${i}.json`);
        if (fs.existsSync(file)) continue;
        const url = `https://world.openfoodfacts.org/api/v2/search?brands_tags=${b}&sort_by=unique_scans_n&page=${i}&page_size=100&fields=${FIELDS}`;
        for (let tries = 0; tries < 4; tries++) {
            try {
                const r = await fetch(url, { headers: { 'User-Agent': 'NutriDL/1.0 (uso personal)' } });
                const txt = await r.text();
                if (!txt.startsWith('{')) { await sleep(15000); continue; }
                const j = JSON.parse(txt);
                fs.writeFileSync(file, JSON.stringify(j.products || []));
                console.log(b, 'página', i, (j.products || []).length);
                break;
            } catch (e) { await sleep(10000); }
        }
        await sleep(7000);
    }
    console.log('FIN');
})();
