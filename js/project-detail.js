/* ═══════════════════════════════════════════════
   project-detail.js — Loads Selected Project
   ═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  loadProjectDetail();
});

const resolvePath = (p) => {
  if (!p) return "";
  if (p.startsWith("http") || p.startsWith("/")) return p;
  if (p.startsWith("../../")) return p;
  return `../../${p}`;
};

function loadProjectDetail() {
  if (typeof PROJECTS === "undefined") return;

  // Determine which project we're viewing from the URL path
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];

  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) {
    document.getElementById("project-title") &&
      (document.getElementById("project-title").textContent = "Project Not Found");
    return;
  }

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

  const currentLang = window.bmsGetLanguage ? window.bmsGetLanguage() : "en";

  // Sidebar meta
  setTextById("project-date", formatDate(project.date, currentLang));
  setTextById("project-cat-value", formatCategory(project.category, currentLang));
  setOptionalSidebarItem("project-role", project.role);
  setOptionalSidebarItem("project-duration", project.duration);

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
      const items = Array.isArray(project.challenges) ? project.challenges : [project.challenges];
      challengesList.innerHTML = items.map((c) => `<li>${c}</li>`).join("");
      if (challengesList.previousElementSibling) challengesList.previousElementSibling.style.display = "";
      challengesList.style.display = "";
    } else {
      challengesList.innerHTML = "";
      challengesList.style.display = "none";
      if (challengesList.previousElementSibling) challengesList.previousElementSibling.style.display = "none";
    }
  }

  // Camera Permission / Privacy Notice
  const cameraNotice = document.getElementById("project-camera-notice");
  if (cameraNotice) {
    if (project.cameraNotice) {
      cameraNotice.style.display = "flex";
      const noticeText = document.getElementById("project-camera-notice-text");
      if (noticeText && typeof project.cameraNotice === "string") {
        noticeText.textContent = project.cameraNotice;
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
  renderRelated(project);

  // Page title
  document.title = `${project.title} — Portfolio`;
}

/* ── Related Projects ── */
function renderRelated(current) {
  const grid = document.getElementById("related-grid");
  if (!grid) return;

  const related = PROJECTS.filter((p) => p.id !== current.id).slice(0, 2);

  grid.innerHTML = related
    .map(
      (p) => `
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
    </a>`
    )
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

window.addEventListener("bms:langchange", (e) => {
  const lang = e.detail?.lang || "en";
  if (typeof PROJECTS === "undefined") return;
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
  const project = PROJECTS.find((p) => p.id === slug);
  if (project) {
    setTextById("project-date", formatDate(project.date, lang));
    setTextById("project-cat-value", formatCategory(project.category, lang));
  }
});
