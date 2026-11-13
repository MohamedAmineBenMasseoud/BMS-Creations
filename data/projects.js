// ──────────────────────────────────────────────
//  Project Data Store
//  Single source of truth for portfolio projects.
//  Accurately documented from project READMEs.
//  Features full English & French (fr) localization.
// ──────────────────────────────────────────────

const PROJECTS = [
  {
    id: "stageconnect",
    title: "StageConnect ISET",
    subtitle: "Internship Management Platform Prototype",
    eyebrow: "Web Application Prototype · 2026",
    category: "web",
    featured: true,
    tags: ["HTML5", "CSS3", "JavaScript", "LocalStorage", "Chart.js", "Google Apps Script"],
    thumbnail: "assets/screenshots/StageConnect-ISET.webp",
    hero: "assets/screenshots/StageConnect-ISET.webp",
    image: "assets/screenshots/StageConnect-ISET.webp",
    imageAlt: "StageConnect ISET internship management prototype interface",
    background: "#121316",
    foreground: "#fbfbfa",
    description:
      "A static internship management platform prototype for ISET Djerba students and partner companies, featuring internship search, simulated dashboards, and Google Sheets integration.",
    problem:
      "Students frequently face fragmented channels when seeking internships, while companies and academic coordinators need a centralized prototype to review applications, student opinions, and department statistics.",
    solution:
      "A lightweight, fully client-side platform built with vanilla web technologies, combining localStorage state persistence, Google Sheets reviews via Google Apps Script, and Chart.js analytics.",
    highlights: [
      "Internship search with live multi-criteria filtering by department, level, duration, and keyword",
      "Interactive student and company dashboard simulations with application tracking",
      "Public student review system connected to Google Sheets via Google Apps Script Web App",
      "Analytics dashboards featuring interactive statistical charts powered by Chart.js",
      "Simulated messaging interface and print-ready PDF internship report templates",
    ],
    liveUrl: "https://mohamedaminebenmasseoud.github.io/StageConnect-ISET/",
    repoUrl: "https://github.com/mohamedaminebenmasseoud/StageConnect-ISET",
    date: "2026-05",
    accent: "#0e0e0e",
    avatar: "SC",
    statCategory: "Web App",
    miniDesc: "Static prototype with simulated dashboards and Google Sheets API.",
    cardTag: "JS · Sheets · Chart.js",
    fr: {
      subtitle: "Prototype de Plateforme de Gestion des Stages",
      eyebrow: "Prototype d'Application Web · 2026",
      description:
        "Un prototype statique de plateforme de gestion des stages pour les étudiants et entreprises partenaires de l'ISET Djerba, avec recherche d'offres, tableaux de bord simulés et intégration Google Sheets.",
      problem:
        "Les étudiants font souvent face à des canaux dispersés pour trouver un stage, tandis que les entreprises et coordinateurs pédagogiques ont besoin d'un prototype centralisé pour consulter les candidatures, avis et statistiques de département.",
      solution:
        "Une plateforme légère 100% côté client conçue avec les technologies web standards, combinant persistance localStorage, avis étudiants reliés à Google Sheets via Google Apps Script et tableaux de bord analytiques Chart.js.",
      highlights: [
        "Recherche de stages avec filtrage multicritères en direct par département, niveau, durée et mot-clé",
        "Simulations interactives d'espaces étudiant et entreprise avec suivi des candidatures",
        "Système d'avis étudiants public connecté à Google Sheets via une Web App Google Apps Script",
        "Tableaux de bord analytiques avec visualisations statistiques interactives propulsées par Chart.js",
        "Interface de messagerie simulée et modèles d'attestations et rapports de stage prêts à l'impression",
      ],
      miniDesc: "Prototype statique avec tableaux de bord simulés et API Google Sheets.",
      statCategory: "App Web",
    },
  },
  {
    id: "enactus-iset",
    title: "Enactus ISET Djerba",
    subtitle: "Future Makers — Chapter Showcase Platform",
    eyebrow: "Social Impact Platform · 2026",
    category: "web",
    featured: true,
    tags: ["HTML5", "CSS3", "JavaScript", "UI/UX", "Social Impact"],
    thumbnail: "assets/screenshots/enactusIsetDjerba.webp",
    hero: "assets/screenshots/enactusIsetDjerba.webp",
    image: "assets/screenshots/enactusIsetDjerba.webp",
    imageAlt: "Enactus ISET Djerba chapter showcase website",
    background: "#0d0e10",
    foreground: "#eceae4",
    description:
      "The official one-page showcase website for the Enactus ISET Djerba chapter, highlighting student-led social entrepreneurship projects, team members, and community initiatives.",
    problem:
      "Enactus ISET Djerba required an engaging, accessible web showcase to present social impact projects, introduce team members, and share workshop announcements.",
    solution:
      "A high-performance single-page website built with vanilla HTML5, CSS3, and JavaScript, featuring interactive before/after project sliders and animated team cards.",
    highlights: [
      "Hero section with background video integration and responsive call-to-actions",
      "Interactive before-and-after comparison sliders showcasing sustainable community projects",
      "Custom two-face team member cards with animated CSS clip-path reveal effects",
      "Accessible zero-dependency single-page architecture built with vanilla web technologies",
    ],
    liveUrl: "https://enactus-alt.github.io/Enactus-ISET-JB-/#home",
    repoUrl: "https://github.com/enactus-alt/Enactus-ISET-JB-",
    date: "2026-03",
    accent: "#0e0e0e",
    avatar: "EI",
    statCategory: "Community",
    miniDesc: "Showcase platform with video hero, comparison sliders, and team cards.",
    cardTag: "Vanilla JS · Video · UI",
    fr: {
      subtitle: "Future Makers — Vitrine Officielle du Chapter",
      eyebrow: "Plateforme d'Impact Social · 2026",
      description:
        "Le site vitrine officiel d'une page du chapter Enactus ISET Djerba, mettant en valeur les projets d'entrepreneuriat social menés par les étudiants, les membres de l'équipe et les initiatives communautaires.",
      problem:
        "Enactus ISET Djerba avait besoin d'une vitrine web engageante et accessible pour présenter ses projets à impact social, présenter les membres de l'équipe et diffuser les annonces d'ateliers.",
      solution:
        "Un site web one-page haute performance conçu en HTML5, CSS3 et JavaScript vanilla, avec des curseurs interactifs avant/après et des cartes d'équipe animées.",
      highlights: [
        "Section hero avec intégration vidéo en arrière-plan et boutons d'action responsives",
        "Curseurs de comparaison avant/après interactifs présentant les projets durables",
        "Cartes de membres d'équipe recto-verso personnalisées avec effets de révélation CSS clip-path",
        "Architecture one-page accessible et sans dépendance externe conçue en technologies web natives",
      ],
      miniDesc: "Vitrine associative avec hero vidéo, sliders comparatifs et cartes d'équipe.",
      statCategory: "Communauté",
    },
  },
  {
    id: "particle-heart",
    title: "Hand Tracking + 3D Particle System (Pro)",
    subtitle: "Hand Tracking & 3D Particle System",
    eyebrow: "Vision & 3D WebGL · 2026",
    category: "interactive",
    featured: true,
    tags: ["Three.js", "MediaPipe", "WebGL", "JavaScript"],
    thumbnail: "assets/screenshots/Particle-Heart.webp",
    hero: "assets/screenshots/Particle-Heart.webp",
    image: "assets/screenshots/Particle-Heart.webp",
    imageAlt: "MediaPipe Hands 3D particle simulation in Three.js",
    background: "#190b10",
    foreground: "#fff0f3",
    description:
      "A single-file browser experience that uses MediaPipe Hands for real-time webcam hand tracking and Three.js for an interactive 3D particle simulation.",
    problem:
      "Creating touchless, real-time 3D interaction in standard web browsers requires coordinating webcam computer vision with GPU-accelerated graphics without external hardware.",
    solution:
      "A single-file web application combining MediaPipe Hands 21-point tracking with Three.js to render ~18,000 particles that morph and react dynamically to finger gestures.",
    highlights: [
      "Real-time 21-point hand tracking with MediaPipe Hands via webcam",
      "3D particle system of ~18,000 points rendered with Three.js and additive blending",
      "Finger gesture recognition driving shape morphing between heart, 3D star, and smooth sphere",
      "Touchless swirl, rotation, and particle scaling influenced by fingertip position and depth",
    ],
    cameraNotice:
      "A camera permission is requested in your browser for real-time local hand tracking. No video stream, photos, or biometric data are ever recorded or transmitted outside your device.",
    liveUrl: "https://mohamedaminebenmasseoud.github.io/Particle-Heart/",
    repoUrl: "https://github.com/mohamedaminebenmasseoud/Particle-Heart",
    date: "2026-07",
    accent: "#0e0e0e",
    avatar: "PH",
    statCategory: "Vision · 3D",
    miniDesc: "18,000 WebGL particles morphing via MediaPipe hand tracking.",
    cardTag: "MediaPipe · Three.js",
    fr: {
      subtitle: "Suivi Gestuel & Système de Particules 3D",
      eyebrow: "Vision & 3D WebGL · 2026",
      description:
        "Une expérience de navigation autonome utilisant MediaPipe Hands pour le suivi des mains par webcam en temps réel et Three.js pour une simulation de particules 3D interactive.",
      problem:
        "Créer une interaction 3D fluide et sans contact dans un navigateur web standard exige de synchroniser la vision par ordinateur et les graphismes accélérés par le GPU sans matériel externe.",
      solution:
        "Une application web monofichier combinant le suivi à 21 points MediaPipe Hands avec Three.js pour animer ~18 000 particules qui se métamorphosent et réagissent dynamiquement aux mouvements des doigts.",
      highlights: [
        "Suivi des mains à 21 points de repère en temps réel avec MediaPipe Hands via webcam",
        "Système de ~18 000 particules 3D rendu avec Three.js et mélange additif de couleurs",
        "Reconnaissance gestuelle des doigts déclenchant la métamorphose en cœur, étoile 3D et sphère",
        "Tourbillon, rotation et mise à l'échelle des particules sans contact selon la position et la profondeur de l'index",
      ],
      miniDesc: "18 000 particules WebGL métamorphosées par suivi gestuel MediaPipe.",
      statCategory: "Vision · 3D",
    },
  },
  {
    id: "gesture-puzzle",
    title: "Gesture Puzzle: Studio Edition Premium",
    subtitle: "Webcam Motion-Controlled Jigsaw Puzzle",
    eyebrow: "Vision Motion Game · 2026",
    category: "interactive",
    featured: false,
    tags: ["JavaScript", "HTML5 Canvas", "MediaPipe", "Web Audio API"],
    thumbnail: "assets/screenshots/Gesture-Puzzle.webp",
    hero: "assets/screenshots/Gesture-Puzzle.webp",
    image: "assets/screenshots/Gesture-Puzzle.webp",
    imageAlt: "Motion-controlled webcam jigsaw puzzle interface",
    background: "#0c131d",
    foreground: "#f0f6fc",
    description:
      "A browser-based motion game that captures a photo from your webcam using a dual-hand frame, slices it into a 3×3 jigsaw puzzle, and lets you solve it via pinch-and-drag gestures.",
    problem:
      "Translating camera-based hand tracking into precise puzzle-piece manipulation in a web browser requires reliable gesture recognition, custom jigsaw path generation, and real-time canvas rendering.",
    solution:
      "A single-file HTML5 Canvas game utilizing MediaPipe Hands for two-handed frame capture and single-hand pinch detection to pick up, move, and snap jigsaw pieces into place.",
    highlights: [
      "Two-handed frame detection mode to capture and slice live webcam photos into 3×3 puzzles",
      "Custom bezier-curve jigsaw piece generation rendered directly onto HTML5 Canvas",
      "Real-time pinch-and-drag gesture detection calculated from thumb-to-index distance",
      "Integrated sound effects using the Web Audio API and client-side win detection",
    ],
    cameraNotice:
      "A camera permission is requested in your browser for real-time local hand tracking. No video stream, photos, or biometric data are ever recorded or transmitted outside your device.",
    liveUrl: "https://mohamedaminebenmasseoud.github.io/Gesture-Puzzle/",
    repoUrl: "https://github.com/mohamedaminebenmasseoud/Gesture-Puzzle",
    date: "2026-09",
    accent: "#0e0e0e",
    avatar: "GP",
    statCategory: "Vision Game",
    miniDesc: "Webcam snapshot sliced into interactive canvas jigsaw puzzle.",
    cardTag: "Canvas · MediaPipe · Audio",
    fr: {
      subtitle: "Puzzle Contrôlé par Mouvements Webcam",
      eyebrow: "Jeu de Vision par Mouvements · 2026",
      description:
        "Un jeu par capture de mouvements dans le navigateur qui prend une photo via votre webcam avec un cadre à deux mains, la découpe en puzzle 3×3 et vous permet de le résoudre par pincement et glissement.",
      problem:
        "Transformer le suivi des mains par caméra en manipulation précise de pièces de puzzle dans un navigateur requiert une reconnaissance gestuelle fiable, la génération de courbes de découpe et un rendu canvas temps réel.",
      solution:
        "Un jeu HTML5 Canvas autonome utilisant MediaPipe Hands pour la capture photo à deux mains et la détection du pincement pour saisir, déplacer et enclencher les pièces.",
      highlights: [
        "Mode de détection de cadre à deux mains pour capturer et découper des photos webcam en puzzles 3×3",
        "Génération personnalisée de pièces de puzzle à courbes de Bézier rendues sur HTML5 Canvas",
        "Détection en temps réel du geste de pincement-glisser calculée d'après l'écart pouce-index",
        "Effets sonores intégrés avec l'API Web Audio et détection de victoire côté client",
      ],
      miniDesc: "Instantané webcam découpé en puzzle interactif sur HTML5 Canvas.",
      statCategory: "Jeu Vision",
    },
  },
  {
    id: "my-plot-twist",
    title: "SYZ — My Plot Twist",
    subtitle: "Interactive Branching Narrative Experience",
    eyebrow: "Interactive Storytelling · 2026",
    category: "web",
    featured: false,
    tags: ["JavaScript", "HTML5", "CSS3", "Audio", "UI/UX"],
    thumbnail: "assets/screenshots/My-Plot-Twist-by-SYZ.webp",
    hero: "assets/screenshots/My-Plot-Twist-by-SYZ.webp",
    image: "assets/screenshots/My-Plot-Twist-by-SYZ.webp",
    imageAlt: "SYZ My Plot Twist branching narrative interface",
    background: "#160f14",
    foreground: "#fff5f7",
    description:
      "An interactive choose-your-own-adventure storytelling experience with dynamic branching narrative trees and browser state saving.",
    problem:
      "Creating interactive digital literature requires maintaining reader choices, chapter progress, and ambient atmosphere across reading sessions.",
    solution:
      "A web-based storytelling platform featuring multiple narrative branching paths, choice-driven progression, atmospheric background audio, and localStorage state persistence.",
    highlights: [
      "Branching decision tree engine with multiple narrative arcs and endings",
      "Local storage state preservation for seamless reading resumption",
      "Ambient background audio and tactile typographic feedback",
      "Responsive layout optimized for both desktop and mobile reading",
    ],
    liveUrl: "https://mohamedaminebenmasseoud.github.io/My-Plot-Twist-by-SYZ/",
    repoUrl: "https://github.com/mohamedaminebenmasseoud/My-Plot-Twist-by-SYZ",
    date: "2026-08",
    accent: "#0e0e0e",
    avatar: "PT",
    statCategory: "Interactive",
    miniDesc: "Branching narrative engine with local state preservation.",
    cardTag: "Interactive Fiction",
    fr: {
      subtitle: "Expérience Narrative Interactive à Choix Multiples",
      eyebrow: "Récit Interactif · 2026",
      description:
        "Une expérience littéraire interactive où vous êtes le héros, dotée d'arbres narratifs à embranchements dynamiques et d'une sauvegarde automatique dans le navigateur.",
      problem:
        "Créer une fiction interactive moderne nécessite de préserver les choix du lecteur, sa progression dans les chapitres et une atmosphère immersive au fil des sessions de lecture.",
      solution:
        "Une plateforme narrative web proposant plusieurs embranchements, une progression guidée par les choix du lecteur, une ambiance sonore immersive et la persistance de l'état via localStorage.",
      highlights: [
        "Moteur d'arbre décisionnel à embranchements avec plusieurs arcs narratifs et fins alternatives",
        "Sauvegarde locale de la progression pour reprendre sa lecture à tout moment",
        "Ambiance sonore immersive et retours typographiques soignés",
        "Mise en page responsive optimisée pour la lecture sur grand écran et smartphone",
      ],
      miniDesc: "Moteur de récit interactif à embranchements avec sauvegarde locale.",
      statCategory: "Interactif",
    },
  },
];

