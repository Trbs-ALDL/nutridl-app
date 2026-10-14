// nutriDL · Base de alimentos genéricos (USDA / BEDCA) y de marca (Open Food Facts, ODbL)
'use strict';

// =====================================================================
//  BASE DE DATOS DE ALIMENTOS (por 100 g · USDA FoodData Central / BEDCA)
//  c = hidratos disponibles (sin fibra, criterio UE) · fib = fibra
//  flags: N vegano · V vegetariano · M carne · P pescado/marisco · G gluten · L lactosa
//  meals: B desayuno · S tentempié/merienda · L comida · D cena
// =====================================================================
const FOODS = [];
function F(id, name, cat, role, meals, p, f, c, fib, min, max, flags, x = {}) {
    FOODS.push({ id, name, cat, role, meals, p, f, c, fib, min, max, flags, ...x });
}
// Carnes, pescados y huevos
F('pollo', 'Pechuga de pollo', 'prot', 'protein', 'LD', 22.5, 2.6, 0, 0, 80, 300, 'M', { raw: 1 });
F('pavo', 'Pechuga de pavo', 'prot', 'protein', 'LD', 23.7, 1.5, 0, 0, 80, 300, 'M', { raw: 1 });
F('ternera', 'Ternera magra (filete)', 'prot', 'protein', 'LD', 21.4, 5, 0, 0, 80, 280, 'M', { raw: 1 });
F('picada', 'Carne picada vacuno 10 %', 'prot', 'protein', 'LD', 20, 10, 0, 0, 80, 250, 'M', { raw: 1 });
F('cerdo', 'Lomo de cerdo', 'prot', 'protein', 'LD', 22, 6, 0, 0, 80, 280, 'M', { raw: 1 });
F('salmon', 'Salmón', 'prot', 'protein', 'LD', 20, 13, 0, 0, 80, 250, 'P', { raw: 1 });
F('merluza', 'Merluza / pescado blanco', 'prot', 'protein', 'LD', 17.5, 1.2, 0, 0, 100, 350, 'P', { raw: 1 });
F('atun', 'Atún al natural (lata)', 'prot', 'protein', 'LDS', 26, 1, 0, 0, 52, 208, 'P', { u: [52, 'lata', 'latas'], round: 1 });
F('gambas', 'Gambas / langostinos', 'prot', 'protein', 'LD', 20, 0.5, 0, 0, 80, 300, 'P', { raw: 1 });
F('huevo', 'Huevo', 'prot', 'protein', 'BLD', 12.6, 9.5, 0.7, 0, 55, 220, 'V', { u: [55, 'huevo', 'huevos'], round: 1 });
F('claras', 'Claras de huevo', 'prot', 'protein', 'BD', 10.9, 0.2, 0.7, 0, 66, 330, 'V', { u: [33, 'clara', 'claras'] });
F('jamon', 'Jamón serrano (sin grasa)', 'prot', 'protein', 'BS', 30, 9, 0, 0, 20, 80, 'M', { u: [15, 'loncha', 'lonchas'] });
F('fiambre', 'Fiambre de pavo (>90 % carne)', 'prot', 'protein', 'BS', 18, 2, 2, 0, 30, 120, 'M', { u: [15, 'loncha', 'lonchas'] });
// Lácteos
F('skyr', 'Skyr / yogur proteico 0 %', 'lacteo', 'protein', 'BS', 10.5, 0.2, 4, 0, 125, 450, 'VL', { u: [150, 'tarrina', 'tarrinas'] });
F('yogdes', 'Yogur natural desnatado', 'lacteo', 'protein', 'BS', 4.5, 0.2, 6, 0, 125, 500, 'VL', { u: [125, 'yogur', 'yogures'] });
F('yoggr', 'Yogur griego natural', 'lacteo', 'fat', 'BS', 3.3, 10, 4, 0, 50, 250, 'VL', { u: [125, 'yogur', 'yogures'] });
F('batido', 'Queso fresco batido 0 %', 'lacteo', 'protein', 'BS', 8, 0.2, 3.5, 0, 100, 500, 'VL');
F('cottage', 'Queso cottage', 'lacteo', 'protein', 'BSD', 11.1, 4.3, 3.4, 0, 80, 300, 'VL');
F('burgos', 'Queso fresco tipo Burgos', 'lacteo', 'protein', 'BSD', 12, 11, 3, 0, 50, 150, 'VL');
F('curado', 'Queso curado', 'lacteo', 'fat', 'BSD', 26, 32, 0.5, 0, 15, 50, 'V');
F('leche', 'Leche semidesnatada', 'lacteo', 'protein', 'BS', 3.2, 1.6, 4.7, 0, 150, 400, 'VL', { u: [250, 'vaso', 'vasos'], ml: 1 });
F('bebsoja', 'Bebida de soja sin azúcar', 'lacteo', 'protein', 'BS', 3.3, 1.8, 0.6, 0.6, 150, 400, 'N', { u: [250, 'vaso', 'vasos'], ml: 1 });
F('whey', 'Proteína whey (polvo)', 'lacteo', 'protein', 'BS', 78, 6, 7, 0, 20, 45, 'VL', { u: [30, 'cacito', 'cacitos'] });
// Proteína vegetal
F('guisante', 'Proteína vegetal en polvo', 'vprot', 'protein', 'BS', 80, 6, 3, 1, 20, 45, 'N', { u: [30, 'cacito', 'cacitos'] });
F('tofu', 'Tofu firme', 'vprot', 'protein', 'LD', 14, 8, 1.5, 1.5, 100, 300, 'N');
F('tempeh', 'Tempeh', 'vprot', 'protein', 'LD', 19, 11, 6, 4, 80, 250, 'N');
F('seitan', 'Seitán', 'vprot', 'protein', 'LD', 24, 2, 8, 1, 80, 250, 'NG');
F('sojatex', 'Soja texturizada (seca)', 'vprot', 'protein', 'LD', 50, 1.5, 17, 17, 30, 100, 'N', { raw: 1, cook: 3 });
// Legumbres
F('lentejas', 'Lentejas (cocidas/bote)', 'legum', 'carb', 'LD', 9, 0.4, 12.2, 7.9, 100, 400, 'N');
F('garbanzos', 'Garbanzos (cocidos/bote)', 'legum', 'carb', 'LD', 8.9, 2.6, 19.8, 7.6, 100, 400, 'N');
F('alubias', 'Alubias (cocidas/bote)', 'legum', 'carb', 'LD', 8.7, 0.5, 16.4, 6.4, 100, 400, 'N');
F('hummus', 'Hummus', 'legum', 'fat', 'S', 7.9, 9.6, 8.3, 6, 30, 120, 'N');
// Cereales y tubérculos
F('arroz', 'Arroz blanco', 'hc', 'carb', 'LD', 7, 0.6, 77, 1.3, 30, 150, 'N', { raw: 1, cook: 2.8 });
F('arrozint', 'Arroz integral', 'hc', 'carb', 'LD', 7.9, 2.9, 72.6, 3.6, 30, 150, 'N', { raw: 1, cook: 2.6 });
F('pasta', 'Pasta', 'hc', 'carb', 'LD', 13, 1.5, 71.8, 3.2, 30, 150, 'NG', { raw: 1, cook: 2.3 });
F('pastaint', 'Pasta integral', 'hc', 'carb', 'LD', 13.5, 2.5, 63, 8, 30, 150, 'NG', { raw: 1, cook: 2.3 });
F('quinoa', 'Quinoa', 'hc', 'carb', 'LD', 14.1, 6.1, 57.2, 7, 30, 130, 'N', { raw: 1, cook: 2.7 });
F('cuscus', 'Cuscús', 'hc', 'carb', 'LD', 12.8, 0.6, 67.4, 5, 30, 130, 'NG', { raw: 1, cook: 2.5 });
F('patata', 'Patata', 'hc', 'carb', 'LD', 2, 0.1, 15.4, 2.2, 100, 500, 'N', { raw: 1 });
F('boniato', 'Boniato', 'hc', 'carb', 'LD', 1.6, 0.1, 17.1, 3, 100, 450, 'N', { raw: 1 });
F('avena', 'Copos de avena', 'hc', 'carb', 'BS', 13.5, 7, 58.7, 10, 30, 110, 'NG');
F('panint', 'Pan integral', 'hc', 'carb', 'BSLD', 10, 3.5, 41, 7, 30, 150, 'NG', { u: [30, 'rebanada', 'rebanadas'] });
F('pan', 'Pan blanco (barra)', 'hc', 'carb', 'BSLD', 9, 1.6, 54, 2.7, 30, 150, 'NG');
F('tortitas', 'Tortitas de arroz o maíz', 'hc', 'carb', 'BS', 8, 2.8, 78, 3, 16, 64, 'N', { u: [8, 'tortita', 'tortitas'], round: 1 });
F('wrap', 'Tortilla de trigo (wrap)', 'hc', 'carb', 'SLD', 8.5, 7, 49, 3, 40, 120, 'NG', { u: [40, 'wrap', 'wraps'], round: 1 });
F('cereales', 'Cereales tipo corn flakes', 'hc', 'carb', 'B', 7.5, 0.9, 81, 3.3, 20, 80, 'NG');
// Grasas y frutos secos
F('aove', 'Aceite de oliva virgen extra', 'grasa', 'fat', 'BLD', 0, 100, 0, 0, 5, 30, 'N', { u: [10, 'cda', 'cdas'] });
F('aguacate', 'Aguacate', 'grasa', 'fat', 'BSLD', 2, 14.7, 1.8, 6.7, 30, 150, 'N');
F('almendras', 'Almendras', 'grasa', 'fat', 'BS', 21.2, 49.9, 9.1, 12.5, 10, 45, 'N', { u: [1.2, 'almendra', 'almendras'] });
F('nueces', 'Nueces', 'grasa', 'fat', 'BS', 15.2, 65.2, 7, 6.7, 10, 40, 'N', { u: [5, 'nuez', 'nueces'] });
F('cacahuete', 'Crema de cacahuete 100 %', 'grasa', 'fat', 'BS', 24, 50, 14, 6, 10, 40, 'N', { u: [15, 'cda', 'cdas'] });
F('chia', 'Semillas de chía', 'grasa', 'fat', 'BS', 16.5, 30.7, 7.7, 34.4, 5, 25, 'N');
F('choco', 'Chocolate negro 85 %', 'grasa', 'fat', 'S', 12, 46, 19, 11, 10, 30, 'N', { u: [10, 'onza', 'onzas'] });
F('aceitunas', 'Aceitunas', 'grasa', 'fat', 'LDS', 1, 15.3, 0.5, 3.3, 20, 80, 'N');
// Frutas (ración fija)
F('platano', 'Plátano', 'fruta', 'fruit', 'BS', 1.1, 0.3, 20.2, 2.6, 120, 120, 'N', { fixed: 120, u: [120, 'plátano', 'plátanos'] });
F('manzana', 'Manzana', 'fruta', 'fruit', 'BS', 0.3, 0.2, 11.4, 2.4, 180, 180, 'N', { fixed: 180, u: [180, 'manzana', 'manzanas'] });
F('naranja', 'Naranja', 'fruta', 'fruit', 'BS', 0.9, 0.1, 9.4, 2.4, 150, 150, 'N', { fixed: 150, u: [150, 'naranja', 'naranjas'] });
F('fresas', 'Fresas', 'fruta', 'fruit', 'BS', 0.7, 0.3, 5.7, 2, 200, 200, 'N', { fixed: 200 });
F('arandanos', 'Arándanos', 'fruta', 'fruit', 'BS', 0.7, 0.3, 12.1, 2.4, 100, 100, 'N', { fixed: 100 });
F('kiwi', 'Kiwi', 'fruta', 'fruit', 'BS', 1.1, 0.5, 11.7, 3, 150, 150, 'N', { fixed: 150, u: [75, 'kiwi', 'kiwis'] });
F('pera', 'Pera', 'fruta', 'fruit', 'BS', 0.4, 0.1, 12.1, 3.1, 170, 170, 'N', { fixed: 170, u: [170, 'pera', 'peras'] });
F('pina', 'Piña', 'fruta', 'fruit', 'BS', 0.5, 0.1, 11.7, 1.4, 200, 200, 'N', { fixed: 200 });
F('mango', 'Mango', 'fruta', 'fruit', 'BS', 0.8, 0.4, 13.4, 1.6, 150, 150, 'N', { fixed: 150 });
// Verduras (ración fija)
F('brocoli', 'Brócoli', 'verdura', 'veg', 'LD', 2.8, 0.4, 4.4, 2.6, 200, 200, 'N', { fixed: 200 });
F('espinacas', 'Espinacas', 'verdura', 'veg', 'LD', 2.9, 0.4, 1.4, 2.2, 200, 200, 'N', { fixed: 200 });
F('calabacin', 'Calabacín', 'verdura', 'veg', 'LD', 1.2, 0.3, 2.1, 1, 200, 200, 'N', { fixed: 200 });
F('ensalada', 'Ensalada (lechuga y tomate)', 'verdura', 'veg', 'LD', 1.1, 0.2, 2.2, 1.3, 200, 200, 'N', { fixed: 200 });
F('judias', 'Judías verdes', 'verdura', 'veg', 'LD', 1.8, 0.2, 4.3, 2.7, 200, 200, 'N', { fixed: 200 });
F('pimiento', 'Pimiento', 'verdura', 'veg', 'LD', 1, 0.3, 3.9, 2.1, 150, 150, 'N', { fixed: 150 });
F('champi', 'Champiñones', 'verdura', 'veg', 'LD', 3.1, 0.3, 2.3, 1, 200, 200, 'N', { fixed: 200 });
F('coliflor', 'Coliflor', 'verdura', 'veg', 'LD', 1.9, 0.3, 3, 2, 200, 200, 'N', { fixed: 200 });
F('esparragos', 'Espárragos verdes', 'verdura', 'veg', 'LD', 2.2, 0.1, 1.8, 2.1, 200, 200, 'N', { fixed: 200 });
F('menestra', 'Menestra de verduras', 'verdura', 'veg', 'LD', 2.5, 0.4, 6, 3.5, 200, 200, 'N', { fixed: 200 });
F('tomate', 'Tomate', 'verdura', 'veg', 'BLD', 0.9, 0.2, 2.7, 1.2, 150, 150, 'N', { fixed: 150 });

// ----- Más consumidos en España (USDA / BEDCA; platos: valores medios orientativos) -----
F('muslo', 'Muslo de pollo (sin piel)', 'prot', 'protein', 'LD', 19.7, 4.1, 0, 0, 100, 300, 'M', { raw: 1 });
F('hamburguesa', 'Hamburguesa de vacuno', 'prot', 'protein', 'LD', 17, 15, 1, 0, 90, 250, 'M', { raw: 1, u: [100, 'hamburguesa', 'hamburguesas'] });
F('conejo', 'Conejo', 'prot', 'protein', 'LD', 21, 5.5, 0, 0, 100, 300, 'M', { raw: 1 });
F('jamoncocido', 'Jamón cocido', 'prot', 'protein', 'BS', 19, 3, 1, 0, 30, 120, 'M', { u: [15, 'loncha', 'lonchas'] });
F('chorizo', 'Chorizo', 'prot', 'fat', 'BS', 24, 35, 2, 0, 15, 60, 'M');
F('salchichas', 'Salchichas tipo frankfurt', 'prot', 'protein', 'LD', 12, 20, 2, 0, 50, 200, 'M', { u: [50, 'salchicha', 'salchichas'] });
F('dorada', 'Dorada / lubina', 'prot', 'protein', 'LD', 19, 5, 0, 0, 100, 350, 'P', { raw: 1 });
F('sardinas', 'Sardinas en lata (escurridas)', 'prot', 'protein', 'LDS', 24.6, 11.5, 0, 0, 50, 200, 'P');
F('atunaceite', 'Atún en aceite (escurrido)', 'prot', 'protein', 'LDS', 29, 8, 0, 0, 52, 208, 'P', { u: [52, 'lata', 'latas'], round: 1 });
F('caballa', 'Caballa', 'prot', 'protein', 'LD', 18.6, 13.9, 0, 0, 80, 250, 'P', { raw: 1 });
F('calamares', 'Calamares', 'prot', 'protein', 'LD', 15.6, 1.4, 3.1, 0, 100, 350, 'P', { raw: 1 });
F('mejillones', 'Mejillones', 'prot', 'protein', 'LD', 11.9, 2.2, 3.7, 0, 100, 350, 'P');
F('lechentera', 'Leche entera', 'lacteo', 'protein', 'BS', 3.2, 3.6, 4.7, 0, 150, 400, 'VL', { u: [250, 'vaso', 'vasos'], ml: 1 });
F('lechedes', 'Leche desnatada', 'lacteo', 'protein', 'BS', 3.4, 0.2, 4.8, 0, 150, 400, 'VL', { u: [250, 'vaso', 'vasos'], ml: 1 });
F('yognat', 'Yogur natural', 'lacteo', 'protein', 'BS', 3.5, 3.3, 4.7, 0, 125, 375, 'VL', { u: [125, 'yogur', 'yogures'] });
F('yogsab', 'Yogur de sabores', 'lacteo', 'carb', 'BS', 3.4, 2.5, 13, 0, 125, 250, 'VL', { u: [125, 'yogur', 'yogures'] });
F('kefir', 'Kéfir', 'lacteo', 'protein', 'BS', 3.8, 1, 4.5, 0, 150, 400, 'VL', { ml: 1 });
F('mozzarella', 'Mozzarella', 'lacteo', 'fat', 'LDS', 18, 17, 2, 0, 30, 125, 'VL');
F('quesolonchas', 'Queso en lonchas', 'lacteo', 'fat', 'BS', 23, 27, 1, 0, 20, 60, 'VL', { u: [20, 'loncha', 'lonchas'] });
F('panmolde', 'Pan de molde', 'hc', 'carb', 'BS', 8.6, 3.7, 46, 3.2, 30, 120, 'NG', { u: [30, 'rebanada', 'rebanadas'] });
F('biscotes', 'Tostadas / biscotes', 'hc', 'carb', 'BS', 11, 6, 70, 4, 16, 64, 'NG', { u: [8, 'tostada', 'tostadas'] });
F('galletas', 'Galletas tipo María', 'hc', 'carb', 'BS', 7, 11, 74, 2, 20, 60, 'VG', { u: [6, 'galleta', 'galletas'] });
F('muesli', 'Muesli', 'hc', 'carb', 'B', 10, 6, 60, 8, 30, 90, 'NG');
F('arrozcocido', 'Arroz blanco (ya cocido)', 'hc', 'carb', 'LD', 2.7, 0.3, 27.6, 0.4, 80, 420, 'N');
F('pastacocida', 'Pasta (ya cocida)', 'hc', 'carb', 'LD', 5.8, 0.9, 29.2, 1.8, 80, 350, 'NG');
F('gnocchi', 'Ñoquis', 'hc', 'carb', 'LD', 3.6, 0.3, 30, 2, 100, 350, 'VG');
F('tortilla', 'Tortilla de patatas', 'platos', 'carb', 'LD', 6.5, 11, 12, 1.3, 100, 300, 'V');
F('paella', 'Paella mixta', 'platos', 'carb', 'LD', 7, 5, 20, 1, 150, 450, 'MP');
F('pizza', 'Pizza', 'platos', 'carb', 'LD', 11, 10, 29, 2, 100, 400, 'VGL');
F('croquetas', 'Croquetas', 'platos', 'fat', 'LD', 6, 13, 20, 1, 60, 200, 'MGL', { u: [30, 'croqueta', 'croquetas'] });
F('ensaladilla', 'Ensaladilla rusa', 'platos', 'fat', 'LD', 3.6, 12, 9, 1.5, 100, 300, 'P');
F('lentguisadas', 'Lentejas guisadas (plato)', 'platos', 'carb', 'LD', 6.5, 3, 11, 4.5, 200, 450, 'M');
F('gazpacho', 'Gazpacho', 'platos', 'veg', 'LD', 0.9, 2.6, 4, 1, 250, 250, 'N', { fixed: 250, ml: 1 });
F('patatasbolsa', 'Patatas fritas de bolsa', 'platos', 'fat', 'S', 6.6, 34, 49, 4.4, 20, 60, 'N', { diaryOnly: 1 });
F('patatasfritas', 'Patatas fritas (caseras)', 'platos', 'carb', 'LD', 3.4, 15, 37, 3.8, 100, 250, 'N', { diaryOnly: 1 });
F('uvas', 'Uvas', 'fruta', 'fruit', 'BS', 0.7, 0.2, 16.3, 0.9, 150, 150, 'N', { fixed: 150 });
F('sandia', 'Sandía', 'fruta', 'fruit', 'BS', 0.6, 0.2, 7.2, 0.4, 300, 300, 'N', { fixed: 300 });
F('melon', 'Melón', 'fruta', 'fruit', 'BS', 0.8, 0.2, 7.4, 0.9, 250, 250, 'N', { fixed: 250 });
F('melocoton', 'Melocotón', 'fruta', 'fruit', 'BS', 0.9, 0.3, 8, 1.5, 150, 150, 'N', { fixed: 150, u: [150, 'melocotón', 'melocotones'] });
F('mandarina', 'Mandarinas', 'fruta', 'fruit', 'BS', 0.8, 0.3, 11.5, 1.8, 140, 140, 'N', { fixed: 140, u: [70, 'mandarina', 'mandarinas'] });
F('cerezas', 'Cerezas', 'fruta', 'fruit', 'BS', 1.1, 0.2, 14, 2.1, 150, 150, 'N', { fixed: 150 });
F('zumo', 'Zumo de naranja natural', 'fruta', 'fruit', 'BS', 0.7, 0.2, 10.4, 0.2, 200, 200, 'N', { fixed: 200, ml: 1, u: [200, 'vaso', 'vasos'] });
F('zanahoria', 'Zanahoria', 'verdura', 'veg', 'LDS', 0.9, 0.2, 6.8, 2.8, 150, 150, 'N', { fixed: 150 });
F('berenjena', 'Berenjena', 'verdura', 'veg', 'LD', 1, 0.2, 2.9, 3, 200, 200, 'N', { fixed: 200 });
F('pepino', 'Pepino', 'verdura', 'veg', 'LD', 0.7, 0.1, 2.6, 0.5, 150, 150, 'N', { fixed: 150 });
F('alcachofas', 'Alcachofas', 'verdura', 'veg', 'LD', 3.3, 0.2, 5.1, 5.4, 200, 200, 'N', { fixed: 200 });
F('guisantes', 'Guisantes', 'verdura', 'veg', 'LD', 5.4, 0.4, 9.1, 5.1, 150, 150, 'N', { fixed: 150 });
F('repollo', 'Col / repollo', 'verdura', 'veg', 'LD', 1.3, 0.1, 3.3, 2.5, 200, 200, 'N', { fixed: 200 });
F('cebolla', 'Cebolla', 'verdura', 'veg', 'LD', 1.1, 0.1, 7.6, 1.7, 100, 100, 'N', { fixed: 100 });
F('pistachos', 'Pistachos', 'grasa', 'fat', 'BS', 20, 45, 17, 10.6, 10, 45, 'N');
F('anacardos', 'Anacardos', 'grasa', 'fat', 'BS', 18.2, 43.9, 26.9, 3.3, 10, 45, 'N');
F('pipas', 'Pipas de girasol (peladas)', 'grasa', 'fat', 'S', 20.8, 51.5, 11.4, 8.6, 10, 40, 'N');
F('mantequilla', 'Mantequilla', 'grasa', 'fat', 'B', 0.9, 81, 0.1, 0, 5, 20, 'VL');
F('mayonesa', 'Mayonesa', 'grasa', 'fat', 'LD', 1, 75, 0.6, 0, 5, 30, 'V', { u: [15, 'cda', 'cdas'] });
F('girasol', 'Aceite de girasol', 'grasa', 'fat', 'BLD', 0, 100, 0, 0, 5, 30, 'N', { u: [10, 'cda', 'cdas'] });
F('chocoleche', 'Chocolate con leche', 'grasa', 'fat', 'S', 7.7, 30, 57, 3.4, 10, 40, 'VL', { u: [10, 'onza', 'onzas'] });
F('cola', 'Refresco de cola', 'bebida', 'carb', 'S', 0, 0, 10.6, 0, 330, 330, 'N', { ml: 1, diaryOnly: 1 });
F('colazero', 'Refresco sin azúcar', 'bebida', 'carb', 'S', 0, 0, 0, 0, 330, 330, 'N', { ml: 1, diaryOnly: 1 });
F('cerveza', 'Cerveza', 'bebida', 'carb', 'LD', 0.5, 0, 3.6, 0, 330, 330, 'NG', { ml: 1, alc: 3.9, diaryOnly: 1 });
F('vino', 'Vino tinto', 'bebida', 'carb', 'LD', 0.1, 0, 2.6, 0, 150, 150, 'N', { ml: 1, alc: 10.6, diaryOnly: 1 });
F('cafeleche', 'Café con leche', 'bebida', 'protein', 'BS', 2.4, 2.1, 3.5, 0, 200, 200, 'VL', { ml: 1, diaryOnly: 1 });
F('colacao', 'Cacao soluble (polvo)', 'bebida', 'carb', 'B', 5.6, 3, 78, 6, 15, 30, 'N', { diaryOnly: 1 });
F('azucar', 'Azúcar', 'bebida', 'carb', 'BS', 0, 0, 100, 0, 5, 30, 'N', { diaryOnly: 1 });

