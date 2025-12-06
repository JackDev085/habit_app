self.addEventListener("install", () => {
  console.log("Service Worker instalado");
});

self.addEventListener("fetch", (event) => {
  // estratégia básica (pode ser melhorada)
  event.respondWith(fetch(event.request));
});
