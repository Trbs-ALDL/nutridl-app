// 3.21 · Tanda v8: lo que pidió Ángel — muchos productos de Mercadona (Hacendado), frutos secos,
// frutas, lácteos, bollería, bocadillos/sándwiches y bebidas. Siempre los MÁS escaneados en España
// (es la mejor medida pública de lo que la gente apunta de verdad).
// Uso: node tools/marcas/off_fetch8.js            → cache_off/v8_<grupo>_p<N>.json
//      node tools/marcas/off_fetch8.js hacendado  → solo ese grupo
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off'); if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const FIELDS = 'code,product_name,product_name_es,brands,brands_tags,nutriments,nutrition_data_per,quantity,serving_size,serving_quantity,unique_scans_n,countries_tags,categories_tags';
const UA = 'nutriDL/3.21 (aannggeelltrabajos@gmail.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Cada grupo: [nombre, parámetro de búsqueda, nº de páginas de 100]
const GRUPOS = [
    ['hacendado', 'brands_tags=hacendado', 8],          // Mercadona: lo que más pidió
    ['frutossecos', 'categories_tags_en=nuts', 3],
    ['frutas', 'categories_tags_en=fruits', 2],
    ['yogures', 'categories_tags_en=yogurts', 3],
    ['quesos', 'categories_tags_en=cheeses', 3],
    ['leches', 'categories_tags_en=milks', 2],
    ['bolleria', 'categories_tags_en=pastries', 2],
    ['galletas', 'categories_tags_en=biscuits', 2],
    ['sandwiches', 'categories_tags_en=sandwiches', 2],
    ['panes', 'categories_tags_en=breads', 2],
    ['zumos', 'categories_tags_en=juices', 2],
    ['refrescos', 'categories_tags_en=sodas', 2],
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
            const destino = path.join(dir, `v8_${nombre}_p${n}.json`);
            if (fs.existsSync(destino)) { console.log(`  página ${n}: ya estaba`); continue; }
            const p = await pagina(params, n);
            if (!p) { console.log(`  página ${n} sin datos: sigo`); continue; }
            fs.writeFileSync(destino, JSON.stringify(p));
            console.log(`  página ${n}: ${p.length} productos`);
            if (p.length < 100) break; // no hay más
            await sleep(7000);
        }
    }
    const fich = fs.readdirSync(dir).filter(f => f.startsWith('v8_'));
    const total = fich.reduce((a, f) => a + JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).length, 0);
    console.log(`\nGuardado: ${total} productos en ${fich.length} archivos cache_off/v8_*`);
})();
