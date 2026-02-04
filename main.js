document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. CAPABILITIES & USER PREFERENCES
     ===================================================== */
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;

  const isMobile =
    window.matchMedia("(max-width: 768px)").matches && isTouch;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =====================================================
     2. DESKTOP NAVBAR — TOP / SCROLLED STATE
     (UNCHANGED BEHAVIOR)
     ===================================================== */
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  let desktopState = "top";
  let ticking = false;

  const getScrollThreshold = () =>
    Math.round(window.innerHeight * 0.06);

  let scrollThreshold = getScrollThreshold();

  function updateDesktopNavbar(scrollY) {
    const nextState = scrollY > scrollThreshold ? "scrolled" : "top";
    if (nextState !== desktopState) {
      navbar.classList.toggle("scrolled", nextState === "scrolled");
      desktopState = nextState;
    }
  }

  function onDesktopScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateDesktopNavbar(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onDesktopScroll, { passive: true });
  window.addEventListener("resize", () => {
    scrollThreshold = getScrollThreshold();
    updateDesktopNavbar(window.scrollY);
  });

  updateDesktopNavbar(window.scrollY);

  /* =====================================================
     3. MOBILE NAVBAR — SAFARI-STYLE HIDE / SHOW (FIXED)
     ===================================================== */
  if (isMobile && !prefersReducedMotion) {

    let lastScrollY = window.scrollY;
    let accumulated = 0;
    let lastDirection = null;
    let navVisibility = "visible";

    const HIDE_THRESHOLD = 32; // downward intent
    const SHOW_THRESHOLD = 5;  // upward intent
    const TOP_LOCK = 80;       // always visible near top
    const NOISE = 1;           // ignore micro scroll

    function setNavVisibility(state) {
      if (navVisibility === state) return;
      navbar.dataset.navVisibility = state;
      navVisibility = state;
    }

    // Ensure visible on load
    setNavVisibility("visible");

    window.addEventListener("scroll", () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      /* Always visible near top */
      if (currentY < TOP_LOCK) {
        accumulated = 0;
        lastDirection = null;
        setNavVisibility("visible");
        return;
      }

      /* Ignore tiny movements */
      if (Math.abs(delta) < NOISE) return;

      const direction = delta > 0 ? "down" : "up";

      /* Reset intent when direction changes */
      if (direction !== lastDirection) {
        accumulated = 0;
        lastDirection = direction;
      }

      accumulated += delta;

      /* Scroll down → hide */
      if (direction === "down" && accumulated > HIDE_THRESHOLD) {
        setNavVisibility("hidden");
        accumulated = 0;
      }

      /* Scroll up → show */
      if (direction === "up" && accumulated < -SHOW_THRESHOLD) {
        setNavVisibility("visible");
        accumulated = 0;
      }

    }, { passive: true });

    /* Accessibility: reveal navbar on focus */
    navbar.addEventListener("focusin", () => {
      setNavVisibility("visible");
    });
  }

  /* =====================================================
     4. INTERACTION FEEDBACK (DESKTOP ONLY)
     ===================================================== */
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
     6. NAV SECTION AWARENESS
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

  /* =====================================================
     7. REDUCED MOTION — HARD STOP
     ===================================================== */
  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }

});
