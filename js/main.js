/* ═══════════════════════════════════════════════
   main.js — Portfolio Editorial Interactions & Navigation
   ═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initManifest();
  initI18n();
  initSmoothScroll();
  initScrollReveal();
  initPreloader();
  initNavigation();
  initStickyFeatures();
  initFlipStack();
  initCopyLinks();
  initFlippingWordSwap();
  initPageTransition();
  initContactForm();
  initHomepageForm();
});

/* ── Dynamic Manifest Injection for HTTP/HTTPS (Avoids file:// CORS error) ── */
function initManifest() {
  if (typeof window === "undefined" || !window.location) return;
  if (window.location.protocol.startsWith("http") && !document.querySelector('link[rel="manifest"]')) {
    const mainScript = document.querySelector('script[src*="main.js"]');
    const prefix = mainScript && mainScript.getAttribute("src") && mainScript.getAttribute("src").startsWith("../../") ? "../../" : "";
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = `${prefix}site.webmanifest`;
    document.head.appendChild(link);
  }
}

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

/* ── 1b. Scroll Reveal System ── */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  // Immediate visibility check for elements already in or near viewport on load
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight + 40 && rect.bottom > 0) {
      el.classList.add("visible");
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 80px 0px",
      }
    );

    revealElements.forEach((el) => {
      if (!el.classList.contains("visible")) {
        observer.observe(el);
      }
    });
  } else {
    // If IntersectionObserver is unavailable, immediately reveal all
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // Safety fallback: reveal any remaining hidden elements after 800ms
  setTimeout(() => {
    revealElements.forEach((el) => {
      if (!el.classList.contains("visible")) {
        el.classList.add("visible");
      }
    });
  }, 800);
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
  const mainNav = document.getElementById("main-nav");
  const navBar = document.getElementById("nav-bar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  let openScrollY = 0;

  const setMenuOpen = (open) => {
    if (navToggle && navLinks) {
      if (open) {
        openScrollY = window.scrollY;
      }
      navToggle.classList.toggle("open", open);
      navLinks.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    }
  };

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      if (mainNav) mainNav.classList.add("scrolled");
      if (navBar) navBar.classList.add("scrolled");
    } else {
      if (mainNav) mainNav.classList.remove("scrolled");
      if (navBar) navBar.classList.remove("scrolled");
    }

    // Auto-close mobile menu if scrolled by more than 15px while open
    if (navLinks && navLinks.classList.contains("open")) {
      if (Math.abs(scrollY - openScrollY) > 15) {
        setMenuOpen(false);
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu hamburger toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.contains("open");
      setMenuOpen(!isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navToggle.classList.contains("open")) {
        setMenuOpen(false);
      }
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

  let isScrollingFromClick = false;
  let scrollTimeout = null;

  // Click tab to scroll smoothly to section
  headings.forEach((heading) => {
    heading.addEventListener("click", () => {
      const targetId = heading.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navBar = document.getElementById("main-nav");
        const navHeight = navBar ? navBar.offsetHeight : 78;
        const barHeight = stickyBar.offsetHeight || 60;
        const headerOffset = navHeight + barHeight + 10;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        isScrollingFromClick = true;
        clearTimeout(scrollTimeout);
        setActiveSection(targetId);

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        scrollTimeout = setTimeout(() => {
          isScrollingFromClick = false;
          updateScrollSpy();
        }, 800);
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

  const updateScrollSpy = () => {
    if (isScrollingFromClick) return;
    const navBar = document.getElementById("main-nav");
    const navHeight = navBar ? navBar.offsetHeight : 78;
    const barHeight = stickyBar.offsetHeight || 60;
    const scrollPos = window.scrollY + navHeight + barHeight + 50;

    let currentSectionId = sections[0].id;
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (sec.offsetTop <= scrollPos) {
        currentSectionId = sec.id;
      }
    }
    setActiveSection(currentSectionId);
  };

  window.addEventListener("scroll", updateScrollSpy, { passive: true });
  updateScrollSpy();
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

/* ── 6. Case Study Flip Stack Controller (Componentry Scroll-Driven Stack) ── */
function initFlipStack() {
  const container = document.getElementById("flip-stack-container");
  const stage = document.getElementById("flip-stack-stage");
  const deck = document.getElementById("flip-deck");
  if (!container || !deck) return;

  // Use PROJECTS from data/projects.js
  const projects = (typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS) && PROJECTS.length > 0)
    ? [...PROJECTS].sort((a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0))
    : [];

  if (!projects.length) return;

  const total = projects.length;

  const currentLang =
    (typeof window.bmsGetLanguage === "function"
      ? window.bmsGetLanguage()
      : document.documentElement.lang) || "en";

  // Render cards into deck
  deck.innerHTML = projects.map((raw, index) => {
    const p =
      typeof window.bmsLocalizeProject === "function"
        ? window.bmsLocalizeProject(raw, currentLang)
        : currentLang === "fr" && raw.fr
        ? { ...raw, ...raw.fr }
        : raw;

    const eyebrow = p.eyebrow || `${p.subtitle || p.category} · ${p.date ? p.date.slice(0, 4) : "2026"}`;
    const title = p.title || "Project";
    const desc = p.description || p.miniDesc || "";
    const img = p.image || p.thumbnail || p.hero || "";
    const imgAlt = p.imageAlt || `${title} screenshot`;
    const bg = p.background || p.accent || "#121316";
    const fg = p.foreground || "#ffffff";
    const tags = p.tags && Array.isArray(p.tags) ? p.tags.slice(0, 4) : [];
    const liveUrl = p.liveUrl || "";
    const detailUrl = `projects/${p.id}/index.html`;
    const repoUrl = p.repoUrl || "";

    return `
      <article class="flip-card" id="flip-card-${index}" data-index="${index}"
        style="--card-bg: ${bg}; --card-fg: ${fg};"
        role="group"
        aria-roledescription="slide"
        aria-label="${escapeHtml(title)} (${index + 1} of ${total})">
        <div class="flip-card__content">
          <div class="flip-card__eyebrow">
            <span class="flip-card__eyebrow-dot" aria-hidden="true"></span>
            <span>${escapeHtml(eyebrow)}</span>
          </div>
          <h3 class="flip-card__title">${escapeHtml(title)}</h3>
          <p class="flip-card__desc">${escapeHtml(desc)}</p>
          <div class="flip-card__tags">
            ${tags.map((t) => `<span class="flip-card__tag">${escapeHtml(t)}</span>`).join("")}
          </div>
          <div class="flip-card__actions">
            ${liveUrl && liveUrl !== "#" ? `
              <a href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" class="flip-btn flip-btn--primary">
                <span data-i18n="hero.liveDemo">live demo ↗</span>
              </a>
            ` : ""}
            <a href="${escapeHtml(detailUrl)}" class="flip-btn flip-btn--secondary">
              <span data-i18n="hero.details">details →</span>
            </a>
            ${repoUrl && repoUrl !== "#" ? `
              <a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer" class="flip-btn flip-btn--ghost">
                <span>code ↗</span>
              </a>
            ` : ""}
          </div>
        </div>
        <div class="flip-card__media">
          <picture>
            <source srcset="${escapeHtml(encodeURI(img))}" type="image/webp" />
            <img src="${escapeHtml(encodeURI(img))}" alt="${escapeHtml(imgAlt)}" class="flip-card__img" width="1340" height="900" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" />
          </picture>
        </div>
      </article>
    `.trim();
  }).join("\n");

  // Immediate and dynamic translation synchronization for rendered cards
  const syncDynamicI18n = (lang) => {
    if (typeof I18N === "undefined") return;
    const targetLang = lang || (window.bmsGetLanguage ? window.bmsGetLanguage() : (document.documentElement.lang || "en"));
    const dict = I18N[targetLang] || I18N.en;
    if (!dict) return;
    deck.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = key.split(".").reduce((acc, part) => acc && acc[part], dict);
      if (text !== undefined) el.textContent = text;
    });

    // Update localized card texts (eyebrow, desc, title)
    deck.querySelectorAll(".flip-card").forEach((card) => {
      const idx = parseInt(card.getAttribute("data-index"), 10);
      const raw = projects[idx];
      if (!raw) return;
      const lp =
        typeof window.bmsLocalizeProject === "function"
          ? window.bmsLocalizeProject(raw, targetLang)
          : targetLang === "fr" && raw.fr
          ? { ...raw, ...raw.fr }
          : raw;

      const eyebrowSpan = card.querySelector(".flip-card__eyebrow span:last-child");
      if (eyebrowSpan) {
        eyebrowSpan.textContent =
          lp.eyebrow || `${lp.subtitle || lp.category} · ${lp.date ? lp.date.slice(0, 4) : "2026"}`;
      }
      const descEl = card.querySelector(".flip-card__desc");
      if (descEl) descEl.textContent = lp.description || lp.miniDesc || raw.description;
      const titleEl = card.querySelector(".flip-card__title");
      if (titleEl) titleEl.textContent = lp.title || raw.title;
    });
  };
  syncDynamicI18n(currentLang);
  window.addEventListener("bms:langchange", (e) => {
    const lang = (e.detail && e.detail.lang) || (window.bmsGetLanguage ? window.bmsGetLanguage() : "en");
    syncDynamicI18n(lang);
  });

  const cards = Array.from(deck.querySelectorAll(".flip-card"));
  const progressBar = document.getElementById("flip-progress-bar");

  let currentActiveIndex = 0;
  let isTicking = false;

  function updateFlipCards() {
    isTicking = false;
    const rect = container.getBoundingClientRect();
    const containerH = container.offsetHeight;
    const winH = window.innerHeight;
    const stickyTop = window.innerWidth <= 768 ? 108 : (window.innerWidth <= 992 ? 130 : 145);
    const scrollableDistance = containerH - (winH - stickyTop);

    if (scrollableDistance <= 0) return;

    // Normalized progress through the sticky track: 0 at start, 1 when all cards flipped
    const rawProgress = (stickyTop - rect.top) / scrollableDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // Floating card index: 0.0 to (total - 1)
    const curFloat = progress * (total - 1);
    const activeIndex = Math.min(Math.round(curFloat), total - 1);

    if (activeIndex !== currentActiveIndex) {
      currentActiveIndex = activeIndex;
    }

    if (progressBar) {
      progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // Apply 3D flip physics to each card
    cards.forEach((card, i) => {
      const diff = curFloat - i;

      if (diff > 0) {
        // Card has folded or is currently folding away upward
        const foldProgress = Math.min(1, diff);
        const rotateX = foldProgress * 42; // degrees
        const translateY = -(foldProgress * 115); // percent
        const scale = 1 - foldProgress * 0.08;
        const opacity = Math.max(0, 1 - foldProgress * 1.5);
        const pointerEvents = foldProgress > 0.4 ? "none" : "auto";
        const zIndex = 50 - i;

        card.style.setProperty("--flip-rotate", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--flip-y", `${translateY.toFixed(2)}%`);
        card.style.setProperty("--flip-scale", scale.toFixed(3));
        card.style.setProperty("--flip-opacity", opacity.toFixed(3));
        card.style.setProperty("--flip-z", String(zIndex));
        card.style.setProperty("--flip-pointer", pointerEvents);
        card.setAttribute("aria-hidden", foldProgress > 0.5 ? "true" : "false");
      } else {
        // Card is active or waiting beneath in the deck
        const under = -diff; // 0 for exact active, positive for cards underneath
        const translateY = Math.min(under * 14, 42); // px
        const scale = Math.max(0.92, 1 - under * 0.035);
        const opacity = under < 2.5 ? 1 : 0;
        const pointerEvents = under < 0.3 ? "auto" : "none";
        const zIndex = 50 - i;

        card.style.setProperty("--flip-rotate", "0deg");
        card.style.setProperty("--flip-y", `${translateY.toFixed(1)}px`);
        card.style.setProperty("--flip-scale", scale.toFixed(3));
        card.style.setProperty("--flip-opacity", opacity.toFixed(2));
        card.style.setProperty("--flip-z", String(zIndex));
        card.style.setProperty("--flip-pointer", pointerEvents);
        card.setAttribute("aria-hidden", under > 0.5 ? "true" : "false");
      }
    });
  }

  function requestUpdate() {
    if (!isTicking) {
      window.requestAnimationFrame(updateFlipCards);
      isTicking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });

  // Navigation scroll jump helper
  function scrollToCard(index) {
    const targetIdx = Math.max(0, Math.min(total - 1, index));
    const stickyTop = window.innerWidth <= 768 ? 108 : (window.innerWidth <= 992 ? 130 : 145);
    const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
    const containerH = container.offsetHeight;
    const scrollableDistance = containerH - (window.innerHeight - stickyTop);
    const targetScrollY = containerTop - stickyTop + (targetIdx / (total - 1)) * scrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }

  // Touch Swipe Gesture for mobile
  let touchStartY = 0;
  let touchStartX = 0;

  stage.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    },
    { passive: true }
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const deltaX = e.changedTouches[0].clientX - touchStartX;

      // Vertical swipe intent
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 40) {
        if (deltaY < 0) {
          // Swiped up -> next
          scrollToCard(currentActiveIndex + 1);
        } else {
          // Swiped down -> prev
          scrollToCard(currentActiveIndex - 1);
        }
      }
    },
    { passive: true }
  );

  // Keyboard accessibility
  stage.setAttribute("tabindex", "0");
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      scrollToCard(currentActiveIndex + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToCard(currentActiveIndex - 1);
    }
  });

  // Initial calculation
  updateFlipCards();
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

  function lockMaxWidth() {
    const maxWidth = Math.max(...words.map((w) => w.scrollWidth || w.offsetWidth || 0));
    if (maxWidth > 0) {
      container.style.width = `${maxWidth + 4}px`;
    }
  }

  lockMaxWidth();
  window.addEventListener("resize", lockMaxWidth);
  window.addEventListener("bms:langchange", () => {
    requestAnimationFrame(() => lockMaxWidth());
  });
  if (document.fonts) {
    document.fonts.ready.then(lockMaxWidth);
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

  const hideOverlay = () => {
    overlay.classList.remove("active");
  };

  window.addEventListener("load", hideOverlay);
  window.addEventListener("pageshow", hideOverlay);

  // Delegated click handler for all page navigation links
  document.addEventListener("click", (e) => {
    // Ignore clicks with modifier keys (new tab, new window, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest("a[href]");
    if (!link) return;

    // Ignore external targets, downloads, or anchor hash links
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("http://") ||
      href.startsWith("https://")
    ) {
      return;
    }

    e.preventDefault();
    overlay.classList.add("active");
    setTimeout(() => {
      window.location.href = href;
    }, 350);
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

    const currentLang =
      (typeof window.bmsGetLanguage === "function"
        ? window.bmsGetLanguage()
        : document.documentElement.lang) || "en";
    const dict = typeof I18N !== "undefined" && I18N[currentLang] ? I18N[currentLang] : null;

    // 3. Set loading state
    const originalBtnText =
      btnText ? btnText.textContent : dict?.contact?.sendBtn || "Send Message";
    const sendingText =
      dict?.contact?.sendingBtn || (currentLang === "fr" ? "Envoi en cours..." : "Sending...");

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      if (btnText) btnText.textContent = sendingText;
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

    const fallbackErrorText =
      dict?.contact?.homeErrorMsg ||
      (currentLang === "fr"
        ? "Impossible d'envoyer le message. Écrivez-moi directement :"
        : "Could not send message. Please email directly:");

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
          errorMsg.innerHTML = `${fallbackErrorText} (${errMsg}) <br/> <a href="${mailtoUrl}" class="form-fallback-link">${recipientEmail}</a>`;
          errorMsg.style.display = "block";
        }
      }
    } catch (err) {
      if (errorMsg) {
        errorMsg.innerHTML = `${fallbackErrorText} <br/> <a href="${mailtoUrl}" class="form-fallback-link">${recipientEmail}</a>`;
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

/* ── 11. Homepage Subscribe / Conversation Form ── */
function initHomepageForm() {
  const form = document.getElementById("subscribe-form");
  if (!form) return;

  const successMsg = document.getElementById("sub-success");
  const errorMsg = document.getElementById("sub-error");
  const submitBtn = document.getElementById("sub-submit-btn") || form.querySelector('button[type="submit"]');
  const btnText = document.getElementById("sub-btn-text") || (submitBtn ? submitBtn.querySelector(".button__inner") : null);

  const nameInput = document.getElementById("sub-name") || form.querySelector('input[name="name"]');
  const emailInput = document.getElementById("sub-email") || form.querySelector('input[name="email"]');
  const messageInput = document.getElementById("sub-message") || form.querySelector('textarea[name="message"]');
  const botcheckInput = form.querySelector('input[name="botcheck"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (successMsg) successMsg.style.display = "none";
    if (errorMsg) {
      errorMsg.style.display = "none";
      errorMsg.innerHTML = "";
    }

    // Honeypot check
    if (botcheckInput && botcheckInput.checked) {
      console.warn("Honeypot triggered, submission ignored.");
      return;
    }

    const nameVal = (nameInput ? nameInput.value : "").trim();
    const emailVal = (emailInput ? emailInput.value : "").trim();
    const messageVal = (messageInput ? messageInput.value : "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nameVal || nameVal.length < 2) {
      if (nameInput) nameInput.focus();
      return;
    }
    if (!emailVal || !emailRegex.test(emailVal)) {
      if (emailInput) emailInput.focus();
      return;
    }
    if (!messageVal || messageVal.length < 10) {
      if (messageInput) messageInput.focus();
      return;
    }

    const currentLang = window.bmsGetLanguage ? window.bmsGetLanguage() : "en";
    const dict = (typeof I18N !== "undefined" && I18N[currentLang]) ? I18N[currentLang] : null;

    const originalBtnText = btnText ? btnText.textContent : "connect";
    const sendingText = dict && dict.contact && dict.contact.homeConnectingBtn
      ? dict.contact.homeConnectingBtn
      : (currentLang === "fr" ? "envoi..." : "connecting...");

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      if (btnText) btnText.textContent = sendingText;
    }

    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value : "55812487-877a-4648-a266-64f19029d19f";

    const payload = {
      access_key: accessKey,
      name: nameVal,
      email: emailVal,
      subject: "New contact from BMS Creations homepage",
      message: messageVal,
      botcheck: botcheckInput && botcheckInput.checked ? "true" : "",
    };

    const recipientEmail = "mohamedaminebenmasseoud63@gmail.com";
    const mailtoSubject = encodeURIComponent(`[BMS Creations Homepage] Contact request from ${nameVal}`);
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
        if (messageInput) messageInput.value = "";
      } else {
        const fallbackText = dict && dict.contact && dict.contact.homeErrorMsg
          ? dict.contact.homeErrorMsg
          : (currentLang === "fr"
            ? "Impossible d'envoyer le message. Écrivez-moi directement :"
            : "Could not send message. Please email directly:");
        if (errorMsg) {
          errorMsg.innerHTML = `${fallbackText} <a href="${mailtoUrl}" class="form-fallback-link">${recipientEmail}</a>`;
          errorMsg.style.display = "block";
        }
      }
    } catch (err) {
      const fallbackText = dict && dict.contact && dict.contact.homeErrorMsg
        ? dict.contact.homeErrorMsg
        : (currentLang === "fr"
          ? "Impossible d'envoyer le message. Écrivez-moi directement :"
          : "Could not send message. Please email directly:");
      if (errorMsg) {
        errorMsg.innerHTML = `${fallbackText} <a href="${mailtoUrl}" class="form-fallback-link">${recipientEmail}</a>`;
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
