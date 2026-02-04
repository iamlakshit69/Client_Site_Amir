document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. ENVIRONMENT & PREFERENCES
     ===================================================== */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  /* =====================================================
     2. DESKTOP NAVBAR (UNCHANGED BEHAVIOR)
     ===================================================== */
  if (!isMobile) {
    let lastState = "top";

    const getThreshold = () =>
      Math.round(window.innerHeight * 0.06);

    let threshold = getThreshold();

    function updateDesktopNavbar() {
      const scrollTop =
        document.documentElement.scrollTop || window.pageYOffset;

      const nextState = scrollTop > threshold ? "scrolled" : "top";

      if (nextState !== lastState) {
        navbar.classList.toggle("scrolled", nextState === "scrolled");
        lastState = nextState;
      }
    }

    window.addEventListener("scroll", updateDesktopNavbar, { passive: true });
    window.addEventListener("resize", () => {
      threshold = getThreshold();
      updateDesktopNavbar();
    });

    updateDesktopNavbar();
    return;
  }

  /* =====================================================
     3. MOBILE SAFARI-STYLE NAVBAR (HIDE / SHOW)
     ===================================================== */
  if (prefersReducedMotion) return;

  let lastScroll =
    document.documentElement.scrollTop || window.pageYOffset;

  let accumulator = 0;
  let navState = "visible";

  /* ---- Tunable feel knobs ---- */
  const HIDE_THRESHOLD = 40; // scroll down intent
  const SHOW_THRESHOLD = 5; // scroll up intent
  const TOP_LOCK = 80;       // always visible near top
  const NOISE = 1;           // ignore micro jitter

  function setNavState(state) {
    if (navState === state) return;
    navbar.dataset.state = state;
    navState = state;
  }

  /* Ensure visible on load */
  setNavState("visible");

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll =
        document.documentElement.scrollTop || window.pageYOffset;

      const delta = currentScroll - lastScroll;
      lastScroll = currentScroll;

      /* Always visible near top */
      if (currentScroll < TOP_LOCK) {
        accumulator = 0;
        setNavState("visible");
        return;
      }

      /* Ignore tiny movement */
      if (Math.abs(delta) < NOISE) return;

      accumulator += delta;

      /* Scroll down → hide */
      if (accumulator > HIDE_THRESHOLD && navState === "visible") {
        setNavState("hidden");
        accumulator = 0;
      }

      /* Scroll up → show */
      if (accumulator < -SHOW_THRESHOLD && navState === "hidden") {
        setNavState("visible");
        accumulator = 0;
      }
    },
    { passive: true }
  );

  /* Accessibility: show navbar on focus */
  navbar.addEventListener("focusin", () => {
    setNavState("visible");
  });

  /* =====================================================
     4. INTERACTION FEEDBACK (DESKTOP ONLY)
     ===================================================== */
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;

  if (!isTouch && !prefersReducedMotion) {
    const liftables = document.querySelectorAll(
      ".problem-card, .plan-card, .visual-box"
    );

    liftables.forEach(el => {
      el.addEventListener("mouseenter", () => {
        el.classList.add("lift");
      });
      el.addEventListener("mouseleave", () => {
        el.classList.remove("lift");
      });
    });
  }

  /* =====================================================
     5. FAQ — EXCLUSIVE ACCORDION
     ===================================================== */
  const faqItems = document.querySelectorAll(".faq details");

  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach(other => {
        if (other !== item) other.removeAttribute("open");
      });
    });
  });

  /* =====================================================
     6. NAV SECTION AWARENESS (DESKTOP)
     ===================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window && navLinks.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        });
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));
  }

});
