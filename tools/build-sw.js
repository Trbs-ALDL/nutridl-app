// Genera sw.js con la lista de archivos de la app y una versión que cambia con su contenido.
// Así, al publicar cambios, los móviles descargan la versión nueva. Uso: npm run build (lo incluye)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const files = ['index.html', 'privacidad.html', 'terminos.html', 'manifest.webmanifest'];
for (const d of ['css', 'js', 'fonts', 'icons']) {
    const walk = p => fs.readdirSync(p, { withFileTypes: true }).forEach(e => { const f = path.join(p, e.name); if (e.isDirectory()) walk(f); else files.push(path.relative(root, f).replace(/\\/g, '/')); });
    walk(path.join(root, d));
}
const hash = crypto.createHash('sha256');
files.sort().forEach(f => hash.update(f).update(fs.readFileSync(path.join(root, f))));
const version = hash.digest('hex').slice(0, 10);
const sw = `// nutriDL · service worker (generado por tools/build-sw.js; no editar a mano)
// Guarda la app en el dispositivo para que funcione sin conexión. Las consultas a Open Food Facts siempre van a internet.
const CACHE = 'nutridl-${version}';
const FILES = ${JSON.stringify(files.sort().map(f => './' + f), null, 2)};

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', ...FILES])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('nutridl-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Open Food Facts y demás: red directa
    // Primero lo guardado (rápido y sin conexión); si no está, a la red
    e.respondWith(caches.match(e.request, { ignoreSearch: url.pathname.endsWith('/') || url.pathname.endsWith('index.html') }).then(hit => hit || fetch(e.request)));
});
`;
fs.writeFileSync(path.join(root, 'sw.js'), sw);
console.log(`sw.js: ${files.length} archivos · versión ${version}`);
