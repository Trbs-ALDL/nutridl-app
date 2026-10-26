// 3.21 · Tanda v8: revisa y valida los productos descargados por off_fetch8.js y escribe marcas_v8.json.
// Mismas reglas de siempre: etiqueta completa por 100 g/ml, las kcal de la etiqueta tienen que cuadrar con
// sus macros (4·P + 4·HC + 9·G + 2·fibra), nada de alcohol, mascotas, cosmética ni limpieza, nombre en
// español que diga QUÉ es, y sin repetir nada de lo que ya hay en la app.
// A diferencia de las tandas anteriores, aquí los archivos vienen agrupados por CATEGORÍA, así que la marca
// se saca de cada producto. Uso: node tools/marcas/off_build8.js
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off');
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
// Para comparar nombres: «Pan de Molde 100% Integral» y «Pan de molde 100 % integral» son el mismo producto
const clavear = s => norm(s).replace(/[^a-z0-9]/g, '');
const rd = f => fs.existsSync(path.join(__dirname, f)) ? JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')) : [];
const r1 = v => Math.round(v * 10) / 10;

// Todo lo que ya está en la app: no se repite ni un código de barras ni un nombre
const old = rd('marcas.json').concat(rd('marcas_v3.json'), rd('marcas_v4.json'), rd('marcas_v5.json'), rd('marcas_v6.json'), rd('marcas_v7.json'));
const seenCode = new Set(old.map(m => String(m.off)));
const seenName = new Set(old.map(m => clavear(m.brand) + '|' + clavear(m.label)));

// Cuántos productos como mucho por marca (Hacendado es Mercadona: lo que más pidió Ángel)
// Cómo se escribe cada marca en la app (OFF las trae tal cual: «DIA RETAIL ESPAÑA S.A.U.», «CARREFOUR FRANCE»...)
const MARCA_LIMPIA = {
    hacendado: 'Hacendado', mercadona: 'Hacendado', carrefour: 'Carrefour', 'carrefour-france': 'Carrefour',
    'carrefour-bio': 'Carrefour', 'carrefour-original': 'Carrefour', 'centros-comerciales-carrefour-s-a': 'Carrefour',
    'cmi-carrefour-marchandises-internationales': 'Carrefour', dia: 'Dia', 'dia-retail-espana-s-a-u': 'Dia',
    'dia-retail-espana': 'Dia', lidl: 'Lidl', alesto: 'Alesto', alestolidl: 'Alesto', aleso: 'Alesto',
    eroski: 'Eroski', consum: 'Consum', 'consum-s-coop-v': 'Consum', eliges: 'Eliges', auchan: 'Alcampo',
    alcampo: 'Alcampo', borges: 'Borges', 'borges-agricultural-industrial-nuts-s-a': 'Borges',
    bonarea: 'bonÀrea', naturmund: 'Naturmund', frumesa: 'Frumesa', milbona: 'Milbona', 'milbona-lidl': 'Milbona',
    danone: 'Danone', nestle: 'Nestlé', pascual: 'Pascual', kaiku: 'Kaiku', puleva: 'Puleva', asturiana: 'Central Lechera Asturiana',
    'central-lechera-asturiana': 'Central Lechera Asturiana', bimbo: 'Bimbo', 'la-bella-easo': 'La Bella Easo',
    donuts: 'Donuts', 'bollycao': 'Bollycao', 'el-pozo': 'ElPozo', elpozo: 'ElPozo', campofrio: 'Campofrío',
    arla: 'Arla', alpro: 'Alpro', president: 'Président', philadelphia: 'Philadelphia', gallo: 'Gallo',
    'la-cocinera': 'La Cocinera', 'casa-tarradellas': 'Casa Tarradellas', 'el-caserio': 'El Caserío',
};
const CUPO = { hacendado: 320, 'carrefour': 25, 'dia': 25, 'eroski': 20, 'alcampo': 20, 'lidl': 20, 'auchan': 15 };
const CUPO_NORMAL = 12;

