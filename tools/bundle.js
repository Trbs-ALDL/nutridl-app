// Empaqueta la app en UN solo archivo HTML (CSS, JavaScript, fuentes e iconos dentro) para guardar copias
// que se abren con doble clic y sin internet. Uso: node tools/bundle.js "C:/ruta/copia.html"
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = process.argv[2];
if (!out) { console.log('Uso: node tools/bundle.js "C:/ruta/copia.html"'); process.exit(1); }
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
// Fuentes e imágenes referenciadas desde el CSS → data: URI
const inlineUrls = (css, base) => css.replace(/url\((\.\.\/[^)]+)\)/g, (m, rel) => {
    const file = path.join(root, base, rel);
    const type = file.endsWith('.woff2') ? 'font/woff2' : file.endsWith('.png') ? 'image/png' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';
    return `url(data:${type};base64,${fs.readFileSync(file).toString('base64')})`;
});
let h = read('index.html');
h = h.replace(/[ \t]*<link rel="manifest"[^>]*>\n/, '');
h = h.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => `<style>${inlineUrls(read(href), path.dirname(href))}</style>`);
h = h.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => `<script>\n${read(src).replace(/<\/script/gi, '<\\/script')}\n</script>`);
const svg = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(root, 'icons', 'icon.svg')).toString('base64');
h = h.replace('href="icons/icon.svg"', `href="${svg}"`).replace('href="icons/apple-touch-icon.png"', `href="${svg}"`);
fs.writeFileSync(out, h);
console.log(`${out} · ${(Buffer.byteLength(h) / 1024).toFixed(0)} KB`);
