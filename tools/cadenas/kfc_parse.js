// 3.6 · KFC España: «Contenido nutricional» oficial (PDF de kfc.es, Reglamento 1169/2011).
// Entrada: el texto del PDF (una línea por celda). Cada producto = nombre + 14 cifras: 7 nutrientes × (100 g, porción)
// en este orden: kcal, proteínas, grasas, saturadas, hidratos, azúcares, sal.
// Uso: node tools/cadenas/kfc_parse.js <kfc.txt>  → tools/cadenas/kfc.json (para ver la lista y elegir nombres)
const fs = require('fs'), path = require('path');
const L = fs.readFileSync(process.argv[2], 'latin1').split('\n').map(s => s.trim()).filter(Boolean);
const num = s => { s = String(s).replace(',', '.').replace('<', ''); const n = parseFloat(s); return /^<?\d+([.,]\d+)?$/.test(String(s).replace(',', '.').trim()) || /^\d/.test(s) ? n : NaN; };
const isNum = s => /^<?\d+([.,]\d+)?$/.test(s);
const out = [];
for (let i = 0; i < L.length; i++) {
    if (isNum(L[i]) || /^(100g|Porción|Porci)/.test(L[i])) continue;
    const nums = L.slice(i + 1, i + 15);
    if (nums.length < 14 || !nums.every(isNum)) continue;
    const v = nums.map(num);
    const [kcal, kcalP, p, , f, , , , c, , sug] = v;
    if (!(kcal > 0)) continue;
    out.push({ name: L[i].replace(/\s+/g, ' '), kcal, p, f, c, sug, g: kcalP > 0 ? Math.round(kcalP / kcal * 100) : null });
    i += 14;
}
fs.writeFileSync(path.join(__dirname, 'kfc_raw.json'), JSON.stringify(out, null, 1));
console.log(out.length, 'filas');