// ──────────────────────────────────────────────
//  Additional Projects (Text-only showcase)
// ──────────────────────────────────────────────
const MORE_PROJECTS = [
  {
    id: "djerba-budget",
    title: "Djerba Budget",
    category: "personal",
    badge: "Personal Project",
    description:
      "Personal web app for budget management (expenses, history, savings goals), responsive design, and local data saving.",
    tags: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    fr: {
      badge: "Projet Personnel",
      description:
        "Application web personnelle de gestion budgétaire (dépenses, historique, objectifs d'épargne), design responsive et sauvegarde locale des données.",
    },
  },
  {
    id: "ecocampus-folkvalley",
    title: "EcoCampus – FolkValley",
    category: "academic",
    badge: "Academic Project",
    description:
      "Academic project: C program to process and analyze consumption data combined with an interactive web dashboard with filters and statistical charts.",
    tags: ["C", "HTML", "CSS", "JavaScript", "JSON", "Chart.js"],
    fr: {
      badge: "Projet Académique",
      description:
        "Projet académique : programme en C de traitement et analyse de données de consommation couplé à un tableau de bord web interactif avec filtres et graphiques statistiques.",
    },
  },
];

/**
 * Returns a project object with localized fields merged in based on the active language.
 * @param {Object} project - The project definition from PROJECTS or MORE_PROJECTS
 * @param {string} [lang] - Language code ('en' or 'fr'); defaults to current document or storage language
 * @returns {Object} Localized project shallow copy
 */
function getLocalizedProject(project, lang) {
  if (!project) return project;
  const currentLang =
    lang ||
    (typeof window !== "undefined" && typeof window.bmsGetLanguage === "function"
      ? window.bmsGetLanguage()
      : (typeof document !== "undefined" && document.documentElement.lang) || "en");

  if (currentLang === "fr" && project.fr) {
    return {
      ...project,
      ...project.fr,
    };
  }
  return project;
}

// Make available to both ES-module and classic script contexts
if (typeof window !== "undefined") {
  window.bmsLocalizeProject = getLocalizedProject;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PROJECTS, MORE_PROJECTS, getLocalizedProject };
}
