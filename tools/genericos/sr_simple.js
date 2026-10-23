// Convierte el volcado oficial del USDA (SR Legacy, JSON de FoodData Central) al formato corto que usa build.js.
// Se descarga una vez de https://fdc.nal.usda.gov/download-datasets.html («SR Legacy», JSON) y se descomprime.
// Uso: node tools/genericos/sr_simple.js <FoodData_Central_sr_legacy_food_json_*.json> <salida.json>
// Salida: [{ id, d (descripción exacta), kcal, p, f, c, fib, alc, sug }]
const fs = require('fs');
const ENT = process.argv[2], SAL = process.argv[3] || 'sr.json';
if (!ENT) { console.error('Falta el archivo del USDA'); process.exit(1); }

// Números de nutriente del USDA
const N = { kcal: 1008, p: 1003, f: 1004, c: 1005, fib: 1079, alc: 1018, sug: 2000 };
const raw = JSON.parse(fs.readFileSync(ENT, 'utf8'));
const lista = raw.SRLegacyFoods || raw.FoundationFoods || raw.SurveyFoods || raw;
const out = [];
for (const f of lista) {
    const n = {};
    for (const x of f.foodNutrients || []) {
        const num = +((x.nutrient || {}).id || 0); // 1008 kcal · 1003 proteína · 1004 grasa · 1005 hidratos · 1079 fibra · 1018 alcohol · 2000 azúcares
        if (x.amount == null) continue;
        for (const [k, v] of Object.entries(N)) if (num === v && n[k] == null) n[k] = x.amount;
    }
    // Sin energía o sin macros no sirve
    if (n.kcal == null || n.p == null || n.f == null || n.c == null) continue;
    out.push({ id: f.fdcId, d: f.description, kcal: n.kcal, p: n.p, f: n.f, c: n.c, fib: n.fib || 0, alc: n.alc || 0, sug: n.sug != null ? n.sug : null });
}
fs.writeFileSync(SAL, JSON.stringify(out));
console.log(out.length, 'alimentos del USDA listos en', SAL);
