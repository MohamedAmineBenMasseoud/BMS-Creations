// ──────────────────────────────────────────────
//  Project Data Store
//  Single source of truth for portfolio projects.
//  Accurately documented from project READMEs.
// ──────────────────────────────────────────────

const PROJECTS = [
  {
    id: "stageconnect",
    title: "StageConnect ISET",
    subtitle: "Internship Management Platform Prototype",
    category: "web",
    featured: true,
    tags: ["HTML5", "CSS3", "JavaScript", "LocalStorage", "Chart.js", "Google Apps Script"],
    thumbnail: "assets/screenshots/StageConnect-ISET.webp",
    hero: "assets/screenshots/StageConnect-ISET.webp",
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
    accent: "#6756bd",
    avatar: "SC",
    statCategory: "Web App",
    miniDesc: "Static prototype with simulated dashboards and Google Sheets API.",
    cardTag: "JS · Sheets · Chart.js",
  },
  {
    id: "enactus-iset",
    title: "Enactus ISET Djerba",
    subtitle: "Future Makers — Chapter Showcase Platform",
    category: "web",
    featured: true,
    tags: ["HTML5", "CSS3", "JavaScript", "UI/UX", "Social Impact"],
    thumbnail: "assets/screenshots/enactusIsetDjerba.webp",
    hero: "assets/screenshots/enactusIsetDjerba.webp",
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
    accent: "#41674e",
    avatar: "EI",
    statCategory: "Community",
    miniDesc: "Showcase platform with video hero, comparison sliders, and team cards.",
    cardTag: "Vanilla JS · Video · UI",
  },
  {
    id: "particle-heart",
    title: "Hand Tracking + 3D Particle System (Pro)",
    subtitle: "Hand Tracking & 3D Particle System",
    category: "interactive",
    featured: true,
    tags: ["Three.js", "MediaPipe", "WebGL", "JavaScript"],
    thumbnail: "assets/screenshots/Particle-Heart.webp",
    hero: "assets/screenshots/Particle-Heart.webp",
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
    accent: "#e67e22",
    avatar: "PH",
    statCategory: "Vision · 3D",
    miniDesc: "18,000 WebGL particles morphing via MediaPipe hand tracking.",
    cardTag: "MediaPipe · Three.js",
  },
  {
    id: "gesture-puzzle",
    title: "Gesture Puzzle: Studio Edition Premium",
    subtitle: "Webcam Motion-Controlled Jigsaw Puzzle",
    category: "interactive",
    featured: false,
    tags: ["JavaScript", "HTML5 Canvas", "MediaPipe", "Web Audio API"],
    thumbnail: "assets/screenshots/Gesture-Puzzle.webp",
    hero: "assets/screenshots/Gesture-Puzzle.webp",
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
    accent: "#2980b9",
    avatar: "GP",
    statCategory: "Vision Game",
    miniDesc: "Webcam snapshot sliced into interactive canvas jigsaw puzzle.",
    cardTag: "Canvas · MediaPipe · Audio",
  },
  {
    id: "my-plot-twist",
    title: "SYZ — My Plot Twist",
    subtitle: "Interactive Branching Narrative Experience",
    category: "web",
    featured: false,
    tags: ["JavaScript", "HTML5", "CSS3", "Audio", "UI/UX"],
    thumbnail: "assets/screenshots/My-Plot-Twist-by-SYZ.webp",
    hero: "assets/screenshots/My-Plot-Twist-by-SYZ.webp",
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
    accent: "#dd2727",
    avatar: "PT",
    statCategory: "Interactive",
    miniDesc: "Branching narrative engine with local state preservation.",
    cardTag: "Interactive Fiction",
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
  },
  {
    id: "ecocampus-folkvalley",
    title: "EcoCampus – FolkValley",
    category: "academic",
    badge: "Academic Project",
    description:
      "Academic project: C program to process and analyze consumption data combined with an interactive web dashboard with filters and statistical charts.",
    tags: ["C", "HTML", "CSS", "JavaScript", "JSON", "Chart.js"],
  },
];

// Make available to both ES-module and classic script contexts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PROJECTS, MORE_PROJECTS };
}
