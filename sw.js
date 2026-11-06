// 영샵 앱 설치용 서비스워커: 페이지 이동만 네트워크 우선, 끊기면 저장된 첫 화면 표시
const C = "youngshop-v1";
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.add("/")).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).pathname === "/") { const cp = r.clone(); caches.open(C).then(c => c.put("/", cp)); } return r; }).catch(() => caches.match("/")));
});
