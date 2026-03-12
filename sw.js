const cacheName = 'mpl-v2';
const assets = [
    './',
    './index.html',
    './login.html',
    './manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(assets))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))
        )
    );
});

self.addEventListener('fetch', e => {
    /* Firebase و Google APIs تمشي على النت دايماً */
    if (e.request.url.includes('firebase') ||
        e.request.url.includes('google') ||
        e.request.url.includes('gstatic')) {
        e.respondWith(fetch(e.request));
        return;
    }
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
