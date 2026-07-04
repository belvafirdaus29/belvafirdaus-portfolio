(() => {
  const emailLinks = document.querySelectorAll("[data-email-link]");
  if (!emailLinks.length) return;

  emailLinks.forEach((link) => {
    const composeHref = link.dataset.composeHref;
    if (composeHref) {
      link.href = composeHref;
    }

    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
