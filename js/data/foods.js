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
D('croissant', 'Cruasán', 'hc', 8.2, 21, 43.2, 2.6, [60, 'cruasán', 'cruasanes'], '🥐', 'VGL', { alias: 'croissant' });
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

// <cadenas> (lo genera tools/cadenas/embed.js · valores oficiales publicados por cada cadena en España · 2026-10-16)
const CHAIN_FOODS = [["k_mcdonald_s_big_mac","Big Mac®","McDonald's",232,12,19,12,1.4,3.9,[234,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_cuarto_de_libra","Cuarto de Libra","McDonald's",255,15,18,13,1.1,4.6,[215,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_cuarto_de_libra_doble","Cuarto de Libra Doble","McDonald's",259,18,13,15,0.9,3.6,[293,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mcroyal_deluxe","McRoyal Deluxe®","McDonald's",222,12,14,13,0.9,2.9,[246,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mcextreme_intense_cheddar","McExtreme™ Intense Cheddar","McDonald's",263,15,17,15,1,2,[238,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mcextreme_intense_cheddar_doble","McExtreme™ Intense Cheddar Doble","McDonald's",263,17,12,16,0.7,1.4,[331,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_big_arch","Big Arch","McDonald's",263,14,13,17,1.1,3.1,[409,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mcextreme_pulled_pork_buffalo","McExtreme™ Pulled Pork Buffalo","McDonald's",282,16,20,14,0.7,5.7,[311,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mcextreme_pulled_pork_buffalo_do","McExtreme™ Pulled Pork Buffalo Doble","McDonald's",278,18,15,16,0.5,4.2,[424,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mcextreme_bacon","McExtreme™ Bacon","McDonald's",298,16,18,18,1.2,3.5,[264,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_hamburguesa","Hamburguesa","McDonald's",242,12,29,8.2,1.8,6.1,[107,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_hamburguesa_con_queso_cheeseburg","Hamburguesa con queso (Cheeseburger)","McDonald's",254,13,26,10,1.6,5.8,[120,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_cheeseburger_doble","Cheeseburger Doble","McDonald's",262,16,19,14,1.1,4.3,[174,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_cheeseburger_triple","Cheeseburger Triple","McDonald's",269,17,15,16,0.9,3.6,[218,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mcpollo","McPollo®","McDonald's",229,10,23,10,1.4,3.1,[186,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_cbo","CBO®","McDonald's",259,9.9,22.9,13.6,2.2,3.1,[239,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_cbo_doble","CBO® Doble","McDonald's",240,12.4,19.4,12.1,1.9,1.8,[330,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mccrispy_bbq_bacon","McCrispy® BBQ & Bacon","McDonald's",268,11,26,13,1.4,5,[256,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mccrispy_bbq_bacon_doble","McCrispy® BBQ & Bacon Doble","McDonald's",256,12,22,12.9,1.3,3.8,[348,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mccrispy_original","McCrispy® Original","McDonald's",250,10,27,11,0.9,4.2,[292,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_mccrispy_original_doble","McCrispy® Original Doble","McDonald's",250,10,27,11,0.9,4.2,[409,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_hamburguesa_de_pollo_y_queso","Hamburguesa de pollo y queso","McDonald's",250,10,28,10,1.6,5.1,[142,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_chicken_burger_bbq","Chicken Burger BBQ","McDonald's",240,9,31,8.4,1.8,5.3,[127,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_chicken_burger_ninos","Chicken Burger (niños)","McDonald's",260,9.8,34,8.9,1.9,6.5,[119,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_chicken_mayo_doble","Chicken Mayo Doble","McDonald's",271,9.8,25,14,1.4,2.7,[186,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_chicken_mayo_triple","Chicken Mayo Triple","McDonald's",273,11,24,15,1.4,2.2,[237,"hamburguesa","hamburguesas"],0,"mcdonalds.es"],["k_mcdonald_s_filete_de_pescado","Filete de Pescado","McDonald's",243,13,22,11,1.2,3.1,[194,"sándwich","sándwiches"],0,"mcdonalds.es"],["k_mcdonald_s_mcfish","McFish","McDonald's",226,11,32,5.8,1.7,5.9,[124,"sándwich","sándwiches"],0,"mcdonalds.es"],["k_mcdonald_s_chicken_bites","Chicken Bites","McDonald's",230,16,16,11,0.5,0.8,[136,"ración","raciones"],0,"mcdonalds.es"],["k_mcdonald_s_patatas_fritas_medianas","Patatas fritas (medianas)","McDonald's",289,3.4,36,14,3.5,0.3,[114,"ración mediana","raciones medianas"],0,"mcdonalds.es"],["k_mcdonald_s_patatas_fritas_pequenas","Patatas fritas (pequeñas)","McDonald's",289,3.4,36,14,3.5,0.3,[80,"ración pequeña","raciones pequeñas"],0,"mcdonalds.es"],["k_mcdonald_s_patatas_deluxe","Patatas Deluxe","McDonald's",200,2.8,26,8.9,2.9,0.3,[161,"ración","raciones"],0,"mcdonalds.es"],["k_mcdonald_s_top_fries_bacon_cheese","Top Fries Bacon & Cheese","McDonald's",284,7.9,28,15,2.7,0.4,[301,"ración","raciones"],0,"mcdonalds.es"],["k_mcdonald_s_top_fries_bacon_cheese_deluxe","Top Fries Bacon & Cheese Deluxe","McDonald's",212,5.5,21,11,2.4,0.3,[467,"ración","raciones"],0,"mcdonalds.es"],["k_mcdonald_s_mcnuggets_de_pollo","McNuggets® de pollo","McDonald's",243,15,19,12,0.9,0.7,[18,"nugget","nuggets"],0,"mcdonalds.es"],["k_mcdonald_s_alitas_de_pollo","Alitas de pollo","McDonald's",236,23,3.7,14,0,1.2,[32,"alita","alitas"],0,"mcdonalds.es"],["k_mcdonald_s_estrellitas_de_queso","Estrellitas de queso","McDonald's",310,12,25,18,0,0.5,[138,"ración","raciones"],0,"mcdonalds.es"],["k_mcdonald_s_cono_de_helado","Cono de helado","McDonald's",171,4.1,30,3.6,0.3,22,[92,"cono","conos"],0,"mcdonalds.es"],["k_mcdonald_s_gazpacho","Gazpacho","McDonald's",40,0.9,3.5,2.2,1.2,3.3,[255,"vaso","vasos"],0,"mcdonalds.es"],["k_mcdonald_s_ensalada_huerta","Ensalada Huerta","McDonald's",20,0.9,2.5,0.3,2,2,[90,"ensalada","ensaladas"],0,"mcdonalds.es"],["k_mcdonald_s_ensalada_honey_mustard","Ensalada Honey Mustard","McDonald's",123,8.3,7,6.6,1.4,1.8,[265,"ensalada","ensaladas"],0,"mcdonalds.es"],["k_mcdonald_s_ensalada_cesar","Ensalada César","McDonald's",153,8.9,7.4,9.5,1.1,1.3,[245,"ensalada","ensaladas"],0,"mcdonalds.es"],["k_mcdonald_s_mcflurry_oreo","McFlurry® Oreo®","McDonald's",229,4,31,9.9,0.2,27,[200,"McFlurry","McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_mini_mcflurry_oreo","Mini McFlurry® Oreo®","McDonald's",190,3.8,30,6,0.5,23,[95,"Mini McFlurry","Mini McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_mcflurry_kitkat","McFlurry® KitKat®","McDonald's",199,3.3,34,5.3,0.2,26,[211,"McFlurry","McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_mini_mcflurry_kitkat","Mini McFlurry® KitKat®","McDonald's",183,3.8,28,6.3,0.3,24,[92,"Mini McFlurry","Mini McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_mcflurry_magnum_gold_caramel","McFlurry® Magnum Gold Caramel","McDonald's",195,3.3,35.4,4.5,0.1,25.8,[212,"McFlurry","McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_mini_mcflurry_magnum_gold_carame","Mini McFlurry® Magnum Gold Caramel","McDonald's",187,3.8,31.8,4.9,0.1,25.5,[97,"Mini McFlurry","Mini McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_mcflurry_filipinos_blanco","McFlurry® Filipinos Blanco","McDonald's",207,3.9,29,8.3,0.2,25,[186,"McFlurry","McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_mini_mcflurry_filipinos_blanco","Mini McFlurry® Filipinos Blanco","McDonald's",184,3.9,28,6.1,0.4,22,[92,"Mini McFlurry","Mini McFlurry"],0,"mcdonalds.es"],["k_mcdonald_s_sundae_de_chocolate","Sundae de chocolate","McDonald's",169,3.8,28,4.7,0.3,26,[166,"sundae","sundaes"],0,"mcdonalds.es"],["k_mcdonald_s_sundae_de_caramelo","Sundae de caramelo","McDonald's",172,3.2,31,3.9,0,25,[166,"sundae","sundaes"],0,"mcdonalds.es"],["k_mcdonald_s_sundae_de_chocolate_blanco","Sundae de chocolate blanco","McDonald's",199,3.8,27,8.3,0,26,[159,"sundae","sundaes"],0,"mcdonalds.es"],["k_mcdonald_s_mcdalena_de_chocolate","McDalena de chocolate","McDonald's",441,5.8,45,26,2.4,28,[130,"magdalena","magdalenas"],0,"mcdonalds.es"],["k_mcdonald_s_redondo_glaseado_donut","Redondo glaseado (dónut)","McDonald's",396,6.5,48,19,0,15,[50,"dónut","dónuts"],0,"mcdonalds.es"],["k_mcdonald_s_redondo_de_chocolate_donut","Redondo de chocolate (dónut)","McDonald's",443,5.5,44,26,0,15,[56,"dónut","dónuts"],0,"mcdonalds.es"],["k_mcdonald_s_croissant_de_mantequilla_mccafe","Croissant de mantequilla (McCafé)","McDonald's",371,7,43,19,0.5,6.6,[55,"croissant","croissants"],0,"mcdonalds.es"],["k_mcdonald_s_mcpops_nocilla","McPops® Nocilla","McDonald's",417,6.5,45,23,1.8,19,[25,"McPop","McPops"],0,"mcdonalds.es"],["k_mcdonald_s_mcpops_lotus_biscoff","McPops® Lotus Biscoff","McDonald's",501,6.3,50,30,1.5,22,[25,"McPop","McPops"],0,"mcdonalds.es"],["k_mcdonald_s_mcpops_chocolate_blanco","McPops® chocolate blanco","McDonald's",489,7,51,28,1.3,28,[25,"McPop","McPops"],0,"mcdonalds.es"],["k_mcdonald_s_cookie_de_chocolate","Cookie de chocolate","McDonald's",467,5.6,54,25,1.6,35,[72,"cookie","cookies"],0,"mcdonalds.es"],["k_mcdonald_s_cookie_de_chocolate_blanco_y_fra","Cookie de chocolate blanco y frambuesa","McDonald's",503,4.8,64,25,1.6,38,[76,"cookie","cookies"],0,"mcdonalds.es"],["k_mcdonald_s_tostada_con_tortilla","Tostada con tortilla","McDonald's",237,5.4,26,12,1.8,1.9,[234,"tostada","tostadas"],0,"mcdonalds.es"],["k_mcdonald_s_tostada_con_aceite_y_tomate","Tostada con aceite y tomate","McDonald's",283,5.3,32,14,3.3,2.1,[120,"tostada","tostadas"],0,"mcdonalds.es"],["k_mcdonald_s_pan_tostado_con_mantequilla_y_me","Pan tostado con mantequilla y mermelada","McDonald's",310,5.8,49,9.4,2.5,18,[95,"tostada","tostadas"],0,"mcdonalds.es"],["k_mcdonald_s_tostada_con_tomate_y_jamon","Tostada con tomate y jamón","McDonald's",270,7.8,26,14,2,3,[128,"tostada","tostadas"],0,"mcdonalds.es"],["k_mcdonald_s_capuchino_mccafe","Capuchino (McCafé)","McDonald's",43,3,3.1,2.4,0,3.1,[149,"taza","tazas"],1,"mcdonalds.es"],["k_mcdonald_s_cafe_con_leche_mccafe","Café con leche (McCafé)","McDonald's",32,1.5,2.3,1.8,0,2.3,[150,"taza","tazas"],1,"mcdonalds.es"],["k_mcdonald_s_chai_latte_mccafe","Chai latte (McCafé)","McDonald's",77,3.6,6.8,3.9,0,6.6,[175,"taza","tazas"],1,"mcdonalds.es"],["k_mcdonald_s_caramel_latte_mccafe","Caramel latte (McCafé)","McDonald's",78,1.8,12,2.3,0,10,[200,"taza","tazas"],1,"mcdonalds.es"],["k_mcdonald_s_tropicana_zumo_de_naranja","Tropicana zumo de naranja","McDonald's",40,0.8,8.9,0,0.6,8.9,[250,"botella","botellas"],1,"mcdonalds.es"],["k_mcdonald_s_tropicana_zumo_de_manzana","Tropicana zumo de manzana","McDonald's",45,0.1,11,0,0.5,11,[253,"botella","botellas"],1,"mcdonalds.es"],["k_mcdonald_s_coca_cola_vaso_mediano","Coca-Cola (vaso mediano)","McDonald's",41,0,11,0,0,11,[398,"vaso mediano","vasos medianos"],1,"mcdonalds.es"],["k_mcdonald_s_cerveza_sin_alcohol_mcdonald_s","Cerveza sin alcohol (McDonald's)","McDonald's",28,0.2,5.2,0,0.1,1.7,[300,"vaso","vasos"],1,"mcdonalds.es"],["k_burger_kin_bacon_chicken_cheeseburger","Bacon Chicken Cheeseburger","Burger King",301,10.8,25.2,16.9,2.4,4.3,[158,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_bacon_lover_crispy_chicken","Bacon Lover Crispy Chicken®","Burger King",276,12.4,21.3,15.1,2.3,5.4,[359,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_bacon_lover_doble_cheeseburger","Bacon Lover Doble Cheeseburger","Burger King",277,16.4,12.9,17.8,1.8,4.8,[390,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_burger_king_sandy_nutella","Burger King Sandy™ Nutella®","Burger King",175,3.1,25.9,6.5,0.3,24,[135,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_burger_vegetal","Burger Vegetal","Burger King",233,11.4,28.6,6.9,5,7.4,[101,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_cbk_doble","CBK Doble","Burger King",297,11.1,22.4,17.8,1.5,3,[331,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_cheeseburger_bacon","Cheeseburger Bacon","Burger King",258,14,23.5,11.3,2.5,6.4,[123,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_cheeseburger_vegetal","Cheeseburger Vegetal","Burger King",242,12.1,26.4,8.7,4.6,7.1,[112,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_cheesy_doritos","Cheesy Doritos","Burger King",262,14,19.4,14,1.8,4.9,[277,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_chef_crispy","Chef Crispy","Burger King",287,11.9,24.8,15.4,1.1,4.7,[305,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_chili_cheese_bites_9_uds","Chili Cheese Bites (9 uds.)","Burger King",285,9,27.9,15,1.5,1.2,[167,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_chocolate_oreo_shake","Chocolate Oreo® Shake","Burger King",178,2.8,27.6,6.2,0.4,23.2,[397,"ración","raciones"],1,"burgerking.es"],["k_burger_kin_chocolate_shake","Chocolate Shake","Burger King",152,2.6,26.5,3.9,0.2,24,[182,"ración","raciones"],1,"burgerking.es"],["k_burger_kin_doble_crispy_chicken","Doble Crispy Chicken®","Burger King",277,10.1,19.7,16.9,2,2.6,[273,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_don_simon_tropical","Don Simón Tropical","Burger King",43,0.6,10,0.1,0.1,10,[260,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_duo_bacon_cheddar_carne","Duo Bacon Cheddar Carne","Burger King",275,14.4,18.2,15.8,1.9,4.5,[259,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_fusion_nutella","Fusion™ Nutella®","Burger King",208,3.4,29.7,8.4,0.6,25.4,[100,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_gofre_con_nutella","Gofre con Nutella®","Burger King",471,6,54.7,25,1.9,34.5,[75,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_king_aros_de_cebolla_x5","King Aros de Cebolla x5","Burger King",241,3.9,30.2,11.6,0.5,4,[59,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_king_fusion_con_nutella","King Fusion™ con Nutella®","Burger King",217,3.5,30.9,8.8,0.6,25.5,[181,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_king_sandy_chocolate_blanco","King Sandy™ Chocolate Blanco","Burger King",187,2.8,26.5,7.8,0,24.7,[160,"ración","raciones"],1,"burgerking.es"],["k_burger_kin_king_shake_oreo","King Shake™ Oreo®","Burger King",159,2.9,25.9,4.8,0.3,21.5,[350,"ración","raciones"],1,"burgerking.es"],["k_burger_kin_magnum_double_chocolate","Magnum Double Chocolate","Burger King",323,4.7,29,20,2.2,27,[324,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_mini_king_sandy_chocolate_blanco","Mini King Sandy™ Chocolate Blanco","Burger King",206,2.8,28,9.2,0,26.3,[60,"ración","raciones"],1,"burgerking.es"],["k_burger_kin_nuggets_vegetales_x20","Nuggets Vegetales x20","Burger King",225,6.5,20.3,12.2,4.3,3.1,[410,"ración","raciones"],0,"burgerking.es"],["k_burger_kin_strawberry_shake","Strawberry Shake","Burger King",142,2.5,25.8,3.2,0,23.2,[352,"ración","raciones"],1,"burgerking.es"],["k_burger_kin_the_king_bacon_1c","The King Bacon 1C","Burger King",265,14,19.7,14.2,2.1,3.9,[251,"ración","raciones"],0,"burgerking.es"],["k_kfc_tiras_de_pechuga_original","Tiras de pechuga Original","KFC",209,25,8,9.4,0,0.1,[40,"tira","tiras"],0,"kfc.es (PDF oficial)"],["k_kfc_pieza_de_pollo_original","Pieza de pollo Original","KFC",241,20,9,14,0,1,[97,"pieza","piezas"],0,"kfc.es (PDF oficial)"],["k_kfc_pieza_de_pollo_crujiente","Pieza de pollo Crujiente","KFC",270,21.3,10.4,15.9,0,1,[113,"pieza","piezas"],0,"kfc.es (PDF oficial)"],["k_kfc_alitas_picantes","Alitas picantes","KFC",319,15.5,12.8,22.5,0,0.1,[28,"alita","alitas"],0,"kfc.es (PDF oficial)"],["k_kfc_tiras_glaseadas","Tiras glaseadas","KFC",267,13.3,25.3,9.6,0,0,[60,"tira","tiras"],0,"kfc.es (PDF oficial)"],["k_kfc_alitas_glaseadas","Alitas glaseadas","KFC",319,12.1,22.1,19.8,0,0,[53,"alita","alitas"],0,"kfc.es (PDF oficial)"],["k_kfc_popcorn_chicken","Popcorn Chicken","KFC",278,17.1,17.1,15.8,0,0.2,[7,"unidad","unidades"],0,"kfc.es (PDF oficial)"],["k_kfc_mini_hot_dog","Mini Hot Dog","KFC",223,18.1,19.8,8.5,0,1.5,[130,"unidad","unidades"],0,"kfc.es (PDF oficial)"],["k_kfc_sandwich_coronel_club","Sándwich Coronel Club","KFC",245,13.5,21.9,7.6,0,3.8,[282,"sándwich","sándwiches"],0,"kfc.es (PDF oficial)"],["k_kfc_burger_sobrada","Burger Sobrada","KFC",252,17.5,19.8,8.9,0,3,[220,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_burger_sobrada_doble","Burger Sobrada Doble","KFC",239,19.8,16.2,8.8,0,2.1,[312,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_burger_sobrada_bbq","Burger Sobrada BBQ","KFC",242,16.7,24.2,8.5,0,7.5,[220,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_burger_sobrada_bbq_doble","Burger Sobrada BBQ Doble","KFC",240,19.3,17.7,10.1,0,4.3,[325,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_double_krunch_original","Double Krunch Original","KFC",209,15.7,20.1,7.5,0,1.5,[160,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_double_krunch_bbq_cheese","Double Krunch BBQ Cheese","KFC",236,20.1,16.5,10.7,0,1.8,[357,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_basica_burger","Básica Burger","KFC",227,10.3,23.5,10,0,2.8,[142,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_basica_burger_doble","Básica Burger Doble","KFC",224,12.3,19.7,10.5,0,2,[198,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_basica_bbq","Básica BBQ","KFC",237,11.2,26.8,9.4,0,5.3,[137,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_basica_bbq_doble","Básica BBQ Doble","KFC",231,12.9,22,10.1,0,3.8,[193,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_burger_glaseada","Burger Glaseada","KFC",287,14.5,26.6,10.2,0,7.7,[260,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_burger_glaseada_doble","Burger Glaseada Doble","KFC",264,16.2,23.8,9.1,0,8.8,[377,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_coronel_burger_original_o_zinger","Coronel Burger (Original o Zinger)","KFC",214,13,18.6,9.4,0,3.4,[249,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_coronel_burger_doble_original_o_","Coronel Burger Doble (Original o Zinger)","KFC",213,16.3,15.7,9.2,0,2.5,[341,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_la_clasica","La Clásica","KFC",205,12.8,20.4,7.8,0,3.4,[231,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_bbq_cheese_burger","BBQ Cheese Burger","KFC",262,13.8,25.3,9.8,0,4,[200,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_kids_burger","Kids Burger","KFC",233,10.8,26.2,7.7,0,3.2,[110,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_kids_mayo_burger","Kids Mayo Burger","KFC",251,13.2,27.9,7.8,0,4.7,[107,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_kids_cheese_burger","Kids Cheese Burger","KFC",263,9.6,25.5,12.1,0,2.7,[115,"hamburguesa","hamburguesas"],0,"kfc.es (PDF oficial)"],["k_kfc_wrap_coronel","Wrap Coronel","KFC",211,11.6,18.2,10.3,0,1.6,[270,"wrap","wraps"],0,"kfc.es (PDF oficial)"],["k_kfc_wrap_sobrado","Wrap Sobrado","KFC",210,13.2,16.6,10.2,0,1.4,[286,"wrap","wraps"],0,"kfc.es (PDF oficial)"],["k_kfc_wrap_sobrada_bbq","Wrap Sobrada BBQ","KFC",271,17.2,23.2,12.4,0,1,[201,"wrap","wraps"],0,"kfc.es (PDF oficial)"],["k_kfc_wrap_clasico","Wrap Clásico","KFC",243,16.6,20,10.4,0,4.4,[308,"wrap","wraps"],0,"kfc.es (PDF oficial)"],["k_kfc_ensalada_original_kfc","Ensalada Original (KFC)","KFC",220,12.7,19.8,9.4,0,2.1,[241,"ensalada","ensaladas"],0,"kfc.es (PDF oficial)"],["k_kfc_ensalada_emmental_kfc","Ensalada Emmental (KFC)","KFC",263,11.4,20.2,15.3,0,1.7,[231,"ensalada","ensaladas"],0,"kfc.es (PDF oficial)"],["k_kfc_arroz_asiatico","Arroz Asiático","KFC",160,4.8,21.8,4.8,0,4.6,[270,"ración","raciones"],0,"kfc.es (PDF oficial)"],["k_kfc_arroz_ranchero","Arroz Ranchero","KFC",156,5,17,9.3,0,1.5,[295,"ración","raciones"],0,"kfc.es (PDF oficial)"],["k_kfc_doritos_loaded_bag_tex_mex","Doritos Loaded Bag Tex Mex","KFC",314,10.1,26.8,16.5,0,1.6,[310,"bolsa","bolsas"],0,"kfc.es (PDF oficial)"],["k_kfc_doritos_loaded_bag_picante","Doritos Loaded Bag Picante","KFC",293,10,26.9,14.1,0,1.9,[306,"bolsa","bolsas"],0,"kfc.es (PDF oficial)"],["k_kfc_doritos_loaded_bag_zinger","Doritos Loaded Bag Zinger","KFC",307,7.2,31,16.5,0,2.6,[226,"bolsa","bolsas"],0,"kfc.es (PDF oficial)"],["k_kfc_pollipapas","Pollipapas","KFC",231,10.1,21.9,11.2,0,2.2,[205,"ración","raciones"],0,"kfc.es (PDF oficial)"],["k_kfc_emmental_bites","Emmental Bites","KFC",350,12,32,18,0,2.4,[20,"unidad","unidades"],0,"kfc.es (PDF oficial)"],["k_kfc_patatas_fritas_kfc","Patatas fritas KFC","KFC",219,3.4,29.9,8.9,0,0,[92,"ración pequeña","raciones pequeñas"],0,"kfc.es (PDF oficial)"],["k_kfc_kentucky_fries_cheese","Kentucky Fries Cheese","KFC",271,9.8,27.1,14.6,0,0,[230,"ración","raciones"],0,"kfc.es (PDF oficial)"],["k_kfc_kentucky_fries_bacon","Kentucky Fries Bacon","KFC",247,3.9,29.1,11.3,0,0,[230,"ración","raciones"],0,"kfc.es (PDF oficial)"],["k_kfc_tarrina_de_arroz_kfc","Tarrina de arroz (KFC)","KFC",127,2.7,28.2,0.3,0,0.1,[100,"tarrina","tarrinas"],0,"kfc.es (PDF oficial)"],["k_kfc_mazorca_de_maiz_kfc","Mazorca de maíz (KFC)","KFC",106,3.8,21.6,1.6,0,0,[79,"mazorca","mazorcas"],0,"kfc.es (PDF oficial)"],["k_kfc_ensalada_de_col_kfc","Ensalada de col (KFC)","KFC",209,1.1,8.9,18,0,8,[150,"ración","raciones"],0,"kfc.es (PDF oficial)"],["k_kfc_salsa_barbacoa_kfc","Salsa barbacoa (KFC)","KFC",160,1,40,1,0,0,[25,"tarrina","tarrinas"],0,"kfc.es (PDF oficial)"],["k_kfc_salsa_caesar_kfc","Salsa Caesar (KFC)","KFC",461,1.2,10,46,0,9.1,[50,"tarrina","tarrinas"],0,"kfc.es (PDF oficial)"],["k_kfc_salsa_2hot4u_kfc","Salsa 2Hot4U (KFC)","KFC",140,1,33,1,0,0,[23,"tarrina","tarrinas"],0,"kfc.es (PDF oficial)"],["k_kfc_salsa_sweet_imperial_kfc","Salsa Sweet Imperial (KFC)","KFC",154,1,36,1,0,0,[23,"tarrina","tarrinas"],0,"kfc.es (PDF oficial)"],["k_kfc_kentucky_shake_fresa","Kentucky Shake Fresa","KFC",115,2.8,17.5,3.6,0,14,[240,"batido","batidos"],0,"kfc.es (PDF oficial)"],["k_kfc_kentucky_shake_oreo","Kentucky Shake Oreo","KFC",138,2.7,20,3.5,0,15.3,[250,"batido","batidos"],0,"kfc.es (PDF oficial)"],["k_kfc_kentucky_shake_nocilla","Kentucky Shake Nocilla","KFC",128,2.8,17.5,3.6,0,15.1,[240,"batido","batidos"],0,"kfc.es (PDF oficial)"],["k_kfc_fresisuis_kfc","Fresisuis (KFC)","KFC",117,2.8,18.5,3.6,0,15.8,[340,"vaso","vasos"],0,"kfc.es (PDF oficial)"],["k_kfc_sundae_de_caramelo_kfc","Sundae de caramelo (KFC)","KFC",166,2.5,27.7,4.5,0,22,[145,"sundae","sundaes"],0,"kfc.es (PDF oficial)"],["k_kfc_sundae_de_fresa_kfc","Sundae de fresa (KFC)","KFC",159,2.5,26.3,4.5,0,20,[145,"sundae","sundaes"],0,"kfc.es (PDF oficial)"],["k_kfc_sundae_de_nocilla_kfc","Sundae de Nocilla (KFC)","KFC",191,3,26.5,5,0,22.7,[145,"sundae","sundaes"],0,"kfc.es (PDF oficial)"],["k_kfc_gofre_con_nocilla_oreo_y_helado_","Gofre con Nocilla, Oreo y helado (KFC)","KFC",367,3.7,45.5,15.3,0,26.1,[165,"gofre","gofres"],0,"kfc.es (PDF oficial)"],["k_kfc_cubo_de_helado_nocilla_kfc","Cubo de helado Nocilla (KFC)","KFC",204,3.1,31.9,4.9,0,22.1,[170,"cubo","cubos"],0,"kfc.es (PDF oficial)"],["k_kfc_cubo_de_helado_oreo_kfc","Cubo de helado Oreo (KFC)","KFC",223,2.8,30.9,6.3,0,24.2,[175,"cubo","cubos"],0,"kfc.es (PDF oficial)"],["k_kfc_cubo_de_helado_fresa_kfc","Cubo de helado fresa (KFC)","KFC",188,3,32.5,4.7,0,20.8,[175,"cubo","cubos"],0,"kfc.es (PDF oficial)"]];
CHAIN_FOODS.forEach(([id, name, brand, kcal, p, c, f, fib, sug, serv, ml, src]) => {
    const role = p * 4 >= Math.max(c * 4, f * 9) ? 'protein' : f * 9 > c * 4 ? 'fat' : 'carb';
    FOODS.push({ id, name, brand, cat: 'marca', fast: 1, role, meals: 'BSLD', p, f, c, fib, kcal, min: 0, max: 0, flags: '', diaryOnly: 1, ...(serv ? { serv } : {}), ...(sug != null ? { sug } : {}), ...(ml ? { ml: 1 } : {}), src });
});
// </cadenas>
// <usda> (lo genera tools/genericos/embed.js · USDA FoodData Central: SR Legacy y FNDDS, dominio público · ICBF: Tabla de Composición de Alimentos Colombianos 2018 · 2026-10-17)
// Alimentos crudos y cocinados con su ficha oficial (fdc = ficha del USDA · icbf = código de la tabla colombiana). HC sin fibra, como las etiquetas de la UE.
D("u_pollo_asado_sin", "Pechuga de pollo asada (sin piel)", 'prot', 31, 3.6, 0, 0, [120,"filete","filetes"], '', 'M', {"sug":0,"fdc":171477});
D("u_pollo_guisado", "Pechuga de pollo guisada / hervida", 'prot', 29, 3, 0, 0, [120,"filete","filetes"], '', 'M', {"sug":0,"fdc":171478});
D("u_pollo_frito_sin", "Pechuga de pollo frita (sin rebozar)", 'prot', 33.4, 4.7, 0.5, 0, [120,"filete","filetes"], '', 'M', {"sug":0,"fdc":171078});
D("u_muslo_crudo", "Muslo de pollo crudo (sin piel)", 'prot', 19.7, 4.1, 0, 0, [100,"muslo","muslos"], '', 'M', {"raw":1,"sug":0,"fdc":173627});
D("u_muslo_asado", "Muslo de pollo asado (sin piel)", 'prot', 24.8, 8.2, 0, 0, [90,"muslo","muslos"], '', 'M', {"sug":0,"fdc":172388});
D("u_muslo_asado_piel", "Muslo de pollo asado (con piel)", 'prot', 23.3, 14.7, 0, 0, [100,"muslo","muslos"], '', 'M', {"sug":0,"fdc":173625});
D("u_contramuslo_crudo", "Contramuslo de pollo crudo (con piel)", 'prot', 16.5, 16.6, 0.3, 0, [120,"contramuslo","contramuslos"], '', 'M', {"raw":1,"sug":0,"fdc":172385});
D("u_alitas_crudas", "Alitas de pollo crudas", 'prot', 17.5, 12.9, 0, 0, [90,"alita","alitas"], '', 'M', {"raw":1,"sug":0,"fdc":172390});
D("u_pollo_entero_asado", "Pollo asado (carne sin piel, mezcla)", 'prot', 28.9, 7.4, 0, 0, [150,"ración","raciones"], '', 'M', {"sug":0,"fdc":171054});
D("u_higado_pollo", "Hígado de pollo (hecho)", 'prot', 24.5, 6.5, 0.9, 0, [100,"ración","raciones"], '', 'M', {"sug":0,"fdc":171061});
D("u_pavo_asado", "Pechuga de pavo asada", 'prot', 30.1, 2.1, 0, 0, [120,"filete","filetes"], '', 'M', {"sug":0,"fdc":171496});
D("u_pavo_picado", "Carne picada de pavo (cruda)", 'prot', 19.7, 7.7, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"sug":0,"fdc":171505});
D("u_pavo_picado_hecho", "Carne picada de pavo (hecha)", 'prot', 27.4, 10.4, 0, 0, [110,"ración","raciones"], '', 'M', {"sug":0,"fdc":171506});
D("u_picada5", "Carne picada vacuno 5 % (cruda)", 'prot', 21.4, 5, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"sug":0,"fdc":171790});
D("u_picada5_hecha", "Carne picada vacuno 5 % (hecha)", 'prot', 29.2, 7.6, 0, 0, [100,"ración","raciones"], '', 'M', {"sug":0,"fdc":174028});
D("u_picada10_hecha", "Carne picada vacuno 10 % (hecha)", 'prot', 28.5, 12, 0, 0, [100,"ración","raciones"], '', 'M', {"sug":0,"fdc":171794});
D("u_picada20", "Carne picada vacuno 20 % (cruda)", 'prot', 17.2, 20, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"sug":0,"fdc":174036});
D("u_picada20_hecha", "Carne picada vacuno 20 % (hecha)", 'prot', 27, 17.4, 0, 0, [100,"ración","raciones"], '', 'M', {"sug":0,"fdc":171799});
D("u_solomillo_ternera", "Solomillo de ternera (crudo)", 'prot', 22.1, 6.5, 0, 0, [150,"filete","filetes"], '', 'M', {"raw":1,"sug":0,"fdc":171812});
D("u_solomillo_ternera_hecho", "Solomillo de ternera a la plancha", 'prot', 29, 8.4, 0, 0, [130,"filete","filetes"], '', 'M', {"sug":0,"fdc":171811});
D("u_falda_ternera", "Falda de ternera a la plancha", 'prot', 27.8, 8.3, 0, 0, [130,"filete","filetes"], '', 'M', {"sug":0,"fdc":168611});
D("u_lomo_alto", "Lomo alto / chuletón (crudo)", 'prot', 19.3, 19.1, 0, 0, [300,"chuletón","chuletones"], '', 'M', {"raw":1,"sug":0,"fdc":169509});
D("u_redondo", "Redondo de ternera asado", 'prot', 29.7, 4.7, 0, 0, [130,"ración","raciones"], '', 'M', {"sug":0,"fdc":171809});
D("u_ternera_guisada", "Ternera para guisar (hecha)", 'prot', 32.4, 6.8, 0, 0, [130,"ración","raciones"], '', 'M', {"sug":0,"fdc":171203});
D("u_higado_ternera_hecho", "Hígado de ternera a la plancha", 'prot', 26.5, 4.7, 5.2, 0, [110,"filete","filetes"], '', 'M', {"sug":0,"fdc":168627});
D("u_lengua", "Lengua de ternera (hecha)", 'prot', 19.3, 22.3, 0, 0, [100,"ración","raciones"], '', 'M', {"sug":0,"fdc":170598});
D("u_burger_casera", "Hamburguesa de vacuno a la plancha (85 %)", 'prot', 24.6, 14, 0, 0, [100,"hamburguesa","hamburguesas"], '', 'M', {"sug":0,"fdc":174033});
D("u_lomo_cerdo_hecho", "Lomo de cerdo a la plancha", 'prot', 30, 4.7, 0, 0, [120,"filete","filetes"], '', 'M', {"sug":0,"fdc":168285});
D("u_solomillo_cerdo_asado", "Solomillo de cerdo asado", 'prot', 26.2, 3.5, 0, 0, [130,"ración","raciones"], '', 'M', {"sug":0,"fdc":168250});
D("u_chuleta_cerdo", "Chuleta de cerdo frita", 'prot', 26.8, 15.7, 0, 0, [120,"chuleta","chuletas"], '', 'M', {"sug":0,"fdc":168293});
D("u_chuleta_cerdo_hecha", "Chuleta de cerdo a la plancha", 'prot', 24.4, 13, 0, 0, [120,"chuleta","chuletas"], '', 'M', {"sug":0,"fdc":167831});
D("u_cerdo_picado", "Carne picada de cerdo (cruda)", 'prot', 16.9, 21.2, 0, 0, [125,"ración","raciones"], '', 'M', {"raw":1,"fdc":167902});
D("u_cerdo_picado_hecho", "Carne picada de cerdo (hecha)", 'prot', 25.7, 20.8, 0, 0, [100,"ración","raciones"], '', 'M', {"sug":0,"fdc":167903});
D("u_panceta", "Panceta / tocino fresco", 'prot', 9.3, 53, 0, 0, [50,"loncha","lonchas"], '', 'M', {"raw":1,"sug":0,"fdc":167812});
D("u_bacon_frito", "Beicon frito", 'prot', 37, 41.8, 1.4, 0, [10,"loncha","lonchas"], '', 'M', {"sug":0,"fdc":167712});
D("u_paletilla_cerdo", "Paleta de cerdo asada", 'prot', 23.3, 21.4, 0, 0, [130,"ración","raciones"], '', 'M', {"sug":0,"fdc":167844});
D("u_cordero_pierna", "Pierna de cordero asada", 'prot', 26.4, 12.5, 0, 0, [150,"ración","raciones"], '', 'M', {"fdc":172485});
D("u_cordero_chuleta_hecha", "Chuletas de cordero a la plancha", 'prot', 25.2, 23.1, 0, 0, [120,"ración","raciones"], '', 'M', {"sug":0,"fdc":172489});
D("u_conejo_hecho", "Conejo guisado", 'prot', 30.4, 8.4, 0, 0, [150,"ración","raciones"], '', 'M', {"sug":0,"fdc":174346});
D("u_pato", "Pato asado (sin piel)", 'prot', 23.5, 11.2, 0, 0, [130,"ración","raciones"], '', 'M', {"sug":0,"fdc":172411});
D("u_codorniz", "Codorniz asada", 'prot', 25.1, 14.1, 0, 0, [100,"codorniz","codornices"], '', 'M', {"sug":0,"fdc":169902});
D("u_salmon_horno", "Salmón al horno", 'prot', 22.1, 12.4, 0, 0, [130,"lomo","lomos"], '', 'P', {"sug":0,"fdc":175168});
D("u_salmon_salvaje", "Salmón salvaje (crudo)", 'prot', 19.8, 6.3, 0, 0, [150,"lomo","lomos"], '', 'P', {"raw":1,"fdc":173686});
D("u_bacalao_hecho", "Bacalao fresco al horno", 'prot', 22.8, 0.9, 0, 0, [150,"lomo","lomos"], '', 'P', {"sug":0,"fdc":171956});
D("u_bacalao_salado", "Bacalao salado (seco, sin desalar)", 'prot', 62.8, 2.4, 0, 0, [50,"ración","raciones"], '', 'P', {"raw":1,"sug":0,"fdc":174190});
D("u_atun_fresco_hecho", "Atún fresco a la plancha", 'prot', 29.2, 0.6, 0, 0, [130,"filete","filetes"], '', 'P', {"sug":0,"fdc":172006});
D("u_caballa_hecha", "Caballa a la plancha", 'prot', 23.9, 17.8, 0, 0, [130,"ración","raciones"], '', 'P', {"fdc":175120});
D("u_trucha_hecha", "Trucha a la plancha", 'prot', 23.8, 7.4, 0, 0, [130,"trucha","truchas"], '', 'P', {"sug":0,"fdc":173718});
D("u_lenguado", "Lenguado / gallo (crudo)", 'prot', 12.4, 1.9, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"sug":0,"fdc":174196});
D("u_lenguado_hecho", "Lenguado / gallo a la plancha", 'prot', 15.2, 2.4, 0, 0, [130,"filete","filetes"], '', 'P', {"sug":0,"fdc":174197});
D("u_panga", "Panga / basa (cruda)", 'prot', 15.2, 5.9, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"sug":0,"fdc":175165});
D("u_abadejo", "Abadejo / carbonero (crudo)", 'prot', 19.4, 1, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"sug":0,"fdc":175129});
D("u_abadejo_hecho", "Abadejo a la plancha", 'prot', 24.9, 1.3, 0, 0, [130,"filete","filetes"], '', 'P', {"fdc":174237});
D("u_tilapia", "Tilapia (cruda)", 'prot', 20.1, 1.7, 0, 0, [150,"filete","filetes"], '', 'P', {"raw":1,"sug":0,"fdc":175176});
D("u_tilapia_hecha", "Tilapia a la plancha", 'prot', 26.2, 2.7, 0, 0, [130,"filete","filetes"], '', 'P', {"sug":0,"fdc":175177});
D("u_merluza_hecha2", "Merluza / pescadilla al horno", 'prot', 23.5, 1.7, 0, 0, [150,"ración","raciones"], '', 'P', {"sug":0,"fdc":175161});
D("u_emperador", "Pez espada / emperador a la plancha", 'prot', 23.5, 7.9, 0, 0, [130,"rodaja","rodajas"], '', 'P', {"sug":0,"fdc":173704});
D("u_anchoa_fresca", "Boquerones frescos (crudos)", 'prot', 20.4, 4.8, 0, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"sug":0,"fdc":174182});
D("u_arenque", "Arenque (crudo)", 'prot', 18, 9, 0, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"sug":0,"fdc":175116});
D("u_gambas_crudas", "Gambas / langostinos crudos (pelados)", 'prot', 20.1, 0.5, 0, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"fdc":175179});
D("u_gambas_cocidas", "Gambas / langostinos cocidos", 'prot', 24, 0.3, 0.2, 0, [100,"ración","raciones"], '', 'P', {"fdc":175180});
D("u_cangrejo", "Cangrejo / buey de mar (cocido)", 'prot', 17.9, 0.7, 0, 0, [100,"ración","raciones"], '', 'P', {"sug":0,"fdc":174205});
D("u_langosta", "Bogavante / langosta (cocido)", 'prot', 19, 0.9, 0, 0, [150,"ración","raciones"], '', 'P', {"sug":0,"fdc":174209});
D("u_mejillones_cocidos", "Mejillones al vapor (sin concha)", 'prot', 23.8, 4.5, 7.4, 0, [100,"ración","raciones"], '', 'P', {"fdc":174217});
D("u_almejas_cocidas", "Almejas al vapor (sin concha)", 'prot', 25.6, 2, 5.1, 0, [80,"ración","raciones"], '', 'P', {"fdc":171975});
D("u_vieiras", "Vieiras (crudas)", 'prot', 12.1, 0.5, 3.2, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"sug":0,"fdc":174220});
D("u_ostras", "Ostras (crudas)", 'prot', 5.7, 1.7, 2.7, 0, [100,"ración","raciones"], '', 'P', {"raw":1,"sug":0.6,"fdc":171978});
D("u_calamar_crudo", "Calamar / chipirón (crudo)", 'prot', 15.6, 1.4, 3.1, 0, [150,"ración","raciones"], '', 'P', {"raw":1,"sug":0,"fdc":174223});
D("u_pulpo_cocido", "Pulpo cocido", 'prot', 29.8, 2.1, 4.4, 0, [150,"ración","raciones"], '', 'P', {"sug":0,"fdc":174249});
D("u_sepia_hecha", "Sepia a la plancha", 'prot', 32.5, 1.4, 1.6, 0, [150,"ración","raciones"], '', 'P', {"fdc":172010});
D("u_atun_natural_esc", "Atún claro al natural (escurrido)", 'prot', 25.5, 0.8, 0, 0, [56,"lata","latas"], '', 'P', {"sug":0,"fdc":171986});
D("u_salmon_lata", "Salmón en lata", 'prot', 23.1, 5, 0, 0, [100,"ración","raciones"], '', 'P', {"sug":0,"fdc":175175});
D("u_caviar", "Huevas de pescado", 'prot', 22.3, 6.4, 1.5, 0, [30,"cucharada","cucharadas"], '', 'P', {"raw":1,"sug":0,"fdc":175132});
D("u_huevo_cocido", "Huevo cocido", 'prot', 12.6, 10.6, 1.1, 0, [50,"huevo","huevos"], '', 'V', {"sug":1.1,"fdc":173424});
D("u_huevo_poche", "Huevo escalfado / poché", 'prot', 12.5, 9.5, 0.7, 0, [50,"huevo","huevos"], '', 'V', {"sug":0.4,"fdc":172186});
D("u_yema", "Yema de huevo", 'prot', 15.9, 26.5, 3.6, 0, [17,"yema","yemas"], '', 'V', {"sug":0.6,"fdc":172184});
D("u_huevo_pato", "Huevo de pato", 'prot', 12.8, 13.8, 1.5, 0, [70,"huevo","huevos"], '', 'V', {"sug":0.9,"fdc":172189});
D("u_huevo_codorniz", "Huevos de codorniz", 'prot', 13.1, 11.1, 0.4, 0, [9,"huevo","huevos"], '', 'V', {"sug":0.4,"fdc":172191});
D("u_leche_entera_usda", "Leche entera (3,25 %)", 'lacteo', 3.2, 3.3, 4.8, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"sug":4.8,"fdc":171265});
D("u_leche_2", "Leche semidesnatada (2 %)", 'lacteo', 3.3, 2, 4.8, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"sug":4.8,"fdc":171267});
D("u_leche_1", "Leche semidesnatada ligera (1 %)", 'lacteo', 3.4, 1, 5, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"sug":5,"fdc":170872});
D("u_leche_cabra", "Leche de cabra", 'lacteo', 3.6, 4.1, 4.5, 0, [250,"vaso","vasos"], '', 'VL', {"ml":1,"sug":4.5,"fdc":171278});
D("u_leche_condensada", "Leche condensada", 'lacteo', 7.9, 8.7, 54.4, 0, [20,"cucharada","cucharadas"], '', 'VL', {"sug":54.4,"fdc":171275});
D("u_leche_evaporada", "Leche evaporada", 'lacteo', 6.8, 7.6, 10, 0, [30,"chorrito","chorritos"], '', 'VL', {"sug":10,"fdc":171276});
D("u_leche_polvo", "Leche en polvo desnatada", 'lacteo', 36.2, 0.8, 52, 0, [20,"cucharada","cucharadas"], '', 'VL', {"sug":52,"fdc":170877});
D("u_yogur_entero", "Yogur natural entero", 'lacteo', 3.5, 3.3, 4.7, 0, [125,"yogur","yogures"], '', 'VL', {"sug":4.7,"fdc":171284});
D("u_yogur_griego_0", "Yogur griego 0 %", 'lacteo', 10.2, 0.4, 3.6, 0, [125,"yogur","yogures"], '', 'VL', {"sug":3.2,"fdc":170894});
D("u_yogur_griego_2", "Yogur griego ligero (2 %)", 'lacteo', 10, 1.9, 3.9, 0, [125,"yogur","yogures"], '', 'VL', {"sug":3.6,"fdc":170903});
D("u_nata_agria", "Nata agria", 'lacteo', 2.4, 19.4, 4.6, 0, [30,"cucharada","cucharadas"], '', 'VL', {"sug":3.4,"fdc":171257});
D("u_queso_cheddar", "Queso cheddar", 'lacteo', 22.9, 33.3, 3.4, 0, [30,"loncha","lonchas"], '', 'VL', {"sug":0.5,"fdc":173414});
D("u_queso_gouda", "Queso gouda", 'lacteo', 24.9, 27.4, 2.2, 0, [30,"loncha","lonchas"], '', 'VL', {"sug":2.2,"fdc":171241});
D("u_queso_brie", "Queso brie", 'lacteo', 20.8, 27.7, 0.5, 0, [30,"porción","porciones"], '', 'VL', {"sug":0.5,"fdc":172177});
D("u_queso_camembert", "Queso camembert", 'lacteo', 19.8, 24.3, 0.5, 0, [30,"porción","porciones"], '', 'VL', {"sug":0.5,"fdc":172178});
D("u_queso_feta", "Queso feta", 'lacteo', 14.2, 21.5, 3.9, 0, [30,"ración","raciones"], '', 'VL', {"sug":0,"fdc":173420});
D("u_queso_azul", "Queso azul", 'lacteo', 21.4, 28.7, 2.3, 0, [30,"ración","raciones"], '', 'VL', {"sug":0.5,"fdc":172175});
D("u_queso_edam", "Queso edam / bola", 'lacteo', 25, 28.6, 1.4, 0, [30,"loncha","lonchas"], '', 'VL', {"sug":0,"fdc":173419});
D("u_queso_provolone", "Queso provolone", 'lacteo', 25.6, 26.6, 2.1, 0, [30,"loncha","lonchas"], '', 'VL', {"sug":0.6,"fdc":170850});
D("u_queso_ricotta_semi", "Ricotta semidesnatada", 'lacteo', 11.4, 7.9, 5.1, 0, [60,"ración","raciones"], '', 'VL', {"sug":0.3,"fdc":171248});
D("u_mozzarella_light", "Mozzarella semidesnatada", 'lacteo', 23.8, 19.8, 5.6, 0, [30,"ración","raciones"], '', 'VL', {"sug":1.9,"fdc":171244});
D("u_queso_cottage_1", "Queso cottage 1 %", 'lacteo', 12.4, 1, 2.7, 0, [100,"ración","raciones"], '', 'VL', {"sug":2.7,"fdc":173417});
D("u_queso_fundir_lonchas", "Queso para fundir (tipo americano)", 'lacteo', 18.1, 30.7, 4.8, 0, [20,"loncha","lonchas"], '', 'VL', {"sug":2.3,"fdc":170853});
D("u_helado_chocolate", "Helado de chocolate", 'lacteo', 3.8, 11, 27, 1.2, [70,"bola","bolas"], '', 'VL', {"sug":25.4,"fdc":168809});
D("u_nata_montada", "Nata montada (spray)", 'lacteo', 3.2, 22.2, 12.5, 0, [10,"chorro","chorros"], '', 'VL', {"sug":8,"fdc":170860});
D("u_arroz_blanco_crudo", "Arroz blanco largo (crudo)", 'hc', 7.1, 0.7, 78.7, 1.3, [80,"ración","raciones"], '', 'N', {"raw":1,"sug":0.1,"fdc":168877});
D("u_arroz_blanco_cocido", "Arroz blanco largo cocido", 'hc', 2.7, 0.3, 27.8, 0.4, [200,"ración","raciones"], '', 'N', {"sug":0.1,"fdc":169757});
D("u_arroz_redondo_crudo", "Arroz redondo (crudo)", 'hc', 6.5, 0.5, 76.4, 2.8, [80,"ración","raciones"], '', 'N', {"raw":1,"fdc":168881});
D("u_arroz_redondo_cocido", "Arroz redondo cocido", 'hc', 2.4, 0.2, 28.7, 0, [200,"ración","raciones"], '', 'N', {"fdc":168882});
D("u_arroz_integral_crudo", "Arroz integral (crudo)", 'hc', 7.5, 3.2, 72.7, 3.6, [80,"ración","raciones"], '', 'N', {"raw":1,"sug":0.7,"fdc":169703});
D("u_arroz_glutinoso", "Arroz glutinoso (cocido)", 'hc', 2, 0.2, 20.1, 1, [200,"ración","raciones"], '', 'N', {"sug":0.1,"fdc":169711});
D("u_arroz_salvaje", "Arroz salvaje (cocido)", 'hc', 4, 0.3, 19.5, 1.8, [160,"ración","raciones"], '', 'N', {"sug":0.7,"fdc":168897});
D("u_pasta_cruda", "Pasta seca (cruda)", 'hc', 13, 1.5, 71.5, 3.2, [80,"ración","raciones"], '', 'NG', {"raw":1,"sug":2.7,"fdc":169736});
D("u_pasta_cocida2", "Pasta cocida (sin sal)", 'hc', 5.8, 0.9, 29.1, 1.8, [200,"plato","platos"], '', 'NG', {"sug":0.6,"fdc":169737});
D("u_pasta_int_cruda", "Pasta integral seca (cruda)", 'hc', 13.9, 2.9, 64.2, 9.2, [80,"ración","raciones"], '', 'NG', {"raw":1,"sug":2.7,"fdc":169738});
D("u_pasta_huevo", "Pasta al huevo (cruda)", 'hc', 14.2, 4.4, 68, 3.3, [80,"ración","raciones"], '', 'VG', {"raw":1,"sug":1.9,"fdc":169731});
D("u_pasta_huevo_cocida", "Pasta al huevo cocida", 'hc', 4.5, 2.1, 24, 1.2, [180,"plato","platos"], '', 'VG', {"sug":0.4,"fdc":169732});
D("u_fideos_arroz_cocidos", "Fideos de arroz cocidos", 'hc', 1.8, 0.2, 23, 1, [180,"ración","raciones"], '', 'N', {"sug":0,"fdc":168914});
D("u_soba", "Fideos soba (cocidos)", 'hc', 5.1, 0.1, 21.4, 0, [180,"ración","raciones"], '', 'NG', {"fdc":168907});
D("u_bulgur", "Bulgur (cocido)", 'hc', 3.1, 0.2, 14.1, 4.5, [180,"ración","raciones"], '', 'NG', {"sug":0.1,"fdc":170287});
D("u_bulgur_seco", "Bulgur (seco)", 'hc', 12.3, 1.3, 63.4, 12.5, [70,"ración","raciones"], '', 'NG', {"raw":1,"sug":0.4,"fdc":170688});
D("u_mijo", "Mijo (cocido)", 'hc', 3.5, 1, 22.4, 1.3, [170,"ración","raciones"], '', 'N', {"sug":0.1,"fdc":168871});
D("u_espelta", "Espelta (cocida)", 'hc', 5.5, 0.9, 22.5, 3.9, [190,"ración","raciones"], '', 'NG', {"fdc":169746});
D("u_trigo_sarraceno", "Trigo sarraceno (cocido)", 'hc', 3.4, 0.6, 17.2, 2.7, [170,"ración","raciones"], '', 'N', {"sug":0.9,"fdc":170686});
D("u_cebada", "Cebada perlada (cocida)", 'hc', 2.3, 0.4, 24.4, 3.8, [160,"ración","raciones"], '', 'NG', {"sug":0.3,"fdc":170285});
D("u_quinoa_cruda", "Quinoa (cruda)", 'hc', 14.1, 6.1, 57.2, 7, [70,"ración","raciones"], '', 'N', {"raw":1,"fdc":168874});
D("u_cuscus_seco", "Cuscús (seco)", 'hc', 12.8, 0.6, 72.4, 5, [70,"ración","raciones"], '', 'NG', {"raw":1,"fdc":169699});
D("u_polenta", "Harina de maíz / polenta (seca)", 'hc', 8.1, 3.6, 69.6, 7.3, [50,"ración","raciones"], '', 'N', {"raw":1,"sug":0.6,"fdc":169697});
D("u_maiz_mazorca", "Mazorca de maíz cocida", 'hc', 3.4, 1.5, 18.6, 2.4, [100,"mazorca","mazorcas"], '', 'N', {"sug":4.5,"fdc":169999});
D("u_pan_blanco_molde", "Pan blanco de molde", 'hc', 8.9, 3.3, 46.7, 2.7, [25,"rebanada","rebanadas"], '', 'NG', {"sug":5.7,"fdc":174924});
D("u_pan_integral_molde", "Pan integral de trigo", 'hc', 12.5, 3.5, 36.7, 6, [30,"rebanada","rebanadas"], '', 'NG', {"sug":4.3,"fdc":172688});
D("u_pan_frances", "Pan de barra (baguette)", 'hc', 10.8, 2.4, 49.7, 2.2, [60,"trozo","trozos"], '', 'NG', {"sug":4.6,"fdc":172675});
D("u_pan_multicereal", "Pan multicereales", 'hc', 13.4, 4.2, 35.9, 7.4, [30,"rebanada","rebanadas"], '', 'NG', {"sug":6.4,"fdc":168013});
D("u_pan_tostado_usda", "Pan tostado (blanco)", 'hc', 9, 4, 51.6, 2.9, [22,"tostada","tostadas"], '', 'NG', {"sug":6.2,"fdc":174925});
D("u_pan_hamburguesa", "Pan de hamburguesa / perrito", 'hc', 9.8, 3.9, 48.3, 1.8, [45,"pan","panes"], '', 'NG', {"sug":7.3,"fdc":172796});
D("u_tortilla_maiz", "Tortilla de maíz", 'hc', 5.7, 2.9, 38.3, 6.3, [26,"tortilla","tortillas"], '', 'N', {"sug":0.9,"fdc":175036});
D("u_picos", "Picos / colines", 'hc', 12, 9.5, 65.4, 3, [10,"puñado","puñados"], '', 'NG', {"sug":1.3,"fdc":174929});
D("u_crackers", "Crackers / galletas saladas", 'hc', 9.5, 8.6, 71.3, 2.8, [15,"ración","raciones"], '', 'NG', {"sug":1.3,"fdc":172746});
D("u_tortitas_arroz_usda", "Tortitas de arroz (inflado)", 'hc', 8.2, 2.8, 77.3, 4.2, [9,"tortita","tortitas"], '', 'N', {"sug":0.9,"fdc":170250});
D("u_palomitas_aceite", "Palomitas (con aceite)", 'hc', 7.3, 43.6, 37, 8.1, [30,"bol","boles"], '', 'N', {"sug":0.5,"fdc":167549});
D("u_cereales_arroz_inflado", "Arroz inflado (cereal)", 'hc', 6.3, 0.5, 88.1, 1.7, [30,"ración","raciones"], '', 'N', {"fdc":173912});
D("u_harina_integral", "Harina integral de trigo", 'hc', 13.2, 2.5, 61.3, 10.7, [30,"cucharada","cucharadas"], '', 'NG', {"sug":0.4,"fdc":168893});
D("u_harina_maiz", "Harina de maíz (maicena)", 'hc', 0.3, 0.1, 90.4, 0.9, [10,"cucharada","cucharadas"], '', 'N', {"sug":0,"fdc":169698});
D("u_pan_rallado", "Pan rallado", 'hc', 13.4, 5.3, 67.5, 4.5, [15,"cucharada","cucharadas"], '', 'NG', {"sug":6.2,"fdc":174928});
D("u_patata_cruda_piel", "Patata cruda (con piel)", 'hc', 2.1, 0.1, 15.4, 2.1, [200,"patata","patatas"], '', 'N', {"raw":1,"sug":0.8,"fdc":170026});
D("u_patata_hervida_sin", "Patata hervida (pelada)", 'hc', 1.7, 0.1, 18.2, 1.8, [150,"patata","patatas"], '', 'N', {"sug":0.9,"fdc":170440});
D("u_patata_horno_piel", "Patata al horno (con piel)", 'hc', 2.5, 0.1, 19, 2.2, [170,"patata","patatas"], '', 'N', {"sug":1.2,"fdc":170093});
D("u_patatas_fritas_horno", "Patatas fritas congeladas al horno", 'hc', 2.7, 5.2, 26.1, 2.6, [150,"ración","raciones"], '', 'N', {"sug":0.3,"fdc":170118});
D("u_boniato_crudo", "Boniato (crudo)", 'hc', 1.6, 0.1, 17.1, 3, [200,"boniato","boniatos"], '', 'N', {"raw":1,"sug":4.2,"fdc":168482});
D("u_boniato_hervido", "Boniato hervido", 'hc', 1.4, 0.1, 15.2, 2.5, [150,"ración","raciones"], '', 'N', {"sug":5.7,"fdc":168484});
D("u_yuca", "Yuca (cruda)", 'hc', 1.4, 0.3, 36.3, 1.8, [150,"ración","raciones"], '', 'N', {"raw":1,"sug":1.7,"fdc":169985});
D("u_nabo", "Nabo (cocido)", 'verdura', 0.7, 0.1, 3.1, 2, [150,"ración","raciones"], '', 'N', {"sug":3,"fdc":170058});
D("u_lentejas_secas", "Lentejas (secas)", 'legum', 24.6, 1.1, 52.7, 10.7, [70,"ración","raciones"], '', 'N', {"raw":1,"sug":2,"fdc":172420});
D("u_lentejas_hervidas", "Lentejas hervidas", 'legum', 9, 0.4, 12.2, 7.9, [200,"plato","platos"], '', 'N', {"sug":1.8,"fdc":172421});
D("u_garbanzos_secos", "Garbanzos (secos)", 'legum', 20.5, 6, 50.8, 12.2, [70,"ración","raciones"], '', 'N', {"raw":1,"sug":10.7,"fdc":173756});
D("u_garbanzos_hervidos", "Garbanzos hervidos", 'legum', 8.9, 2.6, 19.8, 7.6, [200,"plato","platos"], '', 'N', {"sug":4.8,"fdc":173757});
D("u_alubias_blancas_secas", "Alubias blancas (secas)", 'legum', 23.4, 0.9, 45.1, 15.2, [70,"ración","raciones"], '', 'N', {"raw":1,"sug":2.1,"fdc":175202});
D("u_alubias_blancas_hervidas", "Alubias blancas hervidas", 'legum', 9.7, 0.4, 18.8, 6.3, [200,"plato","platos"], '', 'N', {"sug":0.3,"fdc":175203});
D("u_alubias_rojas", "Alubias rojas hervidas", 'legum', 8.7, 0.5, 15.4, 7.4, [200,"plato","platos"], '', 'N', {"sug":0.3,"fdc":175194});
D("u_alubias_negras", "Alubias negras hervidas", 'legum', 8.9, 0.5, 15, 8.7, [200,"plato","platos"], '', 'N', {"sug":0.3,"fdc":173735});
D("u_alubias_pintas", "Alubias pintas hervidas", 'legum', 9, 0.7, 17.2, 9, [200,"plato","platos"], '', 'N', {"sug":0.3,"fdc":175200});
D("u_guisantes_secos", "Guisantes partidos hervidos", 'legum', 8.3, 0.4, 12.8, 8.3, [200,"plato","platos"], '', 'N', {"sug":2.9,"fdc":172429});
D("u_habas_secas", "Habas secas hervidas", 'legum', 7.6, 0.4, 14.2, 5.4, [200,"plato","platos"], '', 'N', {"sug":1.8,"fdc":173753});
D("u_soja_seca", "Soja en grano (seca)", 'legum', 36.5, 19.9, 20.9, 9.3, [60,"ración","raciones"], '', 'N', {"raw":1,"sug":7.3,"fdc":174270});
D("u_altramuces", "Altramuces (cocidos)", 'legum', 15.6, 2.9, 7.1, 2.8, [100,"ración","raciones"], '', 'N', {"fdc":172424});
D("u_judias_mungo", "Judías mungo hervidas", 'legum', 7, 0.4, 11.5, 7.6, [200,"plato","platos"], '', 'N', {"sug":2,"fdc":174257});
D("u_brotes_soja", "Brotes de soja", 'verdura', 3, 0.2, 4.1, 1.8, [70,"ración","raciones"], '', 'N', {"sug":4.1,"fdc":169957});
D("u_tofu_sedoso", "Tofu sedoso", 'vprot', 7.2, 3.7, 1, 0.2, [100,"ración","raciones"], '', 'N', {"sug":0.7,"fdc":172449});
D("u_bebida_soja_usda", "Bebida de soja (con azúcar)", 'bebida', 2.6, 1.5, 4.7, 0.2, [250,"vaso","vasos"], '', 'N', {"ml":1,"sug":3.7,"fdc":172456});
D("u_brocoli_crudo", "Brócoli crudo", 'verdura', 2.8, 0.4, 4, 2.6, [150,"ración","raciones"], '', 'N', {"sug":1.7,"fdc":170379});
D("u_coliflor_cocida", "Coliflor cocida", 'verdura', 1.8, 0.5, 1.8, 2.3, [150,"ración","raciones"], '', 'N', {"sug":1.8,"fdc":170397});
D("u_espinacas_cocidas", "Espinacas cocidas", 'verdura', 3, 0.3, 1.4, 2.4, [150,"ración","raciones"], '', 'N', {"sug":0.4,"fdc":168463});
D("u_acelgas", "Acelgas (crudas)", 'verdura', 1.8, 0.2, 2.1, 1.6, [150,"ración","raciones"], '', 'N', {"sug":1.1,"fdc":169991});
D("u_acelgas_cocidas", "Acelgas cocidas", 'verdura', 1.9, 0.1, 2, 2.1, [150,"ración","raciones"], '', 'N', {"sug":1.1,"fdc":170401});
D("u_judias_verdes_cocidas", "Judías verdes cocidas", 'verdura', 1.9, 0.3, 4.7, 3.2, [150,"ración","raciones"], '', 'N', {"sug":3.6,"fdc":169141});
D("u_zanahoria_cocida", "Zanahoria cocida", 'verdura', 0.8, 0.2, 5.2, 3, [100,"ración","raciones"], '', 'N', {"sug":3.5,"fdc":170394});
D("u_calabacin_cocido", "Calabacín cocido", 'verdura', 1.1, 0.4, 1.7, 1, [150,"ración","raciones"], '', 'N', {"sug":1.7,"fdc":169292});
D("u_calabaza_cocida", "Calabaza cocida", 'verdura', 0.7, 0.1, 3.8, 1.1, [150,"ración","raciones"], '', 'N', {"sug":2.1,"fdc":168449});
D("u_berenjena_cocida", "Berenjena cocida", 'verdura', 0.8, 0.2, 6.2, 2.5, [150,"ración","raciones"], '', 'N', {"sug":3.2,"fdc":169229});
D("u_pimiento_rojo", "Pimiento rojo (crudo)", 'verdura', 1, 0.3, 3.9, 2.1, [120,"pimiento","pimientos"], '', 'N', {"sug":3.9,"fdc":170108});
D("u_pimiento_verde", "Pimiento verde (crudo)", 'verdura', 0.9, 0.2, 2.9, 1.7, [120,"pimiento","pimientos"], '', 'N', {"sug":2.4,"fdc":170427});
D("u_pimiento_asado", "Pimiento rojo asado", 'verdura', 0.9, 0.2, 5.5, 1.2, [100,"ración","raciones"], '', 'N', {"sug":4.4,"fdc":170110});
D("u_cebolla_cocida", "Cebolla pochada / cocida", 'verdura', 1.4, 0.2, 8.8, 1.4, [80,"ración","raciones"], '', 'N', {"sug":4.7,"fdc":170001});
D("u_cebolleta", "Cebolleta / cebollino", 'verdura', 1.8, 0.2, 4.7, 2.6, [30,"ración","raciones"], '', 'N', {"sug":2.3,"fdc":170005});
D("u_puerro_cocido", "Puerro cocido", 'verdura', 0.8, 0.2, 6.6, 1, [100,"ración","raciones"], '', 'N', {"sug":2.1,"fdc":168426});
D("u_champi_cocidos", "Champiñones salteados", 'verdura', 2.2, 0.5, 3.1, 2.2, [100,"ración","raciones"], '', 'N', {"sug":2.3,"fdc":169252});
D("u_setas", "Setas de cardo / ostra", 'verdura', 3.3, 0.4, 3.8, 2.3, [100,"ración","raciones"], '', 'N', {"sug":1.1,"fdc":168580});
D("u_shiitake", "Shiitake (cocidas)", 'verdura', 1.6, 0.2, 12.3, 2.1, [100,"ración","raciones"], '', 'N', {"sug":3.8,"fdc":168437});
D("u_esparragos_cocidos", "Espárragos verdes cocidos", 'verdura', 2.4, 0.2, 2.1, 2, [120,"ración","raciones"], '', 'N', {"sug":1.3,"fdc":168390});
D("u_esparragos_lata", "Espárragos blancos (lata)", 'verdura', 2.1, 0.7, 0.9, 1.6, [100,"ración","raciones"], '', 'N', {"sug":0.9,"fdc":169207});
D("u_alcachofa_cocida", "Alcachofa cocida", 'verdura', 2.9, 0.3, 6.2, 5.7, [120,"alcachofa","alcachofas"], '', 'N', {"sug":1,"fdc":168386});
D("u_coles_cocidas", "Coles de Bruselas cocidas", 'verdura', 2.6, 0.5, 4.5, 2.6, [120,"ración","raciones"], '', 'N', {"sug":1.7,"fdc":169971});
D("u_repollo_cocido", "Repollo cocido", 'verdura', 1.3, 0.1, 3.6, 1.9, [150,"ración","raciones"], '', 'N', {"sug":2.8,"fdc":169976});
D("u_lombarda", "Lombarda (cruda)", 'verdura', 1.4, 0.2, 5.3, 2.1, [100,"ración","raciones"], '', 'N', {"sug":3.8,"fdc":169977});
D("u_guisantes_cocidos", "Guisantes cocidos", 'verdura', 5.2, 0.3, 9.8, 4.5, [100,"ración","raciones"], '', 'N', {"sug":4.4,"fdc":170017});
D("u_habas_tiernas", "Habas tiernas (cocidas)", 'verdura', 6.8, 0.3, 18.2, 5.4, [100,"ración","raciones"], '', 'N', {"sug":1.6,"fdc":169135});
D("u_tomate_cherry", "Tomates cherry", 'verdura', 0.9, 0.2, 2.7, 1.2, [100,"puñado","puñados"], '', 'N', {"sug":2.6,"fdc":170457});
D("u_tomate_seco", "Tomate seco", 'verdura', 14.1, 3, 43.5, 12.3, [15,"ración","raciones"], '', 'N', {"sug":37.6,"fdc":168567});
D("u_remolacha_cruda", "Remolacha (cruda)", 'verdura', 1.6, 0.2, 6.8, 2.8, [100,"ración","raciones"], '', 'N', {"sug":6.8,"fdc":169145});
D("u_rabano", "Rábanos", 'verdura', 0.7, 0.1, 1.8, 1.6, [50,"ración","raciones"], '', 'N', {"sug":1.8,"fdc":169276});
D("u_endibia", "Endibia", 'verdura', 1.3, 0.2, 0.3, 3.1, [80,"endibia","endibias"], '', 'N', {"sug":0.3,"fdc":168412});
D("u_canonigos", "Canónigos / lechuga variada", 'verdura', 1.4, 0.2, 1.6, 1.3, [60,"ración","raciones"], '', 'N', {"sug":0.8,"fdc":169249});
D("u_lechuga_romana", "Lechuga romana", 'verdura', 1.2, 0.3, 1.2, 2.1, [80,"ración","raciones"], '', 'N', {"sug":1.2,"fdc":169247});
D("u_lechuga_iceberg", "Lechuga iceberg", 'verdura', 0.9, 0.1, 1.8, 1.2, [80,"ración","raciones"], '', 'N', {"sug":1.8,"fdc":169248});
D("u_apio_crudo", "Apio (rama)", 'verdura', 0.7, 0.2, 1.4, 1.6, [40,"rama","ramas"], '', 'N', {"sug":1.3,"fdc":169988});
D("u_hinojo", "Hinojo", 'verdura', 1.2, 0.2, 4.2, 3.1, [100,"ración","raciones"], '', 'N', {"sug":3.9,"fdc":169385});
D("u_kale_cocido", "Kale cocido", 'verdura', 2.9, 1.2, 1.3, 4, [100,"ración","raciones"], '', 'N', {"sug":1.2,"fdc":169238});
D("u_pepinillos", "Pepinillos en vinagre", 'verdura', 0.5, 0.3, 1.4, 1, [30,"ración","raciones"], '', 'N', {"sug":1.1,"fdc":168558});
D("u_ajo_crudo", "Ajo (diente)", 'verdura', 6.4, 0.5, 31, 2.1, [3,"diente","dientes"], '', 'N', {"sug":1,"fdc":169230});
D("u_jengibre", "Jengibre fresco", 'verdura', 1.8, 0.8, 15.8, 2, [5,"trocito","trocitos"], '', 'N', {"sug":1.7,"fdc":169231});
D("u_okra", "Quimbombó / okra", 'verdura', 1.9, 0.2, 4.3, 3.2, [100,"ración","raciones"], '', 'N', {"sug":1.5,"fdc":169260});
D("u_chirivia", "Chirivía", 'verdura', 1.2, 0.3, 13.1, 4.9, [100,"ración","raciones"], '', 'N', {"sug":4.8,"fdc":170417});
D("u_algas_nori", "Alga nori (seca)", 'verdura', 5.8, 0.3, 4.8, 0.3, [5,"hoja","hojas"], '', 'N', {"sug":0.5,"fdc":168458});
D("u_maiz_lata", "Maíz dulce (lata)", 'verdura', 2.3, 1.2, 12.3, 2, [80,"ración","raciones"], '', 'N', {"sug":4.4,"fdc":169214});
D("u_aceitunas_verdes", "Aceitunas verdes", 'grasa', 1, 15.3, 0.5, 3.3, [30,"ración","raciones"], '', 'N', {"sug":0.5,"fdc":169096});
D("u_aceitunas_negras", "Aceitunas negras", 'grasa', 0.8, 10.9, 4.4, 1.6, [30,"ración","raciones"], '', 'N', {"sug":0,"fdc":169094});
D("u_limon", "Limón", 'fruta', 1.1, 0.3, 6.5, 2.8, [60,"limón","limones"], '', 'N', {"sug":2.5,"fdc":167746});
D("u_lima", "Lima", 'fruta', 0.7, 0.2, 7.7, 2.8, [45,"lima","limas"], '', 'N', {"sug":1.7,"fdc":168155});
D("u_pomelo_usda", "Pomelo rosa", 'fruta', 0.8, 0.1, 9.1, 1.6, [230,"pomelo","pomelos"], '', 'N', {"sug":6.9,"fdc":174673});
D("u_ciruela", "Ciruela", 'fruta', 0.7, 0.3, 10, 1.4, [65,"ciruela","ciruelas"], '', 'N', {"sug":9.9,"fdc":169949});
D("u_ciruela_pasa", "Ciruelas pasas", 'fruta', 2.2, 0.4, 56.8, 7.1, [30,"ración","raciones"], '', 'N', {"sug":38.1,"fdc":168162});
D("u_orejones", "Orejones (albaricoque seco)", 'fruta', 3.4, 0.5, 55.3, 7.3, [30,"ración","raciones"], '', 'N', {"sug":53.4,"fdc":173941});
D("u_higos_secos", "Higos secos", 'fruta', 3.3, 0.9, 54.1, 9.8, [40,"ración","raciones"], '', 'N', {"sug":47.9,"fdc":174665});
D("u_datiles_medjool", "Dátiles medjool", 'fruta', 1.8, 0.2, 68.3, 6.7, [24,"dátil","dátiles"], '', 'N', {"sug":66.5,"fdc":168191});
D("u_arandanos_secos", "Arándanos rojos deshidratados", 'fruta', 0.2, 1.1, 77.5, 5.3, [30,"ración","raciones"], '', 'N', {"sug":72.6,"fdc":171723});
D("u_platano_macho", "Plátano macho (crudo)", 'fruta', 1.3, 0.4, 30.2, 1.7, [180,"plátano","plátanos"], '', 'N', {"sug":17.5,"fdc":169130});
D("u_manzana_sin_piel", "Manzana pelada", 'fruta', 0.3, 0.1, 11.5, 1.3, [160,"manzana","manzanas"], '', 'N', {"sug":10.1,"fdc":171689});
D("u_uvas_rojas", "Uvas rojas / negras", 'fruta', 0.7, 0.2, 17.2, 0.9, [100,"racimo","racimos"], '', 'N', {"sug":15.5,"fdc":174683});
D("u_grosellas", "Grosellas", 'fruta', 1.4, 0.2, 9.5, 4.3, [80,"ración","raciones"], '', 'N', {"sug":7.4,"fdc":173964});
D("u_maracuya", "Maracuyá / fruta de la pasión", 'fruta', 2.2, 0.7, 13, 10.4, [20,"unidad","unidades"], '', 'N', {"sug":11.2,"fdc":169108});
D("u_lichis", "Lichis", 'fruta', 0.8, 0.4, 15.2, 1.3, [100,"ración","raciones"], '', 'N', {"sug":15.2,"fdc":169086});
D("u_guayaba", "Guayaba", 'fruta', 2.6, 1, 8.9, 5.4, [55,"guayaba","guayabas"], '', 'N', {"sug":8.9,"fdc":173044});
D("u_chirimoya", "Chirimoya", 'fruta', 1.6, 0.7, 14.7, 3, [250,"chirimoya","chirimoyas"], '', 'N', {"sug":12.9,"fdc":173953});
D("u_membrillo_fruta", "Membrillo (fruta)", 'fruta', 0.4, 0.1, 13.4, 1.9, [90,"membrillo","membrillos"], '', 'N', {"fdc":168163});
D("u_coco_fresco", "Coco fresco", 'fruta', 3.3, 33.5, 6.2, 9, [40,"trozo","trozos"], '', 'N', {"sug":6.2,"fdc":170169});
D("u_melocoton_almibar", "Melocotón en almíbar", 'fruta', 0.5, 0.1, 18.6, 1.3, [120,"ración","raciones"], '', 'N', {"sug":18.6,"fdc":169112});
D("u_pina_almibar", "Piña en almíbar", 'fruta', 0.4, 0.1, 19.4, 0.8, [120,"ración","raciones"], '', 'N', {"sug":16.9,"fdc":169944});
D("u_macedonia", "Macedonia de frutas en almíbar", 'fruta', 0.4, 0.1, 17.9, 1, [120,"ración","raciones"], '', 'N', {"sug":17.9,"fdc":173028});
D("u_zumo_manzana", "Zumo de manzana", 'bebida', 0.1, 0.1, 11.1, 0.2, [200,"vaso","vasos"], '', 'N', {"ml":1,"sug":9.6,"fdc":173933});
D("u_zumo_pina", "Zumo de piña", 'bebida', 0.4, 0.1, 12.7, 0.2, [200,"vaso","vasos"], '', 'N', {"ml":1,"sug":10,"fdc":169947});
D("u_zumo_uva", "Zumo de uva", 'bebida', 0.4, 0.1, 14.6, 0.2, [200,"vaso","vasos"], '', 'N', {"ml":1,"sug":14.2,"fdc":173042});
D("u_zumo_tomate", "Zumo de tomate", 'bebida', 0.9, 0.3, 3.1, 0.4, [200,"vaso","vasos"], '', 'N', {"ml":1,"sug":2.6,"fdc":170545});
D("u_agua_coco", "Agua de coco", 'bebida', 0.7, 0.2, 2.6, 1.1, [250,"vaso","vasos"], '', 'N', {"ml":1,"sug":2.6,"fdc":170174});
D("u_almendras_tostadas", "Almendras tostadas", 'grasa', 21, 52.5, 10.1, 10.9, [30,"puñado","puñados"], '', 'N', {"sug":4.9,"fdc":170158});
D("u_avellanas_tostadas", "Avellanas tostadas", 'grasa', 15, 62.4, 8.2, 9.4, [30,"puñado","puñados"], '', 'N', {"sug":4.9,"fdc":170583});
D("u_anacardos_tostados", "Anacardos tostados", 'grasa', 15.3, 46.4, 29.7, 3, [30,"puñado","puñados"], '', 'N', {"sug":5,"fdc":170571});
D("u_pistachos_tostados", "Pistachos tostados", 'grasa', 21.1, 45.8, 18, 10.3, [30,"puñado","puñados"], '', 'N', {"sug":7.7,"fdc":170185});
D("u_nueces_pecanas", "Nueces pecanas", 'grasa', 9.2, 72, 4.3, 9.6, [30,"puñado","puñados"], '', 'N', {"sug":4,"fdc":170182});
D("u_nueces_brasil", "Nueces de Brasil", 'grasa', 14.3, 67.1, 4.2, 7.5, [15,"ración","raciones"], '', 'N', {"sug":2.3,"fdc":170569});
D("u_pinones", "Piñones", 'grasa', 13.7, 68.4, 9.4, 3.7, [15,"cucharada","cucharadas"], '', 'N', {"sug":3.6,"fdc":170591});
D("u_castanas", "Castañas asadas", 'hc', 3.2, 2.2, 47.9, 5.1, [50,"ración","raciones"], '', 'N', {"sug":10.6,"fdc":170190});
D("u_cacahuetes_crudos", "Cacahuetes crudos", 'grasa', 25.8, 49.2, 7.6, 8.5, [30,"puñado","puñados"], '', 'N', {"sug":4.7,"fdc":172430});
D("u_sesamo", "Semillas de sésamo", 'grasa', 17.7, 49.7, 11.6, 11.8, [10,"cucharada","cucharadas"], '', 'N', {"sug":0.3,"fdc":170150});
D("u_semillas_canamo", "Semillas de cáñamo peladas", 'grasa', 31.6, 48.8, 4.7, 4, [30,"ración","raciones"], '', 'N', {"sug":1.5,"fdc":170148});
D("u_pipas_girasol_tostadas", "Pipas de girasol tostadas (peladas)", 'grasa', 19.3, 49.8, 13, 11.1, [30,"puñado","puñados"], '', 'N', {"sug":2.7,"fdc":170563});
D("u_crema_cacahuete_usda", "Crema de cacahuete (con azúcar y sal)", 'grasa', 22.2, 51.4, 17.3, 5, [15,"cucharada","cucharadas"], '', 'N', {"sug":10.5,"fdc":174266});
D("u_aceite_coco", "Aceite de coco", 'grasa', 0, 99.1, 0, 0, [10,"cucharada","cucharadas"], '', 'N', {"sug":0,"fdc":171412});
D("u_aceite_lino", "Aceite de lino", 'grasa', 0.1, 100, 0, 0, [10,"cucharada","cucharadas"], '', 'N', {"sug":0,"fdc":167702});
D("u_manteca_cerdo", "Manteca de cerdo", 'grasa', 0, 100, 0, 0, [10,"cucharada","cucharadas"], '', 'M', {"sug":0,"fdc":171401});
D("u_margarina", "Margarina", 'grasa', 0.2, 80.7, 0.7, 0, [10,"cucharadita","cucharaditas"], '', 'N', {"sug":0,"fdc":173585});
D("u_margarina_light", "Margarina ligera", 'grasa', 2, 35, 2, 0, [10,"cucharadita","cucharaditas"], '', 'N', {"sug":0,"fdc":173586});
D("u_chocolate_blanco", "Chocolate blanco", 'grasa', 5.9, 32.1, 59, 0.2, [20,"onza","onzas"], '', 'VL', {"sug":59,"fdc":167571});
D("u_chocolate_70", "Chocolate negro 70-85 %", 'grasa', 7.8, 42.6, 35, 10.9, [20,"onza","onzas"], '', 'V', {"sug":24,"fdc":170273});
D("u_cacao_puro", "Cacao puro en polvo", 'hc', 19.6, 13.7, 20.9, 37, [10,"cucharada","cucharadas"], '', 'N', {"sug":1.8,"fdc":169593});
D("u_azucar_moreno", "Azúcar moreno", 'hc', 0.1, 0, 98.1, 0, [5,"cucharadita","cucharaditas"], '', 'N', {"sug":97,"fdc":168833});
D("u_sirope_agave", "Sirope de agave", 'hc', 0.1, 0.5, 76.2, 0.2, [10,"cucharada","cucharadas"], '', 'N', {"sug":68,"fdc":170277});
D("u_mermelada_usda", "Mermelada (fresa, albaricoque…)", 'hc', 0.4, 0.1, 67.8, 1.1, [15,"cucharada","cucharadas"], '', 'N', {"sug":48.5,"fdc":169641});
D("u_salsa_tomate", "Salsa de tomate (pasta)", 'verdura', 1.4, 1.6, 5.6, 1.8, [60,"ración","raciones"], '', 'N', {"sug":4.9,"fdc":171192});
D("u_vinagre", "Vinagre", 'bebida', 0, 0, 0, 0, [10,"cucharada","cucharadas"], '', 'N', {"sug":0,"fdc":172237});
D("u_vinagre_balsamico", "Vinagre balsámico", 'bebida', 0.5, 0, 17, 0, [10,"cucharada","cucharadas"], '', 'N', {"sug":15,"fdc":172241});
D("u_salsa_pesto", "Salsa pesto", 'grasa', 9.8, 37.6, 8.3, 1.8, [30,"ración","raciones"], '', 'VL', {"sug":6.3,"fdc":171579});
D("u_tomate_frito_usda", "Tomate frito / salsa de tomate", 'verdura', 1.2, 0.3, 3.8, 1.5, [60,"ración","raciones"], '', 'N', {"sug":3.6,"fdc":170054});
D("u_caldo_verduras", "Caldo de verduras", 'bebida', 0.2, 0.1, 0.9, 0, [250,"tazón","tazones"], '', 'N', {"ml":1,"sug":0.6,"fdc":171583});
D("u_caldo_carne", "Caldo de carne", 'bebida', 1.1, 0.2, 0, 0, [250,"tazón","tazones"], '', 'M', {"ml":1,"sug":0,"fdc":171538});
D("u_gelatina_azucar", "Gelatina de sabores", 'hc', 1.2, 0, 14.2, 0, [120,"tarrina","tarrinas"], '', 'N', {"sug":13.5,"fdc":169596});
D("u_natillas_usda", "Pudin de vainilla", 'lacteo', 1.5, 3.8, 22.6, 0, [125,"tarrina","tarrinas"], '', 'VL', {"sug":17,"fdc":169608});
D("u_croissant_usda", "Cruasán de mantequilla", 'hc', 8.2, 21, 43.2, 2.6, [57,"cruasán","cruasanes"], '', 'VGL', {"sug":11.3,"fdc":174987});
D("u_muffin", "Muffin de arándanos", 'hc', 4.5, 16.1, 51.9, 1.1, [110,"muffin","muffins"], '', 'VGL', {"sug":31.5,"fdc":172765});
D("u_tortitas_pancake_usda", "Tortitas americanas (hechas)", 'hc', 6.4, 9.7, 28.3, 0, [40,"tortita","tortitas"], '', 'VGL', {"fdc":175009});
D("u_bebida_cafe_solo", "Café solo (espresso)", 'bebida', 0.1, 0.2, 1.7, 0, [30,"taza","tazas"], '', 'N', {"ml":1,"sug":0,"fdc":171891});
D("u_bebida_te", "Té (preparado)", 'bebida', 0, 0, 0.3, 0, [250,"taza","tazas"], '', 'N', {"ml":1,"sug":0,"fdc":173227});
D("u_taco_ternera", "Taco de ternera con queso (tortilla de maíz)", 'platos', 15.5, 13.9, 13.2, 2.1, [105,"taco","tacos"], '', 'ML', {"sug":0.3,"fdc":2708515});
D("u_taco_pollo", "Taco de pollo con queso (tortilla de maíz)", 'platos', 16.2, 9.6, 13.2, 2.1, [105,"taco","tacos"], '', 'ML', {"sug":0.3,"fdc":2708519});
D("u_taco_cerdo", "Taco de cerdo con queso (tortilla de maíz)", 'platos', 14.8, 14.5, 13.2, 2.1, [105,"taco","tacos"], '', 'ML', {"sug":0.3,"fdc":2708517});
D("u_taco_pescado", "Taco de pescado", 'platos', 11.6, 15.3, 20.5, 2.5, [100,"taco","tacos"], '', 'P', {"sug":0.4,"fdc":2708529});
D("u_taco_trigo_ternera", "Taco de ternera con queso (tortilla de trigo)", 'platos', 16.7, 12.3, 17.6, 1.3, [105,"taco","tacos"], '', 'MGL', {"sug":1.5,"fdc":2708522});
D("u_taco_frijoles", "Taco de frijoles con queso", 'platos', 5.8, 7.3, 18.8, 4.2, [105,"taco","tacos"], '', 'VL', {"sug":0.6,"fdc":2708521});
D("u_burrito_ternera_arroz_frijoles", "Burrito de ternera con arroz y frijoles", 'platos', 10.8, 8.3, 24.1, 2, [220,"burrito","burritos"], '', 'MGL', {"sug":1.6,"fdc":2708538});
D("u_burrito_pollo_arroz_frijoles", "Burrito de pollo con arroz y frijoles", 'platos', 11.1, 6.5, 24.1, 2, [220,"burrito","burritos"], '', 'MGL', {"sug":1.6,"fdc":2708546});
D("u_burrito_frijoles_queso", "Burrito de frijoles con queso", 'platos', 8.1, 5.2, 24.6, 4.9, [190,"burrito","burritos"], '', 'VGL', {"sug":1.7,"fdc":2708548});
D("u_burrito_bowl_pollo", "Burrito bowl de pollo con arroz y frijoles", 'platos', 13, 5.4, 9.6, 1, [315,"bol","boles"], '', 'ML', {"sug":0.2,"fdc":2708563});
D("u_burrito_bowl_ternera", "Burrito bowl de ternera con arroz y frijoles", 'platos', 12.5, 8.5, 9.6, 1, [315,"bol","boles"], '', 'ML', {"sug":0.2,"fdc":2708559});
D("u_burrito_huevo", "Burrito de huevo (desayuno)", 'platos', 10.9, 13.7, 18.7, 1.4, [180,"burrito","burritos"], '', 'VG', {"sug":1.8,"fdc":2707343});
D("u_enchilada_pollo", "Enchilada de pollo", 'platos', 10, 9, 12.3, 2.3, [150,"enchilada","enchiladas"], '', 'ML', {"sug":0.8,"fdc":2708568});
D("u_enchilada_ternera", "Enchilada de ternera", 'platos', 9.8, 10.5, 12.3, 2.3, [150,"enchilada","enchiladas"], '', 'ML', {"sug":0.8,"fdc":2708566});
D("u_enchilada_queso", "Enchilada de queso (sin carne)", 'platos', 6.4, 8.2, 14.2, 3.1, [150,"enchilada","enchiladas"], '', 'VL', {"sug":0.9,"fdc":2708569});
D("u_quesadilla_queso", "Quesadilla de queso", 'platos', 13.4, 16.2, 26.6, 2, [60,"quesadilla","quesadillas"], '', 'VGL', {"sug":2.4,"fdc":2708591});
D("u_quesadilla_pollo", "Quesadilla de pollo", 'platos', 14.5, 13, 25.4, 1.9, [70,"quesadilla","quesadillas"], '', 'MGL', {"sug":2.2,"fdc":2708593});
D("u_quesadilla_carne", "Quesadilla de carne", 'platos', 14.1, 15.1, 25.4, 1.9, [70,"quesadilla","quesadillas"], '', 'MGL', {"sug":2.2,"fdc":2708592});
D("u_fajita_ternera", "Fajita de ternera", 'platos', 12.1, 12.2, 16.5, 1.5, [95,"fajita","fajitas"], '', 'MG', {"sug":2.4,"fdc":2708605});
D("u_fajita_gambas", "Fajita de gambas", 'platos', 8.3, 8.9, 16.9, 1.5, [95,"fajita","fajitas"], '', 'PG', {"sug":2.4,"fdc":2708606});
D("u_fajita_verduras", "Fajita de verduras", 'platos', 3.2, 7.8, 18.4, 2, [95,"fajita","fajitas"], '', 'NG', {"sug":3.7,"fdc":2708607});
D("u_tamal_cerdo", "Tamal de cerdo", 'platos', 7.4, 9, 13.4, 2.4, [140,"tamal","tamales"], '', 'M', {"sug":0.5,"fdc":2708572});
D("u_tamal_pollo", "Tamal de pollo", 'platos', 7.4, 9, 13.4, 2.4, [140,"tamal","tamales"], '', 'M', {"sug":0.5,"fdc":2708573});
D("u_tamal_dulce", "Tamal dulce", 'platos', 2.2, 12.6, 33.3, 2.3, [70,"tamal","tamales"], '', 'V', {"sug":15.4,"fdc":2708038});
D("u_pupusa_queso", "Pupusa de queso", 'platos', 11.7, 13.3, 19.5, 2.9, [100,"pupusa","pupusas"], '', 'VL', {"sug":1.2,"fdc":2708608});
D("u_pupusa_frijoles", "Pupusa de frijoles", 'platos', 5.6, 9, 25.7, 5.8, [130,"pupusa","pupusas"], '', 'V', {"sug":1.3,"fdc":2708609});
D("u_pupusa_carne", "Pupusa revuelta (con carne)", 'platos', 11.5, 10.4, 20.4, 2.6, [130,"pupusa","pupusas"], '', 'ML', {"sug":1.5,"fdc":2708610});
D("u_gordita_carne", "Gordita de carne", 'platos', 17, 19.4, 12.1, 1, [175,"gordita","gorditas"], '', 'ML', {"sug":0.3,"fdc":2708585});
D("u_nachos_carne_frijoles", "Nachos con carne y frijoles", 'platos', 9.3, 12.5, 16.3, 2, [125,"ración","raciones"], '', 'ML', {"sug":0.4,"fdc":2708579});
D("u_nachos_pollo", "Nachos con pollo", 'platos', 11.2, 13.3, 18.5, 1.4, [125,"ración","raciones"], '', 'ML', {"sug":0.3,"fdc":2708580});
D("u_ensalada_taco", "Ensalada de taco con carne", 'platos', 7.5, 9.3, 13.6, 2.9, [225,"plato","platos"], '', 'ML', {"sug":1.8,"fdc":2708508});
D("u_chilaquiles", "Chilaquiles", 'platos', 10.6, 10.7, 12.8, 2.1, [170,"plato","platos"], '', 'VL', {"sug":1.1,"fdc":2708505});
D("u_huevos_rancheros", "Huevos rancheros", 'platos', 6.7, 6.7, 7.2, 1.7, [236,"plato","platos"], '', 'V', {"sug":2.3,"fdc":2707191});
D("u_pollo_mole", "Pollo con mole", 'platos', 19, 5.6, 2.9, 0.3, [244,"ración","raciones"], '', 'M', {"sug":2.1,"fdc":2706439});
D("u_pollo_guisado_mexicano", "Pollo guisado en salsa de tomate (estilo mexicano)", 'platos', 12, 7.1, 2.1, 0.4, [244,"ración","raciones"], '', 'M', {"sug":1,"fdc":2706424});
D("u_picadillo_mexicano", "Picadillo de carne con patatas (estilo mexicano)", 'platos', 10.4, 7.9, 4.8, 0.8, [166,"ración","raciones"], '', 'M', {"sug":0.7,"fdc":2706479});
D("u_carnitas", "Carnitas de cerdo", 'prot', 24.6, 18.3, 0, 0, [135,"ración","raciones"], '', 'M', {"sug":0,"fdc":2705864});
D("u_pozole", "Pozole", 'platos', 3.4, 1.2, 3.7, 0.9, [245,"plato","platos"], '', 'M', {"sug":1,"fdc":2707129});
D("u_caldo_res", "Caldo de res", 'platos', 5.9, 3.4, 3.2, 0.8, [245,"plato","platos"], '', 'M', {"sug":1.1,"fdc":2707128});
D("u_caldo_pollo_latino", "Caldo de pollo (sopa latina)", 'platos', 6.2, 1.6, 3.2, 0.8, [245,"plato","platos"], '', 'M', {"sug":1.1,"fdc":2707135});
D("u_frijoles_refritos", "Frijoles refritos", 'legum', 5, 2, 9.9, 3.7, [130,"ración","raciones"], '', 'N', {"sug":0.5,"fdc":2707396});
D("u_frijoles_negros", "Frijoles negros guisados", 'legum', 8.2, 7, 13.9, 8.1, [92,"ración","raciones"], '', 'N', {"sug":0.3,"fdc":2707360});
D("u_arroz_frijoles_negros", "Arroz con frijoles negros (gallo pinto / moros)", 'platos', 6, 4.3, 19.4, 5, [170,"plato","platos"], '', 'N', {"sug":0.2,"fdc":2708994});
D("u_arroz_mexicano", "Arroz rojo a la mexicana", 'hc', 2.9, 2.6, 18.5, 1.1, [182,"ración","raciones"], '', 'N', {"sug":1.6,"fdc":2709085});
D("u_guacamole_tomate", "Guacamole con tomate", 'grasa', 1.9, 13.1, 2, 6.1, [60,"ración","raciones"], '', 'N', {"sug":0.9,"fdc":2709308});
D("u_pico_de_gallo", "Pico de gallo", 'verdura', 0.7, 0.1, 2.6, 1.1, [32,"ración","raciones"], '', 'N', {"sug":2.1,"fdc":2709737});
D("u_salsa_mole", "Salsa mole", 'grasa', 1, 3.8, 9.8, 1, [32,"ración","raciones"], '', 'N', {"sug":7.1,"fdc":2707151});
D("u_bolillo", "Bolillo (pan mexicano)", 'hc', 10.7, 5.8, 53.6, 2.2, [117,"bolillo","bolillos"], '', 'NG', {"sug":3.6,"fdc":2707664});
D("u_horchata", "Horchata (con agua)", 'bebida', 1.1, 0.1, 20, 0.5, [248,"vaso","vasos"], '', 'N', {"ml":1,"sug":8.1,"fdc":2710602});
D("u_horchata_leche", "Horchata con leche", 'bebida', 1.4, 0.6, 19.3, 0.4, [248,"vaso","vasos"], '', 'VL', {"ml":1,"sug":9.6,"fdc":2710603});
D("u_dulce_de_leche", "Dulce de leche", 'hc', 6.8, 7.4, 55.4, 0, [20,"cucharada","cucharadas"], '', 'VL', {"sug":49.7,"fdc":2705699});
D("u_flan_casero", "Flan casero", 'lacteo', 5.2, 4.9, 28.2, 0, [130,"flan","flanes"], '', 'VL', {"sug":28.1,"fdc":2705683});
D("u_empanada_carne", "Empanada de carne", 'platos', 12.1, 19.2, 25.9, 1.6, [105,"empanada","empanadas"], '', 'MG', {"sug":2.1,"fdc":2708711});
D("u_empanada_pollo", "Empanada de pollo", 'platos', 12.6, 16.5, 25.9, 1.6, [105,"empanada","empanadas"], '', 'MG', {"sug":2.1,"fdc":2708713});
D("u_empanada_queso", "Empanada de queso o verdura", 'platos', 5.8, 13.2, 28.1, 3.4, [100,"empanada","empanadas"], '', 'VGL', {"sug":2.6,"fdc":2708710});
D("u_empanada_fruta", "Empanada dulce de fruta", 'hc', 2.7, 11.5, 35.2, 1.8, [75,"empanada","empanadas"], '', 'VG', {"sug":15.4,"fdc":2708057});
D("u_arepa", "Arepa", 'hc', 5.7, 14, 28.1, 2.4, [115,"arepa","arepas"], '', 'V', {"sug":3.3,"fdc":2707828});
D("u_ceviche_usda", "Ceviche de pescado", 'platos', 10.5, 0.8, 3.1, 0.5, [125,"plato","platos"], '', 'P', {"sug":1.3,"fdc":2706463});
D("u_sandwich_cubano", "Sándwich cubano", 'platos', 15.9, 10.7, 15.5, 0.8, [190,"sándwich","sándwiches"], '', 'MGL', {"sug":2.5,"fdc":2706973});
D("u_pan_cubano", "Pan cubano", 'hc', 10.8, 2.4, 49.7, 2.2, [20,"trozo","trozos"], '', 'NG', {"sug":4.6,"fdc":2707604});
D("u_cafe_cubano", "Café cubano", 'bebida', 0.1, 0.2, 7.8, 0, [60,"taza","tazas"], '', 'N', {"ml":1,"sug":6.3,"fdc":2710381});
D("u_platano_frito", "Plátano macho frito (tostones / maduros)", 'hc', 1.3, 3.2, 29.3, 1.6, [85,"ración","raciones"], '', 'N', {"sug":17,"fdc":2709559});
D("u_platano_cocido", "Plátano macho cocido", 'hc', 1.3, 0.4, 30.1, 1.7, [100,"ración","raciones"], '', 'N', {"sug":17.5,"fdc":2709558});
D("u_chips_platano", "Chips de plátano (mariquitas)", 'hc', 2.3, 29.6, 60.3, 3.5, [38,"bolsa","bolsas"], '', 'N', {"sug":0.9,"fdc":2709563});
D("u_yuca_cocida", "Yuca cocida", 'hc', 1.4, 3, 37.7, 1.9, [80,"ración","raciones"], '', 'N', {"sug":1.8,"fdc":2709564});
D("u_yuca_frita", "Yuca frita", 'hc', 1.2, 13.9, 33.1, 1.6, [70,"ración","raciones"], '', 'N', {"sug":1.6,"fdc":2709565});
D("u_casabe", "Casabe (pan de yuca)", 'hc', 2.5, 0.5, 67.8, 3.4, [100,"torta","tortas"], '', 'N', {"sug":3.2,"fdc":2709566});
D("u_mofongo_chicharron", "Mofongo (plátano verde con chicharrón)", 'platos', 13.2, 22.8, 25.6, 1.4, [100,"ración","raciones"], '', 'M', {"sug":14.8,"fdc":2710139});
D("u_pastelon", "Pastelón de plátano maduro y carne", 'platos', 12.8, 20.2, 19.9, 2.1, [190,"ración","raciones"], '', 'M', {"sug":11.4,"fdc":2710140});
D("u_pasteles_pr", "Pasteles puertorriqueños", 'platos', 7.1, 13.2, 15.2, 2.2, [149,"pastel","pasteles"], '', 'M', {"sug":5.6,"fdc":2710141});
D("u_hallacas", "Hallacas", 'platos', 5.8, 10.8, 8.3, 1.1, [95,"hallaca","hallacas"], '', 'M', {"sug":3.4,"fdc":2708718});
D("u_papa_rellena", "Papa rellena", 'platos', 4.9, 11.3, 14.3, 1.9, [95,"papa","papas"], '', 'M', {"sug":0.9,"fdc":2710138});
D("u_arroz_pollo_caldoso", "Asopao de pollo (arroz caldoso)", 'platos', 12.1, 4, 15.1, 1.4, [329,"plato","platos"], '', 'M', {"sug":1.2,"fdc":2708974});
D("u_arroz_habichuelas", "Arroz con habichuelas guisadas", 'platos', 3.7, 3.2, 21.5, 1.5, [141,"plato","platos"], '', 'N', {"sug":0.1,"fdc":2708980});
D("u_arroz_con_salchichas", "Arroz con chorizo (estilo caribeño)", 'platos', 8.4, 13.6, 31.6, 0.8, [112,"plato","platos"], '', 'M', {"sug":0.4,"fdc":2708979});
D("u_arroz_blanco_caribe", "Arroz blanco con aceite (estilo caribeño)", 'hc', 2.8, 6.3, 31.4, 0.5, [116,"ración","raciones"], '', 'N', {"sug":0.1,"fdc":2708432});
D("u_ternera_guisada_patatas", "Carne guisada con papas", 'platos', 14.6, 14.9, 5.5, 1, [159,"plato","platos"], '', 'M', {"sug":0.9,"fdc":2706503});
D("u_cerdo_guisado_latino", "Cerdo guisado (estilo caribeño)", 'platos', 17.9, 12.7, 2.2, 0.6, [150,"ración","raciones"], '', 'M', {"sug":1.3,"fdc":2706412});
D("u_fricase_pollo", "Fricasé de pollo", 'platos', 14, 13.1, 1.8, 0.7, [223,"ración","raciones"], '', 'M', {"sug":1.2,"fdc":2706822});
D("u_albondigas_latinas", "Albóndigas guisadas (estilo caribeño)", 'platos', 14.3, 15.3, 6.1, 0.8, [150,"ración","raciones"], '', 'M', {"sug":1.7,"fdc":2706395});
D("u_bistec_encebollado", "Bistec encebollado", 'platos', 20.9, 24.1, 3.2, 0.7, [134,"ración","raciones"], '', 'M', {"sug":1.6,"fdc":2706754});
D("u_gambas_ajillo_latinas", "Camarones al ajillo", 'platos', 11.6, 25, 2.3, 0.2, [106,"ración","raciones"], '', 'P', {"sug":0.5,"fdc":2706465});
D("u_ensalada_bacalao", "Ensalada de bacalao (serenata)", 'platos', 6.6, 15.9, 2.1, 0.7, [72,"plato","platos"], '', 'P', {"sug":1.5,"fdc":2706871});
D("u_ensalada_pulpo", "Ensalada de pulpo", 'platos', 9.7, 12, 4.6, 1, [90,"plato","platos"], '', 'P', {"sug":2.1,"fdc":2706870});
D("u_bacalao_viandas", "Bacalao con viandas (papa, yuca, plátano)", 'platos', 3.5, 5.4, 15.8, 2.7, [86,"plato","platos"], '', 'P', {"sug":2.9,"fdc":2706719});
D("u_pimiento_relleno", "Pimiento relleno de carne", 'platos', 8.9, 5.8, 13.9, 1.7, [250,"pimiento","pimientos"], '', 'M', {"sug":3.5,"fdc":2706633});
D("u_repollo_relleno", "Repollo relleno de carne y arroz", 'platos', 3.1, 3, 9.3, 1.8, [220,"ración","raciones"], '', 'M', {"sug":2.3,"fdc":2710143});
D("u_paella_marisco_usda", "Paella de marisco", 'platos', 8, 4.8, 15.7, 0.7, [300,"plato","platos"], '', 'P', {"sug":0.9,"fdc":2706711});
D("u_paella_usda", "Paella (receta media)", 'platos', 9.5, 7.2, 15.2, 0.6, [300,"plato","platos"], '', 'MP', {"sug":0.7,"fdc":2706723});
D("u_gazpacho_usda", "Gazpacho (receta tradicional)", 'platos', 0.8, 0.6, 3.5, 1, [245,"vaso","vasos"], '', 'N', {"sug":2.8,"fdc":2710106});
D("u_chorizo_usda", "Chorizo (curado)", 'prot', 19.3, 28.1, 2.6, 0, [30,"ración","raciones"], '', 'M', {"sug":0,"fdc":2706179});
D("u_pan_espanol_cafe", "Pan de leche / bollo de café", 'hc', 7.9, 9.1, 56.9, 1.9, [85,"bollo","bollos"], '', 'VGL', {"sug":12.1,"fdc":2707683});
D("u_pulled_pork_salsa", "Pulled pork (cerdo desmigado) con salsa barbacoa", 'prot', 17.6, 11.3, 11.9, 0.3, [180,"ración","raciones"], '', 'M', {"sug":10,"fdc":2706399});
D("u_pulled_pork", "Pulled pork (cerdo desmigado) sin salsa", 'prot', 24.8, 15.9, 0, 0, [85,"ración","raciones"], '', 'M', {"sug":0,"fdc":2706400});
D("u_pulled_pork_bocadillo", "Bocadillo de pulled pork con salsa barbacoa", 'platos', 15, 8.8, 24.1, 0.8, [180,"bocadillo","bocadillos"], '', 'MG', {"sug":9.1,"fdc":2706975});
D("u_ternera_barbacoa", "Ternera desmigada a la barbacoa (pulled beef)", 'prot', 19.8, 10.8, 11.9, 0.3, [180,"ración","raciones"], '', 'M', {"sug":10,"fdc":2706390});
D("u_pollo_barbacoa", "Pollo a la barbacoa", 'prot', 19, 4.6, 11.9, 0.3, [180,"ración","raciones"], '', 'M', {"sug":10,"fdc":2706434});
D("u_costilla_barbacoa_bocadillo", "Bocadillo de costilla a la barbacoa", 'platos', 13.7, 6.5, 25.6, 0.9, [190,"bocadillo","bocadillos"], '', 'MG', {"sug":9.1,"fdc":2706974});
D("u_co_almojabana", "Almojábana (bogotana, horneada)", 'hc', 13, 12.3, 30.6, 0, [60,"almojábana","almojábanas"], '', 'VL', {"icbf":"A002","kcal":285});
D("u_co_almojabana_valle", "Almojábana vallecaucana (horneada)", 'hc', 17.5, 14.7, 34.6, 0, [60,"almojábana","almojábanas"], '', 'VL', {"icbf":"A003","kcal":341});
D("u_co_pandebono", "Pandebono (horneado)", 'hc', 15.8, 10.1, 50.7, 0, [50,"pandebono","pandebonos"], '', 'VL', {"icbf":"A070","kcal":357});
D("u_co_pandeyuca", "Pandeyuca / pan de yuca colombiano (horneado)", 'hc', 15.8, 12.2, 45.5, 0, [50,"pandeyuca","pandeyucas"], '', 'VL', {"icbf":"A067","kcal":355});
D("u_co_pan_queso", "Pan de queso (horneado)", 'hc', 10.4, 20.8, 31.4, 2.1, [50,"pan","panes"], '', 'VGL', {"icbf":"A065","kcal":367});
D("u_co_arepa_queso", "Arepa de maíz con queso, asada (colombiana)", 'hc', 4.8, 8.4, 29, 0, [120,"arepa","arepas"], '', 'VL', {"icbf":"A007","kcal":211});
D("u_co_arepa_asada", "Arepa de maíz asada (colombiana)", 'hc', 4.1, 0, 36.3, 0, [100,"arepa","arepas"], '', 'N', {"icbf":"A006","kcal":162});
D("u_co_envuelto_mazorca", "Envuelto de mazorca", 'hc', 4.8, 7.9, 22.7, 0.8, [120,"envuelto","envueltos"], '', 'VL', {"icbf":"A019","kcal":186});
D("u_co_bollo_limpio", "Bollo limpio (de maíz)", 'hc', 3.3, 4.8, 26.7, 2.4, [150,"bollo","bollos"], '', 'N', {"icbf":"S005","kcal":178});
D("u_co_salchipapa", "Salchipapa (papas fritas con salchicha, sin salsas)", 'platos', 6.9, 17.2, 25, 2.5, [300,"ración","raciones"], '', 'M', {"icbf":"receta: 2/3 B069 papa frita a la francesa + 1/3 F125 salchicha de cerdo y res","kcal":297});
D("u_co_carimanola", "Carimañola de queso", 'platos', 5.8, 17.4, 28.6, 0, [80,"carimañola","carimañolas"], '', 'VL', {"icbf":"S006","kcal":295});
D("u_co_empanada_pipian", "Empanada de pipián (frita)", 'platos', 4.7, 26.3, 33.5, 1.1, [60,"empanada","empanadas"], '', 'V', {"icbf":"S011","kcal":396});
D("u_co_ajiaco", "Ajiaco santafereño", 'platos', 6.4, 0.8, 9.1, 2.2, [450,"plato","platos"], '', 'M', {"icbf":"S001","kcal":82});
D("u_co_bandeja_paisa", "Bandeja paisa", 'platos', 11.7, 11, 13, 2.3, [700,"plato","platos"], '', 'M', {"icbf":"S004","kcal":212});
D("u_co_arroz_atollado", "Arroz atollado", 'platos', 10.1, 4.3, 7.5, 1.7, [350,"plato","platos"], '', 'M', {"icbf":"S002","kcal":119});
D("u_co_arroz_clavado", "Arroz clavado", 'platos', 6.4, 5.5, 25.9, 0.5, [300,"plato","platos"], '', 'L', {"icbf":"S003","kcal":182});
D("u_co_lechona", "Lechona tolimense", 'platos', 21.8, 12, 7.3, 2.9, [350,"ración","raciones"], '', 'M', {"icbf":"S018","kcal":242});
D("u_co_tamal_tolimense", "Tamal tolimense", 'platos', 5.7, 3.8, 12.7, 4, [400,"tamal","tamales"], '', 'M', {"icbf":"S032","kcal":132});
D("u_co_sancocho_gallina", "Sancocho valluno de gallina", 'platos', 16.4, 4, 2.9, 1.3, [500,"plato","platos"], '', 'M', {"icbf":"S025","kcal":121});
D("u_co_sancocho_bagre", "Sancocho de bagre", 'platos', 16.9, 6.3, 0.1, 1.5, [500,"plato","platos"], '', 'P', {"icbf":"S024","kcal":134});
D("u_co_mote_queso", "Mote de queso", 'platos', 5.4, 3.9, 8, 2.2, [400,"plato","platos"], '', 'VL', {"icbf":"S020","kcal":102});
D("u_co_mute", "Mute santandereano", 'platos', 8.1, 6.1, 3.5, 1.9, [450,"plato","platos"], '', 'M', {"icbf":"S021","kcal":113});
D("u_co_mazamorra_chiquita", "Mazamorra chiquita", 'platos', 9.8, 5, 3.1, 3, [400,"plato","platos"], '', 'M', {"icbf":"S019","kcal":115});
D("u_co_cuy_asado", "Cuy asado", 'platos', 24.4, 7.8, 13.7, 1.1, [250,"ración","raciones"], '', 'M', {"icbf":"S010","kcal":229});
D("u_co_friche", "Friche de chivo", 'platos', 29.7, 12.9, 0.8, 0.8, [250,"ración","raciones"], '', 'M', {"icbf":"S015","kcal":243});
D("u_co_viudo_bocachico", "Viudo de bocachico", 'platos', 13.2, 4.1, 6.7, 1.1, [450,"plato","platos"], '', 'P', {"icbf":"S033","kcal":123});
// </usda>
// <marcas> (lo genera tools/marcas/off_embed.js · datos: Open Food Facts, licencia ODbL · 2026-10-21)
const BRAND_FOODS = [
    ["m_hacendado_spaghetti","Spaghetti","Hacendado",361,13,72,1.5,0,[80,"ración","raciones"],"🍝",0,1,"8480000063311",3.6],
    ["m_hacendado_spaghetti_integral","Spaghetti integral","Hacendado",345,13.5,62,2.4,10,[80,"ración","raciones"],"🍝",0,1,"8402001010200",3.7],
    ["m_hacendado_macarrones","Macarrones","Hacendado",361,13,72,1.5,3.5,[80,"ración","raciones"],"🍝",0,1,"8480000062505",3.6],
    ["m_hacendado_fideos","Fideos","Hacendado",361,13,72,1.5,3.5,[60,"ración","raciones"],"🍜",0,1,"8480000135773",3.6],
    ["m_hacendado_arroz_redondo","Arroz redondo","Hacendado",344,8.2,75,1,0,[80,"ración","raciones"],"🍚",0,1,"8480000050441",0.5],
    ["m_hacendado_arroz_basmati","Arroz basmati","Hacendado",355,9,78,0.6,0,[80,"ración","raciones"],"🍚",0,1,"8480000050021",0.5],
    ["m_hacendado_arroz_integral","Arroz integral","Hacendado",350,7.6,72,2.8,3.3,[80,"ración","raciones"],"🍚",0,1,"8480000051844",0.5],
    ["m_hacendado_quinoa","Quinoa","Hacendado",389,14,66.1,6.1,0,[60,"ración","raciones"],"🍚",0,1,"8480000094308",6.3],
    ["m_hacendado_tortitas_de_maiz","Tortitas de maíz","Hacendado",414,6.7,76,8.4,3.9,[7,"tortita","tortitas"],"🍘",0,0,"8402001039263",1.9],
    ["m_hacendado_tortillas_de_trigo_wraps","Tortillas de trigo (wraps)","Hacendado",294,8.4,50,5.8,4.2,[40,"tortilla","tortillas"],"🌯",0,0,"8480000808592",1.7],
    ["m_hacendado_tortillas_de_trigo_integ","Tortillas de trigo integrales","Hacendado",269,9.3,41,5.8,8.5,[40,"tortilla","tortillas"],"🌯",0,0,"8480000809421",2.1],
    ["m_hacendado_tortillas_de_avena","Tortillas de avena","Hacendado",287,15,40,6,5.4,[40,"tortilla","tortillas"],"🌯",0,0,"8480000805317",1.9],
    ["m_hacendado_pan_de_molde_100_integra","Pan de molde 100 % integral","Hacendado",248,8.7,41,3.8,7.5,[30,"rebanada","rebanadas"],"🍞",0,0,"8480000838865",2.5],
    ["m_hacendado_pan_de_molde_blanco","Pan de molde blanco","Hacendado",250,9,46,2.7,3,[30,"rebanada","rebanadas"],"🍞",0,0,"8480000838674",3],
    ["m_hacendado_pan_de_molde_35_avena","Pan de molde 35 % avena","Hacendado",265,13,35,6.8,6.1,[30,"rebanada","rebanadas"],"🍞",0,0,"8480000822956",1.7],
    ["m_hacendado_pan_tostado_integral","Pan tostado integral","Hacendado",388,17.7,61,5.7,10.9,[10,"tostada","tostadas"],"🍞",0,0,"8480000837899",2.9],
    ["m_hacendado_panecillos_integrales","Panecillos integrales","Hacendado",382,13.3,59.6,7.8,10.3,[50,"panecillo","panecillos"],"🍞",0,0,"8480000134455",4],
    ["m_hacendado_leche_desnatada","Leche desnatada","Hacendado",34,3.2,4.7,0.3,0,[250,"vaso","vasos"],"🥛",1,0,"8402001002120",4.7],
    ["m_hacendado_leche_semidesnatada","Leche semidesnatada","Hacendado",46,3.1,4.8,1.6,0,[250,"vaso","vasos"],"🥛",1,0,"8480000107947",4.8],
    ["m_hacendado_leche_sin_lactosa_semide","Leche sin lactosa semidesnatada","Hacendado",44,3,4.6,1.5,0,[250,"vaso","vasos"],"🥛",1,0,"8480000104830",4.6],
    ["m_hacendado_bebida_de_proteinas_fres","Bebida de proteínas fresa y plátano","Hacendado",48,7,4.2,0.4,0,[250,"botella","botellas"],"🥤",1,0,"8402001030383",3.9],
    ["m_hacendado_bebida_de_avena","Bebida de avena","Hacendado",35,0.7,4.7,1.4,0.5,[250,"vaso","vasos"],"🥛",1,0,"8402001014574",0],
    ["m_hacendado_queso_fresco_batido_0","Queso fresco batido 0 %","Hacendado",46,8,3.5,0.1,0,[100,"ración","raciones"],"🧀",0,0,"8480000510211",3.5],
    ["m_hacendado_queso_fresco_light","Queso fresco light","Hacendado",117,13,3.8,5.7,0,[50,"ración","raciones"],"🧀",0,0,"8480000511928",3.6],
    ["m_hacendado_queso_fresco_de_burgos","Queso fresco de Burgos","Hacendado",150,10.3,3.7,10.4,0,[50,"ración","raciones"],"🧀",0,0,"8480000524089",3.7],
    ["m_hacendado_requeson","Requesón","Hacendado",139,8.7,5.4,11.6,0,[50,"ración","raciones"],"🧀",0,0,"8413556010324",4.4],
    ["m_hacendado_queso_de_untar_light","Queso de untar light","Hacendado",130,9,4.8,8.3,0,[30,"cucharada","cucharadas"],"🧀",0,0,"8480000512239",4.8],
    ["m_hacendado_mozzarella","Mozzarella","Hacendado",202,17,2,14,0,[30,"ración","raciones"],"🧀",0,0,"8480000510501",0.9],
    ["m_hacendado_queso_rallado_para_fundi","Queso rallado para fundir","Hacendado",284,19,7,20,0,[20,"puñado","puñados"],"🧀",0,0,"8480000236227",0.5],
    ["m_hacendado_havarti_light_lonchas","Havarti light (lonchas)","Hacendado",267,27,1.6,17,0,[20,"loncha","lonchas"],"🧀",0,0,"8480000505460",1.2],
    ["m_hacendado_quesitos","Quesitos","Hacendado",192,11.8,3.9,14.3,0,[16,"quesito","quesitos"],"🧀",0,0,"8480000524058",3.9],
    ["m_hacendado_jamon_cocido_extra","Jamón cocido extra","Hacendado",101,18.6,0.9,2.5,0,[15,"loncha","lonchas"],"🥓",0,0,"8480000592491",0.9],
    ["m_hacendado_pechuga_de_pavo_finas_lo","Pechuga de pavo finas lonchas","Hacendado",78,17.8,0.6,0.5,0,[15,"loncha","lonchas"],"🦃",0,0,"8480000679727",0.6],
    ["m_hacendado_pechuga_de_pollo_en_lonc","Pechuga de pollo en lonchas","Hacendado",84,16.9,1.3,1.2,0,[15,"loncha","lonchas"],"🍗",0,0,"8480000561565",1.3],
    ["m_hacendado_tiras_de_pechuga_de_poll","Tiras de pechuga de pollo al horno","Hacendado",107,23.4,0.6,1.2,0,[140,"envase","envases"],"🍗",0,0,"8480000566614",0.6],
    ["m_hacendado_atun_claro_al_natural","Atún claro al natural","Hacendado",99,21,0.9,1.2,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8480000180186",0.5],
    ["m_hacendado_atun_claro_en_aceite_de_","Atún claro en aceite de oliva","Hacendado",363,18,0.5,32,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8480000180308",0.5],
    ["m_hacendado_atun_claro_en_aceite_de_2","Atún claro en aceite de girasol","Hacendado",252,21,0.9,18,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8480000180551",0.5],
    ["m_hacendado_caballa_en_aceite_de_oli","Caballa en aceite de oliva","Hacendado",224,26.7,0.6,12.2,0,[60,"lata","latas"],"🐟",0,0,"8480000183101",null],
    ["m_hacendado_sardinas_en_aceite_de_ol","Sardinas en aceite de oliva","Hacendado",289,20,0.7,23,0,[60,"lata","latas"],"🐟",0,0,"8480000182258",0.5],
    ["m_hacendado_salmon_ahumado","Salmón ahumado","Hacendado",171,22,0.5,9.1,0,[50,"ración","raciones"],"🐟",0,0,"8480000226129",0.5],
    ["m_hacendado_palitos_de_surimi","Palitos de surimi","Hacendado",90,7.9,12.4,0.8,0.9,[15,"palito","palitos"],"🦀",0,0,"8480000625021",3.5],
    ["m_hacendado_mejillones_en_escabeche","Mejillones en escabeche","Hacendado",158,18,6,7.1,0,[60,"lata","latas"],"🦪",0,0,"8480000186157",0.5],
    ["m_hacendado_hummus_de_garbanzos","Hummus de garbanzos","Hacendado",311,6,11.1,25.8,5.5,[30,"cucharada","cucharadas"],"🫘",0,0,"8480000808585",1],
    ["m_hacendado_lentejas_cocidas","Lentejas cocidas","Hacendado",89,8.2,10.7,0.4,0,[120,"ración","raciones"],"🫘",0,0,"8480000260307",0.5],
    ["m_hacendado_alubias_rojas_cocidas","Alubias rojas cocidas","Hacendado",89,6.3,11.5,0.4,0,[120,"ración","raciones"],"🫘",0,0,"8480000260000",0.9],
    ["m_hacendado_cacahuete_tostado_0_sal","Cacahuete tostado 0 % sal","Hacendado",618,24,13,50.4,8.2,[30,"puñado","puñados"],"🥜",0,0,"8480000340313",6.2],
    ["m_hacendado_almendra_natural","Almendra natural","Hacendado",619,22.8,6.9,54,10.6,[30,"puñado","puñados"],"🌰",0,0,"8480000235756",4.1],
    ["m_hacendado_anacardos","Anacardos","Hacendado",617,18,22,50,6.4,[30,"puñado","puñados"],"🌰",0,0,"8480000340276",6.4],
    ["m_hacendado_pistachos","Pistachos","Hacendado",607,25,11.5,49.6,7.4,[30,"puñado","puñados"],"🌰",0,0,"8480000342621",7.5],
    ["m_hacendado_aceite_de_oliva_virgen_e","Aceite de oliva virgen extra","Hacendado",822,0,0,91,0,[10,"cucharada","cucharadas"],"🫒",0,0,"8480000047403",0],
    ["m_hacendado_chocolate_negro_72","Chocolate negro 72 %","Hacendado",560,7,40,39,0,[10,"onza","onzas"],"🍫",0,0,"8410109114157",37],
    ["m_hacendado_miel","Miel","Hacendado",333,0.5,83,0,0,[15,"cucharada","cucharadas"],"🍯",0,0,"8480000154507",79],
    ["m_hacendado_tomate_frito","Tomate frito","Hacendado",77,1.5,9.5,3.5,0,[50,"ración","raciones"],"🍅",0,0,"8480000171511",6.9],
    ["m_hacendado_salsa_de_tomate_zero","Salsa de tomate zero","Hacendado",83,1.7,17.8,0,0,[50,"ración","raciones"],"🍅",0,0,"8402001007033",5.6],
    ["m_hacendado_salmorejo","Salmorejo","Hacendado",134,1.5,9.5,10,0,[250,"vaso","vasos"],"🍅",1,0,"8480000399014",2.1],
    ["m_hacendado_tortilla_de_patatas_con_","Tortilla de patatas con cebolla","Hacendado",193,5.7,17,11,0,[150,"ración","raciones"],"🍳",0,0,"8480000808950",1.4],
    ["m_hacendado_pizza_jamon_y_queso","Pizza jamón y queso","Hacendado",224,14,25.2,7.5,0,[175,"media pizza","medias pizzas"],"🍕",0,0,"8480000635815",1.6],
    ["m_hacendado_lasana_bolonesa","Lasaña boloñesa","Hacendado",143,7.4,14,6.1,1,[350,"envase","envases"],"🍝",0,0,"8480000044877",3.5],
    ["m_hacendado_patatas_fritas_clasicas","Patatas fritas clásicas","Hacendado",558,6.7,52,35,0,[30,"puñado","puñados"],"🥔",0,0,"8480000222459",0.5],
    ["m_hacendado_maiz_dulce","Maíz dulce","Hacendado",75,2.6,9.3,2.3,0,[75,"lata","latas"],"🌽",0,0,"8480000167149",4.7],
    ["m_hacendado_salchichas_tipo_frankfur","Salchichas tipo frankfurt","Hacendado",201,11.5,5.2,14.9,0,[44,"salchicha","salchichas"],"🌭",0,0,"8480000531414",0.5],
    ["m_hacendado_fuet","Fuet","Hacendado",421,27.5,1.4,34,0,[20,"ración","raciones"],"🥓",0,0,"8480000551085",1.4],
    ["m_hacendado_mantequilla","Mantequilla","Hacendado",734,0.5,0.8,81,0,[10,"cucharadita","cucharaditas"],"🧈",0,0,"8480000207272",0.8],
    ["m_hacendado_mayonesa","Mayonesa","Hacendado",599,0.6,2.4,65,0,[15,"cucharada","cucharadas"],"🥚",0,0,"8402001028649",1.3],
    ["m_hacendado_edamame","Edamame","Hacendado",145,12,3.3,7.6,7.5,[100,"ración","raciones"],"🫛",0,0,"8480000707406",2.8],
    ["m_hacendado_gelatina_0","Gelatina 0 %","Hacendado",9,1.6,0.7,0,0,[100,"tarrina","tarrinas"],"🍮",0,0,"8402001011856",0],
    ["m_hacendado_natillas_proteicas","Natillas proteicas","Hacendado",78,10,5,1.5,0,[125,"tarrina","tarrinas"],"🍮",0,0,"8402001025235",4],
    ["m_danone_skyr_natural","Skyr natural","Danone",58,10,3.9,0.2,0,[140,"tarrina","tarrinas"],"🥣",0,0,"3033491454080",3.9],
    ["m_activia_kefir_natural","Kéfir natural","Activia",59,3.3,4.1,3.3,0,[125,"vaso","vasos"],"🥛",0,0,"3033491993138",4.1],
    ["m_milbona_li_yogur_griego_natural","Yogur griego natural","Milbona (Lidl)",126,4.1,4.6,10,0.5,[125,"yogur","yogures"],"🥣",0,0,"4056489148739",4.1],
    ["m_milbona_li_yogur_griego_light","Yogur griego light","Milbona (Lidl)",68,7,9.2,0.2,0.2,[125,"yogur","yogures"],"🥣",0,0,"4056489518273",9.2],
    ["m_milbona_li_queso_cottage","Queso cottage","Milbona (Lidl)",98,11.5,2.8,4.5,0,[100,"ración","raciones"],"🧀",0,0,"20002183",2.8],
    ["m_milbona_li_pudding_proteico_vainill","Pudding proteico vainilla","Milbona (Lidl)",75,10,5.2,1.5,0.2,[200,"tarrina","tarrinas"],"🍮",0,0,"4056489216155",4],
    ["m_arla_pudding_proteico_chocola","Pudding proteico chocolate","Arla",77,10,6.6,1.5,0,[200,"tarrina","tarrinas"],"🍮",0,0,"4100290080389",4.4],
    ["m_prozis_crema_de_cacahuete_100","Crema de cacahuete 100 %","Prozis",626,26,13,51,6.8,[15,"cucharada","cucharadas"],"🥜",0,0,"5600826203613",5.2],
    ["m_myprotein_protein_pancakes_prepara","Protein Pancakes (preparado)","Myprotein",239,16.3,26.5,7.2,1.2,[50,"ración","raciones"],"🥞",0,0,"8721082164009",6.1],
    ["m_kaiku_gazpacho","Gazpacho","Kaiku",37,0.9,2.9,2.2,0,[250,"vaso","vasos"],"🍅",1,0,"8432425070900",1.9],
    ["m_myprotein_impact_whey_protein","Impact Whey Protein","Myprotein",379,72,8.9,5.9,0,[25,"cacito","cacitos"],"🥤",0,0,"5055534302941",5.1],
    ["m_myprotein_impact_whey_isolate","Impact Whey Isolate","Myprotein",360,83.3,4.7,0.8,0,[25,"cacito","cacitos"],"🥤",0,0,"5055534325834",1.7],
    ["m_myprotein_clear_whey_isolate","Clear Whey Isolate","Myprotein",331,76.9,8.1,0,0,[25,"cacito","cacitos"],"🥤",0,0,"5059883300740",2.7],
    ["m_optimum_nu_gold_standard_100_whey","Gold Standard 100 % Whey","Optimum Nutrition",377,80,5.7,4.3,0,[30,"cacito","cacitos"],"🥤",0,0,"5060469988535",3.3],
    ["m_prozis_100_real_whey_protein","100 % Real Whey Protein","Prozis",371,73,5.4,6.4,0,[30,"cacito","cacitos"],"🥤",0,0,"5600380897549",4.4],
    ["m_hsn_evowhey_protein","Evowhey Protein","HSN",367,78,6.2,3.3,0,[30,"cacito","cacitos"],"🥤",0,0,"5060326271602",6.1],
    ["m_quest_barrita_de_proteinas","Barrita de proteínas","Quest",322,35,12,11,0,[60,"barrita","barritas"],"🍫",0,0,"0888849004942",4],
    ["m_barebells_protein_bar","Protein Bar","Barebells",364,36,29,15,7,[55,"barrita","barritas"],"🍫",0,0,"7340001801101",2.2],
    ["m_danone_oikos_griego_natural","Oikos griego natural","Danone",128,4,6.1,9.7,0,[110,"yogur","yogures"],"🥣",0,0,"6194003804223",4.1],
    ["m_danone_yopro_natural","YoPro natural","Danone",60,8.4,5.4,0.5,0.2,[160,"yogur","yogures"],"🥣",0,0,"4009700050533",5.2],
    ["m_danone_activia_natural","Activia natural","Danone",62,3.4,4.4,3.4,0,[120,"yogur","yogures"],"🥣",0,0,"3033491147067",4.4],
    ["m_danone_danone_natural","Danone natural","Danone",46,3.8,5.1,1,0,[120,"yogur","yogures"],"🥣",0,0,"3033490004521",5.1],
    ["m_milbona_li_skyr_natural","Skyr natural","Milbona (Lidl)",62,11,4,0.2,0,[150,"tarrina","tarrinas"],"🥣",0,0,"4056489491217",4],
    ["m_arla_arla_protein_natural","Arla Protein natural","Arla",79,10,7.4,1.5,0,[150,"tarrina","tarrinas"],"🥣",0,0,"4100290077617",4.4],
    ["m_alpro_bebida_de_soja_original","Bebida de soja original","Alpro",39,3,2.5,1.8,0.5,[250,"vaso","vasos"],"🥛",1,0,"5411188115472",2.5],
    ["m_alpro_bebida_de_avena","Bebida de avena","Alpro",42,0.8,6,1.5,0.7,[250,"vaso","vasos"],"🥛",1,0,"5411188115366",3.1],
    ["m_central_le_leche_semidesnatada","Leche semidesnatada","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"🥛",1,0,"8410297113673",4.7],
    ["m_puleva_leche_desnatada","Leche desnatada","Puleva",37,3.2,4.8,0.5,0,[250,"vaso","vasos"],"🥛",1,0,"8411700603798",4.8],
    ["m_kaiku_leche_sin_lactosa_semide","Leche sin lactosa semidesnatada","Kaiku",101,5.4,9,4.6,0,[250,"vaso","vasos"],"🥛",1,0,"8432425049913",6.6],
    ["m_philadelph_queso_de_untar_original","Queso de untar original","Philadelphia",227,5.3,4.3,20.7,0.3,[30,"cucharada","cucharadas"],"🧀",0,0,"7622201695521",4.3],
    ["m_philadelph_queso_de_untar_light","Queso de untar light","Philadelphia",145,7.2,5.1,10,0.3,[30,"cucharada","cucharadas"],"🧀",0,0,"7622300340292",5.1],
    ["m_el_caserio_quesitos","Quesitos","El Caserío",217,11,3.8,17,0,[16,"quesito","quesitos"],"🧀",0,0,"8410172462957",3.8],
    ["m_barilla_spaghetti_n_5","Spaghetti n.º 5","Barilla",353,12.9,74.1,1.8,5.9,[80,"ración","raciones"],"🍝",0,1,"0076808011036",2.4],
    ["m_gallo_spaghetti","Spaghetti","Gallo",350,13,67,2.7,3,[80,"ración","raciones"],"🍝",0,1,"8410069017895",3.5],
    ["m_sos_arroz_largo","Arroz largo","SOS",349,7.7,74,1.9,3.1,[80,"ración","raciones"],"🍚",0,1,"8410184020466",0.2],
    ["m_brillante_arroz_redondo","Arroz redondo","Brillante",351,7.3,77,1.4,1.9,[80,"ración","raciones"],"🍚",0,1,"8410184016520",null],
    ["m_quaker_copos_de_avena","Copos de avena","Quaker",375,11,60,8,9,[40,"ración","raciones"],"🥣",0,0,"5000108030904",1],
    ["m_kellogg_s_special_k_original","Special K Original","Kellogg's",392,8,84,1.3,6,[30,"ración","raciones"],"🥣",0,0,"5050083296079",15],
    ["m_kellogg_s_corn_flakes","Corn Flakes","Kellogg's",377,7,84,0.9,3,[30,"ración","raciones"],"🥣",0,0,"3159470000120",8],
    ["m_nestle_fitness_original","Fitness Original","Nestlé",368,9.8,74.7,1.5,8.5,[30,"ración","raciones"],"🥣",0,0,"7613287514325",8.3],
    ["m_bimbo_pan_de_molde_100_integra","Pan de molde 100 % integral","Bimbo",250,11,42,3.2,6.1,[30,"rebanada","rebanadas"],"🍞",0,0,"8412600038635",5.8],
    ["m_calvo_atun_claro_en_aceite_de_","Atún claro en aceite de oliva","Calvo",265,20,0,20,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8410090051264",0],
    ["m_isabel_atun_claro_en_aceite_de_","Atún claro en aceite de oliva","Isabel",198,27,0,10,0,[52,"lata (escurrida)","latas (escurridas)"],"🐟",0,0,"8410111000615",0],
    ["m_campofrio_pechuga_de_pavo","Pechuga de pavo","Campofrío",82,16,2.2,1,0,[15,"loncha","lonchas"],"🦃",0,0,"8410320249478",2.2],
    ["m_elpozo_pechuga_de_pavo","Pechuga de pavo","ElPozo",90,20,0,1,0,[15,"loncha","lonchas"],"🦃",0,0,"8410843146230",0],
    ["m_carbonell_aceite_de_oliva_virgen_e","Aceite de oliva virgen extra","Carbonell",900,0,0,100,0,[10,"cucharada","cucharadas"],"🫒",0,0,"8410010006206",0],
    ["m_heinz_tomate_ketchup","Tomate Ketchup","Heinz",102,1.2,23.2,0.1,0,[15,"cucharada","cucharadas"],"🍅",0,0,"8715700421353",22.8],
    ["m_hellmann_s_mayonesa","Mayonesa","Hellmann's",726,1.1,1.4,79,0,[15,"cucharada","cucharadas"],"🥚",0,0,"8718114724485",1.3],
    ["m_cola_cao_cola_cao_original","Cola Cao Original","Cola Cao",68,3.4,9.6,1.7,0.5,[15,"cucharada","cucharadas"],"🍫",0,0,"8410014468628",9.1],
    ["m_nutella_nutella","Nutella","Nutella",539,6.3,57.5,30.9,0,[15,"cucharada","cucharadas"],"🍫",0,0,"3017620422003",56.3],
    ["m_lindt_excellence_85_cacao","Excellence 85 % cacao","Lindt",584,12.5,22,46,5,[10,"onza","onzas"],"🍫",0,0,"3046920028363",15],
    ["m_lindt_excellence_70_cacao","Excellence 70 % cacao","Lindt",566,9.5,35,41,12.2,[10,"onza","onzas"],"🍫",0,0,"3046920028004",30],
    ["m_pringles_pringles_original","Pringles Original","Pringles",528,6.2,54,31,4.1,[30,"puñado","puñados"],"🥔",0,0,"5053990156009",0.9],
    ["m_oreo_oreo_original","Oreo Original","Oreo",481,4.8,70,20,1.5,[11,"galleta","galletas"],"🍪",0,0,"6111031005576",36],
    ["m_kinder_kinder_bueno","Kinder Bueno","Kinder",572,8.6,49.5,37.3,1.9,[21.5,"barrita","barritas"],"🍫",0,0,"80052760",41.2],
    ["m_nestle_kitkat","KitKat","Nestlé",507,5.4,63.1,25.5,2.4,[41.5,"barrita","barritas"],"🍫",0,0,"6294003539054",47],
    ["m_coca_cola_coca_cola","Coca-Cola","Coca-Cola",42,0,10.6,0,0,[330,"lata","latas"],"🥤",1,0,"5701872203005",10.6],
    ["m_coca_cola_coca_cola_zero","Coca-Cola Zero","Coca-Cola",0,0,0,0,0,[330,"lata","latas"],"🥤",1,0,"5000112558265",0],
    ["m_red_bull_red_bull_energy_drink","Red Bull Energy Drink","Red Bull",47,0,11,0,0,[250,"lata","latas"],"⚡",1,0,"9002490209599",10.7],
    ["m_red_bull_red_bull_sugarfree","Red Bull Sugarfree","Red Bull",2,0,0,0,0,[250,"lata","latas"],"⚡",1,0,"90456220",0],
    ["m_monster_monster_energy_ultra","Monster Energy Ultra","Monster",2,0,1.1,0,0,[500,"lata","latas"],"⚡",1,0,"5060896623863",0],
    ["m_alpro_bebida_sin_azucar_almend","Bebida sin Azúcar Almendras","Alpro",13,0.4,0,1.1,0.3,[250,"vaso","vasos"],"",1,0,"5411188112709",0],
    ["m_alpro_bebida_avena_sin_azucar","Bebida avena Sin Azúcar","Alpro",40,0.2,5.8,1.5,1.2,[100,"ración","raciones"],"",0,0,"5411188124689",0],
    ["m_alpro_yogur_sabor_natural_con_","Yogur sabor Natural con Coco","Alpro",54,3.9,2.4,2.8,0.9,[100,"ración","raciones"],"",0,0,"5411188119098",2.2],
    ["m_alpro_yogur_mango_sin_azucares","Yogur mango Sin Azúcares Añadidos","Alpro",62,3.7,6,2.2,1,[100,"ración","raciones"],"",0,0,"5411188125808",5.4],
    ["m_alpro_yogur_natural_con_almend","Yogur natural con almendra","Alpro",54,3.9,2.3,2.8,1.1,[100,"ración","raciones"],"",0,0,"5411188118961",2.2],
    ["m_alpro_yogur_natural_sin_azucar","Yogur natural sin azúcares","Alpro",42,4,0,2.3,0.9,[100,"ración","raciones"],"",0,0,"5411188118121",0],
    ["m_alpro_yogur_frutos_rojos_con_d","Yogur frutos rojos con datilesn","Alpro",65,3.7,6.6,2.1,1.1,[100,"ración","raciones"],"",0,0,"5411188136347",5.7],
    ["m_alpro_yogur_natural_con_avena","Yogur natural con avena","Alpro",55,3.8,3,2,2.3,[100,"ración","raciones"],"",0,0,"5411188124269",1.9],
    ["m_alpro_yogur_especialidad_veget","Yogur especialidad vegetal de soja con arándanos","Alpro",70,3.7,8.2,2.2,1,[100,"ración","raciones"],"",0,0,"5411188102809",7.9],
    ["m_alpro_yogur_arandanos_base_de_","Yogur arándanos base de soja","Alpro",70,3.7,8.2,2.2,1,[100,"ración","raciones"],"",0,0,"5411188137993",7.9],
    ["m_alpro_bebida_avena","Bebida avena","Alpro",45,1.3,7.7,0.8,0.7,[100,"ración","raciones"],"",0,0,"5411188136217",5],
    ["m_alpro_bebida_100_vegetal_clasi","Bebida 100% Vegetal Clásica Avena","Alpro",62,0.7,6.3,3.5,1,[250,"vaso","vasos"],"",1,0,"5411188136613",1.2],
    ["m_alpro_bebida_barista_gluten_fr","Bebida barista gluten free oat","Alpro",61,0.3,7.9,3.1,0,[100,"ración","raciones"],"",0,0,"5411188132110",3.8],
    ["m_alpro_yogur_absolutely_coconut","Yogur absolutely Coconut stracciatella","Alpro",117,0.6,13.5,6.4,0.7,[100,"ración","raciones"],"",0,0,"5411188134473",8.6],
    ["m_alpro_skyr_style_high_protein_","Skyr Style High Protein Natural","Alpro",68,5.8,2.6,3.3,1.5,[125,"unidad","unidades"],"",0,0,"5411188129318",2.5],
    ["m_alpro_bebida_soya_light","Bebida soya light","Alpro",28,2.1,1.7,1.2,0.9,[100,"ración","raciones"],"",0,0,"5411188096474",1.5],
    ["m_alpro_bebida_coco_100_vegetal","Bebida coco 100 vegetal","Alpro",20,0.1,2.7,0.9,0.1,[250,"vaso","vasos"],"",1,0,"5411188136231",1.9],
    ["m_bimbo_pan_de_pipas_de_girasol_","Pan de Pipas de Girasol y Calabaza","Bimbo",272,14,30,8.6,9.5,[100,"ración","raciones"],"",0,0,"8412600028513",4.9],
    ["m_bimbo_pan_integral_100_natural","Pan integral 100% natural","Bimbo",253,10,44,2.5,7,[100,"ración","raciones"],"",0,0,"8412600029343",6.5],
    ["m_bimbo_pan_grande","Pan grande","Bimbo",252,9.8,45,2.7,4.7,[100,"ración","raciones"],"",0,0,"8412600012185",3.8],
    ["m_bimbo_pan_de_molde_natural","Pan de molde Natural","Bimbo",235,9.7,42,2.2,0,[100,"ración","raciones"],"",0,0,"8412600013854",4.4],
    ["m_bimbo_pan_de_molde","Pan de molde","Bimbo",255,8.2,48,2.7,3.4,[100,"ración","raciones"],"",0,0,"8412600028568",5.8],
    ["m_bimbo_pan_integral_silueta_8_c","Pan integral Silueta 8 cereales","Bimbo",246,3.4,39,3.4,34,[100,"ración","raciones"],"",0,0,"8412600300121",0.2],
    ["m_bimbo_pan_de_molde_sin_corteza","Pan de molde sin corteza","Bimbo",229,9.3,41,2.6,2.8,[100,"ración","raciones"],"",0,0,"8412600100325",3.3],
    ["m_bimbo_pan_natural_100","Pan natural 100%","Bimbo",252,9.6,45,2.8,4.2,[100,"ración","raciones"],"",0,0,"8412600009345",5],
    ["m_bimbo_pan_formato_ahorro","Pan formato ahorro","Bimbo",295,10,48,6.1,3.1,[100,"ración","raciones"],"",0,0,"8412600012192",null],
    ["m_bimbo_cruapan","Cruapan","Bimbo",389,7.4,39.5,21.6,3.7,[100,"ración","raciones"],"",0,0,"8412600019290",5.8],
    ["m_bimbo_pan_bagels_semillas_8_8","Pan bagels Semillas 8,8%","Bimbo",296,11,51,4.1,5.1,[100,"ración","raciones"],"",0,0,"8412600018323",9.4],
    ["m_bimbo_pan_bimbo_rebanada_integ","Pan bimbo Rebanada Integral Estilo Artesano","Bimbo",259,8.7,48,2.7,5.1,[100,"ración","raciones"],"",0,0,"8412600011812",8.9],
    ["m_bimbo_silueta_pan_de_molde_int","Silueta pan de molde integral sin corteza cereales","Bimbo",225,9.4,36,3.5,6,[100,"ración","raciones"],"",0,0,"8412600307618",2.8],
    ["m_bimbo_pan_rebanada_estilo_arte","Pan rebanada estilo artesano Brioche","Bimbo",263,10,46,3.3,4.2,[100,"ración","raciones"],"",0,0,"8412600016176",10],
    ["m_bimbo_maxi_burger_pan_de_hambu","Maxi-burger pan de hamburguesas","Bimbo",287,9.9,46,6.3,3.1,[100,"ración","raciones"],"",0,0,"8412600450208",4.9],
    ["m_bimbo_pan_bagels_clasico","Pan bagels clasico","Bimbo",286,11,53,2.7,4,[100,"ración","raciones"],"",0,0,"8412600018316",11],
    ["m_bimbo_pan_silueta_integral","Pan silueta integral","Bimbo",230,9.7,39,2.8,6,[100,"ración","raciones"],"",0,0,"8412600352540",4.1],
    ["m_bimbo_pan_pao_10_cereais_e_sem","Pan pão 10 Cereais e Sementes","Bimbo",264,11,38,6.2,6.2,[100,"ración","raciones"],"",0,0,"5601027943551",4.4],
    ["m_calvo_atun_claro_al_natural","Atún claro al natural","Calvo",90,20,0.8,0.6,0,[100,"ración","raciones"],"",0,0,"8410090610638",0],
    ["m_calvo_sardinas_en_aceite_de_ol","Sardinas en aceite de oliva","Calvo",323,18,0,28,0,[10,"cucharada","cucharadas"],"",0,0,"8410090441270",0],
    ["m_calvo_atun_claro_super_natural","Atún claro super natural","Calvo",99,22,0.5,0.9,0,[100,"ración","raciones"],"",0,0,"8410090031570",0],
    ["m_calvo_atun_claro_en_aceite_de_2","Atún claro en aceite de girasol","Calvo",286,20,0,23,0,[10,"cucharada","cucharadas"],"",0,0,"8410090051295",0],
    ["m_calvo_sardinas_aceite_de_oliva","Sardinas aceite de oliva bajo en sal","Calvo",323,18,0,28,0,[10,"cucharada","cucharadas"],"",0,0,"8410090450128",0],
    ["m_calvo_calamares_en_salsa_ameri","Calamares en salsa americana","Calvo",243,15,6.9,17,0,[100,"ración","raciones"],"",0,0,"8410090302632",1.9],
    ["m_calvo_mejillones_en_escabeche_","Mejillones en escabeche Calvo","Calvo",231,13,0.1,19,0,[100,"ración","raciones"],"",0,0,"8410090710437",0],
    ["m_calvo_atun_claro_en_aceite_de_22","Atún claro en aceite de oliva ligero","Calvo",148,21.4,0.7,6.7,0,[10,"cucharada","cucharadas"],"",0,0,"8410090061003",0],
    ["m_calvo_atun_claro_en_aceite_de_222","Atún claro en aceite de oliva virgen extra","Calvo",214,23,0.8,13,0,[10,"cucharada","cucharadas"],"",0,0,"8410090050670",0],
    ["m_calvo_ensalada_rusa_con_atun","Ensalada Rusa con atun","Calvo",138,7.3,10,7.4,0,[100,"ración","raciones"],"",0,0,"8410090839411",3.1],
    ["m_calvo_mejillones_en_escabeche","Mejillones en escabeche","Calvo",231,13,0,19,0,[100,"ración","raciones"],"",0,0,"8410090710543",0],
    ["m_calvo_salmon_al_natural","Salmón al natural","Calvo",80,10,0.6,4.2,0,[100,"ración","raciones"],"",0,0,"8410090912473",0],
    ["m_calvo_calamares_en_tinta","Calamares en tinta","Calvo",215,16,5.5,14,0,[100,"ración","raciones"],"",0,0,"8410090301635",2.7],
    ["m_calvo_atun_ensalada_mediterran","Atún ensalada mediterránea Calvo","Calvo",164,7.1,3.5,13,0,[100,"ración","raciones"],"",0,0,"8410090839312",1.7],
    ["m_calvo_atun_en_aceite_de_giraso","Atún en Aceite de Girasol","Calvo",273,21,0,21,0,[10,"cucharada","cucharadas"],"",0,0,"8410090051479",0],
    ["m_calvo_atun_claro_en_escabeche","Atún claro en escabeche","Calvo",135,17,0,6.8,0,[100,"ración","raciones"],"",0,0,"8410090110633",0],
    ["m_calvo_ventresca_de_atun_claro_","Ventresca de atún claro aceite de oliva","Calvo",344,22,0,28,0,[10,"cucharada","cucharadas"],"",0,0,"8410090941046",0],
    ["m_calvo_filetes_de_atun_claro_en","Filetes de atún claro en aceite de oliva","Calvo",359,17,1.6,32,0,[10,"cucharada","cucharadas"],"",0,0,"8410090912343",0],
    ["m_campofrio_salchichas_frankfurt_ori","Salchichas frankfurt original","Campofrío",198,13,2.8,15,0,[100,"ración","raciones"],"",0,0,"8410320127363",1.3],
    ["m_campofrio_pechuga_de_pavo_finissim","Pechuga de pavo Finissimas","Campofrío",85,16,2.2,1,0,[100,"ración","raciones"],"",0,0,"8410320001809",2.2],
    ["m_campofrio_salchichas_snackin_mini_","Salchichas snackin' mini fuet","Campofrío",510,29,4.1,42,0,[100,"ración","raciones"],"",0,0,"8410320005449",3.2],
    ["m_campofrio_fiambre_de_pechuga_de_pa","Fiambre de pechuga de pavo","Campofrío",81,14,4,1,0,[100,"ración","raciones"],"",0,0,"8410320371896",2.6],
    ["m_campofrio_jamon_cocido_extra_finis","Jamón Cocido Extra Finissimas","Campofrío",91,18,1.3,1.5,0,[100,"ración","raciones"],"",0,0,"8410320001816",1.3],
    ["m_campofrio_pechuga_de_pavo_braseado","Pechuga de pavo braseado Finissimas","Campofrío",86,17,2.2,1,0,[100,"ración","raciones"],"",0,0,"8410320077941",2.2],
    ["m_campofrio_jamon_cocido","Jamón cocido","Campofrío",101,17,1.5,3,0,[100,"ración","raciones"],"",0,0,"8410320371889",1.5],
    ["m_campofrio_cuida_t_jamon_cocido_ext","Cuida-t+ jamón cocido extrajugoso","Campofrío",97,18,1.7,2,0,[100,"ración","raciones"],"",0,0,"8410320267557",1.7],
    ["m_campofrio_pizza_y_salsa_barbacoa","Pizza y salsa barbacoa","Campofrío",278,10,37,10,0,[100,"ración","raciones"],"",0,0,"8410320034319",3.2],
    ["m_campofrio_pollorico_fiambre_de_pec","Pollorico, fiambre de pechuga de pollo","Campofrío",90,14,5,1.5,0,[100,"ración","raciones"],"",0,0,"8410320187862",1.5],
    ["m_campofrio_pizza_salsa_jamon_y_ques","Pizza & salsa jamón y queso","Campofrío",270,10,35,10,0,[100,"ración","raciones"],"",0,0,"8410320033503",2.1],
    ["m_campofrio_ciuda_t_pechuga_de_pavo_","Ciuda-t+ pechuga de pavo cocida","Campofrío",83,15,3.5,1,0,[100,"ración","raciones"],"",0,0,"8410320267526",1.5],
    ["m_campofrio_vegalia_pizza_vegetarian","Vegalia, pizza vegetariana de verduras asadas y","Campofrío",274,10,36,10,0,[100,"ración","raciones"],"",0,0,"8410320288453",3.7],
    ["m_campofrio_chopped_pork","Chopped pork","Campofrío",180,11,7,12,0,[100,"ración","raciones"],"",0,0,"8410320001496",1],
    ["m_campofrio_vegalia_lonchas_vegetari","Vegalia, lonchas vegetarianas a las hierbas","Campofrío",161,5.1,1.4,15,2.9,[100,"ración","raciones"],"",0,0,"8410320278942",0.6],
    ["m_campofrio_vegalia_pizza_vegetarian2","Vegalia, pizza vegetariana con queso de cabra y","Campofrío",258,10,32,10,0,[100,"ración","raciones"],"",0,0,"8410320335591",3.5],
    ["m_campofrio_mini_fuet_snack_in_xxl","MIni Fuet Snack'in XXL","Campofrío",510,29,4.1,42,0,[100,"ración","raciones"],"",0,0,"8410320360371",3.2],
    ["m_campofrio_pizza_y_salsa_5_quesos","Pizza y salsa 5 quesos","Campofrío",293,11,33,13,0,[100,"ración","raciones"],"",0,0,"8410320033527",1.7],
    ["m_carrefour_cereales_copos_de_avena_","Cereales copos de avena integral","Carrefour",372,14,59,7,10,[100,"ración","raciones"],"",0,1,"3560070614202",0.7],
    ["m_carrefour_biscotes_integrales_ecol","Biscotes integrales ecológicos","Carrefour",378,15,64,5,8.5,[100,"ración","raciones"],"",0,0,"3560070308316",4],
    ["m_carrefour_queso_rallado_parmesano","Queso rallado parmesano","Carrefour",402,32,0,30,0,[100,"ración","raciones"],"",0,0,"3560070157198",0],
    ["m_carrefour_80_cacao_negro_en_polvo","80% cacao negro (en polvo)","Carrefour",622,9.5,26,51,12,[100,"ración","raciones"],"",0,0,"3560070669981",20],
    ["m_carrefour_pan_tostado_integral","Pan tostado integral","Carrefour",375,12,69,4,7.5,[100,"ración","raciones"],"",0,0,"3560070710713",4],
    ["m_carrefour_chocolate_negro","Chocolate negro","Carrefour",567,9.6,32,42,12,[100,"ración","raciones"],"",0,0,"3270190127765",27],
    ["m_carrefour_biscotes_natural","Biscotes Natural","Carrefour",393,11,74,5,4,[100,"ración","raciones"],"",0,0,"3245412589980",6.5],
    ["m_carrefour_cereales_crujiente_natur","Cereales crujiente Natural","Carrefour",426,8,68,12,9.3,[100,"ración","raciones"],"",0,0,"3560070792368",20],
    ["m_carrefour_bebida_almendra_sin_azuc","Bebida almendra Sin azúcares","Carrefour",26,0.7,1.7,1.7,0.5,[250,"vaso","vasos"],"",1,0,"3560071014094",0.5],
    ["m_carrefour_cereales_cornflakes","Cereales cornflakes","Carrefour",374,7.2,83,0.8,3.3,[100,"ración","raciones"],"",0,0,"3560071267582",2.2],
    ["m_carrefour_bebida_avena","Bebida avena","Carrefour",43,0.5,7.2,1.2,0.8,[100,"ración","raciones"],"",0,0,"3245413451804",5],
    ["m_carrefour_galleta_con_mantequilla_","Galleta con mantequilla Tableta chocolate negro","Carrefour",493,7.5,60,24,4.7,[100,"ración","raciones"],"",0,0,"3270190128519",35],
    ["m_carrefour_pasta_pesto_verde","Pasta pesto verde","Carrefour",447,2.6,3.2,46,4.2,[100,"ración","raciones"],"",0,0,"3245413808196",1.8],
    ["m_carrefour_galleta_de_mantequilla","Galleta de mantequilla","Carrefour",441,8,73,12,3.3,[100,"ración","raciones"],"",0,0,"3560070439881",26],
    ["m_carrefour_cereales_muesli_de_quino","Cereales muesli de quinoa y chocolate","Carrefour",424,9.1,67,12,6.8,[100,"ración","raciones"],"",0,0,"3560071407650",16],
    ["m_carrefour_90_cacao_negro_en_polvo","90% cacao negro (en polvo)","Carrefour",622,12,16,54,13,[100,"ración","raciones"],"",0,0,"3560071005214",9.7],
    ["m_carrefour_pan_acimo","Pan ácimo","Carrefour",377,11,78,1.5,3.5,[100,"ración","raciones"],"",0,0,"3560070218196",2.9],
    ["m_carrefour_100_cacao_en_polvo","100% Cacao En polvo","Carrefour",381,23,11,21,29,[15,"cucharada","cucharadas"],"",0,0,"3560071194345",0.6],
    ["m_central_le_mantequilla","Mantequilla","Central Lechera Asturiana",742,0.6,0.4,82,0,[100,"ración","raciones"],"",0,0,"8410297132209",0.4],
    ["m_central_le_leche_entera","Leche entera","Central Lechera Asturiana",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410297112041",4.6],
    ["m_central_le_leche_entera_de_vaca","Leche entera de vaca","Central Lechera Asturiana",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410297010200",4.6],
    ["m_central_le_leche_uht_semidesnatada","Leche uht semidesnatada","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"",1,0,"8410297111150",4.7],
    ["m_central_le_leche_desnatada","Leche desnatada","Central Lechera Asturiana",34,3.2,4.7,0.3,0,[250,"vaso","vasos"],"",1,0,"8410297012105",null],
    ["m_central_le_1488_leche_sin_lactosa_s","1488 Leche Sin Lactosa semi Asturiana","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"",1,0,"8410297115318",4.7],
    ["m_central_le_mantequilla_tradicional_","Mantequilla tradicional Rulo","Central Lechera Asturiana",742,0.6,0.4,82,0,[100,"ración","raciones"],"",0,0,"8410297031007",0.4],
    ["m_central_le_nata_montada_azucarada_e","Nata Montada Azucarada en aerosol Asturiana","Central Lechera Asturiana",306,2.4,11,28,0,[100,"ración","raciones"],"",0,0,"8410297121104",11],
    ["m_central_le_mantequilla_sin_lactosa_","Mantequilla sin lactosa ligera","Central Lechera Asturiana",381,0,3,41,0,[100,"ración","raciones"],"",0,0,"8410297132384",0],
    ["m_central_le_leche_sin_lactosa_desnat","Leche sin Lactosa Desnatada","Central Lechera Asturiana",33,3.2,4.7,0.1,0,[100,"ración","raciones"],"",0,0,"8410297115349",4.7],
    ["m_central_le_nata_para_cocinar","Nata para cocinar","Central Lechera Asturiana",189,2.4,4.4,18,0,[100,"ración","raciones"],"",0,0,"8410297120138",3.7],
    ["m_central_le_leche_entera_sin_lactosa","Leche entera sin lactosa","Central Lechera Asturiana",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410297115448",4.6],
    ["m_central_le_nata_para_montar_asturia","Nata para montar Asturiana","Central Lechera Asturiana",360,1.8,2.7,38,0,[100,"ración","raciones"],"",0,0,"8410297120152",2.7],
    ["m_central_le_mantequilla_tradicional","Mantequilla tradicional","Central Lechera Asturiana",742,0.6,0.4,82,0,[100,"ración","raciones"],"",0,0,"8410297033001",0.4],
    ["m_central_le_bebida_alpro_soja","Bebida alpro soja","Central Lechera Asturiana",40,3,2.8,1.8,0.4,[100,"ración","raciones"],"",0,0,"8410297161315",2.8],
    ["m_central_le_mantequilla_tradicional_2","Mantequilla tradicional con sal tarrina","Central Lechera Asturiana",724,0.6,0.4,80,0,[100,"ración","raciones"],"",0,0,"8410297132216",0.4],
    ["m_central_le_leche_semi","Leche semi","Central Lechera Asturiana",45,3.2,4.7,1.6,0,[250,"vaso","vasos"],"",1,0,"8410297110986",null],
    ["m_central_le_bebida_vegetanea_avena","Bebida vegetánea Avena","Central Lechera Asturiana",51,1.1,10,0.7,0.1,[100,"ración","raciones"],"",0,0,"8410297162510",6.6],
    ["m_danone_skyr","Skyr","Danone",48,7.1,2.8,0.1,0,[125,"unidad","unidades"],"",0,0,"3033490004743",2.8],
    ["m_danone_yogur_de_coco","Yogur de Coco","Danone",84,0.6,6,6.1,0,[125,"unidad","unidades"],"",0,0,"5411188131380",0.6],
    ["m_danone_protein_drink_raspberry_","Protein Drink Raspberry Flavour","Danone",58,8.3,5.4,0.4,0,[250,"vaso","vasos"],"",1,0,"8410500023652",5.2],
    ["m_danone_yogur_natural","Yogur natural","Danone",58,3.3,4.3,3.3,0,[125,"unidad","unidades"],"",0,0,"8410500001360",4.3],
    ["m_danone_oikos_yogur_griego_natur","Oikos yogur griego natural","Danone",122,3.2,4.1,10,0,[125,"unidad","unidades"],"",0,0,"8410500021870",4.1],
    ["m_danone_yogur_sabor_fresa","Yogur sabor fresa","Danone",77,3,11.9,1.9,0,[125,"unidad","unidades"],"",0,0,"8410500006105",11.9],
    ["m_danone_yogur_activia_bifidus_na","Yogur activia bífidus natural desnatado 0%","Danone",42,4,5,0.4,0,[100,"ración","raciones"],"",0,0,"8410500002961",5],
    ["m_danone_postre_danet_vainilla","Postre danet vainilla","Danone",109,3.1,17.7,2.9,0,[100,"ración","raciones"],"",0,0,"8410500010614",14.8],
    ["m_danone_yogur_oikos_para_chefs","Yogur oikos para chefs","Danone",94,3.4,4.4,7,0,[100,"ración","raciones"],"",0,0,"8410500028268",4.4],
    ["m_danone_postre_protein_pudding_c","Postre protein Pudding Chocolate Flavour","Danone",82,10.2,6.3,1.8,0,[100,"ración","raciones"],"",0,0,"5601050037272",4.8],
    ["m_danone_yogur_danonino_sabor_fre","Yogur danonino sabor fresa","Danone",88,5.9,11.3,2.1,0,[100,"ración","raciones"],"",0,0,"8410500015787",9.9],
    ["m_danone_kefir","Kefir","Danone",63,3.4,4.2,3.3,0,[250,"vaso","vasos"],"",1,0,"8410500025762",4.2],
    ["m_danone_yogur_sabor_limon_sin_gl","Yogur sabor limón sin gluten","Danone",77,3,11.9,1.9,0,[125,"unidad","unidades"],"",0,0,"8410500006112",11.9],
    ["m_danone_yogur_hiperpro","Yogur hiperpro","Danone",60,8.3,5.4,0.5,0,[100,"ración","raciones"],"",0,0,"3033491836343",5.2],
    ["m_danone_yogur_natural_original","Yogur natural original","Danone",31,2.8,4,0.4,0,[100,"ración","raciones"],"",0,0,"8410500012861",4],
    ["m_danone_yogur_bifidus_natural_ed","Yogur bífidus natural edulcorado desnatado m.g.","Danone",51,3.9,7,0.4,0,[100,"ración","raciones"],"",0,0,"8410500012120",7],
    ["m_danone_yogur_sabor_macedonia","Yogur sabor macedonia","Danone",77,3,11.9,1.9,0,[125,"unidad","unidades"],"",0,0,"8410500006143",11.9],
    ["m_danone_yogur_sabor_coco_sin_glu","Yogur sabor coco sin gluten","Danone",72,3,10,2.2,0,[125,"unidad","unidades"],"",0,0,"8410500006150",10],
    ["m_dia_leche_entera","Leche entera","Dia",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8480017006080",4.6],
    ["m_dia_cereales_copos_de_avena","Cereales copos de Avena","Dia",372,13.5,58.7,7,10,[100,"ración","raciones"],"",0,1,"8480017038845",0.7],
    ["m_dia_cereales_muesli_frutas","Cereales muesli frutas","Dia",352,8.5,61.5,5.9,9.4,[100,"ración","raciones"],"",0,0,"8480017372017",16.1],
    ["m_dia_yogur_natural","Yogur natural","Dia",62,3.3,4.3,3.5,0,[125,"unidad","unidades"],"",0,0,"8480017243409",4.3],
    ["m_dia_kefir_natural","Kéfir natural","Dia",58,3.1,4.1,3.3,0,[250,"vaso","vasos"],"",1,0,"8480017209566",4.1],
    ["m_dia_bebida_de_avena","Bebida de avena","Dia",49,0.9,9.5,0.8,0,[100,"ración","raciones"],"",0,0,"8480017235619",6.6],
    ["m_dia_galletas_digestive_de_av","Galletas digestive de avena","Dia",483,7,61,22,6.4,[100,"ración","raciones"],"",0,0,"8480017092991",22],
    ["m_dia_gazpacho","Gazpacho","Dia",42,0.8,3.6,2.3,0,[250,"vaso","vasos"],"",1,0,"8480017432315",3.4],
    ["m_dia_almendras_al_natural_con","Almendras al natural con piel","Dia",595,21.1,9.1,49.9,12.5,[100,"ración","raciones"],"",0,0,"8480017175601",4.3],
    ["m_dia_bebida_de_avena_con_calc","Bebida de avena con calcio","Dia",56,1.1,11,0.7,0,[250,"vaso","vasos"],"",1,0,"8480017151599",8.1],
    ["m_dia_tortitas_de_maiz","Tortitas de maíz","Dia",376,8.2,80,2,0,[100,"ración","raciones"],"",0,0,"8480017112866",1.2],
    ["m_dia_cereales_corn_flakes","Cereales corn flakes","Dia",377,6,84,1.1,3.4,[100,"ración","raciones"],"",0,0,"8480017669568",7.1],
    ["m_dia_leche_desnatada_dia","Leche desnatada dia","Dia",34,3.1,4.8,0.3,0,[250,"vaso","vasos"],"",1,0,"8480017006073",4.8],
    ["m_dia_pan_de_molde_100_integra","Pan de molde 100% integral &quot;El Molino&quot;","Dia",250,10,39,3.9,9.4,[100,"ración","raciones"],"",0,0,"8480017233103",5.5],
    ["m_dia_pan_de_molde_integral_fa","Pan de molde integral familiar","Dia",236,10,40,2.8,5.7,[100,"ración","raciones"],"",0,0,"8480017232793",3.6],
    ["m_dia_pan_de_molde_blanco_sin_","Pan de molde blanco sin corteza","Dia",250,8.3,44.5,3.3,0,[100,"ración","raciones"],"",0,0,"8480017486660",8],
    ["m_dia_pan_de_molde_formato_fam","Pan de molde formato familiar","Dia",246,9.2,45,2.5,2,[100,"ración","raciones"],"",0,0,"8480017779557",3.8],
    ["m_dia_yogur_desnatado_edulcora","Yogur Desnatado Edulcorado Natural","Dia",39,3.9,5.6,0.1,0,[125,"unidad","unidades"],"",0,0,"8480017075192",5.6],
    ["m_elpozo_jamon_cocido_extra_1954","Jamón cocido extra 1954","ElPozo",111,19.4,0.5,3.5,0,[100,"ración","raciones"],"",0,0,"8410843144007",0.5],
    ["m_elpozo_sobrasada","Sobrasada","ElPozo",569,7.3,0.5,60,0,[100,"ración","raciones"],"",0,0,"8410843005810",0.5],
    ["m_elpozo_pechuga_de_pavo_lonchas_","Pechuga de Pavo Lonchas Finas","ElPozo",69,14.5,0.5,1,0,[100,"ración","raciones"],"",0,0,"8410843145202",0.5],
    ["m_elpozo_jamon_cocido_fiambre_de_","Jamón cocido fiambre de york","ElPozo",123,11.8,11,3.5,0,[100,"ración","raciones"],"",0,0,"8410843036333",2],
    ["m_elpozo_salchichas_sobrasada_ibe","Salchichas sobrasada ibérico","ElPozo",538,8,0.5,56,0,[100,"ración","raciones"],"",0,0,"8410843003717",0],
    ["m_elpozo_jamon_cocido_extra","Jamon cocido extra","ElPozo",97,18.5,0.3,2.5,0,[100,"ración","raciones"],"",0,0,"8410843129905",0.3],
    ["m_elpozo_fiambre_de_pavo_sandwich","Fiambre de pavo sándwich","ElPozo",98,9.5,10.5,2,0,[100,"ración","raciones"],"",0,0,"8410843012801",1.7],
    ["m_elpozo_pechuga_de_pavo_lonchas_2","Pechuga de pavo lonchas finas sin grasa reducido","ElPozo",75,17,0.5,0.5,0,[100,"ración","raciones"],"",0,0,"8410843135104",0.5],
    ["m_elpozo_extratiernos_escalopin_d","Extratiernos escalopín de lomo de cerdo fresco","ElPozo",118,20,0.5,4,0,[100,"ración","raciones"],"",0,0,"8410843060451",0.1],
    ["m_elpozo_salchichas_longaniza_imp","Salchichas longaniza imperial","ElPozo",388,26.5,5,29,0,[100,"ración","raciones"],"",0,0,"8410843112648",4.5],
    ["m_elpozo_pechuga_de_pavo_lonchas_22","Pechuga de pavo lonchas finas sin grasa sin","ElPozo",75,17,0.5,0.5,0,[100,"ración","raciones"],"",0,0,"8410843135098",0.5],
    ["m_elpozo_pechuga_pavo_bienstar_po","Pechuga pavo bienstar pozo","ElPozo",71,16,0.5,0.5,0,[100,"ración","raciones"],"",0,0,"8410843129707",0.5],
    ["m_elpozo_salchichas_king_original","Salchichas king original ss gluten","ElPozo",227,15.5,1.3,17.8,0,[100,"ración","raciones"],"",0,0,"8410843118169",1],
    ["m_elpozo_salchichas_salami_montan","Salchichas salami montañes","ElPozo",506,17,7,45.5,0,[100,"ración","raciones"],"",0,0,"8410843011866",4.3],
    ["m_elpozo_mortadela_siciliana","Mortadela siciliana","ElPozo",252,9.5,6,21,0,[100,"ración","raciones"],"",0,0,"8410843013877",0.8],
    ["m_elpozo_lonchas_de_pavo","Lonchas de pavo","ElPozo",75,14.5,2,1,0,[100,"ración","raciones"],"",0,0,"8410843031512",1.5],
    ["m_elpozo_all_natural_pechuga_de_p","All natural pechuga de pavo lonchas finas","ElPozo",78,15.3,2,1,0,[100,"ración","raciones"],"",0,0,"8410843035947",1.5],
    ["m_elpozo_fiambre_de_pechuga_de_po","Fiambre de pechuga de pollo","ElPozo",86,13.6,4.4,1.5,0,[100,"ración","raciones"],"",0,0,"8410843012405",0.5],
    ["m_eroski_bebida_avena","Bebida avena","Eroski",52,1.1,10,0.8,0,[100,"ración","raciones"],"",0,0,"8480010204674",6.6],
    ["m_eroski_cereales_muesli_con_alme","Cereales muesli con almendras, avellanas y nueces","Eroski",489,11,54,24,6.7,[100,"ración","raciones"],"",0,0,"8480010192919",18],
    ["m_eroski_pan_de_molde_integral","Pan de molde integral","Eroski",251,10,40,4.1,7.2,[100,"ración","raciones"],"",0,0,"8480010193954",4.3],
    ["m_eroski_pan_de_molde","Pan de molde","Eroski",259,9.4,46,3,5.3,[100,"ración","raciones"],"",0,0,"8480010178845",4.5],
    ["m_eroski_yogur_natural","Yogur natural","Eroski",34,3.9,4.4,0,0,[125,"unidad","unidades"],"",0,0,"8480010142884",4.4],
    ["m_eroski_galletas_cookies_con_chi","Galletas cookies con chips de chocolate","Eroski",489,5,66,22,3.6,[100,"ración","raciones"],"",0,0,"8480010197389",28],
    ["m_eroski_yogur_griego_natural","Yogur Griego Natural","Eroski",115,3.3,3.7,9.7,0,[125,"unidad","unidades"],"",0,0,"8480010164459",3.7],
    ["m_eroski_atun_claro_en_aceite_de_","Atun claro en aceite de oliva","Eroski",252,22,2.9,18,0,[10,"cucharada","cucharadas"],"",0,0,"8480010073034",0],
    ["m_eroski_cereales_corn_flakes","Cereales corn flakes","Eroski",375,6,84,0.9,3.4,[100,"ración","raciones"],"",0,0,"8480010197433",7.1],
    ["m_eroski_bebida_de_soja_ligera","Bebida de soja ligera","Eroski",33,2.1,3.5,1.1,0,[250,"vaso","vasos"],"",1,0,"8480010169768",2.9],
    ["m_eroski_crema_de_cacahuete_100","Crema de cacahuete 100 %","Eroski",647,28,5.7,51,3.3,[100,"ración","raciones"],"",0,0,"8480010206562",3.7],
    ["m_eroski_kefir","Kéfir","Eroski",45,3.3,4.5,1.5,0,[250,"vaso","vasos"],"",1,0,"8480010193268",4.5],
    ["m_eroski_miel_mil_flores","Miel mil flores","Eroski",330,0.6,82,0,0,[100,"ración","raciones"],"",0,0,"8480010059779",null],
    ["m_eroski_aceite_de_oliva_virgen_e","Aceite de oliva virgen extra","Eroski",842,0,0,91,0,[10,"cucharada","cucharadas"],"",0,0,"8480010008319",0],
    ["m_eroski_queso_fresco_batido_natu","Queso fresco batido Natural","Eroski",46,7.5,4,0,0,[100,"ración","raciones"],"",0,0,"8480010198300",4],
    ["m_eroski_aperitivo_de_guisantes_y","Aperitivo de guisantes y arroz","Eroski",452,12,64,15,0,[100,"ración","raciones"],"",0,0,"8480010203066",3.3],
    ["m_eroski_queso_rallado_mozarella","Queso rallado mozarella","Eroski",293,25,0,21,0,[100,"ración","raciones"],"",0,0,"8480010205404",0],
    ["m_eroski_tomate_frito","Tomate frito","Eroski",73,1.2,8.9,3.5,0,[100,"ración","raciones"],"",0,0,"8480010147711",6.5],
    ["m_gallo_pesto_a_base_de_albahaca","Pesto a base de albahaca","Gallo",473,5.8,9,46,1.9,[100,"ración","raciones"],"",0,0,"8410069014382",6.7],
    ["m_gallo_harina_de_trigo","Harina de trigo","Gallo",352,9,75,1.2,0,[100,"ración","raciones"],"",0,1,"8410069021649",1.3],
    ["m_gallo_pasta_spaghetti_nature_i","Pasta spaghetti nature integral","Gallo",335,14,60,2.6,13,[100,"ración","raciones"],"",0,1,"8410069018441",3.3],
    ["m_gallo_nature_lenteja_pasta_de_","Nature lenteja - pasta de harina de lenteja roja","Gallo",347,26,49,2.5,12,[100,"ración","raciones"],"",0,0,"8410069019028",4.6],
    ["m_gallo_risotto_traditional","Risotto Traditional","Gallo",348,6.9,77.3,1,1,[100,"ración","raciones"],"",0,0,"8001420009118",0.2],
    ["m_gallo_pasta_spaghetti","Pasta spaghetti","Gallo",344,12,68,2,3,[100,"ración","raciones"],"",0,1,"8410069018960",3.5],
    ["m_gallo_pasta_plumas_rayadas_int","Pasta plumas rayadas integrales","Gallo",346,12,66,2,8,[100,"ración","raciones"],"",0,0,"8410069018458",3],
    ["m_gallo_pasta_plumas","Pasta plumas","Gallo",344,12,68,2,3,[100,"ración","raciones"],"",0,0,"8410069018991",3.5],
    ["m_gallo_caldo_de_pollo","Caldo de pollo","Gallo",7,1.2,0.2,0.2,0.1,[100,"ración","raciones"],"",0,0,"8410069020116",0],
    ["m_gallo_pasta_fideo","Pasta fideo","Gallo",344,12,68,2,3,[100,"ración","raciones"],"",0,1,"8410069018311",3.5],
    ["m_gallo_cous_cous","Cous cous","Gallo",349,12,69,1.8,4.2,[100,"ración","raciones"],"",0,0,"8410069000019",2.1],
    ["m_gallo_nature_garbanzo","Nature Garbanzo","Gallo",370,21,52,6.5,0,[100,"ración","raciones"],"",0,0,"8410069019035",3.1],
    ["m_gallo_pasta_helices_con_tomate","Pasta helices con tomate y espinacas","Gallo",344,12,67,2,5,[100,"ración","raciones"],"",0,0,"8410069017925",4],
    ["m_gallo_harina_integral_de_trigo","Harina integral de trigo","Gallo",339,13,61,2.3,0,[100,"ración","raciones"],"",0,1,"8410069013569",1],
    ["m_gallo_gnocchis","Gnocchis","Gallo",156,3,35,0.4,1.9,[100,"ración","raciones"],"",0,0,"8410069013484",0.1],
    ["m_gallo_harina_fuerza_de_trigo","Harina fuerza de trigo","Gallo",344,11.7,69,1.4,0,[100,"ración","raciones"],"",0,1,"8410069014436",5],
    ["m_gallo_pasta_ensaladas_integral","Pasta ensaladas integral","Gallo",348,12.5,66,2,8,[100,"ración","raciones"],"",0,0,"8410069017215",3.5],
    ["m_gallo_pasta_plumas_sin_gluten","Pasta plumas sin gluten","Gallo",362,6.2,78,2,3.3,[100,"ración","raciones"],"",0,0,"8410069018564",0.8],
    ["m_hacendado_crema_de_cacahuete_100","Crema de cacahuete 100 %","Hacendado",618,30,7,50,9.9,[100,"ración","raciones"],"",0,0,"8480000671400",3.6],
    ["m_hacendado_100_cacahuetes","100% Cacahuetes","Hacendado",608,30,12,47,8.2,[100,"ración","raciones"],"",0,0,"8480000168832",5.4],
    ["m_hacendado_galletas_digestive_avena","Galletas digestive Avena","Hacendado",477,7.5,61,21,6.8,[100,"ración","raciones"],"",0,0,"8480000142139",18],
    ["m_hacendado_guacamole","Guacamole","Hacendado",149,1.9,2,13.7,5,[100,"ración","raciones"],"",0,0,"8480000038524",1.4],
    ["m_hacendado_cereales_avena_crunchy","Cereales avena crunchy","Hacendado",390,13,66,5.8,11,[100,"ración","raciones"],"",0,1,"8480000156112",4.6],
    ["m_hacendado_ketchup","Ketchup","Hacendado",115,1.3,27,0,0,[100,"ración","raciones"],"",0,0,"8480000235794",20.5],
    ["m_hacendado_cereales_corn_flakes_0_a","Cereales corn Flakes 0%azúcares añadidos","Hacendado",373,6.7,82,1.1,4.4,[100,"ración","raciones"],"",0,0,"8480000229663",0.9],
    ["m_hacendado_nuez_natural_pelada","Nuez natural pelada","Hacendado",716,17,2.2,70,6.2,[100,"ración","raciones"],"",0,0,"8480000340245",1.7],
    ["m_hacendado_yogur_griego_natural","Yogur griego natural","Hacendado",129,3.9,3.9,10.8,0,[125,"unidad","unidades"],"",0,0,"8480000205599",3.9],
    ["m_hacendado_cereales_muesli_frutas","Cereales muesli Frutas","Hacendado",361,9.1,59,7.6,10,[100,"ración","raciones"],"",0,0,"8480000094919",15],
    ["m_hacendado_muesli_con_quinoa_chia_y","Muesli con quinoa, chía y chocolate","Hacendado",416,9.8,60,13,10,[100,"ración","raciones"],"",0,0,"8480000095367",18],
    ["m_hacendado_gazpacho_tradicional","Gazpacho Tradicional","Hacendado",41,0.8,3.6,2.6,1.1,[250,"vaso","vasos"],"",1,0,"8480000156044",3.4],
    ["m_hacendado_bebida_almendra","Bebida almendra","Hacendado",16,0.5,0,1.5,0,[250,"vaso","vasos"],"",1,0,"8480000239266",0],
    ["m_hacendado_cereales_trigo_espelta","Cereales trigo Espelta","Hacendado",364,14.6,66,2.7,8.8,[100,"ración","raciones"],"",0,0,"8480000095718",1.9],
    ["m_hacendado_galletas_trigo_espelta_0","Galletas trigo espelta 0% azúcares añadidos","Hacendado",428,9.6,60,18,8.3,[100,"ración","raciones"],"",0,0,"8480000142429",2.1],
    ["m_hacendado_patatas_fritas_nachos","Patatas fritas nachos","Hacendado",481,8.2,61,22,6.3,[100,"ración","raciones"],"",0,0,"8480000336408",3.1],
    ["m_hacendado_pipas_girasol_tostadas_g","Pipas girasol tostadas gigante aguasal","Hacendado",636,28.7,5.5,53.7,8,[100,"ración","raciones"],"",0,0,"8480000340788",4],
    ["m_hacendado_galletas_digestive","Galletas digestive","Hacendado",483,7.1,65,20,5.9,[100,"ración","raciones"],"",0,0,"8480000142009",0.4],
    ["m_hacendado_chocolate_negro_99_cacao","Chocolate negro 99% cacao (en polvo)","Hacendado",610,15,8,54,16,[100,"ración","raciones"],"",0,0,"8480000125866",1],
    ["m_hacendado_pan_de_molde_con_52_cent","Pan de molde con 52% centeno","Hacendado",265,10,35,7.8,7.5,[100,"ración","raciones"],"",0,0,"8480000823021",2.1],
    ["m_hacendado_granola_con_frutos_secos","Granola con frutos secos","Hacendado",477,13.6,50.2,22.7,8.5,[100,"ración","raciones"],"",0,0,"8480000094742",4.7],
    ["m_hacendado_yogur_griego_natural_tar","Yogur griego natural (tarro 1 kg)","Hacendado",129,3.9,3.9,10.8,0,[125,"unidad","unidades"],"",0,0,"8480000205124",3.9],
    ["m_hacendado_queso_mozzarella_pizza_r","Queso mozzarella Pizza-Roma","Hacendado",283,21,2.5,21,0,[100,"ración","raciones"],"",0,0,"8480000511102",0.8],
    ["m_hacendado_bebida_avena_calcio","Bebida avena Calcio","Hacendado",52,0,6.8,2.5,0.6,[100,"ración","raciones"],"",0,0,"8480000861672",3.6],
    ["m_hacendado_cereales_muesli_crunchy","Cereales muesli Crunchy","Hacendado",409,9.3,64,13,8.6,[100,"ración","raciones"],"",0,0,"8480000094513",2.3],
    ["m_hacendado_cereales_muesli_50_fruta","Cereales muesli 50% frutas y frutos secos","Hacendado",367,6.8,60,9.3,7.8,[100,"ración","raciones"],"",0,0,"8480000094926",26],
    ["m_hacendado_pan_100_integral","Pan 100% Integral","Hacendado",238,11,37,3.2,7.4,[100,"ración","raciones"],"",0,0,"8480000823281",2.9],
    ["m_hacendado_queso_suave","Queso suave","Hacendado",241,4.2,3.7,23,0,[100,"ración","raciones"],"",0,0,"8480000512031",2.5],
    ["m_hacendado_yogur_natural","Yogur natural","Hacendado",62,3.7,4.1,3.4,0,[100,"ración","raciones"],"",0,0,"8480000223135",4.1],
    ["m_hacendado_cereales_copos_laminados","Cereales copos laminados y tostados de trigo","Hacendado",373,10.3,75,1.6,7.9,[100,"ración","raciones"],"",0,1,"8480000094889",1],
    ["m_hacendado_zumo_pura_naranja","Zumo pura naranja","Hacendado",44,0.7,9.9,0.1,0.6,[250,"vaso","vasos"],"",1,0,"8480000390103",9.3],
    ["m_hacendado_yogur_ligero_natural","Yogur ligero Natural","Hacendado",60,5.8,4.7,2,0,[100,"ración","raciones"],"",0,0,"8480000213587",4.7],
    ["m_hacendado_tomate_frito_receta_arte","Tomate frito receta artesana con aceite de oliva","Hacendado",201,1.6,14.3,15,0,[10,"cucharada","cucharadas"],"",0,0,"8480000171634",12.5],
    ["m_hacendado_cereal_mix_0_azucares_an","Cereal mix 0% azúcares añadidos","Hacendado",372,9.4,74.8,4.1,5.6,[100,"ración","raciones"],"",0,0,"8480000095329",0.7],
    ["m_hacendado_gazpacho_fresco","Gazpacho fresco","Hacendado",75,0.6,2.5,7,0,[250,"vaso","vasos"],"",1,0,"8480000399007",1.5],
    ["m_hacendado_cereales_rellenos_de_lec","Cereales rellenos de leche","Hacendado",447,10,67,14.5,3.3,[100,"ración","raciones"],"",0,0,"8480000092649",37],
    ["m_hacendado_queso_havarti_cremoso","Queso havarti cremoso","Hacendado",396,19,1.3,35,0,[100,"ración","raciones"],"",0,0,"8480000505453",0.5],
    ["m_hacendado_garbanzo_cocido","Garbanzo cocido","Hacendado",90,5.5,9.5,2.2,4.7,[100,"ración","raciones"],"",0,0,"8480000260291",0.7],
    ["m_hacendado_nata_ligera_para_cocinar","Nata ligera para cocinar","Hacendado",163,2,5,15,0,[100,"ración","raciones"],"",0,0,"8480000101990",3],
    ["m_hacendado_bebida_de_almendras_con_","Bebida de almendras con calcio","Hacendado",36,0.7,3.7,2,0.5,[250,"vaso","vasos"],"",1,0,"8480000156488",3.5],
    ["m_hacendado_postre_proteinas_natilla","Postre +Proteínas Natillas Sabor Vainilla","Hacendado",64,8.3,4.8,1.3,0,[125,"unidad","unidades"],"",0,0,"8480000223111",3],
    ["m_hacendado_bebida_de_soja_0_azucare","Bebida de soja 0% azúcares","Hacendado",32,3.1,0.6,1.7,0.5,[250,"vaso","vasos"],"",1,0,"8480000293145",0.6],
    ["m_hacendado_pan_tostado_100_espelta_","Pan tostado 100% espelta integral","Hacendado",382,17,58.7,6.4,10.8,[100,"ración","raciones"],"",0,0,"8480000828422",3.4],
    ["m_hacendado_queso_cottage_cheese","Queso cottage cheese","Hacendado",99,14,1.7,4,0,[100,"ración","raciones"],"",0,0,"8480000609632",1.7],
    ["m_hacendado_postre_proteinas_chocola","Postre +Proteínas Chocolate","Hacendado",81,8.4,8.7,1.1,1.3,[100,"ración","raciones"],"",0,0,"8480000210616",6.6],
    ["m_hacendado_panela","Panela","Hacendado",376,0,94,0,0,[100,"ración","raciones"],"",0,0,"8480000198594",94],
    ["m_hacendado_coctel_de_frutos_secos_n","Cóctel de frutos secos natural","Hacendado",651,20.4,5.6,58.8,9,[100,"ración","raciones"],"",0,0,"8480000868091",5.2],
    ["m_hacendado_rebuenas_galletas_rellen","Rebuenas, galletas rellenas de chocolate","Hacendado",484,6.4,65,21,4.9,[100,"ración","raciones"],"",0,0,"8480000141576",34],
    ["m_hacendado_galletas_maria_doradas","Galletas maría doradas","Hacendado",443,7,71,14,2.2,[100,"ración","raciones"],"",0,0,"8480000141323",20],
    ["m_hacendado_cacahuete_en_polvo_desgr","Cacahuete en polvo desgrasado","Hacendado",417,46.7,21,13.3,13.3,[15,"cucharada","cucharadas"],"",0,0,"8480000137388",10],
    ["m_hacendado_anacardo_al_natural","Anacardo al natural","Hacendado",604,21.9,19,48.2,3.6,[100,"ración","raciones"],"",0,0,"8480000233653",7.7],
    ["m_hacendado_caldo_de_pollo","Caldo de pollo","Hacendado",5,0.5,1.3,0.5,0.5,[250,"vaso","vasos"],"",1,0,"8480000073136",0.5],
    ["m_hacendado_bebida_de_soja_uth_con_c","Bebida de soja UTH con chocolate","Hacendado",35,3.3,1,1.8,1,[250,"vaso","vasos"],"",1,0,"8480000860125",0.6],
    ["m_hacendado_kefir_coco","Kéfir Coco","Hacendado",21,0.2,2.9,1,0,[250,"vaso","vasos"],"",1,0,"8480000156648",2.8],
    ["m_hacendado_galletas_digestive_de_av","Galletas digestive de avena con chocolate","Hacendado",490,7.8,61,23,5.5,[100,"ración","raciones"],"",0,0,"8480000142085",30],
    ["m_hacendado_miel_de_flores","Miel de flores","Hacendado",333,0.3,83,0,0,[100,"ración","raciones"],"",0,0,"8480000154309",79],
    ["m_hacendado_kefir_natural","Kéfir natural","Hacendado",36,3.9,4.8,0.5,0,[250,"vaso","vasos"],"",1,0,"8480000156624",2.4],
    ["m_hacendado_jamon_cocido_maxi_york_f","Jamón cocido maxi york finas lonchas","Hacendado",102,11.3,7.1,3.2,0,[100,"ración","raciones"],"",0,0,"8480000561152",1],
    ["m_hacendado_queso_fresco_burgos_natu","Queso fresco Burgos Natural","Hacendado",164,10.9,4.2,11.5,0,[100,"ración","raciones"],"",0,0,"8480000510266",4.2],
    ["m_hacendado_pan_12_cereales_y_semill","Pan 12 Cereales y semillas","Hacendado",263,11,38,6.1,6.3,[100,"ración","raciones"],"",0,0,"8480000835475",3.4],
    ["m_hacendado_jamon_cocido_natural","Jamón cocido natural","Hacendado",101,18.6,0.9,2.5,0,[100,"ración","raciones"],"",0,0,"8480000592569",0.9],
    ["m_hacendado_chocolate_negro_85_cacao","Chocolate negro 85% cacao 0% azúcares añadidos (en polvo)","Hacendado",571,11,22,49,13,[100,"ración","raciones"],"",0,0,"8480000125248",1],
    ["m_hacendado_cereales_muesli_con_frut","Cereales muesli con frutos secos","Hacendado",458,8,63,18,6,[100,"ración","raciones"],"",0,0,"8480000093578",22],
    ["m_hacendado_fritada_pisto","Fritada pisto","Hacendado",92,1.2,10,4.8,0,[100,"ración","raciones"],"",0,0,"8480000171122",8],
    ["m_hacendado_muesli_crunchy_con_choco","Muesli crunchy con chocolate","Hacendado",434,8.4,61,16,6,[100,"ración","raciones"],"",0,0,"8480000093554",24],
    ["m_hacendado_galletas_maria_dorada","Galletas maría Dorada","Hacendado",445,6.9,68,18,3.9,[100,"ración","raciones"],"",0,0,"8480000135025",0.7],
    ["m_hacendado_regana","Regaña","Hacendado",448,11,65,15,3.7,[100,"ración","raciones"],"",0,0,"8480000823656",1.9],
    ["m_hacendado_pan_de_molde_espelta_100","Pan de molde espelta 100% integral natural","Hacendado",273,10.6,45.4,3.8,6.5,[100,"ración","raciones"],"",0,0,"8480000826466",4.9],
    ["m_hacendado_cereales_de_chocolate_y_","Cereales de chocolate y avellana","Hacendado",437,6.4,72,13,3.4,[100,"ración","raciones"],"",0,0,"8480000093776",39],
    ["m_hacendado_bebida_de_soja","Bebida de Soja","Hacendado",35,3.4,0.8,1.9,0.7,[250,"vaso","vasos"],"",1,0,"8480000136824",0.7],
    ["m_hacendado_cereales_chocodays","Cereales chocodays","Hacendado",372,8,70,4.8,7.6,[100,"ración","raciones"],"",0,0,"8480000095084",25],
    ["m_hacendado_bebida_de_avellanas_y_ar","Bebida de avellanas y arroz","Hacendado",50,0.6,6.9,2.1,0.4,[250,"vaso","vasos"],"",1,0,"8480000138484",3.8],
    ["m_hacendado_aceite_de_coco_virgen","Aceite de coco virgen","Hacendado",900,0,0,100,0,[10,"cucharada","cucharadas"],"",0,0,"8480000041937",0],
    ["m_hacendado_pan_semillas_pipas","Pan semillas & Pipas","Hacendado",291,11,38,9.3,5.7,[100,"ración","raciones"],"",0,0,"8480000838698",5.3],
    ["m_hacendado_postre_pudding_sabor_car","Postre pudding Sabor Caramelo +Proteínas","Hacendado",77,10,5.8,1.5,0,[100,"ración","raciones"],"",0,0,"8480000609564",3.6],
    ["m_hacendado_picos_100_integrales","Picos 100 % integrales","Hacendado",379,14,60.9,6.4,11,[100,"ración","raciones"],"",0,0,"8480000862150",3.1],
    ["m_hacendado_pan_de_molde_100_integra2","Pan de molde 100% integral 0% azúcares añadidos","Hacendado",227,11,38,2.3,5.5,[100,"ración","raciones"],"",0,0,"8480000838681",2],
    ["m_hacendado_pan_tostado_100_integral","Pan Tostado 100% Integral de Trigo","Hacendado",376,16,59.4,6,10.2,[100,"ración","raciones"],"",0,0,"8480000860088",3.3],
    ["m_hacendado_leche_desnatada_proteina","Leche desnatada +Proteínas","Hacendado",44,6,4.6,0.2,0,[250,"vaso","vasos"],"",1,0,"8480000106780",4.6],
    ["m_hacendado_postre_proteinas_natural","Postre proteínas natural","Hacendado",52,10,3.1,0.5,0,[100,"ración","raciones"],"",0,0,"8480000209085",3.1],
    ["m_hacendado_mantequilla_sin_sal","Mantequilla sin sal","Hacendado",730,0.5,0.8,82,0,[100,"ración","raciones"],"",0,0,"8480000207166",0.8],
    ["m_hacendado_tomate_frito_con_aceite_","Tomate frito con aceite de oliva","Hacendado",77,1.5,9.5,3.5,0,[10,"cucharada","cucharadas"],"",0,0,"8480000171283",6.9],
    ["m_hacendado_margarina_ligera","Margarina Ligera","Hacendado",370,0.5,2.2,40,0,[100,"ración","raciones"],"",0,0,"8480000208767",0.5],
    ["m_hacendado_galletas_digestive_choco","Galletas digestive chocolate con leche","Hacendado",463,6,63,20,3.6,[100,"ración","raciones"],"",0,0,"8480000141316",23],
    ["m_hacendado_yogur_natural_con_azucar","Yogur natural con azucar de caña","Hacendado",94,2.7,11.6,3.8,0,[125,"unidad","unidades"],"",0,0,"8480000205841",11.6],
    ["m_hacendado_queso_feta","Queso feta","Hacendado",277,16,1,23.2,0,[100,"ración","raciones"],"",0,0,"8480000511973",0],
    ["m_hacendado_tortitas_arroz_con_legum","Tortitas arroz con legumbres","Hacendado",366,24.9,54.9,3.3,8.1,[100,"ración","raciones"],"",0,0,"8480000864833",1.8],
    ["m_hacendado_pistacho_tostado_0_sal","Pistacho tostado 0% sal","Hacendado",616,21.6,11,52.5,11,[100,"ración","raciones"],"",0,0,"8480000861900",11],
    ["m_hacendado_pechuga_de_pavo_bajo_en_","Pechuga de pavo bajo en sal finas lonchas","Hacendado",76,16.5,1.3,0.5,0,[100,"ración","raciones"],"",0,0,"8480000592521",1.3],
    ["m_hacendado_zumo_pura_naranja_con_pu","Zumo pura naranja con pulpa","Hacendado",44,0.7,9.9,0.1,0.8,[250,"vaso","vasos"],"",1,0,"8480000390325",9.3],
    ["m_hacendado_queso_gouda","Queso Gouda","Hacendado",345,23.4,0,27.9,0,[100,"ración","raciones"],"",0,0,"8713734033825",null],
    ["m_hacendado_chocolatinas_de_chocolat","Chocolatinas de chocolate negro 85%","Hacendado",576,12,22,46,15,[100,"ración","raciones"],"",0,0,"8480000124937",15],
    ["m_hacendado_chia","Chía","Hacendado",464,22,2.6,34,30,[100,"ración","raciones"],"",0,0,"8480000349613",0.4],
    ["m_hacendado_salsa_barbacoa","Salsa barbacoa","Hacendado",151,1.2,35.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000173461",null],
    ["m_hacendado_postre_lacteo_proteinas_","Postre lácteo +Proteínas con mango y maracuya 0%","Hacendado",47,8.3,5.8,0.1,0,[125,"unidad","unidades"],"",0,0,"8480000211514",5.3],
    ["m_hacendado_hummus_con_pimiento_del_","Hummus con pimiento del piquillo asado","Hacendado",292,5.7,7.5,24,6.3,[100,"ración","raciones"],"",0,0,"8480000808622",1.2],
    ["m_hacendado_tomate_frito_receta_arte2","Tomate frito receta artesana","Hacendado",201,1.6,14.3,15,0,[100,"ración","raciones"],"",0,0,"8480000171313",12.5],
    ["m_hacendado_chocolate_negro_85_cacao2","Chocolate negro 85% cacao (en polvo)","Hacendado",576,12,22,46,15,[100,"ración","raciones"],"",0,0,"8480000124920",15],
    ["m_hacendado_pipa_calabaza_natural","Pipa Calabaza Natural","Hacendado",583,35,3,48,5.5,[100,"ración","raciones"],"",0,0,"8480000341884",1.6],
    ["m_hacendado_queso_fundido_sandwich","Queso fundido sandwich","Hacendado",288,17,9.9,20,0,[100,"ración","raciones"],"",0,0,"8480000503718",1.6],
    ["m_hacendado_pan_tostado_proteinas","Pan tostado proteínas","Hacendado",409,46.5,13,21.4,11.3,[100,"ración","raciones"],"",0,0,"8480000865267",1.7],
    ["m_hacendado_cebolla_frita","Cebolla frita","Hacendado",590,6,40,44,5,[100,"ración","raciones"],"",0,0,"8718781824402",9],
    ["m_hacendado_chocolate_negro_722","Chocolate negro 72%","Hacendado",568,10,32,42,11,[100,"ración","raciones"],"",0,0,"8480000237736",27],
    ["m_hacendado_aceite_refinado_de_giras","Aceite refinado de girasol","Hacendado",828,0,0,92,0,[10,"cucharada","cucharadas"],"",1,0,"8480000040466",0],
    ["m_hacendado_queso_fresco_batido","Queso Fresco Batido","Hacendado",46,8,3.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000510716",null],
    ["m_hacendado_caldo_de_verduras","Caldo de verduras","Hacendado",5,0.5,0.5,0.6,0.5,[250,"vaso","vasos"],"",1,0,"8480000070326",0.5],
    ["m_hacendado_galletas_cereales_fibra","Galletas cereales & fibra","Hacendado",440,5.5,65,15,0,[100,"ración","raciones"],"",0,0,"8480000141989",26],
    ["m_hacendado_barrita_proteica_platano","Barrita proteica plátano brownie","Hacendado",147,9.3,17,4.8,0,[100,"ración","raciones"],"",0,0,"8480000864819",10],
    ["m_hacendado_pan_tostado_cereales_y_s","Pan tostado Cereales y semillas","Hacendado",422,16,57,13,7.8,[100,"ración","raciones"],"",0,0,"8480000822901",3.8],
    ["m_hacendado_pechuga_de_pavo_maxi","Pechuga de pavo maxi","Hacendado",78,12.8,6.8,0.5,0,[100,"ración","raciones"],"",0,0,"8480000224309",0.7],
    ["m_hacendado_galletas_chocolate","Galletas chocolate","Hacendado",398,6.7,63,17,3.7,[100,"ración","raciones"],"",0,0,"8480000158444",4.1],
    ["m_hacendado_galletas_maria_integral","Galletas maria integral","Hacendado",423,7,74,10,4.5,[100,"ración","raciones"],"",0,0,"8480000140067",17],
    ["m_hacendado_classic_cafe_soluble","Classic Café Soluble","Hacendado",278,25,33,0.4,22,[15,"cucharada","cucharadas"],"",0,0,"8480000221636",0],
    ["m_hacendado_mostaza_clasica","Mostaza clásica","Hacendado",75,3.8,2.3,5.3,0,[100,"ración","raciones"],"",0,0,"8480000234100",1],
    ["m_hacendado_bebida_choco_avena","Bebida choco avena","Hacendado",44,1.2,5.1,1.9,1,[100,"ración","raciones"],"",0,0,"8480000609267",2.4],
    ["m_hacendado_patatas_fritas_light","Patatas fritas light","Hacendado",464,4.4,65,20,2.8,[100,"ración","raciones"],"",0,0,"8480000158109",2.8],
    ["m_hacendado_sirope_de_agave","Sirope de agave","Hacendado",309,0,77.2,0,0,[100,"ración","raciones"],"",0,0,"8480000198600",77.2],
    ["m_hacendado_galletas_cookies","Galletas cookies","Hacendado",494,5.5,62,24,0,[100,"ración","raciones"],"",0,0,"8480000142122",33],
    ["m_hacendado_pan_burger_rustico","Pan burger rústico","Hacendado",263,11,40,4.8,8,[100,"ración","raciones"],"",0,0,"8480000602510",2],
    ["m_hacendado_pan_de_molde_blanco_natu","Pan de molde blanco natural rústico","Hacendado",265,9.1,47,4.5,1.2,[100,"ración","raciones"],"",0,0,"8480000233592",3.8],
    ["m_hacendado_queso_especial_pasta","Queso especial pasta","Hacendado",292,20,17,16,0,[100,"ración","raciones"],"",0,0,"8480000511515",2.4],
    ["m_hacendado_datiles","Datiles","Hacendado",298,2,68.9,0.5,7.5,[100,"ración","raciones"],"",0,0,"8480000168467",61.7],
    ["m_hacendado_cereales_muesli_crunchy_","Cereales muesli Crunchy Fruta","Hacendado",427,6.3,66,14,6,[100,"ración","raciones"],"",0,0,"8480000093561",27],
    ["m_hacendado_pan_cereales_y_semillas","Pan cereales y semillas","Hacendado",425,13.8,59.8,13,0,[100,"ración","raciones"],"",0,0,"8480000824172",null],
    ["m_hacendado_queso_quesitos_light","Queso quesitos light","Hacendado",151,11.5,6,9,0,[100,"ración","raciones"],"",0,0,"8480000512321",6],
    ["m_hacendado_barritas_chocolate_leche","Barritas chocolate leche","Hacendado",346,5.2,53,11,11,[100,"ración","raciones"],"",0,0,"8480000093509",24],
    ["m_hacendado_crema_al_cacao_en_polvo","Crema al cacao (en polvo)","Hacendado",547,4.4,56,33,2.9,[100,"ración","raciones"],"",0,0,"8480000674166",55],
    ["m_hacendado_cereales_con_achicoria","Cereales con achicoria","Hacendado",357,4.9,80,0,9.2,[100,"ración","raciones"],"",0,0,"8480000111876",16],
    ["m_hacendado_tostadas_sin_gluten","Tostadas sin gluten","Hacendado",387,6.7,84,2.3,1.6,[100,"ración","raciones"],"",0,0,"8480000828392",0.5],
    ["m_hacendado_salsa_soja","Salsa soja","Hacendado",66,7.3,6.3,0,0,[100,"ración","raciones"],"",0,0,"8480000173607",4.3],
    ["m_hacendado_galletas_tradicionales","Galletas tradicionales","Hacendado",448,5,72,15,2.3,[100,"ración","raciones"],"",0,0,"8480000144232",26],
    ["m_hacendado_jamon_pavo_finas_lonchas","Jamón pavo finas lonchas","Hacendado",85,14,1.5,2.5,0,[100,"ración","raciones"],"",0,0,"8480000566195",1.5],
    ["m_hacendado_pan_de_molde_blanco_sin_","Pan de molde blanco sin corteza","Hacendado",225,8,42,2.1,3,[100,"ración","raciones"],"",0,0,"8480000823229",5],
    ["m_hacendado_tortitas_de_arroz","Tortitas de arroz","Hacendado",363,8.5,75,2.8,1.7,[100,"ración","raciones"],"",0,0,"8480000140135",1],
    ["m_hacendado_palomitas_microondas_con","Palomitas microondas con sal","Hacendado",456,9.8,55,20,8.7,[100,"ración","raciones"],"",0,0,"8480000348227",1],
    ["m_hacendado_pipas_gigantes_con_sal","Pipas gigantes con sal","Hacendado",631,30,5.7,52,8.1,[100,"ración","raciones"],"",0,0,"8480000340795",4.3],
    ["m_hacendado_galletas_maria_sin_glute","Galletas Maria Sin Gluten","Hacendado",447,6,73.8,13,5.5,[100,"ración","raciones"],"",0,0,"8480000142351",22],
    ["m_hacendado_yogur_al_estilo_griego_s","Yogur al estilo griego Stracciatella","Hacendado",159,3.4,15.4,9.3,0,[125,"unidad","unidades"],"",0,0,"8480000205711",15],
    ["m_hacendado_uvas_pasas_sultanas_sin_","Uvas pasas sultanas sin semillas","Hacendado",324,3.1,73,1.1,4.8,[100,"ración","raciones"],"",0,0,"8480000230102",61],
    ["m_hacendado_patatas_fritas_extra_cru","Patatas fritas extra crunch","Hacendado",507,5.8,57,28,3.5,[100,"ración","raciones"],"",0,0,"8480000333070",1],
    ["m_hacendado_postre_proteinas_mousse_","Postre +Proteínas mousse de chocolate","Hacendado",76,10,5,1.6,1,[100,"ración","raciones"],"",0,0,"8480000158024",4],
    ["m_hacendado_yogur_natural_0","Yogur natural 0%","Hacendado",36,4.3,4.5,0.1,0,[125,"unidad","unidades"],"",0,0,"8480000202109",4.5],
    ["m_hacendado_yogurt_bebible_de_frutos","Yogurt bebible de frutos silvestres","Hacendado",33,3.3,4.4,0.3,0,[250,"vaso","vasos"],"",1,0,"8480000156617",4.1],
    ["m_hacendado_tofu_firme","Tofu firme","Hacendado",110,11.1,0.9,6.9,0.4,[100,"ración","raciones"],"",0,0,"8410789140118",0.4],
    ["m_hacendado_galletas_relieve","Galletas Relieve","Hacendado",458,6.9,71,16,3.5,[100,"ración","raciones"],"",0,0,"8480000141972",20],
    ["m_hacendado_chocolate_negro_92","Chocolate negro 92 %","Hacendado",608,10,6.5,56,19,[100,"ración","raciones"],"",0,0,"8480000602930",0.9],
    ["m_hacendado_queso_fresco_burgos_desn","Queso fresco Burgos desnatado 0% m.g de vaca","Hacendado",68,12.3,4.4,0.2,0,[100,"ración","raciones"],"",0,0,"8480000510747",4.4],
    ["m_hacendado_soja_texturizada_fina","Soja texturizada fina","Hacendado",326,51,20,1.3,15,[100,"ración","raciones"],"",0,0,"8480000073297",10],
    ["m_hacendado_yogur_pina_ananas_coco","Yogur piña ananás coco","Hacendado",34,3.3,4.4,0.4,0,[125,"unidad","unidades"],"",0,0,"8480000156600",4.2],
    ["m_hacendado_barritas_frutos_secos","Barritas frutos secos","Hacendado",593,19,20,47,7.1,[100,"ración","raciones"],"",0,0,"8480000095237",12],
    ["m_hacendado_bacon_cintas","Bacon cintas","Hacendado",293,16.6,0.5,25,0,[100,"ración","raciones"],"",0,0,"8480000590664",0.5],
    ["m_hacendado_pan_blanco","Pan blanco","Hacendado",249,9,47,2.1,0,[100,"ración","raciones"],"",0,0,"8402001000560",3.9],
    ["m_hacendado_pasta_helices_vegetales","Pasta hélices Vegetales","Hacendado",346,13,68,1.5,4.2,[100,"ración","raciones"],"",0,0,"8480000063441",3.1],
    ["m_hacendado_postre_gellytina","Postre gellytina","Hacendado",65,0,16,0,0,[100,"ración","raciones"],"",0,0,"8480000681720",15.9],
    ["m_hacendado_galletas_maria_choco","Galletas maría choco","Hacendado",466,7.6,69,17,3.2,[100,"ración","raciones"],"",0,0,"8480000142030",24],
    ["m_hacendado_tortilla_de_patata_sin_c","Tortilla de patata sin cebolla","Hacendado",157,5.7,11,9.8,0,[100,"ración","raciones"],"",0,0,"8480000807717",1],
    ["m_hacendado_cereales_granola","Cereales granola","Hacendado",414,9.9,67,10,8.4,[100,"ración","raciones"],"",0,0,"8480000700872",22],
    ["m_hacendado_hamburguesas_de_berenjen","Hamburguesas de berenjenas","Hacendado",195,10.4,12.4,10.7,3.8,[100,"ración","raciones"],"",0,0,"8480000865106",2.1],
    ["m_hacendado_pistacho_tostado_sal","Pistacho tostado sal","Hacendado",617,24.8,14.6,51.1,10,[100,"ración","raciones"],"",0,0,"8480000862020",8.3],
    ["m_hacendado_limon_exprimido","Limón exprimido","Hacendado",290,0,71,0,0,[250,"vaso","vasos"],"",1,0,"8480000049032",15],
    ["m_hacendado_gazpacho","Gazpacho","Hacendado",75,0.6,2.5,7,0,[250,"vaso","vasos"],"",1,0,"8480000399656",1.5],
    ["m_hacendado_crema_cacao_en_polvo","Crema Cacao (en polvo)","Hacendado",550,4.5,57,33,1.5,[100,"ración","raciones"],"",0,0,"8480000674173",57],
    ["m_hacendado_galletas_de_canela","Galletas de canela","Hacendado",468,6.4,71,17,2.9,[100,"ración","raciones"],"",0,0,"8480000144300",23],
    ["m_hacendado_crema_de_calabaza_y_zana","Crema de calabaza y zanahoria","Hacendado",48,0.9,4.2,2.8,1.4,[100,"ración","raciones"],"",0,0,"8480000232250",0.8],
    ["m_hacendado_30_lonchas_de_queso_fund","30 lonchas de queso fundido sabor suave","Hacendado",231,12,8.9,16.1,0,[100,"ración","raciones"],"",0,0,"8480000511829",5.4],
    ["m_hacendado_pechuga_pavo_finas_lonch","Pechuga pavo finas lonchas","Hacendado",76,16.5,1.3,0.5,0,[100,"ración","raciones"],"",0,0,"8480000867865",1.3],
    ["m_hacendado_tomate_triturado","Tomate triturado","Hacendado",28,0.8,5.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000160447",4],
    ["m_hacendado_avena_molida","Avena Molida","Hacendado",374,13.5,58.7,7,10,[100,"ración","raciones"],"",0,1,"8480000094575",0.7],
    ["m_hacendado_semillas","Semillas","Hacendado",603,22,3.1,53,13,[100,"ración","raciones"],"",0,0,"8480000868114",2.5],
    ["m_hacendado_margarina_100_vegetal","Margarina 100% vegetal","Hacendado",540,0.5,0.5,60,0,[100,"ración","raciones"],"",0,0,"8480000201966",0.5],
    ["m_hacendado_barritas_muesli_frutos_s","Barritas Muesli Frutos Secos","Hacendado",432,8.1,64,15,4.3,[100,"ración","raciones"],"",0,0,"8480000093486",20],
    ["m_hacendado_galletas_cookies_sin_glu","Galletas cookies sin gluten y sin lactosa","Hacendado",477,4.5,66,21.3,1.5,[100,"ración","raciones"],"",0,0,"8480000146373",31.9],
    ["m_hacendado_salsa_de_yogurt","Salsa de Yogurt","Hacendado",257,0.8,8.7,23.9,0,[125,"unidad","unidades"],"",0,0,"8480000173270",8.3],
    ["m_hacendado_cacahuete_tostado_0_sal_","Cacahuete tostado 0% sal añadida","Hacendado",618,24,13,50.4,8.2,[100,"ración","raciones"],"",0,0,"8480000134516",6.2],
    ["m_hacendado_salmorejo_fresco","Salmorejo fresco","Hacendado",134,1.5,9.5,10,0,[250,"vaso","vasos"],"",1,0,"8480000399663",2.1],
    ["m_hacendado_pan_cereales_sin_gluten","Pan cereales sin gluten","Hacendado",244,4.1,34.1,7.7,11.1,[100,"ración","raciones"],"",0,0,"8480000867506",3],
    ["m_hacendado_pan_6_maxi_tortillas_tri","Pan 6 Maxi Tortillas Trigo Wraps","Hacendado",303,8,51,6.4,4.4,[100,"ración","raciones"],"",0,0,"8480000808707",1.8],
    ["m_hacendado_margarina","Margarina","Hacendado",543,0.5,0.5,60,0,[100,"ración","raciones"],"",0,0,"8480000208460",0.5],
    ["m_hacendado_yogur_bifidus_0_con_frut","Yogur bifidus 0% con frutos silvestres","Hacendado",46,3.8,7.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000213303",5.1],
    ["m_hacendado_salchichas_cocidas_de_po","Salchichas cocidas de pollo y pavo","Hacendado",202,13.5,0.8,16,0,[100,"ración","raciones"],"",0,0,"8480000530561",0.5],
    ["m_hacendado_tomate_frito_estilo_case","Tomate frito estilo casero con aceite de oliva","Hacendado",104,2,12,5,0,[10,"cucharada","cucharadas"],"",0,0,"8480000171535",9.7],
    ["m_hacendado_coctel_de_frutos_secos","Cóctel de frutos secos","Hacendado",498,14.8,41,28.8,7.9,[100,"ración","raciones"],"",0,0,"8480000342317",6.8],
    ["m_hacendado_hummus_con_olivas_de_kal","Hummus con olivas de Kalamata","Hacendado",297,6.2,7.6,25.1,8.8,[100,"ración","raciones"],"",0,0,"8480000808929",0.5],
    ["m_hacendado_pan_tostado_clasico","Pan tostado clásico","Hacendado",397,11.9,73.8,5.1,4,[100,"ración","raciones"],"",0,0,"8480000822871",3.8],
    ["m_hacendado_ajo_y_perejil","Ajo y perejil","Hacendado",545,8.2,54,33,2.5,[100,"ración","raciones"],"",0,0,"8480000821997",1.8],
    ["m_hacendado_bebida_cafe","Bebida café","Hacendado",31,3,0.7,1.6,0.8,[250,"vaso","vasos"],"",1,0,"8480000805041",0.5],
    ["m_hacendado_postre_flan_de_huevo_pro","Postre flan de huevo +Proteínas","Hacendado",62,10,6.2,0.2,0,[125,"unidad","unidades"],"",0,0,"8480000676351",3.5],
    ["m_hacendado_harina_de_trigo","Harina de trigo","Hacendado",350,10,73,1.3,3,[100,"ración","raciones"],"",0,1,"8480000291004",0.6],
    ["m_hacendado_cereales_rellenos_de_cho","Cereales rellenos de chocolate sin gluten","Hacendado",461,6,69,17.3,2,[100,"ración","raciones"],"",0,0,"8480000095473",24.4],
    ["m_hacendado_tortitas_de_arroz_con_ch","Tortitas de arroz con chocolate blanco","Hacendado",467,7.2,63,20,3,[100,"ración","raciones"],"",0,0,"8480000141415",29],
    ["m_hacendado_pan_tomate","Pan tomate","Hacendado",522,8.6,53,30,3.1,[100,"ración","raciones"],"",0,0,"8480000821904",5],
    ["m_hacendado_cacao_en_polvo","Cacao (en polvo)","Hacendado",373,6.8,74,3.3,10,[100,"ración","raciones"],"",0,0,"8480000125842",70],
    ["m_hacendado_queso_fresco_de_cabra","Queso fresco de cabra","Hacendado",262,12.7,3.4,21.9,12.7,[100,"ración","raciones"],"",0,0,"8480000511942",2.2],
    ["m_hacendado_queso_fresco_vaca","Queso fresco vaca","Hacendado",170,11.8,5.4,11.4,0,[100,"ración","raciones"],"",0,0,"8480000511911",3.7],
    ["m_hacendado_barritas_de_sesamo","Barritas de sesamo","Hacendado",556,14.1,32.1,38.9,10.6,[100,"ración","raciones"],"",0,0,"4006084000956",22.4],
    ["m_hacendado_yogur_proteinas_limon","Yogur proteinas Limón","Hacendado",56,8.3,5.2,0.1,0,[100,"ración","raciones"],"",0,0,"8480000223128",4.6],
    ["m_hacendado_crema_de_leche_y_avellan","Crema de leche y avellana","Hacendado",522,6.5,54.4,30.8,0.8,[100,"ración","raciones"],"",0,0,"8480000230447",54.2],
    ["m_hacendado_yogur_leche_fermentada_c","Yogur leche Fermentada Con Fresa Para Beber","Hacendado",65,2.4,10.3,1.5,0,[100,"ración","raciones"],"",0,0,"8480000206275",10.2],
    ["m_hacendado_queso_perlas_de_mozzarel","Queso perlas de Mozzarella","Hacendado",194,15,2,14,0,[100,"ración","raciones"],"",0,0,"8480000510525",0.5],
    ["m_hacendado_maxi_lomo","Maxi lomo","Hacendado",105,16.3,2.2,3.5,0,[100,"ración","raciones"],"",0,0,"8480000561282",0.4],
    ["m_hacendado_leche_fresca_entera","Leche fresca entera","Hacendado",62,3.1,4.5,3.5,0,[250,"vaso","vasos"],"",1,0,"8480000109330",4.5],
    ["m_hacendado_cacao_avellana_en_polvo","Cacao Avellana (en polvo)","Hacendado",541,5.2,55.6,32.2,3.8,[100,"ración","raciones"],"",0,0,"8480000225115",45.9],
    ["m_hacendado_tahini","Tahini","Hacendado",710,24.9,3.2,65.6,3.4,[100,"ración","raciones"],"",0,0,"8480000174413",1.4],
    ["m_hacendado_nuggets_de_pollo","Nuggets de pollo","Hacendado",230,10.4,16.6,13.4,0.8,[100,"ración","raciones"],"",0,0,"8480000633231",2.1],
    ["m_hacendado_barritas_arandanos","Barritas arándanos","Hacendado",347,5.6,68,5.3,3.4,[100,"ración","raciones"],"",0,0,"8480000093745",25],
    ["m_hacendado_leche_entera","Leche entera","Hacendado",63,3.1,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8480000103802",4.6],
    ["m_hacendado_zumo_de_naranja","Zumo De Naranja","Hacendado",45,0.7,9.9,0.1,0.6,[250,"vaso","vasos"],"",1,0,"8480000399199",9.3],
    ["m_hacendado_salsa_mexicana","Salsa Mexicana","Hacendado",38,1.4,6.8,0.1,0,[100,"ración","raciones"],"",0,0,"8480000168276",4.1],
    ["m_hacendado_yogur_con_frutas_del_bos","Yogur con frutas del bosque","Hacendado",98,3.7,13.7,3.2,0,[125,"unidad","unidades"],"",0,0,"8480000203762",13.2],
    ["m_hacendado_jamon_jugoso_cocido_en_s","Jamón jugoso cocido en su jugo","Hacendado",99,17.2,1.4,2.7,0,[100,"ración","raciones"],"",0,0,"8480000592330",1.4],
    ["m_hacendado_zumo_de_manzana","Zumo de Manzana","Hacendado",44,0.1,11.3,0.1,0,[250,"vaso","vasos"],"",1,0,"8480000394033",10.5],
    ["m_hacendado_cereales_chocolate_linne","Cereales chocolate Linnea V","Hacendado",413,7.6,76,7.3,6.7,[100,"ración","raciones"],"",0,0,"8480000156099",20],
    ["m_hacendado_gnocchis","Gnocchis","Hacendado",174,4.5,37.6,0.4,0,[100,"ración","raciones"],"",0,0,"8015057003760",0.2],
    ["m_hacendado_batido_de_proteinas_whey","Batido de proteínas whey","Hacendado",46,7.9,2.3,0.6,0,[250,"vaso","vasos"],"",1,0,"8480000106704",2.2],
    ["m_hacendado_cacao_soluble_0_azucares","Cacao soluble 0% azúcares","Hacendado",343,13,45,7.2,24,[15,"cucharada","cucharadas"],"",0,0,"8480000228499",3],
    ["m_hacendado_ice_tea_zero","Ice tea zero","Hacendado",2,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8480000861375",0],
    ["m_hacendado_sardinillas_en_aceite_de","Sardinillas en aceite de oliva","Hacendado",366,17.1,0.1,33,0,[10,"cucharada","cucharadas"],"",0,0,"8480000182104",0],
    ["m_hacendado_arroz_integral_redondo","Arroz integral redondo","Hacendado",347,8.4,71,2.5,3.4,[100,"ración","raciones"],"",0,1,"8480000050144",1.2],
    ["m_hacendado_pechuga_pollo_braseada_f","Pechuga pollo braseada finas lonchas","Hacendado",84,16.9,1.3,1.2,0,[100,"ración","raciones"],"",0,0,"8480000561695",1.3],
    ["m_hacendado_loncheado_kebab_de_pollo","Loncheado kebab de pollo asado","Hacendado",191,22.4,2.7,10,0,[100,"ración","raciones"],"",0,0,"8480000137784",1.1],
    ["m_hacendado_tomate_frito_sin_azucare","Tomate frito sin azúcares añadidos","Hacendado",65,1.5,6.5,3.5,0,[100,"ración","raciones"],"",0,0,"8480000173300",4.7],
    ["m_hacendado_yogur_bifidus_con_cereal","Yogur bífidus con cereales y fibras","Hacendado",95,3.7,12.9,2.9,1.1,[100,"ración","raciones"],"",0,0,"8480000213273",11.8],
    ["m_hacendado_pechuga_de_pollo_al_cort","Pechuga de pollo al corte","Hacendado",84,16.9,1.3,1.2,0,[100,"ración","raciones"],"",0,0,"8480000561626",1.3],
    ["m_hacendado_salchichas_sin_fecula_po","Salchichas sin fécula pollo pavo","Hacendado",202,13.5,0.8,16,0,[100,"ración","raciones"],"",0,0,"8480000530592",0.5],
    ["m_hacendado_mini_caritas_galletas","Mini caritas galletas","Hacendado",481,6.8,64,21,0,[100,"ración","raciones"],"",0,0,"8480000140852",28],
    ["m_hacendado_yogur_bebida_lactea_de_f","Yogur bebida láctea de fresa y plátano","Hacendado",76,2.3,12.4,1.9,0,[100,"ración","raciones"],"",0,0,"8480000206138",11.8],
    ["m_hacendado_cafe_latte_cappuccino","Café latte cappuccino","Hacendado",59,3,8.6,1.3,0,[250,"vaso","vasos"],"",1,0,"8480000106667",8.5],
    ["m_hacendado_pina_en_su_jugo","Piña en su Jugo","Hacendado",55,0.4,13.2,0.1,0.5,[100,"ración","raciones"],"",0,0,"8480000152039",11],
    ["m_hacendado_crema_calabaza","Crema calabaza","Hacendado",36,0.7,4.9,1.3,0.7,[100,"ración","raciones"],"",0,0,"8480000134998",2.7],
    ["m_hacendado_galleta_maria_integral","Galleta maría integral","Hacendado",433,7.3,74,11,4.6,[100,"ración","raciones"],"",0,0,"8480000141897",19],
    ["m_hacendado_zumo_tropical","Zumo tropical","Hacendado",22,0.4,4.9,0,0.2,[250,"vaso","vasos"],"",1,0,"8480000101525",4.8],
    ["m_hacendado_pure_de_batatas","Puré de Batatas","Hacendado",349,8.3,74,0.6,7.4,[100,"ración","raciones"],"",0,0,"8480000232649",1.5],
    ["m_hacendado_picos_camperos_de_jerez","Picos camperos de jerez","Hacendado",394,11.5,79.9,2.3,3.6,[100,"ración","raciones"],"",0,0,"8480000679536",2.9],
    ["m_hacendado_miel_de_naranjo","Miel de naranjo","Hacendado",333,0.4,83,0,0,[100,"ración","raciones"],"",0,0,"8480000154484",79],
    ["m_hacendado_mango_deshidratado","Mango deshidratado","Hacendado",318,2.9,70,1.1,7.6,[100,"ración","raciones"],"",0,0,"8480000342096",61],
    ["m_hacendado_cereales_linnea_v_chocol","Cereales linnea V Chocolate Leche","Hacendado",399,8.3,76,6.2,5.1,[100,"ración","raciones"],"",0,0,"8480000094872",18.3],
    ["m_hacendado_queso_emmental","Queso emmental","Hacendado",369,27,0.5,29,0.1,[100,"ración","raciones"],"",0,0,"8480000235626",0.5],
    ["m_hacendado_picos","Picos","Hacendado",416,11.2,77.7,6.2,2.2,[100,"ración","raciones"],"",0,0,"8480000822796",2.6],
    ["m_hacendado_pasta_tortelloni_de_carn","Pasta tortelloni de carne","Hacendado",267,11,38,7,0,[100,"ración","raciones"],"",0,0,"8480000061423",0.7],
    ["m_hacendado_tabule_oriental","Tabulé Oriental","Hacendado",167,3.9,25.4,5.2,1.7,[100,"ración","raciones"],"",0,0,"8480000807946",6.2],
    ["m_hacendado_galletas_animadas","Galletas animadas","Hacendado",462,6.8,73,15,4,[100,"ración","raciones"],"",0,0,"8480000140807",21],
    ["m_hacendado_galleta_maria","Galleta maría","Hacendado",431,6.4,78,9.7,4.3,[100,"ración","raciones"],"",0,0,"8480000141026",21],
    ["m_hacendado_castanas_cocidas_y_pelad","Castañas cocidas y peladas","Hacendado",172,4.1,33,1.5,6.9,[100,"ración","raciones"],"",0,0,"8402001000515",10],
    ["m_hacendado_galletas_saladitas","Galletas saladitas","Hacendado",468,7.6,63,20,2.8,[100,"ración","raciones"],"",0,0,"8480000142160",6],
    ["m_hacendado_bebida_horchata_de_chufa","Bebida horchata de chufa","Hacendado",84,0.6,14,2.7,0.5,[250,"vaso","vasos"],"",1,0,"8480000237538",12.5],
    ["m_hacendado_postre_gelatina_proteina","Postre gelatina proteínas sabor frutos rojos","Hacendado",39,6,3.8,0,0,[100,"ración","raciones"],"",0,0,"8480000682741",3.7],
    ["m_hacendado_yogur_de_soja_natural","Yogur de soja natural","Hacendado",43,4.6,0,2.7,0.3,[100,"ración","raciones"],"",0,0,"8480000201607",0],
    ["m_hacendado_batido_zero_azucares_adi","Batido zero Azucares Adicionados","Hacendado",37,2.3,5.9,0.5,0,[250,"vaso","vasos"],"",1,0,"8480000229670",5.6],
    ["m_hacendado_mermelada_fresa","Mermelada fresa","Hacendado",194,0.5,47,0,0,[100,"ración","raciones"],"",0,0,"8480000867551",46],
    ["m_hacendado_yogur_natural_cabra","Yogur natural Cabra","Hacendado",77,4.1,4.2,4.9,0,[100,"ración","raciones"],"",0,0,"8480000202871",4.2],
    ["m_hacendado_coctel_de_frutas_en_almi","Cóctel de frutas en almíbar","Hacendado",425,2.3,70,14,5.2,[100,"ración","raciones"],"",0,0,"8480000349248",41],
    ["m_hacendado_lentejas_a_la_jardinera","Lentejas a la Jardinera","Hacendado",65,4.2,7.9,1.3,0,[100,"ración","raciones"],"",0,0,"8480000261168",0.5],
    ["m_hacendado_postre_gelatina_fresa_0","Postre gelatina fresa 0%","Hacendado",1,0,0,0,0,[100,"ración","raciones"],"",0,0,"8480000681874",0],
    ["m_hacendado_tsatsiki_a_base_de_yogur","Tsatsiki a base de yogur griego","Hacendado",196,3.7,3.1,18.4,1.4,[125,"unidad","unidades"],"",0,0,"8480000809803",null],
    ["m_hacendado_garbanzos","Garbanzos","Hacendado",90,5.5,9.5,2.2,0,[100,"ración","raciones"],"",0,0,"8480000260390",0.7],
    ["m_hacendado_pechuga_de_pavo","Pechuga de pavo","Hacendado",78,17.8,0.6,0.5,0,[100,"ración","raciones"],"",0,0,"8480000592071",0.6],
    ["m_hacendado_yogur_bifidus_0_con_nuec","Yogur bifidus 0% con nueces","Hacendado",55,4,7.9,0.5,1.2,[100,"ración","raciones"],"",0,0,"8480000213297",4.9],
    ["m_hacendado_pasas_moscatel","Pasas moscatel","Hacendado",321,2.9,73,1,4.2,[100,"ración","raciones"],"",0,0,"8480000230034",64],
    ["m_hacendado_mantequilla_con_sal","Mantequilla con sal","Hacendado",734,0.5,0.8,81,0,[100,"ración","raciones"],"",0,0,"8480000207227",0.8],
    ["m_hacendado_caldo_de_cocido","Caldo de cocido","Hacendado",6,0.5,1.5,0.5,0,[100,"ración","raciones"],"",0,0,"8480000073280",0.5],
    ["m_hacendado_queso_mozzarella","Queso mozzarella","Hacendado",153,17,1,9,0,[100,"ración","raciones"],"",0,0,"8480000512307",0.8],
    ["m_hacendado_pan_de_molde_multicereal","Pan de molde multicereal","Hacendado",260,11,40,5.8,6,[100,"ración","raciones"],"",0,0,"8480000823298",3.5],
    ["m_hacendado_galletas_tostadas","Galletas tostadas","Hacendado",429,7,79,9,2.2,[100,"ración","raciones"],"",0,0,"8480000143242",20],
    ["m_hacendado_yogur_bifidus_natural","Yogur bifidus natural","Hacendado",71,3.8,4.5,4.2,0,[100,"ración","raciones"],"",0,0,"8480000213075",4.5],
    ["m_hacendado_galletas_cuquis","Galletas Cuquis","Hacendado",473,6.5,72,17,1.6,[100,"ración","raciones"],"",0,0,"8480000335814",0.7],
    ["m_hacendado_yogur_sabor_fresa","Yogur sabor Fresa","Hacendado",35,4.3,4.4,0.1,0,[100,"ración","raciones"],"",0,0,"8480000211996",4.4],
    ["m_hacendado_jamon_extra_sandwich","Jamón extra sandwich","Hacendado",101,18.6,0.9,2.5,0,[100,"ración","raciones"],"",0,0,"8480000592156",0.9],
    ["m_hacendado_barritas_muesli_chocolat","Barritas muesli chocolate","Hacendado",435,5.8,66,15,4.7,[100,"ración","raciones"],"",0,0,"8480000093493",28],
    ["m_hacendado_chili_con_carne","Chili con carne","Hacendado",114,8.2,7.7,4.7,4,[100,"ración","raciones"],"",0,0,"8480000231376",2.8],
    ["m_hacendado_cacahuetes_chocolate_neg","Cacahuetes Chocolate Negro","Hacendado",544,14,41,34,7.4,[100,"ración","raciones"],"",0,0,"8480000123480",39],
    ["m_hacendado_te_limon_0","Té limón 0","Hacendado",1,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8480000278050",0.1],
    ["m_hacendado_mermelada_de_melocoton_0","Mermelada De Melocotón 0% Azúcares Añadidos Extra","Hacendado",40,0.6,10.2,0,0,[100,"ración","raciones"],"",0,0,"8480000150943",5.1],
    ["m_hacendado_mini_cookies_con_chocola","Mini cookies con chocolate","Hacendado",486,5.4,65,22,3,[100,"ración","raciones"],"",0,0,"8480000141613",31],
    ["m_hacendado_yogur_limon_griego","Yogur limón griego","Hacendado",135,3.3,12.9,7.8,0,[125,"unidad","unidades"],"",0,0,"8480000226518",12.4],
    ["m_hacendado_postre_fruta_variada","Postre fruta variada","Hacendado",62,0.7,14,0.2,0.8,[100,"ración","raciones"],"",0,0,"8480000221780",12],
    ["m_hacendado_queso_de_cabra","Queso de Cabra","Hacendado",335,17,1.1,29.2,0,[100,"ración","raciones"],"",0,0,"8480000500212",0.5],
    ["m_hacendado_queso_grana_padano_ralla","Queso Grana Padano Rallado","Hacendado",398,33,0,29,0,[100,"ración","raciones"],"",0,0,"8480000511461",null],
    ["m_hacendado_cereales_minis_leche","Cereales minis leche","Hacendado",439,9.9,69,13,3.5,[100,"ración","raciones"],"",0,0,"8480000093332",35],
    ["m_hacendado_proteinas_sabor_fresa","+Proteínas Sabor Fresa","Hacendado",51,7.1,4.8,0.4,0,[250,"vaso","vasos"],"",1,0,"8480000213334",4.5],
    ["m_hacendado_postre_gelatina_0","Postre gelatina 0%","Hacendado",1,0,0.2,0,0,[100,"ración","raciones"],"",0,0,"8402001009143",0],
    ["m_hacendado_cereales_fruta_y_fibra","Cereales fruta y fibra","Hacendado",389,8.8,65,8,11,[100,"ración","raciones"],"",0,0,"8480000796165",22],
    ["m_hacendado_allioli","Allioli","Hacendado",746,1.1,1.3,82,0.1,[100,"ración","raciones"],"",0,0,"8480000171726",0],
    ["m_hacendado_pechuga_pavo","Pechuga Pavo","Hacendado",78,17.8,0.6,0.5,0,[100,"ración","raciones"],"",0,0,"8480000602442",0.6],
    ["m_hacendado_yogur_griego_fresa","Yogur griego fresa","Hacendado",139,3.3,13.8,7.8,0,[125,"unidad","unidades"],"",0,0,"8480000205049",13.4],
    ["m_hacendado_aceite_de_oliva_virgen_e2","Aceite de Oliva Virgen Extra Spray","Hacendado",824,0,0,91,0,[10,"cucharada","cucharadas"],"",1,0,"8480000047182",0],
    ["m_hacendado_magdalenas_valencianas","Magdalenas valencianas","Hacendado",445,5.7,54,22,1.9,[100,"ración","raciones"],"",0,0,"8480000820327",27],
    ["m_hacendado_postre_soja_chocolate","Postre soja chocolate","Hacendado",109,3.4,18,2.1,2,[100,"ración","raciones"],"",0,0,"8402001007972",16],
    ["m_hacendado_galletas_caocream","Galletas caocream","Hacendado",473,5,69,19,2.9,[100,"ración","raciones"],"",0,0,"8480000155979",31],
    ["m_hacendado_choco_fundir_0_azucares_","Choco fundir 0% azúcares añadidos 70% cacao (en polvo)","Hacendado",525,8.7,35,42,9.7,[100,"ración","raciones"],"",0,0,"8480000125309",0.1],
    ["m_hacendado_jamon_cocido_extra_finas","Jamón cocido extra finas lonchas","Hacendado",101,18.6,0.9,2.5,0,[100,"ración","raciones"],"",0,0,"8480000592484",0.9],
    ["m_hacendado_cereales_crunchy_de_choc","Cereales crunchy de chocolate","Hacendado",450,6.3,73,14,3.5,[100,"ración","raciones"],"",0,0,"8480000230645",26],
    ["m_hacendado_yogur_bifidus_0_kiwi","Yogur bifidus 0% Kiwi","Hacendado",47,3.8,7.7,0.1,0.3,[100,"ración","raciones"],"",0,0,"8480000213181",5.3],
    ["m_hacendado_coctel_de_frutos_secos_a","Cóctel de frutos secos ahumado","Hacendado",598,22.8,16,47.2,8.5,[100,"ración","raciones"],"",0,0,"8480000600097",5.8],
    ["m_hacendado_galletas_jengibre","Galletas jengibre","Hacendado",420,4.5,67,15,0,[100,"ración","raciones"],"",0,0,"7317066203805",35],
    ["m_hacendado_crema_de_vinagre_balsami","Crema de vinagre balsámico de Módena","Hacendado",178,1.1,41,0,0,[100,"ración","raciones"],"",0,0,"8480000049087",40],
    ["m_hacendado_galletas_choco_negro","Galletas choco Negro","Hacendado",496,6,64,23,4.3,[100,"ración","raciones"],"",0,0,"8480000146397",34],
    ["m_hacendado_patatas_fritas_nachos_te","Patatas fritas nachos Tex-Mex","Hacendado",514,5.4,57,28,5.4,[100,"ración","raciones"],"",0,0,"8480000336415",2.6],
    ["m_hacendado_pasta_ravioli_requeson_y","Pasta ravioli requesón y espinacas","Hacendado",275,8.9,34,11,0,[100,"ración","raciones"],"",0,0,"8480000061430",5.4],
    ["m_hacendado_cereales_peanuts_balls","Cereales peanuts balls","Hacendado",438,11,69,12,5,[100,"ración","raciones"],"",0,0,"8480000608758",27],
    ["m_hacendado_bebida_de_arandanos_y_fr","Bebida de arándanos y frutas rojas","Hacendado",19,0.2,3.5,0,1,[250,"vaso","vasos"],"",1,0,"8480000396273",3.4],
    ["m_hacendado_patatas_fritas_estilo_tr","Patatas fritas estilo tradicional","Hacendado",537,7,50,33,3,[100,"ración","raciones"],"",0,0,"8480000333650",0.4],
    ["m_hacendado_almendras","Almendras","Hacendado",582,25.3,11,45.8,9.1,[100,"ración","raciones"],"",0,0,"8480000340092",2.7],
    ["m_hacendado_yogur_al_estilo_griego_n","Yogur al estilo griego natural azucarado","Hacendado",141,3.8,11.1,9,0,[125,"unidad","unidades"],"",0,0,"8480000205582",11.1],
    ["m_hacendado_mortadela_con_aceitunas","Mortadela con aceitunas","Hacendado",244,10.5,5.6,20,0,[100,"ración","raciones"],"",0,0,"8480000593351",0.7],
    ["m_hacendado_confitura_de_fresa_0_azu","Confitura de fresa 0% azúcares añadidos","Hacendado",38,0.6,10.4,0,1.6,[100,"ración","raciones"],"",0,0,"8480000150936",4.7],
    ["m_hacendado_flan_de_huevo_sin_azucar","Flan de huevo sin azucares","Hacendado",68,6.3,8.2,1.5,1.8,[125,"unidad","unidades"],"",0,0,"8480000682659",6.1],
    ["m_hacendado_yogur_desnatado_para_beb","Yogur Desnatado para Beber Sabor Tropical","Hacendado",51,7.1,4.7,0.4,0,[125,"unidad","unidades"],"",0,0,"8480000213785",4.3],
    ["m_hacendado_yogur_leche_fermentada_p","Yogur leche Fermentada Para Beber Con Piña Y Coco","Hacendado",76,2.3,12.3,1.9,0,[100,"ración","raciones"],"",0,0,"8480000206299",11.7],
    ["m_hacendado_ensaladilla_rusa","Ensaladilla rusa","Hacendado",211,5.5,8.3,17,0,[100,"ración","raciones"],"",0,0,"8480000807953",1.1],
    ["m_hacendado_azucar_blanco","Azúcar Blanco","Hacendado",400,0,100,0,0,[100,"ración","raciones"],"",0,0,"8480000198976",100],
    ["m_hacendado_garbanzos_a_la_jardinera","Garbanzos a la jardinera","Hacendado",76,3.8,9,2.1,0,[100,"ración","raciones"],"",0,0,"8480000261106",0.5],
    ["m_hacendado_choco_fundir_negro","Choco fundir negro","Hacendado",529,5.8,48,33,8.5,[100,"ración","raciones"],"",0,0,"8480000125316",45],
    ["m_hacendado_choco_buns","Choco Buns","Hacendado",353,8.6,42,16,1.4,[100,"ración","raciones"],"",0,0,"8480000826091",16],
    ["m_hacendado_galletas_maria","Galletas maría","Hacendado",426,7,78,9,2.5,[100,"ración","raciones"],"",0,0,"8480000141880",22],
    ["m_hacendado_pasta_lasagna_espinacas_","Pasta lasagna espinacas y requesón","Hacendado",165,5.9,12,10,1.5,[100,"ración","raciones"],"",0,0,"8480000044914",2.8],
    ["m_hacendado_chocolate_negro_72_cacao","Chocolate negro 72% cacao con almendras enteras (en polvo)","Hacendado",590,11,27,47,10,[100,"ración","raciones"],"",0,0,"8480000124807",22],
    ["m_hacendado_bebida_de_soja_con_choco","Bebida de soja con chocolate","Hacendado",55,3.6,5.5,1.9,0.9,[250,"vaso","vasos"],"",1,0,"8480000293183",4.4],
    ["m_hacendado_almendra_tostada_0_sal_a","Almendra Tostada 0% Sal Añadida","Hacendado",628,23.3,3,57,10.8,[100,"ración","raciones"],"",0,0,"8480000340146",1],
    ["m_hacendado_mostaza_dijon","Mostaza dijon","Hacendado",149,7.2,1.8,11,0,[100,"ración","raciones"],"",0,0,"8480000172280",1.8],
    ["m_hacendado_aceitunas_negras_sin_hue","Aceitunas negras sin hueso","Hacendado",125,0.5,0,13,0,[100,"ración","raciones"],"",0,0,"8480000332493",0],
    ["m_hacendado_yogur_bifidus_con_mango","Yogur bifidus con mango","Hacendado",85,3.5,11.8,2.6,0,[100,"ración","raciones"],"",0,0,"8480000213112",11.8],
    ["m_hacendado_patatas_fritas_corte_ond","Patatas fritas corte ondulado","Hacendado",550,5.7,53,34,4.6,[100,"ración","raciones"],"",0,0,"8480000333636",0.6],
    ["m_hacendado_yogur_con_melocoton_y_ma","Yogur con melocotón y maracuyá","Hacendado",96,3.6,13.1,3.2,0,[125,"unidad","unidades"],"",0,0,"8480000203793",12.7],
    ["m_hacendado_patatas_fritas_campestre","Patatas fritas campestre","Hacendado",538,6.8,51,33,5.1,[100,"ración","raciones"],"",0,0,"8480000155900",3.4],
    ["m_hacendado_mantequilla_sin_lactosa","Mantequilla sin lactosa","Hacendado",743,0.5,0.8,82,0,[100,"ración","raciones"],"",0,0,"8480000209917",0.8],
    ["m_hacendado_pasta_penne_rigate_integ","Pasta penne Rigate Integral","Hacendado",345,13.5,62,2.4,10,[100,"ración","raciones"],"",0,0,"8402001010194",3.7],
    ["m_hacendado_tortitas_de_maiz_54_choc","Tortitas de maiz 54% chocolate negro","Hacendado",476,6,64,21,3.5,[100,"ración","raciones"],"",0,0,"8480000140159",33],
    ["m_hacendado_yogur_natural_con_azucar2","Yogur natural con azúcar Caña","Hacendado",150,3.7,11.3,10,0,[100,"ración","raciones"],"",0,0,"8480000206824",11.3],
    ["m_hacendado_lenteja_pardina","Lenteja Pardina","Hacendado",320,24.5,48.1,1.2,9.6,[100,"ración","raciones"],"",0,0,"8480000053305",1.3],
    ["m_hacendado_smoothie_fresa","Smoothie fresa","Hacendado",46,0.6,10.5,0.1,0.8,[250,"vaso","vasos"],"",1,0,"8480000399809",9.4],
    ["m_hacendado_champinones_laminados","Champiñones Laminados","Hacendado",21,2.8,1.5,0.1,0,[100,"ración","raciones"],"",0,0,"8480000166180",0.3],
    ["m_hacendado_salchichas_salchichon_co","Salchichas salchichón Costa Brava","Hacendado",372,22,3.6,30,0,[100,"ración","raciones"],"",0,0,"8480000590855",2.7],
    ["m_hacendado_nectar_mango","Néctar mango","Hacendado",17,0.2,4.1,0,0,[250,"vaso","vasos"],"",1,0,"8480000391322",3.5],
    ["m_hacendado_postre_natillas_galleta","Postre natillas galleta","Hacendado",152,3.8,24.9,4,0.2,[125,"unidad","unidades"],"",0,0,"8480000682666",19.4],
    ["m_hacendado_crema_verduras","Crema verduras","Hacendado",30,0.8,4.5,0.8,1,[100,"ración","raciones"],"",0,0,"8480000087225",1.3],
    ["m_hacendado_leche_fresca_semidesnata","Leche fresca semidesnatada","Hacendado",44,3.1,4.6,1.5,0,[250,"vaso","vasos"],"",1,0,"8480000109224",4.5],
    ["m_hacendado_zumo_de_pina","Zumo de Piña","Hacendado",27,0.3,6.3,0,0,[250,"vaso","vasos"],"",1,0,"8480000391063",4.9],
    ["m_hacendado_patatas_gajo_rusticas","Patatas gajo rústicas","Hacendado",150,2.5,20,6.1,2.3,[100,"ración","raciones"],"",0,0,"8480000614162",1],
    ["m_hacendado_postre_mousse_vainilla","Postre mousse vainilla","Hacendado",76,10,5,1.8,0,[100,"ración","raciones"],"",0,0,"8480000158031",4],
    ["m_hacendado_salchichas_chorizo_extra","Salchichas chorizo extra","Hacendado",356,21,2.7,29,0,[100,"ración","raciones"],"",0,0,"8480000590862",2.1],
    ["m_hacendado_platano_fresa_arandanos_","Plátano, fresa, arándanos y avena puré","Hacendado",75,1,16,0.5,1.1,[100,"ración","raciones"],"",0,0,"8480000221827",13],
    ["m_hacendado_salsa_teriyaki","Salsa Teriyaki","Hacendado",188,4.5,41.8,0.1,0,[100,"ración","raciones"],"",0,0,"8480000173621",36.5],
    ["m_hacendado_salsa_cesar","Salsa César","Hacendado",342,2.3,13.5,31,0,[100,"ración","raciones"],"",0,0,"8480000173669",7],
    ["m_hacendado_leche_enriquecida_con_ca","Leche enriquecida con calcio 100% natural","Hacendado",40,3.9,5.3,0.3,0,[250,"vaso","vasos"],"",1,0,"8480000108883",5.3],
    ["m_hacendado_tortitas_de_arroz_con_ch2","Tortitas de arroz con chocolate","Hacendado",475,6.8,65,20,4.8,[100,"ración","raciones"],"",0,0,"8480000140791",26],
    ["m_hacendado_pan_bagel","Pan bagel","Hacendado",286,11,53,2.7,4,[100,"ración","raciones"],"",0,0,"8480000238436",11],
    ["m_hacendado_galletas_diverkao","Galletas diverkao","Hacendado",455,6.1,67,17,6.4,[100,"ración","raciones"],"",0,0,"8480000136008",27],
    ["m_hacendado_postre_natillas_sabor_va","Postre natillas sabor vainilla","Hacendado",127,3.8,18.1,4.4,0,[125,"unidad","unidades"],"",0,0,"8480000681379",15.3],
    ["m_hacendado_galletas_crackers_sin_gl","Galletas crackers sin gluten con romero","Hacendado",443,2.5,78,13,0,[100,"ración","raciones"],"",0,0,"8008910231271",1.5],
    ["m_hacendado_spaghetti_calidad_superi","Spaghetti calidad superior","Hacendado",361,13,72,1.5,3.5,[100,"ración","raciones"],"",0,1,"8480000062451",3.6],
    ["m_hacendado_galletas_magdalenas","Galletas magdalenas","Hacendado",415,5,51,21,1.2,[100,"ración","raciones"],"",0,0,"8480000608451",28],
    ["m_hacendado_nectar_de_maracuya","Néctar de maracuyá","Hacendado",63,0.5,14.4,0.1,0.4,[250,"vaso","vasos"],"",1,0,"8480000396433",14.4],
    ["m_hacendado_12_mini_tortillas_trigo","12 Mini Tortillas Trigo","Hacendado",303,8,51,6.4,4.4,[100,"ración","raciones"],"",0,0,"8480000809391",1.8],
    ["m_hacendado_pipa_de_girasol_natural","Pipa de girasol natural","Hacendado",602,25.8,3.8,50.9,12.5,[100,"ración","raciones"],"",0,0,"8480000341938",3.8],
    ["m_hacendado_cuajada","Cuajada","Hacendado",90,4.9,6.3,5,0,[100,"ración","raciones"],"",0,0,"8480000683229",6.3],
    ["m_hacendado_cereales_miel_nut","Cereales Miel Nut","Hacendado",409,8.5,81,5.1,2.3,[100,"ración","raciones"],"",0,0,"8480000235275",25],
    ["m_hacendado_mermelada_de_arandanos","Mermelada de arándanos","Hacendado",206,0.5,49,0.5,0,[100,"ración","raciones"],"",0,0,"8480000151322",49],
    ["m_hacendado_bebida_arroz","Bebida arroz","Hacendado",38,0.4,6.4,1.2,0,[100,"ración","raciones"],"",0,0,"8480000230478",4.6],
    ["m_hacendado_mortadela_lonchas_rosada","Mortadela-lonchas Rosada","Hacendado",244,13.2,7.3,18,0,[100,"ración","raciones"],"",0,0,"8480000593344",1.1],
    ["m_hacendado_salteado_de_pollo","Salteado de pollo","Hacendado",45,3.8,4,1.3,0.7,[100,"ración","raciones"],"",0,0,"8480000134042",1.4],
    ["m_hacendado_pipas_mondadas_fritas_sa","Pipas Mondadas Fritas Sal","Hacendado",665,22,3.6,61,8.1,[100,"ración","raciones"],"",0,0,"8480000341457",3.1],
    ["m_hacendado_te_verde","Té verde","Hacendado",19,0.1,4.8,0,0,[250,"vaso","vasos"],"",1,0,"8480000278326",4.8],
    ["m_hacendado_jamon_cocido_finas_lonch","Jamón cocido finas lonchas bajo en sal","Hacendado",99,18.4,2,1.9,0,[100,"ración","raciones"],"",0,0,"8480000592125",2],
    ["m_hacendado_maiz_para_palomitas","Maíz para palomitas","Hacendado",341,9.6,60,4.5,11,[100,"ración","raciones"],"",0,0,"8480000348043",1],
    ["m_hacendado_arandanos_deshidratados","Arándanos deshidratados","Hacendado",342,1,79,1.4,6.6,[100,"ración","raciones"],"",0,0,"8480000346056",68],
    ["m_hacendado_arroz_largo","Arroz largo","Hacendado",347,6.5,78,0.8,0,[100,"ración","raciones"],"",0,1,"8480000050632",0.5],
    ["m_hacendado_nata_montada","Nata montada","Hacendado",311,1.9,15,27,0,[100,"ración","raciones"],"",0,0,"8480000135988",14],
    ["m_hacendado_zumo_de_tomate","Zumo de tomate","Hacendado",18,0.4,3.3,0,0.4,[250,"vaso","vasos"],"",1,0,"8480000393944",3.3],
    ["m_hacendado_bebida_de_trigo_espelta_","Bebida de trigo espelta sin azúcares añadidos","Hacendado",60,0.5,11,1.4,0.5,[250,"vaso","vasos"],"",1,0,"8480000239211",7.7],
    ["m_hacendado_choco_rice","Choco rice","Hacendado",382,6.8,83,1.7,2.9,[100,"ración","raciones"],"",0,0,"8480000095923",24],
    ["m_hacendado_flan_de_vainilla","Flan de vainilla","Hacendado",95,2.4,17.7,1.6,0,[125,"unidad","unidades"],"",0,0,"8480000681065",16.5],
    ["m_hacendado_bebida_de_coco_arroz","Bebida de Coco & Arroz","Hacendado",50,0.1,9,1.6,0.1,[250,"vaso","vasos"],"",1,0,"8480000138460",6.3],
    ["m_hacendado_mermelada_de_naranja_ama","Mermelada de naranja amarga","Hacendado",234,0.5,58,0,0,[100,"ración","raciones"],"",0,0,"8480000150769",54],
    ["m_hacendado_pan_hogaza_sin_gluten","Pan hogaza sin gluten","Hacendado",266,3.7,50,4.4,0,[100,"ración","raciones"],"",0,0,"8480000827357",3.4],
    ["m_hacendado_crema_de_verduras","Crema de Verduras","Hacendado",46,0.6,4.7,2.6,1,[100,"ración","raciones"],"",0,0,"8480000603081",1.1],
    ["m_hacendado_cacahuete_frito_con_miel","Cacahuete frito con miel","Hacendado",564,21,30,39,6.5,[100,"ración","raciones"],"",0,0,"8480000341433",22],
    ["m_hacendado_fresa_morango","Fresa Morango","Hacendado",210,0.5,52,0,0,[100,"ración","raciones"],"",0,0,"8480000150912",50],
    ["m_hacendado_yogur_bebida_lactea_sabo","Yogur bebida láctea sabores L-casei 6","Hacendado",65,2.4,10.4,1.5,0,[100,"ración","raciones"],"",0,0,"8480000206404",10.1],
    ["m_hacendado_pan_mantequilla_brioche","Pan mantequilla brioche","Hacendado",323,7.9,52.9,9.3,1.7,[100,"ración","raciones"],"",0,0,"8480000228994",11.8],
    ["m_hacendado_filetes_de_merluza_reboz","Filetes de merluza (rebozado)","Hacendado",189,11,13.8,10.1,0,[100,"ración","raciones"],"",0,0,"8480000631015",0.2],
    ["m_hacendado_choco_gotas_negro","Choco Gotas Negro","Hacendado",501,6,59,25,7.6,[100,"ración","raciones"],"",0,0,"8480000125446",55],
    ["m_hacendado_yogur_cuidacol_natural","Yogur cuidacol natural","Hacendado",47,3.3,5.2,1.4,0,[100,"ración","raciones"],"",0,0,"8480000220011",0.5],
    ["m_hacendado_zumo_de_pina_seleccion","Zumo de piña Selección","Hacendado",43,0.4,10.2,0.1,0.2,[250,"vaso","vasos"],"",1,0,"8480000399465",10.2],
    ["m_hacendado_lentejas_a_la_rioja","Lentejas a la rioja","Hacendado",132,5.1,8,8.4,0,[100,"ración","raciones"],"",0,0,"8480000261014",0.5],
    ["m_hacendado_miel_de_romero","Miel de romero","Hacendado",333,0.4,82.8,0.1,0,[100,"ración","raciones"],"",0,0,"8480000154491",79.3],
    ["m_hacendado_mortadela_de_pavo_finas_","Mortadela de pavo finas lonchas","Hacendado",173,10.9,7.5,11,0,[100,"ración","raciones"],"",0,0,"8480000593368",0.8],
    ["m_hacendado_relleno_fajitas","Relleno fajitas","Hacendado",74,8.9,7,0.8,1.4,[100,"ración","raciones"],"",0,0,"8480000868206",5.3],
    ["m_hacendado_boquerones_al_vinagre_en","Boquerones al vinagre en aceite de girasol","Hacendado",203,19.4,0.8,13.6,0,[10,"cucharada","cucharadas"],"",0,0,"8480000804051",0.2],
    ["m_hacendado_patatas_fritas_sabor_ser","Patatas fritas sabor serrano","Hacendado",541,6.5,49,35,4.9,[100,"ración","raciones"],"",0,0,"8480000333353",1],
    ["m_hacendado_pasta_gnocchi_quesos","Pasta gnocchi quesos","Hacendado",144,4.1,23,3.8,0,[100,"ración","raciones"],"",0,0,"8480000868404",0.7],
    ["m_hacendado_mermelada_de_melocoton","Mermelada de melocotón","Hacendado",210,0.5,52,0,0,[100,"ración","raciones"],"",0,0,"8480000150929",50],
    ["m_hacendado_patatas_fritas_cocktail_","Patatas fritas cocktail rodeo","Hacendado",490,9,55,24.9,4.7,[100,"ración","raciones"],"",0,0,"8480000342171",3.3],
    ["m_hacendado_queso_especial_fundir","Queso especial fundir","Hacendado",284,19,7,20,0,[100,"ración","raciones"],"",0,0,"8480000236210",0.5],
    ["m_hacendado_mousse_de_queso","Mousse de queso","Hacendado",208,3.8,5.5,19,0,[100,"ración","raciones"],"",0,0,"8480000511676",3.9],
    ["m_hacendado_yogur_sabor_platano","Yogur sabor plátano","Hacendado",82,3.6,11.4,2,0,[100,"ración","raciones"],"",0,0,"8480000211989",11.4],
    ["m_hacendado_galletas_barquillos_de_n","Galletas barquillos de nata","Hacendado",434,3,64,23,0,[100,"ración","raciones"],"",0,0,"8480000141361",1],
    ["m_hacendado_leche_omega_3","Leche omega 3","Hacendado",52,3.1,4.8,2.1,0,[250,"vaso","vasos"],"",1,0,"8480000108463",4.8],
    ["m_hacendado_salchichas_chorizo_dulce","Salchichas chorizo dulce","Hacendado",443,25,0.2,38,0,[100,"ración","raciones"],"",0,0,"8480000542090",0.2],
    ["m_hacendado_remolacha_en_tiras_agrid","Remolacha en tiras agridulce","Hacendado",35,1.8,6.4,0.5,0,[100,"ración","raciones"],"",0,0,"8480000167545",5.3],
    ["m_hacendado_salsa_burger","Salsa burger","Hacendado",340,1.5,11.5,31.6,0,[100,"ración","raciones"],"",0,0,"8480000173478",9.7],
    ["m_hacendado_galletas_belgas","Galletas belgas","Hacendado",482,6,71,19,1.5,[100,"ración","raciones"],"",0,0,"8480000145819",39],
    ["m_hacendado_queso_ricotta","Queso ricotta","Hacendado",179,9.7,3.8,14,0,[100,"ración","raciones"],"",0,0,"8480000512284",2.8],
    ["m_hacendado_galletas_tarta_de_queso","Galletas tarta de queso","Hacendado",266,5.1,18.6,19,0,[100,"ración","raciones"],"",0,0,"8480000213662",18.3],
    ["m_hacendado_yogur_cremoso_natural_ed","Yogur cremoso natural edulcorado","Hacendado",42,4.9,5.6,0,1.9,[100,"ración","raciones"],"",0,0,"8480000208309",5.6],
    ["m_hacendado_crema_de_tofu","Crema de Tofu","Hacendado",169,5.4,2,15.2,1.4,[100,"ración","raciones"],"",0,0,"8480000707215",0.5],
    ["m_hacendado_crema_de_pollo","Crema de Pollo","Hacendado",47,1,4,2.6,1.6,[100,"ración","raciones"],"",0,0,"8480000084484",0.2],
    ["m_hacendado_pan_pipa_tostada_gigante","Pan pipa Tostada Gigante","Hacendado",636,28.7,5.5,53.7,8,[100,"ración","raciones"],"",0,0,"8480000230591",4],
    ["m_hacendado_pan_4_piadinas","Pan 4 piadinas","Hacendado",315,7,53,8.5,1.7,[100,"ración","raciones"],"",0,0,"8480000808943",5.8],
    ["m_hacendado_capuchino_caramel_en_pol","Capuchino caramel (en polvo)","Hacendado",416,7.4,76,8.5,2.4,[15,"cucharada","cucharadas"],"",0,0,"8480000676603",49],
    ["m_hacendado_black_chocolate_72_with_","Black chocolate 72% with almonds","Hacendado",578,14,25,44,13,[100,"ración","raciones"],"",0,0,"8480000290625",21],
    ["m_hacendado_filetes_de_caballa_del_s","Filetes de Caballa del Sur en Aceite de Oliva","Hacendado",311,36.9,0.8,16.9,0,[10,"cucharada","cucharadas"],"",0,0,"8480000183118",0.8],
    ["m_hacendado_filetes_de_anchoa_en_ace","Filetes de anchoa en aceite de oliva","Hacendado",192,25,0.3,10.1,0,[10,"cucharada","cucharadas"],"",0,0,"8480000184085",0],
    ["m_hacendado_patatas_fritas_classicas","Patatas fritas classicas","Hacendado",520,6.4,54,30,4.4,[100,"ración","raciones"],"",0,0,"8402001001734",0.5],
    ["m_hacendado_nata_montar_bater","Nata montar bater","Hacendado",335,2,3.1,35,0,[100,"ración","raciones"],"",0,0,"8480000102768",3.1],
    ["m_hacendado_cola","Cola","Hacendado",42,0,10.4,0,0,[250,"vaso","vasos"],"",1,0,"8480000290724",10.3],
    ["m_hacendado_guisantes_extra","Guisantes extra","Hacendado",59,4,10,0.2,0,[100,"ración","raciones"],"",0,0,"8480000164162",4.2],
    ["m_hacendado_picos_integrales","Picos integrales","Hacendado",400,13.8,65,6.7,11.5,[100,"ración","raciones"],"",0,0,"8480000226730",3.2],
    ["m_hacendado_espresso_creme","Espresso Creme","Hacendado",285,23,34,0,28,[250,"vaso","vasos"],"",1,0,"8480000111234",0],
    ["m_hacendado_capuccino_en_polvo","Capuccino (en polvo)","Hacendado",401,5.6,83,4.7,3.1,[15,"cucharada","cucharadas"],"",0,0,"8480000234063",63],
    ["m_hacendado_yogur_bifidus","Yogur bifidus","Hacendado",134,4.7,20.9,3.2,1,[100,"ración","raciones"],"",0,0,"8480000208590",12.8],
    ["m_kaiku_bebida_vegetal_de_almend","Bebida vegetal de Almendra","Kaiku",24,0.8,0.2,2.2,0,[250,"vaso","vasos"],"",1,0,"8432425018506",0.1],
    ["m_kaiku_leche_semidesnatada_sin_","Leche semidesnatada sin lactosa","Kaiku",46,3.1,4.9,1.6,0,[250,"vaso","vasos"],"",1,0,"8410981010103",4.9],
    ["m_kaiku_kefir","Kefir","Kaiku",58,5,4.3,2,0,[250,"vaso","vasos"],"",1,0,"8432425094074",4.3],
    ["m_kaiku_kefir_plus","Kéfir plus","Kaiku",74,4.1,10,1.7,0,[250,"vaso","vasos"],"",1,0,"8432425094135",9.4],
    ["m_kaiku_caffe_latte_cappuccino","Caffe latte cappuccino","Kaiku",61,2.9,9.5,1.2,0,[250,"vaso","vasos"],"",1,0,"8410981093199",9.1],
    ["m_kaiku_bebida_begetal_avena","Bebida begetal avena","Kaiku",56,1.1,7.1,2.5,0.5,[100,"ración","raciones"],"",0,0,"8432425018520",2.7],
    ["m_kaiku_caffe_latte_light","Caffé Latte Light","Kaiku",34,2.9,4.3,0.6,0,[250,"vaso","vasos"],"",1,0,"8410981096954",4],
    ["m_kaiku_yogur_begetal","Yogur begetal","Kaiku",69,0.5,4.9,5.1,0,[100,"ración","raciones"],"",0,0,"8432425046462",1],
    ["m_kaiku_protein_98_whey_sabor_ch","Protein 98% Whey Sabor Choco Avellana","Kaiku",64,9.3,4.5,0.9,0,[100,"ración","raciones"],"",0,0,"8432425094449",3.6],
    ["m_kaiku_caffe_latte_expreso","Caffe latte expreso","Kaiku",58,2.9,8.5,1.2,0.1,[250,"vaso","vasos"],"",1,0,"8410981093205",7.9],
    ["m_kaiku_caffe_latte","Caffe latte","Kaiku",61,2.9,9.2,1.2,0,[100,"ración","raciones"],"",0,0,"8432425094951",8.8],
    ["m_kaiku_caffe_latte_sin_azucares","Caffè latte sin azúcares","Kaiku",49,3,4.5,2.1,0,[250,"vaso","vasos"],"",1,0,"8432425090854",3.9],
    ["m_kaiku_yogur_begetal_de_coco_na","Yogur begetal de Coco natural sin azucares añadidos","Kaiku",69,0.5,4.9,5.1,0,[100,"ración","raciones"],"",0,0,"8432425049012",1],
    ["m_kaiku_leche_de_produccion_sost","Leche de producción sostenible","Kaiku",44,3,4.6,1.5,0,[250,"vaso","vasos"],"",1,0,"8410981198764",4.6],
    ["m_kaiku_yogur_bifidus_con_trocit","Yogur bifidus con trocitos de frutas del bosque","Kaiku",85,3.7,13,2,0,[100,"ración","raciones"],"",0,0,"8410981992164",13],
    ["m_kaiku_postre_begetal","Postre begetal","Kaiku",72,1.4,8.6,3.3,0,[100,"ración","raciones"],"",0,0,"8432425040071",5],
    ["m_kaiku_caffe_latte_mr_big_cappu","Caffé latte mr. big cappuccino café arábica con","Kaiku",61,2.9,9.5,1.2,0.1,[250,"vaso","vasos"],"",1,0,"8432425091202",9.1],
    ["m_kaiku_leche_de_almendra_uht","Leche de almendra UHT","Kaiku",25,0.7,0.5,2.2,0,[100,"ración","raciones"],"",0,0,"8432425118503",0],
    ["m_milbona_postre_high_protein_choc","Postre high Protein Chocolate Pudding","Milbona",76,10,5.2,1.5,0,[100,"ración","raciones"],"",0,0,"4056489216162",4],
    ["m_milbona_yogur_griego_natural_lig","Yogur Griego Natural Light","Milbona",59,6,4,2,0,[125,"unidad","unidades"],"",0,0,"20416690",null],
    ["m_milbona_queso_mozzarella","Queso mozzarella","Milbona",245,18,1.5,18.5,0,[100,"ración","raciones"],"",0,0,"20002268",1.5],
    ["m_milbona_queso_grana_padano_dop_r","Queso grana Padano DOP rallado","Milbona",398,33,0,29,0,[100,"ración","raciones"],"",0,0,"4056489192923",0],
    ["m_milbona_queso_original","Queso original","Milbona",238,5.5,3,22.5,0.5,[100,"ración","raciones"],"",0,0,"20103286",3],
    ["m_milbona_natural_yogur","Natural Yogur","Milbona",75,5,4.7,3.8,0,[125,"unidad","unidades"],"",0,0,"20144302",4.7],
    ["m_milbona_queso_light","Queso light","Milbona",141,6.9,3,11,0,[100,"ración","raciones"],"",0,0,"20103354",3],
    ["m_milbona_queso_feta","Queso feta","Milbona",287,16.2,0.2,24.6,0,[100,"ración","raciones"],"",0,0,"4056489127253",0.2],
    ["m_milbona_bebida_de_avena","Bebida de avena","Milbona",47,1.4,8.3,0.8,0.2,[250,"vaso","vasos"],"",1,0,"20879082",6.3],
    ["m_milbona_queso_fresco_original","Queso Fresco Original","Milbona",238,5.5,3,22.5,0,[100,"ración","raciones"],"",0,0,"4056489532866",3],
    ["m_milbona_queso_fresco_batido_quar","Queso fresco batido Quark","Milbona",52,8.5,4.6,0.5,0,[100,"ración","raciones"],"",0,0,"20337223",4.6],
    ["m_milbona_queso_mascarpone","Queso mascarpone","Milbona",401,5.5,2.5,41,2.5,[100,"ración","raciones"],"",0,0,"4056489098591",2.5],
    ["m_milbona_bebida_de_almendras","Bebida de almendras","Milbona",15,0.5,0.2,1.4,0,[250,"vaso","vasos"],"",1,0,"4056489140450",null],
    ["m_milbona_queso_ricotta","Queso ricotta","Milbona",150,7,3,12,0,[100,"ración","raciones"],"",0,0,"4056489099062",3],
    ["m_milbona_requeson_tipo_cottage_li","Requesón tipo cottage light","Milbona",70,12.5,3.1,0.8,0,[100,"ración","raciones"],"",0,0,"20131968",3.1],
    ["m_milbona_skyr_natural","Skyr Natural","Milbona",62,11,4,0.2,0,[125,"unidad","unidades"],"",0,0,"20692230",4],
    ["m_milbona_leche_semidesnatada","Leche Semidesnatada","Milbona",45,3.2,4.7,1.5,0,[250,"vaso","vasos"],"",1,0,"20044794",4.7],
    ["m_milbona_yogur_bifidus_cremoso_na","Yogur bifidus Cremoso Natural","Milbona",76,4.8,5.6,3.5,0,[100,"ración","raciones"],"",0,0,"20002084",5.6],
    ["m_pascual_leche_entera","Leche entera","Pascual",64,3.2,4.6,3.6,0,[250,"vaso","vasos"],"",1,0,"8410128010096",4.6],
    ["m_pascual_bifrutas_tropical","Bifrutas Tropical","Pascual",21,0.3,4.8,0,0.5,[250,"vaso","vasos"],"",1,0,"8410128891169",4.8],
    ["m_pascual_leche_pascual_semi","Leche pascual semi","Pascual",46,3,4.9,1.6,0,[250,"vaso","vasos"],"",1,0,"8410128010119",4.9],
    ["m_pascual_bebida_vivesoy_avena","Bebida vivesoy Avena","Pascual",50,1.2,9.1,0.7,1,[100,"ración","raciones"],"",0,0,"8410128169947",5],
    ["m_pascual_leche_pascual_desnatada","Leche pascual desnatada","Pascual",35,3.1,5,0.3,0,[250,"vaso","vasos"],"",1,0,"8410128010225",5],
    ["m_pascual_bebida_vivesoy_clasica","Bebida vivesoy Clásica","Pascual",38,3.1,1.9,1.8,0.8,[100,"ración","raciones"],"",0,0,"8410128785185",1.8],
    ["m_pascual_bebida_vivesoy_ligera","Bebida vivesoy Ligera","Pascual",27,2.2,1.5,1.2,0.6,[100,"ración","raciones"],"",0,0,"8410128785208",1.4],
    ["m_pascual_bebida_vivesoy_avena_sin","Bebida vivesoy Avena Sin Azúcar","Pascual",40,0.9,5.9,1.2,1.2,[100,"ración","raciones"],"",0,0,"8410128784201",0],
    ["m_pascual_batido_de_cacao","Batido de cacao","Pascual",63,3.3,9.6,1,1,[250,"vaso","vasos"],"",1,0,"8410128670511",9.2],
    ["m_pascual_bebida_vivesoy_soja_sin_","Bebida vivesoy Soja Sin Azúcar","Pascual",24,2.2,0.4,1.3,0.7,[100,"ración","raciones"],"",0,0,"8410128785161",0],
    ["m_pascual_leche_semi_sin_lactosa","Leche semi sin lactosa","Pascual",47,3.3,4.9,1.6,0,[250,"vaso","vasos"],"",1,0,"8410128750008",4.9],
    ["m_pascual_leche_mazada","Leche mazada","Pascual",35,3,4.5,0.5,3,[250,"vaso","vasos"],"",1,0,"8410128010959",4.5],
    ["m_pascual_leche_desnatada_calcio_v","Leche desnatada calcio vitamina D","Pascual",41,3.9,5.6,0.3,0,[250,"vaso","vasos"],"",1,0,"8410128010195",5.6],
    ["m_pascual_bifrutas_natural","Bifrutas natural","Pascual",28,0.7,5.6,0,0.3,[250,"vaso","vasos"],"",1,0,"8410128789541",5.5],
    ["m_pascual_bebida_vivesoy_soja_choc","Bebida vivesoy Soja Chocolate","Pascual",53,3.2,5.3,1.8,1.2,[250,"vaso","vasos"],"",1,0,"8410128785321",5.2],
    ["m_pascual_nata_montada_azucarada_s","Nata montada azucarada spray","Pascual",305,2.3,12,28,0,[100,"ración","raciones"],"",0,0,"8410128050269",12],
    ["m_pascual_leche_desnatada_sin_lact","Leche desnatada sin lactosa","Pascual",34,3.4,4.8,0.1,0,[250,"vaso","vasos"],"",1,0,"8410128750046",4.8],
    ["m_pascual_mantequilla_original_tar","Mantequilla original tarrina","Pascual",745,0.7,1.1,82,0,[100,"ración","raciones"],"",0,0,"8410128000578",1.1],
    ["m_hacendado_carne_picada_de_vacuno","Carne picada de vacuno","Hacendado",190,18,2.4,12,0,[125,"ración","raciones"],"🥩",0,1,"8436569263242",0.5],
    ["m_hacendado_carne_picada_mixta_vacun","Carne picada mixta vacuno y cerdo","Hacendado",192,17,2,12,0,[125,"ración","raciones"],"🥩",0,1,"8421610134534",0.5],
    ["m_hacendado_burger_meat_de_vacuno","Burger meat de vacuno","Hacendado",182,17,0.9,12,0,[125,"ración","raciones"],"🥩",0,1,"8421610028680",0.8],
    ["m_hacendado_hamburguesa_de_lomo_de_v","Hamburguesa de lomo de vacuno","Hacendado",240,19,0.5,18,0,[120,"hamburguesa","hamburguesas"],"🍔",0,1,"8436569262924",0.5],
    ["m_hacendado_mini_hamburguesas_de_pol","Mini hamburguesas de pollo","Hacendado",123,16,1.6,5.8,0,[35,"hamburguesa","hamburguesas"],"🍗",0,1,"8436021418654",0],
    ["m_hacendado_albondigas_de_pollo","Albóndigas de pollo","Hacendado",167,17.9,1.4,9.6,1.6,[120,"ración","raciones"],"🍗",0,1,"8436000461732",0.1],
    ["m_heura_bocados_originales","Bocados originales","Heura",136,19.7,1.8,3,6.4,[100,"ración","raciones"],"🌱",0,0,"8437017032526",0],
    ["m_heura_burger_original","Burger original","Heura",180,19,4.6,8.8,4,[100,"ración","raciones"],"🌱",0,0,"8437017034872",0.9],
    ["m_heura_nuggets_originales","Nuggets originales","Heura",203,11,17,8.4,6.4,[100,"ración","raciones"],"🌱",0,0,"8437017034889",1.1],
    ["m_amix_protein_pizza","Protein Pizza","Amix",292,32,15.9,10.2,0,[100,"ración","raciones"],"",0,0,"8594060004723",1],
    ["m_amix_isolate_isoprime_cfm_cho","Isolate IsoPrime CFM chocolate","Amix",383,90,1.8,1.8,0,[100,"ración","raciones"],"",0,0,"8594159531109",1],
    ["m_amix_reco_pro_protein","Reco-pro protein","Amix",192,25,17.4,2.5,0,[100,"ración","raciones"],"",0,0,"8594159537651",2.5],
    ["m_amix_mcpro_fresa_yogur","McPRO fresa-yogur","Amix",380,26.1,42.1,11.4,0,[125,"unidad","unidades"],"",0,0,"8594159533615",38.2],
    ["m_amix_whey_pro_fusion_protein","Whey-pro fusion protein","Amix",373,75,7.8,4.7,0,[100,"ración","raciones"],"",0,0,"8594159534407",0],
    ["m_amix_zero_hero_high_protein_l","Zero Hero High Protein Low Sugar","Amix",395,33,31,18,5.6,[100,"ración","raciones"],"",0,0,"8594060005560",24],
    ["m_amix_pan_amix_amix","Pan amix amix","Amix",230,22.7,8.4,11.8,0,[100,"ración","raciones"],"",0,0,"8594159533714",2.1],
    ["m_amix_professional_pure_cfm_wh","Professional Pure CFM Whey Nitro Protein Isolate","Amix",379,90,2.1,1.2,0,[100,"ración","raciones"],"",0,0,"8594159537422",1],
    ["m_amix_predator_protein","Predator Protein","Amix",383,65,19.9,4.8,0,[100,"ración","raciones"],"",0,0,"8594159534575",0],
    ["m_amix_sauce_0_barbecue","Sauce 0% barbecue","Amix",5,0,1.2,0,0,[100,"ración","raciones"],"",0,0,"8594060005430",0],
    ["m_amix_high_protein_pancakes_mr","High protein pancakes 'Mr. Popper's'","Amix",387,41.5,32.4,9.3,0,[100,"ración","raciones"],"",0,0,"8594159530768",3.4],
    ["m_amix_hd_pro_cookies","HD- pro cookies","Amix",226,19.2,21,6.4,0,[100,"ración","raciones"],"",0,0,"8594159530638",19.8],
    ["m_amix_zero_pro_whey_native_iso","Zero pro whey native isolate","Amix",397,94.7,3,0.7,0,[100,"ración","raciones"],"",0,0,"8594060005737",0.2],
    ["m_amix_mcpro_protein_bar_milk_w","McPro, protein bar milk with cinnamon","Amix",375,27.1,42.4,10.3,0,[100,"ración","raciones"],"",0,0,"8594159533622",37.8],
    ["m_amix_whey_protein_black_cfm_i","Whey Protein Black CFM Isolate","Amix",369,85.7,4,1.4,0,[100,"ración","raciones"],"",0,0,"8594046790213",0.9],
    ["m_amix_zero_hero_high_protein","Zero hero high protein","Amix",424,31.5,32.4,17.4,0,[100,"ración","raciones"],"",0,0,"8594060005546",1.5],
    ["m_amix_protein_musli","Protein müsli","Amix",420,45.7,20.5,15.9,0,[100,"ración","raciones"],"",0,0,"8594060004990",10.1],
    ["m_arla_yogur_protein_strawberry","Yogur protein strawberry","Arla",72,10,6.6,0.2,0,[100,"ración","raciones"],"",0,0,"6413300018042",6.3],
    ["m_arla_yogur_protein_blueberry","Yogur protein Blueberry","Arla",71,10,6.4,0.2,0,[100,"ración","raciones"],"",0,0,"6413300018028",6],
    ["m_arla_kefir","Kefir","Arla",59,3.4,3.9,3,0,[250,"vaso","vasos"],"",1,0,"7310865690753",3.9],
    ["m_arla_protein_queso_cottage_ta","Protein queso cottage tarrina","Arla",82,15,2.2,1.5,0,[100,"ración","raciones"],"",0,0,"7310865099884",2],
    ["m_arla_queso_natural_light_fres","Queso natural light fresh cheese","Arla",192,8,3.2,16,0,[100,"ración","raciones"],"",0,0,"5711953158452",3.2],
    ["m_arla_queso_mozzarella","Queso mozzarella","Arla",301,24,3.2,21,0,[100,"ración","raciones"],"",0,0,"5760466896986",1],
    ["m_arla_queso_natural_cream_chee","Queso natural cream cheese","Arla",252,4.5,3,25,0,[100,"ración","raciones"],"",0,0,"5711953158421",3],
    ["m_arla_queso_rico_en_proteinas","Queso rico en proteínas","Arla",188,34,0.5,5,0,[100,"ración","raciones"],"",0,0,"5711953080746",0.5],
    ["m_arla_queso_gouda","Queso Gouda","Arla",353,24,0.1,28,0,[100,"ración","raciones"],"",0,0,"5711953013089",0.1],
    ["m_arla_queso_arla_havarti_chees","Queso arla Havarti Cheese","Arla",393,21.4,0,32.1,0,[100,"ración","raciones"],"",0,0,"0654858702816",null],
    ["m_arla_queso_cottage_cheese","Queso cottage cheese","Arla",99,14,1.7,4,0,[100,"ración","raciones"],"",0,0,"5760466401043",1.7],
    ["m_barilla_pan_biscotes_integrales_","Pan biscotes integrales original","Barilla",336,9,62,1.5,19,[100,"ración","raciones"],"",0,0,"7300400481595",1],
    ["m_barilla_pasta_spaghetti","Pasta spaghetti","Barilla",359,13,71,2,3,[100,"ración","raciones"],"",0,1,"8076800195057",3.5],
    ["m_barilla_pasta_spaghetti_integral","Pasta spaghetti integral","Barilla",347,13,64,2.5,8,[100,"ración","raciones"],"",0,1,"8076809529419",3.5],
    ["m_barilla_pasta_arrabbiata","Pasta arrabbiata","Barilla",60,1.4,5.5,3.1,2.2,[100,"ración","raciones"],"",0,0,"8076809513388",5],
    ["m_barilla_pasta_bolognese","Pasta bolognese","Barilla",86,4.2,7.5,4,1.5,[100,"ración","raciones"],"",0,0,"8076809513678",4.7],
    ["m_barilla_pan_bauletto_integrale","Pan Bauletto Integrale","Barilla",276,11.2,38.4,6.8,8.4,[100,"ración","raciones"],"",0,0,"8076809504751",7.2],
    ["m_barilla_galletas_pan_di_stelle","Galletas pan di stelle","Barilla",483,7.5,65,20.5,4,[100,"ración","raciones"],"",0,0,"8076809580748",23.5],
    ["m_barilla_galletas_cioccograno","Galletas cioccograno","Barilla",472,8,60,20.8,6.4,[100,"ración","raciones"],"",0,0,"8076809573757",22.4],
    ["m_barilla_pesto_alla_genovese","Pesto alla genovese","Barilla",452,4.7,9.8,46,5,[100,"ración","raciones"],"",0,0,"8076809579346",5.5],
    ["m_cola_cao_cola_cao_noir","Cola Cao Noir","Cola Cao",347,13,51,6.5,16,[100,"ración","raciones"],"",0,0,"8410014464941",4],
    ["m_cola_cao_cola_cao_puro","Cola Cao Puro","Cola Cao",345,27,18,11,33,[100,"ración","raciones"],"",0,0,"8410014466426",1],
    ["m_cola_cao_cacao_cola_cao_turbo_ins","Cacao Cola Cao Turbo Instant 750 gr","Cola Cao",69,3.3,10,1.7,0,[100,"ración","raciones"],"",0,0,"8410014820952",9.6],
    ["m_cola_cao_batido_colacao_energy","Batido colaCao Energy","Cola Cao",72,3.1,13,0.8,0.3,[250,"vaso","vasos"],"",1,0,"8410128191702",12],
    ["m_cola_cao_batido_cola_cao_shake","Batido cola Cao Shake","Cola Cao",80,3.9,12,1.5,0,[250,"vaso","vasos"],"",1,0,"8410128168209",11],
    ["m_cola_cao_batido_colacao_shake_0_a","Batido colaCao Shake 0% azúcares","Cola Cao",42,4,4.9,0.4,1.3,[100,"ración","raciones"],"",0,0,"8410128168230",4.7],
    ["m_cola_cao_cola_cao_0","Cola Cao 0%","Cola Cao",324,12,44,5.8,24,[100,"ración","raciones"],"",0,0,"8410014440716",3.5],
    ["m_cola_cao_colacao_en_polvo","ColaCao (en polvo)","Cola Cao",361,6.8,78,2.4,0,[15,"cucharada","cucharadas"],"",0,0,"8410014478900",70],
    ["m_cola_cao_cola_cao_avena_cao","Cola Cao Avena Cao","Cola Cao",58,3.8,8.6,0.7,0.8,[100,"ración","raciones"],"",0,0,"8410014439857",4.9],
    ["m_cola_cao_cereales_avena_cao","Cereales avena Cao","Cola Cao",342,11,57,5.5,11,[100,"ración","raciones"],"",0,1,"8410014449900",4],
    ["m_cola_cao_batido_cola_cao_energy","Batido cola Cao Energy","Cola Cao",65,3.3,11,0.8,0,[250,"vaso","vasos"],"",1,0,"8410128769031",11],
    ["m_cola_cao_cacao_cola_cao_con_pepit","Cacao Cola Cao Con Pepitas De Chocolate 360GRS +","Cola Cao",411,6,79,6.4,0,[100,"ración","raciones"],"",0,0,"8410014339256",0],
    ["m_cola_cao_colacao_complet","Colacao complet","Cola Cao",73,3.6,10.5,1.8,0,[100,"ración","raciones"],"",0,0,"8410014947024",9],
    ["m_cola_cao_colacao_original_en_polv","ColaCao Original (en polvo)","Cola Cao",378,6.8,78,2.4,0,[15,"cucharada","cucharadas"],"",0,0,"8410014213006",70],
    ["m_cola_cao_mi_primer_cola_cao","Mi primer Cola Cao","Cola Cao",365,6.5,76,2.5,0,[100,"ración","raciones"],"",0,0,"8410014448057",36],
    ["m_cola_cao_cola_cao_fibra","Cola Cao fibra","Cola Cao",244,9,45,3.1,0,[100,"ración","raciones"],"",0,0,"8410014201904",32],
    ["m_cola_cao_preparado_alimenticio_al","Preparado Alimenticio Al Cacao (en polvo)","Cola Cao",397,5.5,82,3.2,0,[100,"ración","raciones"],"",0,0,"8410014841308",77],
    ["m_cola_cao_colacao_crema","Colacao crema","Cola Cao",541,4.5,54,33,0,[15,"cucharada","cucharadas"],"",0,0,"8410014476104",51],
    ["m_cola_cao_colacao_0_azucares_anadi","ColaCao 0% azúcares añadidos","Cola Cao",51,3.7,7.1,0.6,0,[100,"ración","raciones"],"",0,0,"8410014483966",4.8],
    ["m_cola_cao_cola_cao_0_con_fibra","Cola Cao 0% con fibra","Cola Cao",54,3.7,7.1,0.6,0,[100,"ración","raciones"],"",0,0,"8410014326423",4.8],
    ["m_el_caserio_queso_lonchas","Queso lonchas","El Caserío",208,13,8.9,12,2.2,[100,"ración","raciones"],"",0,0,"8411620003050",6.3],
    ["m_el_caserio_queso_tranchetes","Queso tranchetes","El Caserío",208,14,8.9,12,0,[100,"ración","raciones"],"",0,0,"7622201520656",6.1],
    ["m_el_caserio_queso_fundido","Queso fundido","El Caserío",209,12,4.9,15,1.3,[100,"ración","raciones"],"",0,0,"8411620001155",4.9],
    ["m_el_caserio_queso_el_caserio","Queso el caserio","El Caserío",271,10,5.6,22.5,0,[100,"ración","raciones"],"",0,0,"7622210055828",5.6],
    ["m_el_caserio_queso_en_polvo_especial_","Queso en polvo especial pasta","El Caserío",280,22,4.2,18,3.7,[15,"cucharada","cucharadas"],"",0,0,"7622201107437",2.4],
    ["m_el_caserio_queso_fundido_light","Queso fundido light","El Caserío",151,13,5.5,7.5,3.4,[100,"ración","raciones"],"",0,0,"8411620001360",5.5],
    ["m_el_caserio_mezcla_de_4_quesos","Mezcla de 4 quesos","El Caserío",353,25,0.1,28,0.9,[100,"ración","raciones"],"",0,0,"7622201751456",null],
    ["m_el_caserio_queso_mozzarella_especia","Queso mozzarella especial Pizza Suaves","El Caserío",325,25,0.4,24,0.9,[100,"ración","raciones"],"",0,0,"7622201775032",0.4],
    ["m_el_caserio_queso_en_filatto","Queso en filatto","El Caserío",297,22,4.6,20,0,[100,"ración","raciones"],"",0,0,"7622201107680",0.7],
    ["m_el_caserio_lonchas_queso_light","Lonchas queso light","El Caserío",174,17,8,6.8,3.2,[100,"ración","raciones"],"",0,0,"7622300084356",5.8],
    ["m_el_caserio_queso_el_caserio_light","Queso el caserio light","El Caserío",233,13,5.9,16,5.1,[100,"ración","raciones"],"",0,0,"7622210055842",5.9],
    ["m_el_caserio_queso_fundido_sin_lactos","Queso fundido sin lactosa","El Caserío",245,14,0.4,20,0,[100,"ración","raciones"],"",0,0,"7622210739339",0.4],
    ["m_el_caserio_3_quesos_mozzarella_mass","3 Quesos. Mozzarella, Massdam, Cheddar","El Caserío",327,25,0.5,25,0.9,[100,"ración","raciones"],"",0,0,"7622201751432",0.5],
    ["m_el_caserio_4_quesos_especial_gratin","4 quesos especial gratinar","El Caserío",353,25,0.5,28,0,[100,"ración","raciones"],"",0,0,"7622300194659",0.5],
    ["m_el_caserio_queso_en_lonchas_sin_lac","Queso en lonchas sin lactosa","El Caserío",239,18,0.1,18,0,[100,"ración","raciones"],"",0,0,"7622210771810",0.1],
    ["m_el_caserio_queso_emmental","Queso Emmental","El Caserío",365,28.5,0,28,0,[100,"ración","raciones"],"",0,0,"7622201109288",0],
    ["m_el_caserio_el_caserio_queso_en_lonc","El Caserío queso en lonchas","El Caserío",205,13.5,8.4,12,0,[100,"ración","raciones"],"",0,0,"8411620003074",5.9],
    ["m_el_caserio_queso_rallado_especial_p","Queso rallado especial pasta","El Caserío",300,21,3.7,21,3.8,[100,"ración","raciones"],"",0,0,"7622300195052",0.7],
    ["m_el_caserio_queso_en_polvo","Queso en polvo","El Caserío",280,22.5,4.2,17.5,0,[15,"cucharada","cucharadas"],"",0,0,"7622201107376",2.4],
    ["m_el_caserio_caramelos_ligeros_dulce_","Caramelos ligeros dulce de leche","El Caserío",406,3.5,81.8,7.2,0,[100,"ración","raciones"],"",0,0,"8412968200903",4],
    ["m_helios_purafruta_mermelada_de_f","Purafruta mermelada de fresa de Huelva","Helios",139,0.8,32,0,0,[100,"ración","raciones"],"",0,0,"8410095038307",30],
    ["m_helios_salsa_de_tomate_casero","Salsa de tomate casero","Helios",67,0.1,8.2,3.8,0,[100,"ración","raciones"],"",0,0,"8410095007242",5.5],
    ["m_helios_pisto_estilo_casero","Pisto estilo casero","Helios",72,0.7,10.1,3.1,0.5,[100,"ración","raciones"],"",0,0,"8410095007273",6.7],
    ["m_helios_tomate_frito","Tomate Frito","Helios",92,1,14,3.3,1.3,[250,"vaso","vasos"],"",1,0,"8410095007013",10],
    ["m_helios_mermelada_extra_fresa_co","Mermelada extra fresa con azúcar de caña","Helios",197,0.5,48,0,0,[100,"ración","raciones"],"",0,0,"8410095041833",46.7],
    ["m_helios_purafruta_mermelada_de_a","Purafruta mermelada de albaricoque de Murcia","Helios",137,0.9,32,0,0,[100,"ración","raciones"],"",0,0,"8410095038321",30],
    ["m_helios_purafruta_de_melocoton","Purafruta de Melocotón","Helios",136,0.8,32,0,0,[100,"ración","raciones"],"",0,0,"8410095038314",30],
    ["m_helios_confitura_natural_de_fre","Confitura natural de fresa","Helios",246,0.4,60,0.2,1.1,[100,"ración","raciones"],"",0,0,"8410095507018",59],
    ["m_helios_tomate_tritura_natural","Tomate tritura natural","Helios",31,1.5,4.5,0.4,1.6,[100,"ración","raciones"],"",0,0,"8410095042847",3.7],
    ["m_helios_mermelada_de_melocoton","Mermelada de melocotón","Helios",180,0.5,44,0,0.8,[100,"ración","raciones"],"",0,0,"8410095001851",43.2],
    ["m_helios_mermelada_extra_de_meloc","Mermelada extra de melocotón ecológica con caña","Helios",196,0.5,48,0,0,[100,"ración","raciones"],"",0,0,"8410095041857",47.2],
    ["m_helios_mermelada_de_fresa_extra","Mermelada de fresa extra","Helios",235,0.4,58,0,0.8,[100,"ración","raciones"],"",0,0,"8410095040331",57.2],
    ["m_helios_mermelada_de_albaricoque","Mermelada de albaricoque extra","Helios",181,0.5,44,0,1.3,[100,"ración","raciones"],"",0,0,"8410095001806",42.7],
    ["m_helios_sirope_de_chocolate","Sirope de chocolate","Helios",325,2.1,75,1.1,3.4,[100,"ración","raciones"],"",0,0,"8410095009819",71.6],
    ["m_helios_mermelada_extra_mora","Mermelada Extra Mora","Helios",182,0.5,44,0,1.9,[100,"ración","raciones"],"",0,0,"8410095001936",42.1],
    ["m_helios_mermelada_extra_de_framb","Mermelada extra de frambuesa","Helios",178,0.9,42,0,0.8,[100,"ración","raciones"],"",0,0,"8410095001882",40.5],
    ["m_helios_confitura_natural","Confitura natural","Helios",245,0.5,60,0,0,[100,"ración","raciones"],"",0,0,"8410095507933",59],
    ["m_helios_sirope_de_fresa","Sirope de fresa","Helios",302,0.1,75,0,0.3,[250,"vaso","vasos"],"",1,0,"8410095009826",74.7],
    ["m_helios_mitades_de_melocoton_en_","Mitades de melocotón en almíbar","Helios",77,0.4,18.5,0.1,0,[100,"ración","raciones"],"",0,0,"8410095505595",18.1],
    ["m_helios_mermelada_de_manzana_ext","Mermelada de manzana extra","Helios",176,0.5,42,0.3,1.7,[100,"ración","raciones"],"",0,0,"8410095001844",39.6],
    ["m_hero_mermelada_de_fresas_de_t","Mermelada de fresas de temporada","Hero",219,0.6,53,0.1,1.5,[100,"ración","raciones"],"",0,0,"8410175032904",50],
    ["m_hero_temporada_melocotones_de","Temporada melocotones de Murcia","Hero",205,0.3,50,0.1,1.2,[100,"ración","raciones"],"",0,0,"8410175032911",47],
    ["m_hero_crema_de_arroz","Crema de arroz","Hero",384,8,85,1,1.1,[100,"ración","raciones"],"",0,0,"8410175073792",0.5],
    ["m_hero_snacks_cereales_y_hortal","Snacks cereales y hortalizas 100% eco-bio","Hero",407,7.6,74,7.8,4.9,[100,"ración","raciones"],"",0,0,"8410175073020",6.5],
    ["m_hero_barritas_muesly_avellana","Barritas muesly avellanas/Corny","Hero",429,6.4,63.2,15.6,4.8,[100,"ración","raciones"],"",0,0,"8410175062369",23.9],
    ["m_hero_muesly_chocolate_y_coco","Muesly chocolate y coco","Hero",473,5.3,58,24,5.8,[100,"ración","raciones"],"",0,0,"8410175062260",31],
    ["m_hero_mermelada_de_frambuesas_","Mermelada de frambuesas de temporada light","Hero",147,0.4,38,0.1,0,[100,"ración","raciones"],"",0,0,"8410175043481",35],
    ["m_hero_galletas_lirea_fibra","Galletas lirea fibra","Hero",304,4,54,5.8,0,[100,"ración","raciones"],"",0,0,"8410175065834",28],
    ["m_hero_frutos_secos","Frutos secos","Hero",556,17,38,36,5.9,[100,"ración","raciones"],"",0,0,"8410175074010",19],
    ["m_hero_classica_melocoton","Classica melocotón","Hero",192,0.3,47,0.1,0.5,[100,"ración","raciones"],"",0,0,"8410175069344",47],
    ["m_hero_mermelada_hero_frambuesa","Mermelada Hero Frambuesa","Hero",246,0.4,60,0.1,1.5,[100,"ración","raciones"],"",0,0,"8410175081872",59],
    ["m_hero_pasta_ravioli_al_huevo_c","Pasta ravioli al huevo con carne","Hero",88,2.2,13.2,2.5,1.9,[100,"ración","raciones"],"",0,0,"8410175042965",5.5],
    ["m_hero_classica_albaricoque","Classica albaricoque","Hero",206,0.7,50,0.2,1,[100,"ración","raciones"],"",0,0,"8410175069337",49],
    ["m_hero_barrita_de_cereales_con_","Barrita de cereales con chocolate con leche","Hero",456,6.3,67,18,3.3,[100,"ración","raciones"],"",0,0,"8410175062116",34],
    ["m_hero_mermelada_artesana_con_t","Mermelada artesana con trozos de fresas","Hero",217,0.4,53,0.2,0,[100,"ración","raciones"],"",0,0,"8410175075147",50],
    ["m_hero_mermelada_de_melocoton","Mermelada de melocoton","Hero",145,0.3,35,0.2,0,[100,"ración","raciones"],"",0,0,"8410175076892",35],
    ["m_hero_barrita_de_cereales_con_2","Barrita de cereales con chocolate","Hero",452,5.8,58,17,6,[100,"ración","raciones"],"",0,0,"8410175024640",33],
    ["m_hero_tomate_frito_receta_case","Tomate Frito - Receta Casera","Hero",86,1.4,13,3,0,[100,"ración","raciones"],"",0,0,"8410175090409",10],
    ["m_hero_classica_tomate","Classica tomate","Hero",235,0.6,60,0.1,1.7,[100,"ración","raciones"],"",0,0,"8410175069443",57],
    ["m_hero_confitura_de_cereza","Confitura de cereza","Hero",49,0.5,12.5,0.3,1.9,[100,"ración","raciones"],"",0,0,"8410175081421",7.2],
    ["m_hsn_nut_choco_protein_spread","Nut Choco Protein Spread Duo","HSN",565,21.1,33,38.7,0,[100,"ración","raciones"],"",0,0,"5056329504861",7.1],
    ["m_hsn_crema_de_cacahuete_100","Crema de cacahuete 100 %","HSN",579,29.6,11.6,46,8.5,[100,"ración","raciones"],"",0,0,"5060326272241",5.9],
    ["m_hsn_proteina_soja_aislada","Proteína soja aislada","HSN",377,76,6.9,2.8,0,[100,"ración","raciones"],"",0,0,"5060326270520",0.2],
    ["m_hsn_evowhey_2_0","Evowhey 2.0","HSN",367,76.7,6.3,3.3,0,[100,"ración","raciones"],"",0,0,"5060326270032",6],
    ["m_hsn_protein_bar","Protein bar","HSN",492,22,39,27,4.7,[100,"ración","raciones"],"",0,0,"5056329505738",1.9],
    ["m_hsn_harina_de_avena","Harina de avena","HSN",395,13,68,7,0,[100,"ración","raciones"],"",0,1,"5060326271688",0.8],
    ["m_hsn_harina_de_avena_sabor_ch","Harina de avena sabor chocolate","HSN",384,12,66,7.1,0,[100,"ración","raciones"],"",0,1,"5060326272456",1],
    ["m_hsn_premium_whey_protein","Premium whey protein","HSN",415,82,6.1,6.9,0,[100,"ración","raciones"],"",0,0,"5060326275969",5.7],
    ["m_hsn_galletas_oat_flour_choco","Galletas oAT Flour Choco Cookies","HSN",385,12,66,7.1,0,[100,"ración","raciones"],"",0,0,"5056329500887",1],
    ["m_hsn_oatflakes_copos_de_avena","OATflakes copos de avena integrales","HSN",370,16,54,7.5,11,[100,"ración","raciones"],"",0,0,"5060326278762",1.1],
    ["m_hsn_manteca_de_almendras","Manteca de almendras","HSN",650,25.4,6.5,55.8,0,[100,"ración","raciones"],"",0,0,"5060326272753",4],
    ["m_hsn_evowhey","Evowhey","HSN",362,74,6.5,3.8,0,[100,"ración","raciones"],"",0,0,"5060326271565",4.9],
    ["m_hsn_avena_vainilla_hsn","Avena vainilla HSN","HSN",389,12,68,6.9,0,[100,"ración","raciones"],"",0,1,"5060326272470",1],
    ["m_hsn_evolate_2_0_strawberry_w","Evolate 2.0 strawberry & white chocolate","HSN",379,90,2.2,1,0,[100,"ración","raciones"],"",0,0,"5060326275358",1.2],
    ["m_hsn_egg_white_powder","Egg white powder","HSN",362,86,4.5,0,0,[100,"ración","raciones"],"",0,0,"5060326274108",4.5],
    ["m_hsn_evowhey_2_0_galleta","Evowhey 2.0 Galleta","HSN",415,81,7,6.9,0,[100,"ración","raciones"],"",0,0,"5060326275860",5.7],
    ["m_hsn_aceite_de_coco_virgen","Aceite de Coco Virgen","HSN",862,0,0,100,0,[10,"cucharada","cucharadas"],"",0,0,"5060326273347",0],
    ["m_hsn_whey_protein_concentrate","Whey protein concentrate 80%","HSN",370,80,5.1,3.3,0,[100,"ración","raciones"],"",0,0,"5060326271954",5.1],
    ["m_hsn_sirope_caramelo_sin_azuc","Sirope Caramelo sin azúcar","HSN",10,0,1.3,0,0,[100,"ración","raciones"],"",0,0,"5060326274849",0],
    ["m_hsn_evowhey_2_0_proteina_en_","EvoWhey 2.0 Proteína en polvo Frutas del Bosque","HSN",362,79,7.3,3.2,0,[15,"cucharada","cucharadas"],"",0,0,"5060326275839",4.9],
    ["m_hsn_oat_flakes_copos_avena","Oat Flakes (Copos Avena)","HSN",370,14,54,7.5,0,[100,"ración","raciones"],"",0,0,"5060326278779",1.1],
    ["m_hsn_evobars_protein_bars","EvoBars Protein Bars","HSN",376,31,38,16,0,[100,"ración","raciones"],"",0,0,"5060326274962",3],
    ["m_hsn_mantequilla_cacahuete_en","Mantequilla cacahuete en polvo parcialmente","HSN",469,49,29,14,0,[15,"cucharada","cucharadas"],"",0,0,"5060326278793",15],
    ["m_hsn_evolate_2_0_whey_protein","Evolate 2.0 whey protein isolate","HSN",378,89,3.1,1,0,[100,"ración","raciones"],"",0,0,"5060326275310",1.2],
    ["m_hsn_evolate_2_0_whey_protein2","Evolate 2.0 Whey protein Isolate +","HSN",375,86,4,1.6,2,[100,"ración","raciones"],"",0,0,"5060326273415",1.3],
    ["m_hsn_100_whey_protein_isolate","100% Whey Protein Isolate","HSN",385,93,1.2,1,0,[100,"ración","raciones"],"",0,0,"5060326275297",1.2],
    ["m_hsn_harina_arroz_hsn","Harina, arroz hsn","HSN",370,9.3,81,1,0,[100,"ración","raciones"],"",0,1,"5060326272937",0],
    ["m_hsn_evowhey_2_0_vainilla_car","Evowhey 2.0 vainilla caribeña","HSN",414,82,6.5,6.9,0,[100,"ración","raciones"],"",0,0,"5060326272302",5.8],
    ["m_hsn_evowhey_2_0_chocolate_pe","Evowhey 2.0 chocolate & peanut butter","HSN",393,74,8.3,7.1,0,[100,"ración","raciones"],"",0,0,"5060326272814",5.2],
    ["m_hsn_evowhey_oats_capuchino_i","Evowhey & Oats Capuchino Italiano (en polvo)","HSN",395,43,39,6.9,0,[15,"cucharada","cucharadas"],"",0,0,"5060326279431",3.1],
    ["m_hsn_harina_de_almendra","Harina de almendra","HSN",650,26,10,54,0,[100,"ración","raciones"],"",0,1,"5056329505233",6.9],
    ["m_hsn_barbeque_honey","Barbeque Honey","HSN",34,2.2,5.9,0,0,[100,"ración","raciones"],"",0,0,"5056329521219",null],
    ["m_hsn_proteina_evowhey_2_0","Proteina Evowhey 2.0","HSN",373,77,6.2,4.5,0,[100,"ración","raciones"],"",0,0,"5060326272043",5.1],
    ["m_hsn_proteina_de_soja_isolate","Proteina de soja isolate 2.0","HSN",390,86,7.2,1,0,[100,"ración","raciones"],"",0,0,"5060326278038",0],
    ["m_hsn_egg_protein","Egg protein","HSN",349,80,5.6,0.7,0,[100,"ración","raciones"],"",0,0,"5060326277550",4.2],
    ["m_hsn_crema_de_anacardos","Crema de anacardos","HSN",659,20.6,18.9,55.5,0,[100,"ración","raciones"],"",0,0,"5060326274900",5.6],
    ["m_hsn_evowhey_2_0_protein_manz","Evowhey 2.0 protein manzana canela","HSN",415,81,7.7,6.8,0,[100,"ración","raciones"],"",0,0,"5060326272067",5.7],
    ["m_hsn_sirope_melocoton","Sirope melocoton","HSN",6,0.1,1.3,0,0,[100,"ración","raciones"],"",0,0,"5060326278496",0],
    ["m_hsn_caseina_micelar","Caseina micelar","HSN",364,85,2.5,1.5,0,[100,"ración","raciones"],"",0,0,"5060326273651",0],
    ["m_hsn_proteina_de_leche","Proteina de leche","HSN",381,90,1.5,1.5,0,[100,"ración","raciones"],"",0,0,"5060326276775",1.5],
    ["m_isabel_atun","Atun","Isabel",198,27,0,10,0,[100,"ración","raciones"],"",0,0,"8410111211202",0],
    ["m_isabel_atun_c_tomate_isabel","Atun C / Tomate Isabel","Isabel",155,17,2.7,8.5,0.4,[100,"ración","raciones"],"",0,0,"8410111000707",2],
    ["m_isabel_filetes_se_caballa","Filetes se caballa","Isabel",313,18,0,27,0,[100,"ración","raciones"],"",0,0,"8410111008079",0],
    ["m_isabel_mejillones_en_escabeche","Mejillones en escabeche","Isabel",163,20,2,8.5,0.4,[100,"ración","raciones"],"",0,0,"8410111762209",0],
    ["m_isabel_atun_claro_super_natural","Atún claro súper natural","Isabel",114,25,0,1.4,0,[100,"ración","raciones"],"",0,0,"8410111009229",0],
    ["m_isabel_filete_de_atun_con_tomat","Filete de atún con tomate y pimientos abrir y","Isabel",145,17,3.4,6.9,0.4,[100,"ración","raciones"],"",0,0,"8410111004750",2.6],
    ["m_isabel_caballa_tomate","Caballa Tomate","Isabel",155,17,2.4,8.7,0.3,[100,"ración","raciones"],"",0,0,"8410111373207",1.9],
    ["m_isabel_sardinas_en_aceite_de_ol","Sardinas en aceite de oliva","Isabel",200,23.5,0,12.4,0,[10,"cucharada","cucharadas"],"",0,0,"8410111603304",0],
    ["m_isabel_mejillones_en_salsa_de_v","Mejillones en salsa de vieira","Isabel",175,13,2.4,13,0,[100,"ración","raciones"],"",0,0,"8410111004101",1.8],
    ["m_isabel_mejillones_al_natural","Mejillones al natural","Isabel",102,17,1.9,3,0,[100,"ración","raciones"],"",0,0,"8410111004576",0],
    ["m_isabel_atun_claro_en_escabeche","Atún claro en escabeche","Isabel",139,25,0,4.2,0,[100,"ración","raciones"],"",0,0,"8410111126209",0],
    ["m_isabel_filetes_de_caballa_en_ac","Filetes DE Caballa EN Aceite Isabel","Isabel",204,24,0,12,0,[10,"cucharada","cucharadas"],"",0,0,"8410111353209",0],
    ["m_isabel_burger_de_atun","Burger de atún","Isabel",184,18,7.4,8.9,0,[100,"ración","raciones"],"",0,0,"8410111005092",2.2],
    ["m_isabel_albondigas_de_atun_con_t","Albóndigas de atún con tomate","Isabel",179,10,8.9,11,0,[100,"ración","raciones"],"",0,0,"8410111005771",5.5],
    ["m_isabel_filetes_de_anchoa_aceite","Filetes de anchoa aceite de oliva","Isabel",191,29,0,9.7,0,[10,"cucharada","cucharadas"],"",0,0,"8410111500306",0],
    ["m_isabel_filete_de_atun_con_tomat2","Filete de Atún con tomate","Isabel",155,17,3.5,8,0.6,[100,"ración","raciones"],"",0,0,"8410111004767",2.7],
    ["m_isabel_filetes_de_caballa_al_na","Filetes de caballa al natural al grill","Isabel",292,22,0,23,0,[100,"ración","raciones"],"",0,0,"8410111008086",0],
    ["m_isabel_mejillones_horeca_selecc","Mejillones Horeca seleccion","Isabel",163,20,2,8.3,0,[100,"ración","raciones"],"",0,0,"8410111009779",0],
    ["m_isabel_atun_con_mayonesa_ligera","Atún con mayonesa ligera","Isabel",284,11,2.3,26,0,[100,"ración","raciones"],"",0,0,"8410111009274",1.1],
    ["m_isabel_filete_atun_encebollado","Filete atun encebollado","Isabel",102,14.6,3.4,3.3,0,[100,"ración","raciones"],"",0,0,"8410111006457",2.5],
    ["m_kellogg_s_patatas_fritas_pringles_","Patatas fritas pringles original","Kellogg's",534,5.9,56,31,3.5,[100,"ración","raciones"],"",0,0,"5053990167807",1.4],
    ["m_kellogg_s_cereales_con_chips_de_ch","Cereales con chips de chocolate con avellanas","Kellogg's",497,8,57,25,5.8,[100,"ración","raciones"],"",0,0,"3159470005071",21],
    ["m_kellogg_s_crunchy_nut_corn_flakes_","Crunchy Nut Corn Flakes Cereal","Kellogg's",397,6,83.3,4.7,2.7,[100,"ración","raciones"],"",0,0,"5000127049307",36.7],
    ["m_kellogg_s_cereales_smacks","Cereales smacks","Kellogg's",377,7.1,81,1.6,5,[100,"ración","raciones"],"",0,0,"5053827101424",34],
    ["m_kellogg_s_cereales_froot_loops","Cereales froot Loops","Kellogg's",385,8.3,79,3,4.3,[100,"ración","raciones"],"",0,0,"5053827110679",25],
    ["m_kellogg_s_cereales_rice_krispies","Cereales rice krispies","Kellogg's",389,7,86,1.2,2.9,[100,"ración","raciones"],"",0,0,"5053827184717",7.9],
    ["m_kellogg_s_cereales_all_bran_choco","Cereales all-bran choco","Kellogg's",392,10,65,8,10,[100,"ración","raciones"],"",0,0,"5053827139335",19],
    ["m_kellogg_s_cereales_special_k_grano","Cereales special K Granola con avena Dark chocolate","Kellogg's",469,9.3,65,17,9.5,[100,"ración","raciones"],"",0,0,"5059319016603",13],
    ["m_kellogg_s_cereales_extra_chocolate","Cereales extra chocolate y avellanas","Kellogg's",491,8,55,25,7,[100,"ración","raciones"],"",0,0,"5053827139229",21],
    ["m_kellogg_s_cereales_krave_choco_nut","Cereales krave choco nut flavour","Kellogg's",456,7.1,69,16,3.6,[100,"ración","raciones"],"",0,0,"5059319002323",26],
    ["m_kellogg_s_cereales_nuts_granola_se","Cereales nuts, Granola & Seeds","Kellogg's",392,13,65,7,8.3,[100,"ración","raciones"],"",0,0,"5053827205566",12],
    ["m_kellogg_s_cereales_frosties","Cereales frosties","Kellogg's",375,4.5,87,0.6,2,[100,"ración","raciones"],"",0,0,"5053827185615",37],
    ["m_kellogg_s_cereales_special_k","Cereales special K","Kellogg's",392,8,84,1.3,6,[100,"ración","raciones"],"",0,0,"5059319025841",15],
    ["m_kellogg_s_cereales_special_k_origi","Cereales special K original","Kellogg's",375,9,79,1.5,4.5,[100,"ración","raciones"],"",0,0,"5050083934100",15],
    ["m_kellogg_s_cereales_choco_krispies","Cereales choco Krispies","Kellogg's",386,6.3,84,1.9,3.8,[100,"ración","raciones"],"",0,0,"5053827207621",17],
    ["m_kellogg_s_cereales_special_k_mixed","Cereales special K Mixed Berries","Kellogg's",451,9.3,67,14,10,[100,"ración","raciones"],"",0,0,"5059319016573",11],
    ["m_kellogg_s_cereales_all_bran_golden","Cereales all-bran Golden Crunch","Kellogg's",407,7.6,63,11,13,[100,"ración","raciones"],"",0,0,"5050083563133",21],
    ["m_kellogg_s_cereales_granola","Cereales granola","Kellogg's",449,9,56,19,9.2,[100,"ración","raciones"],"",0,0,"5053827215978",13],
    ["m_kellogg_s_cereales_all_bran_flakes","Cereales all bran flakes","Kellogg's",359,12,65,2.6,14,[100,"ración","raciones"],"",0,0,"5000127061828",14],
    ["m_kellogg_s_cereales_all_bran_fibra_","Cereales all Bran Fibra Plus","Kellogg's",334,14,48,3.5,27,[100,"ración","raciones"],"",0,0,"5059319007731",18],
    ["m_kellogg_s_cereales_special_k_prote","Cereales special k Protein berries, granola & seeds","Kellogg's",371,12,69,3.2,8.9,[100,"ración","raciones"],"",0,0,"5053827205665",14],
    ["m_kellogg_s_cereales_extra_choccolat","Cereales extra choccolato al latte","Kellogg's",484,7,62,22,4.9,[100,"ración","raciones"],"",0,0,"5053827182225",25],
    ["m_kellogg_s_cereales_coco_pops","Cereales coco pops","Kellogg's",382,6.3,84,1.9,0,[100,"ración","raciones"],"",0,0,"5050083545221",17],
    ["m_kellogg_s_cereales_extra_original","Cereales extra Original","Kellogg's",479,8,59,22,6.7,[100,"ración","raciones"],"",0,0,"5053827187466",19],
    ["m_kellogg_s_cereales_miel_pops","Cereales miel pops","Kellogg's",380,5.4,85,1.1,4,[100,"ración","raciones"],"",0,0,"5053827201452",27],
    ["m_kellogg_s_cereales_all_bran_fruit_","Cereales all-Bran Fruit'n'Fibre","Kellogg's",380,8,69,6,9,[100,"ración","raciones"],"",0,0,"5000127077225",24],
    ["m_kellogg_s_cereales_dark_chocolate","Cereales dark Chocolate","Kellogg's",394,8.4,72,5.9,5.1,[100,"ración","raciones"],"",0,0,"5053827148733",20],
    ["m_kellogg_s_cereales_coco_krispies","Cereales coco Krispies","Kellogg's",377,9,75,2.5,5,[100,"ración","raciones"],"",0,0,"5053827201124",27],
    ["m_kellogg_s_cereales_special_k_dark_","Cereales special K dark chocolate","Kellogg's",424,8.2,81,6.1,6,[100,"ración","raciones"],"",0,0,"5059319026176",17],
    ["m_kellogg_s_chocolate_negro","Chocolate Negro","Kellogg's",394,6.8,67,9.2,9.6,[100,"ración","raciones"],"",0,0,"5050083172007",28],
    ["m_la_vieja_f_mermelada_de_fresas","Mermelada de fresas","La Vieja Fábrica",211,0.4,52,0,0,[100,"ración","raciones"],"",0,0,"8414555003003",52],
    ["m_la_vieja_f_mermelada_de_melocoton","Mermelada de melocotón","La Vieja Fábrica",226,0.6,55,0,0,[100,"ración","raciones"],"",0,0,"8414555008008",55],
    ["m_la_vieja_f_mermelada_de_frutas_del_","Mermelada de frutas del bosque","La Vieja Fábrica",205,0.6,50,0,0,[100,"ración","raciones"],"",0,0,"8414555045003",50],
    ["m_la_vieja_f_mermelada_de_frambuesas","Mermelada de frambuesas","La Vieja Fábrica",210,0.6,50,0,0,[100,"ración","raciones"],"",0,0,"8414555004000",50],
    ["m_la_vieja_f_mermelada_de_naranja_ama","Mermelada de naranja amarga","La Vieja Fábrica",263,0.4,65,0,0,[100,"ración","raciones"],"",0,0,"8414555002006",65],
    ["m_la_vieja_f_mermelada_de_albaricoque","Mermelada de albaricoque","La Vieja Fábrica",224,0.3,55,0,0,[100,"ración","raciones"],"",0,0,"8414555005007",55],
    ["m_la_vieja_f_crema_de_avellanas_al_ca","Crema de avellanas al cacao","La Vieja Fábrica",550,5.5,54,34,2.8,[100,"ración","raciones"],"",0,0,"8410134022816",53],
    ["m_la_vieja_f_mermelada_de_fresas_diet","Mermelada De Fresas Diet","La Vieja Fábrica",171,0.4,42,0,0,[100,"ración","raciones"],"",0,0,"8410134019397",42],
    ["m_la_vieja_f_mermelada_frutas_del_bos","Mermelada frutas del bosque","La Vieja Fábrica",158,0.8,38.1,0,0,[100,"ración","raciones"],"",0,0,"8410134023844",38.1],
    ["m_la_vieja_f_mermelada_de_melocoton_s","Mermelada de Melocotón, Sin Azúcar","La Vieja Fábrica",135,1,35.5,0,0,[100,"ración","raciones"],"",0,0,"8410134023639",35.5],
    ["m_la_vieja_f_naranja_amarga_cero_azuc","Naranja amarga cero azucar","La Vieja Fábrica",180,1,45.5,0,0,[100,"ración","raciones"],"",0,0,"8410134023653",45.5],
    ["m_la_vieja_f_mermelada_de_mora_de_zar","Mermelada de mora de zarza","La Vieja Fábrica",215,0.5,52,0,0,[100,"ración","raciones"],"",0,0,"8414555012005",52],
    ["m_la_vieja_f_mermelada_de_fresas_sin_","Mermelada de fresas sin trozos","La Vieja Fábrica",214,1,52,0,0,[100,"ración","raciones"],"",0,0,"8410134023660",52],
    ["m_la_vieja_f_mermelada_arandanos_viej","Mermelada Arandanos Vieja Fca.","La Vieja Fábrica",220,0.7,52,0,0,[100,"ración","raciones"],"",0,0,"8410134017171",52],
    ["m_la_vieja_f_fresas_mermelada","Fresas mermelada","La Vieja Fábrica",177,1,42,0,0,[100,"ración","raciones"],"",0,0,"8410134023622",42],
    ["m_la_vieja_f_mermelada_de_cerezas","Mermelada de cerezas","La Vieja Fábrica",218,0.2,55,0,0,[100,"ración","raciones"],"",0,0,"8410134022885",55],
    ["m_la_vieja_f_diet_mermelada_de_pina","Diet mermelada de piña","La Vieja Fábrica",168,0.7,40,0,0,[100,"ración","raciones"],"",0,0,"8410134019472",40],
    ["m_la_vieja_f_mermelada_de_tomate","Mermelada de tomate","La Vieja Fábrica",214,0.4,53,0,0,[100,"ración","raciones"],"",0,0,"8410134019939",53],
    ["m_la_vieja_f_mermelada_de_mandarina_s","Mermelada de mandarina sin trozos","La Vieja Fábrica",212,1,52,0,0,[100,"ración","raciones"],"",0,0,"8410134023714",52],
    ["m_la_vieja_f_mermelada_mora_de_zarza","Mermelada mora de zarza","La Vieja Fábrica",174,0.5,42,0,0,[100,"ración","raciones"],"",0,0,"8410134019465",42],
    ["m_lindt_excellence_85_cacao2","Excellence 85% cacao","Lindt",584,12.5,22,46,0,[100,"ración","raciones"],"",0,0,"3046920022606",15],
    ["m_lindt_excellence_suave_70_caca","Excellence suave 70% cacao","Lindt",605,6.9,33,48,0,[100,"ración","raciones"],"",0,0,"3046920029780",29],
    ["m_lindt_excellence_99_cacao_noir","Excellence 99% Cacao Noir Absolu","Lindt",573,14,10,49,0,[100,"ración","raciones"],"",0,0,"3046920028721",1],
    ["m_lindt_excellence_78_cacao","Excellence 78% cacao","Lindt",569,10,24,46,0,[100,"ración","raciones"],"",0,0,"3046920010047",17],
    ["m_lindt_excellence_100_cacao","Excellence 100% cacao","Lindt",614,13,11,54,0,[100,"ración","raciones"],"",0,0,"3046920016377",0.5],
    ["m_lindt_lindor_leche","Lindor Leche","Lindt",623,5,44,47,0,[100,"ración","raciones"],"",0,0,"8003340073545",42],
    ["m_lindt_lindt_excellence_orange_","Lindt Excellence Orange Amandes 70% cacao noir","Lindt",581,6.8,35,44,0,[100,"ración","raciones"],"",0,0,"7610400090940",32],
    ["m_milka_galletas_choco_pause","Galletas choco pause","Milka",504,5.7,65,24,2.7,[100,"ración","raciones"],"",0,0,"7622210100917",35],
    ["m_milka_galletas_choco_wafer","Galletas choco Wafer","Milka",535,6.7,56,31,2.8,[100,"ración","raciones"],"",0,0,"7622300292508",43],
    ["m_milka_galletas_choco_mini_star","Galletas choco Mini Stars","Milka",510,7.1,63,25,2,[100,"ración","raciones"],"",0,0,"7622300441715",35],
    ["m_milka_chocolate_milka_blanco","Chocolate Milka blanco","Milka",534,4.2,65,28,0,[100,"ración","raciones"],"",0,0,"4025700001962",65],
    ["m_milka_galletas_choco_sticks","Galletas choco sticks","Milka",505,7.7,63,24,2.6,[100,"ración","raciones"],"",0,0,"7622210406354",35],
    ["m_milka_crema_milka_untable","Crema Milka Untable","Milka",552,3.8,57,34,2.1,[100,"ración","raciones"],"",0,0,"7622201515027",57],
    ["m_milka_galletas_milka_cake_and_","Galletas milka cake and choc","Milka",429,5.4,56.5,21,1.5,[100,"ración","raciones"],"",0,0,"7622210295965",31],
    ["m_milka_chocolate_con_leche","Chocolate con leche","Milka",530,6.3,59,29,1.8,[100,"ración","raciones"],"",0,0,"7622201024277",58],
    ["m_myprotein_protein_spread","Protein spread","Myprotein",540,21,29,41,2.5,[100,"ración","raciones"],"",0,0,"5056185748744",6],
    ["m_myprotein_extra_cookie","Extra Cookie","Myprotein",428,50.7,26.7,13.2,2.3,[100,"ración","raciones"],"",0,0,"5055534314890",9.7],
    ["m_myprotein_vegan_protein_bar","Vegan Protein Bar","Myprotein",454,26,26,26,9.1,[100,"ración","raciones"],"",0,0,"5055936868502",18],
    ["m_myprotein_golden_layered_protein_b","Golden Layered Protein Bar","Myprotein",374,33,27,15,0,[100,"ración","raciones"],"",0,0,"5056307356666",5],
    ["m_myprotein_crema_de_cacao_protein_s","Crema de cacao protein Spread","Myprotein",519,21,33,37,2.7,[100,"ración","raciones"],"",0,0,"5056185785411",7.3],
    ["m_myprotein_protein_pancake_mix_cook","Protein Pancake Mix Cookies & Cream","Myprotein",320,61,10.6,3.2,1.1,[100,"ración","raciones"],"",0,0,"5056307397768",3.8],
    ["m_myprotein_goodey_filled_cookie","Goodey filled cookie","Myprotein",373,26,40,15,0,[100,"ración","raciones"],"",0,0,"5056379583519",4],
    ["m_myprotein_impact_native_whey_isola","Impact Native Whey Isolate","Myprotein",379,85,3.7,2.3,0,[100,"ración","raciones"],"",0,0,"5056307398963",2.9],
    ["m_myprotein_proteina_fresa_nata","Proteina fresa nata","Myprotein",390,76,8.7,6,0,[100,"ración","raciones"],"",0,0,"5056307387622",6.1],
    ["m_nesquik_nesquik_cereales","Nesquik cereales","Nesquik",377,8.5,75.2,2.8,8.6,[15,"cucharada","cucharadas"],"",0,0,"7613035144699",22.4],
    ["m_nesquik_nesquik_chocolate_flavou","Nesquik Chocolate Flavour","Nesquik",76,4,10.2,2,0.5,[100,"ración","raciones"],"",0,0,"7613031513031",9.9],
    ["m_nestle_ricore_original_cafe_y_a","Ricoré, original, café y achicoria","Nestlé",141,2.7,9.1,0.5,45.3,[100,"ración","raciones"],"",0,0,"3033710073467",9.1],
    ["m_nestle_cereales_chocapic","Cereales chocapic","Nestlé",388,8.8,73.6,4.8,7.5,[100,"ración","raciones"],"",0,0,"7613034947611",22.4],
    ["m_nestle_cereales_original_shredd","Cereales oRIGINAL Shredded Wheat®","Nestlé",360,12.2,66.7,2.2,12.2,[100,"ración","raciones"],"",0,0,"7613031473113",0.7],
    ["m_nestle_cereales_cheerios_avena","Cereales cheerios avena","Nestlé",381,10.4,65.7,6.3,10.3,[100,"ración","raciones"],"",0,0,"5900020036988",9],
    ["m_nestle_nescafe_classic_natural","Nescafé classic natural","Nestlé",2,0.2,0.1,0,0.7,[250,"vaso","vasos"],"",1,0,"8410100020549",0.1],
    ["m_nestle_chocolate_con_leche","Chocolate con Leche","Nestlé",542,6.2,58.9,30.8,1.8,[100,"ración","raciones"],"",0,0,"7613035268388",57.8],
    ["m_nestle_cereales_original_avena_","Cereales original Avena y Trigo Integral","Nestlé",368,9.4,74.8,1.8,7.6,[100,"ración","raciones"],"",0,0,"3387390335217",10.8],
    ["m_nestle_cereales_granola_miele","Cereales granola Miele","Nestlé",429,8.7,65,13.3,7,[100,"ración","raciones"],"",0,0,"7613035619456",18],
    ["m_nestle_cereales_crunchy_miel_na","Cereales cRUNCHY Miel NAT","Nestlé",385,9.1,76.5,3.1,7.5,[100,"ración","raciones"],"",0,0,"5900020040534",19.3],
    ["m_nestle_cereales_chocolate_con_l","Cereales chocolate con Leche","Nestlé",399,8.5,71,7.5,7,[100,"ración","raciones"],"",0,0,"3387390326468",20],
    ["m_nestle_nescafe_strong_3in1","Nescafe strong 3in1","Nestlé",405,1.7,76,9.3,5.4,[250,"vaso","vasos"],"",1,0,"7613038158884",60],
    ["m_nestle_dolca_chocolate_negro","Dolca chocolate negro","Nestlé",516,5.7,58.4,27.3,6.9,[100,"ración","raciones"],"",0,0,"7613036723671",54.6],
    ["m_nestle_cereales_fitness_choco_b","Cereales fitness choco banana","Nestlé",378,6.3,70,7.4,0,[100,"ración","raciones"],"",0,0,"5900020033956",23],
    ["m_nocilla_crema_de_cacao_noir","Crema de cacao noir","Nocilla",533,4.6,54,32,5.3,[100,"ración","raciones"],"",0,0,"8410014486097",51],
    ["m_nocilla_crema_de_cacao_original","Crema de cacao original","Nocilla",546,5,58,32,3,[100,"ración","raciones"],"",0,0,"8410014477743",56],
    ["m_nocilla_crema_de_cacao_chocomix","Crema de cacao chocoMix","Nocilla",539,4.2,60,31,1.8,[100,"ración","raciones"],"",0,0,"8410014477750",59],
    ["m_nocilla_nocilla_leche_y_avellana","Nocilla Leche y avellanas","Nocilla",544,4,62,31,0.6,[100,"ración","raciones"],"",0,0,"8410014478436",61],
    ["m_nocilla_cookies_cream","Cookies & cream","Nocilla",537,4.6,62,30,0.5,[100,"ración","raciones"],"",0,0,"8410014493392",59],
    ["m_nocilla_galletas_cookies","Galletas cookies","Nocilla",489,6.3,63,23,2.5,[100,"ración","raciones"],"",0,0,"8410014482358",38],
    ["m_nocilla_crema_de_cacao_nocilla_d","Crema de cacao nocilla duo","Nocilla",550,4.5,60,32,1.8,[100,"ración","raciones"],"",0,0,"8410014477460",58],
    ["m_nocilla_galletas_nocilla_cookies","Galletas nocilla Cookies Mini","Nocilla",504,6.6,62,25,2.5,[100,"ración","raciones"],"",0,0,"8410014495624",38],
    ["m_nocilla_crema_de_cacao_y_avellan","Crema de cacao y avellanas bocabajo sin aceite de","Nocilla",551,5,57,33,3,[10,"cucharada","cucharadas"],"",0,0,"8410014459169",55],
    ["m_nocilla_nocilla_batido_de_chocol","Nocilla batido de chocolate","Nocilla",76,3.7,11,1.8,0,[250,"vaso","vasos"],"",1,0,"8410128192389",11],
    ["m_nocilla_crema_de_cacao_nocilla_f","Crema de cacao nocilla formato ahorro","Nocilla",546,4.5,59,32,0,[100,"ración","raciones"],"",0,0,"8410014351159",58],
    ["m_nocilla_nocilla_original_sticks","Nocilla Original Sticks","Nocilla",503,7.2,63,24,3,[100,"ración","raciones"],"",0,0,"8410014459077",38],
    ["m_nocilla_sticks_nocilla","Sticks Nocilla","Nocilla",495,6.8,64,23,2.4,[100,"ración","raciones"],"",0,0,"8410014494306",40],
    ["m_nocilla_crema_de_cacao_nocilla_s","Crema de cacao nocilla sticks","Nocilla",499,7.2,62,24,0,[100,"ración","raciones"],"",0,0,"8410014465467",39],
    ["m_nocilla_galletas_cookies_nocilla","Galletas cookies Nocilla blanca","Nocilla",490,5.5,66,22,1.9,[100,"ración","raciones"],"",0,0,"8410014482365",46],
    ["m_nocilla_crema_de_cacao_nocilla_c","Crema de cacao nocilla Chocaleche","Nocilla",544,4.5,60,32,0,[100,"ración","raciones"],"",0,0,"8410014452184",58],
    ["m_nocilla_sandwiach_xxl_nocilla","Sandwiach XXL Nocilla","Nocilla",299,4.7,34,15,0,[100,"ración","raciones"],"",0,0,"8711327596245",24],
    ["m_nocilla_mini_cookies_nocilla","Mini Cookies Nocilla","Nocilla",499,5.3,65,24,0,[100,"ración","raciones"],"",0,0,"8410014482402",44],
    ["m_nocilla_crema_de_cacao_ideal_par","Crema DE Cacao Ideal Para Crepes Nocilla","Nocilla",550,5,57,33,0,[100,"ración","raciones"],"",0,0,"8410014336811",55],
    ["m_nocilla_crema_cacao_nocisticks_n","Crema Cacao Nocisticks Nocilla","Nocilla",491,6.8,63,23,0,[100,"ración","raciones"],"",0,0,"8410014856340",40],
    ["m_nutella_galletas_biscuits","Galletas biscuits","Nutella",515,7.9,64,24.8,0,[100,"ración","raciones"],"",0,0,"8000500359358",35.8],
    ["m_nutella_crema_de_cacao_nutella_h","Crema de cacao nutella Hazelnut Spread","Nutella",533,6.7,60,30,0,[100,"ración","raciones"],"",0,0,"80051671",53.3],
    ["m_oikos_yogur_griego_con_melocot","Yogur griego con melocotón","Oikos",138,2.7,13.1,8.2,0,[125,"unidad","unidades"],"",0,0,"8410500025410",12.5],
    ["m_oikos_yogur_oiko_sabor_coco","Yogur oiko sabor coco","Oikos",158,3,14.7,9.7,0,[100,"ración","raciones"],"",0,0,"8410500027773",14.3],
    ["m_oikos_yogur_oikos_griego_marac","Yogur oikos griego maracuya","Oikos",146,2.8,15,8.2,0,[100,"ración","raciones"],"",0,0,"8410500025427",14.5],
    ["m_oikos_yogur_griego_natural","Yogur griego natural","Oikos",95,7.9,8.1,3.4,0,[100,"ración","raciones"],"",0,0,"7506443101593",4.4],
    ["m_optimum_nu_proteina_optimum_nutriti","Proteina Optimum Nutrition Whey Gold Standard","Optimum Nutrition",372,75,6.9,4.7,2.5,[100,"ración","raciones"],"",0,0,"5060469988511",4.1],
    ["m_optimum_nu_gold_standard_whey","Gold standard whey","Optimum Nutrition",372,79,5.8,3.8,0,[100,"ración","raciones"],"",0,0,"5060469985169",3.9],
    ["m_optimum_nu_gold_standard_100_whey2","Gold standard 100% whey","Optimum Nutrition",374,76,5.3,4.6,2.3,[100,"ración","raciones"],"",0,0,"5060469989303",3.2],
    ["m_optimum_nu_whey_gold_standard","Whey Gold Standard","Optimum Nutrition",378,82,5.5,3.3,0,[100,"ración","raciones"],"",0,0,"5060469985190",4.2],
    ["m_optimum_nu_whey_gold_standard_2_2_k","Whey Gold Standard (2,2 KG) Optimum Nutrition","Optimum Nutrition",363,80.4,7.8,2.5,0.2,[100,"ración","raciones"],"",0,0,"0748927028683",4.2],
    ["m_optimum_nu_gold_standard_100_whey_e","Gold Standard 100% Whey Extreme Milk Chocolate","Optimum Nutrition",387,77.4,6.5,4.8,0,[100,"ración","raciones"],"",0,0,"0748927024111",6.5],
    ["m_oreo_cereales_oreo_o_s","Cereales oreo O'S","Oreo",382,7.5,80,2.7,3.9,[100,"ración","raciones"],"",0,0,"5010029227062",27],
    ["m_oreo_galletas_original","Galletas original","Oreo",476,5.3,68,20,2.7,[100,"ración","raciones"],"",0,0,"7622300744663",38],
    ["m_oreo_galletas_original_family","Galletas original family format","Oreo",474,5.4,68,19,2.7,[100,"ración","raciones"],"",0,0,"7622300315269",38],
    ["m_oreo_galletas_oreo_crunchy_bi","Galletas oreo Crunchy Bites Pouch","Oreo",501,4.9,64,24,0,[100,"ración","raciones"],"",0,0,"7622210638021",46],
    ["m_oreo_milka_oreo","Milka - Oreo","Oreo",564,4.8,56,35,1.6,[100,"ración","raciones"],"",0,0,"7622300650339",49],
    ["m_oreo_galletas_oreo_banadas_ch","Galletas oreo Bañadas chocolate blanco","Oreo",532,4.9,70,25,1.3,[100,"ración","raciones"],"",0,0,"7622300491161",51],
    ["m_oreo_galletas_oreo_strawberry","Galletas oreo Strawberry Cheesecake","Oreo",479,5.2,69,20,3,[100,"ración","raciones"],"",0,0,"7622210633354",37],
    ["m_oreo_galletas_golden_oreo","Galletas golden Oreo","Oreo",484,5.3,69,20,1.7,[100,"ración","raciones"],"",0,0,"7622210625243",35],
    ["m_oreo_galletas_de_chocolate_re","Galletas de chocolate rellenas de crema bañadas","Oreo",530,5.2,69,25,2.6,[100,"ración","raciones"],"",0,0,"7622300491215",49],
    ["m_oreo_galletas_oreo_remix","Galletas oreo Remix","Oreo",496,4.2,67,23,2.1,[100,"ración","raciones"],"",0,0,"7622201501112",43],
    ["m_oreo_oreo_remix_fresa_nata","Oreo Remix Fresa-Nata","Oreo",493,4.2,67,22,2.1,[100,"ración","raciones"],"",0,0,"7622201501143",43],
    ["m_oreo_galletas_oreo","Galletas oreo","Oreo",490,5.3,63.3,23,2.7,[100,"ración","raciones"],"",0,0,"7622300864958",40],
    ["m_oreo_galletas_mini_golden_ore","Galletas mini golden oreo","Oreo",484,4.9,70,20,0,[100,"ración","raciones"],"",0,0,"7622201410483",35],
    ["m_oreo_galletas_limited_edition","Galletas limited Edition Oreo Peanut Butter Flavour","Oreo",480,5.8,66,20.5,3.3,[100,"ración","raciones"],"",0,0,"7622210449627",34],
    ["m_oreo_galletas_choc_o_brownie_","Galletas choc'o Brownie Flavour","Oreo",473,5.6,67,20,3.8,[100,"ración","raciones"],"",0,0,"7622210776167",35],
    ["m_oreo_batido_milkshake_with_or","Batido milkshake with Oreo toppings","Oreo",84,3.7,11,2.7,0,[250,"vaso","vasos"],"",1,0,"8410128670733",9],
    ["m_philadelph_queso_original","Queso original","Philadelphia",280,4.5,2.7,27.5,0.1,[100,"ración","raciones"],"",0,0,"7622210103673",2.7],
    ["m_philadelph_queso_light_familiar","Queso light Familiar","Philadelphia",154,5.9,4.1,12,0.4,[100,"ración","raciones"],"",0,0,"7622210103505",4],
    ["m_philadelph_queso_philadelphia_light","Queso philadelphia Light","Philadelphia",147,7.3,5,10.7,0.4,[100,"ración","raciones"],"",0,0,"7622300719302",5],
    ["m_philadelph_queso_philadelphia","Queso philadelphia","Philadelphia",249,3.7,2.8,25,0.2,[100,"ración","raciones"],"",0,0,"7622210103352",2.8],
    ["m_philadelph_queso_philadelphia_vegan","Queso philadelphia vegan cream cheese","Philadelphia",219,3.2,2.5,21,1.5,[100,"ración","raciones"],"",0,0,"7622201745752",0.8],
    ["m_philadelph_crema_de_queso_natural_p","Crema de queso natural para untar sin lactosa","Philadelphia",221,5.4,3.2,21,0.2,[100,"ración","raciones"],"",0,0,"7622210440914",3.2],
    ["m_philadelph_queso_original_cream_che","Queso original Cream Cheese","Philadelphia",357,7.1,3.6,35.7,0,[100,"ración","raciones"],"",0,0,"0021000612239",3.6],
    ["m_philadelph_queso_con_finas_hierbas","Queso con Finas Hierbas","Philadelphia",142,7.2,5.3,10,0.4,[100,"ración","raciones"],"",0,0,"7622210981141",5.3],
    ["m_president_mantequilla_ligera","Mantequilla Ligera","Président",375,0.8,3,40,0,[100,"ración","raciones"],"",0,0,"3228022000298",0],
    ["m_president_queso_le_brie","Queso le Brie","Président",347,17,0.5,31,0,[100,"ración","raciones"],"",0,0,"3228020232028",0.5],
    ["m_president_medallones_de_queso_de_c","Medallones de queso de cabra","Président",242,16,1.8,19,0,[100,"ración","raciones"],"",0,0,"3228024910113",1.8],
    ["m_president_queso_crema_de_camembert","Queso crema de Camembert","Président",258,12,2,22,0,[100,"ración","raciones"],"",0,0,"3228021000145",2],
    ["m_president_crema_de_queso_semicurad","Crema de queso semicurado para untar tarrina","Président",292,12,2.4,26,0,[100,"ración","raciones"],"",0,0,"3228022040195",2.4],
    ["m_president_leche_entera_president","Leche entera President","Président",63,3,4.7,3.6,0,[250,"vaso","vasos"],"",1,0,"8410285127613",4.7],
    ["m_prozis_crema_de_cacao_choco_but","Crema de cacao choco Butter","Prozis",516,21,33,37,2.7,[100,"ración","raciones"],"",0,0,"5600854623384",7.3],
    ["m_prozis_peanut_butter_chocolate_","Peanut butter chocolate smooth","Prozis",621,24,15,50,7.7,[100,"ración","raciones"],"",0,0,"5600961117561",11],
    ["m_prozis_cereales_chocolate_prote","Cereales chocolate Protein Muesli","Prozis",422,31,36,15,9.5,[100,"ración","raciones"],"",0,0,"5600961148237",7.8],
    ["m_prozis_instant_oats_cookies_fla","Instant Oats - Cookies flavour","Prozis",389,12,68,6.8,4.1,[15,"cucharada","cucharadas"],"",0,0,"5600380892841",1.3],
    ["m_prozis_protein_bar","Protein Bar","Prozis",402,29,40,13,4.7,[100,"ración","raciones"],"",0,0,"5600499500507",16],
    ["m_prozis_cereales_oat_porrige","Cereales oat Porrige","Prozis",401,13,68,6.9,7.2,[100,"ración","raciones"],"",0,0,"5600499567203",1.3],
    ["m_prozis_zero_bar","Zero BAR","Prozis",345,29,23,14,20,[100,"ración","raciones"],"",0,0,"5600499502044",3.2],
    ["m_prozis_real_whey","Real Whey","Prozis",399,76,6.7,7.6,0,[100,"ración","raciones"],"",0,0,"5600380897402",3],
    ["m_prozis_protein_gourmet_bar","Protein Gourmet Bar","Prozis",433,25,45,17,0,[100,"ración","raciones"],"",0,0,"5600380891790",15],
    ["m_prozis_egg_white_albumine","EGG White (Albumine)","Prozis",45,10,1.2,0,0,[100,"ración","raciones"],"",0,0,"5600826209509",1.2],
    ["m_prozis_patatas_fritas_zero_chip","Patatas fritas zero chips barbecue flavor","Prozis",403,45,18,13,17,[100,"ración","raciones"],"",0,0,"5600854626705",5.4],
    ["m_prozis_protein_milk","Protein Milk","Prozis",50,7.6,3.9,0.5,0,[250,"vaso","vasos"],"",1,0,"5600380898720",3.9],
    ["m_prozis_zero_milk_chocolate","Zero milk chocolate","Prozis",493,9.6,48,34,0,[100,"ración","raciones"],"",0,0,"5600854625357",9.2],
    ["m_prozis_prozis_protein_milk_vani","Prozis protein milk vanilla","Prozis",50,7.6,3,0.5,0,[250,"vaso","vasos"],"",1,0,"5600380898737",3],
    ["m_prozis_protein_bar_chocolate_ha","Protein bar (Chocolate Hazelnut)","Prozis",392,29,33,13,0,[100,"ración","raciones"],"",0,0,"5600499500491",13],
    ["m_prozis_protein_snack","Protein snack","Prozis",401,30,38,13,6.1,[100,"ración","raciones"],"",0,0,"5600499500323",13],
    ["m_prozis_cereales_oat_flakes","Cereales oat Flakes","Prozis",377,12,62,6.5,11,[100,"ración","raciones"],"",0,0,"5600499516614",1],
    ["m_prozis_salsa_barbacoa","Salsa barbacoa","Prozis",14,0,3.6,0,0,[100,"ración","raciones"],"",0,0,"5600961160055",0],
    ["m_prozis_energy_gummies","Energy gummies","Prozis",333,0,82,0,2.3,[100,"ración","raciones"],"",0,0,"5600499542514",75],
    ["m_prozis_pan_lean_bread_wholegrai","Pan lean Bread Wholegrain","Prozis",233,16,22,5.2,17,[100,"ración","raciones"],"",0,0,"5600499522516",0.5],
    ["m_prozis_pancake_protein","Pancake + protein","Prozis",361,54,19,5.9,8.1,[100,"ración","raciones"],"",0,0,"5600380895965",2.3],
    ["m_prozis_100_vegan_protein","100% Vegan Protein","Prozis",397,74,11,6.3,0,[100,"ración","raciones"],"",0,0,"5600826205341",2.1],
    ["m_prozis_xtreme_whey","Xtreme whey","Prozis",402,71,13,7.3,0,[100,"ración","raciones"],"",0,0,"5600826205525",3.7],
    ["m_prozis_pan_spinach_wraps","Pan spinach Wraps","Prozis",312,8.2,51,7.9,2.1,[100,"ración","raciones"],"",0,0,"5600961124620",1.8],
    ["m_prozis_batido_zero_shake_salted","Batido zero Shake Salted Caramel","Prozis",35,6,0,1.2,0,[250,"vaso","vasos"],"",1,0,"5600961113778",0],
    ["m_prozis_oatmeal_whey_protein","Oatmeal + Whey Protein","Prozis",373,31,42,7.4,0,[100,"ración","raciones"],"",0,0,"5600380894647",1.9],
    ["m_prozis_tortitas_arroz_choco_neg","Tortitas Arroz Choco Negro","Prozis",433,7.2,73,12,0,[100,"ración","raciones"],"",0,0,"5600499526057",20],
    ["m_prozis_energy_crunch_bar","Energy crunch bar","Prozis",381,19,61,6.8,0,[100,"ración","raciones"],"",0,0,"5600499501160",33],
    ["m_prozis_diet_bar_brownie","Diet bar brownie","Prozis",360,35,24,12,17,[100,"ración","raciones"],"",0,0,"5600380891714",7.6],
    ["m_prozis_proteina_vegetal","Proteína vegetal","Prozis",392,77,9,5.3,0,[100,"ración","raciones"],"",0,0,"5600961110104",0],
    ["m_prozis_prozis_energy_gel_caffei","Prozis - Energy GEL (Caffeine)","Prozis",253,1.1,62,0,0,[100,"ración","raciones"],"",0,0,"5600380890168",21],
    ["m_prozis_oats_instant_whole_choco","Oats, Instant & Whole - Chocolate Flavor","Prozis",367,14,55,7.7,11,[15,"cucharada","cucharadas"],"",0,0,"5600499551738",1.1],
    ["m_prozis_protein_milk_chocolate","Protein milk chocolate","Prozis",505,26,30,33,6.2,[100,"ración","raciones"],"",0,0,"5600499534748",10],
    ["m_prozis_oatmeal_whey_protein2","Oatmeal +Whey protein","Prozis",373,31,41,7.5,0,[100,"ración","raciones"],"",0,0,"5600380894623",1.8],
    ["m_prozis_zero_dark_chocolate","Zero dark chocolate","Prozis",539,9.5,25,42,0,[100,"ración","raciones"],"",0,0,"5600854627023",3],
    ["m_prozis_salsa_curry","Salsa Curry","Prozis",20,0,4.9,0,0,[100,"ración","raciones"],"",0,0,"5600961134377",1.5],
    ["m_prozis_100_whey_hydro_isolate","100% Whey Hydro Isolate","Prozis",365,90,0,0.5,0,[100,"ración","raciones"],"",0,0,"5600380895859",0],
    ["m_prozis_real_whey_100_whey_isola","Real Whey 100% Whey Isolate chocolate-hazelnut","Prozis",387,82,3.9,2.4,0,[100,"ración","raciones"],"",0,0,"5600854621397",1.2],
    ["m_prozis_protein_whey_quot_nutcho","Protein Whey &quot;NutChoc&quot;","Prozis",393,61,22,6.8,0,[100,"ración","raciones"],"",0,0,"5600854627443",11],
    ["m_prozis_oats_instant_chocolate_p","Oats instant chocolate praliné","Prozis",380,12,58,8,14,[15,"cucharada","cucharadas"],"",0,0,"5600499552070",0],
    ["m_prozis_100_real_whey_protein2","100% Real Whey Protein","Prozis",382,76,6.6,5.7,0,[100,"ración","raciones"],"",0,0,"5600499555606",3.9],
    ["m_prozis_sirope_choco_caramel","Sirope Choco Caramel","Prozis",41,1.4,6.5,0.6,2.1,[100,"ración","raciones"],"",0,0,"5600961132267",0],
    ["m_prozis_real_whey_100_whey_prote","Real Whey 100% whey Protein","Prozis",400,76,6.7,7.6,0,[100,"ración","raciones"],"",0,0,"5600380896283",3],
    ["m_prozis_leche_de_avena","Leche de Avena","Prozis",56,1,8.5,1.6,0,[250,"vaso","vasos"],"",1,0,"5600499508411",6.3],
    ["m_prozis_real_whey_100_protein","Real Whey 100% Protein","Prozis",375,73,6.1,6.5,0,[100,"ración","raciones"],"",0,0,"5600380896450",2.9],
    ["m_prozis_cereales_krispees","Cereales krispees","Prozis",370,11,67,3.3,0,[100,"ración","raciones"],"",0,0,"5600499526019",1.3],
    ["m_prozis_pancake_prozis","Pancake prozis","Prozis",364,54,19,5.9,0,[100,"ración","raciones"],"",0,0,"5600380897587",2.3],
    ["m_prozis_diet_bar","Diet Bar","Prozis",312,37,12,12,21,[100,"ración","raciones"],"",0,0,"5600826209899",4.8],
    ["m_quaker_cereales_cruesli_pepitas","Cereales cruesli, pepitas con mezcla de frutos secos","Quaker",462,8.5,57,19,10,[100,"ración","raciones"],"",0,0,"3168930010265",12],
    ["m_quaker_cereales_copos_de_avena_","Cereales copos de avena integral","Quaker",375,11,60,8,9,[100,"ración","raciones"],"",0,1,"3168930009078",1.1],
    ["m_quaker_cereales_cruesli_chocola","Cereales cruesli chocolate negro","Quaker",455,8.1,57,19,10,[100,"ración","raciones"],"",0,0,"3168930010906",16],
    ["m_quaker_cereales_muesli_pecanas_","Cereales muesli pecanas y nueces de Brasil","Quaker",420,11,62,11,13,[100,"ración","raciones"],"",0,0,"3168930009795",13],
    ["m_quaker_cereales_quaker_rolled_o","Cereales quaker Rolled Oats","Quaker",374,11,60,8,9,[100,"ración","raciones"],"",0,0,"5000108022152",1.1],
    ["m_quaker_cereales_cruesli","Cereales cruesli","Quaker",457,6.9,63,18,9.7,[100,"ración","raciones"],"",0,0,"8710100127003",16],
    ["m_quaker_cereales_hunky_baked_gra","Cereales hunky baked granola nuts & seeds","Quaker",431,9.6,71.1,10.7,6.9,[100,"ración","raciones"],"",0,0,"8710398507990",11.3],
    ["m_quaker_cereales_muesli","Cereales muesli","Quaker",402,11,65,7.9,14,[100,"ración","raciones"],"",0,0,"8410199015617",14],
    ["m_quaker_cereales_quick_cooking_w","Cereales quick cooking white oats","Quaker",375,11,67.5,8,9,[100,"ración","raciones"],"",0,0,"8710100101218",1.3],
    ["m_quaker_quaker_oak_flakes","Quaker Oak Flakes","Quaker",375,12.5,67.5,7.5,0,[100,"ración","raciones"],"",0,0,"7861035520054",1.1],
    ["m_st_dalfour_mermelada_de_manzana_y_c","Mermelada de manzana y canela","St. Dalfour",203,0,50,0.3,0,[100,"ración","raciones"],"",0,0,"3492390020329",49],
    ["m_valor_100_cacao_puro_natural","100% cacao puro natural","Valor",339,25,17,11,34,[100,"ración","raciones"],"",0,0,"8410109115543",1],
    ["m_valor_cacao_puro_en_polvo_desg","Cacao puro en polvo desgrasado","Valor",375,26,16,16,32,[15,"cucharada","cucharadas"],"",0,0,"8410109000658",0.7],
    ["m_valor_chocolate_puro_con_almen","Chocolate puro con almendras","Valor",570,9.9,38,40,0,[100,"ración","raciones"],"",0,0,"8410109000085",36],
    ["m_valor_chocolate_negro_0_azucar","Chocolate negro 0% azúcares añadidos 70% cacao","Valor",481,11,34,36,0,[100,"ración","raciones"],"",0,0,"8410109003222",0.5],
    ["m_valor_85_cacao_0_azucares_anad","85% Cacao 0% Azúcares añadidos","Valor",568,11,19,49,0,[100,"ración","raciones"],"",0,0,"8410109109832",0.5],
    ["m_valor_82_cacao_natural","82% cacao natural","Valor",561,12,22,44,0,[100,"ración","raciones"],"",0,0,"8410109103205",16],
    ["m_valor_chocolate_puro","Chocolate puro","Valor",540,6.2,50,33,0,[100,"ración","raciones"],"",0,0,"8410109000023",47],
    ["m_valor_92_cacao_natural","92% cacao natural","Valor",584,14,13,49,0,[100,"ración","raciones"],"",0,0,"8410109113020",6.8],
    ["m_valor_galletas_huesitos_origin","Galletas huesitos original","Valor",500,6.5,66,23,0,[100,"ración","raciones"],"",0,0,"8410034075011",42],
    ["m_valor_chocolate_puro_con_almen2","Chocolate puro con almendras enteras 0% azúcares","Valor",513,9.9,38,40,0,[100,"ración","raciones"],"",0,0,"8410109003178",0.5],
    ["m_valor_galletas_original","Galletas original","Valor",502,6.5,66,23,0,[100,"ración","raciones"],"",0,0,"8410034075103",42],
    ["m_valor_cacao_negro_soluble","Cacao negro soluble","Valor",365,16,39,11,21,[15,"cucharada","cucharadas"],"",0,0,"8410109114027",24],
    ["m_valor_70_cacao_con_almendras_e","70% cacao con almendras enteras","Valor",562,14,26,42,0,[100,"ración","raciones"],"",0,0,"8410109000726",22],
    ["m_valor_70_cacao_natural","70% cacao natural","Valor",531,11,34,36,0,[100,"ración","raciones"],"",0,0,"8410109005110",29],
    ["m_valor_chocolate_con_leche_con_","Chocolate con leche con almendras enteras","Valor",567,11,41,39,0,[100,"ración","raciones"],"",0,0,"8410109000078",41],
    ["m_valor_chocolate_negro_92","Chocolate negro 92%","Valor",574,14,13,49,0,[100,"ración","raciones"],"",0,0,"8410109115468",0.5],
    ["m_valor_chocolate_con_leche_con_2","Chocolate con leche con almendras enteras 0%","Valor",523,12,39,40,0,[100,"ración","raciones"],"",0,0,"8410109003208",6.9],
    ["m_valor_valor_cacao_natural_99","Valor cacao natural 99%","Valor",614,14,8.1,55,0,[100,"ración","raciones"],"",0,0,"8410109117479",2],
    ["m_valor_valor_chocolate_negro_70","Valor Chocolate negro 70% avellanas enteras","Valor",559,12,26,42,0,[100,"ración","raciones"],"",0,0,"8410109117448",22],
    ["m_valor_82_cacao_con_almendras_e","82% cacao con almendras enteras","Valor",585,14,17,48,0,[100,"ración","raciones"],"",0,0,"8410109115017",13],
    ["m_aquarius_naranja","Naranja","Aquarius",19,0,4.5,0,0,[250,"vaso","vasos"],"",1,0,"5449000133847",4.5],
    ["m_aquarius_aquarius_sabor_naranja_s","Aquarius Sabor Naranja (sin azúcar)","Aquarius",1,0,0,0,0,[250,"vaso","vasos"],"",1,0,"5449000171795",0],
    ["m_aquarius_aquarius_limon","Aquarius limón","Aquarius",18,0,4.3,0,0,[250,"vaso","vasos"],"",1,0,"5449000014214",4.3],
    ["m_burn_burn_energy_drink","Burn Energy Drink","Burn",63,0,16,0,0,[250,"vaso","vasos"],"",1,0,"5060466513389",15],
    ["m_burn_burn_zero_sugar","Burn zero sugar","Burn",2,0,0.7,0,0,[250,"vaso","vasos"],"",1,0,"5060608747788",0],
    ["m_burn_blue_refresh_zero_bebida","Blue refresh zero bebida energética baja en azúcares","Burn",3,0,0.9,0,0,[250,"vaso","vasos"],"",1,0,"5060466513471",0],
    ["m_burn_energy_drink_passion_pun","Energy drink Passion punch","Burn",58,0,14,0,0,[250,"vaso","vasos"],"",1,0,"5060466518704",14],
    ["m_burn_energy_drink_original","Energy drink Original","Burn",62,0,16,0,0,[250,"vaso","vasos"],"",1,0,"5060608740116",15],
    ["m_coca_cola_coca_cola_zero_azucar","Coca-Cola zero azúcar","Coca-Cola",0,0,0,0,0,[250,"vaso","vasos"],"",1,0,"5449000131805",0],
    ["m_aquarius_aquarius","Aquarius","Aquarius",18,0,4.4,0,0,[250,"vaso","vasos"],"",1,0,"5449000058560",4.4],
    ["m_aquarius_aquarius_naranja","Aquarius Naranja","Aquarius",19,0,4.5,0,0,[250,"vaso","vasos"],"",1,0,"5449000033819",4.5],
    ["m_aquarius_aquarius_zero_azucar","Aquarius zero azucar","Aquarius",1,0,0,0,0,[250,"vaso","vasos"],"",1,0,"5449000171801",0],
    ["m_coca_cola_refresco_coca_cola","Refresco Coca Cola","Coca-Cola",30,0,7.5,0,0,[250,"vaso","vasos"],"",1,0,"7501055310227",7.5],
    ["m_coca_cola_coca_cola_sin_cafeina","Coca-Cola sin cafeína","Coca-Cola",44,0,11,0,0,[250,"vaso","vasos"],"",1,0,"5449000000774",11],
    ["m_don_simon_limonada_natural","Limonada natural","Don Simón",23,0.1,5.6,0,0,[250,"vaso","vasos"],"",1,0,"8410261657424",5.6],
    ["m_don_simon_bebida_de_zumo_de_naranj","Bebida de zumo de naranja sin gas sin gluten","Don Simón",20,0,4.8,0.1,0,[250,"vaso","vasos"],"",1,0,"8410261641416",4.8],
    ["m_don_simon_zumo_de_naranja","Zumo de naranja","Don Simón",43,0.6,10,0.1,0.2,[250,"vaso","vasos"],"",1,0,"8410261608105",10],
    ["m_don_simon_bebida_de_soja","Bebida de soja","Don Simón",47,3.2,4,1.9,0.3,[250,"vaso","vasos"],"",1,0,"8410261638034",3.5],
    ["m_don_simon_zumo_de_pina_uva_y_manza","Zumo de piña, uva y manzana","Don Simón",47,0.6,11.2,0,0,[250,"vaso","vasos"],"",1,0,"8410261210100",11.2],
    ["m_don_simon_disfruta_don_simon_pina_","Disfruta Don Simon Piña sin azúcares añadidos","Don Simón",27,0.3,6.3,0,0,[250,"vaso","vasos"],"",1,0,"8410261650043",4.9],
    ["m_don_simon_don_simon_naranja_premiu","Don simon naranja premium valencia 100% exprimida","Don Simón",44,0.6,10,0.1,0,[250,"vaso","vasos"],"",1,0,"8410261608525",10],
    ["m_don_simon_zumo_d_simon_disfruta_na","Zumo D.simon Disfruta Naranja S / Azucar","Don Simón",25,0.3,5.7,0,0,[250,"vaso","vasos"],"",1,0,"8410261650104",4.2],
    ["m_don_simon_zumo_de_melocoton_uva_y_","Zumo de melocotón, uva y manzana","Don Simón",42,0.4,10.1,0,0,[250,"vaso","vasos"],"",1,0,"8410261603612",10.1],
    ["m_don_simon_nectar_de_naranja","Néctar de naranja","Don Simón",19,0.3,4.4,0,0.1,[250,"vaso","vasos"],"",1,0,"8410261650302",4.4],
    ["m_don_simon_pomegranate_and_grape_ju","Pomegranate and Grape Juice Drink","Don Simón",22,0.1,5.3,0,0,[250,"vaso","vasos"],"",1,0,"8410261650340",4.7],
    ["m_don_simon_smoothie","Smoothie","Don Simón",57,0.6,12.6,0,1.6,[250,"vaso","vasos"],"",1,0,"8410261768175",12.6],
    ["m_don_simon_multivitaminas","Multivitaminas","Don Simón",38,0.3,9,0,0.3,[250,"vaso","vasos"],"",1,0,"8410261627045",9],
    ["m_don_simon_zumo_de_pina_y_uva","Zumo de piña y uva","Don Simón",59,0.4,14.3,0,0,[250,"vaso","vasos"],"",1,0,"8410261611167",14.3],
    ["m_don_simon_nectar_s_az_nar_mang_d_s","Nectar S / Az Nar-mang D. Simon","Don Simón",23,0.3,5.4,0,0,[250,"vaso","vasos"],"",1,0,"8410261650333",5.4],
    ["m_don_simon_zumo_de_melocoton","Zumo de Melocoton","Don Simón",46,0.2,11.3,0,0,[250,"vaso","vasos"],"",1,0,"8410261653440",11.3],
    ["m_don_simon_zumo_de_mango","Zumo de. mango","Don Simón",17,0.2,4,1,0,[250,"vaso","vasos"],"",1,0,"8410261650074",3.5],
    ["m_don_simon_manzana","Manzana","Don Simón",41,0.2,10,0,0,[250,"vaso","vasos"],"",1,0,"8410261604619",10],
    ["m_don_simon_zumo_d_simon_disfruta_mu","Zumo D.simon Disfruta Multifrutas S / Azucar","Don Simón",24,0.3,5.5,0,0,[250,"vaso","vasos"],"",1,0,"8410261650357",5.1],
    ["m_don_simon_bebida_de_soja_con_choco","Bebida de soja con chocolate","Don Simón",63,3,8.3,1.8,0.8,[250,"vaso","vasos"],"",1,0,"8410261638133",8.1],
    ["m_fanta_fanta_naranja","Fanta Naranja","Fanta",42,0,10.3,0,0,[250,"vaso","vasos"],"",1,0,"5449000004840",10.3],
    ["m_fanta_fanta_limon","Fanta Limón","Fanta",19,0,4.5,0,0,[250,"vaso","vasos"],"",1,0,"5449000006004",4.5],
    ["m_fanta_fanta_naranja_zero_azuca","Fanta naranja zero azúcares","Fanta",3,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"5449000120960",0.1],
    ["m_fanta_fanta_orange_zero","Fanta Orange Zero","Fanta",2,0,0,0,0,[250,"vaso","vasos"],"",1,0,"5449000120984",0],
    ["m_fanta_fanta_berry_imp","Fanta Berry imp","Fanta",42,0,11.5,0,0,[250,"vaso","vasos"],"",1,0,"0049000067729",11.3],
    ["m_fanta_fanta_pineapple","Fanta Pineapple","Fanta",51,0,13.5,0,0,[250,"vaso","vasos"],"",1,0,"0049000014273",13.5],
    ["m_gatorade_bebida_energetica","Bebida energética","Gatorade",25,0,5.9,0,0,[250,"vaso","vasos"],"",1,0,"8001160001342",3.9],
    ["m_granini_nectar_de_naranja_hecho_","Néctar De Naranja Hecho Parcialmente A Partir De","Granini",45,0.5,10.1,0.5,0,[250,"vaso","vasos"],"",1,0,"4002160092150",10.1],
    ["m_granini_granini_melocoton","Granini Melocotón","Granini",52,0.5,12,0.5,0,[250,"vaso","vasos"],"",1,0,"4002160092884",11.9],
    ["m_granini_zumo_de_manzana_fruta","Zumo de manzana fruta","Granini",43,0.5,10.2,0.2,0,[250,"vaso","vasos"],"",1,0,"4002160092853",9.7],
    ["m_granini_zumo_pina","Zumo Piña","Granini",51,0.5,11.8,0.5,0,[250,"vaso","vasos"],"",1,0,"4002160092891",11.8],
    ["m_granini_zumo_zanahoria_y_naranja","Zumo Zanahoria y Naranja","Granini",37,0.5,8.3,0.5,0,[250,"vaso","vasos"],"",1,0,"4002160093065",8.3],
    ["m_granini_zumo_fruta_fibra","Zumo fruta&fibra","Granini",47,0.5,10.6,0.5,0,[250,"vaso","vasos"],"",1,0,"8431707077149",10],
    ["m_granini_granini_zumo_de_naraja_1","Granini Zumo De Naraja 100% Fruta","Granini",43,0.7,8.8,0.5,0,[250,"vaso","vasos"],"",1,0,"8431707003575",8.8],
    ["m_granini_granini_100_natural_pina","Granini 100% Natural piña pera manzana","Granini",44,0.5,10.1,0.5,0,[250,"vaso","vasos"],"",1,0,"8431707077200",9.2],
    ["m_granini_nectar_de_pomelo_rosa","Néctar de pomelo rosa","Granini",39,0.5,8.4,0.5,1,[250,"vaso","vasos"],"",1,0,"4002160092976",8.3],
    ["m_granini_nectar_de_melocoton_uva_","Néctar de melocotón/uva sin azúcares añadidos","Granini",32,0.5,7.1,0.5,0,[250,"vaso","vasos"],"",1,0,"8431707067614",7],
    ["m_granini_nectar_de_naranja_light_","Néctar de naranja light con stevia sin azúcares","Granini",31,0.5,6.2,0.5,0,[250,"vaso","vasos"],"",1,0,"8431707113779",6.2],
    ["m_kaiku_caff_cafe_kaiku_proteina","Café kaiku proteina","Kaiku Caffè Latte",56,7.7,3.7,1.1,0,[250,"vaso","vasos"],"",1,0,"8432425094043",3.2],
    ["m_kaiku_caff_caffe_latte_descafeinado","Caffè Latte Descafeinado","Kaiku Caffè Latte",72,2.7,8.3,3,0,[250,"vaso","vasos"],"",1,0,"8432425098720",8.3],
    ["m_kaiku_caff_cafe_latte_caramelo","Cafe latte caramelo","Kaiku Caffè Latte",59,2.6,9,1.2,0.1,[250,"vaso","vasos"],"",1,0,"8432425093657",8.6],
    ["m_kas_kas_limon","Kas Limon","Kas",21,0.1,4.6,0,0,[250,"vaso","vasos"],"",1,0,"8410494300739",4.3],
    ["m_kas_kas_naranja","Kas Naranja","Kas",14,0,2.5,0,0,[250,"vaso","vasos"],"",1,0,"8410494300722",1.9],
    ["m_kas_refresco_de_limon","Refresco de limón","Kas",22,0,4.9,0,0,[250,"vaso","vasos"],"",1,0,"8410408050361",4.4],
    ["m_kas_refresco_amargo_sin_alco","Refresco amargo sin alcohol","Kas",19,0,4.8,0,0,[250,"vaso","vasos"],"",1,0,"8410408070307",4.7],
    ["m_kas_kas_zero_limon","Kas Zero Limón","Kas",2,0,0.4,0,0,[250,"vaso","vasos"],"",1,0,"8410408011881",0.4],
    ["m_kas_kas_manzana","Kas manzana","Kas",16,0.1,4,0,0,[250,"vaso","vasos"],"",1,0,"8410408050392",3.7],
    ["m_kas_zero_refresco_de_limon","Zero refresco de limón","Kas",4,0,0.4,0,0,[250,"vaso","vasos"],"",1,0,"8410408103715",0.4],
    ["m_kas_kas_zero_naranja","Kas Zero Naranja","Kas",4,0,0.9,0,0,[250,"vaso","vasos"],"",1,0,"8410408011874",0.9],
    ["m_kas_zero_refresco_de_naranja","Zero refresco de naranja sin azúcares añadidos","Kas",5,0,0.9,0,0,[250,"vaso","vasos"],"",1,0,"8410408103708",0.9],
    ["m_la_casera_la_casera_gaseosa","La Casera gaseosa","La Casera",0,0,0,0,0,[250,"vaso","vasos"],"",1,0,"8410283008006",0],
    ["m_la_casera_casera_de_limon","Casera de limon","La Casera",2,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8410283028004",0],
    ["m_la_casera_la_casera_sabor_naranja_","La Casera sabor naranja cero azúcares añadidos","La Casera",6,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8410283303552",0.1],
    ["m_la_casera_gaseosa_y_un_toque_de_hi","Gaseosa y un toque de hierbabuena","La Casera",1,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8410283387194",0.1],
    ["m_la_casera_cola","Cola","La Casera",7,0,1.9,0,0,[250,"vaso","vasos"],"",1,0,"8410283318259",1.8],
    ["m_la_casera_la_casera_cola_cero_sin_","La casera cola cero sin cafeina","La Casera",3,0,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8410283036009",0],
    ["m_lipton_ice_tea_limon_zero","Ice tea limón zero","Lipton",1,0,0,0,0,[250,"vaso","vasos"],"",1,0,"8410409013396",0],
    ["m_minute_mai_limon_nada","Limon & nada","Minute Maid",54,0,13,0,0,[250,"vaso","vasos"],"",1,0,"5449000142573",13],
    ["m_minute_mai_limon_nada_ligero","Limón&nada ligero","Minute Maid",28,0,6.6,0,0,[250,"vaso","vasos"],"",1,0,"5449000205261",6.2],
    ["m_minute_mai_minute_maid_duo_tropical","Minute Maid Duo Tropical","Minute Maid",53,0,12.6,0,0,[250,"vaso","vasos"],"",1,0,"87303483",12],
    ["m_minute_mai_nectar_de_naranja","Néctar de naranja","Minute Maid",43,0.5,9.7,0,0,[250,"vaso","vasos"],"",1,0,"5449000067357",9.7],
    ["m_monster_monster_energy","Monster Energy","Monster",37,0,9.4,0,0,[250,"vaso","vasos"],"",1,0,"5060335632302",8.4],
    ["m_monster_mango_loco_bebida_energe","Mango loco bebida energética con taurina y ginseng","Monster",48,0,12,0,0,[250,"vaso","vasos"],"",1,0,"5060639121915",11],
    ["m_monster_monster_energy_absolutel","Monster Energy Absolutely Zero Sugar","Monster",3,0,1,0,0,[250,"vaso","vasos"],"",1,0,"5060335632272",0],
    ["m_monster_monster_white_pineapple","Monster White pineapple","Monster",27,0,6.8,0,0,[250,"vaso","vasos"],"",1,0,"5060896627014",6],
    ["m_monster_monster_energy_absolutel2","Monster Energy Absolutely Zero","Monster",16,0,1,0,0,[250,"vaso","vasos"],"",1,0,"5060166697365",0],
    ["m_monster_monster_mule","Monster Mule","Monster",1,0,0.4,0,0,[250,"vaso","vasos"],"",1,0,"5060751213581",0],
    ["m_monster_monster_hydrosport","Monster Hydrosport","Monster",2,0.1,0.6,0.7,0,[250,"vaso","vasos"],"",1,0,"5060639126743",0],
    ["m_monster_juiced_monster_mango_loc","Juiced monster mango loco energy + juice","Monster",49,0,12,0,0,[250,"vaso","vasos"],"",1,0,"5060639128815",12],
    ["m_nestea_nestea_limon","Nestea Limón","Nestea",19,0,4.5,0,0,[250,"vaso","vasos"],"",1,0,"5449000012913",4.5],
    ["m_nestea_nestea_maracuya","Nestea maracuya","Nestea",20,0,4.6,0,0,[250,"vaso","vasos"],"",1,0,"5449000187246",4.6],
    ["m_nestea_nestea_sin_azucar","Nestea sin azucar","Nestea",1,0,0,0,0,[250,"vaso","vasos"],"",1,0,"5449000088550",0],
    ["m_nestea_fusion_chai_latte","Fusion Chai Latte","Nestea",81,5.1,14.8,0,0,[250,"vaso","vasos"],"",1,0,"3023290054444",14.8],
    ["m_pepsi_pepsi_max","Pepsi Max","Pepsi",1,0.1,0.1,0,0,[250,"vaso","vasos"],"",1,0,"8410494300043",0],
    ["m_kas_bitter_kas","Bitter Kas","Kas",19,0,4.8,0,0,[250,"vaso","vasos"],"",1,0,"8410494300777",4.7],
    ["m_pepsi_refresco_pepsi","Refresco Pepsi","Pepsi",28,0,7,0,0,[250,"vaso","vasos"],"",1,0,"40608006",7],
    ["m_red_bull_red_bull_zero","Red Bull Zero","Red Bull",2,0,0,0,0,[250,"vaso","vasos"],"",1,0,"9002490245931",0],
    ["m_red_bull_red_bull_sandia","Red Bull Sandía","Red Bull",45,0,13,0,0,[250,"vaso","vasos"],"",1,0,"9002490250157",11],
    ["m_schweppes_tonica_original","Tónica original","Schweppes",25,0,5.8,0,0,[250,"vaso","vasos"],"",1,0,"8414100301141",5.8],
    ["m_schweppes_schweppes_limon","Schweppes Limón","Schweppes",19,0,4.4,0,0,[250,"vaso","vasos"],"",1,0,"8414100301752",4.3],
    ["m_schweppes_tonica_zero","Tónica Zero","Schweppes",2,0,0,0,0,[250,"vaso","vasos"],"",1,0,"8414100304753",0],
    ["m_schweppes_limon_zero_de_corteza_de","Limón Zero de corteza de limón","Schweppes",1,0,0,0,0,[250,"vaso","vasos"],"",1,0,"8414100301653",0],
    ["m_sprite_sprite_zero","Sprite Zero","Sprite",1,0,0,0,0,[250,"vaso","vasos"],"",1,0,"5449000104885",0],
    ["m_sprite_sprite_regular","Sprite Regular","Sprite",9,0,2,0,0,[250,"vaso","vasos"],"",1,0,"5449000205537",2],
    ["m_starbucks_batido_starbucks_cappucc","Batido starbucks Cappuccino","Starbucks",69,2.7,8.8,2.5,0,[250,"vaso","vasos"],"",1,0,"5711953007828",8.5],
    ["m_starbucks_leche_caramel_macchiato","Leche caramel macchiato","Starbucks",62,2.9,9,1.9,0,[250,"vaso","vasos"],"",1,0,"5760466995894",8.6],
    ["m_starbucks_frappuccino_classic_vani","Frappuccino -Classic Vanilla","Starbucks",64,2.8,9.7,1.6,0,[250,"vaso","vasos"],"",1,0,"5711953148538",9.4],
    ["m_starbucks_chilled_cup_cafe_con_lec","Chilled cup café con leche","Starbucks",70,2.8,8.9,2.6,0,[250,"vaso","vasos"],"",1,0,"5760466997164",8.5],
    ["m_starbucks_starbucks_frapuccino_coo","Starbucks Frapuccino Cookies & Cream","Starbucks",66,2.8,11,1.2,0,[250,"vaso","vasos"],"",1,0,"5711953134500",11],
    ["m_sunny_deli_sunny_frutos_bosque","Sunny frutos bosque","Sunny Delight",11,0,2.4,0,0,[250,"vaso","vasos"],"",1,0,"8414100354543",2.4],
    ["m_sunny_deli_refresco_sabor_a_fresa","Refresco sabor a fresa","Sunny Delight",12,0,2.5,0.1,0,[250,"vaso","vasos"],"",1,0,"8414100225157",2.4],
    ["m_sunny_deli_naranja_refresco_sabor_m","Naranja refresco sabor multifrutas naranja,","Sunny Delight",13,0,2.6,0,0,[250,"vaso","vasos"],"",1,0,"8414100224556",2.4],
    ["m_trina_trina_naranja","Trina Naranja","Trina",19,0.1,4.3,0,0,[250,"vaso","vasos"],"",1,0,"8411800376806",4.3],
    ["m_trina_zero_refresco_de_naranja","Zero refresco de naranja sin burbujas sin","Trina",6,0.1,1,0,0,[250,"vaso","vasos"],"",1,0,"8411800377056",0.9],
    ["m_trina_refresco_de_limon_sin_bu","Refresco de limón sin burbujas","Trina",20,0,4.3,0,0,[250,"vaso","vasos"],"",1,0,"8411800376554",4.2],
    ["m_trina_trina_zero","Trina Zero","Trina",3,0.1,0,0,0,[250,"vaso","vasos"],"",1,0,"8411800312743",0],
    ["m_trina_fresh_manzana_pera","Fresh manzana pera","Trina",22,0.2,4.6,0.1,0,[250,"vaso","vasos"],"",1,0,"8410900386340",4.4],
    ["m_trina_manzana_zero","Manzana Zero","Trina",9,0,1.8,0,0,[250,"vaso","vasos"],"",1,0,"8411800358147",1.8],
    ["m_trina_vital_de_trina_tropical","Vital de trina tropical","Trina",13,0.4,2.4,0,0,[250,"vaso","vasos"],"",1,0,"8411800340104",1.6],
    ["m_tropicana_tropicana_manzana","Tropicana manzana","Tropicana",51,0.1,12,0,0.6,[250,"vaso","vasos"],"",1,0,"8422174025085",11.7],
    ["m_zumosol_zumo_naranja_zumosol_sin","Zumo Naranja Zumosol sin Pulpa","Zumosol",43,0.6,9.4,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425104415",9.4],
    ["m_zumosol_naranja","Naranja","Zumosol",11,0.1,1.9,0,0,[250,"vaso","vasos"],"",1,0,"8435425106877",1.9],
    ["m_zumosol_zumo_zumosol_pina","Zumo Zumosol Piña","Zumosol",51,0.4,12.1,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425109915",12.1],
    ["m_zumosol_naranja_y_zanahoria","Naranja y zanahoria","Zumosol",43,0.4,9.8,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425110034",9.8],
    ["m_zumosol_zumo_melocoton_y_uva","Zumo melocotón y uva","Zumosol",12,0.2,2.2,0,0,[250,"vaso","vasos"],"",1,0,"8435425106815",2.2],
    ["m_zumosol_nectar_de_naranja","Nectar de naranja","Zumosol",44,0.3,10.4,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425107393",10.4],
    ["m_zumosol_zumosol_melocoton_y_uva","Zumosol melocotón y uva","Zumosol",54,0.7,12.4,0,0,[250,"vaso","vasos"],"",1,0,"8435425109977",0],
    ["m_zumosol_bebida_de_zumo_de_naranj","Bebida de zumo de naranja,zanahoria,manzana y","Zumosol",34,0.4,7.7,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425100455",7.7],
    ["m_zumosol_zumosol_ecologico_100_gr","Zumosol Ecológico 100% Granada, Mora, Frambuesa y","Zumosol",63,0.5,14.9,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425109670",14.9],
    ["m_zumosol_nectar_de_melocoton","Néctar de melocotón","Zumosol",24,0.5,5.1,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425107492",5.1],
    ["m_zumosol_naranja_y_mango","Naranja y mango","Zumosol",39,0.4,8.9,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425100486",8.9],
    ["m_zumosol_zumo_de_pina","Zumo de piña","Zumosol",46,0.2,10.6,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425106266",10.6],
    ["m_zumosol_zumo_de_naranja_y_guayab","Zumo De Naranja y Guayaba Brick Zumosol","Zumosol",49,0.5,11,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425100639",11],
    ["m_zumosol_nectar_de_manzana","Néctar de manzana","Zumosol",45,0.1,11.2,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425107430",11.2],
    ["m_zumosol_solo_pina_uva_exprimida","Sólo piña & uva exprimida","Zumosol",57,0.4,13.7,0.1,0,[250,"vaso","vasos"],"",1,0,"8435425107980",13.7],
    ["m_abril_aceite_de_oliva_virgen","Aceite de oliva virgen","Abril",819,0,0,91,0,[10,"cucharada","cucharadas"],"",0,0,"8436001258195",0],
    ["m_alesto_almendras_al_natural","Almendras al natural","Alesto",621,24.5,4.8,53.3,12.1,[30,"ración","raciones"],"",0,0,"20724696",4.8],
    ["m_alesto_mix_de_frutos_secos_al_n","Mix de frutos secos al natural","Alesto",646,20.4,6.4,58,8.5,[30,"ración","raciones"],"",0,0,"20047238",4.2],
    ["m_alesto_cacahuete_frito_sin_sal","Cacahuete frito sin sal","Alesto",626,24.7,11.1,51.8,8.3,[100,"ración","raciones"],"",0,0,"20615420",5.3],
    ["m_alpro_bebida_de_avellanas","Bebida de avellanas","Alpro",29,0.4,3.2,1.6,0.3,[100,"ración","raciones"],"",1,0,"5411188110842",3.2],
    ["m_alpro_bebida_de_avena_barista","Bebida de avena Barista","Alpro",59,0.8,6.7,3,1,[200,"ración","raciones"],"",0,0,"5411188127697",3.3],
    ["m_alpro_alternativa_vegetal_al_y","Alternativa vegetal al yogur griego natural","Alpro",65,5.6,2.2,3.3,1.3,[100,"ración","raciones"],"",0,0,"5411188121213",2.2],
    ["m_antin_snack_de_pan_con_pipas","Snack de pan con pipas","Antin",521,11.5,49.2,30.2,3.4,[83,"ración","raciones"],"",0,0,"8423102210153",1.3],
    ["m_baresa_pesto_genoves","Pesto genovés","Baresa",464,4.5,8.7,45.4,1.4,[100,"ración","raciones"],"",0,0,"20425555",4.3],
    ["m_mulino_bia_galletas_baiocchi","Galletas Baiocchi","Mulino Bianco",510,8,59,26,4,[9,"ración","raciones"],"",0,0,"8076809573252",23],
    ["m_barilla_pasta_penne_rigate_integ","Pasta penne rigate integral","Barilla",347,13,64,2.5,8,[85,"ración","raciones"],"",0,1,"8076809529433",3.5],
    ["m_barilla_placas_de_lasana_al_huev","Placas de lasaña al huevo","Barilla",368,14,68,4,3,[54,"ración","raciones"],"",0,0,"8076800376999",3],
    ["m_barilla_salsa_napoletana","Salsa napoletana","Barilla",72,1.4,6.2,3.7,1.8,[100,"ración","raciones"],"",0,0,"8076809513692",5.2],
    ["m_caprice_de_queso_caprice_des_dieux","Queso Caprice des Dieux","Caprice des Dieux",339,15,0.8,30,0,[25,"ración","raciones"],"",0,0,"3161711001971",0.1],
    ["m_bio_organi_crema_de_cacahuete_cremo","Crema de cacahuete cremosa","Bio Organic",625,26,16,49,8,[100,"ración","raciones"],"",0,0,"4335619022591",4],
    ["m_lotus_galletas_biscoff_speculo","Galletas Biscoff (speculoos)","Lotus",484,4.9,72.6,19,1.3,[8,"ración","raciones"],"",0,0,"5410126006049",38.1],
    ["m_bjorg_copos_de_avena","Copos de avena","Bjorg",363,11,58,7.1,11,[60,"ración","raciones"],"",0,0,"3229820019307",1.7],
    ["m_bjorg_muesli_de_uva_higo_y_alb","Muesli de uva, higo y albaricoque","Bjorg",352,11,59,5.8,10,[60,"ración","raciones"],"",0,0,"3229820129488",14],
    ["m_bjorg_muesli_superfruits","Muesli Superfruits","Bjorg",359,12,60,6,10,[70,"ración","raciones"],"",0,0,"3229820782560",13],
    ["m_capri_sun_capri_sun_multivitamina","Capri-Sun multivitamina","Capri-Sun",30,0,7.1,0,0,[200,"ración","raciones"],"",1,0,"4000177158319",7.1],
    ["m_carrefour__barritas_de_cereales_con","Barritas de cereales con chocolate","Carrefour Bio",405,5.1,73,9.6,3.3,[100,"ración","raciones"],"",0,0,"3560071269494",33],
    ["m_carrefour__biscotes_de_trigo_integr","Biscotes de trigo integral sin azúcar y sin sal","Carrefour Bio",383,14,69,3.5,9.9,[100,"ración","raciones"],"",0,0,"3560071433277",3],
    ["m_carrefour__bebida_de_soja_sin_azuca","Bebida de soja sin azúcares añadidos","Carrefour Bio",41,3.8,1.4,2.1,0.6,[125,"ración","raciones"],"",1,0,"3270190128717",0.7],
    ["m_carrefour__muesli_crujiente_con_sem","Muesli crujiente con semillas de calabaza y girasol","Carrefour Bio",425,11,61,14,6.2,[100,"ración","raciones"],"",0,0,"3560071407773",15],
    ["m_carrefour__galletas_de_chocolate_y_","Galletas de chocolate y avellanas","Carrefour Bio",501,7.1,58,26,3.8,[33,"ración","raciones"],"",0,0,"3270190127871",27],
    ["m_carrefour__copos_de_avena","Copos de avena","Carrefour Bio",372,14,59,7,10,[40,"ración","raciones"],"",0,1,"3560071190965",0.7],
    ["m_carrefour__tortitas_de_4_cereales","Tortitas de 4 cereales","Carrefour Bio",384,8,80,2.6,4.2,[100,"ración","raciones"],"",0,0,"3560071469573",0.7],
    ["m_carrefour__muesli_6_frutas","Muesli 6 frutas","Carrefour Bio",444,7.6,62,17,6.2,[100,"ración","raciones"],"",0,0,"3560071407742",24],
    ["m_carrefour__confitura_extra_de_fresa","Confitura extra de fresa","Carrefour Bio",242,0,58,0,2.4,[100,"ración","raciones"],"",0,0,"3270190127512",57],
    ["m_carrefour__palmeritas","Palmeritas","Carrefour Bio",518,7.5,64,25,2.2,[100,"ración","raciones"],"",0,0,"3560071437732",20],
    ["m_carrefour__pan_integral_3_cereales","Pan integral 3 cereales","Carrefour Bio",175,5,29,2.2,8.9,[100,"ración","raciones"],"",0,0,"3560071459468",2.1],
    ["m_carrefour__galletas_bretonas_de_man","Galletas bretonas de mantequilla","Carrefour Bio",493,6.5,67,22,2,[100,"ración","raciones"],"",0,0,"3560071266769",25],
    ["m_carrefour_galletas_de_avena_y_choc","Galletas de avena y chocolate","Carrefour",468,8.4,61,20,6.7,[11,"ración","raciones"],"",0,0,"3560071455279",17],
    ["m_carrefour_queso_emmental_rallado","Queso emmental rallado","Carrefour",377,28,1,29,0,[200,"ración","raciones"],"",0,0,"3270190207696",0.5],
    ["m_carrefour_chocolate_negro_85","Chocolate negro 85 %","Carrefour",631,9.1,20,55,12,[100,"ración","raciones"],"",0,0,"3560071276539",15],
    ["m_carrefour_muesli_35_frutas","Muesli 35 % frutas","Carrefour",380,8.8,63,8.3,8.9,[100,"ración","raciones"],"",0,0,"3560071407568",17],
    ["m_carrefour_barrita_de_semillas_y_al","Barrita de semillas y almendras","Carrefour",537,20,20,39,13,[25,"ración","raciones"],"",0,0,"3560071403096",10],
    ["m_carrefour_galletas_rellenas_de_fra","Galletas rellenas de frambuesa","Carrefour",454,6.7,66,17,4.5,[100,"ración","raciones"],"",0,0,"3560071266257",28],
    ["m_carrefour_queso_mozzarella","Queso mozzarella","Carrefour",235,17,1.3,18,0,[100,"ración","raciones"],"",0,0,"3560070060252",0.8],
    ["m_carrefour_biscotes_sin_sal_anadida","Biscotes sin sal añadida","Carrefour",401,12,75,5.1,3.9,[16,"ración","raciones"],"",0,0,"5400101201712",7.3],
    ["m_carrefour_filetes_de_caballa_al_na","Filetes de caballa al natural","Carrefour",172,23,0,9,0,[95,"ración","raciones"],"",0,0,"3560071175856",0],
    ["m_carrefour_cereales_corn_flakes","Cereales corn flakes","Carrefour",383,6.9,85,1.2,2.5,[100,"ración","raciones"],"",0,0,"3560071016074",7.2],
    ["m_cereal_bio_galletas_de_chocolate_in","Galletas de chocolate intenso","Céréal Bio",486,7.1,62,22,6,[22,"ración","raciones"],"",0,0,"3175681060586",27],
    ["m_nestle_cereales_fitness_protein","Cereales Fitness Protein cacao sin azúcares añadidos","Nestlé",351,12.1,64.1,5.1,12.4,[100,"ración","raciones"],"",0,0,"5900020043481",0.8],
    ["m_maruja_chocolate_con_leche_y_al","Chocolate con leche y almendras","Maruja",533,5.3,53.3,32,0,[19,"ración","raciones"],"",0,0,"8425197712024",51],
    ["m_combino_salsa_de_tomate_con_alba","Salsa de tomate con albahaca","Combino",45,1.3,6.2,1.2,2,[200,"ración","raciones"],"",0,0,"20037154",4.4],
    ["m_crownfield_muesli_premium_de_frutos","Muesli premium de frutos secos y fruta","Crownfield",377,7.9,60.5,9.7,8.2,[50,"ración","raciones"],"",0,0,"20202859",24.8],
    ["m_cuetara_galletas_saladas_kritita","Galletas saladas Krititas","Cuétara",505,6.5,60,26,2.5,[100,"ración","raciones"],"",0,0,"8434165466333",8.7],
    ["m_alpro_bebida_de_almendras_tost","Bebida de almendras tostadas","Alpro",23,0.5,2.6,1.2,0.3,[100,"ración","raciones"],"",1,0,"5411188110835",2.4],
    ["m_danone_yogur_activia_de_coco","Yogur Activia de coco","Danone",93,3.6,12.6,3.1,0,[125,"ración","raciones"],"",0,0,"3033491350863",12.6],
    ["m_dr_oetker_pizza_ristorante_vegetal","Pizza Ristorante vegetal","Dr. Oetker",193,6.7,22,7.9,2,[385,"ración","raciones"],"",0,0,"4001724039143",3.5],
    ["m_dulcesol_pan_de_molde_integral","Pan de molde integral","Dulcesol",250,10,40,4,7.2,[29,"ración","raciones"],"",0,0,"8410087414874",3.2],
    ["m_galbani_queso_mozzarella_maxi","Queso mozzarella maxi","Galbani",220,17,2,16,0,[30,"ración","raciones"],"",0,0,"8000430135268",1],
    ["m_le_pain_de_tostadas_crujientes_de_t","Tostadas crujientes de trigo sarraceno","Le Pain des Fleurs",386,12.9,75.7,2.9,4.3,[7,"ración","raciones"],"",0,0,"3380380047749",2.9],
    ["m_ethiquable_chocolate_negro_madagasc","Chocolate negro Madagascar 85 %","Ethiquable",615,11,24,51,11,[10,"ración","raciones"],"",0,0,"3760091722508",14],
    ["m_ethiquable_chocolate_negro_ecuador_","Chocolate negro Ecuador 80 %","Ethiquable",610,9.9,28,49,10,[100,"ración","raciones"],"",0,0,"3760091726667",19],
    ["m_freshona_esparragos_blancos","Espárragos blancos","Freshona",18,1.7,1.6,0.2,0,[250,"vaso","vasos"],"",1,0,"20004279",1.6],
    ["m_gullon_galletas_fibra_zero_sin_","Galletas Fibra Zero sin azúcares","Gullón",431,6.1,65,17,9.3,[34,"ración","raciones"],"",0,0,"8410376009392",5],
    ["m_gullon_galletas_sandwich_zero_s","Galletas sándwich Zero sin azúcares","Gullón",434,7,67,18,7.8,[26,"ración","raciones"],"",0,0,"8410376037784",4],
    ["m_gullon_galletas_digestive_avena","Galletas Digestive avena y chocolate","Gullón",479,7.5,61.2,21.1,6.8,[15,"ración","raciones"],"",0,0,"8410376026962",21.8],
    ["m_gullon_galletas_digestive_avena2","Galletas Digestive avena y naranja","Gullón",475,8.1,60,21,6.8,[14,"ración","raciones"],"",0,0,"8410376047578",18],
    ["m_gullon_galletas_doradas_al_horn","Galletas doradas al horno Zero sin azúcares","Gullón",429,6,68,18,4,[100,"ración","raciones"],"",0,0,"8410376009408",0.5],
    ["m_gullon_galletas_digestive_muesl","Galletas Digestive muesli","Gullón",462,7.5,64,18,7,[12,"ración","raciones"],"",0,0,"8410376026979",21],
    ["m_gullon_galletas_mega_duo","Galletas Mega Dúo","Gullón",480,5.9,67,20,4,[26,"ración","raciones"],"",0,0,"8410376017113",31],
    ["m_gullon_galleta_ligera_sin_sal_y","Galleta ligera sin sal y sin azúcares","Gullón",408,9,58,13,17,[100,"ración","raciones"],"",0,0,"8410376002201",2.8],
    ["m_gullon_galletas_chip_choco_sin_","Galletas Chip Choco sin gluten y sin azúcares añadidos","Gullón",444,5.5,63,23,4.5,[10,"ración","raciones"],"",0,0,"8410376037883",0.7],
    ["m_old_el_pas_tortillas_de_trigo_integ","Tortillas de trigo integrales (wraps)","Old El Paso",293,9.1,47.8,6,5.5,[58,"ración","raciones"],"",0,0,"8410076470812",2.3],
    ["m_old_el_pas_tortillas_de_trigo_wraps","Tortillas de trigo (wraps)","Old El Paso",302,9.1,53.2,5.2,1.6,[58,"ración","raciones"],"",0,0,"8410076472953",2.1],
    ["m_old_el_pas_totopos_nachips","Totopos Nachips","Old El Paso",483,7.7,59,23.7,6,[30,"ración","raciones"],"",0,0,"8410076481597",0.7],
    ["m_mission_tortillas_multicereales_","Tortillas multicereales (wraps)","Mission",312,7.3,52,7,6.4,[62,"ración","raciones"],"",0,0,"8710637105390",1],
    ["m_gullon_galletas_desayuno_zero_s","Galletas Desayuno Zero sin azúcares","Gullón",410,6.8,65,14,9.8,[9,"ración","raciones"],"",0,0,"8410376042498",1.4],
    ["m_bruggen_copos_de_avena_extra_sua","Copos de avena extra suaves","Brüggen",375,14,59,7,10,[40,"ración","raciones"],"",0,1,"4008713713411",0.7],
    ["m_isola_bio_bebida_de_avena_sin_glut","Bebida de avena sin gluten","Isola Bio",51,1,9,1,1,[100,"ración","raciones"],"",1,0,"8023678161363",4.2],
    ["m_j_d_gross_chocolate_negro_ecuador_","Chocolate negro Ecuador con frambuesa 70 %","J.D. Gross",552,8,36.2,39.3,0,[13,"ración","raciones"],"",0,0,"20177201",29],
    ["m_jardin_bio_crema_de_cacahuete_pura","Crema de cacahuete pura","Jardin Bio",628,27,12,51,6.5,[100,"ración","raciones"],"",0,0,"3760020507350",5.1],
    ["m_kinder_chocolate_kinder","Chocolate Kinder","Kinder",566,8.7,53.5,35,0,[13,"ración","raciones"],"",0,0,"80177609",53.3],
    ["m_aicha_concentrado_de_tomate","Concentrado de tomate","Aicha",117,4.6,23.7,0.4,3,[370,"ración","raciones"],"",1,0,"6111021090049",9],
    ["m_lidl_chocolate_negro_85","Chocolate negro 85 %","Lidl",585,10.5,21.2,48.1,14,[100,"ración","raciones"],"",0,0,"4056489366461",12.8],
    ["m_lidl_muesli_crunchy_de_4_frut","Muesli crunchy de 4 frutos secos","Lidl",460,10.3,58.9,18.6,8.1,[60,"ración","raciones"],"",0,0,"4056489210016",7.9],
    ["m_lidl_muesli_crunchy_0","Muesli crunchy 0 %","Lidl",423,11.2,64.9,13.4,8.1,[50,"ración","raciones"],"",0,0,"4056489167853",0.9],
    ["m_lidl_muesli_crunchy_proteico_","Muesli crunchy proteico con cacahuete","Lidl",453,25.1,50.3,15.7,5,[50,"ración","raciones"],"",0,0,"4056489936176",1.3],
    ["m_milbona_li_yogur_proteico_de_coco","Yogur proteico de coco","Milbona (Lidl)",72,10,6.3,0.6,0.1,[200,"ración","raciones"],"",0,0,"4056489685937",5.1],
    ["m_milbona_li_yogur_proteico_de_aranda","Yogur proteico de arándanos","Milbona (Lidl)",72,10,7.4,0.3,0.3,[200,"ración","raciones"],"",0,0,"4056489258346",5.6],
    ["m_lu_galletas_petit_ecolier_d","Galletas Petit Écolier de chocolate negro","LU",502,5.6,62,25,4.5,[25,"ración","raciones"],"",0,0,"5410041010800",36],
    ["m_magnum_helado_magnum_cookie_dou","Helado Magnum Cookie Dough","Magnum",273,4.1,31,15,0.3,[100,"ración","raciones"],"",0,0,"8711327373105",25],
    ["m_twix_twix","Twix","Twix",493,4.6,65,24,1.6,[25,"ración","raciones"],"",0,0,"5900951313592",48],
    ["m_hacendado_barritas_de_espelta_sabo","Barritas de espelta sabor manzana 0 %","Hacendado",346,6.1,55,6.1,24,[20,"ración","raciones"],"",0,0,"8402001012174",4.8],
    ["m_hacendado_chocolate_negro_85_cacao22","Chocolate negro 85 % cacao","Hacendado",600,12,20,49,14,[100,"ración","raciones"],"",0,0,"8480000607225",14],
    ["m_hacendado_avena_crunchy_con_cacao","Avena crunchy con cacao","Hacendado",393,13,65,6.4,11,[100,"ración","raciones"],"",0,1,"8402001015205",9],
    ["m_hacendado_yogur_natural_proteinas_","Yogur natural proteínas 0 %","Hacendado",52,10,3.1,0.5,0,[120,"ración","raciones"],"",0,0,"8480000212566",3.1],
    ["m_hacendado_barrita_de_frutos_secos","Barrita de frutos secos","Hacendado",507,14,34,32,11,[25,"ración","raciones"],"",0,0,"8402001013492",11],
    ["m_principe_galletas_principe_de_cho","Galletas Príncipe de chocolate","Príncipe",467,6.3,69,17,4,[20,"ración","raciones"],"",0,0,"7622210449283",32],
    ["m_principe_galletas_principe_rellen","Galletas Príncipe rellenas de crema de chocolate","Príncipe",468,6.2,71,17,3.1,[100,"ración","raciones"],"",0,0,"7622210204424",32],
    ["m_mutti_passata_pure_de_tomate_n","Passata (puré de tomate natural)","Mutti",36,1.6,5.1,0.5,0,[100,"ración","raciones"],"",0,0,"8005110630408",4.5],
    ["m_nakd_barrita_proteica_de_crem","Barrita proteica de crema de cacahuete","Nakd",420,17,33,21,16,[45,"ración","raciones"],"",0,0,"5060088700099",28],
    ["m_nature_val_barrita_crunchy_de_avena","Barrita Crunchy de avena y chocolate negro","Nature Valley",473,8.7,61.5,19.8,7,[42,"ración","raciones"],"",0,0,"8410076801197",26.8],
    ["m_oatly_bebida_de_avena_barista_","Bebida de avena Barista Edition","Oatly",61,1.1,7.1,3,0.8,[100,"ración","raciones"],"",0,0,"7394376616709",3.4],
    ["m_oatly_bebida_de_avena","Bebida de avena","Oatly",48,1.1,7.2,1.5,0.8,[100,"ración","raciones"],"",0,0,"7394376615979",3.5],
    ["m_pagen_rollitos_de_canela","Rollitos de canela","Pågen",373,7.3,52,14,0,[22,"ración","raciones"],"",0,0,"7311070019780",19],
    ["m_risi_buscalios","Buscalios","Risi",519,5.8,67.3,23.1,0,[100,"ración","raciones"],"",0,0,"8411859551445",7.5],
    ["m_sabroz_arroz_integral_precocina","Arroz integral precocinado","Sabroz",164,3.8,31,2.2,2.8,[125,"ración","raciones"],"",0,0,"8410184040747",0.5],
    ["m_schar_pan_de_molde_vital_sin_g","Pan de molde Vital sin gluten","Schär",262,4.5,36,9.2,8.8,[100,"ración","raciones"],"",0,0,"8008698011065",0.9],
    ["m_crownfield_cereales_special_flakes_","Cereales Special Flakes classic","Crownfield",386,8.9,79.5,1.8,8.1,[50,"ración","raciones"],"",0,0,"20621469",8.8],
    ["m_j_d_gross_chocolate_negro_95_cacao","Chocolate negro 95 % cacao","J.D. Gross",600,12.8,12.8,51.2,10.4,[13,"ración","raciones"],"",0,0,"20815882",2.4],
    ["m_sojade_yogur_de_soja_natural","Yogur de soja natural","Sojade",52,4.8,1.6,2.9,0,[100,"ración","raciones"],"",0,0,"3273220181027",0],
    ["m_tastino_tostas_integrales_de_cen","Tostas integrales de centeno con sésamo","Tastino",360,11,58,6,16,[10,"ración","raciones"],"",0,0,"20006167",2.4],
    ["m_jordans_muesli_especial_30_fruta","Muesli especial 30 % frutas y frutos secos","Jordans",360,10,60,7.2,8.8,[45,"ración","raciones"],"",0,0,"5010477348678",17],
    ["m_wasa_pan_crujiente_de_fibra","Pan crujiente de fibra","Wasa",333,12,47,5,26,[10,"ración","raciones"],"",0,0,"7300400481588",2],
    ["m_wasa_pan_crujiente_original","Pan crujiente original","Wasa",334,9,62,1.5,19,[11,"ración","raciones"],"",0,0,"7300400118101",1],
    ["m_weetabix_cereales_crispy_minis_de","Cereales Crispy Minis de chocolate","Weetabix",386,10,70,5.1,10,[40,"ración","raciones"],"",0,0,"5010029229110",17],
    ["m_weetabix_cereales_weetabix_origin","Cereales Weetabix original","Weetabix",355,11,68,2,10,[38,"ración","raciones"],"",0,0,"5010029000801",4.2]
];
BRAND_FOODS.forEach(([id, name, brand, kcal, p, c, f, fib, serv, em, ml, raw, off, sug]) => {
    const role = p * 4 >= Math.max(c * 4, f * 9) ? 'protein' : f * 9 > c * 4 ? 'fat' : 'carb';
    FOODS.push({ id, name, brand, cat: 'marca', role, meals: 'BSLD', p, f, c, fib, kcal, min: 0, max: 0, flags: '', diaryOnly: 1, serv, em, ...(ml ? { ml: 1 } : {}), ...(raw ? { raw: 1 } : {}), off, ...(sug != null ? { sug } : {}) });
});
// </marcas>
// <azucar> (lo genera tools/genericos/auditar.js · azúcares USDA de los alimentos genéricos de siempre)
const SUG_BASE = {"pollo":0,"pavo":0,"salmon":0,"merluza":0,"huevo":0.4,"claras":0.7,"tofu":0.6,"arroz":0.1,"pasta":2.7,"patata":0.8,"avena":1,"aove":0,"aguacate":0.7,"almendras":4.4,"nueces":2.6,"platano":12.2,"manzana":10.4,"naranja":9.4,"fresas":4.9,"arandanos":10,"kiwi":9,"pera":9.8,"pina":9.9,"mango":13.4,"brocoli":1.7,"espinacas":0.4,"calabacin":2.1,"pimiento":3.9,"champi":2,"coliflor":1.9,"tomate":2.6,"zanahoria":4.7,"berenjena":2.9,"pepino":1.7,"cebolla":4.2,"uvas":15.5,"sandia":6.2,"melon":7.4,"cerezas":12.8,"pistachos":7.7,"anacardos":5.9,"mantequilla":0.1,"girasol":0,"cacahuete":10.5,"boniato":4.2,"lentejas":1.8,"garbanzos":4.8,"alubias":0.3,"azucar":99.8,"leche":4.7,"pollopl":0,"patatacocida":0.9,"arrozcocido":0.1,"pastacocida":0.6,"quinoacocida":0.9,"cuscuscocido":0.1,"brocolicocido":1.4,"avellanas":4.3,"datiles":63.4,"pasas":65.2,"kale":0.3};
FOODS.forEach(f => { if (f.sug == null && SUG_BASE[f.id] != null) f.sug = SUG_BASE[f.id]; });
// </azucar>
