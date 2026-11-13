/* ═══════════════════════════════════════════════
   project-detail.js — Loads Selected Project
   ═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  loadProjectDetail();

  // Re-render project details on language switch
  window.addEventListener("bms:langchange", () => {
    loadProjectDetail();
  });
});

const resolvePath = (p) => {
  if (!p) return "";
  if (p.startsWith("http") || p.startsWith("/")) return p;
  if (p.startsWith("../../")) return p;
  return `../../${p}`;
};

function getProjectSlug() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (!pathParts.length) return "";
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart.toLowerCase().endsWith(".html")) {
    return pathParts[pathParts.length - 2] || "";
  }
  return lastPart;
}

function loadProjectDetail() {
  if (typeof PROJECTS === "undefined") return;

  // Determine which project we're viewing from the URL path
  const slug = getProjectSlug();

  const rawProject = PROJECTS.find((p) => p.id === slug);
  if (!rawProject) {
    document.getElementById("project-title") &&
      (document.getElementById("project-title").textContent = "Project Not Found");
    return;
  }

  const currentLang =
    (typeof window.bmsGetLanguage === "function"
      ? window.bmsGetLanguage()
      : document.documentElement.lang) || "en";

  const project =
    typeof window.bmsLocalizeProject === "function"
      ? window.bmsLocalizeProject(rawProject, currentLang)
      : currentLang === "fr" && rawProject.fr
      ? { ...rawProject, ...rawProject.fr }
      : rawProject;

  // Populate hero
  setTextById("project-title", project.title);
  setTextById("project-subtitle", project.subtitle);
  setTextById("project-category", project.category);

  // Hero background image
  const heroBg = document.getElementById("project-hero-img");
  if (heroBg) {
    heroBg.src = resolvePath(project.hero);
    heroBg.alt = project.title;
    heroBg.setAttribute("width", "1400");
    heroBg.setAttribute("height", "900");
    heroBg.setAttribute("fetchpriority", "high");
    heroBg.setAttribute("decoding", "async");
  }

  // Featured preview image
  const previewImg = document.getElementById("project-preview-img");
  const previewSource = document.getElementById("project-preview-source");
  if (previewImg && project.thumbnail) {
    const thumbPath = resolvePath(project.thumbnail);
    previewImg.src = thumbPath;
    previewImg.alt = `${project.title} interface preview`;
    if (previewSource) previewSource.srcset = thumbPath;
  }

  // Tags
  const tagsContainer = document.getElementById("project-tags");
  if (tagsContainer) {
    tagsContainer.innerHTML = project.tags
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
  }

  // Description
  setTextById("project-description", project.description);

  // Highlights
  const highlightsList = document.getElementById("project-highlights");
  if (highlightsList && project.highlights) {
    highlightsList.innerHTML = project.highlights
      .map((h) => `<li>${h}</li>`)
      .join("");
  }

  // Action links
  const liveLink = document.getElementById("project-live-link");
  if (liveLink) {
    liveLink.href = project.liveUrl || "#";
    liveLink.target = "_blank";
    liveLink.rel = "noopener noreferrer";
  }

  const repoLink = document.getElementById("project-repo-link");
  if (repoLink) {
    repoLink.href = project.repoUrl || "#";
    repoLink.target = "_blank";
    repoLink.rel = "noopener noreferrer";
  }

  // Sidebar meta
  setTextById("project-date", formatDate(project.date, currentLang));
  setTextById("project-cat-value", formatCategory(project.category, currentLang));
  setTextById(
    "project-type-value",
    project.statCategory || formatCategory(project.category, currentLang)
  );
  setOptionalSidebarItem("project-role", project.role);
  setOptionalSidebarItem("project-duration", project.duration);

  // Sidebar technologies & quick links
  const sidebarTags = document.getElementById("project-sidebar-tags");
  if (sidebarTags && Array.isArray(project.tags)) {
    sidebarTags.innerHTML = project.tags
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
  }

  const sideLive = document.getElementById("sidebar-live-link");
  if (sideLive) {
    if (project.liveUrl) {
      sideLive.href = project.liveUrl;
      sideLive.style.display = "inline-flex";
    } else {
      sideLive.style.display = "none";
    }
  }

  const sideRepo = document.getElementById("sidebar-repo-link");
  if (sideRepo) {
    if (project.repoUrl) {
      sideRepo.href = project.repoUrl;
      sideRepo.style.display = "inline-flex";
    } else {
      sideRepo.style.display = "none";
    }
  }

  // Problem & Solution
  setOptionalSection("project-problem", project.problem);
  setOptionalSection("project-solution", project.solution);

  // Result & Impact
  setOptionalSection("project-result", project.result);

  // Engineering Challenges
  const challengesList = document.getElementById("project-challenges");
  if (challengesList) {
    const hasChallenges = Array.isArray(project.challenges)
      ? project.challenges.length > 0 && !project.challenges[0].startsWith("TODO_")
      : Boolean(project.challenges) && !project.challenges.startsWith("TODO_");
    if (hasChallenges) {
      const items = Array.isArray(project.challenges)
        ? project.challenges
        : [project.challenges];
      challengesList.innerHTML = items.map((c) => `<li>${c}</li>`).join("");
      if (challengesList.previousElementSibling)
        challengesList.previousElementSibling.style.display = "";
      challengesList.style.display = "";
    } else {
      challengesList.innerHTML = "";
      challengesList.style.display = "none";
      if (challengesList.previousElementSibling)
        challengesList.previousElementSibling.style.display = "none";
    }
  }

  // Camera Permission / Privacy Notice (respects I18N without race conditions)
  const cameraNotice = document.getElementById("project-camera-notice");
  if (cameraNotice) {
    if (rawProject.cameraNotice) {
      cameraNotice.style.display = "flex";
      const noticeText = document.getElementById("project-camera-notice-text");
      if (noticeText) {
        const i18nNotice =
          typeof I18N !== "undefined" &&
          I18N[currentLang] &&
          I18N[currentLang].detail &&
          I18N[currentLang].detail.cameraNoticeText;
        noticeText.textContent = i18nNotice || rawProject.cameraNotice;
      }
    } else {
      cameraNotice.style.display = "none";
    }
  }

  // Demo Video
  const videoContainer = document.getElementById("project-video-container");
  const videoEl = document.getElementById("project-video");
  if (videoContainer && videoEl) {
    if (project.demoVideo && !project.demoVideo.startsWith("TODO_")) {
      videoContainer.style.display = "block";
      videoEl.innerHTML = `<iframe src="${project.demoVideo}" title="${project.title} Demo Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else if (project.demoVideo && project.demoVideo.startsWith("TODO_")) {
      videoContainer.style.display = "block";
      videoEl.innerHTML = `<div class="project-video-placeholder"><p>Demo video coming soon (${project.demoVideo})</p></div>`;
    } else {
      videoContainer.style.display = "none";
    }
  }

  // Related projects
  renderRelated(rawProject);

  // Page title
  document.title = `${project.title} — Portfolio`;
}

/* ── Related Projects ── */
function renderRelated(current) {
  const grid = document.getElementById("related-grid");
  if (!grid) return;

  const currentLang =
    (typeof window.bmsGetLanguage === "function"
      ? window.bmsGetLanguage()
      : document.documentElement.lang) || "en";

  const related = PROJECTS.filter((p) => p.id !== current.id).slice(0, 2);

  grid.innerHTML = related
    .map((raw) => {
      const p =
        typeof window.bmsLocalizeProject === "function"
          ? window.bmsLocalizeProject(raw, currentLang)
          : currentLang === "fr" && raw.fr
          ? { ...raw, ...raw.fr }
          : raw;

      return `
    <a href="../${p.id}/index.html" class="project-card glass reveal">
      <div class="project-card__image">
        <picture>
          <source srcset="${encodeURI(resolvePath(p.thumbnail))}" type="image/webp" />
          <img src="${encodeURI(resolvePath(p.thumbnail))}" alt="${p.title}" width="1340" height="900" loading="lazy" decoding="async"
               onerror="this.style.display='none'" />
        </picture>
      </div>
      <div class="project-card__body">
        <p class="project-card__category">${p.category}</p>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.description}</p>
      </div>
    </a>`;
    })
    .join("");

  // Trigger reveals
  requestAnimationFrame(() => {
    grid.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${i * 120}ms`;
      setTimeout(() => el.classList.add("visible"), 100);
    });
  });
}

/* ── Helpers ── */
function setTextById(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setOptionalSidebarItem(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const parent = el.closest(".sidebar-card__item");
  if (!value || String(value).startsWith("TODO_")) {
    if (parent) parent.style.display = "none";
  } else {
    el.textContent = value;
    if (parent) parent.style.display = "flex";
  }
}

function setOptionalSection(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const heading = el.previousElementSibling;
  if (!text || String(text).startsWith("TODO_")) {
    el.style.display = "none";
    if (heading && heading.tagName.startsWith("H")) heading.style.display = "none";
  } else {
    el.textContent = text;
    el.style.display = "block";
    if (heading && heading.tagName.startsWith("H")) heading.style.display = "block";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCategory(cat, lang = "en") {
  if (!cat) return "—";
  if (lang === "fr") {
    if (cat.toLowerCase() === "interactive") return "Interactif";
  }
  return capitalize(cat);
}

function formatDate(dateStr, lang = "en") {
  if (!dateStr) return "—";
  const [year, month] = dateStr.split("-");
  const enMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const frMonths = [
    "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sept", "Oct", "Nov", "Déc",
  ];
  const months = lang === "fr" ? frMonths : enMonths;
  const idx = parseInt(month, 10) - 1;
  return `${months[idx] || month} ${year}`;
}
