/* ═══════════════════════════════════════════════
   main.js — Portfolio Editorial Interactions & Navigation
   ═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initSmoothScroll();
  initPreloader();
  initNavigation();
  initStickyFeatures();
  initSliders();
  initOrbitCardStack();
  initCopyLinks();
  initFlippingWordSwap();
  initPageTransition();
  initContactForm();
});

/* ── 0. Lightweight Internationalization (i18n) ── */
function initI18n() {
  if (typeof I18N === "undefined") return;

  const getSavedLang = () => {
    try {
      const saved = localStorage.getItem("bms_lang");
      if (saved && (saved === "en" || saved === "fr")) return saved;
      return navigator.language && navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
    } catch (e) {
      return "en";
    }
  };

  const getNested = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const applyTranslations = (lang) => {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;

    // Text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = getNested(dict, key);
      if (text !== undefined) {
        el.textContent = text;
      }
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = getNested(dict, key);
      if (text !== undefined) {
        el.setAttribute("placeholder", text);
      }
    });

    // Aria labels
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const text = getNested(dict, key);
      if (text !== undefined) {
        el.setAttribute("aria-label", text);
      }
    });

    // Toggle button UI
    const toggleBtn = document.getElementById("lang-toggle");
    const toggleText = document.getElementById("lang-toggle-text");
    if (toggleBtn) {
      const nextLang = lang === "fr" ? "en" : "fr";
      toggleBtn.setAttribute(
        "aria-label",
        lang === "fr" ? "Switch language to English" : "Passer en Français"
      );
      if (toggleText) {
        toggleText.textContent = nextLang.toUpperCase();
      }
    }

    // Dispatch event for other modules
    window.dispatchEvent(new CustomEvent("bms:langchange", { detail: { lang } }));
  };

  const setLanguage = (lang) => {
    const validLang = lang === "fr" ? "fr" : "en";
    try {
      localStorage.setItem("bms_lang", validLang);
    } catch (e) { }
    applyTranslations(validLang);
  };

  // Bind toggle button click
  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.lang || "en";
      const next = current === "fr" ? "en" : "fr";
      setLanguage(next);
    });
  }

  // Initial application
  const initialLang = getSavedLang();
  applyTranslations(initialLang);

  // Expose helper globally
  window.bmsSetLanguage = setLanguage;
  window.bmsGetLanguage = () => document.documentElement.lang || "en";
}

/* ── 1. Snappy Native Smooth Scroll & Progress ── */
function initSmoothScroll() {
  const progressBar = document.getElementById("scroll-progress");
  const scrollTopBtn = document.getElementById("scroll-top");

  // Track scroll position for progress bar and back-to-top button
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    if (scrollTopBtn) {
      if (scrollTop > 350) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Back to top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Smooth anchor scrolling with sticky header offset compensation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 145;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, hash);
        }
      }
    });
  });
}

/* ── 2. Preloader Lifecycle (First Visit Per Session Only) ── */
function initPreloader() {
  const pl = document.getElementById("preloader");
  if (!pl) {
    document.documentElement.classList.remove("loading");
    document.documentElement.classList.add("loading-done");
    return;
  }

  // Bypass preloader if user prefers reduced motion or has already seen it in this session
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasSeenPreloader = sessionStorage.getItem("bms_preloader_seen");

  if (hasSeenPreloader || prefersReducedMotion) {
    pl.remove();
    document.documentElement.classList.remove("loading");
    document.documentElement.classList.add("loading-done");
    return;
  }

  // Mark as seen for this browser session
  sessionStorage.setItem("bms_preloader_seen", "true");
  const dismissDelay = 1800;

  setTimeout(() => {
    pl.classList.add("done");
    document.documentElement.classList.remove("loading");
    document.documentElement.classList.add("loading-done");

    setTimeout(() => {
      pl.remove();
    }, 500);
  }, dismissDelay);
}

/* ── 3. Top Navigation & Mobile Menu ── */
function initNavigation() {
  const nav = document.getElementById("nav-bar") || document.getElementById("main-nav");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu hamburger toggle
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.classList.remove("nav-open");
      });
    });
  }
}

