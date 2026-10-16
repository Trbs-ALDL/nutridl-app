// 3.6 · Azúcares de los productos de marca que se añadieron sin ese dato (marcas.json y marcas_v4.json).
// Pregunta a Open Food Facts producto a producto (/api/v2/product/<código>, 1 por segundo) y guarda marcas_azucar.json
// con { código: azúcares por 100 g } (null si la etiqueta no lo trae: entonces la app no muestra azúcar, no inventa un 0).
// Uso: node tools/marcas/off_azucar.js
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, 'marcas_azucar.json');
const have = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : {};
const codes = [];
for (const f of ['marcas.json', 'marcas_v4.json']) {
    const p = path.join(__dirname, f); if (!fs.existsSync(p)) continue;
    JSON.parse(fs.readFileSync(p, 'utf8')).forEach(m => { if (m.off && !(String(m.off) in have) && m.sug == null) codes.push(String(m.off)); });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    let ok = 0;
    for (const code of codes) {
        for (let t = 0; t < 3; t++) {
            try {
                const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=nutriments`, { headers: { 'User-Agent': 'NutriDL/3.6 (app de nutricion sin animo de lucro)' } });
                if (r.status === 404) { have[code] = null; break; }
                if (!r.ok) { await sleep(5000); continue; }
                const n = ((await r.json()).product || {}).nutriments || {};
                const s = n.sugars_100g;
                have[code] = s != null && isFinite(+s) && +s >= 0 ? Math.round(+s * 10) / 10 : null;
                if (have[code] != null) ok++;
                break;
            } catch (e) { await sleep(5000); }
        }
        await sleep(1000);
    }
    fs.writeFileSync(out, JSON.stringify(have, null, 1));
    console.log(codes.length, 'consultados ·', ok, 'con azúcares ·', Object.keys(have).length, 'en total');
})();
