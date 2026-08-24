const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileNavQuery = window.matchMedia("(max-width: 980px)");

document.documentElement.classList.add("js-enabled");

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
};

const getPageName = (value) => {
  const path = value.split("#")[0].split("?")[0] || "index.html";
  return safeDecode(path.split("/").pop() || "index.html");
};

const pageName = getPageName(window.location.pathname);

document.querySelectorAll(".navbar").forEach((navbar, index) => {
  const links = navbar.querySelector(".nav-links");
  const cta = navbar.querySelector(".nav-cta");

  if (links && !navbar.querySelector(".nav-toggle")) {
    const menuLinks = Array.from(links.querySelectorAll("a"));
    if (!links.id) {
      links.id = `main-navigation-links-${index + 1}`;
    }

    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", links.id);
    toggle.innerHTML = "<span></span><span></span><span></span>";
    navbar.insertBefore(toggle, links);

    const setMenuState = (isOpen) => {
      document.body.classList.toggle("nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

      menuLinks.forEach((link) => {
        if (mobileNavQuery.matches && !isOpen) {
          link.setAttribute("tabindex", "-1");
        } else {
          link.removeAttribute("tabindex");
        }
      });
    };

    const closeMenu = () => setMenuState(false);

    setMenuState(false);

    toggle.addEventListener("click", () => {
      setMenuState(toggle.getAttribute("aria-expanded") !== "true");
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("nav-open") || navbar.contains(event.target)) {
        return;
      }

      closeMenu();
    });

    if (typeof mobileNavQuery.addEventListener === "function") {
      mobileNavQuery.addEventListener("change", closeMenu);
    } else if (typeof mobileNavQuery.addListener === "function") {
      mobileNavQuery.addListener(closeMenu);
    }
  }

  links?.querySelectorAll("a[href]").forEach((link) => {
    link.removeAttribute("aria-current");
    const linkName = getPageName(link.getAttribute("href") || "index.html");
    if (linkName === pageName) {
      link.setAttribute("aria-current", "page");
    }
  });

  if (document.body.classList.contains("contact-page") && cta) {
    cta.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector(".contact-form-container")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      document.querySelector(".contact-form input, .contact-form textarea, .contact-form select")?.focus({ preventScroll: true });
    });
  }
});

const header = document.querySelector(".site-header");
if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.rel = "noopener noreferrer";
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.getElementById(safeDecode(targetId.slice(1)));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});

document.querySelectorAll(".button, .landing-button, .nav-cta").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    if (reduceMotion || event.button > 0) return;

    const rect = button.getBoundingClientRect();
    button.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
    button.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
    button.classList.remove("is-pressing");
    requestAnimationFrame(() => button.classList.add("is-pressing"));
  });

  button.addEventListener("animationend", () => {
    button.classList.remove("is-pressing");
  });
});

const interactiveSurfaces = document.querySelectorAll(
  ".card, .diagnostic-card, .sap-challenge-card, .service-card, .about-feature-card, .about-step-card, .about-expertise-card, .services-flow-step, .sap-model-step"
);

if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  interactiveSurfaces.forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      surface.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      surface.classList.add("is-lit");
    });

    surface.addEventListener("pointerleave", () => {
      surface.classList.remove("is-lit");
    });
  });
}

const revealItems = document.querySelectorAll(
  ".landing-content, .financial-hero-visual, .services-hero-copy, .sap-partner-hero-copy, .about-hero-copy, .contact-hero-content, .hero, .diagnostic, .expectations, .partner, .expertise, .cta, .location-card, .card, .metric, .service-card, .service-detail-card, .services-diagnosis-section, .services-start-section, .services-audience-section, .services-partner-section, .services-flow-step, .sap-challenge-card, .sap-fit-panel, .sap-commercial-panel, .sap-model-step, .contact-info, .contact-form-container, .about-approach-section, .about-statement-section, .about-intro-section, .about-difference-section, .about-value-section, .about-engage-section, .about-audience-section, .about-collaboration-section, .about-expertise-section, .about-feature-card, .about-step-card, .about-expertise-card, .investment-section"
);

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal-on-scroll");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

const toast = document.createElement("div");
toast.className = "site-toast";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");
document.body.appendChild(toast);

let toastTimer;
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4200);
};

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const formStatus = contactForm.querySelector(".form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalSubmitText = submitButton?.textContent?.trim() || "Send Message";

  const updateStatus = (message, type) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.toggle("is-visible", Boolean(message));
    formStatus.classList.toggle("form-status-success", type === "success");
    formStatus.classList.toggle("form-status-error", type === "error");
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    submitButton?.setAttribute("disabled", "true");
    if (submitButton) submitButton.textContent = "Sending...";
    updateStatus("Sending your message...", "pending");

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: { "Accept": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      contactForm.reset();
      updateStatus("Thank you for your message. We have received it and will be in touch soon.", "success");
      document.querySelectorAll(".contact-form input, .contact-form textarea, .contact-form select").forEach((field) => {
        field.classList.remove("has-value");
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      updateStatus("Sorry, we could not send your message. Please try again or email info@corenexa.co.za.", "error");
    } finally {
      if (submitButton) {
        submitButton.removeAttribute("disabled");
        submitButton.textContent = originalSubmitText;
      }
    }
  });
}

document.querySelectorAll(".contact-form input, .contact-form textarea, .contact-form select").forEach((field) => {
  field.classList.toggle("has-value", Boolean(field.value));

  field.addEventListener("blur", () => {
    field.classList.toggle("has-value", Boolean(field.value));
  });

  field.addEventListener("change", () => {
    field.classList.toggle("has-value", Boolean(field.value));
  });

  field.addEventListener("input", () => {
    field.classList.toggle("has-value", Boolean(field.value));
  });
});
