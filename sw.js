// Uygulama kabuğunu önbelleğe alır: internet zayıfken de uygulama açılır.
// Piyasa verileri her zaman GitHub'dan canlı okunur (önbelleğe alınmaz).
const SURUM = "broker-v10";
const KABUK = ["./", "index.html", "manifest.webmanifest", "ikon-192.png", "ikon-512.png", "ikon-180.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(SURUM).then((c) => c.addAll(KABUK)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== SURUM).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || u.pathname.includes("/demo/")) return;      // GitHub API ve demo verisi: ağdan
  e.respondWith(fetch(e.request).then((r) => {                                    // önce ağ, olmazsa önbellek
    const kopya = r.clone(); caches.open(SURUM).then((c) => c.put(e.request, kopya)); return r;
  }).catch(() => caches.match(e.request)));
});
