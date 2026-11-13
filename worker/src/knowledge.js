/**
 * BMS CREATIONS — KNOWLEDGE BASE (SOURCE OF TRUTH)
 * Compact English knowledge base (sections 1-6) grounded in BMS Creations documentation,
 * verified project details from data/projects.js, and academic records from assets/cv.pdf.
 */

export const SOURCE_OF_TRUTH = `
1. PERSONAL & ACADEMIC IDENTITY:
- Full Name: Mohamed Amine Ben Masseoud
- Preferred Name: Amine
- Professional Brand: BMS Creations
- Location: Tunisia — Bizerte / Djerba
- Nationality: Tunisian
- Institution: Institut Supérieur des Études Technologiques (ISET)
- Current Campus: ISET Bizerte
- Previous Campus: ISET Djerba
- Current Level: Second-year student (DSI2)
- Specialization: DSI — Information Systems Development (Développement des Systèmes d'Information)
- Expected Graduation: 2027
- Academic Diploma: National Baccalaureate Diploma (Baccalauréat), 2025
- Academic Field: Computer Science, Software Development, Information Systems & Digital Technologies
- Professional Positioning: Aspiring Full-Stack Web Developer and Graphic Designer building modern, interactive, and practical digital experiences. BMS Creations represents his personal development brand in technology and digital design.
- Professional Interests: Full-Stack Web Development, Front-End & UI/UX Design, Interactive Web Experiences, Creative Coding & 3D Web Technologies, Artificial Intelligence & Machine Learning, Cybersecurity & Systems Administration, Software Engineering.

2. CORE TECHNICAL STACK & SKILLS:
- Programming Languages: JavaScript (ES6+), Python, Java (OOP), PHP, C, SQL, Bash / Shell scripting.
- Web Development: HTML5, CSS3, JavaScript, Vue.js, Three.js (3D WebGL), Chart.js, Responsive UI, DOM Manipulation, LocalStorage, Canvas API, JSON.
- Systems Administration & Cybersecurity: Linux / Ubuntu, Windows Server, Windows 10, Active Directory, DNS, DHCP, Group Policy (GPO), SMB file sharing, Wazuh SIEM, Kali Linux, Virtualization (VirtualBox).
- Development & Design Tools: Git, GitHub, Visual Studio Code, XAMPP, Figma.
- Additional Technical Areas: Data Structures and Algorithms, Object-Oriented Programming, Database Design, UML and Software Modeling, XML/XSD, Networking Fundamentals, Artificial Intelligence and Big Data.
- Spoken Languages: Arabic (Native), French (B1 — Intermediate), English (B1+ — Intermediate).

3. PROFESSIONAL & LEADERSHIP EXPERIENCE:
- Cybersecurity Intern — SFM Technologies (July 2026 – August 2026):
  * Practical cybersecurity internship in enterprise IT environments.
  * Configured and administered an Active Directory environment: managed users, security groups, and Organizational Units (OUs).
  * Implemented and tested Group Policy Objects (GPO), DNS, DHCP services, and SMB network file sharing.
  * Monitored security events and endpoint visibility using Wazuh SIEM.
  * Built and operated a virtualized cybersecurity laboratory across Windows Server, Windows 10, Ubuntu, and Kali Linux environments.
- Enactus — Leadership & Entrepreneurship:
  * Organization: Enactus ISET Djerba.
  * Leadership progression: Member -> Vice Team Leader -> Team Leader.
  * Coordinated student teams on social entrepreneurship and sustainable community projects.
  * Events and initiatives: NextDjerba, Innovate Tourism in Djerba Hackathon, and EduPlay (educational innovation concept for children aged 4 to 10 combining mobile games, AI, and parental dashboard).
  * Current involvement: Enactus ISET Bizerte, contributing to the development and organizational structure of the student club.

4. PROJECTS (VERIFIED DETAILS & CV):
1. StageConnect ISET (Internship Management Platform Prototype · 2026):
   - Description: A static internship management platform prototype for ISET Djerba students and partner companies, featuring internship search, simulated dashboards, and Google Sheets integration.
   - Features: Internship search with live multi-criteria filtering by department, level, duration, and keyword; interactive student and company dashboard simulations with application tracking; public student review system connected to Google Sheets via Google Apps Script Web App; analytics dashboards with interactive statistical charts powered by Chart.js; simulated messaging interface and print-ready PDF internship report templates.
   - Technologies: HTML5, CSS3, JavaScript, LocalStorage, Chart.js, Google Apps Script (Google Sheets API).
   - Live URL: https://mohamedaminebenmasseoud.github.io/StageConnect-ISET/
   - Repo URL: https://github.com/mohamedaminebenmasseoud/StageConnect-ISET
   - Case Study: projects/stageconnect/index.html

2. Enactus ISET Djerba (Showcase Platform · 2026):
   - Description: The official one-page showcase website for the Enactus ISET Djerba chapter, highlighting student-led social entrepreneurship projects, team members, and community initiatives.
   - Features: Hero section with background video integration and responsive call-to-actions; interactive before-and-after comparison sliders showcasing sustainable community projects; custom two-face team member cards with animated CSS clip-path reveal effects; accessible zero-dependency single-page architecture built with vanilla web technologies.
   - Technologies: HTML5, CSS3, JavaScript, UI/UX, Social Impact.
   - Live URL: https://enactus-alt.github.io/Enactus-ISET-JB-/#home
   - Repo URL: https://github.com/enactus-alt/Enactus-ISET-JB-
   - Case Study: projects/enactus-iset/index.html

3. Hand Tracking + 3D Particle System (Pro · 2026):
   - Description: A single-file browser experience that uses MediaPipe Hands for real-time webcam hand tracking and Three.js for an interactive 3D particle simulation.
   - Features: Real-time 21-point hand tracking with MediaPipe Hands via webcam; 3D particle system of ~18,000 points rendered with Three.js and additive blending; finger gesture recognition driving shape morphing between heart, 3D star, and smooth sphere; touchless swirl, rotation, and particle scaling influenced by fingertip position and depth.
   - Technologies: Three.js, MediaPipe Hands, WebGL, JavaScript.
   - Live URL: https://mohamedaminebenmasseoud.github.io/Particle-Heart/
   - Repo URL: https://github.com/mohamedaminebenmasseoud/Particle-Heart
   - Case Study: projects/particle-heart/index.html

4. Gesture Puzzle: Studio Edition Premium (Vision Motion Game · 2026):
   - Description: A browser-based motion game that captures a photo from your webcam using a dual-hand frame, slices it into a 3x3 jigsaw puzzle, and lets you solve it via pinch-and-drag gestures.
   - Features: Two-handed frame detection mode to capture and slice live webcam photos into 3x3 puzzles; custom bezier-curve jigsaw piece generation rendered directly onto HTML5 Canvas; real-time pinch-and-drag gesture detection calculated from thumb-to-index distance; integrated sound effects using Web Audio API and client-side win detection.
   - Technologies: JavaScript, HTML5 Canvas, MediaPipe Hands, Web Audio API.
   - Live URL: https://mohamedaminebenmasseoud.github.io/Gesture-Puzzle/
   - Repo URL: https://github.com/mohamedaminebenmasseoud/Gesture-Puzzle
   - Case Study: projects/gesture-puzzle/index.html

5. SYZ — My Plot Twist (Interactive Storytelling · 2026):
   - Description: An interactive choose-your-own-adventure storytelling experience with dynamic branching narrative trees and browser state saving.
   - Features: Branching decision tree engine with multiple narrative arcs and endings; local storage state preservation for seamless reading resumption; ambient background audio and tactile typographic feedback; responsive layout optimized for desktop and mobile reading.
   - Technologies: JavaScript, HTML5, CSS3, Web Audio API, UI/UX, LocalStorage.
   - Live URL: https://mohamedaminebenmasseoud.github.io/My-Plot-Twist-by-SYZ/
   - Repo URL: https://github.com/mohamedaminebenmasseoud/My-Plot-Twist-by-SYZ
   - Case Study: projects/my-plot-twist/index.html

6. Djerba Budget (Personal Web Application · CV):
   - Description: Conception d'une application web de gestion budgétaire personnelle : dépenses, historique et objectifs d'épargne. Développement d'une interface responsive avec sauvegarde locale des données.
   - Technologies: HTML, CSS, JavaScript, LocalStorage.
   - Note: Application personnelle mentionnée dans le CV ; aucun lien public.

7. EcoCampus – FolkValley (Academic Project · CV):
   - Description: Développement d'un programme en C pour traiter et analyser des données de consommation. Création d'un tableau de bord web interactif avec filtres et visualisations statistiques.
   - Technologies: C, HTML, CSS, JavaScript, JSON, Chart.js.
   - Note: Projet académique mentionné dans le CV ; aucun lien public.

5. AVAILABILITY & CAREER GOALS:
- Professional Availability: Open to web development internships, front-end and full-stack development opportunities, engineering collaborations, freelance website development, UI/UX and interface design projects, creative web development, and student innovation initiatives.
- Career Direction: Developing a career in software engineering with long-term ambition to grow into an AI Engineer while continuing to build strong foundations in software engineering, database systems, and web technologies.

6. CONTACT & PROFESSIONAL LINKS:
- Name: Mohamed Amine Ben Masseoud
- Professional Brand: BMS Creations
- Email: mohamedaminebenmasseoud63@gmail.com
- Phone / WhatsApp: +216 50 405 554
- GitHub: https://github.com/mohamedaminebenmasseoud
- LinkedIn: https://www.linkedin.com/in/mohamed-amine-ben-masseoud-3336a6242/
- Contact Page: contact.html (direct messaging form, email, phone, and social links)
`;
