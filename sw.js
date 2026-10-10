// nutriDL · service worker (generado por tools/build-sw.js; no editar a mano)
// Con internet: siempre la versión más nueva (y se guarda una copia). Sin internet: la copia guardada.
// Las consultas a Open Food Facts no pasan por aquí.
const CACHE = 'nutridl-989ec4dbc9';
const FILES = [
  "./css/app.css",
  "./css/fonts.css",
  "./css/icons.css",
  "./css/legal.css",
  "./css/tailwind.css",
  "./fonts/fa-regular-400.woff2",
  "./fonts/fa-solid-900.woff2",
  "./fonts/newsreader-500.woff2",
  "./fonts/newsreader-600.woff2",
  "./fonts/plus-jakarta-sans-400.woff2",
  "./fonts/plus-jakarta-sans-500.woff2",
  "./fonts/plus-jakarta-sans-600.woff2",
  "./fonts/plus-jakarta-sans-700.woff2",
  "./fonts/plus-jakarta-sans-800.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/icon.svg",
  "./index.html",
  "./js/analytics.js",
  "./js/app.js",
  "./js/calc.js",
  "./js/coach.js",
  "./js/core.js",
  "./js/dashboard.js",
  "./js/data/exercises.js",
  "./js/data/foods.js",
  "./js/diary.js",
  "./js/engine.js",
  "./js/gym.js",
  "./js/insights.js",
  "./js/kitchen.js",
  "./js/main.js",
  "./js/parser.js",
  "./js/pdf.js",
  "./js/plans.js",
  "./js/profiles.js",
  "./js/progress.js",
  "./js/wizard.js",
  "./manifest.webmanifest",
  "./privacidad.html",
  "./terminos.html"
];

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
