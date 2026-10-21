// 3.4 · Elige automáticamente los productos de marca más usados (cache_off/v3_*.json) y los valida al detalle.
// Reglas: etiqueta completa por 100 g/ml; kcal de la etiqueta ≈ 4·P + 4·HC + 9·G + 2·fibra (±12 %, o ±12 kcal en productos muy ligeros);
// nada de mascotas, cosmética, limpieza ni bebidas alcohólicas; sin repetidos (ni con los que ya había).
// Uso: node tools/marcas/off_build3.js  → escribe marcas_v3.json (lo mete en la app off_embed.js)
//      node tools/marcas/off_build3.js v5   → cache_off/v5_*.json → marcas_v5.json (3.6: proteínas y despensa; sin repetir nada de lo anterior)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off');
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const TANDA = process.argv[2] || 'v3', PREFIX = TANDA + '_', OUTF = `marcas_${TANDA}.json`;
const rd = f => fs.existsSync(path.join(__dirname, f)) ? JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')) : [];
// v3 se compara solo con marcas.json (así su lista no cambia nunca); las tandas nuevas, con todo lo anterior
const old = TANDA === 'v3' ? rd('marcas.json') : rd('marcas.json').concat(rd('marcas_v3.json'), rd('marcas_v4.json'), TANDA === 'v6' ? rd('marcas_v5.json') : TANDA === 'v7' ? rd('marcas_v5.json').concat(rd('marcas_v6.json')) : []); // v7: no repetir nada de las tandas anteriores
const seenCode = new Set(old.map(m => String(m.off)));
const seenName = new Set(old.map(m => norm(m.brand) + '|' + norm(m.label)));
const QUOTA = TANDA === 'v3' ? { hacendado: 420 } : TANDA === 'v6' ? { 'coca-cola': 30, 'don-simon': 20 } : { myprotein: 60, prozis: 50, hsn: 40, 'kellogg-s': 30, nestle: 30 }; const DEFAULT_QUOTA = TANDA === 'v3' ? 18 : TANDA === 'v6' ? 15 : 20;
const BRAND = { 'coca-cola': 'Coca-Cola', aquarius: 'Aquarius', nestea: 'Nestea', fanta: 'Fanta', sprite: 'Sprite', pepsi: 'Pepsi', 'seven-up': '7Up', 'red-bull': 'Red Bull', 'monster-energy': 'Monster', burn: 'Burn', kas: 'Kas', schweppes: 'Schweppes', trina: 'Trina', lipton: 'Lipton', 'fuze-tea': 'Fuze Tea', powerade: 'Powerade', isostar: 'Isostar', gatorade: 'Gatorade', 'don-simon': 'Don Simón', granini: 'Granini', zumosol: 'Zumosol', 'minute-maid': 'Minute Maid', tropicana: 'Tropicana', casera: 'La Casera', 'la-casera': 'La Casera', bifrutas: 'Bifrutas', 'sunny-delight': 'Sunny Delight', vitaminwater: 'Vitaminwater', starbucks: 'Starbucks', 'kaiku-caffe-latte': 'Kaiku Caffè Latte', myprotein: 'Myprotein', hsn: 'HSN', prozis: 'Prozis', 'optimum-nutrition': 'Optimum Nutrition', bulk: 'Bulk', amix: 'Amix', nutella: 'Nutella', nocilla: 'Nocilla', 'cola-cao': 'Cola Cao', nesquik: 'Nesquik', 'bonne-maman': 'Bonne Maman', hero: 'Hero', helios: 'Helios', 'la-vieja-fabrica': 'La Vieja Fábrica', 'st-dalfour': 'St. Dalfour', quaker: 'Quaker', 'kellogg-s': "Kellogg's", oreo: 'Oreo', barilla: 'Barilla', president: 'Président', philadelphia: 'Philadelphia', arla: 'Arla', oikos: 'Oikos', nestle: 'Nestlé', lindt: 'Lindt', valor: 'Valor', milka: 'Milka', isabel: 'Isabel', 'el-caserio': 'El Caserío', hacendado: 'Hacendado', milbona: 'Milbona', carrefour: 'Carrefour', dia: 'Dia', eroski: 'Eroski', elpozo: 'ElPozo', campofrio: 'Campofrío', pascual: 'Pascual', 'central-lechera-asturiana': 'Central Lechera Asturiana', danone: 'Danone', alpro: 'Alpro', calvo: 'Calvo', gallo: 'Gallo', bimbo: 'Bimbo', kaiku: 'Kaiku' };
const BAD = /^stevia|edulcorante|sacarina|perro|gato|mascota|pienso|champu|champú|gel de|crema facial|desodorante|detergente|suavizante|lavavajillas|limpiador|colonia|toallit|pañal|cerveza|vino |vino$|ginebra|ron |whisky|vodka|licor|sidra|vermut|cava|sal yodada|^sal |levadura quimica|edulcorante|sacarina|stevia liquida|chicle|agua mineral|^agua/;
const isLiquid = (p, name) => p.nutrition_data_per === '100ml' || ((p.categories_tags || []).some(t => t !== 'en:plant-based-foods-and-beverages' && /^en:([a-z-]*-)?(beverages|milks?|drinks|juices?|kefir|gazpacho)$/.test(t)) && !(p.categories_tags || []).some(t => /yogurt|dessert|cheese|powder|cereal|bread|legume|spread|jam|sauce/.test(t))) || /\b\d+([.,]\d+)?\s*(ml|cl|l)\b/i.test(p.quantity || '') && /bebida|leche|zumo|batido|refresco|kefir|bebible|gazpacho|salmorejo|caldo|nectar|horchata|te |infusion|cafe/.test(name);
const RAW = /^(arroz|pasta|spaghetti|espagueti|macarr|fideo|tallarin|lentejas|garbanzos|alubias|judias|quinoa|cuscus|couscous|avena|harina|copos)/;
const label = s => { s = String(s).replace(/\s+/g, ' ').trim().replace(/^hacendado\s+/i, ''); s = s.charAt(0).toUpperCase() + s.slice(1); return s.length > 52 ? s.slice(0, 50).replace(/\s+\S*$/, '') : s; };
const serving = (p, liquid, name) => {
    const q = +p.serving_quantity;
    if (/aceite/.test(name)) return [10, 'cucharada', 'cucharadas'];
    if (/soluble|capuc|cappucc|cacao en polvo|colacao|nesquik|en polvo|instant/.test(name) && +(p.nutriments || {})['energy-kcal_100g'] > 250) return [15, 'cucharada', 'cucharadas'];
    if (q >= 5 && q <= 500) return [Math.round(q), 'ración', 'raciones'];
    if (liquid) return [250, 'vaso', 'vasos'];
    if (/yogur|skyr|kefir|natillas|flan|postre/.test(name)) return [125, 'unidad', 'unidades'];
    return [100, 'ración', 'raciones'];
};
// Nombre claro: si la etiqueta no dice qué es («Grande», «+Proteínas Chocolate»), se antepone el tipo según su categoría
const KIND = [
    [/kefir/, 'Kéfir', 'kefir'], [/skyr/, 'Skyr', 'skyr'], [/yogurt|yoghurt/, 'Yogur', 'yogur'],
    [/juice|nectar|smoothie|iced-tea|teas$|sodas|soft-drink|waters$/, '', ''],
    [/(oat|almond|soy|rice|coconut|hazelnut|spelt|nut)-based-drink|plant-based-milk|milk-substitute/, 'Bebida', 'bebida'],
    [/chocolate-milk|milkshake/, 'Batido', 'batido'], [/milks?$|-milks|lactose-free-milk/, 'Leche', 'leche'],
    [/sliced-bread|breads$|wholemeal-bread|toasts/, 'Pan', 'pan'], [/biscuit|cookies/, 'Galletas', 'galleta'],
    [/cheese/, 'Queso', 'queso'], [/pudding|jelly-dessert|custard|desserts$|cuajada/, 'Postre', 'postre'],
    [/white-ham|cooked-ham/, 'Jamón cocido', 'jamon'], [/turkey-breast|turkeys/, 'Pechuga de pavo', 'pavo'],
    [/juice/, 'Zumo', 'zumo'], [/sausages/, 'Salchichas', 'salchicha'], [/tuna/, 'Atún', 'atun'],
    [/breakfast-cereal|muesli/, 'Cereales', 'cereal'], [/potato-crisps|chips/, 'Patatas fritas', 'patata'],
    [/cocoa-and-hazelnuts-spread/, 'Crema de cacao', 'crema'], [/pasta/, 'Pasta', 'pasta'],
];
const kindOf = tags => { const s = (tags || []).join(' '); const k = KIND.find(([re]) => re.test(s)); return k && k[1] ? k : null; };
const FOREIGN = /[äöüßàâèêëîïôœç]|\b(sans|avec|ohne|und|mit|zucker|drink|unsweetened|senza|fraise|noir|nature|jus|lait|chocolat)\b/i;
const PROT = /merluza|pescado|bacalao|abadejo|lenguado|calamar|pollo|pavo|gallo|rape|panga|salmon/;
// Retoques a mano de nombres confusos (null = se descarta porque no dice qué es)
const RENAME = {
    '24,6 g. de proteínas plátano brownie': 'Barrita proteica plátano brownie', '+PROTEINAS': null, 'Divertidas': null, 'Tropical': null,
    'Reduce el colesterol': null, 'Fresa morango': null, 'Maiz Milho': 'Maíz dulce', 'Maíz milho Palomitas': 'Maíz para palomitas',
    'Crema de cacahuete Amendoim': null, 'Cereales mmuesesli con quinoa, chía y chocolate': 'Muesli con quinoa, chía y chocolate',
    'Negro 92%': 'Chocolate negro 92 %', 'BBQ': 'Salsa barbacoa', 'Valencianas': 'Magdalenas valencianas', 'Cuquis': 'Galletas Cuquis',
    'Lomo': null, 'Patatas': null, 'Piña': null, 'Cuatro quesos': null, 'Maxi Pavo Peru': 'Pechuga de pavo maxi', 'Espelta Sabor Manzana': null,
    'Plátano y fresa': null, 'Soja Natural': 'Yogur de soja natural', 'Crunchy Choc': 'Cereales crunchy de chocolate',
    'Cocktail Natural': 'Cóctel de frutos secos natural', 'Cocktail Mezcla': 'Cóctel de frutos secos', 'Cocktail tostado ahumado': 'Cóctel de frutos secos ahumado',
    'Cocktail de fruta': 'Cóctel de frutas en almíbar', 'Salsa light': null, 'Gajo rústica': 'Patatas gajo rústicas', 'Aceite.Oleo coco virgen': 'Aceite de coco virgen',
    'Sitope de agave': 'Sirope de agave', 'Leche desatada + Proteinas': 'Leche desnatada +Proteínas', 'Queso quesco fresco cabra': 'Queso fresco de cabra',
    'Queso fETA (denominación de origen protegida)': 'Queso feta', 'Palomitas pipocas microondas Sal': 'Palomitas microondas con sal',
    'Patatas fritas patates Extra crunch': 'Patatas fritas extra crunch', 'Anacardo caju al natural': 'Anacardo al natural',
    'Spaghetti. Pasta Alimenticia De Calidad Superior': 'Spaghetti calidad superior', 'Mini Cookies. Galletas Con Chocolate.': 'Mini cookies con chocolate',
    'Bebida de Almendras Enriquecida con Calcio y': 'Bebida de almendras con calcio', 'Cereales muesli Crunchy con chocolate 15% de': 'Muesli crunchy con chocolate',
    'Cereales y semillas granola con frutos secos bajo': 'Granola con frutos secos', 'Patatas Corte Ondulado Hacendado': 'Patatas fritas corte ondulado',
    'Te verde hacendado': 'Té verde', 'Batido proteínas Whey Hacendado': 'Batido de proteínas whey', 'PICOS 100% integrales': 'Picos 100 % integrales',
    'Pipas GIGANTES CON SAL': 'Pipas gigantes con sal', 'Postre +Proteínas Mousse Chocolate**': 'Postre +Proteínas mousse de chocolate',
    'Crema de cacahuete': 'Crema de cacahuete 100 %', 'Yogur griego natural 1kg': 'Yogur griego natural (tarro 1 kg)',
};
const tidy = s => s.replace(/\s*\*+$/, '').replace(/\b([A-ZÁÉÍÓÚÑ]{4,})\b/g, w => w.charAt(0) + w.slice(1).toLowerCase()).replace(/\s+hacendado$/i, '').replace(/\s{2,}/g, ' ').trim();
const out = [], report ={ ok: 0, noData: 0, kcalMal: 0, bad: 0, dup: 0, idioma: 0, ambiguo: 0 };
const files = fs.readdirSync(dir).filter(f => f.startsWith(PREFIX) && !f.includes('__')); // «__» = copias en bruto, no marcas
const byBrand = {};
files.forEach(f => { const b = f.slice(3).replace(/_p\d+\.json$/, ''); (byBrand[b] = byBrand[b] || []).push(...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); });
for (const [b, list] of Object.entries(byBrand)) {
    list.sort((x, y) => (y.unique_scans_n || 0) - (x.unique_scans_n || 0));
    let taken = 0; const quota = QUOTA[b] || DEFAULT_QUOTA;
    for (const p of list) {
        if (taken >= quota) break;
        const raw = p.product_name_es || p.product_name; const name = norm(raw);
        const n = p.nutriments || {};
        const kcal = +n['energy-kcal_100g'], P = +n.proteins_100g, G = +n.fat_100g, C = +n.carbohydrates_100g, Fi = +(n.fiber_100g || 0);
        if (!raw || name.length < 3 || /[^\x00-ɏ]/.test(raw)) { report.noData++; continue; }
        if (![kcal, P, G, C].every(v => Number.isFinite(v) && v >= 0) || n['energy-kcal_100g'] == null || n.proteins_100g == null || n.fat_100g == null || n.carbohydrates_100g == null) { report.noData++; continue; }
        if (BAD.test(name) || (p.categories_tags || []).some(t => /pet-food|alcoholic|non-food|cosmetic/.test(t))) { report.bad++; continue; }
        if (kcal < 1 && !(TANDA === 'v6' && isLiquid(p, name))) { report.bad++; continue; }
        if (P > 100 || G > 100 || C > 100 || P + G + C + Fi > 102 || kcal > 900) { report.kcalMal++; continue; }
        const calc = 4 * P + 4 * C + 9 * G + 2 * Fi;
        if (Math.abs(calc - kcal) > Math.max(12, kcal * 0.12)) { report.kcalMal++; continue; }
        if (b !== 'hacendado' && !(p.countries_tags || []).includes('en:spain')) { report.idioma++; continue; }
        if (!p.product_name_es && FOREIGN.test(raw)) { report.idioma++; continue; }
        const tags = p.categories_tags || [], tagStr = tags.join(' ');
        let lab = label(raw);
        const k = kindOf(tags);
        const powder = kcal > 250 && /soluble|capuc|cappucc|cacao|colacao|nesquik|en polvo|instant/.test(name) && (TANDA === 'v3' || !/crema|untar|spread|barrita|galleta|cereal|excellence|lindor|tableta|chocolate|noir|negro|leche|% cacao|cacao natural/.test(name));
        if (k && !powder && !norm(lab).includes(k[2]) && !(TANDA !== 'v3' && k[1] === 'Leche' && /queso|camembert|brie|cheese/.test(name))) lab = label(k[1] + ' ' + lab.charAt(0).toLowerCase() + lab.slice(1));
        if (/breaded|battered|rebozad|empanad|fish-fingers|nuggets/.test(tagStr + ' ' + name)) { if (!/rebozad|empanad|varita|nugget|crujient/.test(norm(lab))) lab += ' (rebozado)'; }
        else if (PROT.test(name) && C > 8 && !/croqueta|hamburgues|salsa|lasana|canelon|pizza|empanadilla|sandwich|bocadillo|ensalada|arroz|paella|pasta/.test(name)) { report.ambiguo++; continue; }
        if (powder && !/soluble|polvo|instant/.test(norm(lab))) lab += ' (en polvo)';
        if (lab in RENAME) { if (RENAME[lab] === null) { report.ambiguo++; continue; } lab = RENAME[lab]; }
        lab = tidy(lab);
        // Último filtro: nada de restos en otros idiomas, tamaños de paquete o nombres que no dicen qué es
        if (/iaurt|biscuiti|joghurt|erdbeere|yaourt|pêche|mangue|creamy|mild vanilla|vendéenne|salsichao|caseiro|céréales|\bfruits\b|\bx ?\d+\b|\d+ ?g\b|\bdanone\b|^(gurea|protein|naturarte|flora folic\.b|atún calvo|yogur|galletas pantera rosa imp)$/i.test(lab)) { report.idioma++; continue; }
        if (TANDA !== 'v3') {
            // otros idiomas (checo, italiano, francés…) y nombres que no dicen qué es
            if (/[ášžčřěůýū]|Ã|\b(frutta|cioccolat\w*|cocco|panna|mulino|macine|uovo|naturel|thon|abricots|krém|arašíd\w*|schokolade|cremige|proteine|croquants|coeur|onctueux|mois|affine|chocolat)\b/i.test(lab) || /^(pasta|whey|proteinas|mermelada|avena)$/i.test(lab.trim())) { report.idioma++; continue; }
            const words = norm(lab).replace(norm(BRAND[b] || ''), '').split(/[^a-z0-9%]+/).filter(Boolean);
            const FOODW = /coca|cola|fanta|sprite|pepsi|7 ?up|seven|aquarius|nestea|red bull|monster|burn|kas|schweppes|trina|lipton|fuze|powerade|isostar|gatorade|zumo|nectar|refresco|bebida|tonica|limonada|naranja|limon|manzana|melocoton|pina|te |te$|ice tea|energy|energetica|gaseosa|isotonic|smoothie|latte|frappuccino|cafe|agua con|vitamin|protein|proteina|whey|isolate|caseina|queso|yogur|skyr|kefir|mermelada|confitura|crema|cereal|galleta|pan|pasta|batido|atun|sardina|mejillon|caballa|avena|harina|cacao|chocolate|barrita|bar|aceite|salsa|tomate|pisto|leche|cookie|muesli|granola|pizza|biscote|tostada|espagueti|spaghetti|penne|pesto|sirope|frutos|patatas|chips|arroz|lasagne|ravioli|corny|krispies|flakes|bran|special|cola cao|colacao|nocilla|nutella|oreo|mantequilla|cacahuete|almendra/;
            if (!FOODW.test(norm(lab)) || words.length < 1 || norm(lab) === norm(BRAND[b] || '')) { report.ambiguo++; continue; }
            // mismo producto con otro nombre (valores idénticos dentro de la marca): solo el más escaneado
            const vk = b + '|' + [kcal, P, C, G].map(v => Math.round(v)).join('|');
            if (seenName.has(vk)) { report.dup++; continue; }
            seenName.add(vk);
        }
        if (TANDA === 'v6') {
            lab = tidy(lab.replace(/\b\d+([.,]\d+)?\s*(l|cl|ml|litros?)\b/gi, '').replace(/\b(lata|brik|briks|botella)\b/gi, '').replace(/\s+\d+([.,]\d+)?$/, '').replace(/\s{2,}/g, ' ').trim());
            if (/#|poudre|concentr[ée]|énerg/i.test(lab) || /polvo|powder|tablet|barra|barrita|\bbar\b|whey/i.test(name) || kcal > 120) { report.ambiguo++; continue; }
        }
        const key = norm(BRAND[b]) + '|' + norm(lab);
        if (seenCode.has(String(p.code)) || seenName.has(key)) { report.dup++; continue; }
        seenCode.add(String(p.code)); seenName.add(key);
        const liquid = TANDA === 'v6' ? true : !powder && isLiquid(p, name);
        const r1 = v => Math.round(v * 10) / 10;
        const Su = n.sugars_100g != null && isFinite(+n.sugars_100g) && +n.sugars_100g >= 0 ? r1(Math.min(+n.sugars_100g, C)) : null; // azúcares de la etiqueta (si los trae)
        // Bebidas: si el nombre empieza por otra marca conocida (Aquarius dentro de Coca-Cola, Kas dentro de Pepsi…), va con esa marca
        let brandOut = BRAND[b] || (TANDA === 'v7' && String(p.brands || '').split(',')[0].trim()) || b; // v7: marcas sin traducir → su nombre en la etiqueta
        if (TANDA === 'v6') { const nb = norm(lab).replace(/^bitter /, ''); const m = Object.values(BRAND).find(B => B !== brandOut && (nb === norm(B) || nb.startsWith(norm(B) + ' '))); if (m) brandOut = m; }
        out.push({ label: lab, brand: brandOut, off: String(p.code), offName: raw, kcal: Math.round(kcal), p: r1(P), c: r1(C), f: r1(G), fib: r1(Fi), sug: Su, serv: serving(p, liquid, name), em: '', ml: liquid ? 1 : 0, raw: RAW.test(name) && kcal > 250 ? 1 : 0, scans: p.unique_scans_n || 0 });
        taken++; report.ok++;
    }
}
fs.writeFileSync(path.join(__dirname, OUTF), JSON.stringify(out, null, 1));
console.log(report, 'por marca:', Object.fromEntries(Object.entries(out.reduce((a, m) => (a[m.brand] = (a[m.brand] || 0) + 1, a), {}))));
