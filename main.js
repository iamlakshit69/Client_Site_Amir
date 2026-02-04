document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1. NAVBAR — SOFT STATE CHANGE (NOT FLASHY)
     ===================================================== */
  const navbar = document.querySelector(".navbar");

  const updateNavState = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });


  /* =====================================================
     2. INTENT-BASED CARD FEEDBACK
     (Feels cozy, not animated-for-attention)
     ===================================================== */
  const interactiveCards = document.querySelectorAll(
    ".problem-card, .plan-card, .success-card, .guide-visual, .hero-visual"
  );

  interactiveCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-4px)";
      card.style.transition = "transform 0.25s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });

    // Keyboard accessibility
    card.addEventListener("focus", () => {
      card.style.transform = "translateY(-4px)";
    });

    card.addEventListener("blur", () => {
      card.style.transform = "translateY(0)";
    });
  });


  /* =====================================================
     3. FAQ — EXCLUSIVE ACCORDION (CLEAN UX)
     ===================================================== */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.removeAttribute("open");
        });
      }
    });
  });


  /* =====================================================
     4. CTA EMPHASIS — USER INTENT BASED
     (When user hovers or tabs into CTA area)
     ===================================================== */
  const ctaBox = document.querySelector(".cta-box");
  const ctaButton = ctaBox?.querySelector(".btn-primary");

  if (ctaBox && ctaButton) {
    const emphasize = () => {
      ctaButton.style.transform = "translateY(-2px)";
      ctaButton.style.boxShadow = "0 10px 28px rgba(0,0,0,0.18)";
    };

    const reset = () => {
      ctaButton.style.transform = "translateY(0)";
      ctaButton.style.boxShadow = "none";
    };

    ctaBox.addEventListener("mouseenter", emphasize);
    ctaBox.addEventListener("mouseleave", reset);
    ctaBox.addEventListener("focusin", emphasize);
    ctaBox.addEventListener("focusout", reset);
  }


  /* =====================================================
     5. OPTIONAL: SECTION AWARENESS (NO ANIMATION)
     (Adds .active-section for future CSS polish)
     ===================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));

});