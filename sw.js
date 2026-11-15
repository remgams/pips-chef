// Mon Frigo Chef : garde l'application en mémoire pour qu'elle marche sans internet
const CACHE = "frigo-chef-v1";
const FILES = ["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install", e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(
    caches.match(e.request).then(hit=> hit || fetch(e.request).then(res=>{
      // garde aussi les polices pour l'utilisation hors ligne
      if(res.ok && (e.request.url.startsWith(self.location.origin) || e.request.url.includes("fonts."))){
        const copy = res.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy));
      }
      return res;
    }).catch(()=> caches.match("index.html")))
  );
});
