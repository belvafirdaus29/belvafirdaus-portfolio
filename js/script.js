document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
  }, 450);
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
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
  revealItems.forEach((item) => item.classList.add("is-visible"));
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

document.querySelectorAll(".btn, .nav-cta, .contact-links a, .project-nav-link").forEach((button) => {
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