const MALO = /^stevia|edulcorante|sacarina|perro|gato|mascota|pienso|champu|gel de|crema facial|desodorante|detergente|suavizante|lavavajillas|limpiador|colonia|toallit|panal|cerveza|vino |vino$|ginebra|\bron\b|whisky|vodka|licor|sidra|vermut|cava|sal yodada|^sal |levadura quimica|chicle|agua mineral|^agua$/;
const EXTRANJERO = /[äöüßàâèêëîïôœçášžčřěůýū]|\b(sans|avec|ohne|und|mit|zucker|unsweetened|senza|fraise|noir|nature|jus|lait|chocolat|iaurt|joghurt|yaourt|biscuiti|frutta|cioccolat\w*|cocco|panna|uovo|naturel|thon|abricots|krem|schokolade|cremige|croquants|coeur|onctueux|affine|sementes|noisette|cacahuetes grilles|amendoim|queijo|leite|manteiga|bolacha|biscoito)\b/i;
const CRUDO = /^(arroz|pasta|spaghetti|espagueti|macarr|fideo|tallarin|lentejas|garbanzos|alubias|judias|quinoa|cuscus|couscous|avena|harina|copos)/;
// Palabras que indican que el nombre dice qué es (si no aparece ninguna, no se puede apuntar a ciegas)
const ES_COMIDA = /queso|yogur|skyr|kefir|leche|nata|mantequilla|margarina|postre|flan|natillas|cuajada|batido|bebida|zumo|nectar|refresco|tonica|limonada|agua con|\\bte\\b|cafe|cacao|chocolate|galleta|cookie|bizcocho|magdalena|croissant|cruasan|napolitana|ensaimada|palmera|donut|donuts|bollo|brownie|tarta|pastel|barrita|cereal|muesli|granola|avena|pan|biscote|tostada|picos|colines|bocadillo|sandwich|wrap|pizza|pasta|espagueti|spaghetti|macarron|fideo|arroz|quinoa|cuscus|legumbre|lenteja|garbanzo|alubia|judia|hummus|tomate|salsa|aceite|vinagre|mayonesa|ketchup|mostaza|atun|sardina|mejillon|caballa|anchoa|salmon|merluza|bacalao|gamba|langostino|pollo|pavo|jamon|lomo|chorizo|salchichon|fuet|salchicha|bacon|beicon|morcilla|carne|hamburguesa|albondiga|nugget|croqueta|empanadilla|lasana|canelon|tortilla|huevo|patata|chips|frutos|almendra|nuez|nueces|anacardo|pistacho|avellana|cacahuete|pipa|semilla|sesamo|chia|platano|manzana|naranja|fresa|melocoton|pina|mango|uva|sandia|melon|pera|kiwi|arandano|frambuesa|datil|pasa|higo|ciruela|albaricoque|coco|aceituna|encurtido|pepinillo|maiz|guisante|zanahoria|brocoli|espinaca|ensalada|gazpacho|salmorejo|caldo|sopa|crema|pure|mermelada|confitura|miel|sirope|azucar|edulcorante|helado|sorbete|proteina|protein|whey|isolate|caseina|tofu|seitan|soja|vegetal|veggie|falafel|hummus/;

const etiqueta = s => {
    s = String(s).replace(/\s+/g, ' ').trim().replace(/^hacendado\s+/i, '');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return s.length > 52 ? s.slice(0, 50).replace(/\s+\S*$/, '') : s;
};
const limpiar = s => s.replace(/\s*\*+$/, '')
    .replace(/\b([A-ZÁÉÍÓÚÑ]{4,})\b/g, w => w.charAt(0) + w.slice(1).toLowerCase())
    .replace(/\s+hacendado$/i, '').replace(/\s{2,}/g, ' ').trim();

const esLiquido = (p, nombre) => p.nutrition_data_per === '100ml'
    || (p.categories_tags || []).some(t => /^en:([a-z-]*-)?(beverages|milks?|drinks|juices?|kefir|gazpacho)$/.test(t) && t !== 'en:plant-based-foods-and-beverages')
    || (/\b\d+([.,]\d+)?\s*(ml|cl|l)\b/i.test(p.quantity || '') && /bebida|leche|zumo|batido|refresco|kefir|bebible|gazpacho|salmorejo|caldo|nectar|horchata|te |infusion|cafe/.test(nombre));

const racion = (p, liquido, nombre) => {
    const q = +p.serving_quantity;
    if (/aceite/.test(nombre)) return [10, 'cucharada', 'cucharadas'];
    if (/soluble|capuc|cappucc|cacao en polvo|en polvo|instant/.test(nombre) && +(p.nutriments || {})['energy-kcal_100g'] > 250) return [15, 'cucharada', 'cucharadas'];
    if (q >= 5 && q <= 500) return [Math.round(q), 'ración', 'raciones'];
    if (liquido) return [250, 'vaso', 'vasos'];
    if (/yogur|skyr|kefir|natillas|flan|postre/.test(nombre)) return [125, 'unidad', 'unidades'];
    if (/galleta|barrita|magdalena|croissant|cruasan|donut|bollo|napolitana/.test(nombre)) return [40, 'unidad', 'unidades'];
    if (/frutos secos|almendra|nuez|nueces|anacardo|pistacho|avellana|cacahuete|pipa/.test(nombre)) return [30, 'puñado', 'puñados'];
    return [100, 'ración', 'raciones'];
};

