// Construye la base de alimentos de marca de NutriDL a partir de cache_off/ (Open Food Facts, ODbL).
// Cada producto se elige por nombre y se VALIDA: kcal de la etiqueta ≈ 4·P + 4·HC + 9·G + 2·fibra (±18 %).
// Uso: node off_build.js  → escribe marcas.json e informe en consola
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'cache_off');
const load = b => { const f = path.join(dir, b + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []; };
const pages = b => { let out = load(b); for (let i = 2; i <= 12; i++) out = out.concat(load(`${b}_p${i}`)); return out; };
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// [etiqueta en la app, marca mostrada, archivo(s) de marca, regex que debe cumplir el nombre, regex de exclusión, ración [g, nombre, plural], emoji, {ml, role}]
const T = [];
const t = (label, brand, files, re, ex, serv, em, o = {}) => T.push({ label, brand, files: [].concat(files), re, ex, serv, em, ...o });
const H = 'Hacendado', h = 'hacendado';
// --- Hacendado (Mercadona) ---
t('Spaghetti', H, h, /spaghetti|espagueti/, /integral|salsa|bolo|carbonara/, [80, 'ración', 'raciones'], '🍝', { raw: 1 });
t('Spaghetti integral', H, h, /(spaghetti|espagueti).*integral|integral.*(spaghetti|espagueti)/, null, [80, 'ración', 'raciones'], '🍝', { raw: 1 });
t('Macarrones', H, h, /macarr/, /queso|gratin|integral|bolo|salsa/, [80, 'ración', 'raciones'], '🍝', { raw: 1 });
t('Macarrones integrales', H, h, /macarr.*integral|integral.*macarr/, null, [80, 'ración', 'raciones'], '🍝', { raw: 1 });
t('Fideos', H, h, /^fideo/, /oriental|instant|yakisoba/, [60, 'ración', 'raciones'], '🍜', { raw: 1 });
t('Arroz redondo', H, h, /arroz redondo/, /vasito|cocido/, [80, 'ración', 'raciones'], '🍚', { raw: 1 });
t('Arroz basmati', H, h, /basmati/, /vasito|cocido|microondas/, [80, 'ración', 'raciones'], '🍚', { raw: 1 });
t('Arroz integral', H, h, /arroz integral/, /vasito|tortita|cocido/, [80, 'ración', 'raciones'], '🍚', { raw: 1 });
t('Arroz vasito (cocido)', H, h, /vasito|arroz.*microondas|arroz cocido/, null, [125, 'vasito', 'vasitos'], '🍚');
t('Quinoa', H, h, /^quinoa|quinoa real|quinoa$/, /vasito|ensalada/, [60, 'ración', 'raciones'], '🍚', { raw: 1 });
t('Copos de avena', H, h, /copos de avena|avena en copos|^avena/, /bebida|tortilla|pan|harina|galleta|barrita|chocolate/, [40, 'ración', 'raciones'], '🥣');
t('Harina de avena', H, h, /harina de avena/, null, [40, 'ración', 'raciones'], '🥣');
t('Tortitas de arroz', H, h, /tortitas de arroz/, /chocolate|yogur|sabor/, [8, 'tortita', 'tortitas'], '🍘');
t('Tortitas de maíz', H, h, /tortitas de ma[ií]z/, /chocolate|yogur|jamon|sabor/, [7, 'tortita', 'tortitas'], '🍘');
t('Tortillas de trigo (wraps)', H, h, /tortillas? (de )?trigo/, /integral|maxi|avena/, [40, 'tortilla', 'tortillas'], '🌯');
t('Tortillas de trigo integrales', H, h, /tortillas de trigo integrales/, null, [40, 'tortilla', 'tortillas'], '🌯');
t('Tortillas de avena', H, h, /tortillas de avena/, null, [40, 'tortilla', 'tortillas'], '🌯');
t('Pan de molde 100 % integral', H, h, /pan de molde 100% integral/, /sin corteza/, [30, 'rebanada', 'rebanadas'], '🍞');
t('Pan de molde blanco', H, h, /pan de molde blanco/, /sin corteza|rustico/, [30, 'rebanada', 'rebanadas'], '🍞');
t('Pan de molde 35 % avena', H, h, /molde.*avena/, null, [30, 'rebanada', 'rebanadas'], '🍞');
t('Pan proteico', H, h, /prote/, /batido|yogur|leche|natillas|postre|barrita|bebida|pudding|flan|queso/, [40, 'rebanada', 'rebanadas'], '🍞', { must: /pan/ });
t('Pan tostado integral', H, h, /pan tostado.*integral/, /espelta/, [10, 'tostada', 'tostadas'], '🍞');
t('Panecillos integrales', H, h, /panecillos/, null, [50, 'panecillo', 'panecillos'], '🍞');
t('Leche desnatada', H, h, /(^|[^i])desnatada/, /lactosa|polvo|prote|calcio/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Leche semidesnatada', H, h, /leche semidesnatada/, /lactosa|polvo|prote|calcio/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Leche sin lactosa semidesnatada', H, h, /sin lactosa semidesnatada|semidesnatada sin lactosa/, null, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Bebida de proteínas fresa y plátano', H, h, /prote/, /pan|yogur|queso|natillas|pudding|barrita|tortilla/, [250, 'botella', 'botellas'], '🥤', { ml: 1, must: /fresa.*platano|platano.*fresa/ });
t('Bebida de avena', H, h, /bebida de avena/, /chocolate|cacao|calcio/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Bebida de soja', H, h, /bebida de soja/, /chocolate|cacao|vainilla/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Bebida de almendra', H, h, /bebida de almendra/, /chocolate|cacao/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Yogur griego natural', H, h, /griego/, /ligero|0|fresa|sabor|azucar|limon|miel|frut|stracciatella|coco|desnat/, [125, 'yogur', 'yogures'], '🥣');
t('Yogur griego ligero', H, h, /griego.*(ligero|0|desnat)/, /fresa|sabor|limon|miel|frut/, [125, 'yogur', 'yogures'], '🥣');
t('Yogur natural desnatado', H, h, /yogur.*natural.*desnat|desnatado natural/, /griego|bifidus|sabor/, [125, 'yogur', 'yogures'], '🥣');
t('Yogur +Proteínas natural', H, h, /prote/, /pan|batido|queso|natillas|pudding|barrita|bebida|bebible|leche|tortilla|fresa|platano|vainilla|chocolate|coco|frut|mango|arandano/, [120, 'yogur', 'yogures'], '🥣', { must: /yogur/ });
t('Queso fresco batido 0 %', H, h, /batido/, /prote|fresa|frut|vainilla|natural entero/, [100, 'ración', 'raciones'], '🧀', { must: /queso/ });
t('Skyr natural', H, h, /skyr/, /fresa|frut|vainilla|arandano|sabor|bebible/, [150, 'tarrina', 'tarrinas'], '🥣');
t('Kéfir', H, h, /k[eé]fir/, /fresa|sabor|frut|bebible/, [125, 'vaso', 'vasos'], '🥛');
t('Queso fresco light', H, h, /queso fresco light/, null, [50, 'ración', 'raciones'], '🧀');
t('Queso fresco de Burgos', H, h, /burgos/, /light|0/, [50, 'ración', 'raciones'], '🧀');
t('Requesón', H, h, /reques/, null, [50, 'ración', 'raciones'], '🧀');
t('Queso de untar light', H, h, /queso untar light|queso.*untar.*light/, null, [30, 'cucharada', 'cucharadas'], '🧀');
t('Mozzarella', H, h, /^mozzarella$|mozzarella fresca|mozzarella$/, /pizza|rallad/, [30, 'ración', 'raciones'], '🧀');
t('Queso rallado para fundir', H, h, /rallado/, /grana|parmesano/, [20, 'puñado', 'puñados'], '🧀');
t('Havarti light (lonchas)', H, h, /havarti light/, null, [20, 'loncha', 'lonchas'], '🧀');
t('Quesitos', H, h, /quesitos/, /light/, [16, 'quesito', 'quesitos'], '🧀');
t('Jamón cocido extra', H, h, /jam[oó]n cocido extra/, null, [15, 'loncha', 'lonchas'], '🥓');
t('Pechuga de pavo finas lonchas', H, h, /pechuga de pavo finas lonchas/, /reducido|maxi/, [15, 'loncha', 'lonchas'], '🦃');
t('Pechuga de pollo en lonchas', H, h, /pechuga de pollo.*lonchas|lonchas.*pollo/, null, [15, 'loncha', 'lonchas'], '🍗');
t('Tiras de pechuga de pollo al horno', H, h, /tiras.*pollo/, null, [140, 'envase', 'envases'], '🍗');
t('Atún claro al natural', H, h, /at[uú]n claro al natural/, null, [52, 'lata (escurrida)', 'latas (escurridas)'], '🐟');
t('Atún claro en aceite de oliva', H, h, /at[uú]n.*aceite de oliva/, null, [52, 'lata (escurrida)', 'latas (escurridas)'], '🐟');
t('Atún claro en aceite de girasol', H, h, /at[uú]n.*girasol/, null, [52, 'lata (escurrida)', 'latas (escurridas)'], '🐟');
t('Caballa en aceite de oliva', H, h, /caballa/, /tomate|escabeche/, [60, 'lata', 'latas'], '🐟');
t('Sardinas en aceite de oliva', H, h, /sardina/, /tomate|picante|escabeche/, [60, 'lata', 'latas'], '🐟');
t('Salmón ahumado', H, h, /salm[oó]n ahumado/, null, [50, 'ración', 'raciones'], '🐟');
t('Palitos de surimi', H, h, /surimi/, null, [15, 'palito', 'palitos'], '🦀');
t('Mejillones en escabeche', H, h, /mejill/, null, [60, 'lata', 'latas'], '🦪');
t('Claras de huevo pasteurizadas', H, h, /claras/, null, [100, 'ración', 'raciones'], '🥚', { ml: 0 });
t('Hummus de garbanzos', H, h, /hummus/, /sabor|pimiento|aguacate|remolacha/, [30, 'cucharada', 'cucharadas'], '🫘');
t('Garbanzos cocidos', H, h, /garbanzo/, /crema|hummus|harina|tostad/, [120, 'ración', 'raciones'], '🫘', { must: /cocid|bote|lata|frasco/ });
t('Lentejas cocidas', H, h, /^lentejas?( pardina)?$/, /crema|guis|estofad|harina/, [120, 'ración', 'raciones'], '🫘', { k: [75, 130] });
t('Alubias rojas cocidas', H, h, /alubia roja|alubias cocidas/, /guis|estofad|fabada/, [120, 'ración', 'raciones'], '🫘', { k: [75, 130] });
t('Crema de cacahuete', H, h, /crema de cacahuete|crema 100% cacahuete/, /chocolate|cacao/, [15, 'cucharada', 'cucharadas'], '🥜');
t('Cacahuete tostado 0 % sal', H, h, /cacahuete tostado/, null, [30, 'puñado', 'puñados'], '🥜');
t('Almendra natural', H, h, /almendra/, /frit|bebida|crema|harina|chocolate|garrapi|laminad|molida/, [30, 'puñado', 'puñados'], '🌰');
t('Nueces peladas', H, h, /nuec/, /mezcla|macadamia|brasil|pecan/, [30, 'puñado', 'puñados'], '🌰');
t('Anacardos', H, h, /anacardo/, null, [30, 'puñado', 'puñados'], '🌰');
t('Pistachos', H, h, /pistacho/, /crema|helado/, [30, 'puñado', 'puñados'], '🌰');
t('Aceite de oliva virgen extra', H, h, /aceite de oliva virgen extra/, /gran sel|spray/, [10, 'cucharada', 'cucharadas'], '🫒', { ml: 0 });
t('Chocolate negro 85 %', H, h, /85/, null, [10, 'onza', 'onzas'], '🍫', { must: /chocolate/ });
t('Chocolate negro 72 %', H, h, /7[02]/, null, [10, 'onza', 'onzas'], '🍫', { must: /chocolate/ });
t('Cacao puro desgrasado', H, h, /cacao/, /chocolate|crema|soluble|galleta|bebida|cereal/, [10, 'cucharada', 'cucharadas'], '🍫', { must: /puro|desgrasado|0%/ });
t('Crema de cacao con avellanas', H, h, /crema de cacao|cacao.*avellana/, null, [15, 'cucharada', 'cucharadas'], '🍫');
t('Miel', H, h, /^miel|miel de flores|miel multifloral/, /yogur|galleta|cereal/, [15, 'cucharada', 'cucharadas'], '🍯');
t('Mermelada sin azúcar añadido', H, h, /mermelada/, null, [15, 'cucharada', 'cucharadas'], '🍓', { must: /sin az|0%|light/ });
t('Tomate frito', H, h, /^tomate frito$|tomate frito$/, /casero/, [50, 'ración', 'raciones'], '🍅');
t('Salsa de tomate zero', H, h, /tomate zero|tomate.*sin azucares/, null, [50, 'ración', 'raciones'], '🍅');
t('Gazpacho', H, h, /gazpacho/, null, [250, 'vaso', 'vasos'], '🍅', { ml: 1 });
t('Salmorejo', H, h, /salmorejo/, null, [250, 'vaso', 'vasos'], '🍅', { ml: 1 });
t('Tortilla de patatas con cebolla', H, h, /tortilla de patatas con cebolla/, null, [150, 'ración', 'raciones'], '🍳');
t('Tortilla de patatas sin cebolla', H, h, /tortilla de patatas/, /con cebolla/, [150, 'ración', 'raciones'], '🍳');
t('Pizza jamón y queso', H, h, /pizza/, /mozzarella pizza|masa|base/, [175, 'media pizza', 'medias pizzas'], '🍕', { must: /jam|york/ });
t('Lasaña boloñesa', H, h, /lasa/, null, [350, 'envase', 'envases'], '🍝');
t('Patatas fritas clásicas', H, h, /patatas fritas cl/, null, [30, 'puñado', 'puñados'], '🥔');
t('Maíz dulce', H, h, /ma[ií]z dulce/, null, [75, 'lata', 'latas'], '🌽');
t('Cereales copos de maíz', H, h, /copos de ma[ií]z|corn flakes/, /chocolate|miel|azucar/, [30, 'ración', 'raciones'], '🥣');
t('Muesli', H, h, /muesli/, null, [40, 'ración', 'raciones'], '🥣');
t('Galletas María', H, h, /mar[ií]a/, /integral|chocolate/, [6, 'galleta', 'galletas'], '🍪', { must: /galleta/ });
t('Burger de pollo', H, h, /burger.*pollo|pollo.*burger/, null, [90, 'burger', 'burgers'], '🍔', { raw: 1 });
t('Burger de vacuno', H, h, /burger.*vacuno|vacuno.*burger/, null, [90, 'burger', 'burgers'], '🍔', { raw: 1 });
t('Salchichas tipo frankfurt', H, h, /frankfurt/, null, [44, 'salchicha', 'salchichas'], '🌭');
t('Fuet', H, h, /fuet/, null, [20, 'ración', 'raciones'], '🥓');
t('Mantequilla', H, h, /mantequilla/, /light|cacahuete/, [10, 'cucharadita', 'cucharaditas'], '🧈');
t('Mayonesa', H, h, /mayonesa/, /light|ligera|vegana/, [15, 'cucharada', 'cucharadas'], '🥚');
t('Kétchup', H, h, /k[eé]tchup/, null, [15, 'cucharada', 'cucharadas'], '🍅');
t('Edamame', H, h, /edamame/, null, [100, 'ración', 'raciones'], '🫛');
t('Tofu', H, h, /tofu/, /ahumado|sabor/, [100, 'ración', 'raciones'], '🧊');
t('Gelatina 0 %', H, h, /gelatina/, null, [100, 'tarrina', 'tarrinas'], '🍮');
t('Natillas proteicas', H, h, /prote/, /pan|batido|queso|yogur|barrita|bebida|leche/, [125, 'tarrina', 'tarrinas'], '🍮', { must: /natillas|postre|pudding|flan/ });
t('Bebida isotónica', H, h, /isot[oó]nic/, null, [500, 'botella', 'botellas'], '🥤', { ml: 1 });
// --- Alternativas de otras marcas para básicos que Open Food Facts no tiene de Hacendado ---
t('Skyr natural', 'Danone', 'danone', /skyr/, /vanill|boire|bebible|fresa|fraise|frut|fruit|myrtille|framb|sabor|gout|citron|coco|mango|peach/, [140, 'tarrina', 'tarrinas'], '🥣', { k: [52, 70] });
t('Kéfir natural', 'Activia', 'activia', /kefir/, /saveur|myrtille|fresa|fraise|sabor|frut|fruit|vanill|mango/, [125, 'vaso', 'vasos'], '🥛', { k: [40, 75] });
t('Yogur griego natural', 'Milbona (Lidl)', 'milbona', /greek|griego/, /light|ligero|0%|honey|miel|fresa|straw|vanill|coco|lemon|limon|frut|fruit|5/, [125, 'yogur', 'yogures'], '🥣', { k: [110, 145] });
t('Yogur griego light', 'Milbona (Lidl)', 'milbona', /light greek|greek.*light|griego.*(light|ligero)/, /honey|miel|fresa|straw|vanill|coco|lemon|frut|fruit/, [125, 'yogur', 'yogures'], '🥣', { k: [55, 85] });
t('Queso cottage', 'Milbona (Lidl)', 'milbona', /cottage/, /chive|cebollino|herb|piña|pineapple/, [100, 'ración', 'raciones'], '🧀', { k: [85, 110] });
t('Pudding proteico vainilla', 'Milbona (Lidl)', 'milbona', /protein.*(pudding|puding)|pudding.*prote/, /choco|rice|arroz/, [200, 'tarrina', 'tarrinas'], '🍮', { must: /vanill|vainilla/ });
t('Pudding proteico chocolate', 'Arla', 'arla', /protein/, null, [200, 'tarrina', 'tarrinas'], '🍮', { must: /choco/, k: [60, 95] });
t('Crema de cacahuete 100 %', 'Prozis', 'prozis', /peanut butter|crema de cacahuete/, /choco|caramel|honey|miel|white|cookie/, [15, 'cucharada', 'cucharadas'], '🥜', { k: [560, 660] });
t('Protein Pancakes (preparado)', 'Myprotein', 'myprotein', /protein pancake/, /choco|golden|syrup/, [50, 'ración', 'raciones'], '🥞', { k: [200, 400] });
t('Gazpacho', 'Kaiku', 'kaiku', /gazpacho/, null, [250, 'vaso', 'vasos'], '🍅', { ml: 1, k: [25, 80] });
t('Sirope sin azúcar', 'HSN', 'hsn', /sirope/, null, [15, 'cucharada', 'cucharadas'], '🍯', { k: [0, 30] });
// --- Proteína en polvo y suplementos ---
t('Impact Whey Protein', 'Myprotein', 'myprotein', /impact whey/, /isolate|vegan|clear|bar|cookie|brownie|wafer/, [25, 'cacito', 'cacitos'], '🥤');
t('Impact Whey Isolate', 'Myprotein', 'myprotein', /isolate/, /clear|vegan|bar/, [25, 'cacito', 'cacitos'], '🥤');
t('Clear Whey Isolate', 'Myprotein', 'myprotein', /clear/, /vegan|bar/, [25, 'cacito', 'cacitos'], '🥤');
t('Gold Standard 100 % Whey', 'Optimum Nutrition', 'optimum-nutrition', /gold standard|100% whey/, /bar|casein|isolate|pre/, [30, 'cacito', 'cacitos'], '🥤');
t('100 % Real Whey Protein', 'Prozis', 'prozis', /real whey/, /isolate|bar/, [30, 'cacito', 'cacitos'], '🥤');
t('Evowhey Protein', 'HSN', 'hsn', /evowhey/, null, [30, 'cacito', 'cacitos'], '🥤');
t('Barrita de proteínas', 'Quest', 'quest', /bar/, /chip|pizza|cookie/, [60, 'barrita', 'barritas'], '🍫');
t('Protein Bar', 'Barebells', 'barebells', /bar/, /soft|vegan|milkshake/, [55, 'barrita', 'barritas'], '🍫');
// --- Lácteos de marca ---
t('Oikos griego natural', 'Danone', ['oikos', 'danone'], /oikos/, /fresa|frut|vainilla|stracciatella|coco|limon|sabor|pro/, [110, 'yogur', 'yogures'], '🥣');
t('YoPro natural', 'Danone', 'danone', /yopro|yo pro/, /fresa|frut|vainilla|chocolate|platano|bebible|mango/, [160, 'yogur', 'yogures'], '🥣');
t('Activia natural', 'Danone', ['activia', 'danone'], /activia/, /fresa|fraise|frut|fruit|vainilla|vanill|sabor|cereal|0%|kiwi|ciruela|bebible|ananas|pina|peach|melocoton|mango|coco/, [120, 'yogur', 'yogures'], '🥣');
t('Danone natural', 'Danone', 'danone', /yogur natural|danone natural|natural$/, /activia|oikos|griego|azucar|bifidus|desnat/, [120, 'yogur', 'yogures'], '🥣');
t('Skyr natural', 'Milbona (Lidl)', 'milbona', /skyr/, /fresa|frut|vainilla|arandano|sabor|bebible/, [150, 'tarrina', 'tarrinas'], '🥣');
t('Queso fresco batido 0 %', 'Pilos (Lidl)', 'pilos', /batido|fresco/, /fresa|frut|vainilla|prote/, [100, 'ración', 'raciones'], '🧀');
t('Arla Protein natural', 'Arla', 'arla', /prote/, /fresa|frut|vainilla|chocolate|pudding|batido|drink|bebida|milk|blueberry|strawberry|banana/, [150, 'tarrina', 'tarrinas'], '🥣');
t('Bebida de soja original', 'Alpro', 'alpro', /soja|soya|soy/, /chocolate|vainilla|light|yogur|postre|skyr|protein/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Bebida de avena', 'Alpro', 'alpro', /avena|oat/, /chocolate|barista|light|yogur|no sugar|sin az/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Leche semidesnatada', 'Central Lechera Asturiana', 'central-lechera-asturiana', /semidesnatada/, /lactosa|calcio|prote|batido|cacao/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Leche desnatada', 'Puleva', 'puleva', /(^|[^i])desnatada/, /lactosa|calcio|prote|batido|cacao|omega/, [250, 'vaso', 'vasos'], '🥛', { ml: 1 });
t('Leche sin lactosa semidesnatada', 'Kaiku', 'kaiku', /sin lactosa/, /yogur|queso|cafe|batido|natillas|nata/, [250, 'vaso', 'vasos'], '🥛', { ml: 1, must: /leche|semi/ });
t('Queso de untar original', 'Philadelphia', 'philadelphia', /original|philadelphia$/, /light|ligero|0%|cebolla|hierbas|chocolate|milka/, [30, 'cucharada', 'cucharadas'], '🧀');
t('Queso de untar light', 'Philadelphia', 'philadelphia', /light|ligero/, /hierbas|cebolla/, [30, 'cucharada', 'cucharadas'], '🧀');
t('Quesitos', 'El Caserío', 'el-caserio', /quesito|queso fundido|porciones/, /light|0%/, [16, 'quesito', 'quesitos'], '🧀');
// --- Despensa de marca ---
t('Spaghetti n.º 5', 'Barilla', 'barilla', /spaghetti/, /integral|whole|gluten|salsa/, [80, 'ración', 'raciones'], '🍝', { raw: 1 });
t('Spaghetti', 'Gallo', 'gallo', /spaghetti|espagueti/, /integral|gluten|salsa/, [80, 'ración', 'raciones'], '🍝', { raw: 1 });
t('Arroz largo', 'SOS', 'sos', /arroz/, /vasito|integral|basmati|microondas/, [80, 'ración', 'raciones'], '🍚', { raw: 1 });
t('Arroz redondo', 'Brillante', 'brillante', /arroz/, /vasito|integral|basmati|microondas/, [80, 'ración', 'raciones'], '🍚', { raw: 1 });
t('Copos de avena', 'Quaker', 'quaker', /avena|oat/, /bar|cookie|galleta|chocolate|syrup|apple|cinnamon|honey/, [40, 'ración', 'raciones'], '🥣');
t('Special K Original', "Kellogg's", 'kellogg-s', /special k/, /chocolate|red berries|frut|protein|bar/, [30, 'ración', 'raciones'], '🥣');
t('Corn Flakes', "Kellogg's", 'kellogg-s', /corn flakes/, /frosties|honey|miel/, [30, 'ración', 'raciones'], '🥣');
t('Fitness Original', 'Nestlé', 'nestle', /fitness/, /chocolate|frut|bar|delice|miel|honey/, [30, 'ración', 'raciones'], '🥣');
t('Pan de molde 100 % integral', 'Bimbo', 'bimbo', /integral/, /sin corteza|semillas|tortilla|wrap/, [30, 'rebanada', 'rebanadas'], '🍞', { must: /pan|molde/ });
t('Atún claro en aceite de oliva', 'Calvo', 'calvo', /aceite de oliva/, /ensalada|sabor/, [52, 'lata (escurrida)', 'latas (escurridas)'], '🐟', { must: /at[uú]n/ });
t('Atún claro al natural', 'Calvo', 'calvo', /natural/, /ensalada/, [52, 'lata (escurrida)', 'latas (escurridas)'], '🐟', { must: /at[uú]n/ });
t('Atún claro en aceite de oliva', 'Isabel', 'isabel', /aceite de oliva/, /ensalada/, [52, 'lata (escurrida)', 'latas (escurridas)'], '🐟', { must: /at[uú]n/ });
t('Pechuga de pavo', 'Campofrío', 'campofrio', /pavo/, /jam|chorizo|salami/, [15, 'loncha', 'lonchas'], '🦃');
t('Pechuga de pavo', 'ElPozo', 'elpozo', /pavo/, /jam|chorizo|salami|pizza/, [15, 'loncha', 'lonchas'], '🦃');
t('Aceite de oliva virgen extra', 'Carbonell', 'carbonell', /virgen extra/, /spray/, [10, 'cucharada', 'cucharadas'], '🫒');
t('Tomate Ketchup', 'Heinz', 'heinz', /ketchup/, /zero|50|light|sin az/, [15, 'cucharada', 'cucharadas'], '🍅');
t('Tomate Ketchup Zero', 'Heinz', 'heinz', /ketchup/, null, [15, 'cucharada', 'cucharadas'], '🍅', { must: /zero|sin az|50/ });
t('Mayonesa', "Hellmann's", 'hellmann-s', /mayonesa|mayonnaise/, /light|ligera|vegan|veg/, [15, 'cucharada', 'cucharadas'], '🥚');
t('Cola Cao Original', 'Cola Cao', 'cola-cao', /cola ?cao|cacao/, /0%|turbo|cereal|barrita|energy|bebida|batido|crema/, [15, 'cucharada', 'cucharadas'], '🍫');
t('Nutella', 'Nutella', 'nutella', /nutella/, /biscuit|b-ready|vegan|plant|go|bar/, [15, 'cucharada', 'cucharadas'], '🍫');
// --- Dulces y snacks de marca ---
t('Excellence 85 % cacao', 'Lindt', 'lindt', /85/, null, [10, 'onza', 'onzas'], '🍫');
t('Excellence 70 % cacao', 'Lindt', 'lindt', /70/, /orange|naranja|mint|menta|sea salt|sal/, [10, 'onza', 'onzas'], '🍫');
t('Pringles Original', 'Pringles', 'pringles', /original/, null, [30, 'puñado', 'puñados'], '🥔');
t('Oreo Original', 'Oreo', 'oreo', /oreo/, /double|crunchy|golden|thins|mini|white|fudge|choc|cake|bar|helado|ice|vegan/, [11, 'galleta', 'galletas'], '🍪');
t('Kinder Bueno', 'Kinder', 'kinder', /bueno/, /white|blanco|mini|helado|ice/, [21.5, 'barrita', 'barritas'], '🍫');
t('KitKat', 'Nestlé', 'nestle', /kit ?kat/, /chunky|white|mini|dark|ice|helado|bites|ball/, [41.5, 'barrita', 'barritas'], '🍫');
// --- Bebidas ---
t('Coca-Cola', 'Coca-Cola', 'coca-cola', /coca[- ]?cola/, /zero|light|diet|sin|cherry|vainilla|lime|cafe|energy/, [330, 'lata', 'latas'], '🥤', { ml: 1 });
t('Coca-Cola Zero', 'Coca-Cola', 'coca-cola', /zero/, /cafe|cherry|lime|vainilla|limon|lemon/, [330, 'lata', 'latas'], '🥤', { ml: 1 });
t('Red Bull Energy Drink', 'Red Bull', 'red-bull', /red bull|energy/, /sugar ?free|sin az|zero|edition|tropical|summer|winter|white|blue|green|apricot|grapefruit|pomelo|pink|coconut|coco|melon|peach|sandia|watermelon|cherry|lima|purple|yellow|orange|curuba|iced/, [250, 'lata', 'latas'], '⚡', { ml: 1 });
t('Red Bull Sugarfree', 'Red Bull', 'red-bull', /sugar ?free|sin az/, null, [250, 'lata', 'latas'], '⚡', { ml: 1 });
t('Monster Energy Ultra', 'Monster', 'monster-energy', /ultra/, null, [500, 'lata', 'latas'], '⚡', { ml: 1 });

const K = {
    'Tortitas de arroz|Hacendado': [350, 420], 'Tortitas de maíz|Hacendado': [360, 430], 'Coca-Cola|Coca-Cola': [38, 46], 'Coca-Cola Zero|Coca-Cola': [0, 2],
    'Red Bull Energy Drink|Red Bull': [42, 48], 'Red Bull Sugarfree|Red Bull': [0, 8], 'Tomate Ketchup|Heinz': [95, 125], 'Tomate Ketchup Zero|Heinz': [10, 45],
    'Oikos griego natural|Danone': [100, 150], 'Atún claro al natural|Calvo': [90, 130], 'Atún claro al natural|Hacendado': [90, 130],
    'Leche desnatada|Hacendado': [30, 38], 'Leche desnatada|Puleva': [30, 38], 'Leche semidesnatada|Hacendado': [43, 50], 'Leche semidesnatada|Central Lechera Asturiana': [43, 50],
    'Spaghetti|Hacendado': [340, 375], 'Macarrones|Hacendado': [340, 375], 'Copos de avena|Hacendado': [350, 400], 'Copos de avena|Quaker': [350, 400],
    'Yogur griego natural|Hacendado': [110, 150], 'Queso fresco batido 0 %|Hacendado': [40, 60], 'Queso fresco batido 0 %|Pilos (Lidl)': [40, 60],
    'Skyr natural|Hacendado': [55, 75], 'Skyr natural|Milbona (Lidl)': [55, 75], 'Monster Energy Ultra|Monster': [0, 8], 'Bebida isotónica|Hacendado': [10, 30],
    'Crema de cacahuete|Hacendado': [560, 660], 'Claras de huevo pasteurizadas|Hacendado': [40, 55], 'Pan de molde blanco|Hacendado': [230, 290],
    'Activia natural|Danone': [55, 90], 'Danone natural|Danone': [40, 70], 'Mermelada sin azúcar añadido|Hacendado': [100, 200], 'Gelatina 0 %|Hacendado': [0, 20],
};
T.forEach(x => { const k = K[x.label + '|' + x.brand]; if (k && !x.k) x.k = k; });
module.exports = { T };
if (require.main !== module) return;

const usedCodes = new Set(), out = [], fails = [];
for (const tg of T) {
    let pool = []; tg.files.forEach(f => pool = pool.concat(pages(f)));
    const cands = pool.filter(p => {
        const name = norm(p.product_name_es || p.product_name);
        if (!name || usedCodes.has(p.code)) return false;
        if (!tg.re.test(name)) return false;
        if (tg.ex && tg.ex.test(name)) return false;
        if (tg.must && !tg.must.test(name)) return false;
        const n = p.nutriments || {}, kc = +n['energy-kcal_100g'], P = +n.proteins_100g, C = +n.carbohydrates_100g, F = +n.fat_100g;
        if (![kc, P, C, F].every(v => isFinite(v) && v >= 0)) return false;
        if (P + C + F > 101 || kc > 950) return false;
        if (tg.k && (kc < tg.k[0] || kc > tg.k[1])) return false;
        const fib = isFinite(+n.fiber_100g) ? +n.fiber_100g : 0, est = 4 * P + 4 * C + 9 * F + 2 * fib;
        // Coherencia etiqueta-macros (las bebidas con 0 kcal pasan si los macros también son ~0)
        if (kc < 5 ? est > 8 : Math.abs(est - kc) / kc > 0.18) return false;
        return true;
    }).sort((a, b) => (b.unique_scans_n || 0) - (a.unique_scans_n || 0));
    const p = cands[0];
    if (!p) { fails.push(`${tg.label} · ${tg.brand}`); continue; }
    usedCodes.add(p.code);
    const n = p.nutriments, r1 = v => Math.round(+v * 10) / 10;
    out.push({ label: tg.label, brand: tg.brand, off: p.code, offName: p.product_name_es || p.product_name, kcal: Math.round(+n['energy-kcal_100g']), p: r1(n.proteins_100g), c: r1(n.carbohydrates_100g), f: r1(n.fat_100g), fib: r1(n.fiber_100g || 0), serv: tg.serv, em: tg.em, ml: tg.ml ? 1 : 0, raw: tg.raw ? 1 : 0, scans: p.unique_scans_n || 0 });
}
fs.writeFileSync(path.join(__dirname, 'marcas.json'), JSON.stringify(out, null, 1));
console.log(`OK ${out.length} de ${T.length}`);
out.forEach(o => console.log(`  ${o.label} · ${o.brand} | ${o.offName} | ${o.kcal} kcal P${o.p} C${o.c} G${o.f}`));
console.log('SIN ENCONTRAR (' + fails.length + '):\n  ' + fails.join('\n  '));
