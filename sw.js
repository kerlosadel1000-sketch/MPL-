/* ══ MPL Service Worker — Network First ══
   دايماً بيجيب أحدث نسخة من النت
   ولو مفيش نت يرجع للكاش
══════════════════════════════════════════ */
const cacheName = 'mpl-v3';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    /* امسح كل الكاش القديم */
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    /* Firebase و Google دايماً من النت */
    if (e.request.url.includes('firebase') ||
        e.request.url.includes('google') ||
        e.request.url.includes('gstatic') ||
        e.request.url.includes('tailwind') ||
        e.request.url.includes('fonts')) {
        e.respondWith(fetch(e.request));
        return;
    }

    /* Network First — جرب النت الأول، لو فشل رجّع الكاش */
    e.respondWith(
        fetch(e.request)
            .then(res => {
                /* احفظ النسخة الجديدة في الكاش */
                const clone = res.clone();
                caches.open(cacheName).then(cache => cache.put(e.request, clone));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
