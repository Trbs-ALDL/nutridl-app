// Compara los alimentos genéricos que YA tenía la app con su equivalente oficial del USDA (SR Legacy)
// y lista los que se desvían: > 8 % en kcal, o > 1,5 g en proteína, grasa o hidratos (por 100 g).
// Uso: node tools/genericos/auditar.js <ruta a sr.json>
const fs = require('fs'), vm = require('vm'), path = require('path');
const SR = new Map(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).map(x => [x.d.toLowerCase(), x]));
const ctx = { console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'data', 'foods.js'), 'utf8') + ';this.FOODS=FOODS', ctx);
const F = new Map(ctx.FOODS.map(f => [f.id, f]));
// id de la app → descripción USDA equivalente (solo equivalencias claras)
const EQ = {
    pollo: 'Chicken, broilers or fryers, breast, meat only, raw', pavo: 'Turkey, whole, breast, meat only, raw',
    salmon: 'Fish, salmon, Atlantic, farmed, raw', merluza: 'Fish, whiting, mixed species, raw', gambas: 'Crustaceans, shrimp, raw',
    huevo: 'Egg, whole, raw, fresh', claras: 'Egg, white, raw, fresh', tofu: 'Tofu, firm, prepared with calcium sulfate and magnesium chloride (nigari)',
    tempeh: 'Tempeh', arroz: 'Rice, white, long-grain, regular, raw, enriched', pasta: 'Pasta, dry, enriched', quinoa: 'Quinoa, uncooked',
    patata: 'Potatoes, flesh and skin, raw', avena: 'Cereals, oats, regular and quick, not fortified, dry', aove: 'Oil, olive, salad or cooking',
    aguacate: 'Avocados, raw, all commercial varieties', almendras: 'Nuts, almonds', nueces: 'Nuts, walnuts, english', platano: 'Bananas, raw',
    manzana: 'Apples, raw, with skin (Includes foods for USDA\'s Food Distribution Program)', naranja: 'Oranges, raw, all commercial varieties',
    fresas: 'Strawberries, raw', arandanos: 'Blueberries, raw', kiwi: 'Kiwifruit, green, raw', pera: 'Pears, raw', pina: 'Pineapple, raw, all varieties',
    mango: 'Mangos, raw', brocoli: 'Broccoli, raw', espinacas: 'Spinach, raw', calabacin: 'Squash, summer, zucchini, includes skin, raw',
    pimiento: 'Peppers, sweet, red, raw', champi: 'Mushrooms, white, raw', coliflor: 'Cauliflower, raw', tomate: 'Tomatoes, red, ripe, raw, year round average',
    zanahoria: 'Carrots, raw', berenjena: 'Eggplant, raw', pepino: 'Cucumber, with peel, raw', cebolla: 'Onions, raw', uvas: 'Grapes, red or green (European type, such as Thompson seedless), raw',
    sandia: 'Watermelon, raw', melon: 'Melons, cantaloupe, raw', cerezas: 'Cherries, sweet, raw', pistachos: 'Nuts, pistachio nuts, raw',
    anacardos: 'Nuts, cashew nuts, raw', mantequilla: 'Butter, without salt', girasol: 'Oil, sunflower, linoleic, (approx. 65%)',
    chia: 'Seeds, chia seeds, dried', cacahuete: 'Peanut butter, smooth style, without salt', boniato: 'Sweet potato, raw, unprepared (Includes foods for USDA\'s Food Distribution Program)',
    lentejas: 'Lentils, mature seeds, cooked, boiled, without salt', garbanzos: 'Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt',
    alubias: 'Beans, white, mature seeds, cooked, boiled, without salt', azucar: 'Sugars, granulated', leche: 'Milk, reduced fat, fluid, 2% milkfat, with added vitamin A and vitamin D',
    pollopl: 'Chicken, broilers or fryers, breast, meat only, cooked, roasted', patatacocida: 'Potatoes, boiled, cooked without skin, flesh, without salt',
    arrozcocido: 'Rice, white, long-grain, regular, unenriched, cooked without salt', pastacocida: 'Pasta, cooked, enriched, without added salt',
    quinoacocida: 'Quinoa, cooked', cuscuscocido: 'Couscous, cooked', brocolicocido: 'Broccoli, cooked, boiled, drained, without salt',
    avellanas: 'Nuts, hazelnuts or filberts', datiles: 'Dates, deglet noor', pasas: 'Raisins, seedless', kale: 'Kale, raw',
};
const kc = f => f.kcal != null ? f.kcal : 4 * f.p + 9 * f.f + 4 * f.c + 2 * f.fib;
const out = [];
for (const [id, d] of Object.entries(EQ)) {
    const f = F.get(id), u = SR.get(d.toLowerCase());
    if (!f || !u) { console.log('· sin pareja:', id, !f ? '(id no existe)' : '(USDA no encontrado)'); continue; }
    const uc = Math.max(0, u.c - (u.fib || 0));
    const dk = Math.abs(kc(f) - u.kcal) / Math.max(u.kcal, 1), dp = Math.abs(f.p - u.p), df = Math.abs(f.f - u.f), dc = Math.abs(f.c - uc);
    if (dk > 0.08 || dp > 1.5 || df > 1.5 || dc > 1.5) out.push({ id, name: f.name, app: [Math.round(kc(f)), f.p, f.f, f.c, f.fib], usda: [Math.round(u.kcal), +u.p.toFixed(1), +u.f.toFixed(1), +uc.toFixed(1), +(u.fib || 0).toFixed(1)], d });
}
console.log(out.length, 'con desviación (kcal, P, G, HC, fibra):');
out.forEach(o => console.log(` ${o.id.padEnd(14)} app ${JSON.stringify(o.app).padEnd(26)} usda ${JSON.stringify(o.usda)}  ${o.name}`));
fs.writeFileSync(path.join(__dirname, 'auditoria.json'), JSON.stringify(out, null, 1));
