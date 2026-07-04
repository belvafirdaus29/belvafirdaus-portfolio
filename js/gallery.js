const galleryImages = Array.from(document.querySelectorAll(".gallery img"));
const galleryCursor = document.querySelector(".cursor-dot");
const galleryCanHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (galleryImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Project gallery preview");
  lightbox.innerHTML = `
    <button class="gallery-lightbox__button gallery-lightbox__button--close" type="button">Close</button>
    <button class="gallery-lightbox__button gallery-lightbox__button--prev" type="button" aria-label="Previous image">Prev</button>
    <figure>
      <img class="gallery-lightbox__image" alt="">
    </figure>
    <button class="gallery-lightbox__button gallery-lightbox__button--next" type="button" aria-label="Next image">Next</button>
  `;

  document.body.appendChild(lightbox);

  const image = lightbox.querySelector(".gallery-lightbox__image");
  const closeButton = lightbox.querySelector(".gallery-lightbox__button--close");
  const prevButton = lightbox.querySelector(".gallery-lightbox__button--prev");
  const nextButton = lightbox.querySelector(".gallery-lightbox__button--next");
  let activeIndex = 0;
  let lockedScrollY = 0;

  const lockPageScroll = () => {
    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.classList.add("has-lightbox", "lightbox-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };

  const restorePageScroll = () => {
    document.body.classList.remove("has-lightbox", "lightbox-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, lockedScrollY);
  };

  const showImage = (index) => {
    activeIndex = (index + galleryImages.length) % galleryImages.length;
    const selected = galleryImages[activeIndex];

    image.src = selected.currentSrc || selected.src;
    image.alt = selected.alt;
    image.removeAttribute("title");
  };

  const openLightbox = (index) => {
    showImage(index);
    lightbox.classList.add("is-open");
    lockPageScroll();
    closeButton.focus();
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains("is-open")) return;

    lightbox.classList.remove("is-open");
    restorePageScroll();
    galleryImages[activeIndex].focus();
  };

  galleryImages.forEach((item, index) => {
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Open image: ${item.alt}`);

    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    if (galleryCursor && galleryCanHover) {
      item.addEventListener("pointerenter", () => galleryCursor.classList.add("is-active"));
      item.addEventListener("pointerleave", () => galleryCursor.classList.remove("is-active"));
    }
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(activeIndex - 1);
    if (event.key === "ArrowRight") showImage(activeIndex + 1);
  });
}