// ----- Más variedad para el diario (por 100 g o 100 ml · USDA FoodData Central / BEDCA; platos: valores medios orientativos) -----
// D(id, nombre, categoría, P, G, HC sin fibra, fibra, ración [g, singular, plural], emoji, flags, extra)
function D(id, name, cat, p, f, c, fib, serv, em, flags = 'N', x = {}) {
    const role = cat === 'fruta' ? 'fruit' : cat === 'verdura' ? 'veg' : p * 4 >= Math.max(c * 4, f * 9) ? 'protein' : f * 9 > c * 4 ? 'fat' : 'carb';
    F(id, name, cat, role, 'BSLD', p, f, c, fib, 0, 0, flags, { diaryOnly: 1, serv, em, ...x });
}
// Carne
D('solomillocerdo', 'Solomillo de cerdo', 'prot', 21, 3.5, 0, 0, [150, 'ración', 'raciones'], '🥩', 'M', { raw: 1 });
D('costillas', 'Costillas de cerdo', 'prot', 17, 23, 0, 0, [200, 'ración', 'raciones'], '🍖', 'M', { raw: 1 });
D('cordero', 'Chuletas de cordero', 'prot', 16.5, 23, 0, 0, [150, 'ración', 'raciones'], '🍖', 'M', { raw: 1 });
D('entrecot', 'Entrecot de ternera', 'prot', 19, 15, 0, 0, [250, 'entrecot', 'entrecots'], '🥩', 'M', { raw: 1 });
D('higado', 'Hígado de ternera', 'prot', 20.4, 3.6, 3.9, 0, [125, 'filete', 'filetes'], '🥩', 'M', { raw: 1 });
D('polloasado', 'Pollo asado (con piel)', 'prot', 27, 13, 0, 0, [200, 'cuarto', 'cuartos'], '🍗', 'M');
D('pollopl', 'Pechuga de pollo a la plancha (hecha)', 'prot', 31, 3.6, 0, 0, [120, 'filete', 'filetes'], '🍗', 'M');
D('alitas', 'Alitas de pollo', 'prot', 17.5, 13, 0, 0, [150, 'ración', 'raciones'], '🍗', 'M', { raw: 1 });
D('nuggets', 'Nuggets de pollo', 'prot', 15, 18, 15, 1, [100, 'ración (6 uds)', 'raciones'], '🍗', 'MG');
D('escalope', 'Pechuga de pollo empanada', 'prot', 18, 12, 12, 0.8, [150, 'filete', 'filetes'], '🍗', 'MG');
D('lomoembuchado', 'Lomo embuchado', 'prot', 38, 11, 1, 0, [10, 'loncha', 'lonchas'], '🥓', 'M');
D('salchichon', 'Salchichón', 'prot', 25.8, 38, 1.5, 0, [10, 'loncha', 'lonchas'], '🥓', 'M');
D('bacon', 'Beicon', 'prot', 13, 40, 1, 0, [15, 'loncha', 'lonchas'], '🥓', 'M', { raw: 1 });
// Pescado y marisco
D('bacalao', 'Bacalao fresco', 'prot', 17.8, 0.7, 0, 0, [150, 'lomo', 'lomos'], '🐟', 'P', { raw: 1 });
D('atunfresco', 'Atún fresco', 'prot', 24.4, 0.5, 0, 0, [150, 'filete', 'filetes'], '🐟', 'P', { raw: 1 });
D('trucha', 'Trucha', 'prot', 20.8, 6.2, 0, 0, [150, 'pieza', 'piezas'], '🐟', 'P', { raw: 1 });
D('rape', 'Rape', 'prot', 14.5, 1.5, 0, 0, [150, 'ración', 'raciones'], '🐟', 'P', { raw: 1 });
D('boquerones', 'Boquerones', 'prot', 20.4, 4.8, 0, 0, [100, 'ración', 'raciones'], '🐟', 'P', { raw: 1 });
D('anchoas', 'Anchoas en aceite (escurridas)', 'prot', 28.9, 9.7, 0, 0, [30, 'lata pequeña', 'latas pequeñas'], '🐟', 'P');
D('salmonahumado', 'Salmón ahumado', 'prot', 18.3, 4.3, 0, 0, [50, 'ración', 'raciones'], '🐟', 'P');
D('pulpo', 'Pulpo', 'prot', 14.9, 1, 2.2, 0, [150, 'ración', 'raciones'], '🐙', 'P', { raw: 1 });
D('sepia', 'Sepia', 'prot', 16.2, 0.7, 0.8, 0, [150, 'ración', 'raciones'], '🦑', 'P', { raw: 1 });
D('almejas', 'Almejas', 'prot', 12.8, 1, 3.6, 0, [100, 'ración', 'raciones'], '🦪', 'P');
D('surimi', 'Surimi (palitos de cangrejo)', 'prot', 7.6, 0.5, 15, 0, [16, 'palito', 'palitos'], '🦀', 'PG');
// Huevo
D('huevofrito', 'Huevo frito', 'prot', 13.6, 14.8, 0.8, 0, [46, 'huevo', 'huevos'], '🍳', 'V');
D('revuelto', 'Huevos revueltos', 'prot', 10, 11, 1.6, 0, [120, 'ración', 'raciones'], '🍳', 'VL');
D('tortillafr', 'Tortilla francesa (2 huevos)', 'prot', 11, 15, 0.7, 0, [120, 'tortilla', 'tortillas'], '🍳', 'V');
// Lácteos
D('lechesinlac', 'Leche sin lactosa semidesnatada', 'lacteo', 3.2, 1.6, 4.7, 0, [250, 'vaso', 'vasos'], '🥛', 'V', { ml: 1 });
D('bebavena', 'Bebida de avena', 'lacteo', 1, 1.5, 6.5, 0.8, [250, 'vaso', 'vasos'], '🥛', 'NG', { ml: 1 });
D('bebalmendra', 'Bebida de almendra sin azúcar', 'lacteo', 0.5, 1.1, 0.1, 0.3, [250, 'vaso', 'vasos'], '🥛', 'N', { ml: 1 });
D('ricotta', 'Ricotta / requesón', 'lacteo', 11.3, 13, 3, 0, [60, 'ración', 'raciones'], '🧀', 'VL');
D('quesocabra', 'Queso de cabra (rulo)', 'lacteo', 18.5, 29.8, 0.9, 0, [30, 'rodaja', 'rodajas'], '🧀', 'VL');
D('parmesano', 'Queso parmesano', 'lacteo', 35.8, 25.8, 3.2, 0, [10, 'cucharada', 'cucharadas'], '🧀', 'V');
D('manchego', 'Queso manchego semicurado', 'lacteo', 26, 29, 0.5, 0, [30, 'cuña', 'cuñas'], '🧀', 'VL');
D('quesocrema', 'Queso crema (tipo untar)', 'lacteo', 5.9, 34.4, 4.1, 0, [20, 'cucharada', 'cucharadas'], '🧀', 'VL');
D('emmental', 'Queso emmental / rallado', 'lacteo', 27, 27.8, 1.4, 0, [30, 'puñado', 'puñados'], '🧀', 'V');
D('natacocinar', 'Nata para cocinar (18 %)', 'lacteo', 2.5, 18, 3.5, 0, [50, 'ración', 'raciones'], '🥛', 'VL', { ml: 1 });
D('natamontar', 'Nata para montar (35 %)', 'lacteo', 2.2, 35, 3, 0, [30, 'ración', 'raciones'], '🥛', 'VL', { ml: 1 });
D('flan', 'Flan de huevo', 'lacteo', 4.5, 4, 21, 0, [100, 'flan', 'flanes'], '🍮', 'VL');
D('natillas', 'Natillas', 'lacteo', 3.8, 3, 18, 0, [125, 'tarrina', 'tarrinas'], '🍮', 'VL');
D('arrozleche', 'Arroz con leche', 'lacteo', 3.5, 3, 21, 0.2, [125, 'tarrina', 'tarrinas'], '🍚', 'VL');
D('helado', 'Helado de vainilla', 'lacteo', 3.5, 11, 23, 0.7, [70, 'bola', 'bolas'], '🍨', 'VL');
D('batidochoco', 'Batido de chocolate', 'lacteo', 3.2, 1.5, 10, 0.5, [200, 'brik', 'briks'], '🥛', 'VL', { ml: 1 });
D('caseina', 'Caseína (polvo)', 'lacteo', 78, 1.5, 6, 0, [30, 'cacito', 'cacitos'], '🥤', 'VL');
D('barritaprot', 'Barrita de proteínas', 'lacteo', 30, 12, 30, 10, [60, 'barrita', 'barritas'], '🍫', 'VL');
// Cereales, pan y tubérculos
D('pancenteno', 'Pan de centeno', 'hc', 8.5, 3.3, 42.5, 5.8, [30, 'rebanada', 'rebanadas'], '🍞', 'NG');
D('panmulti', 'Pan de semillas / multicereal', 'hc', 9.5, 8, 38, 7, [30, 'rebanada', 'rebanadas'], '🍞', 'NG');
D('croissant', 'Cruasán', 'hc', 8.2, 21, 43.2, 2.6, [60, 'cruasán', 'cruasanes'], '🥐', 'VGL');
D('magdalena', 'Magdalena', 'hc', 6, 22, 52, 1.2, [30, 'magdalena', 'magdalenas'], '🧁', 'VGL');
D('donut', 'Dónut glaseado', 'hc', 5, 22, 50, 1.4, [50, 'dónut', 'dónuts'], '🍩', 'VGL');
D('bizcocho', 'Bizcocho casero', 'hc', 6, 17, 52, 1, [60, 'porción', 'porciones'], '🍰', 'VGL');
D('galletachoco', 'Galletas con chocolate', 'hc', 6.7, 23, 62, 3, [17, 'galleta', 'galletas'], '🍪', 'VGL');
D('palomitas', 'Palomitas (sin aceite)', 'hc', 12.9, 4.5, 63, 14.5, [25, 'bol', 'boles'], '🍿', 'N');
D('cremaarroz', 'Crema de arroz (polvo)', 'hc', 7, 1, 79, 1, [40, 'ración', 'raciones'], '🍚', 'N');
D('harina', 'Harina de trigo', 'hc', 10.3, 1, 73.6, 2.7, [30, 'cucharada colmada', 'cucharadas colmadas'], '🌾', 'NG');
D('harinaavena', 'Harina de avena', 'hc', 13.5, 7, 58.7, 10, [40, 'ración', 'raciones'], '🌾', 'NG');
D('maiz', 'Maíz dulce (lata, escurrido)', 'hc', 2.3, 1.2, 14.5, 1.9, [70, 'lata pequeña', 'latas pequeñas'], '🌽', 'N');
D('fideosarroz', 'Fideos de arroz (secos)', 'hc', 6, 0.6, 80, 1.6, [70, 'ración', 'raciones'], '🍜', 'N', { raw: 1 });
D('noodles', 'Fideos instantáneos (tipo ramen)', 'hc', 9, 17, 60, 2.5, [80, 'paquete', 'paquetes'], '🍜', 'NG');
D('pure', 'Puré de patata (con leche y mantequilla)', 'hc', 1.9, 4.2, 14.4, 1.5, [200, 'ración', 'raciones'], '🥔', 'VL');
// Legumbres y soja
D('edamame', 'Edamame', 'legum', 11.9, 5.2, 3.7, 5.2, [100, 'ración', 'raciones'], '🫛', 'N');
D('habas', 'Habas (cocidas)', 'legum', 7.6, 0.4, 14.3, 5.4, [150, 'ración', 'raciones'], '🫘', 'N');
D('soja', 'Soja (cocida)', 'legum', 18.2, 9, 2.4, 6, [150, 'ración', 'raciones'], '🫘', 'N');
// Frutas
D('higos', 'Higos', 'fruta', 0.8, 0.3, 16.3, 2.9, [50, 'higo', 'higos'], '🍈');
D('ciruelas', 'Ciruelas', 'fruta', 0.7, 0.3, 10, 1.4, [65, 'ciruela', 'ciruelas'], '🍑');
D('albaricoque', 'Albaricoques', 'fruta', 1.4, 0.4, 9.1, 2, [35, 'albaricoque', 'albaricoques'], '🍑');
D('frambuesas', 'Frambuesas', 'fruta', 1.2, 0.7, 5.4, 6.5, [125, 'tarrina', 'tarrinas'], '🫐');
D('moras', 'Moras', 'fruta', 1.4, 0.5, 4.3, 5.3, [125, 'tarrina', 'tarrinas'], '🫐');
D('granada', 'Granada', 'fruta', 1.7, 1.2, 14.7, 4, [150, 'media granada', 'medias granadas'], '🍎');
D('papaya', 'Papaya', 'fruta', 0.5, 0.3, 9.1, 1.7, [150, 'ración', 'raciones'], '🥭');
D('nectarina', 'Nectarina', 'fruta', 1.1, 0.3, 9.1, 1.7, [140, 'nectarina', 'nectarinas'], '🍑');
D('caqui', 'Caqui', 'fruta', 0.6, 0.2, 15, 3.6, [170, 'caqui', 'caquis'], '🍅');
D('pomelo', 'Pomelo', 'fruta', 0.8, 0.1, 9.1, 1.6, [250, 'medio pomelo', 'medios pomelos'], '🍊');
D('datiles', 'Dátiles', 'fruta', 1.8, 0.2, 68, 6.7, [24, 'dátil', 'dátiles'], '🌴');
D('pasas', 'Uvas pasas', 'fruta', 3.1, 0.5, 75.4, 3.7, [30, 'puñado', 'puñados'], '🍇');
D('coco', 'Coco rallado', 'fruta', 6.9, 64.5, 7.4, 16.3, [10, 'cucharada', 'cucharadas'], '🥥');
D('compota', 'Compota de manzana sin azúcar', 'fruta', 0.2, 0.1, 10.1, 1.2, [100, 'tarrina', 'tarrinas'], '🍎');
// Verduras y hortalizas
D('lechuga', 'Lechuga', 'verdura', 1.2, 0.3, 1.2, 2.1, [100, 'ración', 'raciones'], '🥬');
D('rucula', 'Rúcula', 'verdura', 2.6, 0.7, 2.1, 1.6, [50, 'puñado', 'puñados'], '🥬');
D('puerro', 'Puerro', 'verdura', 1.5, 0.3, 12.4, 1.8, [90, 'puerro', 'puerros'], '🧅');
D('ajo', 'Ajo', 'verdura', 6.4, 0.5, 31, 2.1, [5, 'diente', 'dientes'], '🧄');
D('calabaza', 'Calabaza', 'verdura', 1, 0.1, 6, 0.5, [200, 'ración', 'raciones'], '🎃');
D('remolacha', 'Remolacha (cocida)', 'verdura', 1.7, 0.2, 8, 2, [100, 'ración', 'raciones'], '🥗');
D('coles', 'Coles de Bruselas', 'verdura', 3.4, 0.3, 5.2, 3.8, [150, 'ración', 'raciones'], '🥬');
D('kale', 'Kale', 'verdura', 2.9, 1.5, 0.3, 4.1, [70, 'puñado', 'puñados'], '🥬');
D('apio', 'Apio', 'verdura', 0.7, 0.2, 1.4, 1.6, [40, 'rama', 'ramas'], '🥬');
D('tomatefrito', 'Tomate frito', 'verdura', 1.5, 3.5, 9, 1.5, [50, 'ración', 'raciones'], '🍅');
D('tomatetriturado', 'Tomate triturado (lata)', 'verdura', 1.6, 0.3, 5.4, 1.9, [100, 'ración', 'raciones'], '🍅');
D('pisto', 'Pisto', 'verdura', 1.5, 4, 6, 2, [150, 'ración', 'raciones'], '🍅');
// Platos
D('lasana', 'Lasaña de carne', 'platos', 7.5, 6, 13, 1.2, [300, 'ración', 'raciones'], '🍝', 'MGL');
D('macarronestom', 'Macarrones con tomate (plato)', 'platos', 5, 3, 25, 1.5, [300, 'plato', 'platos'], '🍝', 'NG');
D('empanada', 'Empanada de atún', 'platos', 9, 13, 30, 1.5, [150, 'porción', 'porciones'], '🥟', 'PG');
D('hamburguesacomp', 'Hamburguesa con pan (comida rápida)', 'platos', 13, 12, 28, 1.5, [200, 'hamburguesa', 'hamburguesas'], '🍔', 'MGL');
D('sushi', 'Sushi (maki variado)', 'platos', 5.5, 2.5, 28, 1, [30, 'pieza', 'piezas'], '🍣', 'P');
D('sandwichmixto', 'Sándwich mixto', 'platos', 13, 12, 26, 1.5, [120, 'sándwich', 'sándwiches'], '🥪', 'MGL');
D('arroz3', 'Arroz tres delicias', 'platos', 5, 5, 25, 1, [250, 'ración', 'raciones'], '🍚', 'M');
D('calamaresrom', 'Calamares a la romana', 'platos', 12, 13, 15, 0.6, [150, 'ración', 'raciones'], '🦑', 'PG');
D('bravas', 'Patatas bravas', 'platos', 2, 12, 20, 2, [200, 'ración', 'raciones'], '🥔', 'N');
// 3.0: platos típicos de España (valores medios orientativos de la receta tradicional, calculados por ingredientes)
D('cocido', 'Cocido madrileño (plato completo)', 'platos', 9, 7.5, 9, 3, [400, 'plato', 'platos'], '🍲', 'M');
D('fabada', 'Fabada asturiana', 'platos', 8.5, 9, 9, 4, [350, 'plato', 'platos'], '🍲', 'M');
D('salmorejo', 'Salmorejo', 'platos', 2, 7, 9, 1, [250, 'cuenco', 'cuencos'], '🍅', 'NG');
D('churros', 'Churros', 'platos', 5, 20, 45, 1.5, [20, 'churro', 'churros'], '🥨', 'NG');
D('albondigas', 'Albóndigas en salsa', 'platos', 12, 12, 6, 0.5, [200, 'ración', 'raciones'], '🧆', 'MG');
D('polloajillo', 'Pollo al ajillo', 'platos', 22, 12, 1, 0, [250, 'ración', 'raciones'], '🍗', 'M');
D('huevosrotos', 'Huevos rotos con jamón', 'platos', 8, 14, 15, 1.5, [300, 'plato', 'platos'], '🍳', 'M');
D('merluzaromana', 'Merluza a la romana', 'platos', 13, 10, 9, 0.5, [180, 'ración', 'raciones'], '🐟', 'PG');
D('bocadillojamon', 'Bocadillo de jamón serrano', 'platos', 15, 9, 40, 2, [150, 'bocadillo', 'bocadillos'], '🥖', 'MG');
D('pantomate', 'Tostada con tomate y aceite', 'platos', 7, 9, 40, 3, [70, 'tostada', 'tostadas'], '🍅', 'NG', { alias: 'pantomate' });
D('ensaladamixta', 'Ensalada mixta (con atún, huevo y aceitunas)', 'platos', 5, 6, 3, 1.5, [300, 'plato', 'platos'], '🥗', 'P');

// 3.1: alimentos ya cocinados (peso en el plato · USDA FoodData Central / BEDCA)
D('patatacocida', 'Patata cocida', 'hc', 1.9, 0.1, 17, 1.8, [200, 'patata mediana', 'patatas medianas'], '🥔');
D('patataasada', 'Patata asada (al horno)', 'hc', 2.5, 0.1, 19, 2.2, [200, 'patata mediana', 'patatas medianas'], '🥔');
D('boniatoasado', 'Boniato asado', 'hc', 2, 0.2, 17.5, 3.3, [200, 'boniato mediano', 'boniatos medianos'], '🍠');
D('arrozintcocido', 'Arroz integral (ya cocido)', 'hc', 2.6, 0.9, 22, 1.8, [200, 'plato', 'platos'], '🍚');
D('quinoacocida', 'Quinoa (ya cocida)', 'hc', 4.4, 1.9, 18.5, 2.8, [180, 'plato', 'platos'], '🌾');
D('cuscuscocido', 'Cuscús (ya cocido)', 'hc', 3.8, 0.2, 21.7, 1.4, [180, 'plato', 'platos'], '🌾', 'NG');
D('pastaintcocida', 'Pasta integral (ya cocida)', 'hc', 5.3, 0.9, 24, 3.9, [200, 'plato', 'platos'], '🍝', 'NG');
D('pavopl', 'Pechuga de pavo a la plancha (hecha)', 'prot', 29, 2, 0, 0, [120, 'filete', 'filetes'], '🦃', 'M');
D('terneraplancha', 'Filete de ternera a la plancha (hecho)', 'prot', 28, 7, 0, 0, [120, 'filete', 'filetes'], '🥩', 'M');
D('salmonpl', 'Salmón a la plancha (hecho)', 'prot', 25, 12, 0, 0, [130, 'lomo', 'lomos'], '🐟', 'P');
D('merluzapl', 'Merluza a la plancha (hecha)', 'prot', 21, 1.5, 0, 0, [150, 'lomo', 'lomos'], '🐟', 'P');
D('gambaspl', 'Gambas a la plancha (hechas)', 'prot', 24, 1.5, 0.2, 0, [120, 'ración', 'raciones'], '🦐', 'P');
D('brocolicocido', 'Brócoli cocido', 'verdura', 2.4, 0.4, 4.5, 3.3, [150, 'ración', 'raciones'], '🥦');
D('verduraspl', 'Verduras a la plancha', 'verdura', 1.5, 3, 5, 2.5, [200, 'ración', 'raciones'], '🥗');
// Desayunos, bollería y cafetería
D('panpita', 'Pan de pita', 'hc', 9, 1.2, 55, 2.2, [60, 'pan', 'panes'], '🫓', 'NG');
D('bagel', 'Bagel', 'hc', 10, 1.5, 50, 2.3, [100, 'bagel', 'bagels'], '🥯', 'NG');
D('pancakes', 'Tortitas americanas (pancakes)', 'hc', 6, 9, 32, 1, [40, 'tortita', 'tortitas'], '🥞', 'VGL');
D('gofre', 'Gofre', 'hc', 6, 14, 38, 1.2, [75, 'gofre', 'gofres'], '🧇', 'VGL');
D('crepe', 'Crepe', 'hc', 6, 7, 26, 0.8, [60, 'crepe', 'crepes'], '🥞', 'VGL');
D('granola', 'Granola', 'hc', 10, 18, 56, 7, [40, 'ración', 'raciones'], '🥣', 'NG');
D('napolitana', 'Napolitana de chocolate', 'hc', 6, 22, 45, 2, [80, 'napolitana', 'napolitanas'], '🥐', 'VGL');
D('ensaimada', 'Ensaimada', 'hc', 7, 22, 48, 1.5, [70, 'ensaimada', 'ensaimadas'], '🥐', 'VGL');
D('chocolatetaza', 'Chocolate a la taza', 'bebida', 3.5, 5, 16, 1.5, [200, 'taza', 'tazas'], '☕', 'VL', { ml: 1 });
D('cortado', 'Café cortado', 'bebida', 1.3, 1.2, 1.8, 0, [100, 'taza', 'tazas'], '☕', 'VL', { ml: 1 });
D('capuchino', 'Capuchino', 'bebida', 2.5, 2, 4, 0, [250, 'taza', 'tazas'], '☕', 'VL', { ml: 1 });
D('te', 'Té o infusión (sin azúcar)', 'bebida', 0, 0, 0.2, 0, [250, 'taza', 'tazas'], '🍵', 'N', { ml: 1 });
D('agua', 'Agua', 'bebida', 0, 0, 0, 0, [250, 'vaso', 'vasos'], '💧', 'N', { ml: 1 });
// Comida rápida e internacional (valores medios orientativos)
D('kebab', 'Kebab (pan de pita con carne)', 'platos', 12, 10, 22, 1.5, [300, 'kebab', 'kebabs'], '🥙', 'MG');
D('durum', 'Dürüm de pollo', 'platos', 11, 9, 22, 1.5, [350, 'dürüm', 'dürüms'], '🌯', 'MG');
D('falafel', 'Falafel', 'platos', 13, 18, 28, 5, [17, 'bola', 'bolas'], '🧆', 'N');
D('burrito', 'Burrito de carne', 'platos', 9, 7, 22, 2.5, [250, 'burrito', 'burritos'], '🌯', 'MGL');
D('tacos', 'Tacos de carne (tortilla de maíz)', 'platos', 10, 9, 18, 2.5, [80, 'taco', 'tacos'], '🌮', 'M');
D('nachosqueso', 'Nachos con queso', 'platos', 8, 19, 33, 3, [150, 'ración', 'raciones'], '🧀', 'VL');
D('fajitas', 'Fajita de pollo', 'platos', 12, 6, 18, 2, [180, 'fajita', 'fajitas'], '🌯', 'MG');
D('chili', 'Chili con carne', 'platos', 9, 6, 9, 3.5, [300, 'plato', 'platos'], '🌶️', 'M');
D('pollocurry', 'Pollo al curry', 'platos', 13, 8, 5, 1, [250, 'ración', 'raciones'], '🍛', 'M');
D('tikka', 'Pollo tikka masala', 'platos', 12, 9, 6, 1, [250, 'ración', 'raciones'], '🍛', 'ML');
D('padthai', 'Pad thai', 'platos', 8, 7, 25, 1.5, [350, 'plato', 'platos'], '🍜', 'P');
D('ramen', 'Ramen (sopa con fideos y carne)', 'platos', 5, 3, 12, 1, [500, 'cuenco', 'cuencos'], '🍜', 'MG');
D('gyozas', 'Gyozas', 'platos', 8, 8, 25, 1.5, [20, 'gyoza', 'gyozas'], '🥟', 'MG');
D('rollito', 'Rollito de primavera', 'platos', 5, 12, 25, 2, [60, 'rollito', 'rollitos'], '🥢', 'MG');
D('nigiri', 'Nigiri de salmón', 'platos', 8, 3, 26, 0.3, [35, 'pieza', 'piezas'], '🍣', 'P');
D('sashimi', 'Sashimi de salmón', 'prot', 20, 13, 0, 0, [15, 'loncha', 'lonchas'], '🍣', 'P');
D('poke', 'Poke bowl de salmón', 'platos', 9, 6, 18, 1.5, [400, 'bol', 'boles'], '🥗', 'P');
D('ceviche', 'Ceviche', 'platos', 15, 1, 5, 0.8, [200, 'ración', 'raciones'], '🐟', 'P');
D('hamburguesaveg', 'Hamburguesa vegetal', 'vprot', 15, 9, 8, 4, [110, 'hamburguesa', 'hamburguesas'], '🌱', 'N');
D('hamburguesaqueso', 'Hamburguesa con queso (comida rápida)', 'platos', 14, 13, 25, 1.5, [220, 'hamburguesa', 'hamburguesas'], '🍔', 'MGL');
D('perrito', 'Perrito caliente', 'platos', 10, 15, 24, 1, [120, 'perrito', 'perritos'], '🌭', 'MG');
D('pollofrito', 'Pollo frito rebozado', 'platos', 20, 15, 10, 0.5, [150, 'ración', 'raciones'], '🍗', 'MG');
D('pizzamarg', 'Pizza margarita', 'platos', 11, 9, 31, 2, [110, 'porción', 'porciones'], '🍕', 'VGL');
D('pizzabarb', 'Pizza barbacoa', 'platos', 11, 11, 29, 1.8, [120, 'porción', 'porciones'], '🍕', 'MGL');
D('pizza4q', 'Pizza cuatro quesos', 'platos', 13, 13, 28, 1.5, [110, 'porción', 'porciones'], '🍕', 'VGL');
D('carbonara', 'Espaguetis carbonara', 'platos', 8, 10, 25, 1.2, [350, 'plato', 'platos'], '🍝', 'MGL');
D('bolonesa', 'Espaguetis a la boloñesa', 'platos', 7, 5, 19, 1.8, [350, 'plato', 'platos'], '🍝', 'MG');
D('pesto', 'Pasta al pesto', 'platos', 6, 10, 26, 1.5, [300, 'plato', 'platos'], '🍝', 'VGL');
D('risotto', 'Risotto de setas', 'platos', 4, 6, 20, 1, [300, 'plato', 'platos'], '🍚', 'VL');
D('ensaladacesar', 'Ensalada César con pollo', 'platos', 9, 10, 5, 1.5, [300, 'plato', 'platos'], '🥗', 'MGL');
D('ensaladapasta', 'Ensalada de pasta', 'platos', 5, 6, 18, 1.5, [300, 'plato', 'platos'], '🥗', 'PG');
D('quiche', 'Quiche', 'platos', 9, 18, 17, 1, [150, 'porción', 'porciones'], '🥧', 'MGL');
D('acai', 'Bowl de açaí', 'platos', 2, 4, 22, 3, [300, 'bol', 'boles'], '🫐', 'N');
D('smoothie', 'Smoothie de frutas', 'bebida', 0.8, 0.3, 12, 1.2, [300, 'vaso', 'vasos'], '🥤', 'N', { ml: 1 });
// Platos y tapas de España (valores medios orientativos)
D('pulpogallega', 'Pulpo a la gallega (con patata)', 'platos', 18, 8, 8, 0.8, [200, 'ración', 'raciones'], '🐙', 'P');
D('gambasajillo', 'Gambas al ajillo', 'platos', 18, 14, 1, 0, [150, 'cazuela', 'cazuelas'], '🦐', 'P');
D('boquefritos', 'Boquerones fritos', 'platos', 19, 14, 7, 0.3, [150, 'ración', 'raciones'], '🐟', 'PG');
D('arrozpollo', 'Arroz con pollo', 'platos', 9, 5, 20, 0.8, [350, 'plato', 'platos'], '🍚', 'M');
D('arroznegro', 'Arroz negro', 'platos', 8, 6, 22, 0.6, [300, 'plato', 'platos'], '🍚', 'P');
D('fideua', 'Fideuá', 'platos', 8, 6, 22, 1, [300, 'plato', 'platos'], '🥘', 'PG');
D('estofado', 'Estofado de ternera con patatas', 'platos', 10, 5, 8, 1.2, [350, 'plato', 'platos'], '🍲', 'M');
D('callos', 'Callos a la madrileña', 'platos', 13, 9, 3, 0.5, [250, 'ración', 'raciones'], '🍲', 'M');
D('rabotoro', 'Rabo de toro', 'platos', 17, 14, 3, 0.5, [250, 'ración', 'raciones'], '🍲', 'M');
D('carrillada', 'Carrillada en salsa', 'platos', 20, 10, 4, 0.5, [200, 'ración', 'raciones'], '🍖', 'M');
D('secreto', 'Secreto ibérico (hecho)', 'prot', 17, 25, 0, 0, [150, 'ración', 'raciones'], '🥩', 'M');
D('chuleton', 'Chuletón de ternera (hecho)', 'prot', 25, 18, 0, 0, [400, 'chuletón', 'chuletones'], '🥩', 'M');
D('costillasbbq', 'Costillas a la barbacoa', 'platos', 20, 18, 8, 0.3, [300, 'ración', 'raciones'], '🍖', 'M');
D('migas', 'Migas', 'platos', 8, 15, 35, 2, [250, 'plato', 'platos'], '🍞', 'MG');
D('pimientospadron', 'Pimientos de Padrón', 'verdura', 1.5, 6, 3, 2, [100, 'ración', 'raciones'], '🫑');
D('empanadilla', 'Empanadilla de atún', 'platos', 8, 15, 28, 1.5, [40, 'empanadilla', 'empanadillas'], '🥟', 'PG');
D('patatasalioli', 'Patatas alioli', 'platos', 2, 20, 15, 1.6, [150, 'ración', 'raciones'], '🥔', 'V');
D('bocatortilla', 'Bocadillo de tortilla de patatas', 'platos', 8, 9, 35, 2, [200, 'bocadillo', 'bocadillos'], '🥖', 'VG');
D('bocalomo', 'Bocadillo de lomo', 'platos', 15, 8, 35, 2, [180, 'bocadillo', 'bocadillos'], '🥖', 'MG');
D('montadito', 'Montadito (variado)', 'platos', 11, 10, 33, 1.8, [60, 'montadito', 'montaditos'], '🥪', 'MG');
D('sandpollo', 'Sándwich de pollo', 'platos', 13, 8, 25, 2, [150, 'sándwich', 'sándwiches'], '🥪', 'MG');
D('cremaverduras', 'Crema de verduras', 'platos', 1.5, 2.5, 6, 1.5, [300, 'plato', 'platos'], '🥣', 'N');
D('sopafideos', 'Sopa de fideos', 'platos', 3, 1, 7, 0.4, [300, 'plato', 'platos'], '🍜', 'MG');
D('caldo', 'Caldo de pollo', 'platos', 1.5, 0.5, 0.5, 0, [250, 'taza', 'tazas'], '🥣', 'M', { ml: 1 });
D('purecalabaza', 'Puré de calabaza', 'platos', 1.2, 2, 7, 1.5, [300, 'plato', 'platos'], '🎃', 'V');
// Postres y picoteo
D('tartaqueso', 'Tarta de queso', 'platos', 6, 22, 25, 0.3, [120, 'porción', 'porciones'], '🍰', 'VGL');
D('tiramisu', 'Tiramisú', 'platos', 5, 17, 28, 0.5, [120, 'porción', 'porciones'], '🍰', 'VGL');
D('brownie', 'Brownie', 'platos', 5, 22, 50, 2, [60, 'brownie', 'brownies'], '🍫', 'VGL');
D('barritacereal', 'Barrita de cereales', 'hc', 6, 12, 62, 4, [25, 'barrita', 'barritas'], '🍫', 'NG');
D('frutossecos', 'Frutos secos variados', 'grasa', 20, 52, 15, 7, [30, 'puñado', 'puñados'], '🥜');
// Bebidas
D('tinto', 'Tinto de verano', 'bebida', 0.1, 0, 4.5, 0, [300, 'vaso', 'vasos'], '🍷', 'N', { ml: 1, alc: 3.5 });
D('sangria', 'Sangría', 'bebida', 0.1, 0, 9, 0, [250, 'vaso', 'vasos'], '🍷', 'N', { ml: 1, alc: 4 });
D('gintonic', 'Gin tonic', 'bebida', 0, 0, 4, 0, [300, 'copa', 'copas'], '🍸', 'N', { ml: 1, alc: 7 });
D('vermut', 'Vermut', 'bebida', 0, 0, 14, 0, [100, 'vaso', 'vasos'], '🍸', 'N', { ml: 1, alc: 12 });
D('aquarius', 'Bebida isotónica tipo Aquarius', 'bebida', 0, 0, 7, 0, [330, 'lata', 'latas'], '🥤', 'N', { ml: 1 });
D('teefrio', 'Té frío envasado (tipo Nestea)', 'bebida', 0, 0, 7.5, 0, [330, 'lata', 'latas'], '🥤', 'N', { ml: 1 });
D('naranjada', 'Refresco de naranja', 'bebida', 0, 0, 10.5, 0, [330, 'lata', 'latas'], '🥤', 'N', { ml: 1 });
D('bebidaprot', 'Batido de proteínas listo para beber', 'lacteo', 8, 1, 4, 0, [330, 'botella', 'botellas'], '🥤', 'VL', { ml: 1 });
// Salsas y para untar
D('ketchup', 'Kétchup', 'grasa', 1, 0.1, 25, 0.3, [15, 'cucharada', 'cucharadas'], '🍅');
D('mostaza', 'Mostaza', 'grasa', 3.7, 3.3, 1.8, 4, [10, 'cucharadita', 'cucharaditas'], '🌭');
D('salsasoja', 'Salsa de soja', 'grasa', 8.1, 0.6, 4.9, 0.8, [15, 'cucharada', 'cucharadas'], '🥢', 'NG', { ml: 1 });
D('barbacoa', 'Salsa barbacoa', 'grasa', 0.8, 0.6, 39.9, 0.9, [15, 'cucharada', 'cucharadas'], '🍖');
D('guacamole', 'Guacamole', 'grasa', 2, 14, 2.5, 6, [50, 'ración', 'raciones'], '🥑');
D('miel', 'Miel', 'grasa', 0.3, 0, 82, 0.2, [20, 'cucharada', 'cucharadas'], '🍯');
D('mermelada', 'Mermelada', 'grasa', 0.4, 0.1, 63, 1, [20, 'cucharada', 'cucharadas'], '🍓');
D('cremacacao', 'Crema de cacao y avellanas', 'grasa', 6.3, 30.9, 57.5, 3.4, [15, 'cucharada', 'cucharadas'], '🍫', 'VL');
D('sirope', 'Sirope de arce', 'grasa', 0, 0.1, 67, 0, [20, 'cucharada', 'cucharadas'], '🍁');
// Frutos secos y semillas
D('avellanas', 'Avellanas', 'grasa', 15, 60.8, 7, 9.7, [30, 'puñado', 'puñados'], '🌰');
D('cacahuetes', 'Cacahuetes tostados', 'grasa', 24.4, 49.7, 13.5, 8, [30, 'puñado', 'puñados'], '🥜');
D('macadamia', 'Nueces de macadamia', 'grasa', 7.9, 75.8, 5.2, 8.6, [30, 'puñado', 'puñados'], '🌰');
D('lino', 'Semillas de lino', 'grasa', 18.3, 42.2, 1.6, 27.3, [10, 'cucharada', 'cucharadas'], '🌾');
D('pipascalabaza', 'Pipas de calabaza (peladas)', 'grasa', 30.2, 49, 4.7, 6, [30, 'puñado', 'puñados'], '🎃');
D('tahini', 'Tahini (crema de sésamo)', 'grasa', 17, 53.8, 11.9, 9.3, [15, 'cucharada', 'cucharadas'], '🥄');
D('cremaalmendra', 'Crema de almendras', 'grasa', 21, 55.5, 8.5, 10.3, [15, 'cucharada', 'cucharadas'], '🥄');
// Bebidas
D('cafesolo', 'Café solo', 'bebida', 0.1, 0, 0, 0, [50, 'taza', 'tazas'], '☕', 'N', { ml: 1 });
D('nectar', 'Néctar / zumo envasado', 'bebida', 0.3, 0.1, 13, 0.3, [200, 'brik', 'briks'], '🧃', 'N', { ml: 1 });
D('isotonica', 'Bebida isotónica', 'bebida', 0, 0, 6, 0, [500, 'botella', 'botellas'], '🥤', 'N', { ml: 1 });
D('energetica', 'Bebida energética', 'bebida', 0, 0, 11, 0, [250, 'lata', 'latas'], '🥤', 'N', { ml: 1 });
D('cerveza00', 'Cerveza sin alcohol', 'bebida', 0.3, 0, 4.5, 0, [330, 'lata', 'latas'], '🍺', 'NG', { ml: 1 });
D('lechecoco', 'Leche de coco (lata)', 'bebida', 2, 21.3, 2.8, 0, [100, 'ración', 'raciones'], '🥥', 'N', { ml: 1 });
D('destilado', 'Ron / whisky / ginebra (40 %)', 'bebida', 0, 0, 0, 0, [50, 'copa', 'copas'], '🥃', 'N', { ml: 1, alc: 31.6 });
// Dulces
D('gominolas', 'Gominolas', 'bebida', 6, 0.2, 77, 0, [25, 'puñado', 'puñados'], '🍬');

// Raciones habituales para apuntar en el diario ("1 filete", "1 ración (80 g)"), como en FatSecret
const SERV = {
    pollo: [150, 'filete', 'filetes'], pavo: [125, 'filete', 'filetes'], ternera: [125, 'filete', 'filetes'], cerdo: [125, 'filete', 'filetes'],
    picada: [125, 'ración', 'raciones'], salmon: [125, 'lomo', 'lomos'], merluza: [150, 'lomo', 'lomos'], gambas: [100, 'ración', 'raciones'],
    muslo: [100, 'muslo', 'muslos'], conejo: [150, 'ración', 'raciones'], dorada: [200, 'pieza', 'piezas'], caballa: [150, 'pieza', 'piezas'],
    calamares: [150, 'ración', 'raciones'], mejillones: [150, 'ración', 'raciones'], sardinas: [60, 'lata', 'latas'],
    arroz: [80, 'ración', 'raciones'], arrozint: [80, 'ración', 'raciones'], pasta: [80, 'ración', 'raciones'], pastaint: [80, 'ración', 'raciones'],
    quinoa: [60, 'ración', 'raciones'], cuscus: [60, 'ración', 'raciones'], arrozcocido: [200, 'plato', 'platos'], pastacocida: [200, 'plato', 'platos'],
    gnocchi: [150, 'ración', 'raciones'], patata: [200, 'patata mediana', 'patatas medianas'], boniato: [200, 'boniato mediano', 'boniatos medianos'],
    avena: [40, 'ración', 'raciones'], pan: [60, 'ración', 'raciones'], cereales: [30, 'ración', 'raciones'], muesli: [40, 'ración', 'raciones'],
    lentejas: [200, 'ración', 'raciones'], garbanzos: [200, 'ración', 'raciones'], alubias: [200, 'ración', 'raciones'], hummus: [30, 'cucharada', 'cucharadas'],
    tofu: [100, 'ración', 'raciones'], tempeh: [100, 'ración', 'raciones'], seitan: [100, 'ración', 'raciones'],
    aguacate: [75, 'medio aguacate', 'medios aguacates'], chia: [10, 'cucharada', 'cucharadas'], aceitunas: [30, 'ración', 'raciones'],
    pistachos: [30, 'puñado', 'puñados'], anacardos: [30, 'puñado', 'puñados'], pipas: [30, 'puñado', 'puñados'],
    mantequilla: [10, 'cucharadita', 'cucharaditas'], cottage: [100, 'ración', 'raciones'], batido: [150, 'ración', 'raciones'], burgos: [60, 'ración', 'raciones'],
    curado: [20, 'taco', 'tacos'], mozzarella: [30, 'ración', 'raciones'], kefir: [200, 'vaso', 'vasos'],
    tortilla: [150, 'ración', 'raciones'], paella: [300, 'plato', 'platos'], pizza: [150, 'porción', 'porciones'], ensaladilla: [150, 'ración', 'raciones'],
    lentguisadas: [300, 'plato', 'platos'], cafeleche: [200, 'taza', 'tazas'], cerveza: [330, 'lata', 'latas'], vino: [150, 'copa', 'copas'], cola: [330, 'lata', 'latas'], colazero: [330, 'lata', 'latas'], colacao: [15, 'cucharada', 'cucharadas'], azucar: [8, 'sobre', 'sobres'], patatasfritas: [150, 'ración', 'raciones'], patatasbolsa: [30, 'puñado', 'puñados'], chorizo: [20, 'ración', 'raciones'],
};
Object.entries(SERV).forEach(([id, s]) => { const f = FOODS.find(x => x.id === id); if (f && !f.u) f.serv = s; });

