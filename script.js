document.documentElement.classList.add("js");

const menuToggle = document.querySelector("#menu-toggle");
const siteMenu = document.querySelector("#site-menu");
const currentYear = document.querySelector("#current-year");
const mobileMenuQuery = window.matchMedia("(max-width: 52rem)");

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
const heroHabitat = document.querySelector(".hero-habitat");
const depthPlanes = heroHabitat ? [...heroHabitat.querySelectorAll("[data-depth]")] : [];
const entrancePlane = heroHabitat?.querySelector("[data-entrance]");
let heroIsVisible = true;
let pointerFrame = 0;
let latestPointer = null;

const clearDepthOffsets = () => {
  if (pointerFrame) {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
  }
  latestPointer = null;
  document.documentElement.classList.remove("is-depth-active");
  depthPlanes.forEach((plane) => {
    plane.style.removeProperty("--depth-x");
    plane.style.removeProperty("--depth-y");
  });
};

const paintDepth = () => {
  pointerFrame = 0;
  if (!latestPointer || !heroIsVisible || document.hidden || reducedMotionQuery.matches) return;

  depthPlanes.forEach((plane) => {
    if (plane.classList.contains("canopy-middle")) return;
    const depth = Math.max(-2, Math.min(4, Number(plane.dataset.depth) || 0));
    plane.style.setProperty("--depth-x", `${(latestPointer.x * depth).toFixed(2)}px`);
    plane.style.setProperty("--depth-y", `${(latestPointer.y * depth).toFixed(2)}px`);
  });
  document.documentElement.classList.add("is-depth-active");
};

const queueDepth = (event) => {
  latestPointer = {
    x: Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2)),
    y: Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2)),
  };
  if (!pointerFrame) pointerFrame = requestAnimationFrame(paintDepth);
};

const configureDepth = () => {
  if (!heroHabitat) return;
  heroHabitat.removeEventListener("pointermove", queueDepth);
  heroHabitat.removeEventListener("pointerleave", clearDepthOffsets);
  clearDepthOffsets();

  if (finePointerQuery.matches && !reducedMotionQuery.matches && heroIsVisible && !document.hidden) {
    heroHabitat.addEventListener("pointermove", queueDepth, { passive: true });
    heroHabitat.addEventListener("pointerleave", clearDepthOffsets);
  }
};

if (heroHabitat && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    heroIsVisible = entry.isIntersecting;
    configureDepth();
  });
  observer.observe(heroHabitat);
}

document.addEventListener("visibilitychange", configureDepth);
finePointerQuery.addEventListener("change", configureDepth);
reducedMotionQuery.addEventListener("change", configureDepth);
configureDepth();

if (reducedMotionQuery.matches) {
  document.documentElement.classList.add("is-ready", "entrance-complete");
} else {
  entrancePlane?.addEventListener("transitionend", () => {
    document.documentElement.classList.add("entrance-complete");
  }, { once: true });
  window.setTimeout(() => document.documentElement.classList.add("entrance-complete"), 800);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));
  });
}
