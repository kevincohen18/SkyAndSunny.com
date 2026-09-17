document.documentElement.classList.add("js");

const menuToggle = document.querySelector("#menu-toggle");
const siteMenu = document.querySelector("#site-menu");
const currentYear = document.querySelector("#current-year");
const mobileMenuQuery = window.matchMedia("(max-width: 48rem)");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (menuToggle && siteMenu) {
  const closeMenu = ({ returnFocus = false } = {}) => {
    menuToggle.setAttribute("aria-expanded", "false");

    if (mobileMenuQuery.matches) {
      siteMenu.hidden = true;
    }

    if (returnFocus) {
      menuToggle.focus();
    }
  };

  const syncMenuForViewport = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteMenu.hidden = mobileMenuQuery.matches;
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteMenu.hidden = isOpen;
  });

  siteMenu.addEventListener("click", (event) => {
    if (event.target.closest("a") && mobileMenuQuery.matches) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ returnFocus: true });
    }
  });

  mobileMenuQuery.addEventListener("change", syncMenuForViewport);
  syncMenuForViewport();
}

const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const birds = [...document.querySelectorAll("[data-bird]")];

if (birds.length > 0) {
  const clearBirdOffsets = () => {
    birds.forEach((bird) => {
      bird.style.removeProperty("--bird-x");
      bird.style.removeProperty("--bird-y");
    });
  };

  const moveBirds = (event) => {
    if (!finePointerQuery.matches || reducedMotionQuery.matches) {
      clearBirdOffsets();
      return;
    }

    const horizontalPosition = (event.clientX / window.innerWidth - 0.5) * 2;
    const verticalPosition = (event.clientY / window.innerHeight - 0.5) * 2;
    const cappedX = Math.max(-1, Math.min(1, horizontalPosition));
    const cappedY = Math.max(-1, Math.min(1, verticalPosition));

    birds.forEach((bird) => {
      const depth = Number(bird.dataset.depth) || 0;
      bird.style.setProperty("--bird-x", `${(cappedX * depth).toFixed(2)}px`);
      bird.style.setProperty("--bird-y", `${(cappedY * depth).toFixed(2)}px`);
    });
  };

  window.addEventListener("pointermove", moveBirds, { passive: true });
  finePointerQuery.addEventListener("change", clearBirdOffsets);
  reducedMotionQuery.addEventListener("change", clearBirdOffsets);
}
