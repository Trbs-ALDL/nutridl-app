// 3.25 · Tanda v9: lo que pidió Ángel — PANES, PASTAS, BOLLOS y GALLETAS, todo lo que se pueda.
// Igual que la v8 pero por familias de esas cuatro, y con más páginas por familia.
// Siempre los MÁS escaneados en España (la mejor medida pública de lo que la gente apunta de verdad).
// Uso: node tools/marcas/off_fetch9.js            → cache_off/v9_<grupo>_p<N>.json
//      node tools/marcas/off_fetch9.js pastas     → solo ese grupo
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const FIELDS = 'code,product_name,product_name_es,brands,brands_tags,nutriments,nutrition_data_per,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags,categories_tags';
const UA = 'nutriDL/3.25 (aannggeelltrabajos@gmail.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Cada grupo: [nombre, parámetro de búsqueda, nº de páginas de 100]
const GRUPOS = [
    // ----- Pan -----
    ['panes', 'categories_tags_en=breads', 6],
    ['panmolde', 'categories_tags_en=sandwich-breads', 3],
    ['panrustico', 'categories_tags_en=baguettes', 2],
    ['tostadas', 'categories_tags_en=toasts', 2],
    ['crujientes', 'categories_tags_en=crispbreads', 2],
    ['bollospan', 'categories_tags_en=buns', 2],
    ['tortillastrigo', 'categories_tags_en=tortillas', 2],
    // ----- Pasta -----
    ['pastas', 'categories_tags_en=pastas', 5],
    ['pastafresca', 'categories_tags_en=fresh-pastas', 2],
    ['pastarellena', 'categories_tags_en=stuffed-pastas', 2],
    ['noodles', 'categories_tags_en=noodles', 2],
    // ----- Galletas -----
    ['galletas', 'categories_tags_en=biscuits', 6],
    ['galletaschoco', 'categories_tags_en=chocolate-biscuits', 3],
    ['galletasrellenas', 'categories_tags_en=filled-biscuits', 2],
    // ----- Bollos y repostería -----
    ['bolleria', 'categories_tags_en=pastries', 5],
    ['bizcochos', 'categories_tags_en=sponge-cakes', 2],
    ['magdalenas', 'categories_tags_en=muffins', 2],
    ['croissants', 'categories_tags_en=croissants', 2],
    ['donuts', 'categories_tags_en=doughnuts', 2],
    ['tartas', 'categories_tags_en=cakes', 3],
    ['barritas', 'categories_tags_en=cereal-bars', 2],
    ['cereales', 'categories_tags_en=breakfast-cereals', 3],
];

async function pagina(params, n) {
    const url = `https://world.openfoodfacts.org/api/v2/search?${params}&countries_tags_en=spain&sort_by=unique_scans_n&page_size=100&page=${n}&fields=${FIELDS}`;
    for (let intento = 1; intento <= 4; intento++) {
        try {
            const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(45000) });
            const t = await r.text();
            if (t.trim().startsWith('{')) return JSON.parse(t).products || [];
            console.log(`  página ${n}: el servidor no respondió bien (intento ${intento})`);
        } catch (e) { console.log(`  página ${n}: ${e.message} (intento ${intento})`); }
        await sleep(15000 * intento);
    }
    return null;
}

(async () => {
    const soloGrupo = process.argv[2];
    for (const [nombre, params, paginas] of GRUPOS) {
        if (soloGrupo && soloGrupo !== nombre) continue;
        console.log(`\n== ${nombre} ==`);
        for (let n = 1; n <= paginas; n++) {
            const destino = path.join(dir, `v9_${nombre}_p${n}.json`);
            if (fs.existsSync(destino)) { console.log(`  página ${n}: ya estaba`); continue; }
            const p = await pagina(params, n);
            if (!p) { console.log(`  página ${n} sin datos: sigo`); continue; }
            fs.writeFileSync(destino, JSON.stringify(p));
            console.log(`  página ${n}: ${p.length} productos`);
            if (p.length < 100) break; // no hay más
            await sleep(7000);
        }
    }
    const fich = fs.readdirSync(dir).filter(f => f.startsWith('v9_'));
    const total = fich.reduce((a, f) => a + JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).length, 0);
    console.log(`\nGuardado: ${total} productos en ${fich.length} archivos cache_off/v9_*`);
})();
