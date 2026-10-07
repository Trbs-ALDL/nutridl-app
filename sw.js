// nutriDL · service worker (generado por tools/build-sw.js; no editar a mano)
// Guarda la app en el dispositivo para que funcione sin conexión. Las consultas a Open Food Facts siempre van a internet.
const CACHE = 'nutridl-2b99bc4812';
const FILES = [
  "./css/app.css",
  "./css/fonts.css",
  "./css/icons.css",
  "./css/legal.css",
  "./css/tailwind.css",
  "./fonts/fa-regular-400.woff2",
  "./fonts/fa-solid-900.woff2",
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
  "./js/app.js",
  "./js/calc.js",
  "./js/core.js",
  "./js/dashboard.js",
  "./js/data/exercises.js",
  "./js/data/foods.js",
  "./js/diary.js",
  "./js/gym.js",
  "./js/main.js",
  "./js/pdf.js",
  "./js/profiles.js",
  "./js/progress.js",
  "./js/wizard.js",
  "./manifest.webmanifest",
  "./privacidad.html",
  "./terminos.html"
];

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
