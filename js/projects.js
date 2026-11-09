/* ═══════════════════════════════════════════════
   projects.js — Project Listing, Search & Tag Filtering
   ═══════════════════════════════════════════════ */

let activeCategory = "all";
let activeTag = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  initProjectTags();
  initSearch();
  initCategoryFilters();
  renderProjectCards();
  renderMoreProjects();

  // Re-render when language changes
  window.addEventListener("bms:langchange", () => {
    renderProjectCards();
    renderMoreProjects();
  });
});

/* ── Extract & Render Available Tags ── */
function initProjectTags() {
  const tagListContainer = document.getElementById("projects-tag-list");
  if (!tagListContainer || typeof PROJECTS === "undefined") return;

  const allTagsSet = new Set();
  PROJECTS.forEach((p) => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach((t) => allTagsSet.add(t));
    }
  });

  const sortedTags = Array.from(allTagsSet).sort();

  tagListContainer.innerHTML = [
    `<button class="tag-filter-chip active" data-tag="all" data-i18n="projects.allTags">All</button>`,
    ...sortedTags.map(
      (tag) => `<button class="tag-filter-chip" data-tag="${tag}">${tag}</button>`
    ),
  ].join("");

  tagListContainer.querySelectorAll(".tag-filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const tag = chip.getAttribute("data-tag");
      tagListContainer
        .querySelectorAll(".tag-filter-chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeTag = tag;
      renderProjectCards();
    });
  });
}

/* ── Search Input Handling ── */
function initSearch() {
  const searchInput = document.getElementById("project-search-input");
  const clearBtn = document.getElementById("project-search-clear");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    if (clearBtn) {
      clearBtn.style.display = searchQuery ? "inline-block" : "none";
    }
    renderProjectCards();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearBtn.style.display = "none";
      searchInput.focus();
      renderProjectCards();
    });
  }
}

/* ── Category Filters ── */
function initCategoryFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.filter || "all";
      renderProjectCards();
    });
  });
}

/* ── Render Cards Matching Active Criteria ── */
function renderProjectCards() {
  const grid = document.getElementById("projects-grid");
  if (!grid || typeof PROJECTS === "undefined") return;

  const filtered = PROJECTS.filter((p) => {
    // 1. Category match
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    if (!matchesCategory) return false;

    // 2. Tag match
    const matchesTag =
      activeTag === "all" || (p.tags && p.tags.includes(activeTag));
    if (!matchesTag) return false;

    // 3. Search query match
    if (searchQuery) {
      const inTitle = p.title && p.title.toLowerCase().includes(searchQuery);
      const inDesc =
        p.description && p.description.toLowerCase().includes(searchQuery);
      const inSubtitle =
        p.subtitle && p.subtitle.toLowerCase().includes(searchQuery);
      const inTags =
        p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery));
      const inRole = p.role && p.role.toLowerCase().includes(searchQuery);
      const inCat = p.category && p.category.toLowerCase().includes(searchQuery);
      return inTitle || inDesc || inSubtitle || inTags || inRole || inCat;
    }

    return true;
  });

  const lang =
    (typeof bmsGetLanguage === "function"
      ? bmsGetLanguage()
      : document.documentElement.lang) || "en";
  const featuredLabel =
    (typeof I18N !== "undefined" &&
      I18N[lang] &&
      I18N[lang].badge &&
      I18N[lang].badge.featured) ||
    "★ Featured";
  const noResultsMsg =
    (typeof I18N !== "undefined" &&
      I18N[lang] &&
      I18N[lang].projects &&
      I18N[lang].projects.noResults) ||
    "No projects found matching your search. Try adjusting your keywords or category filters.";

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty">
        <p data-i18n="projects.noResults">${noResultsMsg}</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
    <a href="projects/${p.id}/index.html" class="project-card glass reveal" id="card-${p.id}">
      <div class="project-card__image">
        <picture>
          <source srcset="${encodeURI(p.thumbnail)}" type="image/webp" />
          <img src="${encodeURI(p.thumbnail)}" alt="${p.title} preview" width="1340" height="900" loading="lazy" decoding="async"
               onerror="this.style.display='none'" />
        </picture>
        <div class="project-card__overlay"></div>
      </div>
      <div class="project-card__body">
        <p class="project-card__category">${p.category}</p>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.description}</p>
        <div class="project-card__tags">
          ${p.featured ? `<span class="tag tag--featured" data-i18n="badge.featured">${featuredLabel}</span>` : ""}
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    </a>`
    )
    .join("");

  // Trigger scroll reveals
  requestAnimationFrame(() => {
    grid.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
      setTimeout(() => el.classList.add("visible"), 40);
    });
  });
}

/* ── Render Additional Projects (Text-only cards) ── */
function renderMoreProjects() {
  const container = document.getElementById("more-projects-grid");
  if (!container || typeof MORE_PROJECTS === "undefined") return;

  container.innerHTML = MORE_PROJECTS.map(
    (p) => `
    <div class="more-project-card glass reveal" id="more-${p.id}">
      <div>
        <div class="more-project-card__header">
          <span class="more-project-card__badge">${p.badge || "Project"}</span>
          <h3 class="more-project-card__title">${p.title}</h3>
        </div>
        <p class="more-project-card__desc">${p.description}</p>
      </div>
      <div class="more-project-card__tags">
        ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    </div>`
  ).join("");

  requestAnimationFrame(() => {
    container.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${i * 100}ms`;
      setTimeout(() => el.classList.add("visible"), 50);
    });
  });
}
