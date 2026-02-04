document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. CAPABILITIES & USER PREFERENCES
     ===================================================== */
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =====================================================
     2. NAVBAR — VIEWPORT-AWARE STATE MACHINE
     ===================================================== */
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  let currentState = "top";
  let ticking = false;

  // Scroll threshold scales with viewport height
  const getThreshold = () => Math.round(window.innerHeight * 0.06);
  let scrollThreshold = getThreshold();

  function updateNavbar(scrollY) {
    const nextState = scrollY > scrollThreshold ? "scrolled" : "top";
    if (nextState !== currentState) {
      navbar.dataset.state = nextState;
      navbar.classList.toggle("scrolled", nextState === "scrolled");
      currentState = nextState;
    }
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbar(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    scrollThreshold = getThreshold();
    updateNavbar(window.scrollY);
  });

  updateNavbar(window.scrollY);

  /* =====================================================
     3. INTERACTION FEEDBACK (DESKTOP ONLY)
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
     4. FAQ — EXCLUSIVE ACCORDION (CLEAN & ACCESSIBLE)
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
     5. NAV SECTION AWARENESS (LOW-COST ORIENTATION)
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
     6. REDUCED MOTION — HARD STOP
     ===================================================== */
  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }

});
