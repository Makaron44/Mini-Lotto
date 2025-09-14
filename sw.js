
const CACHE_NAME='mini-lotto-cache-v7';
const PRECACHE_URLS=['./','./index.html','./results.html','./settings.html','./css/styles.css','./js/db.js','./js/pwa.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE_URLS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return; e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const copy=r.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy)); return r;}).catch(()=>caches.match('./index.html'))));});
