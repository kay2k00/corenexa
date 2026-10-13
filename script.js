(() => {
  "use strict";

  const motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const mobileNavQuery = window.matchMedia("(max-width: 980px)");

  const prefersReducedMotion = () => motionQuery.matches;

  document.documentElement.classList.add("js-enabled");

  const safeDecode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
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
        toggle.setAttribute(
          "aria-label",
          isOpen ? "Close navigation menu" : "Open navigation menu"
        );

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
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
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
        if (
          !document.body.classList.contains("nav-open") ||
          navbar.contains(event.target)
        ) {
          return;
        }

        closeMenu();
      });

      if (typeof mobileNavQuery.addEventListener === "function") {
        mobileNavQuery.addEventListener("change", closeMenu);
      } else {
        mobileNavQuery.addListener(closeMenu);
      }
    }

    if (links) {
      links.querySelectorAll("a[href]").forEach((link) => {
        link.removeAttribute("aria-current");

        if (
          getPageName(link.getAttribute("href") || "index.html") ===
          pageName
        ) {
          link.setAttribute("aria-current", "page");
        }
      });
    }

    if (document.body.classList.contains("contact-page") && cta) {
      cta.addEventListener("click", (event) => {
        const formContainer = document.querySelector(
          ".contact-form-container"
        );

        if (!formContainer) return;

        event.preventDefault();

        formContainer.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start"
        });

        formContainer.querySelector(
          "input:not([type='hidden']), textarea, select"
        )?.focus({ preventScroll: true });
      });
    }
  });

  const header = document.querySelector(".site-header");

  if (header) {
    let ticking = false;

    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    };

    updateHeader();

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  }


  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", () => {
      /* Intentionally preserve the original mailto destination. */
    });
  });


  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    const href = link.getAttribute("href") || "";
    let phone = href.replace(/^tel:/i, "").replace(/[^\d+]/g, "");

    if (phone.startsWith("+270")) {
      phone = "+27" + phone.slice(4);
    }

    link.href = `tel:${phone}`;
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });


  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.getElementById(
        safeDecode(targetId.slice(1))
      );

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start"
      });
    });
  });


  document
    .querySelectorAll(".button, .landing-button, .nav-cta")
    .forEach((button) => {
      button.addEventListener("pointerdown", (event) => {
        if (prefersReducedMotion() || event.button > 0) return;

        const rect = button.getBoundingClientRect();

        button.style.setProperty(
          "--ripple-x",
          `${event.clientX - rect.left}px`
        );

        button.style.setProperty(
          "--ripple-y",
          `${event.clientY - rect.top}px`
        );

        button.classList.remove("is-pressing");

        requestAnimationFrame(() => {
          button.classList.add("is-pressing");
        });
      });

      button.addEventListener("animationend", () => {
        button.classList.remove("is-pressing");
      });
    });


  const interactiveSurfaces = document.querySelectorAll(
    [
      ".card",
      ".diagnostic-card",
      ".sap-challenge-card",
      ".service-card",
      ".service-detail-card",
      ".about-feature-card",
      ".about-step-card",
      ".about-expertise-card",
      ".about-value-card",
      ".services-flow-step",
      ".sap-model-step",
      ".home-industry-item",
      ".outcome-metric",
      ".info-item"
    ].join(", ")
  );

  if (
    !prefersReducedMotion() &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    interactiveSurfaces.forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const rect = surface.getBoundingClientRect();

        surface.style.setProperty(
          "--mouse-x",
          `${event.clientX - rect.left}px`
        );

        surface.style.setProperty(
          "--mouse-y",
          `${event.clientY - rect.top}px`
        );

        surface.classList.add("is-lit");
      });

      surface.addEventListener("pointerleave", () => {
        surface.classList.remove("is-lit");
      });
    });
  }


  const revealItems = document.querySelectorAll(
    [
      ".landing-content",
      ".financial-hero-visual",
      ".services-hero-copy",
      ".sap-partner-hero-copy",
      ".about-hero-copy",
      ".contact-hero-content",
      ".hero",
      ".diagnostic",
      ".expectations",
      ".partner",
      ".expertise",
      ".cta",
      ".location-card",
      ".card",
      ".metric",
      ".outcome-metric",
      ".service-card",
      ".service-detail-card",
      ".services-diagnosis-section",
      ".services-start-section",
      ".services-audience-section",
      ".services-partner-section",
      ".services-flow-step",
      ".sap-challenge-card",
      ".sap-fit-panel",
      ".sap-commercial-panel",
      ".sap-model-step",
      ".contact-info",
      ".contact-form-container",
      ".contact-section",
      ".location-section",
      ".home-industry-diagram",
      ".home-outcomes-section",
      ".about-approach-section",
      ".about-statement-section",
      ".about-intro-section",
      ".about-difference-section",
      ".about-value-section",
      ".about-engage-section",
      ".about-audience-section",
      ".about-collaboration-section",
      ".about-expertise-section",
      ".about-feature-card",
      ".about-expertise-card",
      ".about-industry-diagram",
      ".investment-section"
    ].join(", ")
  );

  if (prefersReducedMotion()) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  } else {
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-on-scroll");
      item.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 6, 5) * 55}ms`
      );
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -6% 0px"
        }
      );

      revealItems.forEach((item) => {
        revealObserver.observe(item);
      });
    } else {
      revealItems.forEach((item) => {
        item.classList.add("is-visible");
      });
    }
  }

  const handleMotionPreferenceChange = () => {
    if (!prefersReducedMotion()) return;

    document.querySelectorAll(".reveal-on-scroll").forEach((item) => {
      item.classList.add("is-visible");
    });
  };

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", handleMotionPreferenceChange);
  } else {
    motionQuery.addListener(handleMotionPreferenceChange);
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

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 4200);
  };

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    const formStatus = contactForm.querySelector(".form-status");
    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    const originalSubmitText =
      submitButton?.textContent?.trim() || "Send Message";

    const formEndpoint = contactForm.action.replace(
      /^https:\/\/formsubmit\.co\/(?!ajax\/)/i,
      "https://formsubmit.co/ajax/"
    );

    const updateStatus = (message, type = "pending") => {
      if (!formStatus) return;

      formStatus.textContent = message;
      formStatus.classList.toggle("is-visible", Boolean(message));
      formStatus.classList.toggle(
        "form-status-success",
        type === "success"
      );
      formStatus.classList.toggle(
        "form-status-error",
        type === "error"
      );

      formStatus.setAttribute(
        "role",
        type === "error" ? "alert" : "status"
      );
    };

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        submitButton.textContent = "Sending…";
      }

      updateStatus("Sending your message…", "pending");

      try {
        const response = await fetch(formEndpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json"
          }
        });

        let result;

        try {
          result = await response.json();
        } catch {
          result = null;
        }

        const responseMessage =
          `${result?.success ?? ""} ${result?.message ?? ""}`.toLowerCase();

        const explicitlyFailed =
          result?.success === false ||
          result?.success === "false" ||
          /\b(error|failed|invalid|not sent)\b/.test(responseMessage);

        if (!response.ok || !result || explicitlyFailed) {
          throw new Error(
            result?.message || `Submission failed (${response.status})`
          );
        }

        contactForm.reset();

        contactForm
          .querySelectorAll("input, textarea, select")
          .forEach((field) => {
            field.classList.remove("has-value");
          });

        updateStatus(
          "Thank you for your message. Your request has been submitted. We’ll be in touch soon.",
          "success"
        );

        showToast("Your message has been submitted.");
      } catch (error) {
        console.error("Contact form submission failed:", error);

        updateStatus(
          "Sorry, we couldn’t send your message. Please try again or email info@corenexa.co.za.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
          submitButton.textContent = originalSubmitText;
        }
      }
    });
  }

  document
    .querySelectorAll(
      ".contact-form input, .contact-form textarea, .contact-form select"
    )
    .forEach((field) => {
      const updateValueState = () => {
        field.classList.toggle("has-value", Boolean(field.value));
      };

      updateValueState();

      field.addEventListener("input", updateValueState);
      field.addEventListener("change", updateValueState);
      field.addEventListener("blur", updateValueState);
    });

  document.querySelectorAll(".contact-form .form-group").forEach((group) => {
    const field = group.querySelector("input, select, textarea");

    if (!field) return;

    field.addEventListener("focus", () => {
      group.classList.add("is-focused");
    });

    field.addEventListener("blur", () => {
      group.classList.remove("is-focused");
    });
  });

})();