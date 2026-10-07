// 1) Pone a cada CSS/JS de index.html una marca de versión (?v=huella del contenido): así ningún móvil
//    ni el servidor de GitHub mezclan archivos de versiones distintas.
// 2) Genera sw.js: con internet SIEMPRE trae lo último (y lo guarda); sin internet usa lo guardado.
// Uso: npm run build (lo incluye)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const hashOf = buf => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);

// --- 1. Marcas de versión en index.html ---
const idxPath = path.join(root, 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');
idx = idx.replace(/(<(?:link rel="stylesheet" href|script src)=")((?:css|js)\/[^"?]+)(?:\?v=[0-9a-f]+)?(")/g,
    (m, a, file, b) => `${a}${file}?v=${hashOf(fs.readFileSync(path.join(root, file)))}${b}`);
fs.writeFileSync(idxPath, idx);

// --- 2. Lista de archivos y versión global ---
const files = ['index.html', 'privacidad.html', 'terminos.html', 'manifest.webmanifest'];
for (const d of ['css', 'js', 'fonts', 'icons']) {
    const walk = p => fs.readdirSync(p, { withFileTypes: true }).forEach(e => { const f = path.join(p, e.name); if (e.isDirectory()) walk(f); else files.push(path.relative(root, f).replace(/\\/g, '/')); });
    walk(path.join(root, d));
}
files.sort();
const h = crypto.createHash('sha256');
files.forEach(f => h.update(f).update(fs.readFileSync(path.join(root, f))));
const version = h.digest('hex').slice(0, 10);

const sw = `// nutriDL · service worker (generado por tools/build-sw.js; no editar a mano)
// Con internet: siempre la versión más nueva (y se guarda una copia). Sin internet: la copia guardada.
// Las consultas a Open Food Facts no pasan por aquí.
const CACHE = 'nutridl-${version}';
const FILES = ${JSON.stringify(files.map(f => './' + f), null, 2)};

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', ...FILES].map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('nutridl-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const req = e.request, url = new URL(req.url);
    if (req.method !== 'GET' || url.origin !== location.origin) return;
    e.respondWith((async () => {
        const cache = await caches.open(CACHE);
        try {
            // Red primero (sin la caché HTTP del navegador), con un límite de espera para conexiones muy lentas
            const net = fetch(req, { cache: 'no-cache' }); net.catch(() => { });
            const res = await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error('lenta')), 4000))]);
            if (res && res.ok) cache.put(req, res.clone());
            return res;
        } catch (err) {
            const hit = await cache.match(req) || await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await cache.match('./index.html') : null);
            if (hit) return hit;
            throw err;
        }
    })());
});
`;
fs.writeFileSync(path.join(root, 'sw.js'), sw);
console.log(`sw.js: ${files.length} archivos · versión ${version} · index.html con marcas de versión`);