// Razones sociales de la etiqueta → el nombre con el que la gente conoce la marca
const SOCIEDAD = [[/carrefour/i, 'Carrefour'], [/\bdia\b|dia retail/i, 'Dia'], [/consum/i, 'Consum'], [/borges/i, 'Borges'],
    [/eroski/i, 'Eroski'], [/alcampo|auchan/i, 'Alcampo'], [/mercadona|hacendado/i, 'Hacendado'], [/\blidl\b/i, 'Lidl'], [/alesto/i, 'Alesto'],
    [/puleva|lactalis/i, 'Puleva'], [/pascual/i, 'Pascual'], [/kaiku/i, 'Kaiku'], [/central lechera|asturiana/i, 'Central Lechera Asturiana'],
    [/gull[oó]n/i, 'Gullón'], [/bimbo/i, 'Bimbo'], [/dulcesol/i, 'Dulcesol'], [/mondelez/i, 'Mondelez'], [/milka/i, 'Milka'], [/oreo/i, 'Oreo'],
    [/sch[aä]r/i, 'Schär'], [/mission/i, 'Mission'], [/milbona/i, 'Milbona'], [/bonpreu/i, 'Bonpreu'], [/bon[àa]rea/i, 'bonÀrea'],
    [/danone/i, 'Danone'], [/nestl[eé]/i, 'Nestlé'], [/pr[eé]sident/i, 'Président'], [/garc[ií]a baquero/i, 'García Baquero'],
    [/la bella easo/i, 'La Bella Easo'], [/casa tarradellas/i, 'Casa Tarradellas'], [/el caser[ií]o/i, 'El Caserío'],
    [/campofr[ií]o/i, 'Campofrío'], [/el ?pozo/i, 'ElPozo'], [/\barla\b/i, 'Arla'], [/alpro/i, 'Alpro'], [/philadelphia/i, 'Philadelphia'],
    [/coca[ -]?cola/i, 'Coca-Cola'], [/pepsi/i, 'Pepsi'], [/don sim[oó]n/i, 'Don Simón'], [/granini/i, 'Granini'],
    [/zumosol/i, 'Zumosol'], [/\bhero\b/i, 'Hero'], [/kell?ogg/i, "Kellogg's"], [/calvo/i, 'Calvo'], [/isabel/i, 'Isabel'],
    [/\bgallo\b/i, 'Gallo'], [/barilla/i, 'Barilla'], [/quaker/i, 'Quaker'], [/heinz/i, 'Heinz'], [/\bhacend/i, 'Hacendado']];
