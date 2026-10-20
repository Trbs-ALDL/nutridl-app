// Comprueba el estado del idioma: qué textos están ya preparados y cuáles faltan por traducir.
// Uso:  node tools/i18n-check.js            → resumen
//       node tools/i18n-check.js --faltan   → lista lo que falta, archivo por archivo
//       node tools/i18n-check.js --sin-en   → claves marcadas que aún no tienen inglés
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');

// 1. Claves ya marcadas: t('…') en el JS y data-t="…" en el HTML
const KEY_JS = /(?<![\w$.])tr\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/g;
const KEY_HTML = /data-t(?:-ph|-al|-ti)?="([^"]+)"/g;
const claves = new Set();
const archivos = fs.readdirSync(path.join(root, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f);
for (const f of archivos) { let m; const s = rd(f); KEY_JS.lastIndex = 0; while ((m = KEY_JS.exec(s))) claves.add(m[2]); }
{ let m; const s = rd('index.html'); KEY_HTML.lastIndex = 0; while ((m = KEY_HTML.exec(s))) claves.add(m[1]); }

// 2. Traducciones disponibles
let EN = {};
try {
    const vm = require('vm'), ctx = {};
    vm.createContext(ctx);
    vm.runInContext(rd('js/data/lang-en.js') + ';this.EN = LANG_EN;', ctx);
    EN = ctx.EN || {};
} catch (e) { EN = {}; }

// 3. Textos en español que todavía NO están marcados.
//    Se busca dentro de comillas y de plantillas, saltando comentarios y clases de CSS.
const ES = /[áéíóúñÁÉÍÓÚÑ¿¡]|\b(?:de|del|la|el|los|las|tu|tus|que|para|con|sin|por|una|uno|más|al|lo|se|te|ya)\b/;
const CODIGO = /^[\s\w$.,;:()[\]{}<>=!&|?+\-*/'"`#%]*$/;
function sinMarcar(f) {
    const out = [];
    rd(f).split('\n').forEach((l, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;                 // comentarios
        const trozos = l.match(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g) || [];
        for (const tr of trozos) {
            const txt = tr.slice(1, -1);
            if (txt.length < 3 || !ES.test(txt)) continue;
            if (/^(fa-|nd-|text-|bg-|flex|grid|hidden|w-|h-|p-|m-)/.test(txt)) continue;  // clases
            if (CODIGO.test(txt) && !/[áéíóúñ¿¡]/i.test(txt)) continue;
            if ([...claves].some(k => txt.includes(k) || k.includes(txt))) continue;      // ya marcado
            out.push({ linea: i + 1, txt: txt.length > 78 ? txt.slice(0, 75) + '…' : txt });
        }
    });
    return out;
}

const faltan = {};
let totalFaltan = 0;
for (const f of archivos.concat(['index.html'])) { const l = sinMarcar(f); if (l.length) { faltan[f] = l; totalFaltan += l.length; } }
const sinEn = [...claves].filter(k => EN[k] == null);

const arg = process.argv[2] || '';
if (arg === '--faltan') {
    for (const f in faltan) { console.log('\n' + f + '  (' + faltan[f].length + ')'); faltan[f].slice(0, 60).forEach(x => console.log('  ' + x.linea + ': ' + x.txt)); }
} else if (arg === '--sin-en') {
    sinEn.forEach(k => console.log(JSON.stringify(k) + ': ,'));
} else {
    const hechas = claves.size - sinEn.length;
    const pct = claves.size + totalFaltan ? Math.round(hechas / (claves.size + totalFaltan) * 100) : 0;
    console.log(`Textos preparados: ${claves.size}  ·  con inglés: ${hechas}  ·  marcados sin inglés: ${sinEn.length}`);
    console.log(`Todavía en español sin marcar: ${totalFaltan}`);
    console.log(`Cobertura: ${pct} %`);
    console.log('\nPor archivo (lo que falta):');
    Object.entries(faltan).sort((a, b) => b[1].length - a[1].length).forEach(([f, l]) => console.log('  ' + f.padEnd(22) + l.length));
}
// Para las pruebas
module.exports = { claves: [...claves], sinEn, faltan, totalFaltan };
