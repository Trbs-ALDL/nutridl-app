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
F('anacardos', 'Anacardos', 'grasa', 'fat', 'BS', 18, 44, 30, 3.3, 10, 45, 'N');
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

// <marcas> (lo genera tools/marcas/off_embed.js · datos: Open Food Facts, licencia ODbL · 2026-10-07)
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
    ["m_monster_monster_energy_ultra","Monster Energy Ultra","Monster",2,0,1.1,0,0,[500,"lata","latas"],"⚡",1,0,"5060896623863"]
];
BRAND_FOODS.forEach(([id, name, brand, kcal, p, c, f, fib, serv, em, ml, raw, off]) => {
    const role = p * 4 >= Math.max(c * 4, f * 9) ? 'protein' : f * 9 > c * 4 ? 'fat' : 'carb';
    FOODS.push({ id, name, brand, cat: 'marca', role, meals: 'BSLD', p, f, c, fib, kcal, min: 0, max: 0, flags: '', diaryOnly: 1, serv, em, ...(ml ? { ml: 1 } : {}), ...(raw ? { raw: 1 } : {}), off });
});
// </marcas>
