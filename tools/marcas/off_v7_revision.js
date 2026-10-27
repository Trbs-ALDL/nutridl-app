// 3.15 · Revisión A MANO de la tanda v7 (los más escaneados en España): nombre claro en español y la marca que se ve
// en la tienda (no la razón social). null = fuera: mercado solo francés/italiano, sin marca, datos imposibles o nombre dudoso.
// Repetidos con otro nombre (48, 60, 81, 90, 98, 101, 107, 113, 117, 122): ya estaban en la app → null.
// Uso (después de off_build3.js v7): node tools/marcas/off_v7_revision.js → reescribe marcas_v7.json y descarta repetidos
// con lo que ya hay en js/data/foods.js (misma marca y mismo nombre).
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, 'marcas_v7.json');
const auto = JSON.parse(fs.readFileSync(F, 'utf8'));
// Por posición en la lista automática (0-142): [nombre, marca] o null
const R = {
    0: ['Aceite de oliva virgen', 'Abril'], 1: ['Almendras al natural', 'Alesto'], 2: ['Mix de frutos secos al natural', 'Alesto'], 3: ['Cacahuete frito sin sal', 'Alesto'],
    4: ['Bebida de avellanas', 'Alpro'], 5: ['Bebida de avena Barista', 'Alpro'], 6: ['Alternativa vegetal al yogur griego natural', 'Alpro'], 7: ['Snack de pan con pipas', 'Antin'],
    8: null, 9: ['Pesto genovés', 'Baresa'], 10: ['Galletas Baiocchi', 'Mulino Bianco'], 11: ['Pasta penne rigate integral', 'Barilla'], 12: ['Placas de lasaña al huevo', 'Barilla'],
    13: ['Salsa napoletana', 'Barilla'], 14: ['Queso Caprice des Dieux', 'Caprice des Dieux'], 15: ['Crema de cacahuete cremosa', 'Bio Organic'], 16: ['Galletas Biscoff (speculoos)', 'Lotus'],
    17: ['Copos de avena', 'Bjorg'], 18: ['Muesli de uva, higo y albaricoque', 'Bjorg'], 19: ['Muesli Superfruits', 'Bjorg'], 20: null, 21: ['Capri-Sun multivitamina', 'Capri-Sun'],
    22: ['Barritas de cereales con chocolate', 'Carrefour Bio'], 23: ['Biscotes de trigo integral sin azúcar y sin sal', 'Carrefour Bio'], 24: ['Bebida de soja sin azúcares añadidos', 'Carrefour Bio'],
    25: ['Muesli crujiente con semillas de calabaza y girasol', 'Carrefour Bio'], 26: ['Galletas de chocolate y avellanas', 'Carrefour Bio'], 27: ['Copos de avena', 'Carrefour Bio'], 28: null,
    29: ['Tortitas de 4 cereales', 'Carrefour Bio'], 30: ['Muesli 6 frutas', 'Carrefour Bio'], 31: ['Confitura extra de fresa', 'Carrefour Bio'], 32: ['Palmeritas', 'Carrefour Bio'],
    33: ['Pan integral 3 cereales', 'Carrefour Bio'], 34: ['Galletas bretonas de mantequilla', 'Carrefour Bio'], 35: ['Galletas de avena y chocolate', 'Carrefour'], 36: ['Queso emmental rallado', 'Carrefour'],
    37: ['Chocolate negro 85 %', 'Carrefour'], 38: ['Muesli 35 % frutas', 'Carrefour'], 39: ['Barrita de semillas y almendras', 'Carrefour'], 40: ['Galletas rellenas de frambuesa', 'Carrefour'],
    41: ['Queso mozzarella', 'Carrefour'], 42: ['Biscotes sin sal añadida', 'Carrefour'], 43: ['Filetes de caballa al natural', 'Carrefour'], 44: ['Cereales corn flakes', 'Carrefour'],
    45: ['Galletas de chocolate intenso', 'Céréal Bio'], 46: ['Cereales Fitness Protein cacao sin azúcares añadidos', 'Nestlé'], 47: ['Chocolate con leche y almendras', 'Maruja'],
    48: null, 49: ['Salsa de tomate con albahaca', 'Combino'], 50: ['Muesli premium de frutos secos y fruta', 'Crownfield'], 51: ['Galletas saladas Krititas', 'Cuétara'],
    52: ['Bebida de almendras tostadas', 'Alpro'], 53: ['Yogur Activia de coco', 'Danone'], 54: ['Pizza Ristorante vegetal', 'Dr. Oetker'], 55: ['Pan de molde integral', 'Dulcesol'],
    56: ['Queso mozzarella maxi', 'Galbani'], 57: ['Tostadas crujientes de trigo sarraceno', 'Le Pain des Fleurs'], 58: ['Chocolate negro Madagascar 85 %', 'Ethiquable'],
    59: ['Chocolate negro Ecuador 80 %', 'Ethiquable'], 60: null, 61: null, 62: ['Espárragos blancos', 'Freshona'],
    63: ['Galletas Fibra Zero sin azúcares', 'Gullón'], 64: ['Galletas sándwich Zero sin azúcares', 'Gullón'], 65: ['Galletas Digestive avena y chocolate', 'Gullón'],
    66: ['Galletas Digestive avena y naranja', 'Gullón'], 67: ['Galletas doradas al horno Zero sin azúcares', 'Gullón'], 68: ['Galletas Digestive muesli', 'Gullón'], 69: ['Galletas Mega Dúo', 'Gullón'],
    70: ['Galleta ligera sin sal y sin azúcares', 'Gullón'], 71: ['Galletas Chip Choco sin gluten y sin azúcares añadidos', 'Gullón'], 72: ['Tortillas de trigo integrales (wraps)', 'Old El Paso'],
    73: ['Tortillas de trigo (wraps)', 'Old El Paso'], 74: ['Totopos Nachips', 'Old El Paso'], 75: ['Tortillas multicereales (wraps)', 'Mission'], 76: ['Galletas Desayuno Zero sin azúcares', 'Gullón'],
    77: ['Copos de avena extra suaves', 'Brüggen'], 78: ['Bebida de avena sin gluten', 'Isola Bio'], 79: ['Chocolate negro Ecuador con frambuesa 70 %', 'J.D. Gross'],
    80: ['Crema de cacahuete pura', 'Jardin Bio'], 81: null, 82: ['Chocolate Kinder', 'Kinder'], 83: null, 84: null, 85: ['Concentrado de tomate', 'Aicha'],
    86: null, 87: ['Chocolate negro 85 %', 'Lidl'], 88: ['Muesli crunchy de 4 frutos secos', 'Lidl'], 89: ['Muesli crunchy 0 %', 'Lidl'], 90: null,
    91: ['Muesli crunchy proteico con cacahuete', 'Lidl'], 92: ['Yogur proteico de coco', 'Milbona (Lidl)'], 93: ['Yogur proteico de arándanos', 'Milbona (Lidl)'], 94: null,
    95: ['Galletas Petit Écolier de chocolate negro', 'LU'], 96: ['Helado Magnum Cookie Dough', 'Magnum'], 97: ['Twix', 'Twix'], 98: null,
    99: ['Pan de molde 100 % integral', 'Hacendado'], 100: ['Tomate frito', 'Hacendado'], 101: null, 102: ['Barritas de espelta sabor manzana 0 %', 'Hacendado'],
    103: ['Chocolate negro 85 % cacao', 'Hacendado'], 104: ['Avena crunchy con cacao', 'Hacendado'], 105: ['Yogur natural proteínas 0 %', 'Hacendado'], 106: ['Barrita de frutos secos', 'Hacendado'],
    107: null, 108: ['Chocolate con leche', 'Milka'], 109: null, 110: ['Galletas Príncipe de chocolate', 'Príncipe'], 111: null,
    112: ['Galletas Príncipe rellenas de crema de chocolate', 'Príncipe'], 113: null, 114: ['Passata (puré de tomate natural)', 'Mutti'],
    115: ['Barrita proteica de crema de cacahuete', 'Nakd'], 116: ['Barrita Crunchy de avena y chocolate negro', 'Nature Valley'], 117: null,
    118: ['Bebida de avena Barista Edition', 'Oatly'], 119: ['Bebida de avena', 'Oatly'], 120: ['Rollitos de canela', 'Pågen'], 121: null, 122: null,
    123: null, 124: ['Buscalios', 'Risi'], 125: ['Arroz integral precocinado', 'Sabroz'], 126: ['Pan de molde Vital sin gluten', 'Schär'], 127: null, 128: null, 129: null,
    130: ['Cereales Special Flakes classic', 'Crownfield'], 131: null, 132: ['Chocolate negro 95 % cacao', 'J.D. Gross'], 133: null, 134: null, 135: ['Yogur de soja natural', 'Sojade'],
    136: ['Tostas integrales de centeno con sésamo', 'Tastino'], 137: null, 138: ['Muesli especial 30 % frutas y frutos secos', 'Jordans'], 139: ['Pan crujiente de fibra', 'Wasa'],
    140: ['Pan crujiente original', 'Wasa'], 141: ['Cereales Crispy Minis de chocolate', 'Weetabix'], 142: ['Cereales Weetabix original', 'Weetabix'],
};
if (auto.length !== 143 && !process.argv.includes('--forzar')) {
    console.log(`marcas_v7.json tiene ${auto.length} productos y esta revisión es para la lista de 143 del 22-10-2026. Revisa los índices antes de usarla (o --forzar).`);
    process.exit(1);
}
// Lo que ya hay en la app (para no repetir): marca|nombre normalizados
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%]+/g, ' ').trim();
const dato = f => fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'data', f), 'utf8');
const FOODS = require('vm').runInNewContext(dato('foods.js') + '\n' + dato('foods-marcas.js') + '\n;FOODS', Object.create(null));
// (sin contar los de esta misma tanda, que pueden estar ya dentro si se repite el proceso)
const mine = new Set(auto.map(m => String(m.off)));
const have = new Set(FOODS.filter(f => f.brand && !mine.has(String(f.off))).map(f => norm(f.brand) + '|' + norm(f.name)));
const out = [], fuera = [], repetidos = [];
auto.forEach((m, i) => {
    const r = R[i];
    if (!r) { fuera.push(m.label); return; }
    const x = { ...m, label: r[0], brand: r[1] };
    const k = norm(x.brand) + '|' + norm(x.label);
    if (have.has(k)) { repetidos.push(`${x.label} (${x.brand})`); return; }
    have.add(k); out.push(x);
});
fs.writeFileSync(F, JSON.stringify(out, null, 1));
console.log(`${out.length} productos revisados · ${fuera.length} fuera · ${repetidos.length} repetidos con la app: ${repetidos.join(', ') || '—'}`);
