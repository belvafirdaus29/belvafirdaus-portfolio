(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const body = document.body;

  const revealSelectors = [
    ".hero__content",
    ".hero__visual",
    ".section-heading",
    ".about__bio",
    ".timeline",
    ".timeline article",
    ".skill-card",
    ".software-grid article",
    ".project-card",
    ".contact__inner",
    ".case-hero",
    ".case-copy",
    ".case-meta",
    ".gallery img",
    ".project-navigation",
    ".footer",
  ];

  const staggerGroups = [
    ".timeline article",
    ".skill-grid .skill-card",
    ".software-grid article",
    ".project-grid .project-card",
    ".gallery img",
  ];

  const getRevealItems = () => Array.from(document.querySelectorAll(".reveal"));

  const addRevealClasses = () => {
    document.querySelectorAll(revealSelectors.join(",")).forEach((element) => {
      element.classList.add("reveal");
    });
  };

  const applyStagger = () => {
    staggerGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 100}ms`);
      });
    });
  };

  const showAllRevealItems = () => {
    getRevealItems().forEach((item) => item.classList.add("is-visible"));
  };

  const setupRevealObserver = () => {
    const revealItems = getRevealItems();

    if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
      body.classList.remove("reveal-animations-ready");
      showAllRevealItems();
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  };

  const startRevealSystem = () => {
    addRevealClasses();
    applyStagger();

    if (!prefersReducedMotion.matches) {
      body.classList.add("reveal-animations-ready");
    }

    window.requestAnimationFrame(() => {
      body.classList.add("page-loaded");
      setupRevealObserver();
    });

    window.setTimeout(() => {
      body.classList.add("page-loaded");
    }, 1200);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startRevealSystem, { once: true });
  } else {
    startRevealSystem();
  }
})();
