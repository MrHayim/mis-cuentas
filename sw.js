// Mis Cuentas · guarda la app en el teléfono para que abra rápido y sin señal.
// Sube el número de VERSION cada vez que cambies index.html para que los teléfonos tomen la versión nueva.
const VERSION = 'mis-cuentas-v1';
const ARCHIVOS = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;                                   // los guardados van directo a Google
  if (url.hostname.endsWith('google.com') || url.hostname.endsWith('googleusercontent.com')) return;
  if (url.hostname.includes('fonts.')) {                               // tipografías: guardar una vez
    e.respondWith(caches.open(VERSION).then(c => c.match(req).then(r => r || fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // App: primero intenta la versión más nueva; si no hay señal (o tarda), usa la guardada.
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const red = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; });
    const espera = new Promise(r => setTimeout(r, 3000)).then(() => c.match(req, { ignoreSearch: true }));
    try { return (await Promise.race([red, espera])) || await red; }
    catch (err) { return (await c.match(req, { ignoreSearch: true })) || (await c.match('index.html')) || Response.error(); }
  })());
});
