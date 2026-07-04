const revealItems = document.querySelectorAll(".reveal");
const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const hideLoader = () => {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
};

const showRevealItems = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

document.body.classList.add("is-loading");

if (!prefersReducedMotion.matches) {
  document.body.classList.add("page-transition-ready");
}

const showInitialContent = () => {
  hideLoader();

  if (isMobileViewport) {
    showRevealItems();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(showInitialContent, 120);
  }, { once: true });
} else {
  window.setTimeout(showInitialContent, 120);
}

window.addEventListener("load", () => {
  window.setTimeout(showInitialContent, 450);
}, { once: true });

window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-page-leaving");
  showInitialContent();
});

window.setTimeout(hideLoader, 1500);
window.setTimeout(showRevealItems, isMobileViewport ? 700 : 2400);

if (!isMobileViewport && "IntersectionObserver" in window && revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -70px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
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

  const url = new URL(rawHref, window.location.href);
  if (url.origin !== window.location.origin) return false;

  const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search;
  if (isSamePage && url.hash) return false;

  const fileName = url.pathname.split("/").pop();
  return fileName === "" || fileName.endsWith(".html");
};

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!isInternalPageLink(link, event)) return;
    if (document.body.classList.contains("is-page-leaving")) return;

    event.preventDefault();
    document.body.classList.add("is-page-leaving");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 480);
  });
});

document.querySelectorAll(".btn, .nav a, .nav-cta, .contact-links a, .project-nav-link").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 650);
  });
});

const cursor = document.querySelector(".cursor-dot");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursor && canHover) {
  window.addEventListener("pointermove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.style.opacity = "1";
  });

  document.querySelectorAll("a, button, .project-card").forEach((target) => {
    target.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
    target.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });
}

const header = document.querySelector(".site-header");

window.addEventListener(
  "scroll",
  () => {
    if (!header) return;
    header.classList.toggle("has-scrolled", window.scrollY > 24);
  },
  { passive: true }
);
