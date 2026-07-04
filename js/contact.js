(() => {
  const emailLinks = document.querySelectorAll("[data-email-link]");
  if (!emailLinks.length) return;

  const mobileQuery = window.matchMedia("(max-width: 768px)");

  const updateEmailLinks = () => {
    emailLinks.forEach((link) => {
      const desktopHref = link.dataset.desktopHref;
      const mobileHref = link.dataset.mobileHref;

      if (mobileQuery.matches && mobileHref) {
        link.href = mobileHref;
        link.removeAttribute("target");
        link.removeAttribute("rel");
        return;
      }

      if (desktopHref) {
        link.href = desktopHref;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });
  };

  updateEmailLinks();

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", updateEmailLinks);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(updateEmailLinks);
  }
})();
