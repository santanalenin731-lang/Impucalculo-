const CACHE_NAME = 'impucalculo-v125';
const DYNAMIC_CACHE_NAME = 'impucalculo-dynamic-v125';

// App shell esencial (sin duplicar /index.html ni precargar >1 MB de hero JPEGs/artículos en install)
const STATIC_ASSETS = [
    '/',
    '/calculadora.html',
    '/prestaciones.html',
    '/blog.html',
    '/css/tailwind.min.css',
    '/logo_new.webp',
    '/icon-192.png'
];

// Install Event: Precache lightweight app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                STATIC_ASSETS.map((asset) => {
                    return fetch(asset, { cache: 'reload' })
                        .then((res) => {
                            if (res.ok) return cache.put(asset, res);
                        })
                        .catch(() => cache.add(asset).catch(() => {}));
                })
            );
        })
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event: Same-origin ONLY; never intercept third-party ad networks, analytics or external scripts
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (!url.protocol.startsWith('http')) return;

    // CRÍTICO: Jamás interceptar tráfico cross-origin (AdSense, DoubleClick, DSP/SSP, Google Fonts, etc.)
    if (url.origin !== self.location.origin) return;

    // Bypass root crawl, verification and ads metadata files
    if (
        url.pathname === '/ads.txt' ||
        url.pathname === '/sitemap.xml' ||
        url.pathname === '/robots.txt' ||
        url.pathname === '/google1d19814154dc1b8c.html'
    ) {
        return;
    }

    // 1. HTML Pages, Manifest & Local JS -> Network First, fallback to Cache
    if (
        event.request.mode === 'navigate' ||
        url.pathname === '/' ||
        url.pathname.endsWith('.html') ||
        url.pathname.endsWith('.js') ||
        url.pathname === '/manifest.json'
    ) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse.ok) {
                        const clone = networkResponse.clone();
                        caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;
                        if (event.request.mode === 'navigate') {
                            return caches.match('/', { ignoreSearch: true }).then((fallbackResponse) => {
                                return fallbackResponse || new Response('Sin conexión', {
                                    status: 503,
                                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                                });
                            });
                        }
                        return new Response('', { status: 503, statusText: 'Offline' });
                    });
                })
        );
        return;
    }

    // 2. Own Static Assets (Images, CSS, Icons) -> Cache First, fallback to Network
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                if (networkResponse.ok) {
                    const clone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return networkResponse;
            }).catch(() => {
                return new Response('', { status: 503, statusText: 'Offline' });
            });
        })
    );
});
