# BMS Creations — Portfolio

A high-performance personal portfolio built with pure vanilla **HTML5**, **CSS3**, and **JavaScript** — zero frameworks, no build step, and engineered for fast static hosting on **GitHub Pages**.

---

## 📁 Project Structure

```
my-portfolio/
├── index.html              — Home page (hero, dynamic orbit project stack, skills matrix, gallery)
├── about.html              — Developer bio, technical competencies matrix & timeline
├── projects.html           — All projects portfolio with interactive category filtering
├── contact.html            — Contact info & Web3Forms submission with mailto fallback
├── projects/
│   ├── stageconnect/       — StageConnect ISET showcase detail page
│   ├── enactus-iset/       — Enactus ISET Djerba showcase detail page
│   ├── particle-heart/     — Hand Tracking + 3D Particle System showcase detail page
│   ├── my-plot-twist/      — SYZ — My Plot Twist showcase detail page
│   └── gesture-puzzle/     — Gesture Puzzle: Studio Edition Premium showcase detail page
├── css/
│   ├── style.css           — Global design tokens, typography, glassmorphism & layout utilities
│   └── project.css         — Dedicated project detail showcase styles
├── js/
│   ├── main.js             — Shared navigation, dynamic orbit card deck, contact form & interactions
│   ├── projects.js         — Project grid rendering and multi-category filtering
│   └── project-detail.js   — Dynamic single-project view loader
├── data/
│   └── projects.js         — Single source of truth for all projects
├── assets/
│   ├── logo.png            — BMS Creations logo
│   ├── images/             — Author portraits (`me.jpeg`)
│   └── screenshots/        — High-resolution project captures
└── README.md
```

---

## 🚀 5 Flagship Projects

All project metadata is centralized in [`data/projects.js`](data/projects.js), which dynamically populates both the Home orbit deck and the Projects filter grid:

1. **StageConnect ISET** (`projects/stageconnect/`)
   - *Category:* Web Platform Prototype
   - *Stack:* HTML5, CSS3, JavaScript, LocalStorage, Chart.js, Google Apps Script
   - *Description:* Interactive internship management platform prototype for ISET Djerba students and companies with multi-criteria filtering, simulated dashboards, and Google Sheets integration.

2. **Enactus ISET Djerba** (`projects/enactus-iset/`)
   - *Category:* Community Impact Platform
   - *Stack:* HTML5, CSS3, JavaScript, Social Impact, UI/UX
   - *Description:* Official showcase platform for student-led social entrepreneurship initiatives, before/after project sliders, and animated team cards.

3. **Hand Tracking + 3D Particle System (Pro)** (`projects/particle-heart/`)
   - *Category:* Interactive WebGL & Computer Vision
   - *Stack:* Three.js, MediaPipe Hands, WebGL, WebRTC
   - *Description:* Real-time 3D particle simulation (~18,000 points) responding to webcam hand gestures with dynamic shape morphing (heart, star, sphere).

4. **Gesture Puzzle: Studio Edition Premium** (`projects/gesture-puzzle/`)
   - *Category:* Motion-Controlled Interactive Game
   - *Stack:* JavaScript, HTML5 Canvas, MediaPipe Hands, Web Audio API
   - *Description:* Browser motion puzzle game that slices webcam snapshots into a 3×3 jigsaw with custom bezier tabs, solved via pinch-and-drag gestures.

5. **SYZ — My Plot Twist** (`projects/my-plot-twist/`)
   - *Category:* Interactive Narrative Platform
   - *Stack:* JavaScript, HTML5, CSS3, Web Audio, UI/UX
   - *Description:* Atmospheric choose-your-own-adventure storytelling experience with dynamic decision trees and client-side state persistence.

### Additional Projects
- **Djerba Budget**: Personal web app for budget management (expenses, history, savings goals), responsive, local data saving (*HTML, CSS, JavaScript, LocalStorage*).
- **EcoCampus – FolkValley**: Academic project: C program to process consumption data paired with an interactive web dashboard with filters and statistical charts (*C, HTML, CSS, JavaScript, JSON, Chart.js*).

---

## 🛠️ Architecture & Core Rules

- **Zero Build Tooling:** Pure browser-native HTML, CSS, and ES6 JavaScript. No npm packages, no bundlers, no compilation steps.
- **Single Source of Truth:** Adding, removing, or reordering a project is done exclusively in [`data/projects.js`](data/projects.js). Both the home page orbit stack and the project filter grid update automatically.
- **Accessible & Clean Styles:** All inline `style=""` attributes have been eliminated in favor of clean CSS classes in [`css/style.css`](css/style.css).
- **Contact Form Pipeline:** The contact form on [`contact.html`](contact.html) submits via Web3Forms fetch API with client-side field validation, an anti-spam honeypot field, loading state feedback, and an automated `mailto:` fallback link if network requests fail. Replace `TODO_WEB3FORMS_KEY` with your free access key from [web3forms.com](https://web3forms.com).

---

## 💻 Local Development & Deployment

### Run Locally
Simply open `index.html` in any modern web browser, or launch using VS Code **Live Server**:
```bash
# Or run with any lightweight static server
npx serve .
```

### Deploy to GitHub Pages
1. Push the repository to GitHub.
2. In your GitHub repository, navigate to **Settings** → **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. The portfolio will be live at `https://<username>.github.io/<repo-name>/`.

---

## 📄 License
MIT License © 2026 BMS Creations (Mohamed Amine Ben Masseoud).
