const CACHE_NAME = 'impucalculo-v123';
const DYNAMIC_CACHE_NAME = 'impucalculo-dynamic-v123';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/calculadora.html',
    '/prestaciones.html',
    '/blog.html',
    '/sobre-nosotros.html',
    '/contacto.html',
    '/terminos.html',
    '/privacidad.html',
    '/blog/dimision-laboral-rd-prestaciones.html',
    '/blog/liquidacion-renuncia-derechos-adquiridos.html',
    '/blog/gastos-educativos-dgii-ley-179-09.html',
    '/blog/isr-dominicano-guia.html',
    '/blog/prestaciones-laborales-guia.html',
    '/blog/calculo-cesantia-preaviso-codigo-trabajo-rd.html',
    '/blog/calculo-prestaciones-empleadas-domesticas-rd.html',
    '/blog/regalia-pascual-rd.html',
    '/blog/bonificacion-beneficios-rd.html',
    '/blog/tss-afp-ars-guia.html',
    '/blog/guia-uso-v2.html',
    '/css/tailwind.min.css',
    '/js/firebase-analytics.js',
    '/manifest.json',
    '/logo_new.webp',
    '/icon-192.png',
    '/icon-512.png'
];

// Install Event: Precache static resources bypassing browser HTTP cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Precaching files with network reload');
            return Promise.all(
                STATIC_ASSETS.map((asset) => {
                    return fetch(asset, { cache: 'reload' })
                        .then((res) => {
                            if (res.ok) return cache.put(asset, res);
                        })
                        .catch((err) => {
                            console.warn('[Service Worker] Precache fallback for:', asset, err);
                            return cache.add(asset);
                        });
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
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event: Network First for HTML, Cache First for Images
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (!url.protocol.startsWith('http')) return;

    // Bypass third-party analytics, ad networks, consent tools, and root crawl/ads metadata files
    if (
        url.hostname.includes('googlesyndication.com') ||
        url.hostname.includes('google-analytics.com') ||
        url.hostname.includes('googletagmanager.com') ||
        url.hostname.includes('doubleclick.net') ||
        url.hostname.includes('googleadservices.com') ||
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('adtrafficquality.google') ||
        url.hostname.includes('fundingchoicesmessages.google.com') ||
        url.pathname === '/ads.txt' ||
        url.pathname === '/sitemap.xml' ||
        url.pathname === '/robots.txt' ||
        url.pathname === '/google1d19814154dc1b8c.html'
    ) {
        return;
    }

    // 1. HTML Pages -> Network First, fallback to Cache (mapping '/' to '/index.html')
    if (
        event.request.mode === 'navigate' ||
        url.pathname === '/' ||
        url.pathname.endsWith('.html')
    ) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        if (event.request.method === 'GET' && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                })
                .catch(() => {
                    console.log('[Service Worker] Network failed, serving from cache:', event.request.url);
                    return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;
                        return caches.match('/index.html', { ignoreSearch: true }).then((fallbackResponse) => {
                            return fallbackResponse || new Response('Sin conexión', {
                                status: 503,
                                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                            });
                        });
                    });
                })
        );
    }
    // 2. Static Assets (Images, CSS, etc.) -> Cache First, fallback to Network
    else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    if (event.request.method === 'GET' && networkResponse.status === 200) {
                        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    return new Response('', { status: 503, statusText: 'Offline' });
                });
            })
        );
    }
});