/* ── 4. Sticky Section Feature Bar ── */
function initStickyFeatures() {
  const stickyBar = document.getElementById("sticky-bar");
  const headings = document.querySelectorAll(".homeFeatures__stickyHeading");
  const snippets = document.querySelectorAll(".homeFeatures__stickySnippet");
  const links = document.querySelectorAll(".homeFeatures__stickyLink");

  if (!stickyBar || !headings.length) return;

  function setActiveSection(targetId) {
    headings.forEach((h) => {
      h.classList.toggle("active", h.getAttribute("data-target") === targetId);
    });
    snippets.forEach((s) => {
      s.classList.toggle("active", s.getAttribute("data-snippet") === targetId);
    });
    links.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("data-link") === targetId);
    });

    // Synchronize top navbar active link state
    document.querySelectorAll(".rf-links a[href^='#']").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${targetId}`);
    });
  }

  // Click tab to scroll smoothly to section
  headings.forEach((heading) => {
    heading.addEventListener("click", () => {
      const targetId = heading.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const headerOffset = 145;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        setActiveSection(targetId);
      }
    });
  });

  // Scroll spy for sticky sections
  const sections = [
    document.getElementById("home-projects"),
    document.getElementById("home-skills"),
    document.getElementById("home-about"),
  ].filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0.1,
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ── 5. Horizontal Sliders (Drag & Button Nav) ── */
function initSliders() {
  const galleryInner = document.getElementById("gallery-slider-inner");
  const btnPrev = document.getElementById("gallery-prev");
  const btnNext = document.getElementById("gallery-next");

  if (galleryInner) {
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        galleryInner.scrollBy({ left: -420, behavior: "smooth" });
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        galleryInner.scrollBy({ left: 420, behavior: "smooth" });
      });
    }

    // Enable mouse drag on slider
    enableDragScroll(galleryInner);
  }

  function enableDragScroll(slider) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.style.cursor = "grabbing";
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.style.cursor = "grab";
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.style.cursor = "grab";
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.6;
      slider.scrollLeft = scrollLeft - walk;
    });
  }
}

/* ── Helpers for Dynamic Components ── */
function hexToRgba(hex, alpha = 0.4) {
  if (!hex || !hex.startsWith("#")) return `rgba(103, 86, 189, ${alpha})`;
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ── 6. Orbit Card Stack Controller (Dynamic from data/projects.js) ── */
function initOrbitCardStack() {
  const stack = document.getElementById("orbit-stack");
  if (!stack) return;

  // Render cards & dots dynamically from PROJECTS array if available
  if (typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS) && PROJECTS.length > 0) {
    // Sort so featured projects appear first
    const displayProjects = [...PROJECTS].sort(
      (a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0)
    );

    stack.innerHTML = displayProjects.map((p, index) => {
      const avatar =
        p.avatar ||
        p.title
          .replace(/[^A-Za-z0-9 ]/g, "")
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
      const statCategory =
        p.statCategory ||
        (p.category === "interactive"
          ? "Interactive"
          : "Web");
      const miniDesc = p.miniDesc || p.description;
      const tag =
        p.cardTag ||
        (p.tags && p.tags.length ? p.tags.slice(0, 2).join(" · ") : "Featured");
      const accent = p.accent || "#6756bd";
      const glow = hexToRgba(accent, 0.4);
      const year = p.date ? p.date.slice(0, 4) : "2026";
      const roleText = `${p.subtitle || p.category} · ${year}`;
      const detailUrl = `projects/${p.id}/index.html`;
      const isActive = index === 0;

      return `
        <div class="orbit-card${isActive ? " active" : ""}" data-index="${index}" data-diff="${index}" data-name="${escapeHtml(p.title)}"
          data-role="${escapeHtml(roleText)}"
          data-desc="${escapeHtml(p.description)}"
          data-url="${escapeHtml(p.liveUrl)}"
          data-detail="${detailUrl}" data-accent="${accent}"
          tabindex="0"
          role="group"
          aria-roledescription="slide"
          aria-label="${escapeHtml(p.title)} (${index + 1} of ${displayProjects.length})"
          style="--card-accent: ${accent}; --card-accent-glow: ${glow};">
          <div class="orbit-card__inner">
            <div class="orbit-card__top">
              <div class="orbit-card__avatar">${escapeHtml(avatar)}</div>
              <div class="orbit-card__stat">
                <span class="dot"></span>
                <span>${escapeHtml(statCategory)}</span>
              </div>
            </div>
            <div class="orbit-card__image">
              <picture>
                <source srcset="${escapeHtml(encodeURI(p.thumbnail || p.hero))}" type="image/webp" />
                <img src="${escapeHtml(encodeURI(p.thumbnail || p.hero))}" alt="${escapeHtml(p.title)}" width="1340" height="900" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="orbit-card__body">
              <h3 class="orbit-card__name">${escapeHtml(p.title)}</h3>
              <p class="orbit-card__role">${escapeHtml(p.subtitle || p.category)}</p>
              <p class="orbit-card__desc-mini">${escapeHtml(miniDesc)}</p>
            </div>
            <div class="orbit-card__bottom">
              <span class="orbit-card__tag">${escapeHtml(tag)}</span>
              <span class="orbit-card__arrow">↗</span>
            </div>
          </div>
        </div>
      `.trim();
    }).join("\n");

    const dotsContainer = document.getElementById("orbit-dots");
    if (dotsContainer) {
      dotsContainer.innerHTML = displayProjects.map((p, index) => {
        const isActive = index === 0;
        return `<button class="orbit-dot${isActive ? " active" : ""}" data-index="${index}" aria-label="Go to project ${index + 1}: ${escapeHtml(p.title)}"></button>`;
      }).join("\n");
    }
  }

  const cards = Array.from(stack.querySelectorAll(".orbit-card"));
  const titleEl = document.getElementById("orbit-title");
  const roleEl = document.getElementById("orbit-role");
  const descEl = document.getElementById("orbit-desc");
  const linkEl = document.getElementById("orbit-link");
  const detailEl = document.getElementById("orbit-detail-link");
  const stageWrapper = stack.closest(".orbit-stage-wrapper") || stack;
  const btnPrev = document.getElementById("orbit-prev");
  const btnNext = document.getElementById("orbit-next");
  const dots = Array.from(document.querySelectorAll(".orbit-dot"));

  if (!cards.length) return;

  let activeIndex = cards.findIndex((c) => c.classList.contains("active"));
  if (activeIndex === -1) activeIndex = 0;
  let currentlyDisplayedIndex = -1;

  function updateViewingHeader(card) {
    if (!card) return;
    const name = card.getAttribute("data-name") || "";
    const role = card.getAttribute("data-role") || "";
    const desc = card.getAttribute("data-desc") || "";
    const url = card.getAttribute("data-url") || "#";
    const detailUrl = card.getAttribute("data-detail") || "#";

    if (linkEl) linkEl.setAttribute("href", url);
    if (detailEl) detailEl.setAttribute("href", detailUrl);

    if (titleEl) {
      titleEl.style.opacity = "0";
      titleEl.style.transform = "translateY(5px)";
    }
    if (roleEl) roleEl.style.opacity = "0";
    if (descEl) descEl.style.opacity = "0";

    setTimeout(() => {
      if (titleEl) {
        titleEl.textContent = name;
        titleEl.style.opacity = "1";
        titleEl.style.transform = "translateY(0)";
      }
      if (roleEl) {
        roleEl.textContent = role;
        roleEl.style.opacity = "1";
      }
      if (descEl) {
        descEl.textContent = desc;
        descEl.style.opacity = "1";
      }
    }, 120);
  }

  function setActiveCard(index, lift = false) {
    const isDifferent = currentlyDisplayedIndex !== index;
    activeIndex = (index + cards.length) % cards.length;
    currentlyDisplayedIndex = activeIndex;

    const n = cards.length;
    cards.forEach((card, i) => {
      let diff = (i - activeIndex) % n;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;

      card.style.setProperty("--diff", diff);
      card.setAttribute("data-diff", String(diff));

      const isTarget = diff === 0;
      card.classList.toggle("active", isTarget);
      card.classList.toggle("is-lifted", isTarget && lift);
      card.setAttribute("aria-hidden", isTarget ? "false" : "true");
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeIndex);
    });

    if (isDifferent && cards[activeIndex]) {
      updateViewingHeader(cards[activeIndex]);
    }
  }

  // Card events (hover & click)
  cards.forEach((card, index) => {
    const onCardHover = () => {
      if (window.innerWidth > 768) {
        stageWrapper.classList.add("is-fanned");
        setActiveCard(index, true);
      }
    };

    card.addEventListener("mouseenter", onCardHover);
    card.addEventListener("focus", onCardHover);

    card.addEventListener("click", (e) => {
      const diff = parseInt(card.getAttribute("data-diff"), 10);
      const url = card.getAttribute("data-url");
      const isArrow = e.target.closest(".orbit-card__arrow") || e.target.closest(".orbit-card__bottom");

      // Clicking peeking card on mobile navigates to it
      if (diff !== 0) {
        e.preventDefault();
        setActiveCard(index, true);
        return;
      }

      if (isArrow) {
        if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      if (window.innerWidth <= 768) {
        if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
      } else {
        if (
          activeIndex === index &&
          stageWrapper.classList.contains("is-fanned") &&
          card.classList.contains("is-lifted")
        ) {
          if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
        } else {
          stageWrapper.classList.add("is-fanned");
          setActiveCard(index, true);
        }
      }
    });
  });

  // Stage wrapper hover on desktop
  stageWrapper.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) {
      stageWrapper.classList.add("is-fanned");
    }
  });

  stageWrapper.addEventListener("mouseleave", () => {
    if (window.innerWidth > 768) {
      stageWrapper.classList.remove("is-fanned");
      cards.forEach((card, i) => {
        card.classList.remove("is-lifted");
      });
    }
  });

  // Controls: Prev & Next buttons
  if (btnPrev) {
    btnPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.innerWidth > 768) stageWrapper.classList.add("is-fanned");
      setActiveCard(activeIndex - 1, true);
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.innerWidth > 768) stageWrapper.classList.add("is-fanned");
      setActiveCard(activeIndex + 1, true);
    });
  }

  // Dots navigation
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute("data-index"), 10);
      if (!isNaN(idx)) {
        if (window.innerWidth > 768) stageWrapper.classList.add("is-fanned");
        setActiveCard(idx, true);
      }
    });
  });

  // ── Touch Swipe Gestures for Mobile & Touch Devices ──
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDeltaX = 0;
  let isSwiping = false;

  stageWrapper.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchDeltaX = 0;
      isSwiping = false;
    },
    { passive: true }
  );

  stageWrapper.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches || !e.touches[0]) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      if (Math.abs(touchDeltaX) > Math.abs(deltaY) && Math.abs(touchDeltaX) > 10) {
        isSwiping = true;
      }
    },
    { passive: true }
  );

  stageWrapper.addEventListener("touchend", () => {
    if (isSwiping) {
      const threshold = 40;
      if (touchDeltaX < -threshold) {
        setActiveCard(activeIndex + 1, true);
      } else if (touchDeltaX > threshold) {
        setActiveCard(activeIndex - 1, true);
      }
    }
    isSwiping = false;
    touchDeltaX = 0;
  });

  // Keyboard Accessibility (Arrow keys & Enter/Space)
  stageWrapper.setAttribute("role", "region");
  stageWrapper.setAttribute("aria-roledescription", "carousel");
  stageWrapper.setAttribute("aria-label", "Featured Projects Carousel");

  stageWrapper.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      if (window.innerWidth > 768) stageWrapper.classList.add("is-fanned");
      setActiveCard(activeIndex - 1, true);
      if (cards[activeIndex]) cards[activeIndex].focus();
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      if (window.innerWidth > 768) stageWrapper.classList.add("is-fanned");
      setActiveCard(activeIndex + 1, true);
      if (cards[activeIndex]) cards[activeIndex].focus();
    } else if (e.key === "Enter" || e.key === " ") {
      if (document.activeElement && document.activeElement.classList.contains("orbit-card")) {
        e.preventDefault();
        const url = document.activeElement.getAttribute("data-url");
        if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  });

  stageWrapper.addEventListener("focusin", () => {
    if (window.innerWidth > 768) stageWrapper.classList.add("is-fanned");
  });

  stageWrapper.addEventListener("focusout", (e) => {
    if (window.innerWidth > 768 && !stageWrapper.contains(e.relatedTarget)) {
      stageWrapper.classList.remove("is-fanned");
      cards.forEach((card, i) => {
        card.classList.remove("is-lifted");
      });
    }
  });

  // Initial state setup
  setActiveCard(activeIndex, false);
}

/* ── 7. Copy-To-Clipboard Buttons ── */
function initCopyLinks() {
  const copyButtons = document.querySelectorAll("[data-copy-link]");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const linkToCopy = btn.getAttribute("data-copy-link") || window.location.href;
      const labelSpan = btn.querySelector(".linkLabel") || btn.querySelector(".button__inner");

      try {
        await navigator.clipboard.writeText(linkToCopy);
        const originalText = labelSpan ? labelSpan.textContent : "";

        if (labelSpan) {
          labelSpan.textContent = "copied!";
        }

        setTimeout(() => {
          if (labelSpan) {
            labelSpan.textContent = btn.getAttribute("data-original-text") || originalText;
          }
        }, 2200);
      } catch (err) {
        console.error("Clipboard copy failed", err);
      }
    });
  });
}

/* ── 8. Flipping Word Swap ── */
function initFlippingWordSwap() {
  const container = document.querySelector(".flip-words-wrapper");
  if (!container) return;

  const words = Array.from(container.querySelectorAll(".flip-word"));
  if (words.length <= 1) return;

  let currentIndex = 0;

  function updateWidth(idx) {
    const el = words[idx];
    if (el) {
      container.style.width = `${el.offsetWidth + 2}px`;
    }
  }

  updateWidth(0);
  window.addEventListener("resize", () => updateWidth(currentIndex));
  if (document.fonts) {
    document.fonts.ready.then(() => updateWidth(currentIndex));
  }

  // Disable interval transitions if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  setInterval(() => {
    const currentWord = words[currentIndex];
    const nextIndex = (currentIndex + 1) % words.length;
    const nextWord = words[nextIndex];

    currentWord.classList.remove("active");
    currentWord.classList.add("exit");

    nextWord.classList.remove("exit");
    nextWord.classList.add("active");

    currentIndex = nextIndex;
    updateWidth(currentIndex);

    setTimeout(() => {
      currentWord.classList.remove("exit");
    }, 600);
  }, 2500);
}

/* ── 9. Page Transitions ── */
function initPageTransition() {
  const overlay = document.querySelector(".page-transition");
  if (!overlay) return;

  // If user prefers reduced motion, remove transition overlay completely
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    overlay.remove();
    return;
  }

  window.addEventListener("load", () => {
    overlay.classList.remove("active");
  });

  document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;

      e.preventDefault();
      overlay.classList.add("active");
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
}

/* ── 10. Contact Form Handler (Web3Forms + Fallback) ── */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successMsg = document.getElementById("contact-success");
  const errorMsg = document.getElementById("contact-error");
  const submitBtn = document.getElementById("contact-submit-btn") || form.querySelector('button[type="submit"]');
  const btnText = submitBtn ? submitBtn.querySelector(".btn__text") || submitBtn : null;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const botcheckInput = form.querySelector('input[name="botcheck"]');

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  // Clear validation errors on user input
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      const errEl = document.getElementById(`${input.id}-error`);
      if (errEl) errEl.classList.remove("visible");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset previous alerts
    if (successMsg) successMsg.style.display = "none";
    if (errorMsg) {
      errorMsg.style.display = "none";
      errorMsg.innerHTML = "";
    }

    // 1. Honeypot check (silently drop spam bots)
    if (botcheckInput && botcheckInput.checked) {
      console.warn("Honeypot triggered, submission ignored.");
      return;
    }

    // 2. Client-side field validation
    let isValid = true;
    const nameVal = (nameInput ? nameInput.value : "").trim();
    const emailVal = (emailInput ? emailInput.value : "").trim();
    const subjectVal = (subjectInput ? subjectInput.value : "").trim();
    const messageVal = (messageInput ? messageInput.value : "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameVal || nameVal.length < 2) {
      if (nameError) nameError.classList.add("visible");
      isValid = false;
    } else if (nameError) {
      nameError.classList.remove("visible");
    }

    if (!emailVal || !emailRegex.test(emailVal)) {
      if (emailError) emailError.classList.add("visible");
      isValid = false;
    } else if (emailError) {
      emailError.classList.remove("visible");
    }

    if (!messageVal || messageVal.length < 5) {
      if (messageError) messageError.classList.add("visible");
      isValid = false;
    } else if (messageError) {
      messageError.classList.remove("visible");
    }

    if (!isValid) return;

    // 3. Set loading state
    const originalBtnText = btnText ? btnText.textContent : "Send Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      if (btnText) btnText.textContent = "Sending...";
    }

    // 4. Submit via Web3Forms with placeholder access key
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value : "55812487-877a-4648-a266-64f19029d19f";

    const payload = {
      access_key: accessKey,
      name: nameVal,
      email: emailVal,
      subject: subjectVal || `Portfolio Contact from ${nameVal}`,
      message: messageVal,
      botcheck: botcheckInput && botcheckInput.checked ? "true" : "",
    };

    const recipientEmail = "mohamedaminebenmasseoud63@gmail.com";
    const mailtoSubject = encodeURIComponent(subjectVal ? `[Portfolio] ${subjectVal}` : `[Portfolio Contact] from ${nameVal}`);
    const mailtoBody = encodeURIComponent(`From: ${nameVal} (${emailVal})\n\nMessage:\n${messageVal}`);
    const mailtoUrl = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        if (successMsg) successMsg.style.display = "block";
        form.reset();
      } else {
        const errMsg = result.message || "Failed to deliver message via Web3Forms.";
        if (errorMsg) {
          errorMsg.innerHTML = `Could not send message (${errMsg}). <br/> Send directly via email instead: <a href="${mailtoUrl}" class="form-fallback-link">${recipientEmail}</a>`;
          errorMsg.style.display = "block";
        }
      }
    } catch (err) {
      if (errorMsg) {
        errorMsg.innerHTML = `Network error sending message. <br/> Send directly via email instead: <a href="${mailtoUrl}" class="form-fallback-link">${recipientEmail}</a>`;
        errorMsg.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        if (btnText) btnText.textContent = originalBtnText;
      }
    }
  });
}
