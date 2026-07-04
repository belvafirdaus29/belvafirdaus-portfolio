const adjacentProjectLinks = document.querySelectorAll("[data-project-adjacent]");

adjacentProjectLinks.forEach((link) => {
  const prefetch = document.createElement("link");
  prefetch.rel = "prefetch";
  prefetch.href = link.href;
  document.head.appendChild(prefetch);
});