// <usda> (lo genera tools/genericos/embed.js · USDA FoodData Central, SR Legacy, dominio público · 2026-10-14)
// Alimentos crudos y cocinados con su ficha oficial (fdc = número de la ficha). HC sin fibra, como las etiquetas de la UE.
D("u_pollo_asado_sin", "Pechuga de pollo asada (sin piel)", 'prot', 31, 3.6, 0, 0, [120,"filete","filetes"], '', 'M', {"fdc":171477});
D("u_pollo_guisado", "Pechuga de pollo guisada / hervida", 'prot', 29, 3, 0, 0, [120,"filete","filetes"], '', 'M', {"fdc":171478});
D("u_pollo_frito_sin", "Pechuga de pollo frita (sin rebozar)", 'prot', 33.4, 4.7, 0.5, 0, [120,"filete","filetes"], '', 'M', {"fdc":171078});
D("u_muslo_crudo", "Muslo de pollo crudo (sin piel)", 'prot', 19.7, 4.1, 0, 0, [100,"muslo","muslos"], '', 'M', {"raw":1,"fdc":173627});
D("u_muslo_asado", "Muslo de pollo asado (sin piel)", 'prot', 24.8, 8.2, 0, 0, [90,"muslo","muslos"], '', 'M', {"fdc":172388});
D("u_muslo_asado_piel", "Muslo de pollo asado (con piel)", 'prot', 23.3, 14.7, 0, 0, [100,"muslo","muslos"], '', 'M', {"fdc":173625});
D("u_contramuslo_crudo", "Contramuslo de pollo crudo (con piel)", 'prot', 16.5, 16.6, 0.3, 0, [120,"contramuslo","contramuslos"], '', 'M', {"raw":1,"fdc":172385});
D("u_alitas_crudas", "Alitas de pollo crudas", 'prot', 17.5, 12.9, 0, 0, [90,"alita","alitas"], '', 'M', {"raw":1,"fdc":172390});
D("u_pollo_entero_asado", "Pollo asado (carne sin piel, mezcla)", 'prot', 28.9, 7.4, 0, 0, [150,"ración","raciones"], '', 'M', {"fdc":171054});
D("u_higado_pollo", "Hígado de pollo (hecho)", 'prot', 24.5, 6.5, 0.9, 0, [100,"ración","raciones"], '', 'M', {"fdc":171061});
D("u_pavo_asado", "Pechuga de pavo asada", 'prot', 30.1, 2.1, 0, 0, [120,"filete","filetes"], '', 'M', {"fdc":171496});
D("u_pavo_picado", "Carne picada de pavo (cruda)", 'prot', 19.7, 7.7, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"fdc":171505});
D("u_pavo_picado_hecho", "Carne picada de pavo (hecha)", 'prot', 27.4, 10.4, 0, 0, [110,"ración","raciones"], '', 'M', {"fdc":171506});
D("u_picada5", "Carne picada vacuno 5 % (cruda)", 'prot', 21.4, 5, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"fdc":171790});
D("u_picada5_hecha", "Carne picada vacuno 5 % (hecha)", 'prot', 29.2, 7.6, 0, 0, [100,"ración","raciones"], '', 'M', {"fdc":174028});
D("u_picada10_hecha", "Carne picada vacuno 10 % (hecha)", 'prot', 28.5, 12, 0, 0, [100,"ración","raciones"], '', 'M', {"fdc":171794});
D("u_picada20", "Carne picada vacuno 20 % (cruda)", 'prot', 17.2, 20, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"fdc":174036});
D("u_picada20_hecha", "Carne picada vacuno 20 % (hecha)", 'prot', 27, 17.4, 0, 0, [100,"ración","raciones"], '', 'M', {"fdc":171799});
D("u_solomillo_ternera", "Solomillo de ternera (crudo)", 'prot', 22.1, 6.5, 0, 0, [150,"filete","filetes"], '', 'M', {"raw":1,"fdc":171812});
D("u_solomillo_ternera_hecho", "Solomillo de ternera a la plancha", 'prot', 29, 8.4, 0, 0, [130,"filete","filetes"], '', 'M', {"fdc":171811});
D("u_falda_ternera", "Falda de ternera a la plancha", 'prot', 27.8, 8.3, 0, 0, [130,"filete","filetes"], '', 'M', {"fdc":168611});
D("u_lomo_alto", "Lomo alto / chuletón (crudo)", 'prot', 19.3, 19.1, 0, 0, [300,"chuletón","chuletones"], '', 'M', {"raw":1,"fdc":169509});
D("u_redondo", "Redondo de ternera asado", 'prot', 29.7, 4.7, 0, 0, [130,"ración","raciones"], '', 'M', {"fdc":171809});
D("u_ternera_guisada", "Ternera para guisar (hecha)", 'prot', 32.4, 6.8, 0, 0, [130,"ración","raciones"], '', 'M', {"fdc":171203});
D("u_higado_ternera_hecho", "Hígado de ternera a la plancha", 'prot', 26.5, 4.7, 5.2, 0, [110,"filete","filetes"], '', 'M', {"fdc":168627});
D("u_lengua", "Lengua de ternera (hecha)", 'prot', 19.3, 22.3, 0, 0, [100,"ración","raciones"], '', 'M', {"fdc":170598});
D("u_burger_casera", "Hamburguesa de vacuno a la plancha (85 %)", 'prot', 24.6, 14, 0, 0, [100,"hamburguesa","hamburguesas"], '', 'M', {"fdc":174033});
D("u_lomo_cerdo_hecho", "Lomo de cerdo a la plancha", 'prot', 30, 4.7, 0, 0, [120,"filete","filetes"], '', 'M', {"fdc":168285});
D("u_solomillo_cerdo_asado", "Solomillo de cerdo asado", 'prot', 26.2, 3.5, 0, 0, [130,"ración","raciones"], '', 'M', {"fdc":168250});
D("u_chuleta_cerdo", "Chuleta de cerdo frita", 'prot', 26.8, 15.7, 0, 0, [120,"chuleta","chuletas"], '', 'M', {"fdc":168293});
D("u_chuleta_cerdo_hecha", "Chuleta de cerdo a la plancha", 'prot', 24.4, 13, 0, 0, [120,"chuleta","chuletas"], '', 'M', {"fdc":167831});
D("u_cerdo_picado", "Carne picada de cerdo (cruda)", 'prot', 16.9, 21.2, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"fdc":167902});
D("u_cerdo_picado_hecho", "Carne picada de cerdo (hecha)", 'prot', 25.7, 20.8, 0, 0, [100,"ración","raciones"], '', 'M', {"fdc":167903});
D("u_panceta", "Panceta / tocino fresco", 'prot', 9.3, 53, 0, 0, [50,"loncha","lonchas"], '', 'M', {"raw":1,"fdc":167812});
D("u_bacon_frito", "Beicon frito", 'prot', 37, 41.8, 1.4, 0, [10,"loncha","lonchas"], '', 'M', {"fdc":167712});
D("u_paletilla_cerdo", "Paleta de cerdo asada", 'prot', 23.3, 21.4, 0, 0, [130,"ración","raciones"], '', 'M', {"fdc":167844});
D("u_cordero_pierna", "Pierna de cordero asada", 'prot', 26.4, 12.5, 0, 0, [150,"ración","raciones"], '', 'M', {"fdc":172485});
D("u_cordero_chuleta_hecha", "Chuletas de cordero a la plancha", 'prot', 25.2, 23.1, 0, 0, [120,"ración","raciones"], '', 'M', {"fdc":172489});
D("u_conejo_hecho", "Conejo guisado", 'prot', 30.4, 8.4, 0, 0, [150,"ración","raciones"], '', 'M', {"fdc":174346});
D("u_pato", "Pato asado (sin piel)", 'prot', 23.5, 11.2, 0, 0, [130,"ración","raciones"], '', 'M', {"fdc":172411});
D("u_codorniz", "Codorniz asada", 'prot', 25.1, 14.1, 0, 0, [100,"codorniz","codornices"], '', 'M', {"fdc":169902});
D("u_salmon_horno", "Salmón al horno", 'prot', 22.1, 12.4, 0, 0, [130,"lomo","lomos"], '', 'P', {"fdc":175168});
D("u_salmon_salvaje", "Salmón salvaje (crudo)", 'prot', 19.8, 6.3, 0, 0, [150,"lomo","lomos"], '', 'P', {"raw":1,"fdc":173686});
D("u_bacalao_hecho", "Bacalao fresco al horno", 'prot', 22.8, 0.9, 0, 0, [150,"lomo","lomos"], '', 'P', {"fdc":171956});
D("u_bacalao_salado", "Bacalao salado (seco, sin desalar)", 'prot', 62.8, 2.4, 0, 0, [50,"ración","raciones"], '', 'P', {"raw":1,"fdc":174190});
D("u_atun_fresco_hecho", "Atún fresco a la plancha", 'prot', 29.2, 0.6, 0, 0, [130,"filete","filetes"], '', 'P', {"fdc":172006});
D("u_caballa_hecha", "Caballa a la plancha", 'prot', 23.9, 17.8, 0, 0, [130,"ración","raciones"], '', 'P', {"fdc":175120});
D("u_trucha_hecha", "Trucha a la plancha", 'prot', 23.8, 7.4, 0, 0, [130,"trucha","truchas"], '', 'P', {"fdc":173718});
D("u_lenguado", "Lenguado / gallo (crudo)", 'prot', 12.4, 1.9, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"fdc":174196});
D("u_lenguado_hecho", "Lenguado / gallo a la plancha", 'prot', 15.2, 2.4, 0, 0, [130,"filete","filetes"], '', 'P', {"fdc":174197});
D("u_panga", "Panga / basa (cruda)", 'prot', 15.2, 5.9, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"fdc":175165});
D("u_abadejo", "Abadejo / carbonero (crudo)", 'prot', 19.4, 1, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"fdc":175129});
D("u_abadejo_hecho", "Abadejo a la plancha", 'prot', 24.9, 1.3, 0, 0, [130,"filete","filetes"], '', 'P', {"fdc":174237});
D("u_tilapia", "Tilapia (cruda)", 'prot', 20.1, 1.7, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"fdc":175176});
D("u_tilapia_hecha", "Tilapia a la plancha", 'prot', 26.2, 2.7, 0, 0, [130,"filete","filetes"], '', 'P', {"fdc":175177});
D("u_merluza_hecha2", "Merluza / pescadilla al horno", 'prot', 23.5, 1.7, 0, 0, [150,"ración","raciones"], '', 'P', {"fdc":175161});
D("u_emperador", "Pez espada / emperador a la plancha", 'prot', 23.5, 7.9, 0, 0, [130,"rodaja","rodajas"], '', 'P', {"fdc":173704});
D("u_anchoa_fresca", "Boquerones frescos (crudos)", 'prot', 20.4, 4.8, 0, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"fdc":174182});
D("u_arenque", "Arenque (crudo)", 'prot', 18, 9, 0, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"fdc":175116});
D("u_gambas_crudas", "Gambas / langostinos crudos (pelados)", 'prot', 20.1, 0.5, 0, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"fdc":175179});
D("u_gambas_cocidas", "Gambas / langostinos cocidos", 'prot', 24, 0.3, 0.2, 0, [100,"ración","raciones"], '', 'P', {"fdc":175180});
D("u_cangrejo", "Cangrejo / buey de mar (cocido)", 'prot', 17.9, 0.7, 0, 0, [100,"ración","raciones"], '', 'P', {"fdc":174205});
D("u_langosta", "Bogavante / langosta (cocido)", 'prot', 19, 0.9, 0, 0, [150,"ración","raciones"], '', 'P', {"fdc":174209});
D("u_mejillones_cocidos", "Mejillones al vapor (sin concha)", 'prot', 23.8, 4.5, 7.4, 0, [100,"ración","raciones"], '', 'P', {"fdc":174217});
D("u_almejas_cocidas", "Almejas al vapor (sin concha)", 'prot', 25.6, 2, 5.1, 0, [80,"ración","raciones"], '', 'P', {"fdc":171975});
D("u_vieiras", "Vieiras (crudas)", 'prot', 12.1, 0.5, 3.2, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"fdc":174220});
D("u_ostras", "Ostras (crudas)", 'prot', 5.7, 1.7, 2.7, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"fdc":171978});
D("u_calamar_crudo", "Calamar / chipirón (crudo)", 'prot', 15.6, 1.4, 3.1, 0, [150,"ración","raciones"], '', 'P', {"raw":1,"fdc":174223});
D("u_pulpo_cocido", "Pulpo cocido", 'prot', 29.8, 2.1, 4.4, 0, [150,"ración","raciones"], '', 'P', {"fdc":174249});
D("u_sepia_hecha", "Sepia a la plancha", 'prot', 32.5, 1.4, 1.6, 0, [150,"ración","raciones"], '', 'P', {"fdc":172010});
D("u_atun_natural_esc", "Atún claro al natural (escurrido)", 'prot', 25.5, 0.8, 0, 0, [56,"lata","latas"], '', 'P', {"fdc":171986});
D("u_salmon_lata", "Salmón en lata", 'prot', 23.1, 5, 0, 0, [100,"ración","raciones"], '', 'P', {"fdc":175175});
D("u_caviar", "Huevas de pescado", 'prot', 22.3, 6.4, 1.5, 0, [30,"cucharada","cucharadas"], '', 'P', {"raw":1,"fdc":175132});
D("u_huevo_cocido", "Huevo cocido", 'prot', 12.6, 10.6, 1.1, 0, [50,"huevo","huevos"], '', 'V', {"fdc":173424});
D("u_huevo_poche", "Huevo escalfado / poché", 'prot', 12.5, 9.5, 0.7, 0, [50,"huevo","huevos"], '', 'V', {"fdc":172186});
D("u_yema", "Yema de huevo", 'prot', 15.9, 26.5, 3.6, 0, [17,"yema","yemas"], '', 'V', {"fdc":172184});
D("u_huevo_pato", "Huevo de pato", 'prot', 12.8, 13.8, 1.5, 0, [70,"huevo","huevos"], '', 'V', {"fdc":172189});
D("u_huevo_codorniz", "Huevos de codorniz", 'prot', 13.1, 11.1, 0.4, 0, [9,"huevo","huevos"], '', 'V', {"fdc":172191});
D("u_leche_entera_usda", "Leche entera (3,25 %)", 'lacteo', 3.2, 3.3, 4.8, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"fdc":171265});
D("u_leche_2", "Leche semidesnatada (2 %)", 'lacteo', 3.3, 2, 4.8, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"fdc":171267});
D("u_leche_1", "Leche semidesnatada ligera (1 %)", 'lacteo', 3.4, 1, 5, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"fdc":170872});
D("u_leche_cabra", "Leche de cabra", 'lacteo', 3.6, 4.1, 4.5, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"fdc":171278});
D("u_leche_condensada", "Leche condensada", 'lacteo', 7.9, 8.7, 54.4, 0, [20,"cucharada","cucharadas"], '', 'VL', {"fdc":171275});
D("u_leche_evaporada", "Leche evaporada", 'lacteo', 6.8, 7.6, 10, 0, [30,"chorrito","chorritos"], '', 'VL', {"fdc":171276});
D("u_leche_polvo", "Leche en polvo desnatada", 'lacteo', 36.2, 0.8, 52, 0, [20,"cucharada","cucharadas"], '', 'VL', {"fdc":170877});
D("u_yogur_entero", "Yogur natural entero", 'lacteo', 3.5, 3.3, 4.7, 0, [125,"yogur","yogures"], '', 'VL', {"fdc":171284});
D("u_yogur_griego_0", "Yogur griego 0 %", 'lacteo', 10.2, 0.4, 3.6, 0, [125,"yogur","yogures"], '', 'VL', {"fdc":170894});
D("u_yogur_griego_2", "Yogur griego ligero (2 %)", 'lacteo', 10, 1.9, 3.9, 0, [125,"yogur","yogures"], '', 'VL', {"fdc":170903});
D("u_nata_agria", "Nata agria", 'lacteo', 2.4, 19.4, 4.6, 0, [30,"cucharada","cucharadas"], '', 'VL', {"fdc":171257});
D("u_queso_cheddar", "Queso cheddar", 'lacteo', 22.9, 33.3, 3.4, 0, [30,"loncha","lonchas"], '', 'VL', {"fdc":173414});
D("u_queso_gouda", "Queso gouda", 'lacteo', 24.9, 27.4, 2.2, 0, [30,"loncha","lonchas"], '', 'VL', {"fdc":171241});
D("u_queso_brie", "Queso brie", 'lacteo', 20.8, 27.7, 0.5, 0, [30,"porción","porciones"], '', 'VL', {"fdc":172177});
D("u_queso_camembert", "Queso camembert", 'lacteo', 19.8, 24.3, 0.5, 0, [30,"porción","porciones"], '', 'VL', {"fdc":172178});
D("u_queso_feta", "Queso feta", 'lacteo', 14.2, 21.5, 3.9, 0, [30,"ración","raciones"], '', 'VL', {"fdc":173420});
D("u_queso_azul", "Queso azul", 'lacteo', 21.4, 28.7, 2.3, 0, [30,"ración","raciones"], '', 'VL', {"fdc":172175});
D("u_queso_edam", "Queso edam / bola", 'lacteo', 25, 28.6, 1.4, 0, [30,"loncha","lonchas"], '', 'VL', {"fdc":173419});
D("u_queso_provolone", "Queso provolone", 'lacteo', 25.6, 26.6, 2.1, 0, [30,"loncha","lonchas"], '', 'VL', {"fdc":170850});
D("u_queso_ricotta_semi", "Ricotta semidesnatada", 'lacteo', 11.4, 7.9, 5.1, 0, [60,"ración","raciones"], '', 'VL', {"fdc":171248});
D("u_mozzarella_light", "Mozzarella semidesnatada", 'lacteo', 23.8, 19.8, 5.6, 0, [30,"ración","raciones"], '', 'VL', {"fdc":171244});
D("u_queso_cottage_1", "Queso cottage 1 %", 'lacteo', 12.4, 1, 2.7, 0, [100,"ración","raciones"], '', 'VL', {"fdc":173417});
D("u_queso_fundir_lonchas", "Queso para fundir (tipo americano)", 'lacteo', 18.1, 30.7, 4.8, 0, [20,"loncha","lonchas"], '', 'VL', {"fdc":170853});
D("u_helado_chocolate", "Helado de chocolate", 'lacteo', 3.8, 11, 27, 1.2, [70,"bola","bolas"], '', 'VL', {"fdc":168809});
D("u_nata_montada", "Nata montada (spray)", 'lacteo', 3.2, 22.2, 12.5, 0, [10,"chorro","chorros"], '', 'VL', {"fdc":170860});
D("u_arroz_blanco_crudo", "Arroz blanco largo (crudo)", 'hc', 7.1, 0.7, 78.7, 1.3, [80,"ración","raciones"], '', 'N', {"raw":1,"fdc":168877});
D("u_arroz_blanco_cocido", "Arroz blanco largo cocido", 'hc', 2.7, 0.3, 27.8, 0.4, [200,"ración","raciones"], '', 'N', {"fdc":169757});
D("u_arroz_redondo_crudo", "Arroz redondo (crudo)", 'hc', 6.5, 0.5, 76.4, 2.8, [80,"ración","raciones"], '', 'N', {"raw":1,"fdc":168881});
D("u_arroz_redondo_cocido", "Arroz redondo cocido", 'hc', 2.4, 0.2, 28.7, 0, [200,"ración","raciones"], '', 'N', {"fdc":168882});
D("u_arroz_integral_crudo", "Arroz integral (crudo)", 'hc', 7.5, 3.2, 72.7, 3.6, [80,"ración","raciones"], '', 'N', {"raw":1,"fdc":169703});
D("u_arroz_glutinoso", "Arroz glutinoso (cocido)", 'hc', 2, 0.2, 20.1, 1, [200,"ración","raciones"], '', 'N', {"fdc":169711});
D("u_arroz_salvaje", "Arroz salvaje (cocido)", 'hc', 4, 0.3, 19.5, 1.8, [160,"ración","raciones"], '', 'N', {"fdc":168897});
D("u_pasta_cruda", "Pasta seca (cruda)", 'hc', 13, 1.5, 71.5, 3.2, [80,"ración","raciones"], '', 'NG', {"raw":1,"fdc":169736});
D("u_pasta_cocida2", "Pasta cocida (sin sal)", 'hc', 5.8, 0.9, 29.1, 1.8, [200,"plato","platos"], '', 'NG', {"fdc":169737});
D("u_pasta_int_cruda", "Pasta integral seca (cruda)", 'hc', 13.9, 2.9, 64.2, 9.2, [80,"ración","raciones"], '', 'NG', {"raw":1,"fdc":169738});
D("u_pasta_huevo", "Pasta al huevo (cruda)", 'hc', 14.2, 4.4, 68, 3.3, [80,"ración","raciones"], '', 'VG', {"raw":1,"fdc":169731});
D("u_pasta_huevo_cocida", "Pasta al huevo cocida", 'hc', 4.5, 2.1, 24, 1.2, [180,"plato","platos"], '', 'VG', {"fdc":169732});
D("u_fideos_arroz_cocidos", "Fideos de arroz cocidos", 'hc', 1.8, 0.2, 23, 1, [180,"ración","raciones"], '', 'N', {"fdc":168914});
D("u_soba", "Fideos soba (cocidos)", 'hc', 5.1, 0.1, 21.4, 0, [180,"ración","raciones"], '', 'NG', {"fdc":168907});
D("u_bulgur", "Bulgur (cocido)", 'hc', 3.1, 0.2, 14.1, 4.5, [180,"ración","raciones"], '', 'NG', {"fdc":170287});
D("u_bulgur_seco", "Bulgur (seco)", 'hc', 12.3, 1.3, 63.4, 12.5, [70,"ración","raciones"], '', 'NG', {"raw":1,"fdc":170688});
D("u_mijo", "Mijo (cocido)", 'hc', 3.5, 1, 22.4, 1.3, [170,"ración","raciones"], '', 'N', {"fdc":168871});
D("u_espelta", "Espelta (cocida)", 'hc', 5.5, 0.9, 22.5, 3.9, [190,"ración","raciones"], '', 'NG', {"fdc":169746});
D("u_trigo_sarraceno", "Trigo sarraceno (cocido)", 'hc', 3.4, 0.6, 17.2, 2.7, [170,"ración","raciones"], '', 'N', {"fdc":170686});
D("u_cebada", "Cebada perlada (cocida)", 'hc', 2.3, 0.4, 24.4, 3.8, [160,"ración","raciones"], '', 'NG', {"fdc":170285});
D("u_quinoa_cruda", "Quinoa (cruda)", 'hc', 14.1, 6.1, 57.2, 7, [70,"ración","raciones"], '', 'N', {"raw":1,"fdc":168874});
D("u_cuscus_seco", "Cuscús (seco)", 'hc', 12.8, 0.6, 72.4, 5, [70,"ración","raciones"], '', 'NG', {"raw":1,"fdc":169699});
D("u_polenta", "Harina de maíz / polenta (seca)", 'hc', 8.1, 3.6, 69.6, 7.3, [50,"ración","raciones"], '', 'N', {"raw":1,"fdc":169697});
D("u_maiz_mazorca", "Mazorca de maíz cocida", 'hc', 3.4, 1.5, 18.6, 2.4, [100,"mazorca","mazorcas"], '', 'N', {"fdc":169999});
D("u_pan_blanco_molde", "Pan blanco de molde", 'hc', 8.9, 3.3, 46.7, 2.7, [25,"rebanada","rebanadas"], '', 'NG', {"fdc":174924});
D("u_pan_integral_molde", "Pan integral de trigo", 'hc', 12.5, 3.5, 36.7, 6, [30,"rebanada","rebanadas"], '', 'NG', {"fdc":172688});
D("u_pan_frances", "Pan de barra (baguette)", 'hc', 10.8, 2.4, 49.7, 2.2, [60,"trozo","trozos"], '', 'NG', {"fdc":172675});
D("u_pan_multicereal", "Pan multicereales", 'hc', 13.4, 4.2, 35.9, 7.4, [30,"rebanada","rebanadas"], '', 'NG', {"fdc":168013});
D("u_pan_tostado_usda", "Pan tostado (blanco)", 'hc', 9, 4, 51.6, 2.9, [22,"tostada","tostadas"], '', 'NG', {"fdc":174925});
D("u_pan_hamburguesa", "Pan de hamburguesa / perrito", 'hc', 9.8, 3.9, 48.3, 1.8, [45,"pan","panes"], '', 'NG', {"fdc":172796});
D("u_tortilla_maiz", "Tortilla de maíz", 'hc', 5.7, 2.9, 38.3, 6.3, [26,"tortilla","tortillas"], '', 'N', {"fdc":175036});
D("u_picos", "Picos / colines", 'hc', 12, 9.5, 65.4, 3, [10,"puñado","puñados"], '', 'NG', {"fdc":174929});
D("u_crackers", "Crackers / galletas saladas", 'hc', 9.5, 8.6, 71.3, 2.8, [15,"ración","raciones"], '', 'NG', {"fdc":172746});
D("u_tortitas_arroz_usda", "Tortitas de arroz (inflado)", 'hc', 8.2, 2.8, 77.3, 4.2, [9,"tortita","tortitas"], '', 'N', {"fdc":170250});
D("u_palomitas_aceite", "Palomitas (con aceite)", 'hc', 7.3, 43.6, 37, 8.1, [30,"bol","boles"], '', 'N', {"fdc":167549});
D("u_cereales_arroz_inflado", "Arroz inflado (cereal)", 'hc', 6.3, 0.5, 88.1, 1.7, [30,"ración","raciones"], '', 'N', {"fdc":173912});
D("u_harina_integral", "Harina integral de trigo", 'hc', 13.2, 2.5, 61.3, 10.7, [30,"cucharada","cucharadas"], '', 'NG', {"fdc":168893});
D("u_harina_maiz", "Harina de maíz (maicena)", 'hc', 0.3, 0.1, 90.4, 0.9, [10,"cucharada","cucharadas"], '', 'N', {"fdc":169698});
D("u_pan_rallado", "Pan rallado", 'hc', 13.4, 5.3, 67.5, 4.5, [15,"cucharada","cucharadas"], '', 'NG', {"fdc":174928});
D("u_patata_cruda_piel", "Patata cruda (con piel)", 'hc', 2.1, 0.1, 15.4, 2.1, [200,"patata","patatas"], '', 'N', {"raw":1,"fdc":170026});
D("u_patata_hervida_sin", "Patata hervida (pelada)", 'hc', 1.7, 0.1, 18.2, 1.8, [150,"patata","patatas"], '', 'N', {"fdc":170440});
D("u_patata_horno_piel", "Patata al horno (con piel)", 'hc', 2.5, 0.1, 19, 2.2, [170,"patata","patatas"], '', 'N', {"fdc":170093});
D("u_patatas_fritas_horno", "Patatas fritas congeladas al horno", 'hc', 2.7, 5.2, 26.1, 2.6, [150,"ración","raciones"], '', 'N', {"fdc":170118});
D("u_boniato_crudo", "Boniato (crudo)", 'hc', 1.6, 0.1, 17.1, 3, [200,"boniato","boniatos"], '', 'N', {"raw":1,"fdc":168482});
D("u_boniato_hervido", "Boniato hervido", 'hc', 1.4, 0.1, 15.2, 2.5, [150,"ración","raciones"], '', 'N', {"fdc":168484});
D("u_yuca", "Yuca (cruda)", 'hc', 1.4, 0.3, 36.3, 1.8, [150,"ración","raciones"], '', 'N', {"raw":1,"fdc":169985});
D("u_nabo", "Nabo (cocido)", 'verdura', 0.7, 0.1, 3.1, 2, [150,"ración","raciones"], '', 'N', {"fdc":170058});
D("u_lentejas_secas", "Lentejas (secas)", 'legum', 24.6, 1.1, 52.7, 10.7, [70,"ración","raciones"], '', 'N', {"raw":1,"fdc":172420});
D("u_lentejas_hervidas", "Lentejas hervidas", 'legum', 9, 0.4, 12.2, 7.9, [200,"plato","platos"], '', 'N', {"fdc":172421});
D("u_garbanzos_secos", "Garbanzos (secos)", 'legum', 20.5, 6, 50.8, 12.2, [70,"ración","raciones"], '', 'N', {"raw":1,"fdc":173756});
D("u_garbanzos_hervidos", "Garbanzos hervidos", 'legum', 8.9, 2.6, 19.8, 7.6, [200,"plato","platos"], '', 'N', {"fdc":173757});
D("u_alubias_blancas_secas", "Alubias blancas (secas)", 'legum', 23.4, 0.9, 45.1, 15.2, [70,"ración","raciones"], '', 'N', {"raw":1,"fdc":175202});
D("u_alubias_blancas_hervidas", "Alubias blancas hervidas", 'legum', 9.7, 0.4, 18.8, 6.3, [200,"plato","platos"], '', 'N', {"fdc":175203});
D("u_alubias_rojas", "Alubias rojas hervidas", 'legum', 8.7, 0.5, 15.4, 7.4, [200,"plato","platos"], '', 'N', {"fdc":175194});
D("u_alubias_negras", "Alubias negras hervidas", 'legum', 8.9, 0.5, 15, 8.7, [200,"plato","platos"], '', 'N', {"fdc":173735});
D("u_alubias_pintas", "Alubias pintas hervidas", 'legum', 9, 0.7, 17.2, 9, [200,"plato","platos"], '', 'N', {"fdc":175200});
D("u_guisantes_secos", "Guisantes partidos hervidos", 'legum', 8.3, 0.4, 12.8, 8.3, [200,"plato","platos"], '', 'N', {"fdc":172429});
D("u_habas_secas", "Habas secas hervidas", 'legum', 7.6, 0.4, 14.2, 5.4, [200,"plato","platos"], '', 'N', {"fdc":173753});
D("u_soja_seca", "Soja en grano (seca)", 'legum', 36.5, 19.9, 20.9, 9.3, [60,"ración","raciones"], '', 'N', {"raw":1,"fdc":174270});
D("u_altramuces", "Altramuces (cocidos)", 'legum', 15.6, 2.9, 7.1, 2.8, [100,"ración","raciones"], '', 'N', {"fdc":172424});
D("u_judias_mungo", "Judías mungo hervidas", 'legum', 7, 0.4, 11.5, 7.6, [200,"plato","platos"], '', 'N', {"fdc":174257});
D("u_brotes_soja", "Brotes de soja", 'verdura', 3, 0.2, 4.1, 1.8, [70,"ración","raciones"], '', 'N', {"fdc":169957});
D("u_tofu_sedoso", "Tofu sedoso", 'vprot', 7.2, 3.7, 1, 0.2, [100,"ración","raciones"], '', 'N', {"fdc":172449});
D("u_bebida_soja_usda", "Bebida de soja (con azúcar)", 'bebida', 2.6, 1.5, 4.7, 0.2, [250,"vaso","vasos"], '', 'N', {"ml":1,"fdc":172456});
D("u_brocoli_crudo", "Brócoli crudo", 'verdura', 2.8, 0.4, 4, 2.6, [150,"ración","raciones"], '', 'N', {"fdc":170379});
D("u_coliflor_cocida", "Coliflor cocida", 'verdura', 1.8, 0.5, 1.8, 2.3, [150,"ración","raciones"], '', 'N', {"fdc":170397});
D("u_espinacas_cocidas", "Espinacas cocidas", 'verdura', 3, 0.3, 1.4, 2.4, [150,"ración","raciones"], '', 'N', {"fdc":168463});
D("u_acelgas", "Acelgas (crudas)", 'verdura', 1.8, 0.2, 2.1, 1.6, [150,"ración","raciones"], '', 'N', {"fdc":169991});
D("u_acelgas_cocidas", "Acelgas cocidas", 'verdura', 1.9, 0.1, 2, 2.1, [150,"ración","raciones"], '', 'N', {"fdc":170401});
D("u_judias_verdes_cocidas", "Judías verdes cocidas", 'verdura', 1.9, 0.3, 4.7, 3.2, [150,"ración","raciones"], '', 'N', {"fdc":169141});
D("u_zanahoria_cocida", "Zanahoria cocida", 'verdura', 0.8, 0.2, 5.2, 3, [100,"ración","raciones"], '', 'N', {"fdc":170394});
D("u_calabacin_cocido", "Calabacín cocido", 'verdura', 1.1, 0.4, 1.7, 1, [150,"ración","raciones"], '', 'N', {"fdc":169292});
D("u_calabaza_cocida", "Calabaza cocida", 'verdura', 0.7, 0.1, 3.8, 1.1, [150,"ración","raciones"], '', 'N', {"fdc":168449});
D("u_berenjena_cocida", "Berenjena cocida", 'verdura', 0.8, 0.2, 6.2, 2.5, [150,"ración","raciones"], '', 'N', {"fdc":169229});
D("u_pimiento_rojo", "Pimiento rojo (crudo)", 'verdura', 1, 0.3, 3.9, 2.1, [120,"pimiento","pimientos"], '', 'N', {"fdc":170108});
D("u_pimiento_verde", "Pimiento verde (crudo)", 'verdura', 0.9, 0.2, 2.9, 1.7, [120,"pimiento","pimientos"], '', 'N', {"fdc":170427});
D("u_pimiento_asado", "Pimiento rojo asado", 'verdura', 0.9, 0.2, 5.5, 1.2, [100,"ración","raciones"], '', 'N', {"fdc":170110});
D("u_cebolla_cocida", "Cebolla pochada / cocida", 'verdura', 1.4, 0.2, 8.8, 1.4, [80,"ración","raciones"], '', 'N', {"fdc":170001});
D("u_cebolleta", "Cebolleta / cebollino", 'verdura', 1.8, 0.2, 4.7, 2.6, [30,"ración","raciones"], '', 'N', {"fdc":170005});
D("u_puerro_cocido", "Puerro cocido", 'verdura', 0.8, 0.2, 6.6, 1, [100,"ración","raciones"], '', 'N', {"fdc":168426});
D("u_champi_cocidos", "Champiñones salteados", 'verdura', 2.2, 0.5, 3.1, 2.2, [100,"ración","raciones"], '', 'N', {"fdc":169252});
D("u_setas", "Setas de cardo / ostra", 'verdura', 3.3, 0.4, 3.8, 2.3, [100,"ración","raciones"], '', 'N', {"fdc":168580});
D("u_shiitake", "Shiitake (cocidas)", 'verdura', 1.6, 0.2, 12.3, 2.1, [100,"ración","raciones"], '', 'N', {"fdc":168437});
D("u_esparragos_cocidos", "Espárragos verdes cocidos", 'verdura', 2.4, 0.2, 2.1, 2, [120,"ración","raciones"], '', 'N', {"fdc":168390});
D("u_esparragos_lata", "Espárragos blancos (lata)", 'verdura', 2.1, 0.7, 0.9, 1.6, [100,"ración","raciones"], '', 'N', {"fdc":169207});
D("u_alcachofa_cocida", "Alcachofa cocida", 'verdura', 2.9, 0.3, 6.2, 5.7, [120,"alcachofa","alcachofas"], '', 'N', {"fdc":168386});
D("u_coles_cocidas", "Coles de Bruselas cocidas", 'verdura', 2.6, 0.5, 4.5, 2.6, [120,"ración","raciones"], '', 'N', {"fdc":169971});
D("u_repollo_cocido", "Repollo cocido", 'verdura', 1.3, 0.1, 3.6, 1.9, [150,"ración","raciones"], '', 'N', {"fdc":169976});
D("u_lombarda", "Lombarda (cruda)", 'verdura', 1.4, 0.2, 5.3, 2.1, [100,"ración","raciones"], '', 'N', {"fdc":169977});
D("u_guisantes_cocidos", "Guisantes cocidos", 'verdura', 5.2, 0.3, 9.8, 4.5, [100,"ración","raciones"], '', 'N', {"fdc":170017});
D("u_habas_tiernas", "Habas tiernas (cocidas)", 'verdura', 6.8, 0.3, 18.2, 5.4, [100,"ración","raciones"], '', 'N', {"fdc":169135});
D("u_tomate_cherry", "Tomates cherry", 'verdura', 0.9, 0.2, 2.7, 1.2, [100,"puñado","puñados"], '', 'N', {"fdc":170457});
D("u_tomate_seco", "Tomate seco", 'verdura', 14.1, 3, 43.5, 12.3, [15,"ración","raciones"], '', 'N', {"fdc":168567});
D("u_remolacha_cruda", "Remolacha (cruda)", 'verdura', 1.6, 0.2, 6.8, 2.8, [100,"ración","raciones"], '', 'N', {"fdc":169145});
D("u_rabano", "Rábanos", 'verdura', 0.7, 0.1, 1.8, 1.6, [50,"ración","raciones"], '', 'N', {"fdc":169276});
D("u_endibia", "Endibia", 'verdura', 1.3, 0.2, 0.3, 3.1, [80,"endibia","endibias"], '', 'N', {"fdc":168412});
D("u_canonigos", "Canónigos / lechuga variada", 'verdura', 1.4, 0.2, 1.6, 1.3, [60,"ración","raciones"], '', 'N', {"fdc":169249});
D("u_lechuga_romana", "Lechuga romana", 'verdura', 1.2, 0.3, 1.2, 2.1, [80,"ración","raciones"], '', 'N', {"fdc":169247});
D("u_lechuga_iceberg", "Lechuga iceberg", 'verdura', 0.9, 0.1, 1.8, 1.2, [80,"ración","raciones"], '', 'N', {"fdc":169248});
D("u_apio_crudo", "Apio (rama)", 'verdura', 0.7, 0.2, 1.4, 1.6, [40,"rama","ramas"], '', 'N', {"fdc":169988});
D("u_hinojo", "Hinojo", 'verdura', 1.2, 0.2, 4.2, 3.1, [100,"ración","raciones"], '', 'N', {"fdc":169385});
D("u_kale_cocido", "Kale cocido", 'verdura', 2.9, 1.2, 1.3, 4, [100,"ración","raciones"], '', 'N', {"fdc":169238});
D("u_pepinillos", "Pepinillos en vinagre", 'verdura', 0.5, 0.3, 1.4, 1, [30,"ración","raciones"], '', 'N', {"fdc":168558});
D("u_ajo_crudo", "Ajo (diente)", 'verdura', 6.4, 0.5, 31, 2.1, [3,"diente","dientes"], '', 'N', {"fdc":169230});
D("u_jengibre", "Jengibre fresco", 'verdura', 1.8, 0.8, 15.8, 2, [5,"trocito","trocitos"], '', 'N', {"fdc":169231});
D("u_okra", "Quimbombó / okra", 'verdura', 1.9, 0.2, 4.3, 3.2, [100,"ración","raciones"], '', 'N', {"fdc":169260});
D("u_chirivia", "Chirivía", 'verdura', 1.2, 0.3, 13.1, 4.9, [100,"ración","raciones"], '', 'N', {"fdc":170417});
D("u_algas_nori", "Alga nori (seca)", 'verdura', 5.8, 0.3, 4.8, 0.3, [5,"hoja","hojas"], '', 'N', {"fdc":168458});
D("u_maiz_lata", "Maíz dulce (lata)", 'verdura', 2.3, 1.2, 12.3, 2, [80,"ración","raciones"], '', 'N', {"fdc":169214});
D("u_aceitunas_verdes", "Aceitunas verdes", 'grasa', 1, 15.3, 0.5, 3.3, [30,"ración","raciones"], '', 'N', {"fdc":169096});
D("u_aceitunas_negras", "Aceitunas negras", 'grasa', 0.8, 10.9, 4.4, 1.6, [30,"ración","raciones"], '', 'N', {"fdc":169094});
D("u_limon", "Limón", 'fruta', 1.1, 0.3, 6.5, 2.8, [60,"limón","limones"], '', 'N', {"fdc":167746});
D("u_lima", "Lima", 'fruta', 0.7, 0.2, 7.7, 2.8, [45,"lima","limas"], '', 'N', {"fdc":168155});
D("u_pomelo_usda", "Pomelo rosa", 'fruta', 0.8, 0.1, 9.1, 1.6, [230,"pomelo","pomelos"], '', 'N', {"fdc":174673});
D("u_ciruela", "Ciruela", 'fruta', 0.7, 0.3, 10, 1.4, [65,"ciruela","ciruelas"], '', 'N', {"fdc":169949});
D("u_ciruela_pasa", "Ciruelas pasas", 'fruta', 2.2, 0.4, 56.8, 7.1, [30,"ración","raciones"], '', 'N', {"fdc":168162});
D("u_orejones", "Orejones (albaricoque seco)", 'fruta', 3.4, 0.5, 55.3, 7.3, [30,"ración","raciones"], '', 'N', {"fdc":173941});
D("u_higos_secos", "Higos secos", 'fruta', 3.3, 0.9, 54.1, 9.8, [40,"ración","raciones"], '', 'N', {"fdc":174665});
D("u_datiles_medjool", "Dátiles medjool", 'fruta', 1.8, 0.2, 68.3, 6.7, [24,"dátil","dátiles"], '', 'N', {"fdc":168191});
D("u_arandanos_secos", "Arándanos rojos deshidratados", 'fruta', 0.2, 1.1, 77.5, 5.3, [30,"ración","raciones"], '', 'N', {"fdc":171723});
D("u_platano_macho", "Plátano macho (crudo)", 'fruta', 1.3, 0.4, 30.2, 1.7, [180,"plátano","plátanos"], '', 'N', {"fdc":169130});
D("u_manzana_sin_piel", "Manzana pelada", 'fruta', 0.3, 0.1, 11.5, 1.3, [160,"manzana","manzanas"], '', 'N', {"fdc":171689});
D("u_uvas_rojas", "Uvas rojas / negras", 'fruta', 0.7, 0.2, 17.2, 0.9, [100,"racimo","racimos"], '', 'N', {"fdc":174683});
D("u_grosellas", "Grosellas", 'fruta', 1.4, 0.2, 9.5, 4.3, [80,"ración","raciones"], '', 'N', {"fdc":173964});
D("u_maracuya", "Maracuyá / fruta de la pasión", 'fruta', 2.2, 0.7, 13, 10.4, [20,"unidad","unidades"], '', 'N', {"fdc":169108});
D("u_lichis", "Lichis", 'fruta', 0.8, 0.4, 15.2, 1.3, [100,"ración","raciones"], '', 'N', {"fdc":169086});
D("u_guayaba", "Guayaba", 'fruta', 2.6, 1, 8.9, 5.4, [55,"guayaba","guayabas"], '', 'N', {"fdc":173044});
D("u_chirimoya", "Chirimoya", 'fruta', 1.6, 0.7, 14.7, 3, [250,"chirimoya","chirimoyas"], '', 'N', {"fdc":173953});
D("u_membrillo_fruta", "Membrillo (fruta)", 'fruta', 0.4, 0.1, 13.4, 1.9, [90,"membrillo","membrillos"], '', 'N', {"fdc":168163});
D("u_coco_fresco", "Coco fresco", 'fruta', 3.3, 33.5, 6.2, 9, [40,"trozo","trozos"], '', 'N', {"fdc":170169});
D("u_melocoton_almibar", "Melocotón en almíbar", 'fruta', 0.5, 0.1, 18.6, 1.3, [120,"ración","raciones"], '', 'N', {"fdc":169112});
D("u_pina_almibar", "Piña en almíbar", 'fruta', 0.4, 0.1, 19.4, 0.8, [120,"ración","raciones"], '', 'N', {"fdc":169944});
D("u_macedonia", "Macedonia de frutas en almíbar", 'fruta', 0.4, 0.1, 17.9, 1, [120,"ración","raciones"], '', 'N', {"fdc":173028});
D("u_zumo_manzana", "Zumo de manzana", 'bebida', 0.1, 0.1, 11.1, 0.2, [200,"vaso","vasos"], '', 'N', {"ml":1,"fdc":173933});
D("u_zumo_pina", "Zumo de piña", 'bebida', 0.4, 0.1, 12.7, 0.2, [200,"vaso","vasos"], '', 'N', {"ml":1,"fdc":169947});
D("u_zumo_uva", "Zumo de uva", 'bebida', 0.4, 0.1, 14.6, 0.2, [200,"vaso","vasos"], '', 'N', {"ml":1,"fdc":173042});
D("u_zumo_tomate", "Zumo de tomate", 'bebida', 0.9, 0.3, 3.1, 0.4, [200,"vaso","vasos"], '', 'N', {"ml":1,"fdc":170545});
D("u_agua_coco", "Agua de coco", 'bebida', 0.7, 0.2, 2.6, 1.1, [250,"vaso","vasos"], '', 'N', {"ml":1,"fdc":170174});
D("u_almendras_tostadas", "Almendras tostadas", 'grasa', 21, 52.5, 10.1, 10.9, [30,"puñado","puñados"], '', 'N', {"fdc":170158});
D("u_avellanas_tostadas", "Avellanas tostadas", 'grasa', 15, 62.4, 8.2, 9.4, [30,"puñado","puñados"], '', 'N', {"fdc":170583});
D("u_anacardos_tostados", "Anacardos tostados", 'grasa', 15.3, 46.4, 29.7, 3, [30,"puñado","puñados"], '', 'N', {"fdc":170571});
D("u_pistachos_tostados", "Pistachos tostados", 'grasa', 21.1, 45.8, 18, 10.3, [30,"puñado","puñados"], '', 'N', {"fdc":170185});
D("u_nueces_pecanas", "Nueces pecanas", 'grasa', 9.2, 72, 4.3, 9.6, [30,"puñado","puñados"], '', 'N', {"fdc":170182});
D("u_nueces_brasil", "Nueces de Brasil", 'grasa', 14.3, 67.1, 4.2, 7.5, [15,"ración","raciones"], '', 'N', {"fdc":170569});
D("u_pinones", "Piñones", 'grasa', 13.7, 68.4, 9.4, 3.7, [15,"cucharada","cucharadas"], '', 'N', {"fdc":170591});
D("u_castanas", "Castañas asadas", 'hc', 3.2, 2.2, 47.9, 5.1, [50,"ración","raciones"], '', 'N', {"fdc":170190});
D("u_cacahuetes_crudos", "Cacahuetes crudos", 'grasa', 25.8, 49.2, 7.6, 8.5, [30,"puñado","puñados"], '', 'N', {"fdc":172430});
D("u_sesamo", "Semillas de sésamo", 'grasa', 17.7, 49.7, 11.6, 11.8, [10,"cucharada","cucharadas"], '', 'N', {"fdc":170150});
D("u_semillas_canamo", "Semillas de cáñamo peladas", 'grasa', 31.6, 48.8, 4.7, 4, [30,"ración","raciones"], '', 'N', {"fdc":170148});
D("u_pipas_girasol_tostadas", "Pipas de girasol tostadas (peladas)", 'grasa', 19.3, 49.8, 13, 11.1, [30,"puñado","puñados"], '', 'N', {"fdc":170563});
D("u_crema_cacahuete_usda", "Crema de cacahuete (con azúcar y sal)", 'grasa', 22.2, 51.4, 17.3, 5, [15,"cucharada","cucharadas"], '', 'N', {"fdc":174266});
D("u_aceite_coco", "Aceite de coco", 'grasa', 0, 99.1, 0, 0, [10,"cucharada","cucharadas"], '', 'N', {"fdc":171412});
D("u_aceite_lino", "Aceite de lino", 'grasa', 0.1, 100, 0, 0, [10,"cucharada","cucharadas"], '', 'N', {"fdc":167702});
D("u_manteca_cerdo", "Manteca de cerdo", 'grasa', 0, 100, 0, 0, [10,"cucharada","cucharadas"], '', 'M', {"fdc":171401});
D("u_margarina", "Margarina", 'grasa', 0.2, 80.7, 0.7, 0, [10,"cucharadita","cucharaditas"], '', 'N', {"fdc":173585});
D("u_margarina_light", "Margarina ligera", 'grasa', 2, 35, 2, 0, [10,"cucharadita","cucharaditas"], '', 'N', {"fdc":173586});
D("u_chocolate_blanco", "Chocolate blanco", 'grasa', 5.9, 32.1, 59, 0.2, [20,"onza","onzas"], '', 'VL', {"fdc":167571});
D("u_chocolate_70", "Chocolate negro 70-85 %", 'grasa', 7.8, 42.6, 35, 10.9, [20,"onza","onzas"], '', 'V', {"fdc":170273});
D("u_cacao_puro", "Cacao puro en polvo", 'hc', 19.6, 13.7, 20.9, 37, [10,"cucharada","cucharadas"], '', 'N', {"fdc":169593});
D("u_azucar_moreno", "Azúcar moreno", 'hc', 0.1, 0, 98.1, 0, [5,"cucharadita","cucharaditas"], '', 'N', {"fdc":168833});
D("u_sirope_agave", "Sirope de agave", 'hc', 0.1, 0.5, 76.2, 0.2, [10,"cucharada","cucharadas"], '', 'N', {"fdc":170277});
D("u_mermelada_usda", "Mermelada (fresa, albaricoque…)", 'hc', 0.4, 0.1, 67.8, 1.1, [15,"cucharada","cucharadas"], '', 'N', {"fdc":169641});
D("u_salsa_tomate", "Salsa de tomate (pasta)", 'verdura', 1.4, 1.6, 5.6, 1.8, [60,"ración","raciones"], '', 'N', {"fdc":171192});
D("u_vinagre", "Vinagre", 'bebida', 0, 0, 0, 0, [10,"cucharada","cucharadas"], '', 'N', {"fdc":172237});
D("u_vinagre_balsamico", "Vinagre balsámico", 'bebida', 0.5, 0, 17, 0, [10,"cucharada","cucharadas"], '', 'N', {"fdc":172241});
D("u_salsa_pesto", "Salsa pesto", 'grasa', 9.8, 37.6, 8.3, 1.8, [30,"ración","raciones"], '', 'VL', {"fdc":171579});
D("u_tomate_frito_usda", "Tomate frito / salsa de tomate", 'verdura', 1.2, 0.3, 3.8, 1.5, [60,"ración","raciones"], '', 'N', {"fdc":170054});
D("u_caldo_verduras", "Caldo de verduras", 'bebida', 0.2, 0.1, 0.9, 0, [250,"tazón","tazones"], '', 'N', {"ml":1,"fdc":171583});
D("u_caldo_carne", "Caldo de carne", 'bebida', 1.1, 0.2, 0, 0, [250,"tazón","tazones"], '', 'M', {"ml":1,"fdc":171538});
D("u_gelatina_azucar", "Gelatina de sabores", 'hc', 1.2, 0, 14.2, 0, [120,"tarrina","tarrinas"], '', 'N', {"fdc":169596});
D("u_natillas_usda", "Pudin de vainilla", 'lacteo', 1.5, 3.8, 22.6, 0, [125,"tarrina","tarrinas"], '', 'VL', {"fdc":169608});
D("u_croissant_usda", "Cruasán de mantequilla", 'hc', 8.2, 21, 43.2, 2.6, [57,"cruasán","cruasanes"], '', 'VGL', {"fdc":174987});
D("u_muffin", "Muffin de arándanos", 'hc', 4.5, 16.1, 51.9, 1.1, [110,"muffin","muffins"], '', 'VGL', {"fdc":172765});
D("u_tortitas_pancake_usda", "Tortitas americanas (hechas)", 'hc', 6.4, 9.7, 28.3, 0, [40,"tortita","tortitas"], '', 'VGL', {"fdc":175009});
D("u_bebida_cafe_solo", "Café solo (espresso)", 'bebida', 0.1, 0.2, 1.7, 0, [30,"taza","tazas"], '', 'N', {"ml":1,"fdc":171891});
D("u_bebida_te", "Té (preparado)", 'bebida', 0, 0, 0.3, 0, [250,"taza","tazas"], '', 'N', {"ml":1,"fdc":173227});
// </usda>
// <marcas> (lo genera tools/marcas/off_embed.js · datos: Open Food Facts, licencia ODbL · 2026-10-14)
const BRAND_FOODS = [
    ["m_hacendado_spaghetti","Spaghetti","Hacendado",361,13,72,1.5,0,[80,"ración","raciones"],"🍝",0,1,"8480000063311"],
    ["m_hacendado_spaghetti_integral","Spaghetti integral","Hacendado",345,13.5,62,2.4,10,[80,"ración","raciones"],"🍝",0,1,"8402001010200"],
    ["m_hacendado_macarrones","Macarrones","Hacendado",361,13,72,1.5,3.5,[80,"ración","raciones"],"🍝",0,1,"8480000062505"],
    ["m_hacendado_fideos","Fideos","Hacendado",361,13,72,1.5,3.5,[60,"ración","raciones"],"🍜",0,1,"8480000135773"],
    ["m_hacendado_arroz_redondo","Arroz redondo","Hacendado",344,8.2,75,1,0,[80,"ración","raciones"],"🍚",0,1,"8480000050441"],
    ["m_hacendado_arroz_basmati","Arroz basmati","Hacendado",355,9,78,0.6,0,[80,"ración","raciones"],"🍚",0,1,"8480000050021"],
    ["m_hacendado_arroz_integral","Arroz integral","Hacendado",350,7.6,72,2.8,3.3,[80,"ración","raciones"],"🍚",0,1,"8480000051844"],
    ["m_hacendado_quinoa","Quinoa","Hacendado",389,14,66.1,6.1,0,[60,"ración","raciones"],"🍚",0,1,"8480000094308"],
    ["m_hacendado_tortitas_de_maiz","Tortitas de maíz","Hacendado",414,6.7,76,8.4,3.9,[7,"tortita","tortitas"],"🍘",0,0,"8402001039263"],
    ["m_hacendado_tortillas_de_trigo_wraps","Tortillas de trigo (wraps)","Hacendado",294,8.4,50,5.8,4.2,[40,"tortilla","tortillas"],"🌯",0,0,"8480000808592"],
    ["m_hacendado_tortillas_de_trigo_integ","Tortillas de trigo integrales","Hacendado",269,9.3,41,5.8,8.5,[40,"tortilla","tortillas"],"🌯",0,0,"8480000809421"],
    ["m_hacendado_tortillas_de_avena","Tortillas de avena","Hacendado",287,15,40,6,5.4,[40,"tortilla","tortillas"],"🌯",0,0,"8480000805317"],
    ["m_hacendado_pan_de_molde_100_integra","Pan de molde 100 % integral","Hacendado",248,8.7,41,3.8,7.5,[30,"rebanada","rebanadas"],"🍞",0,0,"8480000838865"],
    ["m_hacendado_pan_de_molde_blanco","Pan de molde blanco","Hacendado",250,9,46,2.7,3,[30,"rebanada","rebanadas"],"🍞",0,0,"8480000838674"],
    ["m_hacendado_pan_de_molde_35_avena","Pan de molde 35 % avena","Hacendado",265,13,35,6.8,6.1,[30,"rebanada","rebanadas"],"🍞",0,0,"8480000822956"],
    ["m_hacendado_pan_tostado_integral","Pan tostado integral","Hacendado",388,17.7,61,5.7,10.9,[10,"tostada","tostadas"],"🍞",0,0,"8480000837899"],
    ["m_hacendado_panecillos_integrales","Panecillos integrales","Hacendado",382,13.3,59.6,7.8,10.3,[50,"panecillo","panecillos"],"🍞",0,0,"8480000134455"],
    ["m_hacendado_leche_desnatada","Leche desnatada","Hacendado",34,3.2,4.7,0.3,0,[250,"vaso","vasos"],"🥛",1,0,"8402001002120"],
    ["m_hacendado_leche_semidesnatada","Leche semidesnatada","Hacendado",46,3.1,4.8,1.6,0,[250,"vaso","vasos"],"🥛",1,0,"8480000107947"],
    ["m_hacendado_leche_sin_lactosa_semide","Leche sin lactosa semidesnatada","Hacendado",44,3,4.6,1.5,0,[250,"vaso","vasos"],"🥛",1,0,"8480000104830"],
    ["m_hacendado_bebida_de_proteinas_fres","Bebida de proteínas fresa y plátano","Hacendado",48,7,4.2,0.4,0,[250,"botella","botellas"],"🥤",1,0,"8402001030383"],
    ["m_hacendado_bebida_de_avena","Bebida de avena","Hacendado",35,0.7,4.7,1.4,0.5,[250,"vaso","vasos"],"🥛",1,0,"8402001014574"],
    ["m_hacendado_queso_fresco_batido_0","Queso fresco batido 0 %","Hacendado",46,8,3.5,0.1,0,[100,"ración","raciones"],"🧀",0,0,"8480000510211"],
    ["m_hacendado_queso_fresco_light","Queso fresco light","Hacendado",117,13,3.8,5.7,0,[50,"ración","raciones"],"🧀",0,0,"8480000511928"],
    ["m_hacendado_queso_fresco_de_burgos","Queso fresco de Burgos","Hacendado",150,10.3,3.7,10.4,0,[50,"ración","raciones"],"🧀",0,0,"8480000524089"],
    ["m_hacendado_requeson","Requesón","Hacendado",139,8.7,5.4,11.6,0,[50,"ración","raciones"],"🧀",0,0,"8413556010324"],
    ["m_hacendado_queso_de_untar_light","Queso de untar light","Hacendado",130,9,4.8,8.3,0,[30,"cucharada","cucharadas"],"🧀",0,0,"8480000512239"],
    ["m_hacendado_mozzarella","Mozzarella","Hacendado",202,17,2,14,0,[30,"ración","raciones"],"🧀",0,0,"8480000510501"],
    ["m_hacendado_queso_rallado_para_fundi","Queso rallado para fundir","Hacendado",284,19,7,20,0,[20,"puñado","puñados"],"🧀",0,0,"8480000236227"],
    ["m_hacendado_havarti_light_lonchas","Havarti light (lonchas)","Hacendado",267,27,1.6,17,0,[20,"loncha","lonchas"],"🧀",0,0,"8480000505460"],
    ["m_hacendado_quesitos","Quesitos","Hacendado",192,11.8,3.9,14.3,0,[16,"quesito","quesitos"],"🧀",0,0,"8480000524058"],
    ["m_hacendado_jamon_cocido_extra","Jamón cocido extra","Hacendado",101,18.6,0.9,2.5,0,[15,"loncha","lonchas"],"🥓",0,0,"8480000592491"],
    ["m_hacendado_pechuga_de_pavo_finas_lo","Pechuga de pavo finas lonchas","Hacendado",78,17.8,0.6,0.5,0,[15,"loncha","lonchas"],"🦃",0,0,"8480000679727"],
    ["m_hacendado_pechuga_de_pollo_en_lonc","Pechuga de pollo en lonchas","Hacendado",84,16.9,1.3,1.2,0,[15,"loncha","lonchas"],"🍗",0,0,"8480000561565"],
    ["m_hacendado_tiras_de_pechuga_de_poll","Tiras de pechuga de pollo al horno","Hacendado",107,23.4,0.6,1.2,0,[140,"envase","envases"],"🍗",0,0,"8480000566614"],
    ["m_hacendado_atun_claro_al_natural","Atún claro al natural","Hacendado",99,21,0.9,1.2,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8480000180186"],
    ["m_hacendado_atun_claro_en_aceite_de_","Atún claro en aceite de oliva","Hacendado",363,18,0.5,32,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8480000180308"],
    ["m_hacendado_atun_claro_en_aceite_de_2","Atún claro en aceite de girasol","Hacendado",252,21,0.9,18,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8480000180551"],
    ["m_hacendado_caballa_en_aceite_de_oli","Caballa en aceite de oliva","Hacendado",224,26.7,0.6,12.2,0,[60,"lata","latas"],"🐟",0,0,"8480000183101"],
    ["m_hacendado_sardinas_en_aceite_de_ol","Sardinas en aceite de oliva","Hacendado",289,20,0.7,23,0,[60,"lata","latas"],"🐟",0,0,"8480000182258"],
    ["m_hacendado_salmon_ahumado","Salmón ahumado","Hacendado",171,22,0.5,9.1,0,[50,"ración","raciones"],"🐟",0,0,"8480000226129"],
    ["m_hacendado_palitos_de_surimi","Palitos de surimi","Hacendado",90,7.9,12.4,0.8,0.9,[15,"palito","palitos"],"🦀",0,0,"8480000625021"],
    ["m_hacendado_mejillones_en_escabeche","Mejillones en escabeche","Hacendado",158,18,6,7.1,0,[60,"lata","latas"],"🦪",0,0,"8480000186157"],
    ["m_hacendado_hummus_de_garbanzos","Hummus de garbanzos","Hacendado",311,6,11.1,25.8,5.5,[30,"cucharada","cucharadas"],"🫘",0,0,"8480000808585"],
    ["m_hacendado_lentejas_cocidas","Lentejas cocidas","Hacendado",89,8.2,10.7,0.4,0,[120,"ración","raciones"],"🫘",0,0,"8480000260307"],
    ["m_hacendado_alubias_rojas_cocidas","Alubias rojas cocidas","Hacendado",89,6.3,11.5,0.4,0,[120,"ración","raciones"],"🫘",0,0,"8480000260000"],
    ["m_hacendado_cacahuete_tostado_0_sal","Cacahuete tostado 0 % sal","Hacendado",618,24,13,50.4,8.2,[30,"puñado","puñados"],"🥜",0,0,"8480000340313"],
    ["m_hacendado_almendra_natural","Almendra natural","Hacendado",619,22.8,6.9,54,10.6,[30,"puñado","puñados"],"🌰",0,0,"8480000235756"],
    ["m_hacendado_anacardos","Anacardos","Hacendado",617,18,22,50,6.4,[30,"puñado","puñados"],"🌰",0,0,"8480000340276"],
    ["m_hacendado_pistachos","Pistachos","Hacendado",607,25,11.5,49.6,7.4,[30,"puñado","puñados"],"🌰",0,0,"8480000342621"],
    ["m_hacendado_aceite_de_oliva_virgen_e","Aceite de oliva virgen extra","Hacendado",822,0,0,91,0,[10,"cucharada","cucharadas"],"🫒",0,0,"8480000047403"],
    ["m_hacendado_chocolate_negro_72","Chocolate negro 72 %","Hacendado",560,7,40,39,0,[10,"onza","onzas"],"🍫",0,0,"8410109114157"],
    ["m_hacendado_miel","Miel","Hacendado",333,0.5,83,0,0,[15,"cucharada","cucharadas"],"🍯",0,0,"8480000154507"],
    ["m_hacendado_tomate_frito","Tomate frito","Hacendado",77,1.5,9.5,3.5,0,[50,"ración","raciones"],"🍅",0,0,"8480000171511"],
    ["m_hacendado_salsa_de_tomate_zero","Salsa de tomate zero","Hacendado",83,1.7,17.8,0,0,[50,"ración","raciones"],"🍅",0,0,"8402001007033"],
    ["m_hacendado_salmorejo","Salmorejo","Hacendado",134,1.5,9.5,10,0,[250,"vaso","vasos"],"🍅",1,0,"8480000399014"],
    ["m_hacendado_tortilla_de_patatas_con_","Tortilla de patatas con cebolla","Hacendado",193,5.7,17,11,0,[150,"ración","raciones"],"🍳",0,0,"8480000808950"],
    ["m_hacendado_pizza_jamon_y_queso","Pizza jamón y queso","Hacendado",224,14,25.2,7.5,0,[175,"media pizza","medias pizzas"],"🍕",0,0,"8480000635815"],
    ["m_hacendado_lasana_bolonesa","Lasaña boloñesa","Hacendado",143,7.4,14,6.1,1,[350,"envase","envases"],"🍝",0,0,"8480000044877"],
    ["m_hacendado_patatas_fritas_clasicas","Patatas fritas clásicas","Hacendado",558,6.7,52,35,0,[30,"puñado","puñados"],"🥔",0,0,"8480000222459"],
    ["m_hacendado_maiz_dulce","Maíz dulce","Hacendado",75,2.6,9.3,2.3,0,[75,"lata","latas"],"🌽",0,0,"8480000167149"],
    ["m_hacendado_salchichas_tipo_frankfur","Salchichas tipo frankfurt","Hacendado",201,11.5,5.2,14.9,0,[44,"salchicha","salchichas"],"🌭",0,0,"8480000531414"],
    ["m_hacendado_fuet","Fuet","Hacendado",421,27.5,1.4,34,0,[20,"ración","raciones"],"🥓",0,0,"8480000551085"],
    ["m_hacendado_mantequilla","Mantequilla","Hacendado",734,0.5,0.8,81,0,[10,"cucharadita","cucharaditas"],"🧈",0,0,"8480000207272"],
    ["m_hacendado_mayonesa","Mayonesa","Hacendado",599,0.6,2.4,65,0,[15,"cucharada","cucharadas"],"🥚",0,0,"8402001028649"],
    ["m_hacendado_edamame","Edamame","Hacendado",145,12,3.3,7.6,7.5,[100,"ración","raciones"],"🫛",0,0,"8480000707406"],
    ["m_hacendado_gelatina_0","Gelatina 0 %","Hacendado",9,1.6,0.7,0,0,[100,"tarrina","tarrinas"],"🍮",0,0,"8402001011856"],
    ["m_hacendado_natillas_proteicas","Natillas proteicas","Hacendado",78,10,5,1.5,0,[125,"tarrina","tarrinas"],"🍮",0,0,"8402001025235"],
    ["m_danone_skyr_natural","Skyr natural","Danone",58,10,3.9,0.2,0,[140,"tarrina","tarrinas"],"🥣",0,0,"3033491454080"],
    ["m_activia_kefir_natural","Kéfir natural","Activia",59,3.3,4.1,3.3,0,[125,"vaso","vasos"],"🥛",0,0,"3033491993138"],
    ["m_milbona_li_yogur_griego_natural","Yogur griego natural","Milbona (Lidl)",126,4.1,4.6,10,0.5,[125,"yogur","yogures"],"🥣",0,0,"4056489148739"],
    ["m_milbona_li_yogur_griego_light","Yogur griego light","Milbona (Lidl)",68,7,9.2,0.2,0.2,[125,"yogur","yogures"],"🥣",0,0,"4056489518273"],
    ["m_milbona_li_queso_cottage","Queso cottage","Milbona (Lidl)",98,11.5,2.8,4.5,0,[100,"ración","raciones"],"🧀",0,0,"20002183"],
    ["m_milbona_li_pudding_proteico_vainill","Pudding proteico vainilla","Milbona (Lidl)",75,10,5.2,1.5,0.2,[200,"tarrina","tarrinas"],"🍮",0,0,"4056489216155"],
    ["m_arla_pudding_proteico_chocola","Pudding proteico chocolate","Arla",77,10,6.6,1.5,0,[200,"tarrina","tarrinas"],"🍮",0,0,"4100290080389"],
    ["m_prozis_crema_de_cacahuete_100","Crema de cacahuete 100 %","Prozis",626,26,13,51,6.8,[15,"cucharada","cucharadas"],"🥜",0,0,"5600826203613"],
    ["m_myprotein_protein_pancakes_prepara","Protein Pancakes (preparado)","Myprotein",239,16.3,26.5,7.2,1.2,[50,"ración","raciones"],"🥞",0,0,"8721082164009"],
    ["m_kaiku_gazpacho","Gazpacho","Kaiku",37,0.9,2.9,2.2,0,[250,"vaso","vasos"],"🍅",1,0,"8432425070900"],
    ["m_myprotein_impact_whey_protein","Impact Whey Protein","Myprotein",379,72,8.9,5.9,0,[25,"cacito","cacitos"],"🥤",0,0,"5055534302941"],
    ["m_myprotein_impact_whey_isolate","Impact Whey Isolate","Myprotein",360,83.3,4.7,0.8,0,[25,"cacito","cacitos"],"🥤",0,0,"5055534325834"],
    ["m_myprotein_clear_whey_isolate","Clear Whey Isolate","Myprotein",331,76.9,8.1,0,0,[25,"cacito","cacitos"],"🥤",0,0,"5059883300740"],
    ["m_optimum_nu_gold_standard_100_whey","Gold Standard 100 % Whey","Optimum Nutrition",377,80,5.7,4.3,0,[30,"cacito","cacitos"],"🥤",0,0,"5060469988535"],
    ["m_prozis_100_real_whey_protein","100 % Real Whey Protein","Prozis",371,73,5.4,6.4,0,[30,"cacito","cacitos"],"🥤",0,0,"5600380897549"],
    ["m_hsn_evowhey_protein","Evowhey Protein","HSN",367,78,6.2,3.3,0,[30,"cacito","cacitos"],"🥤",0,0,"5060326271602"],
    ["m_quest_barrita_de_proteinas","Barrita de proteínas","Quest",322,35,12,11,0,[60,"barrita","barritas"],"🍫",0,0,"0888849004942"],
    ["m_barebells_protein_bar","Protein Bar","Barebells",364,36,29,15,7,[55,"barrita","barritas"],"🍫",0,0,"7340001801101"],
    ["m_danone_oikos_griego_natural","Oikos griego natural","Danone",128,4,6.1,9.7,0,[110,"yogur","yogures"],"🥣",0,0,"6194003804223"],
    ["m_danone_yopro_natural","YoPro natural","Danone",60,8.4,5.4,0.5,0.2,[160,"yogur","yogures"],"🥣",0,0,"4009700050533"],
    ["m_danone_activia_natural","Activia natural","Danone",62,3.4,4.4,3.4,0,[120,"yogur","yogures"],"🥣",0,0,"3033491147067"],
    ["m_danone_danone_natural","Danone natural","Danone",46,3.8,5.1,1,0,[120,"yogur","yogures"],"🥣",0,0,"3033490004521"],
    ["m_milbona_li_skyr_natural","Skyr natural","Milbona (Lidl)",62,11,4,0.2,0,[150,"tarrina","tarrinas"],"🥣",0,0,"4056489491217"],
    ["m_arla_arla_protein_natural","Arla Protein natural","Arla",79,10,7.4,1.5,0,[150,"tarrina","tarrinas"],"🥣",0,0,"4100290077617"],
    ["m_alpro_bebida_de_soja_original","Bebida de soja original","Alpro",39,3,2.5,1.8,0.5,[250,"vaso","vasos"],"🥛",1,0,"5411188115472"],
    ["m_alpro_bebida_de_avena","Bebida de avena","Alpro",42,0.8,6,1.5,0.7,[250,"vaso","vasos"],"🥛",1,0,"5411188115366"],
    ["m_central_le_leche_semidesnatada","Leche semidesnatada","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"🥛",1,0,"8410297113673"],
    ["m_puleva_leche_desnatada","Leche desnatada","Puleva",37,3.2,4.8,0.5,0,[250,"vaso","vasos"],"🥛",1,0,"8411700603798"],
    ["m_kaiku_leche_sin_lactosa_semide","Leche sin lactosa semidesnatada","Kaiku",101,5.4,9,4.6,0,[250,"vaso","vasos"],"🥛",1,0,"8432425049913"],
    ["m_philadelph_queso_de_untar_original","Queso de untar original","Philadelphia",227,5.3,4.3,20.7,0.3,[30,"cucharada","cucharadas"],"🧀",0,0,"7622201695521"],
    ["m_philadelph_queso_de_untar_light","Queso de untar light","Philadelphia",145,7.2,5.1,10,0.3,[30,"cucharada","cucharadas"],"🧀",0,0,"7622300340292"],
    ["m_el_caserio_quesitos","Quesitos","El Caserío",217,11,3.8,17,0,[16,"quesito","quesitos"],"🧀",0,0,"8410172462957"],
    ["m_barilla_spaghetti_n_5","Spaghetti n.º 5","Barilla",353,12.9,74.1,1.8,5.9,[80,"ración","raciones"],"🍝",0,1,"0076808011036"],
    ["m_gallo_spaghetti","Spaghetti","Gallo",350,13,67,2.7,3,[80,"ración","raciones"],"🍝",0,1,"8410069017895"],
    ["m_sos_arroz_largo","Arroz largo","SOS",349,7.7,74,1.9,3.1,[80,"ración","raciones"],"🍚",0,1,"8410184020466"],
    ["m_brillante_arroz_redondo","Arroz redondo","Brillante",351,7.3,77,1.4,1.9,[80,"ración","raciones"],"🍚",0,1,"8410184016520"],
    ["m_quaker_copos_de_avena","Copos de avena","Quaker",375,11,60,8,9,[40,"ración","raciones"],"🥣",0,0,"5000108030904"],
    ["m_kellogg_s_special_k_original","Special K Original","Kellogg's",392,8,84,1.3,6,[30,"ración","raciones"],"🥣",0,0,"5050083296079"],
    ["m_kellogg_s_corn_flakes","Corn Flakes","Kellogg's",377,7,84,0.9,3,[30,"ración","raciones"],"🥣",0,0,"3159470000120"],
    ["m_nestle_fitness_original","Fitness Original","Nestlé",368,9.8,74.7,1.5,8.5,[30,"ración","raciones"],"🥣",0,0,"7613287514325"],
    ["m_bimbo_pan_de_molde_100_integra","Pan de molde 100 % integral","Bimbo",250,11,42,3.2,6.1,[30,"rebanada","rebanadas"],"🍞",0,0,"8412600038635"],
    ["m_calvo_atun_claro_en_aceite_de_","Atún claro en aceite de oliva","Calvo",265,20,0,20,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8410090051264"],
    ["m_isabel_atun_claro_en_aceite_de_","Atún claro en aceite de oliva","Isabel",198,27,0,10,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8410111000615"],
    ["m_campofrio_pechuga_de_pavo","Pechuga de pavo","Campofrío",82,16,2.2,1,0,[15,"loncha","lonchas"],"🦃",0,0,"8410320249478"],
    ["m_elpozo_pechuga_de_pavo","Pechuga de pavo","ElPozo",90,20,0,1,0,[15,"loncha","lonchas"],"🦃",0,0,"8410843146230"],
    ["m_carbonell_aceite_de_oliva_virgen_e","Aceite de oliva virgen extra","Carbonell",900,0,0,100,0,[10,"cucharada","cucharadas"],"🫒",0,0,"8410010006206"],
    ["m_heinz_tomate_ketchup","Tomate Ketchup","Heinz",102,1.2,23.2,0.1,0,[15,"cucharada","cucharadas"],"🍅",0,0,"8715700421353"],
    ["m_hellmann_s_mayonesa","Mayonesa","Hellmann's",726,1.1,1.4,79,0,[15,"cucharada","cucharadas"],"🥚",0,0,"8718114724485"],
    ["m_cola_cao_cola_cao_original","Cola Cao Original","Cola Cao",68,3.4,9.6,1.7,0.5,[15,"cucharada","cucharadas"],"🍫",0,0,"8410014468628"],
    ["m_nutella_nutella","Nutella","Nutella",539,6.3,57.5,30.9,0,[15,"cucharada","cucharadas"],"🍫",0,0,"3017620422003"],
    ["m_lindt_excellence_85_cacao","Excellence 85 % cacao","Lindt",584,12.5,22,46,5,[10,"onza","onzas"],"🍫",0,0,"3046920028363"],
    ["m_lindt_excellence_70_cacao","Excellence 70 % cacao","Lindt",566,9.5,35,41,12.2,[10,"onza","onzas"],"🍫",0,0,"3046920028004"],
    ["m_pringles_pringles_original","Pringles Original","Pringles",528,6.2,54,31,4.1,[30,"puñado","puñados"],"🥔",0,0,"5053990156009"],
    ["m_oreo_oreo_original","Oreo Original","Oreo",481,4.8,70,20,1.5,[11,"galleta","galletas"],"🍪",0,0,"6111031005576"],
    ["m_kinder_kinder_bueno","Kinder Bueno","Kinder",572,8.6,49.5,37.3,1.9,[21.5,"barrita","barritas"],"🍫",0,0,"80052760"],
    ["m_nestle_kitkat","KitKat","Nestlé",507,5.4,63.1,25.5,2.4,[41.5,"barrita","barritas"],"🍫",0,0,"6294003539054"],
    ["m_coca_cola_coca_cola","Coca-Cola","Coca-Cola",42,0,10.6,0,0,[330,"lata","latas"],"🥤",1,0,"5701872203005"],
    ["m_coca_cola_coca_cola_zero","Coca-Cola Zero","Coca-Cola",0,0,0,0,0,[330,"lata","latas"],"🥤",1,0,"5000112558265"],
    ["m_red_bull_red_bull_energy_drink","Red Bull Energy Drink","Red Bull",47,0,11,0,0,[250,"lata","latas"],"⚡",1,0,"9002490209599"],
    ["m_red_bull_red_bull_sugarfree","Red Bull Sugarfree","Red Bull",2,0,0,0,0,[250,"lata","latas"],"⚡",1,0,"90456220"],
    ["m_monster_monster_energy_ultra","Monster Energy Ultra","Monster",2,0,1.1,0,0,[500,"lata","latas"],"⚡",1,0,"5060896623863"],
    ["m_alpro_bebida_sin_azucar_almend","Bebida sin Azúcar Almendras","Alpro",13,0.4,0,1.1,0.3,[250,"vaso","vasos"],"",1,0,"5411188112709"],
    ["m_alpro_bebida_avena_sin_azucar","Bebida avena Sin Azúcar","Alpro",40,0.2,5.8,1.5,1.2,[100,"ración","raciones"],"",0,0,"5411188124689"],
    ["m_alpro_yogur_sabor_natural_con_","Yogur sabor Natural con Coco","Alpro",54,3.9,2.4,2.8,0.9,[100,"ración","raciones"],"",0,0,"5411188119098"],
    ["m_alpro_yogur_mango_sin_azucares","Yogur mango Sin Azúcares Añadidos","Alpro",62,3.7,6,2.2,1,[100,"ración","raciones"],"",0,0,"5411188125808"],
    ["m_alpro_yogur_natural_con_almend","Yogur natural con almendra","Alpro",54,3.9,2.3,2.8,1.1,[100,"ración","raciones"],"",0,0,"5411188118961"],
    ["m_alpro_yogur_natural_sin_azucar","Yogur natural sin azúcares","Alpro",42,4,0,2.3,0.9,[100,"ración","raciones"],"",0,0,"5411188118121"],
    ["m_alpro_yogur_frutos_rojos_con_d","Yogur frutos rojos con datilesn","Alpro",65,3.7,6.6,2.1,1.1,[100,"ración","raciones"],"",0,0,"5411188136347"],
    ["m_alpro_yogur_natural_con_avena","Yogur natural con avena","Alpro",55,3.8,3,2,2.3,[100,"ración","raciones"],"",0,0,"5411188124269"],
    ["m_alpro_yogur_especialidad_veget","Yogur especialidad vegetal de soja con arándanos","Alpro",70,3.7,8.2,2.2,1,[100,"ración","raciones"],"",0,0,"5411188102809"],
    ["m_alpro_yogur_arandanos_base_de_","Yogur arándanos base de soja","Alpro",70,3.7,8.2,2.2,1,[100,"ración","raciones"],"",0,0,"5411188137993"],
    ["m_alpro_bebida_avena","Bebida avena","Alpro",45,1.3,7.7,0.8,0.7,[100,"ración","raciones"],"",0,0,"5411188136217"],
    ["m_alpro_bebida_100_vegetal_clasi","Bebida 100% Vegetal Clásica Avena","Alpro",62,0.7,6.3,3.5,1,[250,"vaso","vasos"],"",1,0,"5411188136613"],
    ["m_alpro_bebida_barista_gluten_fr","Bebida barista gluten free oat","Alpro",61,0.3,7.9,3.1,0,[100,"ración","raciones"],"",0,0,"5411188132110"],
    ["m_alpro_yogur_absolutely_coconut","Yogur absolutely Coconut stracciatella","Alpro",117,0.6,13.5,6.4,0.7,[100,"ración","raciones"],"",0,0,"5411188134473"],
    ["m_alpro_skyr_style_high_protein_","Skyr Style High Protein Natural","Alpro",68,5.8,2.6,3.3,1.5,[125,"unidad","unidades"],"",0,0,"5411188129318"],
    ["m_alpro_bebida_soya_light","Bebida soya light","Alpro",28,2.1,1.7,1.2,0.9,[100,"ración","raciones"],"",0,0,"5411188096474"],
    ["m_alpro_bebida_coco_100_vegetal","Bebida coco 100 vegetal","Alpro",20,0.1,2.7,0.9,0.1,[250,"vaso","vasos"],"",1,0,"5411188136231"],
    ["m_bimbo_pan_de_pipas_de_girasol_","Pan de Pipas de Girasol y Calabaza","Bimbo",272,14,30,8.6,9.5,[100,"ración","raciones"],"",0,0,"8412600028513"],
    ["m_bimbo_pan_integral_100_natural","Pan integral 100% natural","Bimbo",253,10,44,2.5,7,[100,"ración","raciones"],"",0,0,"8412600029343"],
    ["m_bimbo_pan_grande","Pan grande","Bimbo",252,9.8,45,2.7,4.7,[100,"ración","raciones"],"",0,0,"8412600012185"],
    ["m_bimbo_pan_de_molde_natural","Pan de molde Natural","Bimbo",235,9.7,42,2.2,0,[100,"ración","raciones"],"",0,0,"8412600013854"],
    ["m_bimbo_pan_de_molde","Pan de molde","Bimbo",255,8.2,48,2.7,3.4,[100,"ración","raciones"],"",0,0,"8412600028568"],
    ["m_bimbo_pan_integral_silueta_8_c","Pan integral Silueta 8 cereales","Bimbo",246,3.4,39,3.4,34,[100,"ración","raciones"],"",0,0,"8412600300121"],
    ["m_bimbo_pan_de_molde_sin_corteza","Pan de molde sin corteza","Bimbo",229,9.3,41,2.6,2.8,[100,"ración","raciones"],"",0,0,"8412600100325"],
    ["m_bimbo_pan_natural_100","Pan natural 100%","Bimbo",252,9.6,45,2.8,4.2,[100,"ración","raciones"],"",0,0,"8412600009345"],
    ["m_bimbo_pan_formato_ahorro","Pan formato ahorro","Bimbo",295,10,48,6.1,3.1,[100,"ración","raciones"],"",0,0,"8412600012192"],
    ["m_bimbo_cruapan","Cruapan","Bimbo",389,7.4,39.5,21.6,3.7,[100,"ración","raciones"],"",0,0,"8412600019290"],
    ["m_bimbo_pan_bagels_semillas_8_8","Pan bagels Semillas 8,8%","Bimbo",296,11,51,4.1,5.1,[100,"ración","raciones"],"",0,0,"8412600018323"],
    ["m_bimbo_pan_bimbo_rebanada_integ","Pan bimbo Rebanada Integral Estilo Artesano","Bimbo",259,8.7,48,2.7,5.1,[100,"ración","raciones"],"",0,0,"8412600011812"],
    ["m_bimbo_silueta_pan_de_molde_int","Silueta pan de molde integral sin corteza cereales","Bimbo",225,9.4,36,3.5,6,[100,"ración","raciones"],"",0,0,"8412600307618"],
    ["m_bimbo_pan_rebanada_estilo_arte","Pan rebanada estilo artesano Brioche","Bimbo",263,10,46,3.3,4.2,[100,"ración","raciones"],"",0,0,"8412600016176"],
    ["m_bimbo_maxi_burger_pan_de_hambu","Maxi-burger pan de hamburguesas","Bimbo",287,9.9,46,6.3,3.1,[100,"ración","raciones"],"",0,0,"8412600450208"],
    ["m_bimbo_pan_bagels_clasico","Pan bagels clasico","Bimbo",286,11,53,2.7,4,[100,"ración","raciones"],"",0,0,"8412600018316"],
    ["m_bimbo_pan_silueta_integral","Pan silueta integral","Bimbo",230,9.7,39,2.8,6,[100,"ración","raciones"],"",0,0,"8412600352540"],
    ["m_bimbo_pan_pao_10_cereais_e_sem","Pan pão 10 Cereais e Sementes","Bimbo",264,11,38,6.2,6.2,[100,"ración","raciones"],"",0,0,"5601027943551"],
    ["m_calvo_atun_claro_al_natural","Atún claro al natural","Calvo",90,20,0.8,0.6,0,[100,"ración","raciones"],"",0,0,"8410090610638"],
    ["m_calvo_sardinas_en_aceite_de_ol","Sardinas en aceite de oliva","Calvo",323,18,0,28,0,[10,"cucharada","cucharadas"],"",0,0,"8410090441270"],
    ["m_calvo_atun_claro_super_natural","Atún claro super natural","Calvo",99,22,0.5,0.9,0,[100,"ración","raciones"],"",0,0,"8410090031570"],
    ["m_calvo_atun_claro_en_aceite_de_2","Atún claro en aceite de girasol","Calvo",286,20,0,23,0,[10,"cucharada","cucharadas"],"",0,0,"8410090051295"],
    ["m_calvo_sardinas_aceite_de_oliva","Sardinas aceite de oliva bajo en sal","Calvo",323,18,0,28,0,[10,"cucharada","cucharadas"],"",0,0,"8410090450128"],
    ["m_calvo_calamares_en_salsa_ameri","Calamares en salsa americana","Calvo",243,15,6.9,17,0,[100,"ración","raciones"],"",0,0,"8410090302632"],
    ["m_calvo_mejillones_en_escabeche_","Mejillones en escabeche Calvo","Calvo",231,13,0.1,19,0,[100,"ración","raciones"],"",0,0,"8410090710437"],
    ["m_calvo_atun_claro_en_aceite_de_22","Atún claro en aceite de oliva ligero","Calvo",148,21.4,0.7,6.7,0,[10,"cucharada","cucharadas"],"",0,0,"8410090061003"],
    ["m_calvo_atun_claro_en_aceite_de_222","Atún claro en aceite de oliva virgen extra","Calvo",214,23,0.8,13,0,[10,"cucharada","cucharadas"],"",0,0,"8410090050670"],
    ["m_calvo_ensalada_rusa_con_atun","Ensalada Rusa con atun","Calvo",138,7.3,10,7.4,0,[100,"ración","raciones"],"",0,0,"8410090839411"],
    ["m_calvo_mejillones_en_escabeche","Mejillones en escabeche","Calvo",231,13,0,19,0,[100,"ración","raciones"],"",0,0,"8410090710543"],
    ["m_calvo_salmon_al_natural","Salmón al natural","Calvo",80,10,0.6,4.2,0,[100,"ración","raciones"],"",0,0,"8410090912473"],
    ["m_calvo_calamares_en_tinta","Calamares en tinta","Calvo",215,16,5.5,14,0,[100,"ración","raciones"],"",0,0,"8410090301635"],
    ["m_calvo_atun_ensalada_mediterran","Atún ensalada mediterránea Calvo","Calvo",164,7.1,3.5,13,0,[100,"ración","raciones"],"",0,0,"8410090839312"],
    ["m_calvo_atun_en_aceite_de_giraso","Atún en Aceite de Girasol","Calvo",273,21,0,21,0,[10,"cucharada","cucharadas"],"",0,0,"8410090051479"],
    ["m_calvo_atun_claro_en_escabeche","Atún claro en escabeche","Calvo",135,17,0,6.8,0,[100,"ración","raciones"],"",0,0,"8410090110633"],
    ["m_calvo_ventresca_de_atun_claro_","Ventresca de atún claro aceite de oliva","Calvo",344,22,0,28,0,[10,"cucharada","cucharadas"],"",0,0,"8410090941046"],
    ["m_calvo_filetes_de_atun_claro_en","Filetes de atún claro en aceite de oliva","Calvo",359,17,1.6,32,0,[10,"cucharada","cucharadas"],"",0,0,"8410090912343"],
    ["m_campofrio_salchichas_frankfurt_ori","Salchichas frankfurt original","Campofrío",198,13,2.8,15,0,[100,"ración","raciones"],"",0,0,"8410320127363"],
    ["m_campofrio_pechuga_de_pavo_finissim","Pechuga de pavo Finissimas","Campofrío",85,16,2.2,1,0,[100,"ración","raciones"],"",0,0,"8410320001809"],
    ["m_campofrio_salchichas_snackin_mini_","Salchichas snackin' mini fuet","Campofrío",510,29,4.1,42,0,[100,"ración","raciones"],"",0,0,"8410320005449"],
    ["m_campofrio_fiambre_de_pechuga_de_pa","Fiambre de pechuga de pavo","Campofrío",81,14,4,1,0,[100,"ración","raciones"],"",0,0,"8410320371896"],
    ["m_campofrio_jamon_cocido_extra_finis","Jamón Cocido Extra Finissimas","Campofrío",91,18,1.3,1.5,0,[100,"ración","raciones"],"",0,0,"8410320001816"],
    ["m_campofrio_pechuga_de_pavo_braseado","Pechuga de pavo braseado Finissimas","Campofrío",86,17,2.2,1,0,[100,"ración","raciones"],"",0,0,"8410320077941"],
    ["m_campofrio_jamon_cocido","Jamón cocido","Campofrío",101,17,1.5,3,0,[100,"ración","raciones"],"",0,0,"8410320371889"],
    ["m_campofrio_cuida_t_jamon_cocido_ext","Cuida-t+ jamón cocido extrajugoso","Campofrío",97,18,1.7,2,0,[100,"ración","raciones"],"",0,0,"8410320267557"],
    ["m_campofrio_pizza_y_salsa_barbacoa","Pizza y salsa barbacoa","Campofrío",278,10,37,10,0,[100,"ración","raciones"],"",0,0,"8410320034319"],
    ["m_campofrio_pollorico_fiambre_de_pec","Pollorico, fiambre de pechuga de pollo","Campofrío",90,14,5,1.5,0,[100,"ración","raciones"],"",0,0,"8410320187862"],
    ["m_campofrio_pizza_salsa_jamon_y_ques","Pizza & salsa jamón y queso","Campofrío",270,10,35,10,0,[100,"ración","raciones"],"",0,0,"8410320033503"],
    ["m_campofrio_ciuda_t_pechuga_de_pavo_","Ciuda-t+ pechuga de pavo cocida","Campofrío",83,15,3.5,1,0,[100,"ración","raciones"],"",0,0,"8410320267526"],
    ["m_campofrio_vegalia_pizza_vegetarian","Vegalia, pizza vegetariana de verduras asadas y","Campofrío",274,10,36,10,0,[100,"ración","raciones"],"",0,0,"8410320288453"],
    ["m_campofrio_chopped_pork","Chopped pork","Campofrío",180,11,7,12,0,[100,"ración","raciones"],"",0,0,"8410320001496"],
    ["m_campofrio_vegalia_lonchas_vegetari","Vegalia, lonchas vegetarianas a las hierbas","Campofrío",161,5.1,1.4,15,2.9,[100,"ración","raciones"],"",0,0,"8410320278942"],
    ["m_campofrio_vegalia_pizza_vegetarian2","Vegalia, pizza vegetariana con queso de cabra y","Campofrío",258,10,32,10,0,[100,"ración","raciones"],"",0,0,"8410320335591"],
    ["m_campofrio_mini_fuet_snack_in_xxl","MIni Fuet Snack'in XXL","Campofrío",510,29,4.1,42,0,[100,"ración","raciones"],"",0,0,"8410320360371"],
    ["m_campofrio_pizza_y_salsa_5_quesos","Pizza y salsa 5 quesos","Campofrío",293,11,33,13,0,[100,"ración","raciones"],"",0,0,"8410320033527"],
    ["m_carrefour_cereales_copos_de_avena_","Cereales copos de avena integral","Carrefour",372,14,59,7,10,[100,"ración","raciones"],"",0,1,"3560070614202"],
    ["m_carrefour_biscotes_integrales_ecol","Biscotes integrales ecológicos","Carrefour",378,15,64,5,8.5,[100,"ración","raciones"],"",0,0,"3560070308316"],
    ["m_carrefour_queso_rallado_parmesano","Queso rallado parmesano","Carrefour",402,32,0,30,0,[100,"ración","raciones"],"",0,0,"3560070157198"],
    ["m_carrefour_80_cacao_negro_en_polvo","80% cacao negro (en polvo)","Carrefour",622,9.5,26,51,12,[100,"ración","raciones"],"",0,0,"3560070669981"],
    ["m_carrefour_pan_tostado_integral","Pan tostado integral","Carrefour",375,12,69,4,7.5,[100,"ración","raciones"],"",0,0,"3560070710713"],
    ["m_carrefour_chocolate_negro","Chocolate negro","Carrefour",567,9.6,32,42,12,[100,"ración","raciones"],"",0,0,"3270190127765"],
    ["m_carrefour_biscotes_natural","Biscotes Natural","Carrefour",393,11,74,5,4,[100,"ración","raciones"],"",0,0,"3245412589980"],
    ["m_carrefour_cereales_crujiente_natur","Cereales crujiente Natural","Carrefour",426,8,68,12,9.3,[100,"ración","raciones"],"",0,0,"3560070792368"],
    ["m_carrefour_bebida_almendra_sin_azuc","Bebida almendra Sin azúcares","Carrefour",26,0.7,1.7,1.7,0.5,[250,"vaso","vasos"],"",1,0,"3560071014094"],
    ["m_carrefour_cereales_cornflakes","Cereales cornflakes","Carrefour",374,7.2,83,0.8,3.3,[100,"ración","raciones"],"",0,0,"3560071267582"],
    ["m_carrefour_bebida_avena","Bebida avena","Carrefour",43,0.5,7.2,1.2,0.8,[100,"ración","raciones"],"",0,0,"3245413451804"],
    ["m_carrefour_galleta_con_mantequilla_","Galleta con mantequilla Tableta chocolate negro","Carrefour",493,7.5,60,24,4.7,[100,"ración","raciones"],"",0,0,"3270190128519"],
    ["m_carrefour_pasta_pesto_verde","Pasta pesto verde","Carrefour",447,2.6,3.2,46,4.2,[100,"ración","raciones"],"",0,0,"3245413808196"],
    ["m_carrefour_galleta_de_mantequilla","Galleta de mantequilla","Carrefour",441,8,73,12,3.3,[100,"ración","raciones"],"",0,0,"3560070439881"],
    ["m_carrefour_cereales_muesli_de_quino","Cereales muesli de quinoa y chocolate","Carrefour",424,9.1,67,12,6.8,[100,"ración","raciones"],"",0,0,"3560071407650"],
    ["m_carrefour_90_cacao_negro_en_polvo","90% cacao negro (en polvo)","Carrefour",622,12,16,54,13,[100,"ración","raciones"],"",0,0,"3560071005214"],
    ["m_carrefour_pan_acimo","Pan ácimo","Carrefour",377,11,78,1.5,3.5,[100,"ración","raciones"],"",0,0,"3560070218196"],
    ["m_carrefour_100_cacao_en_polvo","100% Cacao En polvo","Carrefour",381,23,11,21,29,[15,"cucharada","cucharadas"],"",0,0,"3560071194345"],
    ["m_central_le_mantequilla","Mantequilla","Central Lechera Asturiana",742,0.6,0.4,82,0,[100,"ración","raciones"],"",0,0,"8410297132209"],
    ["m_central_le_leche_entera","Leche entera","Central Lechera Asturiana",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410297112041"],
    ["m_central_le_leche_entera_de_vaca","Leche entera de vaca","Central Lechera Asturiana",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410297010200"],
    ["m_central_le_leche_uht_semidesnatada","Leche uht semidesnatada","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"",1,0,"8410297111150"],
    ["m_central_le_leche_desnatada","Leche desnatada","Central Lechera Asturiana",34,3.2,4.7,0.3,0,[250,"vaso","vasos"],"",1,0,"8410297012105"],
    ["m_central_le_1488_leche_sin_lactosa_s","1488 Leche Sin Lactosa semi Asturiana","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"",1,0,"8410297115318"],
    ["m_central_le_mantequilla_tradicional_","Mantequilla tradicional Rulo","Central Lechera Asturiana",742,0.6,0.4,82,0,[100,"ración","raciones"],"",0,0,"8410297031007"],
    ["m_central_le_nata_montada_azucarada_e","Nata Montada Azucarada en aerosol Asturiana","Central Lechera Asturiana",306,2.4,11,28,0,[100,"ración","raciones"],"",0,0,"8410297121104"],
    ["m_central_le_mantequilla_sin_lactosa_","Mantequilla sin lactosa ligera","Central Lechera Asturiana",381,0,3,41,0,[100,"ración","raciones"],"",0,0,"8410297132384"],
    ["m_central_le_leche_sin_lactosa_desnat","Leche sin Lactosa Desnatada","Central Lechera Asturiana",33,3.2,4.7,0.1,0,[100,"ración","raciones"],"",0,0,"8410297115349"],
    ["m_central_le_nata_para_cocinar","Nata para cocinar","Central Lechera Asturiana",189,2.4,4.4,18,0,[100,"ración","raciones"],"",0,0,"8410297120138"],
    ["m_central_le_leche_entera_sin_lactosa","Leche entera sin lactosa","Central Lechera Asturiana",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410297115448"],
    ["m_central_le_nata_para_montar_asturia","Nata para montar Asturiana","Central Lechera Asturiana",360,1.8,2.7,38,0,[100,"ración","raciones"],"",0,0,"8410297120152"],
    ["m_central_le_mantequilla_tradicional","Mantequilla tradicional","Central Lechera Asturiana",742,0.6,0.4,82,0,[100,"ración","raciones"],"",0,0,"8410297033001"],
    ["m_central_le_bebida_alpro_soja","Bebida alpro soja","Central Lechera Asturiana",40,3,2.8,1.8,0.4,[100,"ración","raciones"],"",0,0,"8410297161315"],
    ["m_central_le_mantequilla_tradicional_2","Mantequilla tradicional con sal tarrina","Central Lechera Asturiana",724,0.6,0.4,80,0,[100,"ración","raciones"],"",0,0,"8410297132216"],
    ["m_central_le_leche_semi","Leche semi","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"",1,0,"8410297110986"],
    ["m_central_le_bebida_vegetanea_avena","Bebida vegetánea Avena","Central Lechera Asturiana",51,1.1,10,0.7,0.1,[100,"ración","raciones"],"",0,0,"8410297162510"],
    ["m_danone_skyr","Skyr","Danone",48,7.1,2.8,0.1,0,[125,"unidad","unidades"],"",0,0,"3033490004743"],
    ["m_danone_yogur_de_coco","Yogur de Coco","Danone",84,0.6,6,6.1,0,[125,"unidad","unidades"],"",0,0,"5411188131380"],
    ["m_danone_protein_drink_raspberry_","Protein Drink Raspberry Flavour","Danone",58,8.3,5.4,0.4,0,[250,"vaso","vasos"],"",1,0,"8410500023652"],
    ["m_danone_yogur_natural","Yogur natural","Danone",58,3.3,4.3,3.3,0,[125,"unidad","unidades"],"",0,0,"8410500001360"],
    ["m_danone_oikos_yogur_griego_natur","Oikos yogur griego natural","Danone",122,3.2,4.1,10,0,[125,"unidad","unidades"],"",0,0,"8410500021870"],
    ["m_danone_yogur_sabor_fresa","Yogur sabor fresa","Danone",77,3,11.9,1.9,0,[125,"unidad","unidades"],"",0,0,"8410500006105"],
    ["m_danone_yogur_activia_bifidus_na","Yogur activia bífidus natural desnatado 0%","Danone",42,4,5,0.4,0,[100,"ración","raciones"],"",0,0,"8410500002961"],
    ["m_danone_postre_danet_vainilla","Postre danet vainilla","Danone",109,3.1,17.7,2.9,0,[100,"ración","raciones"],"",0,0,"8410500010614"],
    ["m_danone_yogur_oikos_para_chefs","Yogur oikos para chefs","Danone",94,3.4,4.4,7,0,[100,"ración","raciones"],"",0,0,"8410500028268"],
    ["m_danone_postre_protein_pudding_c","Postre protein Pudding Chocolate Flavour","Danone",82,10.2,6.3,1.8,0,[100,"ración","raciones"],"",0,0,"5601050037272"],
    ["m_danone_yogur_danonino_sabor_fre","Yogur danonino sabor fresa","Danone",88,5.9,11.3,2.1,0,[100,"ración","raciones"],"",0,0,"8410500015787"],
    ["m_danone_kefir","Kefir","Danone",63,3.4,4.2,3.3,0,[250,"vaso","vasos"],"",1,0,"8410500025762"],
    ["m_danone_yogur_sabor_limon_sin_gl","Yogur sabor limón sin gluten","Danone",77,3,11.9,1.9,0,[125,"unidad","unidades"],"",0,0,"8410500006112"],
    ["m_danone_yogur_hiperpro","Yogur hiperpro","Danone",60,8.3,5.4,0.5,0,[100,"ración","raciones"],"",0,0,"3033491836343"],
    ["m_danone_yogur_natural_original","Yogur natural original","Danone",31,2.8,4,0.4,0,[100,"ración","raciones"],"",0,0,"8410500012861"],
    ["m_danone_yogur_bifidus_natural_ed","Yogur bífidus natural edulcorado desnatado m.g.","Danone",51,3.9,7,0.4,0,[100,"ración","raciones"],"",0,0,"8410500012120"],
    ["m_danone_yogur_sabor_macedonia","Yogur sabor macedonia","Danone",77,3,11.9,1.9,0,[125,"unidad","unidades"],"",0,0,"8410500006143"],
    ["m_danone_yogur_sabor_coco_sin_glu","Yogur sabor coco sin gluten","Danone",72,3,10,2.2,0,[125,"unidad","unidades"],"",0,0,"8410500006150"],
    ["m_dia_leche_entera","Leche entera","Dia",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8480017006080"],
    ["m_dia_cereales_copos_de_avena","Cereales copos de Avena","Dia",372,13.5,58.7,7,10,[100,"ración","raciones"],"",0,1,"8480017038845"],
    ["m_dia_cereales_muesli_frutas","Cereales muesli frutas","Dia",352,8.5,61.5,5.9,9.4,[100,"ración","raciones"],"",0,0,"8480017372017"],
    ["m_dia_yogur_natural","Yogur natural","Dia",62,3.3,4.3,3.5,0,[125,"unidad","unidades"],"",0,0,"8480017243409"],
    ["m_dia_kefir_natural","Kéfir natural","Dia",58,3.1,4.1,3.3,0,[250,"vaso","vasos"],"",1,0,"8480017209566"],
    ["m_dia_bebida_de_avena","Bebida de avena","Dia",49,0.9,9.5,0.8,0,[100,"ración","raciones"],"",0,0,"8480017235619"],
    ["m_dia_galletas_digestive_de_av","Galletas digestive de avena","Dia",483,7,61,22,6.4,[100,"ración","raciones"],"",0,0,"8480017092991"],
    ["m_dia_gazpacho","Gazpacho","Dia",42,0.8,3.6,2.3,0,[250,"vaso","vasos"],"",1,0,"8480017432315"],
    ["m_dia_almendras_al_natural_con","Almendras al natural con piel","Dia",595,21.1,9.1,49.9,12.5,[100,"ración","raciones"],"",0,0,"8480017175601"],
    ["m_dia_bebida_de_avena_con_calc","Bebida de avena con calcio","Dia",56,1.1,11,0.7,0,[250,"vaso","vasos"],"",1,0,"8480017151599"],
    ["m_dia_tortitas_de_maiz","Tortitas de maíz","Dia",376,8.2,80,2,0,[100,"ración","raciones"],"",0,0,"8480017112866"],
    ["m_dia_cereales_corn_flakes","Cereales corn flakes","Dia",377,6,84,1.1,3.4,[100,"ración","raciones"],"",0,0,"8480017669568"],
    ["m_dia_leche_desnatada_dia","Leche desnatada dia","Dia",34,3.1,4.8,0.3,0,[250,"vaso","vasos"],"",1,0,"8480017006073"],
    ["m_dia_pan_de_molde_100_integra","Pan de molde 100% integral &quot;El Molino&quot;","Dia",250,10,39,3.9,9.4,[100,"ración","raciones"],"",0,0,"8480017233103"],
    ["m_dia_pan_de_molde_integral_fa","Pan de molde integral familiar","Dia",236,10,40,2.8,5.7,[100,"ración","raciones"],"",0,0,"8480017232793"],
    ["m_dia_pan_de_molde_blanco_sin_","Pan de molde blanco sin corteza","Dia",250,8.3,44.5,3.3,0,[100,"ración","raciones"],"",0,0,"8480017486660"],
    ["m_dia_pan_de_molde_formato_fam","Pan de molde formato familiar","Dia",246,9.2,45,2.5,2,[100,"ración","raciones"],"",0,0,"8480017779557"],
    ["m_dia_yogur_desnatado_edulcora","Yogur Desnatado Edulcorado Natural","Dia",39,3.9,5.6,0.1,0,[125,"unidad","unidades"],"",0,0,"8480017075192"],
    ["m_elpozo_jamon_cocido_extra_1954","Jamón cocido extra 1954","ElPozo",111,19.4,0.5,3.5,0,[100,"ración","raciones"],"",0,0,"8410843144007"],
    ["m_elpozo_sobrasada","Sobrasada","ElPozo",569,7.3,0.5,60,0,[100,"ración","raciones"],"",0,0,"8410843005810"],
    ["m_elpozo_pechuga_de_pavo_lonchas_","Pechuga de Pavo Lonchas Finas","ElPozo",69,14.5,0.5,1,0,[100,"ración","raciones"],"",0,0,"8410843145202"],
    ["m_elpozo_jamon_cocido_fiambre_de_","Jamón cocido fiambre de york","ElPozo",123,11.8,11,3.5,0,[100,"ración","raciones"],"",0,0,"8410843036333"],
    ["m_elpozo_salchichas_sobrasada_ibe","Salchichas sobrasada ibérico","ElPozo",538,8,0.5,56,0,[100,"ración","raciones"],"",0,0,"8410843003717"],
    ["m_elpozo_jamon_cocido_extra","Jamon cocido extra","ElPozo",97,18.5,0.3,2.5,0,[100,"ración","raciones"],"",0,0,"8410843129905"],
    ["m_elpozo_fiambre_de_pavo_sandwich","Fiambre de pavo sándwich","ElPozo",98,9.5,10.5,2,0,[100,"ración","raciones"],"",0,0,"8410843012801"],
    ["m_elpozo_pechuga_de_pavo_lonchas_2","Pechuga de pavo lonchas finas sin grasa reducido","ElPozo",75,17,0.5,0.5,0,[100,"ración","raciones"],"",0,0,"8410843135104"],
    ["m_elpozo_extratiernos_escalopin_d","Extratiernos escalopín de lomo de cerdo fresco","ElPozo",118,20,0.5,4,0,[100,"ración","raciones"],"",0,0,"8410843060451"],
    ["m_elpozo_salchichas_longaniza_imp","Salchichas longaniza imperial","ElPozo",388,26.5,5,29,0,[100,"ración","raciones"],"",0,0,"8410843112648"],
    ["m_elpozo_pechuga_de_pavo_lonchas_22","Pechuga de pavo lonchas finas sin grasa sin","ElPozo",75,17,0.5,0.5,0,[100,"ración","raciones"],"",0,0,"8410843135098"],
    ["m_elpozo_pechuga_pavo_bienstar_po","Pechuga pavo bienstar pozo","ElPozo",71,16,0.5,0.5,0,[100,"ración","raciones"],"",0,0,"8410843129707"],
    ["m_elpozo_salchichas_king_original","Salchichas king original ss gluten","ElPozo",227,15.5,1.3,17.8,0,[100,"ración","raciones"],"",0,0,"8410843118169"],
    ["m_elpozo_salchichas_salami_montan","Salchichas salami montañes","ElPozo",506,17,7,45.5,0,[100,"ración","raciones"],"",0,0,"8410843011866"],
    ["m_elpozo_mortadela_siciliana","Mortadela siciliana","ElPozo",252,9.5,6,21,0,[100,"ración","raciones"],"",0,0,"8410843013877"],
    ["m_elpozo_lonchas_de_pavo","Lonchas de pavo","ElPozo",75,14.5,2,1,0,[100,"ración","raciones"],"",0,0,"8410843031512"],
    ["m_elpozo_all_natural_pechuga_de_p","All natural pechuga de pavo lonchas finas","ElPozo",78,15.3,2,1,0,[100,"ración","raciones"],"",0,0,"8410843035947"],
    ["m_elpozo_fiambre_de_pechuga_de_po","Fiambre de pechuga de pollo","ElPozo",86,13.6,4.4,1.5,0,[100,"ración","raciones"],"",0,0,"8410843012405"],
    ["m_eroski_bebida_avena","Bebida avena","Eroski",52,1.1,10,0.8,0,[100,"ración","raciones"],"",0,0,"8480010204674"],
    ["m_eroski_cereales_muesli_con_alme","Cereales muesli con almendras, avellanas y nueces","Eroski",489,11,54,24,6.7,[100,"ración","raciones"],"",0,0,"8480010192919"],
    ["m_eroski_pan_de_molde_integral","Pan de molde integral","Eroski",251,10,40,4.1,7.2,[100,"ración","raciones"],"",0,0,"8480010193954"],
    ["m_eroski_pan_de_molde","Pan de molde","Eroski",259,9.4,46,3,5.3,[100,"ración","raciones"],"",0,0,"8480010178845"],
    ["m_eroski_yogur_natural","Yogur natural","Eroski",34,3.9,4.4,0,0,[125,"unidad","unidades"],"",0,0,"8480010142884"],
    ["m_eroski_galletas_cookies_con_chi","Galletas cookies con chips de chocolate","Eroski",489,5,66,22,3.6,[100,"ración","raciones"],"",0,0,"8480010197389"],
    ["m_eroski_yogur_griego_natural","Yogur Griego Natural","Eroski",115,3.3,3.7,9.7,0,[125,"unidad","unidades"],"",0,0,"8480010164459"],
    ["m_eroski_atun_claro_en_aceite_de_","Atun claro en aceite de oliva","Eroski",252,22,2.9,18,0,[10,"cucharada","cucharadas"],"",0,0,"8480010073034"],
    ["m_eroski_cereales_corn_flakes","Cereales corn flakes","Eroski",375,6,84,0.9,3.4,[100,"ración","raciones"],"",0,0,"8480010197433"],
    ["m_eroski_bebida_de_soja_ligera","Bebida de soja ligera","Eroski",33,2.1,3.5,1.1,0,[250,"vaso","vasos"],"",1,0,"8480010169768"],
    ["m_eroski_crema_de_cacahuete_100","Crema de cacahuete 100 %","Eroski",647,28,5.7,51,3.3,[100,"ración","raciones"],"",0,0,"8480010206562"],
    ["m_eroski_kefir","Kéfir","Eroski",45,3.3,4.5,1.5,0,[250,"vaso","vasos"],"",1,0,"8480010193268"],
    ["m_eroski_miel_mil_flores","Miel mil flores","Eroski",330,0.6,82,0,0,[100,"ración","raciones"],"",0,0,"8480010059779"],
    ["m_eroski_aceite_de_oliva_virgen_e","Aceite de oliva virgen extra","Eroski",842,0,0,91,0,[10,"cucharada","cucharadas"],"",0,0,"8480010008319"],
    ["m_eroski_queso_fresco_batido_natu","Queso fresco batido Natural","Eroski",46,7.5,4,0,0,[100,"ración","raciones"],"",0,0,"8480010198300"],
    ["m_eroski_aperitivo_de_guisantes_y","Aperitivo de guisantes y arroz","Eroski",452,12,64,15,0,[100,"ración","raciones"],"",0,0,"8480010203066"],
    ["m_eroski_queso_rallado_mozarella","Queso rallado mozarella","Eroski",293,25,0,21,0,[100,"ración","raciones"],"",0,0,"8480010205404"],
    ["m_eroski_tomate_frito","Tomate frito","Eroski",73,1.2,8.9,3.5,0,[100,"ración","raciones"],"",0,0,"8480010147711"],
    ["m_gallo_pesto_a_base_de_albahaca","Pesto a base de albahaca","Gallo",473,5.8,9,46,1.9,[100,"ración","raciones"],"",0,0,"8410069014382"],
    ["m_gallo_harina_de_trigo","Harina de trigo","Gallo",352,9,75,1.2,0,[100,"ración","raciones"],"",0,1,"8410069021649"],
    ["m_gallo_pasta_spaghetti_nature_i","Pasta spaghetti nature integral","Gallo",335,14,60,2.6,13,[100,"ración","raciones"],"",0,1,"8410069018441"],
    ["m_gallo_nature_lenteja_pasta_de_","Nature lenteja - pasta de harina de lenteja roja","Gallo",347,26,49,2.5,12,[100,"ración","raciones"],"",0,0,"8410069019028"],
    ["m_gallo_risotto_traditional","Risotto Traditional","Gallo",348,6.9,77.3,1,1,[100,"ración","raciones"],"",0,0,"8001420009118"],
    ["m_gallo_pasta_spaghetti","Pasta spaghetti","Gallo",344,12,68,2,3,[100,"ración","raciones"],"",0,1,"8410069018960"],
    ["m_gallo_pasta_plumas_rayadas_int","Pasta plumas rayadas integrales","Gallo",346,12,66,2,8,[100,"ración","raciones"],"",0,0,"8410069018458"],
    ["m_gallo_pasta_plumas","Pasta plumas","Gallo",344,12,68,2,3,[100,"ración","raciones"],"",0,0,"8410069018991"],
    ["m_gallo_caldo_de_pollo","Caldo de pollo","Gallo",7,1.2,0.2,0.2,0.1,[100,"ración","raciones"],"",0,0,"8410069020116"],
    ["m_gallo_pasta_fideo","Pasta fideo","Gallo",344,12,68,2,3,[100,"ración","raciones"],"",0,1,"8410069018311"],
    ["m_gallo_cous_cous","Cous cous","Gallo",349,12,69,1.8,4.2,[100,"ración","raciones"],"",0,0,"8410069000019"],
    ["m_gallo_nature_garbanzo","Nature Garbanzo","Gallo",370,21,52,6.5,0,[100,"ración","raciones"],"",0,0,"8410069019035"],
    ["m_gallo_pasta_helices_con_tomate","Pasta helices con tomate y espinacas","Gallo",344,12,67,2,5,[100,"ración","raciones"],"",0,0,"8410069017925"],
    ["m_gallo_harina_integral_de_trigo","Harina integral de trigo","Gallo",339,13,61,2.3,0,[100,"ración","raciones"],"",0,1,"8410069013569"],
    ["m_gallo_gnocchis","Gnocchis","Gallo",156,3,35,0.4,1.9,[100,"ración","raciones"],"",0,0,"8410069013484"],
    ["m_gallo_harina_fuerza_de_trigo","Harina fuerza de trigo","Gallo",344,11.7,69,1.4,0,[100,"ración","raciones"],"",0,1,"8410069014436"],
    ["m_gallo_pasta_ensaladas_integral","Pasta ensaladas integral","Gallo",348,12.5,66,2,8,[100,"ración","raciones"],"",0,0,"8410069017215"],
    ["m_gallo_pasta_plumas_sin_gluten","Pasta plumas sin gluten","Gallo",362,6.2,78,2,3.3,[100,"ración","raciones"],"",0,0,"8410069018564"],
    ["m_hacendado_crema_de_cacahuete_100","Crema de cacahuete 100 %","Hacendado",618,30,7,50,9.9,[100,"ración","raciones"],"",0,0,"8480000671400"],
    ["m_hacendado_100_cacahuetes","100% Cacahuetes","Hacendado",608,30,12,47,8.2,[100,"ración","raciones"],"",0,0,"8480000168832"],
    ["m_hacendado_galletas_digestive_avena","Galletas digestive Avena","Hacendado",477,7.5,61,21,6.8,[100,"ración","raciones"],"",0,0,"8480000142139"],
    ["m_hacendado_guacamole","Guacamole","Hacendado",149,1.9,2,13.7,5,[100,"ración","raciones"],"",0,0,"8480000038524"],
    ["m_hacendado_cereales_avena_crunchy","Cereales avena crunchy","Hacendado",390,13,66,5.8,11,[100,"ración","raciones"],"",0,1,"8480000156112"],
    ["m_hacendado_ketchup","Ketchup","Hacendado",115,1.3,27,0,0,[100,"ración","raciones"],"",0,0,"8480000235794"],
    ["m_hacendado_cereales_corn_flakes_0_a","Cereales corn Flakes 0%azúcares añadidos","Hacendado",373,6.7,82,1.1,4.4,[100,"ración","raciones"],"",0,0,"8480000229663"],
    ["m_hacendado_nuez_natural_pelada","Nuez natural pelada","Hacendado",716,17,2.2,70,6.2,[100,"ración","raciones"],"",0,0,"8480000340245"],
    ["m_hacendado_yogur_griego_natural","Yogur griego natural","Hacendado",129,3.9,3.9,10.8,0,[125,"unidad","unidades"],"",0,0,"8480000205599"],
    ["m_hacendado_cereales_muesli_frutas","Cereales muesli Frutas","Hacendado",361,9.1,59,7.6,10,[100,"ración","raciones"],"",0,0,"8480000094919"],
    ["m_hacendado_muesli_con_quinoa_chia_y","Muesli con quinoa, chía y chocolate","Hacendado",416,9.8,60,13,10,[100,"ración","raciones"],"",0,0,"8480000095367"],
    ["m_hacendado_gazpacho_tradicional","Gazpacho Tradicional","Hacendado",41,0.8,3.6,2.6,1.1,[250,"vaso","vasos"],"",1,0,"8480000156044"],
    ["m_hacendado_bebida_almendra","Bebida almendra","Hacendado",16,0.5,0,1.5,0,[250,"vaso","vasos"],"",1,0,"8480000239266"],
    ["m_hacendado_cereales_trigo_espelta","Cereales trigo Espelta","Hacendado",364,14.6,66,2.7,8.8,[100,"ración","raciones"],"",0,0,"8480000095718"],
    ["m_hacendado_galletas_trigo_espelta_0","Galletas trigo espelta 0% azúcares añadidos","Hacendado",428,9.6,60,18,8.3,[100,"ración","raciones"],"",0,0,"8480000142429"],
    ["m_hacendado_patatas_fritas_nachos","Patatas fritas nachos","Hacendado",481,8.2,61,22,6.3,[100,"ración","raciones"],"",0,0,"8480000336408"],
    ["m_hacendado_pipas_girasol_tostadas_g","Pipas girasol tostadas gigante aguasal","Hacendado",636,28.7,5.5,53.7,8,[100,"ración","raciones"],"",0,0,"8480000340788"],
    ["m_hacendado_galletas_digestive","Galletas digestive","Hacendado",483,7.1,65,20,5.9,[100,"ración","raciones"],"",0,0,"8480000142009"],
    ["m_hacendado_chocolate_negro_99_cacao","Chocolate negro 99% cacao (en polvo)","Hacendado",610,15,8,54,16,[100,"ración","raciones"],"",0,0,"8480000125866"],
    ["m_hacendado_pan_de_molde_con_52_cent","Pan de molde con 52% centeno","Hacendado",265,10,35,7.8,7.5,[100,"ración","raciones"],"",0,0,"8480000823021"],
    ["m_hacendado_granola_con_frutos_secos","Granola con frutos secos","Hacendado",477,13.6,50.2,22.7,8.5,[100,"ración","raciones"],"",0,0,"8480000094742"],
    ["m_hacendado_yogur_griego_natural_tar","Yogur griego natural (tarro 1 kg)","Hacendado",129,3.9,3.9,10.8,0,[125,"unidad","unidades"],"",0,0,"8480000205124"],
    ["m_hacendado_queso_mozzarella_pizza_r","Queso mozzarella Pizza-Roma","Hacendado",283,21,2.5,21,0,[100,"ración","raciones"],"",0,0,"8480000511102"],
    ["m_hacendado_bebida_avena_calcio","Bebida avena Calcio","Hacendado",52,0,6.8,2.5,0.6,[100,"ración","raciones"],"",0,0,"8480000861672"],
    ["m_hacendado_cereales_muesli_crunchy","Cereales muesli Crunchy","Hacendado",409,9.3,64,13,8.6,[100,"ración","raciones"],"",0,0,"8480000094513"],
    ["m_hacendado_cereales_muesli_50_fruta","Cereales muesli 50% frutas y frutos secos","Hacendado",367,6.8,60,9.3,7.8,[100,"ración","raciones"],"",0,0,"8480000094926"],
    ["m_hacendado_pan_100_integral","Pan 100% Integral","Hacendado",238,11,37,3.2,7.4,[100,"ración","raciones"],"",0,0,"8480000823281"],
    ["m_hacendado_queso_suave","Queso suave","Hacendado",241,4.2,3.7,23,0,[100,"ración","raciones"],"",0,0,"8480000512031"],
    ["m_hacendado_yogur_natural","Yogur natural","Hacendado",62,3.7,4.1,3.4,0,[100,"ración","raciones"],"",0,0,"8480000223135"],
    ["m_hacendado_cereales_copos_laminados","Cereales copos laminados y tostados de trigo","Hacendado",373,10.3,75,1.6,7.9,[100,"ración","raciones"],"",0,1,"8480000094889"],
    ["m_hacendado_zumo_pura_naranja","Zumo pura naranja","Hacendado",44,0.7,9.9,0.1,0.6,[250,"vaso","vasos"],"",1,0,"8480000390103"],
    ["m_hacendado_yogur_ligero_natural","Yogur ligero Natural","Hacendado",60,5.8,4.7,2,0,[100,"ración","raciones"],"",0,0,"8480000213587"],
    ["m_hacendado_tomate_frito_receta_arte","Tomate frito receta artesana con aceite de oliva","Hacendado",201,1.6,14.3,15,0,[10,"cucharada","cucharadas"],"",0,0,"8480000171634"],
    ["m_hacendado_cereal_mix_0_azucares_an","Cereal mix 0% azúcares añadidos","Hacendado",372,9.4,74.8,4.1,5.6,[100,"ración","raciones"],"",0,0,"8480000095329"],
    ["m_hacendado_gazpacho_fresco","Gazpacho fresco","Hacendado",75,0.6,2.5,7,0,[250,"vaso","vasos"],"",1,0,"8480000399007"],
    ["m_hacendado_cereales_rellenos_de_lec","Cereales rellenos de leche","Hacendado",447,10,67,14.5,3.3,[100,"ración","raciones"],"",0,0,"8480000092649"],
    ["m_hacendado_queso_havarti_cremoso","Queso havarti cremoso","Hacendado",396,19,1.3,35,0,[100,"ración","raciones"],"",0,0,"8480000505453"],
    ["m_hacendado_garbanzo_cocido","Garbanzo cocido","Hacendado",90,5.5,9.5,2.2,4.7,[100,"ración","raciones"],"",0,0,"8480000260291"],
    ["m_hacendado_nata_ligera_para_cocinar","Nata ligera para cocinar","Hacendado",163,2,5,15,0,[100,"ración","raciones"],"",0,0,"8480000101990"],
    ["m_hacendado_bebida_de_almendras_con_","Bebida de almendras con calcio","Hacendado",36,0.7,3.7,2,0.5,[250,"vaso","vasos"],"",1,0,"8480000156488"],
    ["m_hacendado_postre_proteinas_natilla","Postre +Proteínas Natillas Sabor Vainilla","Hacendado",64,8.3,4.8,1.3,0,[125,"unidad","unidades"],"",0,0,"8480000223111"],
    ["m_hacendado_bebida_de_soja_0_azucare","Bebida de soja 0% azúcares","Hacendado",32,3.1,0.6,1.7,0.5,[250,"vaso","vasos"],"",1,0,"8480000293145"],
    ["m_hacendado_pan_tostado_100_espelta_","Pan tostado 100% espelta integral","Hacendado",382,17,58.7,6.4,10.8,[100,"ración","raciones"],"",0,0,"8480000828422"],
    ["m_hacendado_queso_cottage_cheese","Queso cottage cheese","Hacendado",99,14,1.7,4,0,[100,"ración","raciones"],"",0,0,"8480000609632"],
    ["m_hacendado_postre_proteinas_chocola","Postre +Proteínas Chocolate","Hacendado",81,8.4,8.7,1.1,1.3,[100,"ración","raciones"],"",0,0,"8480000210616"],
    ["m_hacendado_panela","Panela","Hacendado",376,0,94,0,0,[100,"ración","raciones"],"",0,0,"8480000198594"],
    ["m_hacendado_coctel_de_frutos_secos_n","Cóctel de frutos secos natural","Hacendado",651,20.4,5.6,58.8,9,[100,"ración","raciones"],"",0,0,"8480000868091"],
    ["m_hacendado_rebuenas_galletas_rellen","Rebuenas, galletas rellenas de chocolate","Hacendado",484,6.4,65,21,4.9,[100,"ración","raciones"],"",0,0,"8480000141576"],
    ["m_hacendado_galletas_maria_doradas","Galletas maría doradas","Hacendado",443,7,71,14,2.2,[100,"ración","raciones"],"",0,0,"8480000141323"],
    ["m_hacendado_cacahuete_en_polvo_desgr","Cacahuete en polvo desgrasado","Hacendado",417,46.7,21,13.3,13.3,[15,"cucharada","cucharadas"],"",0,0,"8480000137388"],
    ["m_hacendado_anacardo_al_natural","Anacardo al natural","Hacendado",604,21.9,19,48.2,3.6,[100,"ración","raciones"],"",0,0,"8480000233653"],
    ["m_hacendado_caldo_de_pollo","Caldo de pollo","Hacendado",5,0.5,1.3,0.5,0.5,[250,"vaso","vasos"],"",1,0,"8480000073136"],
    ["m_hacendado_bebida_de_soja_uth_con_c","Bebida de soja UTH con chocolate","Hacendado",35,3.3,1,1.8,1,[250,"vaso","vasos"],"",1,0,"8480000860125"],
    ["m_hacendado_kefir_coco","Kéfir Coco","Hacendado",21,0.2,2.9,1,0,[250,"vaso","vasos"],"",1,0,"8480000156648"],
    ["m_hacendado_galletas_digestive_de_av","Galletas digestive de avena con chocolate","Hacendado",490,7.8,61,23,5.5,[100,"ración","raciones"],"",0,0,"8480000142085"],
    ["m_hacendado_miel_de_flores","Miel de flores","Hacendado",333,0.3,83,0,0,[100,"ración","raciones"],"",0,0,"8480000154309"],
    ["m_hacendado_kefir_natural","Kéfir natural","Hacendado",36,3.9,4.8,0.5,0,[250,"vaso","vasos"],"",1,0,"8480000156624"],
    ["m_hacendado_jamon_cocido_maxi_york_f","Jamón cocido maxi york finas lonchas","Hacendado",102,11.3,7.1,3.2,0,[100,"ración","raciones"],"",0,0,"8480000561152"],
    ["m_hacendado_queso_fresco_burgos_natu","Queso fresco Burgos Natural","Hacendado",164,10.9,4.2,11.5,0,[100,"ración","raciones"],"",0,0,"8480000510266"],
    ["m_hacendado_pan_12_cereales_y_semill","Pan 12 Cereales y semillas","Hacendado",263,11,38,6.1,6.3,[100,"ración","raciones"],"",0,0,"8480000835475"],
    ["m_hacendado_jamon_cocido_natural","Jamón cocido natural","Hacendado",101,18.6,0.9,2.5,0,[100,"ración","raciones"],"",0,0,"8480000592569"],
    ["m_hacendado_chocolate_negro_85_cacao","Chocolate negro 85% cacao 0% azúcares añadidos (en polvo)","Hacendado",571,11,22,49,13,[100,"ración","raciones"],"",0,0,"8480000125248"],
    ["m_hacendado_cereales_muesli_con_frut","Cereales muesli con frutos secos","Hacendado",458,8,63,18,6,[100,"ración","raciones"],"",0,0,"8480000093578"],
    ["m_hacendado_fritada_pisto","Fritada pisto","Hacendado",92,1.2,10,4.8,0,[100,"ración","raciones"],"",0,0,"8480000171122"],
    ["m_hacendado_muesli_crunchy_con_choco","Muesli crunchy con chocolate","Hacendado",434,8.4,61,16,6,[100,"ración","raciones"],"",0,0,"8480000093554"],
    ["m_hacendado_galletas_maria_dorada","Galletas maría Dorada","Hacendado",445,6.9,68,18,3.9,[100,"ración","raciones"],"",0,0,"8480000135025"],
    ["m_hacendado_regana","Regaña","Hacendado",448,11,65,15,3.7,[100,"ración","raciones"],"",0,0,"8480000823656"],
    ["m_hacendado_pan_de_molde_espelta_100","Pan de molde espelta 100% integral natural","Hacendado",273,10.6,45.4,3.8,6.5,[100,"ración","raciones"],"",0,0,"8480000826466"],
    ["m_hacendado_cereales_de_chocolate_y_","Cereales de chocolate y avellana","Hacendado",437,6.4,72,13,3.4,[100,"ración","raciones"],"",0,0,"8480000093776"],
    ["m_hacendado_bebida_de_soja","Bebida de Soja","Hacendado",35,3.4,0.8,1.9,0.7,[250,"vaso","vasos"],"",1,0,"8480000136824"],
    ["m_hacendado_cereales_chocodays","Cereales chocodays","Hacendado",372,8,70,4.8,7.6,[100,"ración","raciones"],"",0,0,"8480000095084"],
    ["m_hacendado_bebida_de_avellanas_y_ar","Bebida de avellanas y arroz","Hacendado",50,0.6,6.9,2.1,0.4,[250,"vaso","vasos"],"",1,0,"8480000138484"],
    ["m_hacendado_aceite_de_coco_virgen","Aceite de coco virgen","Hacendado",900,0,0,100,0,[10,"cucharada","cucharadas"],"",0,0,"8480000041937"],
    ["m_hacendado_pan_semillas_pipas","Pan semillas & Pipas","Hacendado",291,11,38,9.3,5.7,[100,"ración","raciones"],"",0,0,"8480000838698"],
    ["m_hacendado_postre_pudding_sabor_car","Postre pudding Sabor Caramelo +Proteínas","Hacendado",77,10,5.8,1.5,0,[100,"ración","raciones"],"",0,0,"8480000609564"],
    ["m_hacendado_picos_100_integrales","Picos 100 % integrales","Hacendado",379,14,60.9,6.4,11,[100,"ración","raciones"],"",0,0,"8480000862150"],
    ["m_hacendado_pan_de_molde_100_integra2","Pan de molde 100% integral 0% azúcares añadidos","Hacendado",227,11,38,2.3,5.5,[100,"ración","raciones"],"",0,0,"8480000838681"],
    ["m_hacendado_pan_tostado_100_integral","Pan Tostado 100% Integral de Trigo","Hacendado",376,16,59.4,6,10.2,[100,"ración","raciones"],"",0,0,"8480000860088"],
    ["m_hacendado_leche_desnatada_proteina","Leche desnatada +Proteínas","Hacendado",44,6,4.6,0.2,0,[250,"vaso","vasos"],"",1,0,"8480000106780"],
    ["m_hacendado_postre_proteinas_natural","Postre proteínas natural","Hacendado",52,10,3.1,0.5,0,[100,"ración","raciones"],"",0,0,"8480000209085"],
    ["m_hacendado_mantequilla_sin_sal","Mantequilla sin sal","Hacendado",730,0.5,0.8,82,0,[100,"ración","raciones"],"",0,0,"8480000207166"],
    ["m_hacendado_tomate_frito_con_aceite_","Tomate frito con aceite de oliva","Hacendado",77,1.5,9.5,3.5,0,[10,"cucharada","cucharadas"],"",0,0,"8480000171283"],
    ["m_hacendado_margarina_ligera","Margarina Ligera","Hacendado",370,0.5,2.2,40,0,[100,"ración","raciones"],"",0,0,"8480000208767"],
    ["m_hacendado_galletas_digestive_choco","Galletas digestive chocolate con leche","Hacendado",463,6,63,20,3.6,[100,"ración","raciones"],"",0,0,"8480000141316"],
    ["m_hacendado_yogur_natural_con_azucar","Yogur natural con azucar de caña","Hacendado",94,2.7,11.6,3.8,0,[125,"unidad","unidades"],"",0,0,"8480000205841"],
    ["m_hacendado_queso_feta","Queso feta","Hacendado",277,16,1,23.2,0,[100,"ración","raciones"],"",0,0,"8480000511973"],
    ["m_hacendado_tortitas_arroz_con_legum","Tortitas arroz con legumbres","Hacendado",366,24.9,54.9,3.3,8.1,[100,"ración","raciones"],"",0,0,"8480000864833"],
    ["m_hacendado_pistacho_tostado_0_sal","Pistacho tostado 0% sal","Hacendado",616,21.6,11,52.5,11,[100,"ración","raciones"],"",0,0,"8480000861900"],
    ["m_hacendado_pechuga_de_pavo_bajo_en_","Pechuga de pavo bajo en sal finas lonchas","Hacendado",76,16.5,1.3,0.5,0,[100,"ración","raciones"],"",0,0,"8480000592521"],
    ["m_hacendado_zumo_pura_naranja_con_pu","Zumo pura naranja con pulpa","Hacendado",44,0.7,9.9,0.1,0.8,[250,"vaso","vasos"],"",1,0,"8480000390325"],
    ["m_hacendado_queso_gouda","Queso Gouda","Hacendado",345,23.4,0,27.9,0,[100,"ración","raciones"],"",0,0,"8713734033825"],
    ["m_hacendado_chocolatinas_de_chocolat","Chocolatinas de chocolate negro 85%","Hacendado",576,12,22,46,15,[100,"ración","raciones"],"",0,0,"8480000124937"],
    ["m_hacendado_chia","Chía","Hacendado",464,22,2.6,34,30,[100,"ración","raciones"],"",0,0,"8480000349613"],
    ["m_hacendado_salsa_barbacoa","Salsa barbacoa","Hacendado",151,1.2,35.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000173461"],
    ["m_hacendado_postre_lacteo_proteinas_","Postre lácteo +Proteínas con mango y maracuya 0%","Hacendado",47,8.3,5.8,0.1,0,[125,"unidad","unidades"],"",0,0,"8480000211514"],
    ["m_hacendado_hummus_con_pimiento_del_","Hummus con pimiento del piquillo asado","Hacendado",292,5.7,7.5,24,6.3,[100,"ración","raciones"],"",0,0,"8480000808622"],
    ["m_hacendado_tomate_frito_receta_arte2","Tomate frito receta artesana","Hacendado",201,1.6,14.3,15,0,[100,"ración","raciones"],"",0,0,"8480000171313"],
    ["m_hacendado_chocolate_negro_85_cacao2","Chocolate negro 85% cacao (en polvo)","Hacendado",576,12,22,46,15,[100,"ración","raciones"],"",0,0,"8480000124920"],
    ["m_hacendado_pipa_calabaza_natural","Pipa Calabaza Natural","Hacendado",583,35,3,48,5.5,[100,"ración","raciones"],"",0,0,"8480000341884"],
    ["m_hacendado_queso_fundido_sandwich","Queso fundido sandwich","Hacendado",288,17,9.9,20,0,[100,"ración","raciones"],"",0,0,"8480000503718"],
    ["m_hacendado_pan_tostado_proteinas","Pan tostado proteínas","Hacendado",409,46.5,13,21.4,11.3,[100,"ración","raciones"],"",0,0,"8480000865267"],
    ["m_hacendado_cebolla_frita","Cebolla frita","Hacendado",590,6,40,44,5,[100,"ración","raciones"],"",0,0,"8718781824402"],
    ["m_hacendado_chocolate_negro_722","Chocolate negro 72%","Hacendado",568,10,32,42,11,[100,"ración","raciones"],"",0,0,"8480000237736"],
    ["m_hacendado_aceite_refinado_de_giras","Aceite refinado de girasol","Hacendado",828,0,0,92,0,[10,"cucharada","cucharadas"],"",1,0,"8480000040466"],
    ["m_hacendado_queso_fresco_batido","Queso Fresco Batido","Hacendado",46,8,3.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000510716"],
    ["m_hacendado_caldo_de_verduras","Caldo de verduras","Hacendado",5,0.5,0.5,0.6,0.5,[250,"vaso","vasos"],"",1,0,"8480000070326"],
    ["m_hacendado_galletas_cereales_fibra","Galletas cereales & fibra","Hacendado",440,5.5,65,15,0,[100,"ración","raciones"],"",0,0,"8480000141989"],
    ["m_hacendado_barrita_proteica_platano","Barrita proteica plátano brownie","Hacendado",147,9.3,17,4.8,0,[100,"ración","raciones"],"",0,0,"8480000864819"],
    ["m_hacendado_pan_tostado_cereales_y_s","Pan tostado Cereales y semillas","Hacendado",422,16,57,13,7.8,[100,"ración","raciones"],"",0,0,"8480000822901"],
    ["m_hacendado_pechuga_de_pavo_maxi","Pechuga de pavo maxi","Hacendado",78,12.8,6.8,0.5,0,[100,"ración","raciones"],"",0,0,"8480000224309"],
    ["m_hacendado_galletas_chocolate","Galletas chocolate","Hacendado",398,6.7,63,17,3.7,[100,"ración","raciones"],"",0,0,"8480000158444"],
    ["m_hacendado_galletas_maria_integral","Galletas maria integral","Hacendado",423,7,74,10,4.5,[100,"ración","raciones"],"",0,0,"8480000140067"],
    ["m_hacendado_classic_cafe_soluble","Classic Café Soluble","Hacendado",278,25,33,0.4,22,[15,"cucharada","cucharadas"],"",0,0,"8480000221636"],
    ["m_hacendado_mostaza_clasica","Mostaza clásica","Hacendado",75,3.8,2.3,5.3,0,[100,"ración","raciones"],"",0,0,"8480000234100"],
    ["m_hacendado_bebida_choco_avena","Bebida choco avena","Hacendado",44,1.2,5.1,1.9,1,[100,"ración","raciones"],"",0,0,"8480000609267"],
    ["m_hacendado_patatas_fritas_light","Patatas fritas light","Hacendado",464,4.4,65,20,2.8,[100,"ración","raciones"],"",0,0,"8480000158109"],
    ["m_hacendado_sirope_de_agave","Sirope de agave","Hacendado",309,0,77.2,0,0,[100,"ración","raciones"],"",0,0,"8480000198600"],
    ["m_hacendado_galletas_cookies","Galletas cookies","Hacendado",494,5.5,62,24,0,[100,"ración","raciones"],"",0,0,"8480000142122"],
    ["m_hacendado_pan_burger_rustico","Pan burger rústico","Hacendado",263,11,40,4.8,8,[100,"ración","raciones"],"",0,0,"8480000602510"],
    ["m_hacendado_pan_de_molde_blanco_natu","Pan de molde blanco natural rústico","Hacendado",265,9.1,47,4.5,1.2,[100,"ración","raciones"],"",0,0,"8480000233592"],
    ["m_hacendado_queso_especial_pasta","Queso especial pasta","Hacendado",292,20,17,16,0,[100,"ración","raciones"],"",0,0,"8480000511515"],
    ["m_hacendado_datiles","Datiles","Hacendado",298,2,68.9,0.5,7.5,[100,"ración","raciones"],"",0,0,"8480000168467"],
    ["m_hacendado_cereales_muesli_crunchy_","Cereales muesli Crunchy Fruta","Hacendado",427,6.3,66,14,6,[100,"ración","raciones"],"",0,0,"8480000093561"],
    ["m_hacendado_pan_cereales_y_semillas","Pan cereales y semillas","Hacendado",425,13.8,59.8,13,0,[100,"ración","raciones"],"",0,0,"8480000824172"],
    ["m_hacendado_queso_quesitos_light","Queso quesitos light","Hacendado",151,11.5,6,9,0,[100,"ración","raciones"],"",0,0,"8480000512321"],
    ["m_hacendado_barritas_chocolate_leche","Barritas chocolate leche","Hacendado",346,5.2,53,11,11,[100,"ración","raciones"],"",0,0,"8480000093509"],
    ["m_hacendado_crema_al_cacao_en_polvo","Crema al cacao (en polvo)","Hacendado",547,4.4,56,33,2.9,[100,"ración","raciones"],"",0,0,"8480000674166"],
    ["m_hacendado_cereales_con_achicoria","Cereales con achicoria","Hacendado",357,4.9,80,0,9.2,[100,"ración","raciones"],"",0,0,"8480000111876"],
    ["m_hacendado_tostadas_sin_gluten","Tostadas sin gluten","Hacendado",387,6.7,84,2.3,1.6,[100,"ración","raciones"],"",0,0,"8480000828392"],
    ["m_hacendado_salsa_soja","Salsa soja","Hacendado",66,7.3,6.3,0,0,[100,"ración","raciones"],"",0,0,"8480000173607"],
    ["m_hacendado_galletas_tradicionales","Galletas tradicionales","Hacendado",448,5,72,15,2.3,[100,"ración","raciones"],"",0,0,"8480000144232"],
    ["m_hacendado_jamon_pavo_finas_lonchas","Jamón pavo finas lonchas","Hacendado",85,14,1.5,2.5,0,[100,"ración","raciones"],"",0,0,"8480000566195"],
    ["m_hacendado_pan_de_molde_blanco_sin_","Pan de molde blanco sin corteza","Hacendado",225,8,42,2.1,3,[100,"ración","raciones"],"",0,0,"8480000823229"],
    ["m_hacendado_tortitas_de_arroz","Tortitas de arroz","Hacendado",363,8.5,75,2.8,1.7,[100,"ración","raciones"],"",0,0,"8480000140135"],
    ["m_hacendado_palomitas_microondas_con","Palomitas microondas con sal","Hacendado",456,9.8,55,20,8.7,[100,"ración","raciones"],"",0,0,"8480000348227"],
    ["m_hacendado_pipas_gigantes_con_sal","Pipas gigantes con sal","Hacendado",631,30,5.7,52,8.1,[100,"ración","raciones"],"",0,0,"8480000340795"],
    ["m_hacendado_galletas_maria_sin_glute","Galletas Maria Sin Gluten","Hacendado",447,6,73.8,13,5.5,[100,"ración","raciones"],"",0,0,"8480000142351"],
    ["m_hacendado_yogur_al_estilo_griego_s","Yogur al estilo griego Stracciatella","Hacendado",159,3.4,15.4,9.3,0,[125,"unidad","unidades"],"",0,0,"8480000205711"],
    ["m_hacendado_uvas_pasas_sultanas_sin_","Uvas pasas sultanas sin semillas","Hacendado",324,3.1,73,1.1,4.8,[100,"ración","raciones"],"",0,0,"8480000230102"],
    ["m_hacendado_patatas_fritas_extra_cru","Patatas fritas extra crunch","Hacendado",507,5.8,57,28,3.5,[100,"ración","raciones"],"",0,0,"8480000333070"],
    ["m_hacendado_postre_proteinas_mousse_","Postre +Proteínas mousse de chocolate","Hacendado",76,10,5,1.6,1,[100,"ración","raciones"],"",0,0,"8480000158024"],
    ["m_hacendado_yogur_natural_0","Yogur natural 0%","Hacendado",36,4.3,4.5,0.1,0,[125,"unidad","unidades"],"",0,0,"8480000202109"],
    ["m_hacendado_yogurt_bebible_de_frutos","Yogurt bebible de frutos silvestres","Hacendado",33,3.3,4.4,0.3,0,[250,"vaso","vasos"],"",1,0,"8480000156617"],
    ["m_hacendado_tofu_firme","Tofu firme","Hacendado",110,11.1,0.9,6.9,0.4,[100,"ración","raciones"],"",0,0,"8410789140118"],
    ["m_hacendado_galletas_relieve","Galletas Relieve","Hacendado",458,6.9,71,16,3.5,[100,"ración","raciones"],"",0,0,"8480000141972"],
    ["m_hacendado_chocolate_negro_92","Chocolate negro 92 %","Hacendado",608,10,6.5,56,19,[100,"ración","raciones"],"",0,0,"8480000602930"],
    ["m_hacendado_queso_fresco_burgos_desn","Queso fresco Burgos desnatado 0% m.g de vaca","Hacendado",68,12.3,4.4,0.2,0,[100,"ración","raciones"],"",0,0,"8480000510747"],
    ["m_hacendado_soja_texturizada_fina","Soja texturizada fina","Hacendado",326,51,20,1.3,15,[100,"ración","raciones"],"",0,0,"8480000073297"],
    ["m_hacendado_yogur_pina_ananas_coco","Yogur piña ananás coco","Hacendado",34,3.3,4.4,0.4,0,[125,"unidad","unidades"],"",0,0,"8480000156600"],
    ["m_hacendado_barritas_frutos_secos","Barritas frutos secos","Hacendado",593,19,20,47,7.1,[100,"ración","raciones"],"",0,0,"8480000095237"],
    ["m_hacendado_bacon_cintas","Bacon cintas","Hacendado",293,16.6,0.5,25,0,[100,"ración","raciones"],"",0,0,"8480000590664"],
    ["m_hacendado_pan_blanco","Pan blanco","Hacendado",249,9,47,2.1,0,[100,"ración","raciones"],"",0,0,"8402001000560"],
    ["m_hacendado_pasta_helices_vegetales","Pasta hélices Vegetales","Hacendado",346,13,68,1.5,4.2,[100,"ración","raciones"],"",0,0,"8480000063441"],
    ["m_hacendado_postre_gellytina","Postre gellytina","Hacendado",65,0,16,0,0,[100,"ración","raciones"],"",0,0,"8480000681720"],
    ["m_hacendado_galletas_maria_choco","Galletas maría choco","Hacendado",466,7.6,69,17,3.2,[100,"ración","raciones"],"",0,0,"8480000142030"],
    ["m_hacendado_tortilla_de_patata_sin_c","Tortilla de patata sin cebolla","Hacendado",157,5.7,11,9.8,0,[100,"ración","raciones"],"",0,0,"8480000807717"],
    ["m_hacendado_cereales_granola","Cereales granola","Hacendado",414,9.9,67,10,8.4,[100,"ración","raciones"],"",0,0,"8480000700872"],
    ["m_hacendado_hamburguesas_de_berenjen","Hamburguesas de berenjenas","Hacendado",195,10.4,12.4,10.7,3.8,[100,"ración","raciones"],"",0,0,"8480000865106"],
    ["m_hacendado_pistacho_tostado_sal","Pistacho tostado sal","Hacendado",617,24.8,14.6,51.1,10,[100,"ración","raciones"],"",0,0,"8480000862020"],
    ["m_hacendado_limon_exprimido","Limón exprimido","Hacendado",290,0,71,0,0,[250,"vaso","vasos"],"",1,0,"8480000049032"],
    ["m_hacendado_gazpacho","Gazpacho","Hacendado",75,0.6,2.5,7,0,[250,"vaso","vasos"],"",1,0,"8480000399656"],
    ["m_hacendado_crema_cacao_en_polvo","Crema Cacao (en polvo)","Hacendado",550,4.5,57,33,1.5,[100,"ración","raciones"],"",0,0,"8480000674173"],
    ["m_hacendado_galletas_de_canela","Galletas de canela","Hacendado",468,6.4,71,17,2.9,[100,"ración","raciones"],"",0,0,"8480000144300"],
    ["m_hacendado_crema_de_calabaza_y_zana","Crema de calabaza y zanahoria","Hacendado",48,0.9,4.2,2.8,1.4,[100,"ración","raciones"],"",0,0,"8480000232250"],
    ["m_hacendado_30_lonchas_de_queso_fund","30 lonchas de queso fundido sabor suave","Hacendado",231,12,8.9,16.1,0,[100,"ración","raciones"],"",0,0,"8480000511829"],
    ["m_hacendado_pechuga_pavo_finas_lonch","Pechuga pavo finas lonchas","Hacendado",76,16.5,1.3,0.5,0,[100,"ración","raciones"],"",0,0,"8480000867865"],
    ["m_hacendado_tomate_triturado","Tomate triturado","Hacendado",28,0.8,5.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000160447"],
    ["m_hacendado_avena_molida","Avena Molida","Hacendado",374,13.5,58.7,7,10,[100,"ración","raciones"],"",0,1,"8480000094575"],
    ["m_hacendado_semillas","Semillas","Hacendado",603,22,3.1,53,13,[100,"ración","raciones"],"",0,0,"8480000868114"],
    ["m_hacendado_margarina_100_vegetal","Margarina 100% vegetal","Hacendado",540,0.5,0.5,60,0,[100,"ración","raciones"],"",0,0,"8480000201966"],
    ["m_hacendado_barritas_muesli_frutos_s","Barritas Muesli Frutos Secos","Hacendado",432,8.1,64,15,4.3,[100,"ración","raciones"],"",0,0,"8480000093486"],
    ["m_hacendado_galletas_cookies_sin_glu","Galletas cookies sin gluten y sin lactosa","Hacendado",477,4.5,66,21.3,1.5,[100,"ración","raciones"],"",0,0,"8480000146373"],
    ["m_hacendado_salsa_de_yogurt","Salsa de Yogurt","Hacendado",257,0.8,8.7,23.9,0,[125,"unidad","unidades"],"",0,0,"8480000173270"],
    ["m_hacendado_cacahuete_tostado_0_sal_","Cacahuete tostado 0% sal añadida","Hacendado",618,24,13,50.4,8.2,[100,"ración","raciones"],"",0,0,"8480000134516"],
    ["m_hacendado_salmorejo_fresco","Salmorejo fresco","Hacendado",134,1.5,9.5,10,0,[250,"vaso","vasos"],"",1,0,"8480000399663"],
    ["m_hacendado_pan_cereales_sin_gluten","Pan cereales sin gluten","Hacendado",244,4.1,34.1,7.7,11.1,[100,"ración","raciones"],"",0,0,"8480000867506"],
    ["m_hacendado_pan_6_maxi_tortillas_tri","Pan 6 Maxi Tortillas Trigo Wraps","Hacendado",303,8,51,6.4,4.4,[100,"ración","raciones"],"",0,0,"8480000808707"],
    ["m_hacendado_margarina","Margarina","Hacendado",543,0.5,0.5,60,0,[100,"ración","raciones"],"",0,0,"8480000208460"],
    ["m_hacendado_yogur_bifidus_0_con_frut","Yogur bifidus 0% con frutos silvestres","Hacendado",46,3.8,7.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000213303"],
    ["m_hacendado_salchichas_cocidas_de_po","Salchichas cocidas de pollo y pavo","Hacendado",202,13.5,0.8,16,0,[100,"ración","raciones"],"",0,0,"8480000530561"],
    ["m_hacendado_tomate_frito_estilo_case","Tomate frito estilo casero con aceite de oliva","Hacendado",104,2,12,5,0,[10,"cucharada","cucharadas"],"",0,0,"8480000171535"],
    ["m_hacendado_coctel_de_frutos_secos","Cóctel de frutos secos","Hacendado",498,14.8,41,28.8,7.9,[100,"ración","raciones"],"",0,0,"8480000342317"],
    ["m_hacendado_hummus_con_olivas_de_kal","Hummus con olivas de Kalamata","Hacendado",297,6.2,7.6,25.1,8.8,[100,"ración","raciones"],"",0,0,"8480000808929"],
    ["m_hacendado_pan_tostado_clasico","Pan tostado clásico","Hacendado",397,11.9,73.8,5.1,4,[100,"ración","raciones"],"",0,0,"8480000822871"],
    ["m_hacendado_ajo_y_perejil","Ajo y perejil","Hacendado",545,8.2,54,33,2.5,[100,"ración","raciones"],"",0,0,"8480000821997"],
    ["m_hacendado_bebida_cafe","Bebida café","Hacendado",31,3,0.7,1.6,0.8,[250,"vaso","vasos"],"",1,0,"8480000805041"],
    ["m_hacendado_postre_flan_de_huevo_pro","Postre flan de huevo +Proteínas","Hacendado",62,10,6.2,0.2,0,[125,"unidad","unidades"],"",0,0,"8480000676351"],
    ["m_hacendado_harina_de_trigo","Harina de trigo","Hacendado",350,10,73,1.3,3,[100,"ración","raciones"],"",0,1,"8480000291004"],
    ["m_hacendado_cereales_rellenos_de_cho","Cereales rellenos de chocolate sin gluten","Hacendado",461,6,69,17.3,2,[100,"ración","raciones"],"",0,0,"8480000095473"],
    ["m_hacendado_tortitas_de_arroz_con_ch","Tortitas de arroz con chocolate blanco","Hacendado",467,7.2,63,20,3,[100,"ración","raciones"],"",0,0,"8480000141415"],
    ["m_hacendado_pan_tomate","Pan tomate","Hacendado",522,8.6,53,30,3.1,[100,"ración","raciones"],"",0,0,"8480000821904"],
    ["m_hacendado_cacao_en_polvo","Cacao (en polvo)","Hacendado",373,6.8,74,3.3,10,[100,"ración","raciones"],"",0,0,"8480000125842"],
    ["m_hacendado_queso_fresco_de_cabra","Queso fresco de cabra","Hacendado",262,12.7,3.4,21.9,12.7,[100,"ración","raciones"],"",0,0,"8480000511942"],
    ["m_hacendado_queso_fresco_vaca","Queso fresco vaca","Hacendado",170,11.8,5.4,11.4,0,[100,"ración","raciones"],"",0,0,"8480000511911"],
    ["m_hacendado_barritas_de_sesamo","Barritas de sesamo","Hacendado",556,14.1,32.1,38.9,10.6,[100,"ración","raciones"],"",0,0,"4006084000956"],
    ["m_hacendado_yogur_proteinas_limon","Yogur proteinas Limón","Hacendado",56,8.3,5.2,0.1,0,[100,"ración","raciones"],"",0,0,"8480000223128"],
    ["m_hacendado_crema_de_leche_y_avellan","Crema de leche y avellana","Hacendado",522,6.5,54.4,30.8,0.8,[100,"ración","raciones"],"",0,0,"8480000230447"],
    ["m_hacendado_yogur_leche_fermentada_c","Yogur leche Fermentada Con Fresa Para Beber","Hacendado",65,2.4,10.3,1.5,0,[100,"ración","raciones"],"",0,0,"8480000206275"],
    ["m_hacendado_queso_perlas_de_mozzarel","Queso perlas de Mozzarella","Hacendado",194,15,2,14,0,[100,"ración","raciones"],"",0,0,"8480000510525"],
    ["m_hacendado_maxi_lomo","Maxi lomo","Hacendado",105,16.3,2.2,3.5,0,[100,"ración","raciones"],"",0,0,"8480000561282"],
    ["m_hacendado_leche_fresca_entera","Leche fresca entera","Hacendado",62,3.1,4.5,3.5,0,[250,"vaso","vasos"],"",1,0,"8480000109330"],
    ["m_hacendado_cacao_avellana_en_polvo","Cacao Avellana (en polvo)","Hacendado",541,5.2,55.6,32.2,3.8,[100,"ración","raciones"],"",0,0,"8480000225115"],
    ["m_hacendado_tahini","Tahini","Hacendado",710,24.9,3.2,65.6,3.4,[100,"ración","raciones"],"",0,0,"8480000174413"],
    ["m_hacendado_nuggets_de_pollo","Nuggets de pollo","Hacendado",230,10.4,16.6,13.4,0.8,[100,"ración","raciones"],"",0,0,"8480000633231"],
    ["m_hacendado_barritas_arandanos","Barritas arándanos","Hacendado",347,5.6,68,5.3,3.4,[100,"ración","raciones"],"",0,0,"8480000093745"],
    ["m_hacendado_leche_entera","Leche entera","Hacendado",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8480000103802"],
    ["m_hacendado_zumo_de_naranja","Zumo De Naranja","Hacendado",45,0.7,9.9,0.1,0.6,[250,"vaso","vasos"],"",1,0,"8480000399199"],
    ["m_hacendado_salsa_mexicana","Salsa Mexicana","Hacendado",38,1.4,6.8,0.1,0,[100,"ración","raciones"],"",0,0,"8480000168276"],
    ["m_hacendado_yogur_con_frutas_del_bos","Yogur con frutas del bosque","Hacendado",98,3.7,13.7,3.2,0,[125,"unidad","unidades"],"",0,0,"8480000203762"],
    ["m_hacendado_jamon_jugoso_cocido_en_s","Jamón jugoso cocido en su jugo","Hacendado",99,17.2,1.4,2.7,0,[100,"ración","raciones"],"",0,0,"8480000592330"],
    ["m_hacendado_zumo_de_manzana","Zumo de Manzana","Hacendado",44,0.1,11.3,0.1,0,[250,"vaso","vasos"],"",1,0,"8480000394033"],
    ["m_hacendado_cereales_chocolate_linne","Cereales chocolate Linnea V","Hacendado",413,7.6,76,7.3,6.7,[100,"ración","raciones"],"",0,0,"8480000156099"],
    ["m_hacendado_gnocchis","Gnocchis","Hacendado",174,4.5,37.6,0.4,0,[100,"ración","raciones"],"",0,0,"8015057003760"],
    ["m_hacendado_batido_de_proteinas_whey","Batido de proteínas whey","Hacendado",46,7.9,2.3,0.6,0,[250,"vaso","vasos"],"",1,0,"8480000106704"],
    ["m_hacendado_cacao_soluble_0_azucares","Cacao soluble 0% azúcares","Hacendado",343,13,45,7.2,24,[15,"cucharada","cucharadas"],"",0,0,"8480000228499"],
    ["m_hacendado_ice_tea_zero","Ice tea zero","Hacendado",2,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8480000861375"],
    ["m_hacendado_sardinillas_en_aceite_de","Sardinillas en aceite de oliva","Hacendado",366,17.1,0.1,33,0,[10,"cucharada","cucharadas"],"",0,0,"8480000182104"],
    ["m_hacendado_arroz_integral_redondo","Arroz integral redondo","Hacendado",347,8.4,71,2.5,3.4,[100,"ración","raciones"],"",0,1,"8480000050144"],
    ["m_hacendado_pechuga_pollo_braseada_f","Pechuga pollo braseada finas lonchas","Hacendado",84,16.9,1.3,1.2,0,[100,"ración","raciones"],"",0,0,"8480000561695"],
    ["m_hacendado_loncheado_kebab_de_pollo","Loncheado kebab de pollo asado","Hacendado",191,22.4,2.7,10,0,[100,"ración","raciones"],"",0,0,"8480000137784"],
    ["m_hacendado_tomate_frito_sin_azucare","Tomate frito sin azúcares añadidos","Hacendado",65,1.5,6.5,3.5,0,[100,"ración","raciones"],"",0,0,"8480000173300"],
    ["m_hacendado_yogur_bifidus_con_cereal","Yogur bífidus con cereales y fibras","Hacendado",95,3.7,12.9,2.9,1.1,[100,"ración","raciones"],"",0,0,"8480000213273"],
    ["m_hacendado_pechuga_de_pollo_al_cort","Pechuga de pollo al corte","Hacendado",84,16.9,1.3,1.2,0,[100,"ración","raciones"],"",0,0,"8480000561626"],
    ["m_hacendado_salchichas_sin_fecula_po","Salchichas sin fécula pollo pavo","Hacendado",202,13.5,0.8,16,0,[100,"ración","raciones"],"",0,0,"8480000530592"],
    ["m_hacendado_mini_caritas_galletas","Mini caritas galletas","Hacendado",481,6.8,64,21,0,[100,"ración","raciones"],"",0,0,"8480000140852"],
    ["m_hacendado_yogur_bebida_lactea_de_f","Yogur bebida láctea de fresa y plátano","Hacendado",76,2.3,12.4,1.9,0,[100,"ración","raciones"],"",0,0,"8480000206138"],
    ["m_hacendado_cafe_latte_cappuccino","Café latte cappuccino","Hacendado",59,3,8.6,1.3,0,[250,"vaso","vasos"],"",1,0,"8480000106667"],
    ["m_hacendado_pina_en_su_jugo","Piña en su Jugo","Hacendado",55,0.4,13.2,0.1,0.5,[100,"ración","raciones"],"",0,0,"8480000152039"],
    ["m_hacendado_crema_calabaza","Crema calabaza","Hacendado",36,0.7,4.9,1.3,0.7,[100,"ración","raciones"],"",0,0,"8480000134998"],
    ["m_hacendado_galleta_maria_integral","Galleta maría integral","Hacendado",433,7.3,74,11,4.6,[100,"ración","raciones"],"",0,0,"8480000141897"],
    ["m_hacendado_zumo_tropical","Zumo tropical","Hacendado",22,0.4,4.9,0,0.2,[250,"vaso","vasos"],"",1,0,"8480000101525"],
    ["m_hacendado_pure_de_batatas","Puré de Batatas","Hacendado",349,8.3,74,0.6,7.4,[100,"ración","raciones"],"",0,0,"8480000232649"],
    ["m_hacendado_picos_camperos_de_jerez","Picos camperos de jerez","Hacendado",394,11.5,79.9,2.3,3.6,[100,"ración","raciones"],"",0,0,"8480000679536"],
    ["m_hacendado_miel_de_naranjo","Miel de naranjo","Hacendado",333,0.4,83,0,0,[100,"ración","raciones"],"",0,0,"8480000154484"],
    ["m_hacendado_mango_deshidratado","Mango deshidratado","Hacendado",318,2.9,70,1.1,7.6,[100,"ración","raciones"],"",0,0,"8480000342096"],
    ["m_hacendado_cereales_linnea_v_chocol","Cereales linnea V Chocolate Leche","Hacendado",399,8.3,76,6.2,5.1,[100,"ración","raciones"],"",0,0,"8480000094872"],
    ["m_hacendado_queso_emmental","Queso emmental","Hacendado",369,27,0.5,29,0.1,[100,"ración","raciones"],"",0,0,"8480000235626"],
    ["m_hacendado_picos","Picos","Hacendado",416,11.2,77.7,6.2,2.2,[100,"ración","raciones"],"",0,0,"8480000822796"],
    ["m_hacendado_pasta_tortelloni_de_carn","Pasta tortelloni de carne","Hacendado",267,11,38,7,0,[100,"ración","raciones"],"",0,0,"8480000061423"],
    ["m_hacendado_tabule_oriental","Tabulé Oriental","Hacendado",167,3.9,25.4,5.2,1.7,[100,"ración","raciones"],"",0,0,"8480000807946"],
    ["m_hacendado_galletas_animadas","Galletas animadas","Hacendado",462,6.8,73,15,4,[100,"ración","raciones"],"",0,0,"8480000140807"],
    ["m_hacendado_galleta_maria","Galleta maría","Hacendado",431,6.4,78,9.7,4.3,[100,"ración","raciones"],"",0,0,"8480000141026"],
    ["m_hacendado_castanas_cocidas_y_pelad","Castañas cocidas y peladas","Hacendado",172,4.1,33,1.5,6.9,[100,"ración","raciones"],"",0,0,"8402001000515"],
    ["m_hacendado_galletas_saladitas","Galletas saladitas","Hacendado",468,7.6,63,20,2.8,[100,"ración","raciones"],"",0,0,"8480000142160"],
    ["m_hacendado_bebida_horchata_de_chufa","Bebida horchata de chufa","Hacendado",84,0.6,14,2.7,0.5,[250,"vaso","vasos"],"",1,0,"8480000237538"],
    ["m_hacendado_postre_gelatina_proteina","Postre gelatina proteínas sabor frutos rojos","Hacendado",39,6,3.8,0,0,[100,"ración","raciones"],"",0,0,"8480000682741"],
    ["m_hacendado_yogur_de_soja_natural","Yogur de soja natural","Hacendado",43,4.6,0,2.7,0.3,[100,"ración","raciones"],"",0,0,"8480000201607"],
    ["m_hacendado_batido_zero_azucares_adi","Batido zero Azucares Adicionados","Hacendado",37,2.3,5.9,0.5,0,[250,"vaso","vasos"],"",1,0,"8480000229670"],
    ["m_hacendado_mermelada_fresa","Mermelada fresa","Hacendado",194,0.5,47,0,0,[100,"ración","raciones"],"",0,0,"8480000867551"],
    ["m_hacendado_yogur_natural_cabra","Yogur natural Cabra","Hacendado",77,4.1,4.2,4.9,0,[100,"ración","raciones"],"",0,0,"8480000202871"],
    ["m_hacendado_coctel_de_frutas_en_almi","Cóctel de frutas en almíbar","Hacendado",425,2.3,70,14,5.2,[100,"ración","raciones"],"",0,0,"8480000349248"],
    ["m_hacendado_lentejas_a_la_jardinera","Lentejas a la Jardinera","Hacendado",65,4.2,7.9,1.3,0,[100,"ración","raciones"],"",0,0,"8480000261168"],
    ["m_hacendado_postre_gelatina_fresa_0","Postre gelatina fresa 0%","Hacendado",1,0,0,0,0,[100,"ración","raciones"],"",0,0,"8480000681874"],
    ["m_hacendado_tsatsiki_a_base_de_yogur","Tsatsiki a base de yogur griego","Hacendado",196,3.7,3.1,18.4,1.4,[125,"unidad","unidades"],"",0,0,"8480000809803"],
    ["m_hacendado_garbanzos","Garbanzos","Hacendado",90,5.5,9.5,2.2,0,[100,"ración","raciones"],"",0,0,"8480000260390"],
    ["m_hacendado_pechuga_de_pavo","Pechuga de pavo","Hacendado",78,17.8,0.6,0.5,0,[100,"ración","raciones"],"",0,0,"8480000592071"],
    ["m_hacendado_yogur_bifidus_0_con_nuec","Yogur bifidus 0% con nueces","Hacendado",55,4,7.9,0.5,1.2,[100,"ración","raciones"],"",0,0,"8480000213297"],
    ["m_hacendado_pasas_moscatel","Pasas moscatel","Hacendado",321,2.9,73,1,4.2,[100,"ración","raciones"],"",0,0,"8480000230034"],
    ["m_hacendado_mantequilla_con_sal","Mantequilla con sal","Hacendado",734,0.5,0.8,81,0,[100,"ración","raciones"],"",0,0,"8480000207227"],
    ["m_hacendado_caldo_de_cocido","Caldo de cocido","Hacendado",6,0.5,1.5,0.5,0,[100,"ración","raciones"],"",0,0,"8480000073280"],
    ["m_hacendado_queso_mozzarella","Queso mozzarella","Hacendado",153,17,1,9,0,[100,"ración","raciones"],"",0,0,"8480000512307"],
    ["m_hacendado_pan_de_molde_multicereal","Pan de molde multicereal","Hacendado",260,11,40,5.8,6,[100,"ración","raciones"],"",0,0,"8480000823298"],
    ["m_hacendado_galletas_tostadas","Galletas tostadas","Hacendado",429,7,79,9,2.2,[100,"ración","raciones"],"",0,0,"8480000143242"],
    ["m_hacendado_yogur_bifidus_natural","Yogur bifidus natural","Hacendado",71,3.8,4.5,4.2,0,[100,"ración","raciones"],"",0,0,"8480000213075"],
    ["m_hacendado_galletas_cuquis","Galletas Cuquis","Hacendado",473,6.5,72,17,1.6,[100,"ración","raciones"],"",0,0,"8480000335814"],
    ["m_hacendado_yogur_sabor_fresa","Yogur sabor Fresa","Hacendado",35,4.3,4.4,0.1,0,[100,"ración","raciones"],"",0,0,"8480000211996"],
    ["m_hacendado_jamon_extra_sandwich","Jamón extra sandwich","Hacendado",101,18.6,0.9,2.5,0,[100,"ración","raciones"],"",0,0,"8480000592156"],
    ["m_hacendado_barritas_muesli_chocolat","Barritas muesli chocolate","Hacendado",435,5.8,66,15,4.7,[100,"ración","raciones"],"",0,0,"8480000093493"],
    ["m_hacendado_chili_con_carne","Chili con carne","Hacendado",114,8.2,7.7,4.7,4,[100,"ración","raciones"],"",0,0,"8480000231376"],
    ["m_hacendado_cacahuetes_chocolate_neg","Cacahuetes Chocolate Negro","Hacendado",544,14,41,34,7.4,[100,"ración","raciones"],"",0,0,"8480000123480"],
    ["m_hacendado_te_limon_0","Té limón 0","Hacendado",1,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8480000278050"],
    ["m_hacendado_mermelada_de_melocoton_0","Mermelada De Melocotón 0% Azúcares Añadidos Extra","Hacendado",40,0.6,10.2,0,0,[100,"ración","raciones"],"",0,0,"8480000150943"],
    ["m_hacendado_mini_cookies_con_chocola","Mini cookies con chocolate","Hacendado",486,5.4,65,22,3,[100,"ración","raciones"],"",0,0,"8480000141613"],
    ["m_hacendado_yogur_limon_griego","Yogur limón griego","Hacendado",135,3.3,12.9,7.8,0,[125,"unidad","unidades"],"",0,0,"8480000226518"],
    ["m_hacendado_postre_fruta_variada","Postre fruta variada","Hacendado",62,0.7,14,0.2,0.8,[100,"ración","raciones"],"",0,0,"8480000221780"],
    ["m_hacendado_queso_de_cabra","Queso de Cabra","Hacendado",335,17,1.1,29.2,0,[100,"ración","raciones"],"",0,0,"8480000500212"],
    ["m_hacendado_queso_grana_padano_ralla","Queso Grana Padano Rallado","Hacendado",398,33,0,29,0,[100,"ración","raciones"],"",0,0,"8480000511461"],
    ["m_hacendado_cereales_minis_leche","Cereales minis leche","Hacendado",439,9.9,69,13,3.5,[100,"ración","raciones"],"",0,0,"8480000093332"],
    ["m_hacendado_proteinas_sabor_fresa","+Proteínas Sabor Fresa","Hacendado",51,7.1,4.8,0.4,0,[250,"vaso","vasos"],"",1,0,"8480000213334"],
    ["m_hacendado_postre_gelatina_0","Postre gelatina 0%","Hacendado",1,0,0.2,0,0,[100,"ración","raciones"],"",0,0,"8402001009143"],
    ["m_hacendado_cereales_fruta_y_fibra","Cereales fruta y fibra","Hacendado",389,8.8,65,8,11,[100,"ración","raciones"],"",0,0,"8480000796165"],
    ["m_hacendado_allioli","Allioli","Hacendado",746,1.1,1.3,82,0.1,[100,"ración","raciones"],"",0,0,"8480000171726"],
    ["m_hacendado_pechuga_pavo","Pechuga Pavo","Hacendado",78,17.8,0.6,0.5,0,[100,"ración","raciones"],"",0,0,"8480000602442"],
    ["m_hacendado_yogur_griego_fresa","Yogur griego fresa","Hacendado",139,3.3,13.8,7.8,0,[125,"unidad","unidades"],"",0,0,"8480000205049"],
    ["m_hacendado_aceite_de_oliva_virgen_e2","Aceite de Oliva Virgen Extra Spray","Hacendado",824,0,0,91,0,[10,"cucharada","cucharadas"],"",1,0,"8480000047182"],
    ["m_hacendado_magdalenas_valencianas","Magdalenas valencianas","Hacendado",445,5.7,54,22,1.9,[100,"ración","raciones"],"",0,0,"8480000820327"],
    ["m_hacendado_postre_soja_chocolate","Postre soja chocolate","Hacendado",109,3.4,18,2.1,2,[100,"ración","raciones"],"",0,0,"8402001007972"],
    ["m_hacendado_galletas_caocream","Galletas caocream","Hacendado",473,5,69,19,2.9,[100,"ración","raciones"],"",0,0,"8480000155979"],
    ["m_hacendado_choco_fundir_0_azucares_","Choco fundir 0% azúcares añadidos 70% cacao (en polvo)","Hacendado",525,8.7,35,42,9.7,[100,"ración","raciones"],"",0,0,"8480000125309"],
    ["m_hacendado_jamon_cocido_extra_finas","Jamón cocido extra finas lonchas","Hacendado",101,18.6,0.9,2.5,0,[100,"ración","raciones"],"",0,0,"8480000592484"],
    ["m_hacendado_cereales_crunchy_de_choc","Cereales crunchy de chocolate","Hacendado",450,6.3,73,14,3.5,[100,"ración","raciones"],"",0,0,"8480000230645"],
    ["m_hacendado_yogur_bifidus_0_kiwi","Yogur bifidus 0% Kiwi","Hacendado",47,3.8,7.7,0.1,0.3,[100,"ración","raciones"],"",0,0,"8480000213181"],
    ["m_hacendado_coctel_de_frutos_secos_a","Cóctel de frutos secos ahumado","Hacendado",598,22.8,16,47.2,8.5,[100,"ración","raciones"],"",0,0,"8480000600097"],
    ["m_hacendado_galletas_jengibre","Galletas jengibre","Hacendado",420,4.5,67,15,0,[100,"ración","raciones"],"",0,0,"7317066203805"],
    ["m_hacendado_crema_de_vinagre_balsami","Crema de vinagre balsámico de Módena","Hacendado",178,1.1,41,0,0,[100,"ración","raciones"],"",0,0,"8480000049087"],
    ["m_hacendado_galletas_choco_negro","Galletas choco Negro","Hacendado",496,6,64,23,4.3,[100,"ración","raciones"],"",0,0,"8480000146397"],
    ["m_hacendado_patatas_fritas_nachos_te","Patatas fritas nachos Tex-Mex","Hacendado",514,5.4,57,28,5.4,[100,"ración","raciones"],"",0,0,"8480000336415"],
    ["m_hacendado_pasta_ravioli_requeson_y","Pasta ravioli requesón y espinacas","Hacendado",275,8.9,34,11,0,[100,"ración","raciones"],"",0,0,"8480000061430"],
    ["m_hacendado_cereales_peanuts_balls","Cereales peanuts balls","Hacendado",438,11,69,12,5,[100,"ración","raciones"],"",0,0,"8480000608758"],
    ["m_hacendado_bebida_de_arandanos_y_fr","Bebida de arándanos y frutas rojas","Hacendado",19,0.2,3.5,0,1,[250,"vaso","vasos"],"",1,0,"8480000396273"],
    ["m_hacendado_patatas_fritas_estilo_tr","Patatas fritas estilo tradicional","Hacendado",537,7,50,33,3,[100,"ración","raciones"],"",0,0,"8480000333650"],
    ["m_hacendado_almendras","Almendras","Hacendado",582,25.3,11,45.8,9.1,[100,"ración","raciones"],"",0,0,"8480000340092"],
    ["m_hacendado_yogur_al_estilo_griego_n","Yogur al estilo griego natural azucarado","Hacendado",141,3.8,11.1,9,0,[125,"unidad","unidades"],"",0,0,"8480000205582"],
    ["m_hacendado_mortadela_con_aceitunas","Mortadela con aceitunas","Hacendado",244,10.5,5.6,20,0,[100,"ración","raciones"],"",0,0,"8480000593351"],
    ["m_hacendado_confitura_de_fresa_0_azu","Confitura de fresa 0% azúcares añadidos","Hacendado",38,0.6,10.4,0,1.6,[100,"ración","raciones"],"",0,0,"8480000150936"],
    ["m_hacendado_flan_de_huevo_sin_azucar","Flan de huevo sin azucares","Hacendado",68,6.3,8.2,1.5,1.8,[125,"unidad","unidades"],"",0,0,"8480000682659"],
    ["m_hacendado_yogur_desnatado_para_beb","Yogur Desnatado para Beber Sabor Tropical","Hacendado",51,7.1,4.7,0.4,0,[125,"unidad","unidades"],"",0,0,"8480000213785"],
    ["m_hacendado_yogur_leche_fermentada_p","Yogur leche Fermentada Para Beber Con Piña Y Coco","Hacendado",76,2.3,12.3,1.9,0,[100,"ración","raciones"],"",0,0,"8480000206299"],
    ["m_hacendado_ensaladilla_rusa","Ensaladilla rusa","Hacendado",211,5.5,8.3,17,0,[100,"ración","raciones"],"",0,0,"8480000807953"],
    ["m_hacendado_azucar_blanco","Azúcar Blanco","Hacendado",400,0,100,0,0,[100,"ración","raciones"],"",0,0,"8480000198976"],
    ["m_hacendado_garbanzos_a_la_jardinera","Garbanzos a la jardinera","Hacendado",76,3.8,9,2.1,0,[100,"ración","raciones"],"",0,0,"8480000261106"],
    ["m_hacendado_choco_fundir_negro","Choco fundir negro","Hacendado",529,5.8,48,33,8.5,[100,"ración","raciones"],"",0,0,"8480000125316"],
    ["m_hacendado_choco_buns","Choco Buns","Hacendado",353,8.6,42,16,1.4,[100,"ración","raciones"],"",0,0,"8480000826091"],
    ["m_hacendado_galletas_maria","Galletas maría","Hacendado",426,7,78,9,2.5,[100,"ración","raciones"],"",0,0,"8480000141880"],
    ["m_hacendado_pasta_lasagna_espinacas_","Pasta lasagna espinacas y requesón","Hacendado",165,5.9,12,10,1.5,[100,"ración","raciones"],"",0,0,"8480000044914"],
    ["m_hacendado_chocolate_negro_72_cacao","Chocolate negro 72% cacao con almendras enteras (en polvo)","Hacendado",590,11,27,47,10,[100,"ración","raciones"],"",0,0,"8480000124807"],
    ["m_hacendado_bebida_de_soja_con_choco","Bebida de soja con chocolate","Hacendado",55,3.6,5.5,1.9,0.9,[250,"vaso","vasos"],"",1,0,"8480000293183"],
    ["m_hacendado_almendra_tostada_0_sal_a","Almendra Tostada 0% Sal Añadida","Hacendado",628,23.3,3,57,10.8,[100,"ración","raciones"],"",0,0,"8480000340146"],
    ["m_hacendado_mostaza_dijon","Mostaza dijon","Hacendado",149,7.2,1.8,11,0,[100,"ración","raciones"],"",0,0,"8480000172280"],
    ["m_hacendado_aceitunas_negras_sin_hue","Aceitunas negras sin hueso","Hacendado",125,0.5,0,13,0,[100,"ración","raciones"],"",0,0,"8480000332493"],
    ["m_hacendado_yogur_bifidus_con_mango","Yogur bifidus con mango","Hacendado",85,3.5,11.8,2.6,0,[100,"ración","raciones"],"",0,0,"8480000213112"],
    ["m_hacendado_patatas_fritas_corte_ond","Patatas fritas corte ondulado","Hacendado",550,5.7,53,34,4.6,[100,"ración","raciones"],"",0,0,"8480000333636"],
    ["m_hacendado_yogur_con_melocoton_y_ma","Yogur con melocotón y maracuyá","Hacendado",96,3.6,13.1,3.2,0,[125,"unidad","unidades"],"",0,0,"8480000203793"],
    ["m_hacendado_patatas_fritas_campestre","Patatas fritas campestre","Hacendado",538,6.8,51,33,5.1,[100,"ración","raciones"],"",0,0,"8480000155900"],
    ["m_hacendado_mantequilla_sin_lactosa","Mantequilla sin lactosa","Hacendado",743,0.5,0.8,82,0,[100,"ración","raciones"],"",0,0,"8480000209917"],
    ["m_hacendado_pasta_penne_rigate_integ","Pasta penne Rigate Integral","Hacendado",345,13.5,62,2.4,10,[100,"ración","raciones"],"",0,0,"8402001010194"],
    ["m_hacendado_tortitas_de_maiz_54_choc","Tortitas de maiz 54% chocolate negro","Hacendado",476,6,64,21,3.5,[100,"ración","raciones"],"",0,0,"8480000140159"],
    ["m_hacendado_yogur_natural_con_azucar2","Yogur natural con azúcar Caña","Hacendado",150,3.7,11.3,10,0,[100,"ración","raciones"],"",0,0,"8480000206824"],
    ["m_hacendado_lenteja_pardina","Lenteja Pardina","Hacendado",320,24.5,48.1,1.2,9.6,[100,"ración","raciones"],"",0,0,"8480000053305"],
    ["m_hacendado_smoothie_fresa","Smoothie fresa","Hacendado",46,0.6,10.5,0.1,0.8,[250,"vaso","vasos"],"",1,0,"8480000399809"],
    ["m_hacendado_champinones_laminados","Champiñones Laminados","Hacendado",21,2.8,1.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000166180"],
    ["m_hacendado_salchichas_salchichon_co","Salchichas salchichón Costa Brava","Hacendado",372,22,3.6,30,0,[100,"ración","raciones"],"",0,0,"8480000590855"],
    ["m_hacendado_nectar_mango","Néctar mango","Hacendado",17,0.2,4.1,0,0,[250,"vaso","vasos"],"",1,0,"8480000391322"],
    ["m_hacendado_postre_natillas_galleta","Postre natillas galleta","Hacendado",152,3.8,24.9,4,0.2,[125,"unidad","unidades"],"",0,0,"8480000682666"],
    ["m_hacendado_crema_verduras","Crema verduras","Hacendado",30,0.8,4.5,0.8,1,[100,"ración","raciones"],"",0,0,"8480000087225"],
    ["m_hacendado_leche_fresca_semidesnata","Leche fresca semidesnatada","Hacendado",44,3.1,4.6,1.5,0,[250,"vaso","vasos"],"",1,0,"8480000109224"],
    ["m_hacendado_zumo_de_pina","Zumo de Piña","Hacendado",27,0.3,6.3,0,0,[250,"vaso","vasos"],"",1,0,"8480000391063"],
    ["m_hacendado_patatas_gajo_rusticas","Patatas gajo rústicas","Hacendado",150,2.5,20,6.1,2.3,[100,"ración","raciones"],"",0,0,"8480000614162"],
    ["m_hacendado_postre_mousse_vainilla","Postre mousse vainilla","Hacendado",76,10,5,1.8,0,[100,"ración","raciones"],"",0,0,"8480000158031"],
    ["m_hacendado_salchichas_chorizo_extra","Salchichas chorizo extra","Hacendado",356,21,2.7,29,0,[100,"ración","raciones"],"",0,0,"8480000590862"],
    ["m_hacendado_platano_fresa_arandanos_","Plátano, fresa, arándanos y avena puré","Hacendado",75,1,16,0.5,1.1,[100,"ración","raciones"],"",0,0,"8480000221827"],
    ["m_hacendado_salsa_teriyaki","Salsa Teriyaki","Hacendado",188,4.5,41.8,0.1,0,[100,"ración","raciones"],"",0,0,"8480000173621"],
    ["m_hacendado_salsa_cesar","Salsa César","Hacendado",342,2.3,13.5,31,0,[100,"ración","raciones"],"",0,0,"8480000173669"],
    ["m_hacendado_leche_enriquecida_con_ca","Leche enriquecida con calcio 100% natural","Hacendado",40,3.9,5.3,0.3,0,[250,"vaso","vasos"],"",1,0,"8480000108883"],
    ["m_hacendado_tortitas_de_arroz_con_ch2","Tortitas de arroz con chocolate","Hacendado",475,6.8,65,20,4.8,[100,"ración","raciones"],"",0,0,"8480000140791"],
    ["m_hacendado_pan_bagel","Pan bagel","Hacendado",286,11,53,2.7,4,[100,"ración","raciones"],"",0,0,"8480000238436"],
    ["m_hacendado_galletas_diverkao","Galletas diverkao","Hacendado",455,6.1,67,17,6.4,[100,"ración","raciones"],"",0,0,"8480000136008"],
    ["m_hacendado_postre_natillas_sabor_va","Postre natillas sabor vainilla","Hacendado",127,3.8,18.1,4.4,0,[125,"unidad","unidades"],"",0,0,"8480000681379"],
    ["m_hacendado_galletas_crackers_sin_gl","Galletas crackers sin gluten con romero","Hacendado",443,2.5,78,13,0,[100,"ración","raciones"],"",0,0,"8008910231271"],
    ["m_hacendado_spaghetti_calidad_superi","Spaghetti calidad superior","Hacendado",361,13,72,1.5,3.5,[100,"ración","raciones"],"",0,1,"8480000062451"],
    ["m_hacendado_galletas_magdalenas","Galletas magdalenas","Hacendado",415,5,51,21,1.2,[100,"ración","raciones"],"",0,0,"8480000608451"],
    ["m_hacendado_nectar_de_maracuya","Néctar de maracuyá","Hacendado",63,0.5,14.4,0.1,0.4,[250,"vaso","vasos"],"",1,0,"8480000396433"],
    ["m_hacendado_12_mini_tortillas_trigo","12 Mini Tortillas Trigo","Hacendado",303,8,51,6.4,4.4,[100,"ración","raciones"],"",0,0,"8480000809391"],
    ["m_hacendado_pipa_de_girasol_natural","Pipa de girasol natural","Hacendado",602,25.8,3.8,50.9,12.5,[100,"ración","raciones"],"",0,0,"8480000341938"],
    ["m_hacendado_cuajada","Cuajada","Hacendado",90,4.9,6.3,5,0,[100,"ración","raciones"],"",0,0,"8480000683229"],
    ["m_hacendado_cereales_miel_nut","Cereales Miel Nut","Hacendado",409,8.5,81,5.1,2.3,[100,"ración","raciones"],"",0,0,"8480000235275"],
    ["m_hacendado_mermelada_de_arandanos","Mermelada de arándanos","Hacendado",206,0.5,49,0.5,0,[100,"ración","raciones"],"",0,0,"8480000151322"],
    ["m_hacendado_bebida_arroz","Bebida arroz","Hacendado",38,0.4,6.4,1.2,0,[100,"ración","raciones"],"",0,0,"8480000230478"],
    ["m_hacendado_mortadela_lonchas_rosada","Mortadela-lonchas Rosada","Hacendado",244,13.2,7.3,18,0,[100,"ración","raciones"],"",0,0,"8480000593344"],
    ["m_hacendado_salteado_de_pollo","Salteado de pollo","Hacendado",45,3.8,4,1.3,0.7,[100,"ración","raciones"],"",0,0,"8480000134042"],
    ["m_hacendado_pipas_mondadas_fritas_sa","Pipas Mondadas Fritas Sal","Hacendado",665,22,3.6,61,8.1,[100,"ración","raciones"],"",0,0,"8480000341457"],
    ["m_hacendado_te_verde","Té verde","Hacendado",19,0.1,4.8,0,0,[250,"vaso","vasos"],"",1,0,"8480000278326"],
    ["m_hacendado_jamon_cocido_finas_lonch","Jamón cocido finas lonchas bajo en sal","Hacendado",99,18.4,2,1.9,0,[100,"ración","raciones"],"",0,0,"8480000592125"],
    ["m_hacendado_maiz_para_palomitas","Maíz para palomitas","Hacendado",341,9.6,60,4.5,11,[100,"ración","raciones"],"",0,0,"8480000348043"],
    ["m_hacendado_arandanos_deshidratados","Arándanos deshidratados","Hacendado",342,1,79,1.4,6.6,[100,"ración","raciones"],"",0,0,"8480000346056"],
    ["m_hacendado_arroz_largo","Arroz largo","Hacendado",347,6.5,78,0.8,0,[100,"ración","raciones"],"",0,1,"8480000050632"],
    ["m_hacendado_nata_montada","Nata montada","Hacendado",311,1.9,15,27,0,[100,"ración","raciones"],"",0,0,"8480000135988"],
    ["m_hacendado_zumo_de_tomate","Zumo de tomate","Hacendado",18,0.4,3.3,0,0.4,[250,"vaso","vasos"],"",1,0,"8480000393944"],
    ["m_hacendado_bebida_de_trigo_espelta_","Bebida de trigo espelta sin azúcares añadidos","Hacendado",60,0.5,11,1.4,0.5,[250,"vaso","vasos"],"",1,0,"8480000239211"],
    ["m_hacendado_choco_rice","Choco rice","Hacendado",382,6.8,83,1.7,2.9,[100,"ración","raciones"],"",0,0,"8480000095923"],
    ["m_hacendado_flan_de_vainilla","Flan de vainilla","Hacendado",95,2.4,17.7,1.6,0,[125,"unidad","unidades"],"",0,0,"8480000681065"],
    ["m_hacendado_bebida_de_coco_arroz","Bebida de Coco & Arroz","Hacendado",50,0.1,9,1.6,0.1,[250,"vaso","vasos"],"",1,0,"8480000138460"],
    ["m_hacendado_mermelada_de_naranja_ama","Mermelada de naranja amarga","Hacendado",234,0.5,58,0,0,[100,"ración","raciones"],"",0,0,"8480000150769"],
    ["m_hacendado_pan_hogaza_sin_gluten","Pan hogaza sin gluten","Hacendado",266,3.7,50,4.4,0,[100,"ración","raciones"],"",0,0,"8480000827357"],
    ["m_hacendado_crema_de_verduras","Crema de Verduras","Hacendado",46,0.6,4.7,2.6,1,[100,"ración","raciones"],"",0,0,"8480000603081"],
    ["m_hacendado_cacahuete_frito_con_miel","Cacahuete frito con miel","Hacendado",564,21,30,39,6.5,[100,"ración","raciones"],"",0,0,"8480000341433"],
    ["m_hacendado_fresa_morango","Fresa Morango","Hacendado",210,0.5,52,0,0,[100,"ración","raciones"],"",0,0,"8480000150912"],
    ["m_hacendado_yogur_bebida_lactea_sabo","Yogur bebida láctea sabores L-casei 6","Hacendado",65,2.4,10.4,1.5,0,[100,"ración","raciones"],"",0,0,"8480000206404"],
    ["m_hacendado_pan_mantequilla_brioche","Pan mantequilla brioche","Hacendado",323,7.9,52.9,9.3,1.7,[100,"ración","raciones"],"",0,0,"8480000228994"],
    ["m_hacendado_filetes_de_merluza_reboz","Filetes de merluza (rebozado)","Hacendado",189,11,13.8,10.1,0,[100,"ración","raciones"],"",0,0,"8480000631015"],
    ["m_hacendado_choco_gotas_negro","Choco Gotas Negro","Hacendado",501,6,59,25,7.6,[100,"ración","raciones"],"",0,0,"8480000125446"],
    ["m_hacendado_yogur_cuidacol_natural","Yogur cuidacol natural","Hacendado",47,3.3,5.2,1.4,0,[100,"ración","raciones"],"",0,0,"8480000220011"],
    ["m_hacendado_zumo_de_pina_seleccion","Zumo de piña Selección","Hacendado",43,0.4,10.2,0.1,0.2,[250,"vaso","vasos"],"",1,0,"8480000399465"],
    ["m_hacendado_lentejas_a_la_rioja","Lentejas a la rioja","Hacendado",132,5.1,8,8.4,0,[100,"ración","raciones"],"",0,0,"8480000261014"],
    ["m_hacendado_miel_de_romero","Miel de romero","Hacendado",333,0.4,82.8,0.1,0,[100,"ración","raciones"],"",0,0,"8480000154491"],
    ["m_hacendado_mortadela_de_pavo_finas_","Mortadela de pavo finas lonchas","Hacendado",173,10.9,7.5,11,0,[100,"ración","raciones"],"",0,0,"8480000593368"],
    ["m_hacendado_relleno_fajitas","Relleno fajitas","Hacendado",74,8.9,7,0.8,1.4,[100,"ración","raciones"],"",0,0,"8480000868206"],
    ["m_hacendado_boquerones_al_vinagre_en","Boquerones al vinagre en aceite de girasol","Hacendado",203,19.4,0.8,13.6,0,[10,"cucharada","cucharadas"],"",0,0,"8480000804051"],
    ["m_hacendado_patatas_fritas_sabor_ser","Patatas fritas sabor serrano","Hacendado",541,6.5,49,35,4.9,[100,"ración","raciones"],"",0,0,"8480000333353"],
    ["m_hacendado_pasta_gnocchi_quesos","Pasta gnocchi quesos","Hacendado",144,4.1,23,3.8,0,[100,"ración","raciones"],"",0,0,"8480000868404"],
    ["m_hacendado_mermelada_de_melocoton","Mermelada de melocotón","Hacendado",210,0.5,52,0,0,[100,"ración","raciones"],"",0,0,"8480000150929"],
    ["m_hacendado_patatas_fritas_cocktail_","Patatas fritas cocktail rodeo","Hacendado",490,9,55,24.9,4.7,[100,"ración","raciones"],"",0,0,"8480000342171"],
    ["m_hacendado_queso_especial_fundir","Queso especial fundir","Hacendado",284,19,7,20,0,[100,"ración","raciones"],"",0,0,"8480000236210"],
    ["m_hacendado_mousse_de_queso","Mousse de queso","Hacendado",208,3.8,5.5,19,0,[100,"ración","raciones"],"",0,0,"8480000511676"],
    ["m_hacendado_yogur_sabor_platano","Yogur sabor plátano","Hacendado",82,3.6,11.4,2,0,[100,"ración","raciones"],"",0,0,"8480000211989"],
    ["m_hacendado_galletas_barquillos_de_n","Galletas barquillos de nata","Hacendado",434,3,64,23,0,[100,"ración","raciones"],"",0,0,"8480000141361"],
    ["m_hacendado_leche_omega_3","Leche omega 3","Hacendado",52,3.1,4.8,2.1,0,[250,"vaso","vasos"],"",1,0,"8480000108463"],
    ["m_hacendado_salchichas_chorizo_dulce","Salchichas chorizo dulce","Hacendado",443,25,0.2,38,0,[100,"ración","raciones"],"",0,0,"8480000542090"],
    ["m_hacendado_remolacha_en_tiras_agrid","Remolacha en tiras agridulce","Hacendado",35,1.8,6.4,0.5,0,[100,"ración","raciones"],"",0,0,"8480000167545"],
    ["m_hacendado_salsa_burger","Salsa burger","Hacendado",340,1.5,11.5,31.6,0,[100,"ración","raciones"],"",0,0,"8480000173478"],
    ["m_hacendado_galletas_belgas","Galletas belgas","Hacendado",482,6,71,19,1.5,[100,"ración","raciones"],"",0,0,"8480000145819"],
    ["m_hacendado_queso_ricotta","Queso ricotta","Hacendado",179,9.7,3.8,14,0,[100,"ración","raciones"],"",0,0,"8480000512284"],
    ["m_hacendado_galletas_tarta_de_queso","Galletas tarta de queso","Hacendado",266,5.1,18.6,19,0,[100,"ración","raciones"],"",0,0,"8480000213662"],
    ["m_hacendado_yogur_cremoso_natural_ed","Yogur cremoso natural edulcorado","Hacendado",42,4.9,5.6,0,1.9,[100,"ración","raciones"],"",0,0,"8480000208309"],
    ["m_hacendado_crema_de_tofu","Crema de Tofu","Hacendado",169,5.4,2,15.2,1.4,[100,"ración","raciones"],"",0,0,"8480000707215"],
    ["m_hacendado_crema_de_pollo","Crema de Pollo","Hacendado",47,1,4,2.6,1.6,[100,"ración","raciones"],"",0,0,"8480000084484"],
    ["m_hacendado_pan_pipa_tostada_gigante","Pan pipa Tostada Gigante","Hacendado",636,28.7,5.5,53.7,8,[100,"ración","raciones"],"",0,0,"8480000230591"],
    ["m_hacendado_pan_4_piadinas","Pan 4 piadinas","Hacendado",315,7,53,8.5,1.7,[100,"ración","raciones"],"",0,0,"8480000808943"],
    ["m_hacendado_capuchino_caramel_en_pol","Capuchino caramel (en polvo)","Hacendado",416,7.4,76,8.5,2.4,[15,"cucharada","cucharadas"],"",0,0,"8480000676603"],
    ["m_hacendado_black_chocolate_72_with_","Black chocolate 72% with almonds","Hacendado",578,14,25,44,13,[100,"ración","raciones"],"",0,0,"8480000290625"],
    ["m_hacendado_filetes_de_caballa_del_s","Filetes de Caballa del Sur en Aceite de Oliva","Hacendado",311,36.9,0.8,16.9,0,[10,"cucharada","cucharadas"],"",0,0,"8480000183118"],
    ["m_hacendado_filetes_de_anchoa_en_ace","Filetes de anchoa en aceite de oliva","Hacendado",192,25,0.3,10.1,0,[10,"cucharada","cucharadas"],"",0,0,"8480000184085"],
    ["m_hacendado_patatas_fritas_classicas","Patatas fritas classicas","Hacendado",520,6.4,54,30,4.4,[100,"ración","raciones"],"",0,0,"8402001001734"],
    ["m_hacendado_nata_montar_bater","Nata montar bater","Hacendado",335,2,3.1,35,0,[100,"ración","raciones"],"",0,0,"8480000102768"],
    ["m_hacendado_cola","Cola","Hacendado",42,0,10.4,0,0,[250,"vaso","vasos"],"",1,0,"8480000290724"],
    ["m_hacendado_guisantes_extra","Guisantes extra","Hacendado",59,4,10,0.2,0,[100,"ración","raciones"],"",0,0,"8480000164162"],
    ["m_hacendado_picos_integrales","Picos integrales","Hacendado",400,13.8,65,6.7,11.5,[100,"ración","raciones"],"",0,0,"8480000226730"],
    ["m_hacendado_espresso_creme","Espresso Creme","Hacendado",285,23,34,0,28,[250,"vaso","vasos"],"",1,0,"8480000111234"],
    ["m_hacendado_capuccino_en_polvo","Capuccino (en polvo)","Hacendado",401,5.6,83,4.7,3.1,[15,"cucharada","cucharadas"],"",0,0,"8480000234063"],
    ["m_hacendado_yogur_bifidus","Yogur bifidus","Hacendado",134,4.7,20.9,3.2,1,[100,"ración","raciones"],"",0,0,"8480000208590"],
    ["m_kaiku_bebida_vegetal_de_almend","Bebida vegetal de Almendra","Kaiku",24,0.8,0.2,2.2,0,[250,"vaso","vasos"],"",1,0,"8432425018506"],
    ["m_kaiku_leche_semidesnatada_sin_","Leche semidesnatada sin lactosa","Kaiku",46,3.1,4.9,1.6,0,[250,"vaso","vasos"],"",1,0,"8410981010103"],
    ["m_kaiku_kefir","Kefir","Kaiku",58,5,4.3,2,0,[250,"vaso","vasos"],"",1,0,"8432425094074"],
    ["m_kaiku_kefir_plus","Kéfir plus","Kaiku",74,4.1,10,1.7,0,[250,"vaso","vasos"],"",1,0,"8432425094135"],
    ["m_kaiku_caffe_latte_cappuccino","Caffe latte cappuccino","Kaiku",61,2.9,9.5,1.2,0,[250,"vaso","vasos"],"",1,0,"8410981093199"],
    ["m_kaiku_bebida_begetal_avena","Bebida begetal avena","Kaiku",56,1.1,7.1,2.5,0.5,[100,"ración","raciones"],"",0,0,"8432425018520"],
    ["m_kaiku_caffe_latte_light","Caffé Latte Light","Kaiku",34,2.9,4.3,0.6,0,[250,"vaso","vasos"],"",1,0,"8410981096954"],
    ["m_kaiku_yogur_begetal","Yogur begetal","Kaiku",69,0.5,4.9,5.1,0,[100,"ración","raciones"],"",0,0,"8432425046462"],
    ["m_kaiku_protein_98_whey_sabor_ch","Protein 98% Whey Sabor Choco Avellana","Kaiku",64,9.3,4.5,0.9,0,[100,"ración","raciones"],"",0,0,"8432425094449"],
    ["m_kaiku_caffe_latte_expreso","Caffe latte expreso","Kaiku",58,2.9,8.5,1.2,0.1,[250,"vaso","vasos"],"",1,0,"8410981093205"],
    ["m_kaiku_caffe_latte","Caffe latte","Kaiku",61,2.9,9.2,1.2,0,[100,"ración","raciones"],"",0,0,"8432425094951"],
    ["m_kaiku_caffe_latte_sin_azucares","Caffè latte sin azúcares","Kaiku",49,3,4.5,2.1,0,[250,"vaso","vasos"],"",1,0,"8432425090854"],
    ["m_kaiku_yogur_begetal_de_coco_na","Yogur begetal de Coco natural sin azucares añadidos","Kaiku",69,0.5,4.9,5.1,0,[100,"ración","raciones"],"",0,0,"8432425049012"],
    ["m_kaiku_leche_de_produccion_sost","Leche de producción sostenible","Kaiku",44,3,4.6,1.5,0,[250,"vaso","vasos"],"",1,0,"8410981198764"],
    ["m_kaiku_yogur_bifidus_con_trocit","Yogur bifidus con trocitos de frutas del bosque","Kaiku",85,3.7,13,2,0,[100,"ración","raciones"],"",0,0,"8410981992164"],
    ["m_kaiku_postre_begetal","Postre begetal","Kaiku",72,1.4,8.6,3.3,0,[100,"ración","raciones"],"",0,0,"8432425040071"],
    ["m_kaiku_caffe_latte_mr_big_cappu","Caffé latte mr. big cappuccino café arábica con","Kaiku",61,2.9,9.5,1.2,0.1,[250,"vaso","vasos"],"",1,0,"8432425091202"],
    ["m_kaiku_leche_de_almendra_uht","Leche de almendra UHT","Kaiku",25,0.7,0.5,2.2,0,[100,"ración","raciones"],"",0,0,"8432425118503"],
    ["m_milbona_postre_high_protein_choc","Postre high Protein Chocolate Pudding","Milbona",76,10,5.2,1.5,0,[100,"ración","raciones"],"",0,0,"4056489216162"],
    ["m_milbona_yogur_griego_natural_lig","Yogur Griego Natural Light","Milbona",59,6,4,2,0,[125,"unidad","unidades"],"",0,0,"20416690"],
    ["m_milbona_queso_mozzarella","Queso mozzarella","Milbona",245,18,1.5,18.5,0,[100,"ración","raciones"],"",0,0,"20002268"],
    ["m_milbona_queso_grana_padano_dop_r","Queso grana Padano DOP rallado","Milbona",398,33,0,29,0,[100,"ración","raciones"],"",0,0,"4056489192923"],
    ["m_milbona_queso_original","Queso original","Milbona",238,5.5,3,22.5,0.5,[100,"ración","raciones"],"",0,0,"20103286"],
    ["m_milbona_natural_yogur","Natural Yogur","Milbona",75,5,4.7,3.8,0,[125,"unidad","unidades"],"",0,0,"20144302"],
    ["m_milbona_queso_light","Queso light","Milbona",141,6.9,3,11,0,[100,"ración","raciones"],"",0,0,"20103354"],
    ["m_milbona_queso_feta","Queso feta","Milbona",287,16.2,0.2,24.6,0,[100,"ración","raciones"],"",0,0,"4056489127253"],
    ["m_milbona_bebida_de_avena","Bebida de avena","Milbona",47,1.4,8.3,0.8,0.2,[250,"vaso","vasos"],"",1,0,"20879082"],
    ["m_milbona_queso_fresco_original","Queso Fresco Original","Milbona",238,5.5,3,22.5,0,[100,"ración","raciones"],"",0,0,"4056489532866"],
    ["m_milbona_queso_fresco_batido_quar","Queso fresco batido Quark","Milbona",52,8.5,4.6,0.5,0,[100,"ración","raciones"],"",0,0,"20337223"],
    ["m_milbona_queso_mascarpone","Queso mascarpone","Milbona",401,5.5,2.5,41,2.5,[100,"ración","raciones"],"",0,0,"4056489098591"],
    ["m_milbona_bebida_de_almendras","Bebida de almendras","Milbona",15,0.5,0.2,1.4,0,[250,"vaso","vasos"],"",1,0,"4056489140450"],
    ["m_milbona_queso_ricotta","Queso ricotta","Milbona",150,7,3,12,0,[100,"ración","raciones"],"",0,0,"4056489099062"],
    ["m_milbona_requeson_tipo_cottage_li","Requesón tipo cottage light","Milbona",70,12.5,3.1,0.8,0,[100,"ración","raciones"],"",0,0,"20131968"],
    ["m_milbona_skyr_natural","Skyr Natural","Milbona",62,11,4,0.2,0,[125,"unidad","unidades"],"",0,0,"20692230"],
    ["m_milbona_leche_semidesnatada","Leche Semidesnatada","Milbona",45,3.2,4.7,1.5,0,[250,"vaso","vasos"],"",1,0,"20044794"],
    ["m_milbona_yogur_bifidus_cremoso_na","Yogur bifidus Cremoso Natural","Milbona",76,4.8,5.6,3.5,0,[100,"ración","raciones"],"",0,0,"20002084"],
    ["m_pascual_leche_entera","Leche entera","Pascual",64,3.2,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410128010096"],
    ["m_pascual_bifrutas_tropical","Bifrutas Tropical","Pascual",21,0.3,4.8,0,0.5,[250,"vaso","vasos"],"",1,0,"8410128891169"],
    ["m_pascual_leche_pascual_semi","Leche pascual semi","Pascual",46,3,4.9,1.6,0,[250,"vaso","vasos"],"",1,0,"8410128010119"],
    ["m_pascual_bebida_vivesoy_avena","Bebida vivesoy Avena","Pascual",50,1.2,9.1,0.7,1,[100,"ración","raciones"],"",0,0,"8410128169947"],
    ["m_pascual_leche_pascual_desnatada","Leche pascual desnatada","Pascual",35,3.1,5,0.3,0,[250,"vaso","vasos"],"",1,0,"8410128010225"],
    ["m_pascual_bebida_vivesoy_clasica","Bebida vivesoy Clásica","Pascual",38,3.1,1.9,1.8,0.8,[100,"ración","raciones"],"",0,0,"8410128785185"],
    ["m_pascual_bebida_vivesoy_ligera","Bebida vivesoy Ligera","Pascual",27,2.2,1.5,1.2,0.6,[100,"ración","raciones"],"",0,0,"8410128785208"],
    ["m_pascual_bebida_vivesoy_avena_sin","Bebida vivesoy Avena Sin Azúcar","Pascual",40,0.9,5.9,1.2,1.2,[100,"ración","raciones"],"",0,0,"8410128784201"],
    ["m_pascual_batido_de_cacao","Batido de cacao","Pascual",63,3.3,9.6,1,1,[250,"vaso","vasos"],"",1,0,"8410128670511"],
    ["m_pascual_bebida_vivesoy_soja_sin_","Bebida vivesoy Soja Sin Azúcar","Pascual",24,2.2,0.4,1.3,0.7,[100,"ración","raciones"],"",0,0,"8410128785161"],
    ["m_pascual_leche_semi_sin_lactosa","Leche semi sin lactosa","Pascual",47,3.3,4.9,1.6,0,[250,"vaso","vasos"],"",1,0,"8410128750008"],
    ["m_pascual_leche_mazada","Leche mazada","Pascual",35,3,4.5,0.5,3,[250,"vaso","vasos"],"",1,0,"8410128010959"],
    ["m_pascual_leche_desnatada_calcio_v","Leche desnatada calcio vitamina D","Pascual",41,3.9,5.6,0.3,0,[250,"vaso","vasos"],"",1,0,"8410128010195"],
    ["m_pascual_bifrutas_natural","Bifrutas natural","Pascual",28,0.7,5.6,0,0.3,[250,"vaso","vasos"],"",1,0,"8410128789541"],
    ["m_pascual_bebida_vivesoy_soja_choc","Bebida vivesoy Soja Chocolate","Pascual",53,3.2,5.3,1.8,1.2,[250,"vaso","vasos"],"",1,0,"8410128785321"],
    ["m_pascual_nata_montada_azucarada_s","Nata montada azucarada spray","Pascual",305,2.3,12,28,0,[100,"ración","raciones"],"",0,0,"8410128050269"],
    ["m_pascual_leche_desnatada_sin_lact","Leche desnatada sin lactosa","Pascual",34,3.4,4.8,0.1,0,[250,"vaso","vasos"],"",1,0,"8410128750046"],
    ["m_pascual_mantequilla_original_tar","Mantequilla original tarrina","Pascual",745,0.7,1.1,82,0,[100,"ración","raciones"],"",0,0,"8410128000578"]
];
BRAND_FOODS.forEach(([id, name, brand, kcal, p, c, f, fib, serv, em, ml, raw, off]) => {
    const role = p * 4 >= Math.max(c * 4, f * 9) ? 'protein' : f * 9 > c * 4 ? 'fat' : 'carb';
    FOODS.push({ id, name, brand, cat: 'marca', role, meals: 'BSLD', p, f, c, fib, kcal, min: 0, max: 0, flags: '', diaryOnly: 1, serv, em, ...(ml ? { ml: 1 } : {}), ...(raw ? { raw: 1 } : {}), off });
});
// </marcas>