function nombreDeMarca(x) {
    const m = SOCIEDAD.find(([re]) => re.test(x));
    if (m) return m[1];
    // Fuera las formas jurídicas: «S.A.», «S.L.U.», «S. COOP. V.»…
    let n = String(x).replace(/[,;]?\s*\b(s\.?\s?a\.?\s?u?\.?|s\.?\s?l\.?\s?u?\.?|s\.?\s?coop\.?(\s?v\.?)?|gmbh|srl|sociedad|espana|españa)\b/gi, ' ')
        .replace(/\s{2,}/g, ' ').trim();
    // Cada palabra con su mayúscula; las siglas cortas se dejan como están
    n = n.split(/\s+/).filter(Boolean)
        .map(w => (w.length <= 3 && w === w.toUpperCase()) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    return n.trim() || String(x);
}

const archivos = fs.readdirSync(dir).filter(f => f.startsWith('v8_'));
const todos = [];
for (const f of archivos) todos.push(...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
// Un mismo producto puede venir en dos categorías: se queda una vez
const porCodigo = new Map();
for (const p of todos) if (p.code && !porCodigo.has(String(p.code))) porCodigo.set(String(p.code), p);

// Agrupar por marca (la marca sale del propio producto) y coger primero los más escaneados
const porMarca = {};
for (const p of porCodigo.values()) {
    const b = norm((p.brands_tags && p.brands_tags[0]) || String(p.brands || '').split(',')[0]).replace(/^xx-/, '').replace(/\s+/g, '-') || 'sin-marca';
    (porMarca[b] = porMarca[b] || []).push(p);
}

const out = [], informe = { ok: 0, sinDatos: 0, kcalMal: 0, descartado: 0, repetido: 0, idioma: 0, ambiguo: 0 };
for (const [b, lista] of Object.entries(porMarca)) {
    if (b === 'sin-marca') { informe.ambiguo += lista.length; continue; }
    lista.sort((x, y) => (y.unique_scans_n || 0) - (x.unique_scans_n || 0));
    const cupo = CUPO[b] || CUPO_NORMAL;
    let cogidos = 0;
    for (const p of lista) {
        if (cogidos >= cupo) break;
        const bruto = p.product_name_es || p.product_name;
        const nombre = norm(bruto);
        const n = p.nutriments || {};
        const kcal = +n['energy-kcal_100g'], P = +n.proteins_100g, G = +n.fat_100g, C = +n.carbohydrates_100g, Fi = +(n.fiber_100g || 0);
        if (!bruto || nombre.length < 3 || /[^\x00-ɏ]/.test(bruto)) { informe.sinDatos++; continue; }
        if (n['energy-kcal_100g'] == null || n.proteins_100g == null || n.fat_100g == null || n.carbohydrates_100g == null) { informe.sinDatos++; continue; }
        if (![kcal, P, G, C].every(v => Number.isFinite(v) && v >= 0)) { informe.sinDatos++; continue; }
        if (MALO.test(nombre) || (p.categories_tags || []).some(t => /pet-food|alcoholic|non-food|cosmetic/.test(t))) { informe.descartado++; continue; }
        if (kcal < 1 && !esLiquido(p, nombre)) { informe.descartado++; continue; }
        if (P > 100 || G > 100 || C > 100 || P + G + C + Fi > 102 || kcal > 900) { informe.kcalMal++; continue; }
        if (Math.abs(4 * P + 4 * C + 9 * G + 2 * Fi - kcal) > Math.max(12, kcal * 0.12)) { informe.kcalMal++; continue; }
        if (!(p.countries_tags || []).includes('en:spain')) { informe.idioma++; continue; }
        if (!p.product_name_es && EXTRANJERO.test(bruto)) { informe.idioma++; continue; }

        const marcaCruda = MARCA_LIMPIA[b] || nombreDeMarca(String(p.brands || '').split(',')[0].trim() || b);
        let lab = limpiar(etiqueta(bruto));
        // La marca ya se enseña aparte: fuera del nombre, esté donde esté
        for (const palabra of new Set([marcaCruda, b.replace(/-/g, ' '), ...String(p.brands || '').split(',')].map(x => norm(x)).filter(x => x.length > 2)))
            lab = lab.replace(new RegExp('\\b' + palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), ' ');
        lab = limpiar(lab.replace(/[\s\-·,]+$/, '').replace(/^[\s\-·,]+/, '').replace(/\s{2,}/g, ' '));
        if (lab) lab = lab.charAt(0).toUpperCase() + lab.slice(1);
        if (/breaded|battered|rebozad|empanad|fish-fingers|nuggets/.test((p.categories_tags || []).join(' ') + ' ' + nombre)
            && !/rebozad|empanad|varita|nugget|crujient/.test(norm(lab))) lab += ' (rebozado)';
        // El nombre tiene que decir qué es y no ser solo un tamaño o una marca
        if (!ES_COMIDA.test(norm(lab)) || /\b\d+ ?(g|gr|kg|ml|cl|l)\b|\bx ?\d+\b/i.test(lab) || norm(lab).length < 4) { informe.ambiguo++; continue; }
        if (/^(sin|con|de|la|el|los|las|al|y)\b/i.test(lab) || lab.split(/\s+/).length > 9) { informe.ambiguo++; continue; }
        if (EXTRANJERO.test(lab)) { informe.idioma++; continue; }

        const marca = MARCA_LIMPIA[b] || nombreDeMarca(String(p.brands || '').split(',')[0].trim() || b);
        const clave = clavear(marca) + '|' + clavear(lab);
        if (seenCode.has(String(p.code)) || seenName.has(clave)) { informe.repetido++; continue; }
        // Mismo producto repetido dentro de la marca (mismos valores): solo el más escaneado
        const valores = clavear(marca) + '|' + [kcal, P, C, G].map(v => Math.round(v)).join('|');
        if (seenName.has(valores)) { informe.repetido++; continue; }
        seenCode.add(String(p.code)); seenName.add(clave); seenName.add(valores);

        const liquido = esLiquido(p, nombre);
        const Su = n.sugars_100g != null && isFinite(+n.sugars_100g) && +n.sugars_100g >= 0 ? r1(Math.min(+n.sugars_100g, C)) : null;
        out.push({
            label: lab, brand: marca, off: String(p.code), offName: bruto,
            kcal: Math.round(kcal), p: r1(P), c: r1(C), f: r1(G), fib: r1(Fi), sug: Su,
            serv: racion(p, liquido, nombre), em: '', ml: liquido ? 1 : 0,
            raw: CRUDO.test(nombre) && kcal > 250 ? 1 : 0, scans: p.unique_scans_n || 0,
        });
        cogidos++; informe.ok++;
    }
}
out.sort((a, b) => (b.scans || 0) - (a.scans || 0));
fs.writeFileSync(path.join(__dirname, 'marcas_v8.json'), JSON.stringify(out, null, 1));
const porMarcaOut = out.reduce((a, m) => (a[m.brand] = (a[m.brand] || 0) + 1, a), {});
console.log(informe);
console.log('por marca:', JSON.stringify(Object.fromEntries(Object.entries(porMarcaOut).sort((a, b) => b[1] - a[1]).slice(0, 25))));
console.log(out.length, 'productos nuevos en marcas_v8.json');
