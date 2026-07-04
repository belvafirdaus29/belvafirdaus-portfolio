const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const motionRevealSelectors = [
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
  ".gallery",
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

const addMotionReveal = (element) => {
  if (!element.classList.contains("reveal")) {
    element.classList.add("motion-reveal");
  }
};

const prepareMotionElements = () => {
  document.querySelectorAll(motionRevealSelectors.join(",")).forEach(addMotionReveal);

  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      const delay = Math.min(index, 9) * 80;
      element.style.setProperty("--motion-delay", `${delay}ms`);
    });
  });

  if (isMobileViewport || prefersReducedMotion.matches) return;

  const parallaxTargets = [
    [".hero__content h1, .case-hero h1, .section-heading h2", "-0.035"],
    [".hero__visual, .portrait-shell img", "0.045"],
    [".project-card img", "0.035"],
    [".gallery img", "0.045"],
    [".contact__inner", "-0.04"],
  ];

  parallaxTargets.forEach(([selector, speed]) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (!element.dataset.parallax) {
        element.dataset.parallax = speed;
      }
    });
  });
};

prepareMotionElements();

const revealItems = document.querySelectorAll(".reveal, .motion-reveal");
const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
let hasStartedPageEnter = false;

const hideLoader = () => {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
};

const showRevealItems = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

const showViewportRevealItems = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
      item.classList.add("is-visible");
    }
  });
};

const startPageEnter = () => {
  if (prefersReducedMotion.matches || hasStartedPageEnter) return;

  hasStartedPageEnter = true;
  document.body.classList.remove("page-exit");
  window.requestAnimationFrame(() => {
    document.body.classList.add("page-enter");
  });
};

const showInitialContent = () => {
  hideLoader();
  startPageEnter();
  showViewportRevealItems();

  if (prefersReducedMotion.matches) {
    showRevealItems();
  }
};

document.body.classList.add("is-loading");

if (!prefersReducedMotion.matches) {
  document.body.classList.add("reveal-ready");
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      window.setTimeout(showInitialContent, 120);
    },
    { once: true }
  );
} else {
  window.setTimeout(showInitialContent, 120);
}

window.addEventListener(
  "load",
  () => {
    window.setTimeout(showInitialContent, 420);
  },
  { once: true }
);

window.addEventListener("pageshow", (event) => {
  document.body.classList.remove("page-exit");

  if (event.persisted) {
    hasStartedPageEnter = false;
    document.body.classList.remove("page-enter");
  }

  showInitialContent();
});

window.setTimeout(showInitialContent, 1500);
window.setTimeout(showViewportRevealItems, 700);

if (!prefersReducedMotion.matches && "IntersectionObserver" in window && revealItems.length) {
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
} else {
  document.body.classList.remove("reveal-ready");
  showRevealItems();
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isActive);
        });
      });
    },
    {
      threshold: 0.45,
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

const isInternalPageLink = (link, event) => {
  if (prefersReducedMotion.matches || event.defaultPrevented) return false;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.target && link.target.toLowerCase() !== "_self") return false;
  if (link.hasAttribute("download")) return false;

  const rawHref = link.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#")) return false;
  if (/^(mailto:|tel:|sms:|javascript:)/i.test(rawHref)) return false;

  let url;
  try {
    url = new URL(rawHref, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;

  const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search;
  if (isSamePage && url.hash) return false;

  const fileName = url.pathname.split("/").pop();
  return fileName === "" || fileName.endsWith(".html");
};

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!isInternalPageLink(link, event)) return;
    if (document.body.classList.contains("page-exit")) return;

    event.preventDefault();
    document.body.classList.add("page-exit");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 620);
  });
});

document.querySelectorAll(".btn, .nav a, .nav-cta, .contact-links a, .project-nav-link, .footer a").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - rect.left - size / 2}px`;
    ripple.style.top = `${y - rect.top - size / 2}px`;

    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 760);
  });
});

let parallaxFrame = null;

const updateParallax = () => {
  if (isMobileViewport || prefersReducedMotion.matches) {
    parallaxItems.forEach((item) => item.style.setProperty("--parallax-y", "0px"));
    parallaxFrame = null;
    return;
  }

  const viewportCenter = window.innerHeight / 2;

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

    const speed = Number.parseFloat(item.dataset.parallax) || 0;
    const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
    const movement = Math.max(-22, Math.min(22, distanceFromCenter * speed));
    item.style.setProperty("--parallax-y", `${movement.toFixed(2)}px`);
  });

  parallaxFrame = null;
};

const requestParallaxUpdate = () => {
  if (!parallaxItems.length || parallaxFrame !== null) return;
  parallaxFrame = window.requestAnimationFrame(updateParallax);
};

if (parallaxItems.length) {
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  window.addEventListener("load", requestParallaxUpdate, { once: true });
  requestParallaxUpdate();
}

const cursor = document.querySelector(".cursor-dot");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursor && canHover) {
  window.addEventListener("pointermove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.style.opacity = "1";
  });

  document.querySelectorAll("a, button, .project-card, .gallery img").forEach((target) => {
    target.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
    target.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });
}

const header = document.querySelector(".site-header");

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("has-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();
