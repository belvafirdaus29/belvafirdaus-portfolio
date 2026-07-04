(() => {
  const email = "belvafirdaus29@gmail.com";
  const copyButtons = document.querySelectorAll("[data-copy-email]");

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  };

  const copyEmail = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
      return;
    }

    if (!fallbackCopy(email)) {
      throw new Error("Clipboard copy failed");
    }
  };

  copyButtons.forEach((button) => {
    const originalText = button.textContent.trim() || "Copy Email";
    button.dataset.copyOriginalText = originalText;

    button.addEventListener("click", async () => {
      const resetText = button.dataset.copyOriginalText || "Copy Email";

      try {
        await copyEmail();
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy failed";
      }

      window.setTimeout(() => {
        button.textContent = resetText;
      }, 1500);
    });
  });
})();
