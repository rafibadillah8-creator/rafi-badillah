const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const homeNav = document.querySelector(".nav--home");
const menuToggle = homeNav?.querySelector(".menu-toggle");
const mobileMenu = homeNav?.querySelector(".nav-menu");

if (homeNav && menuToggle && mobileMenu) {
  const mobileBreakpoint = matchMedia("(max-width: 760px)");
  const closeMenu = (restoreFocus = false) => {
    homeNav.classList.remove("is-menu-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    if (restoreFocus) menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    if (!open) {
      closeMenu();
      return;
    }

    homeNav.classList.add("is-menu-open");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    setTimeout(() => {
      if (menuToggle.getAttribute("aria-expanded") === "true") {
        mobileMenu.querySelector("a")?.focus();
      }
    }, 50);
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
    else if (event.target === mobileMenu) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  mobileBreakpoint.addEventListener("change", (event) => {
    if (!event.matches) closeMenu();
  });
}

const transitionKey = "ferrari-page-transition";
const arrivingFromPage = sessionStorage.getItem(transitionKey) === "pending";
if (arrivingFromPage) sessionStorage.removeItem(transitionKey);

const transitionLayer = reduceMotion ? null : document.createElement("div");

if (transitionLayer) {
  transitionLayer.className = "page-transition";
  transitionLayer.setAttribute("aria-hidden", "true");
  const transitionLogo = document.createElement("img");
  transitionLogo.src = "assets/logo-kuda.png";
  transitionLogo.alt = "";
  transitionLayer.append(transitionLogo);
  document.body.append(transitionLayer);
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const finishPageIntro = () => {
  transitionLayer?.classList.add("is-done");
  document.body.classList.remove("lock");
  document.body.classList.add("ready");
};

if (reduceMotion) {
  finishPageIntro();
} else {
  let navigating = false;
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const destination = new URL(link.href, location.href);
    if (
      destination.origin !== location.origin ||
      destination.pathname === location.pathname
    ) {
      return;
    }

    event.preventDefault();
    if (navigating) return;
    navigating = true;
    sessionStorage.setItem(transitionKey, "pending");
    transitionLayer.classList.remove("is-done", "is-out");
    transitionLayer.classList.add("is-show");
    setTimeout(() => location.assign(destination.href), 600);
  });

  addEventListener("pageshow", (event) => {
    if (event.persisted) {
      transitionLayer.classList.add("is-done");
      document.body.classList.remove("lock");
      document.body.classList.add("ready");
    }
    navigating = false;
  });

  (async () => {
    if (arrivingFromPage) {
      transitionLayer.classList.add("is-show");
      await wait(450);
    } else {
      await wait(100);
      transitionLayer.classList.add("is-show");
      await wait(800);

      const video = document.querySelector("#scrub-video");
      if (video && video.readyState < 2) {
        await Promise.race([
          new Promise((resolve) => video.addEventListener("loadeddata", resolve, { once: true })),
          wait(600),
        ]);
      }
    }

    transitionLayer.classList.add("is-out");
    await wait(350);
    finishPageIntro();
  })();
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }),
    { threshold: 0.15 },
  );

  document.querySelectorAll(".rv").forEach((element, index) => {
    element.style.transitionDelay = `${(index % 3) * 90}ms`;
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".rv").forEach((element) => element.classList.add("in"));
}

if (!reduceMotion) {
  addEventListener(
    "scroll",
    () =>
      document.querySelectorAll("[data-parallax]").forEach((element) => {
        const bounds = element.parentElement.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > innerHeight) return;
        element.style.transform = `translateY(${-(bounds.top / innerHeight) * 40}px)`;
      }),
    { passive: true },
  );

  document.querySelectorAll(".mag").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * 0.25}px,${(event.clientY - bounds.top - bounds.height / 2) * 0.25}px)`;
    });
    button.addEventListener("pointerleave", () => (button.style.transform = ""));
  });
}
