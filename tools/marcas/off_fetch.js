// Descarga de Open Food Facts (licencia ODbL) los productos más escaneados de cada marca y guarda la página en cache_off/
// Uso: node off_fetch.js   (respeta el límite de ~10 búsquedas/minuto)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const BRANDS = ['hacendado', 'myprotein', 'optimum-nutrition', 'prozis', 'hsn', 'danone', 'oikos', 'alpro', 'nutella', 'coca-cola',
    'monster-energy', 'red-bull', 'quest', 'barebells', 'lindt', 'kellogg-s', 'quaker', 'bimbo', 'pringles', 'oreo', 'kinder',
    'nestle', 'central-lechera-asturiana', 'puleva', 'philadelphia', 'heinz', 'calvo', 'campofrio', 'elpozo', 'gallo', 'barilla',
    'sos', 'milbona', 'pilos', 'arla', 'cola-cao', 'isabel', 'hellmann-s', 'activia', 'pascual', 'kaiku', 'el-caserio', 'la-piara',
    'carbonell', 'brillante', 'kalise', 'president', 'fuet', 'navidul', 'rio-mare', 'florette', 'dia', 'carrefour', 'eroski', 'lidl'];
const FIELDS = 'code,product_name,product_name_es,brands,nutriments,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    for (const b of BRANDS) {
        const file = path.join(dir, b + '.json');
        if (fs.existsSync(file)) { console.log('ya está', b); continue; }
        const url = `https://world.openfoodfacts.org/api/v2/search?brands_tags=${b}&sort_by=unique_scans_n&page_size=250&fields=${FIELDS}`;
        for (let tries = 0; tries < 3; tries++) {
            try {
                const r = await fetch(url, { headers: { 'User-Agent': 'NutriDL/1.0 (uso personal)' } });
                if (r.status === 429) { console.log('límite, espero'); await sleep(30000); continue; }
                const j = await r.json();
                fs.writeFileSync(file, JSON.stringify(j.products || []));
                console.log(b, (j.products || []).length, 'productos de', j.count);
                break;
            } catch (e) { console.log('error', b, e.message); await sleep(10000); }
        }
        await sleep(7000);
    }
    console.log('FIN');
})();
