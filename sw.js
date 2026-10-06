// medbasha - Service Worker v2.9.36
const CACHE_NAME = 'bustalk-v2-9-36';

const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    './icon-152.png',
    './icon-192.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; 
                }
                return fetch(event.request).then(
                    function(response) {
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        var responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                // No guardamos llamadas a APIs externas en el caché básico
                                if (event.request.url.startsWith(self.location.origin)) {
                                    cache.put(event.request, responseToCache);
                                }
                            });
                        return response;
                    }
                );
            })
    );
});
