/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BMS CREATIONS — BILINGUAL AI PORTFOLIO ASSISTANT (CLIENT-SIDE ENGINE)
 * Comprehensive knowledge base & conversational intent matcher for recruiters
 * and visitors across all 9 portfolio pages.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
  "use strict";

  // ── Cloudflare Worker Endpoint for Gemini API Proxy ──
  
  // If empty, unavailable, or times out (8s), silently falls back to client-side engine.
  const WORKER_URL = "https://bms-portfolio-chatbot.bms-creations.workers.dev";

  // ── 1. Relative Path Resolution ──
  const isProjectDetail =
    window.location.pathname.includes("/projects/") ||
    document.querySelector('link[href*="../../css/style.css"]') !== null;
  const basePath = isProjectDetail ? "../../" : "./";

  // ── Safe AI Output Formatter (No raw innerHTML) ──
  function formatAiReply(text) {
    if (!text) return "";
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // Convert markdown links [text](url) into safe, clickable <a> elements
    formatted = formatted.replace(
      /\[([^\]]+)\]\(([^()\s]+(?:\([^()\s]*\)[^()\s]*)*)\)/g,
      (match, label, rawUrl) => {
        const trimmedUrl = (rawUrl || "").trim();

        // Never allow dangerous protocols
        if (/^(?:javascript|data|vbscript|file):/i.test(trimmedUrl)) {
          return label;
        }

        // External URLs must start strictly with https://
        const isExternal = /^https:\/\/[^\s"'<>]+$/i.test(trimmedUrl);

        // Normalize relative paths (strip leading ./ or ../)
        let cleanPath = trimmedUrl;
        if (/^(\.\.\/)+/.test(cleanPath)) {
          cleanPath = cleanPath.replace(/^(\.\.\/)+/, "");
        } else if (/^\.?\//.test(cleanPath)) {
          cleanPath = cleanPath.replace(/^\.?\//, "");
        }

        const isRelative = /^(?:projects\/|contact\.html|about\.html|projects\.html|assets\/|index\.html)/i.test(cleanPath);

        if (isExternal) {
          return `<a href="${trimmedUrl}" target="_blank" rel="noopener noreferrer" class="bms-chat-link" style="color: #0e0e0e; font-weight: 600; text-decoration: underline; text-underline-offset: 2px;">${label}</a>`;
        }

        if (isRelative) {
          const resolvedUrl = `${basePath}${cleanPath}`;
          return `<a href="${resolvedUrl}" class="bms-chat-link" style="color: #0e0e0e; font-weight: 600; text-decoration: underline; text-underline-offset: 2px;">${label}</a>`;
        }

        // Fallback: render label text only if URL is not permitted
        return label;
      }
    );

    return formatted
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  // ── 2. Language Detection & State ──
  function getCurrentLang() {
    if (typeof window.bmsGetLanguage === "function") {
      return window.bmsGetLanguage();
    }
    return document.documentElement.lang === "fr" ? "fr" : "en";
  }

  function normalizeInput(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function detectQuestionLang(text, defaultLang) {
    const frMarkers = [
      "qui", "est", "tu", "vous", "projets", "projet", "stage", "stages",
      "competence", "competences", "technologies", "etudes", "formation",
      "ecole", "universite", "telecharger", "cv", "contacter", "recruter",
      "disponible", "bonjour", "salut", "merci", "comment", "ou", "habite",
      "parcours", "diplome", "langage", "langages", "cyber", "securite",
      "ambition", "but", "carriere", "iset", "bizerte", "djerba", "sfm",
      "fait", "realise", "realisations", "accompli", "accomplissements", "qu", "ce", "il", "son", "ses",
      "plus", "savoir", "developpe", "raconte", "dis", "quelles", "sont", "experiences", "experience",
      "parle", "moi", "de", "que", "sa", "bilan"
    ];
    const enMarkers = [
      "who", "is", "are", "you", "projects", "project", "internship", "intern",
      "skill", "skills", "tech", "stack", "studies", "education", "university",
      "college", "download", "resume", "contact", "hire", "available", "hello",
      "hi", "thanks", "how", "where", "live", "degree", "language", "languages",
      "security", "ambition", "goal", "career", "bms", "sfm",
      "what", "did", "he", "done", "accomplished", "accomplish", "accomplishments", "achievements", "achieved", "so", "far", "his",
      "tell", "more", "details", "elaborate", "explain", "professional", "background", "were", "used", "in", "it",
      "worked", "on", "experience", "built", "work"
    ];

    const words = normalizeInput(text).split(" ");
    let frCount = 0;
    let enCount = 0;

    words.forEach((w) => {
      if (frMarkers.includes(w)) frCount++;
      if (enMarkers.includes(w)) enCount++;
    });

    if (frCount > enCount) return "fr";
    if (enCount > frCount) return "en";
    return defaultLang;
  }

  // ── 3. Authoritative Knowledge Base ──
  const KNOWLEDGE = {
    en: {
      headerTitle: "Amine's Assistant",
      onlineStatus: "Online · Instant Reply",
      placeholder: "Ask about skills, projects, cyber labs, career goals...",
      launcherLabel: "Ask AI",
      clearTooltip: "Clear chat",
      closeTooltip: "Close assistant",
      aiDisclaimer: "AI answers may be inaccurate. Messages are processed by Google Gemini.",
      starterChips: [
        { label: "🚀 Flagship Projects", query: "Tell me about your flagship projects" },
        { label: "🛡️ SFM Cyber Internship", query: "What did you do during your cybersecurity internship at SFM?" },
        { label: "💻 Tech Stack & Tools", query: "What is your core technical stack and skills?" },
        { label: "🎓 Academic & Goals", query: "Tell me about your studies and long-term career ambition" },
        { label: "📄 Download CV", query: "How can I download your CV?" },
        { label: "📬 Contact & Hire", query: "How can I contact or hire Mohamed Amine?" },
      ],
      welcome:
        "Hello! 👋 I'm <strong>Mohamed Amine's portfolio assistant</strong>.<br><br>" +
        "Feel free to ask me anything about his software engineering projects, technical stack, SFM cybersecurity internship, studies at ISET Bizerte / Djerba, or future ambition as an AI Engineer!",
      greetings:
        "Hello! 👋 Glad to connect with you. How can I help you discover Mohamed Amine's software engineering projects, technical stack, or background?",
      thanks:
        "You're very welcome! Let me know if you need any other details about Amine's work or want to get in touch.",
      careerSummary:
        "Mohamed Amine has developed hands-on experience across web development, cybersecurity, entrepreneurship, and interactive technology. Here are his key accomplishments:<br><br>" +
        "<strong>1. Cybersecurity — SFM Technologies</strong><br>" +
        "• Completed a two-month cybersecurity internship (July–August 2026).<br>" +
        "• Administered Active Directory, Windows Server, DNS, DHCP, and GPO policies.<br>" +
        "• Configured SMB network file sharing and monitored security events using Wazuh SIEM.<br>" +
        "• Built a virtualized cybersecurity lab (Windows Server, Ubuntu, Kali Linux).<br><br>" +
        "<strong>2. Leadership — Enactus</strong><br>" +
        "• Progressed from Member to Vice Team Leader and Team Leader at Enactus ISET Djerba.<br>" +
        "• Contributed to Enactus ISET Bizerte.<br>" +
        "• Co-organized entrepreneurial and social-impact events including <strong>NextDjerba</strong> and the <strong>Innovate Tourism in Djerba</strong> hackathon.<br><br>" +
        "<strong>3. Software Development & Interactive Tech</strong><br>" +
        "• Built a flagship portfolio including <strong>StageConnect ISET</strong> (internship management platform prototype), <strong>Enactus ISET Djerba</strong> showcase, <strong>3D Particle Heart</strong> (webcam hand tracking with Three.js & MediaPipe), <strong>Gesture Puzzle: Studio Edition</strong>, and <strong>SYZ — My Plot Twist</strong> (interactive storytelling).<br><br>" +
        "<strong>4. Academic Development & Ambition</strong><br>" +
        "• Second-year Information Systems Development (<strong>DSI2</strong>) student at ISET (Djerba / Bizerte, graduating in 2027).<br>" +
        "• Building strong foundations in software engineering, full-stack web (Vue.js, JS, Python, Java, PHP, SQL), and systems administration.<br>" +
        "• Long-term ambition to become an <strong>AI Engineer</strong>.<br><br>" +
        "<em>Would you like to explore his projects, technical skills, or professional experience?</em>",
      careerSummaryButtons: [
        { text: "🚀 Flagship Projects", url: `${basePath}projects.html`, primary: true },
        { text: "🛡️ SFM Cyber Internship", url: `${basePath}about.html#experience` },
        { text: "💻 Technical Skills", url: `${basePath}about.html#skills` },
        { text: "📄 Download CV", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf" },
        { text: "📬 Contact Directly", url: `${basePath}contact.html` },
      ],
      bio:
        "<strong>Mohamed Amine Ben Masseoud</strong> (preferred name: <em>Amine</em>, brand: <strong>BMS Creations</strong>) is an aspiring Full-Stack Web Developer and Graphic Designer based in <strong>Tunisia (Bizerte / Djerba)</strong>.<br><br>" +
        "• <strong>Academic Status:</strong> Second-year student (DSI2) in Information Systems Development at <strong>ISET Bizerte</strong> (previously ISET Djerba), graduating in <strong>2027</strong>.<br>" +
        "• <strong>Positioning:</strong> Explores web technologies, interface design, cybersecurity, and emerging technologies through academic and independent projects.<br>" +
        "• <strong>Career Ambition:</strong> Long-term aspiration to grow into an <strong>AI Engineer</strong> while cultivating strong foundations in software engineering and web systems.",
      bioButtons: [
        { text: "About Mohamed →", url: `${basePath}about.html`, primary: true },
        { text: "🚀 Flagship Projects", url: `${basePath}projects.html` },
        { text: "📬 Contact Directly", url: `${basePath}contact.html` },
      ],
      skills:
        "Here is Mohamed Amine's declared technical toolkit:<br><br>" +
        "• <strong>Programming Languages:</strong> JavaScript, Python, Java (OOP), PHP, C, SQL, Bash scripting<br>" +
        "• <strong>Web Development:</strong> HTML5, CSS3, JavaScript, <strong>Vue.js</strong>, <strong>Three.js</strong> (3D WebGL), <strong>Chart.js</strong>, Responsive UI, DOM Manipulation<br>" +
        "• <strong>Systems & Cybersecurity:</strong> Linux / Ubuntu, Windows Server, Active Directory, GPO, DNS, DHCP, SMB, <strong>Wazuh SIEM</strong>, Kali Linux, Virtualization (isolated labs)<br>" +
        "• <strong>Tools & Design:</strong> Git, GitHub, Visual Studio Code, XAMPP, <strong>Figma</strong><br>" +
        "• <strong>Foundations:</strong> Data Structures & Algorithms, OOP, Database Design, UML, Networking, XML/XSD<br>" +
        "• <strong>Learning Interests:</strong> Artificial Intelligence, Machine Learning & Big Data",
      skillsButtons: [
        { text: "Detailed Skills Matrix →", url: `${basePath}about.html#skills`, primary: true },
        { text: "🚀 See Projects", url: `${basePath}projects.html` },
      ],
      experience:
        "<strong>Professional & Leadership Experience:</strong><br><br>" +
        "🛡️ <strong>Cybersecurity Intern — SFM Technologies</strong> (July 2026 – August 2026)<br>" +
        "• Configured and administered an Active Directory environment with Organizational Units (OUs), users, and security groups.<br>" +
        "• Implemented centralized Windows management using Group Policy Objects (GPOs).<br>" +
        "• Configured and tested DNS, DHCP services, and SMB network file-sharing.<br>" +
        "• Monitored security events and endpoint visibility with <strong>Wazuh SIEM</strong>.<br>" +
        "• Built an isolated virtualized cyber lab across Windows Server, Windows 10, Ubuntu, and Kali Linux.<br><br>" +
        "🤝 <strong>Enactus Leadership & Entrepreneurship:</strong><br>" +
        "• Progressed through leadership roles at <strong>Enactus ISET Djerba</strong> as Member, Vice Team Leader, and <strong>Team Leader</strong>.<br>" +
        "• Coordinated social impact initiatives, hackathons (NextDjerba, Innovate Tourism in Djerba).<br>" +
        "• Currently involved in developing <strong>Enactus ISET Bizerte</strong>.",
      experienceButtons: [
        { text: "Detailed Experience →", url: `${basePath}about.html#experience`, primary: true },
        { text: "📄 Download CV", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf" },
      ],
      education:
        "<strong>Academic Background:</strong><br><br>" +
        "🎓 <strong>Institut Supérieur des Études Technologiques (ISET)</strong><br>" +
        "• <strong>Current Institution:</strong> ISET Bizerte (previously ISET Djerba)<br>" +
        "• <strong>Current Level:</strong> Second-year student (DSI2)<br>" +
        "• <strong>Specialization:</strong> DSI — Information Systems Development (Développement des Systèmes d'Information)<br>" +
        "• <strong>Expected Graduation:</strong> 2027<br>" +
        "• <strong>Field:</strong> Computer Science, Software Development, Information Systems & Digital Technologies<br><br>" +
        "📜 <strong>Baccalauréat</strong> (2025) — National Diploma, Tunisia.",
      educationButtons: [
        { text: "Academic Milestones →", url: `${basePath}about.html#journey`, primary: true },
        { text: "📄 Download CV", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf" },
      ],
      goals:
        "<strong>Career Direction & Long-Term Ambition:</strong><br><br>" +
        "• <strong>Long-Term Goal:</strong> Grow into an <strong>AI Engineer</strong> while continuing to solidify core engineering and web development foundations.<br>" +
        "• <strong>Key Areas of Focus:</strong> Full-Stack Web Development, Artificial Intelligence & Machine Learning, Big Data & Data Engineering, Interactive Web Technologies, and Cybersecurity & Infrastructure.",
      goalsButtons: [
        { text: "Technical Matrix →", url: `${basePath}about.html#skills`, primary: true },
        { text: "📬 Contact & Collaborate", url: `${basePath}contact.html` },
      ],
      cv:
        "You can download Mohamed Amine's official CV directly in clean PDF format:",
      cvButtons: [
        { text: "📄 Download CV (PDF)", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf", primary: true },
        { text: "📬 Contact Directly", url: `${basePath}contact.html` },
      ],
      contact:
        "Mohamed Amine is based in <strong>Tunisia — Bizerte / Djerba</strong> and is <strong>open for:</strong><br><br>" +
        "• Web development internships<br>" +
        "• Front-End and Full-Stack development opportunities<br>" +
        "• Engineering collaborations & student innovation projects<br>" +
        "• Freelance website development & UI/UX design<br>" +
        "• Creative web development & interactive experiences<br><br>" +
        "Direct contact channels:",
      contactButtons: [
        { text: "✉️ Email Directly", url: "mailto:mohamedaminebenmasseoud63@gmail.com", primary: true },
        { text: "💬 WhatsApp (+216 50 405 554)", url: "https://wa.me/21650405554", external: true },
        { text: "💼 LinkedIn", url: "https://www.linkedin.com/in/mohamed-amine-ben-masseoud-3336a6242/", external: true },
        { text: "🐙 GitHub", url: "https://github.com/mohamedaminebenmasseoud", external: true },
        { text: "📝 Send Message Form", url: `${basePath}contact.html` },
      ],
      projectsSummary:
        "Mohamed Amine has built <strong>5 flagship interactive projects</strong> alongside academic and utility software:<br><br>" +
        "1. <strong>StageConnect ISET</strong> (EdTech / Web App) — Internship management platform prototype.<br>" +
        "2. <strong>Enactus ISET Djerba</strong> (Web / Social Impact) — Digital showcase platform for social entrepreneurship.<br>" +
        "3. <strong>Hand Tracking + 3D Particle System</strong> (Creative Coding) — Webcam hand tracking with real-time Three.js/WebGL 3D particles.<br>" +
        "4. <strong>Gesture Puzzle: Studio Edition</strong> (Computer Vision) — Interactive jigsaw puzzle controlled by webcam gestures.<br>" +
        "5. <strong>SYZ — My Plot Twist</strong> (Interactive Storytelling) — Branching narrative platform driven by user decisions.",
      projectsButtons: [
        { text: "Browse All Projects →", url: `${basePath}projects.html`, primary: true },
      ],
      projectStageconnect:
        "<strong>StageConnect ISET</strong> (EdTech / Web Application)<br>" +
        "<em>Internship Management Platform Prototype</em><br><br>" +
        "• <strong>Core Concept:</strong> Designed to simplify internship-related administrative workflows within the ISET academic environment, connecting students, faculty, and company stakeholders.<br>" +
        "• <strong>Highlights:</strong> Searchable listings, simulated role dashboards, and central information tracking.<br>" +
        "• <strong>Technologies:</strong> Vanilla JavaScript, CSS3 Grid, HTML5, and Google Sheets integration.",
      stageconnectButtons: [
        { text: "View Case Study →", url: `${basePath}projects/stageconnect/index.html`, primary: true },
        { text: "Live Demo ↗", url: "https://mohamedaminebenmasseoud.github.io/StageConnect-ISET/", external: true },
      ],
      projectEnactus:
        "<strong>Enactus ISET Djerba</strong> (Web Development / Social Impact)<br>" +
        "<em>Organizational Showcase Platform</em><br><br>" +
        "• <strong>Core Concept:</strong> A digital showcase representing the Enactus ISET Djerba chapter, its social impact initiatives, student projects, and mission.<br>" +
        "• <strong>Highlights:</strong> Interactive before-and-after comparison sliders, project showcases, and team presentation.<br>" +
        "• <strong>Technologies:</strong> HTML5, CSS3, JavaScript, SVG, and Responsive Mobile UI.",
      enactusButtons: [
        { text: "View Case Study →", url: `${basePath}projects/enactus-iset/index.html`, primary: true },
        { text: "Live Demo ↗", url: "https://enactus-alt.github.io/Enactus-ISET-JB-/#home", external: true },
      ],
      projectParticle:
        "<strong>Hand Tracking + 3D Particle System</strong> (Creative Coding / 3D Web)<br>" +
        "<em>Real-Time Interactive 3D WebGL Simulation</em><br><br>" +
        "• <strong>Core Concept:</strong> Translates webcam-based hand landmarks into interactive controls to manipulate an immersive 3D particle cloud in real time.<br>" +
        "• <strong>Technologies:</strong> Three.js, MediaPipe Hands, WebGL, JavaScript, HTML5, and CSS3.",
      particleButtons: [
        { text: "View Case Study →", url: `${basePath}projects/particle-heart/index.html`, primary: true },
        { text: "Live Demo ↗", url: "https://mohamedaminebenmasseoud.github.io/Particle-Heart/", external: true },
      ],
      projectGesture:
        "<strong>Gesture Puzzle: Studio Edition</strong> (Interactive Web Application / Computer Vision)<br>" +
        "<em>Webcam-Controlled Jigsaw Puzzle</em><br><br>" +
        "• <strong>Core Concept:</strong> Explores natural user interaction beyond mouse and keyboard by allowing players to grab, rotate, and place puzzle pieces using real-time webcam pinch gestures.<br>" +
        "• <strong>Technologies:</strong> Canvas API, MediaPipe Hands, Web Audio API, and JavaScript.",
      gestureButtons: [
        { text: "View Case Study →", url: `${basePath}projects/gesture-puzzle/index.html`, primary: true },
        { text: "Live Demo ↗", url: "https://mohamedaminebenmasseoud.github.io/Gesture-Puzzle/", external: true },
      ],
      projectPlotTwist:
        "<strong>SYZ — My Plot Twist</strong> (Interactive Storytelling / Creative Web)<br>" +
        "<em>Branching Narrative Story Platform</em><br><br>" +
        "• <strong>Core Concept:</strong> An interactive storytelling experience where user decisions steer the plot across multiple possible narrative directions with atmospheric immersion and chapter persistence.<br>" +
        "• <strong>Technologies:</strong> Vanilla JavaScript, Web Audio, CSS3 animations, and localStorage persistence.",
      plotTwistButtons: [
        { text: "View Case Study →", url: `${basePath}projects/my-plot-twist/index.html`, primary: true },
        { text: "Live Demo ↗", url: "https://mohamedaminebenmasseoud.github.io/My-Plot-Twist-by-SYZ/", external: true },
      ],
      projectStageconnectTech:
        "<strong>StageConnect ISET — Technical Architecture & Stack:</strong><br><br>" +
        "• <strong>Front-End Architecture:</strong> Built using clean, modern <strong>Vanilla JavaScript (ES6+)</strong> with modular components, responsive <strong>CSS3 Grid & Flexbox</strong>, and semantic HTML5.<br>" +
        "• <strong>Data Layer:</strong> Integrated with the <strong>Google Sheets API</strong> as a lightweight, real-time cloud data store for internship listing workflows without requiring complex backend servers.<br>" +
        "• <strong>Key Capabilities:</strong> Role-based dashboard interfaces for students and academic supervisors, dynamic listing search, and responsive mobile layout.",
      projectEnactusTech:
        "<strong>Enactus ISET Djerba — Technical Architecture & Stack:</strong><br><br>" +
        "• <strong>Front-End:</strong> Semantic <strong>HTML5</strong>, modern <strong>CSS3</strong> with custom transitions, and vanilla <strong>JavaScript</strong>.<br>" +
        "• <strong>Interactive Highlights:</strong> Custom interactive before-and-after comparison slider built with touch and mouse drag events.<br>" +
        "• <strong>Design:</strong> Fully responsive mobile-first UI with scalable vector graphics (SVG).",
      projectParticleTech:
        "<strong>Hand Tracking + 3D Particle System — Technical Architecture & Stack:</strong><br><br>" +
        "• <strong>3D Graphics:</strong> <strong>Three.js / WebGL</strong> powering thousands of interactive particles with custom shaders and camera controls.<br>" +
        "• <strong>Computer Vision:</strong> <strong>MediaPipe Hands</strong> machine learning model extracting 21 real-time 3D hand landmarks via webcam feed.<br>" +
        "• <strong>Integration:</strong> Real-time mapping of hand gesture distance and rotation to particle velocity and dispersion.",
      projectGestureTech:
        "<strong>Gesture Puzzle: Studio Edition — Technical Architecture & Stack:</strong><br><br>" +
        "• <strong>Computer Vision:</strong> <strong>MediaPipe Hands</strong> running client-side in the browser for dual-hand frame capture and pinch-to-drag recognition.<br>" +
        "• <strong>Rendering:</strong> High-performance HTML5 <strong>Canvas API</strong> with custom bezier-curve piece slicing and snap-into-place mechanics.<br>" +
        "• <strong>Audio & Feedback:</strong> <strong>Web Audio API</strong> for integrated sound effects and client-side win detection.",
      projectPlotTwistTech:
        "<strong>SYZ — My Plot Twist — Technical Architecture & Stack:</strong><br><br>" +
        "• <strong>Core Engine:</strong> Modular <strong>Vanilla JavaScript</strong> branching narrative state machine.<br>" +
        "• <strong>Audio & Immersion:</strong> <strong>Web Audio API</strong> for atmospheric soundtracks and sound effects synced to narrative choices.<br>" +
        "• <strong>Persistence:</strong> Browser <strong>localStorage</strong> saving chapter progress, inventory, and unlocked endings.",
      chipsByIntent: {
        career_summary: [
          { label: "🚀 Flagship Projects", query: "What projects has he worked on?" },
          { label: "🛡️ SFM Cyber Internship", query: "What did you do during your cybersecurity internship at SFM?" },
          { label: "🌱 Enactus Leadership", query: "Tell me about his Enactus leadership" },
          { label: "💻 Tech Stack & Tools", query: "What is your core technical stack and skills?" },
          { label: "📄 Download CV", query: "How can I download your CV?" },
        ],
        specific_project: [
          { label: "⚙️ Tech Stack Used", query: "What technologies were used in it?" },
          { label: "🌐 Live Demo", query: "Can I see the live demo?" },
          { label: "🚀 Other Flagship Projects", query: "What projects has he worked on?" },
          { label: "📬 Contact Directly", query: "How can I contact Mohamed Amine?" },
        ],
        projects: [
          { label: "🎓 StageConnect ISET", query: "Tell me about StageConnect" },
          { label: "❤️ 3D Particle Heart", query: "Tell me about the 3D Particle Heart project" },
          { label: "🧩 Gesture Puzzle", query: "Tell me about Gesture Puzzle" },
          { label: "📖 SYZ Storytelling", query: "Tell me about SYZ My Plot Twist" },
          { label: "🤝 Enactus Showcase", query: "Show me the Enactus website showcase" },
        ],
        experience: [
          { label: "🛡️ SFM Cyber Lab", query: "Tell me about the virtualized cybersecurity lab" },
          { label: "🌱 Enactus Leadership", query: "Tell me about his Enactus leadership" },
          { label: "💻 Technical Skills", query: "What is your core technical stack and skills?" },
          { label: "📄 Download CV", query: "How can I download your CV?" },
        ],
        skills: [
          { label: "🚀 Projects Using These Skills", query: "What projects has he worked on?" },
          { label: "🛡️ Cybersecurity Tools", query: "What tools did you use during the cyber internship?" },
          { label: "🎓 Academic Studies", query: "Where does he study?" },
          { label: "📄 Download CV", query: "How can I download your CV?" },
        ],
        education: [
          { label: "🤖 AI Ambition", query: "Tell me about your AI Engineer ambition" },
          { label: "💻 Technical Skills", query: "What is your core technical stack and skills?" },
          { label: "🛡️ Cybersecurity Internship", query: "What is his experience?" },
          { label: "📄 Download CV", query: "How can I download your CV?" },
        ],
        goals_ai: [
          { label: "💻 Technical Skills", query: "What is your core technical stack and skills?" },
          { label: "🚀 Flagship Projects", query: "What projects has he worked on?" },
          { label: "📬 Contact Directly", query: "How can I contact Mohamed Amine?" },
        ],
        bio: [
          { label: "🏆 Key Accomplishments", query: "What did he do?" },
          { label: "🚀 Flagship Projects", query: "What projects has he worked on?" },
          { label: "🛡️ SFM Internship", query: "What is his experience?" },
          { label: "📄 Download CV", query: "How can I download your CV?" },
        ],
        contact: [
          { label: "📄 Download CV", query: "How can I download your CV?" },
          { label: "🚀 Flagship Projects", query: "What projects has he worked on?" },
          { label: "🛡️ SFM Internship", query: "What is his experience?" },
        ],
        cv: [
          { label: "🚀 Flagship Projects", query: "What projects has he worked on?" },
          { label: "💻 Technical Skills", query: "What is your core technical stack and skills?" },
          { label: "📬 Contact Directly", query: "How can I contact Mohamed Amine?" },
        ],
      },
      fallback:
        "I'm not completely certain about that specific query, but I know everything about Mohamed Amine's background, projects, and skills! Would you like to explore:",
      fallbackChips: [
        { label: "🚀 Flagship Projects", query: "What projects have you built?" },
        { label: "💻 Tech Stack", query: "What is your technical stack?" },
        { label: "🛡️ Cyber Internship", query: "Tell me about your cybersecurity internship" },
        { label: "🎓 Academic & Goals", query: "Tell me about your studies and career goals" },
        { label: "📄 Download CV", query: "How to download CV?" },
        { label: "📬 Contact & Hire", query: "How to contact Mohamed Amine?" },
      ],
    },
    fr: {
      headerTitle: "Assistant d'Amine",
      onlineStatus: "En ligne · Réponse directe",
      placeholder: "Posez une question sur son parcours, projets, compétences, objectifs...",
      launcherLabel: "Assistant IA",
      clearTooltip: "Effacer la discussion",
      closeTooltip: "Fermer l'assistant",
      aiDisclaimer: "Les réponses de l'IA peuvent être imprécises. Messages traités par Google Gemini.",
      starterChips: [
        { label: "🚀 Projets Phares", query: "Quels sont tes projets phares ?" },
        { label: "🛡️ Stage Cyber SFM", query: "Parle-moi de ton stage en cybersécurité chez SFM Technologies" },
        { label: "💻 Compétences & Stack", query: "Quelles sont tes compétences techniques et langages ?" },
        { label: "🎓 Formation & Ambition", query: "Parle-moi de tes études à l'ISET et de tes objectifs de carrière" },
        { label: "📄 Télécharger CV", query: "Comment télécharger le CV de Mohamed Amine ?" },
        { label: "📬 Contact & Dispo", query: "Comment contacter ou recruter Mohamed Amine ?" },
      ],
      welcome:
        "Bonjour ! 👋 Je suis <strong>l'assistant IA du portfolio de Mohamed Amine</strong>.<br><br>" +
        "N'hésitez pas à me poser vos questions sur ses projets logiciels, sa stack technique, son stage en cybersécurité chez SFM, ses études à l'ISET Bizerte / Djerba ou son ambition de devenir ingénieur IA !",
      greetings:
        "Bonjour ! 👋 Ravi de vous accueillir. Comment puis-je vous renseigner sur les projets, les compétences ou le parcours de Mohamed Amine ?",
      thanks:
        "Avec grand plaisir ! N'hésitez pas si vous avez la moindre autre question ou si vous souhaitez le contacter directement.",
      careerSummary:
        "Mohamed Amine a développé une expérience pratique en développement web, cybersécurité, entrepreneuriat et technologies interactives. Voici ses principales réalisations :<br><br>" +
        "<strong>1. Cybersécurité — SFM Technologies</strong><br>" +
        "• Stage pratique de deux mois en cybersécurité (juillet–août 2026).<br>" +
        "• Administration d'Active Directory, Windows Server, DNS, DHCP et stratégies GPO.<br>" +
        "• Configuration des partages réseau SMB et surveillance de sécurité avec Wazuh SIEM.<br>" +
        "• Conception d'un laboratoire de test virtualisé (Windows Server, Ubuntu, Kali Linux).<br><br>" +
        "<strong>2. Leadership — Enactus</strong><br>" +
        "• Évolution de Membre à Vice Team Leader puis Team Leader à Enactus ISET Djerba.<br>" +
        "• Contribution au développement d'Enactus ISET Bizerte.<br>" +
        "• Co-organisation d'événements d'entrepreneuriat social tels que <strong>NextDjerba</strong> et le hackathon <strong>Innovate Tourism in Djerba</strong>.<br><br>" +
        "<strong>3. Développement Logiciel & Tech Interactive</strong><br>" +
        "• Conception d'un portfolio de projets phares incluant <strong>StageConnect ISET</strong> (prototype de gestion des stages), <strong>Enactus ISET Djerba</strong> (vitrine associative), <strong>3D Particle Heart</strong> (suivi de la main par webcam avec Three.js & MediaPipe), <strong>Gesture Puzzle: Studio Edition</strong> et <strong>SYZ — My Plot Twist</strong> (plateforme de narration interactive).<br><br>" +
        "<strong>4. Parcours Académique & Ambition IA</strong><br>" +
        "• Étudiant en deuxième année de Développement des Systèmes d'Information (<strong>DSI2</strong>) à l'ISET (Djerba / Bizerte, diplôme prévu en 2027).<br>" +
        "• Solides bases en génie logiciel, développement web full-stack (Vue.js, JS, Python, Java, PHP, SQL) et administration systèmes.<br>" +
        "• Ambition à long terme d'évoluer vers le métier d'<strong>Ingénieur en Intelligence Artificielle</strong>.<br><br>" +
        "<em>Souhaitez-vous explorer ses projets, ses compétences techniques ou son expérience professionnelle ?</em>",
      careerSummaryButtons: [
        { text: "🚀 Projets Phares", url: `${basePath}projects.html`, primary: true },
        { text: "🛡️ Stage Cyber SFM", url: `${basePath}about.html#experience` },
        { text: "💻 Compétences Techniques", url: `${basePath}about.html#skills` },
        { text: "📄 Télécharger CV", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf" },
        { text: "📬 Me Contacter", url: `${basePath}contact.html` },
      ],
      bio:
        "<strong>Mohamed Amine Ben Masseoud</strong> (nom usuel : <em>Amine</em>, marque : <strong>BMS Creations</strong>) est un futur développeur Full-Stack et designer graphique basé en <strong>Tunisie (Bizerte / Djerba)</strong>.<br><br>" +
        "• <strong>Parcours Académique :</strong> Étudiant en deuxième année (DSI2) en Développement des Systèmes d'Information à <strong>l'ISET Bizerte</strong> (précédemment ISET Djerba), diplôme prévu en <strong>2027</strong>.<br>" +
        "• <strong>Positionnement :</strong> Développe des compétences en développement web, conception d'interfaces, cybersécurité, génie logiciel et technologies émergentes.<br>" +
        "• <strong>Objectif de Carrière :</strong> Son ambition à long terme est d'évoluer vers le métier d'<strong>Ingénieur en Intelligence Artificielle</strong>, tout en consolidant une solide expertise en ingénierie logicielle et développement web.",
      bioButtons: [
        { text: "En savoir plus →", url: `${basePath}about.html`, primary: true },
        { text: "🚀 Projets Phares", url: `${basePath}projects.html` },
        { text: "📬 Me Contacter", url: `${basePath}contact.html` },
      ],
      skills:
        "Voici l'environnement technique déclaré de Mohamed Amine :<br><br>" +
        "• <strong>Langages de programmation :</strong> JavaScript, Python, Java (POO), PHP, C, SQL, scripting Bash sous Linux<br>" +
        "• <strong>Développement Web :</strong> HTML5, CSS3, JavaScript, <strong>Vue.js</strong>, <strong>Three.js</strong> (WebGL 3D), <strong>Chart.js</strong>, UI Responsive, manipulation du DOM<br>" +
        "• <strong>Systèmes & Cybersécurité :</strong> Linux / Ubuntu, Windows Server, Active Directory (OU, utilisateurs, groupes), DNS, DHCP, GPO, partages SMB, <strong>Wazuh SIEM</strong>, Kali Linux, virtualisation (laboratoires isolés)<br>" +
        "• <strong>Outils & Design :</strong> Git, GitHub, Visual Studio Code, XAMPP, <strong>Figma</strong><br>" +
        "• <strong>Fondamentaux :</strong> Algorithmique & structures de données, POO, modélisation UML, conception de bases de données, XML/XSD, réseaux<br>" +
        "• <strong>Centres d'apprentissage :</strong> Intelligence Artificielle, Machine Learning et Big Data",
      skillsButtons: [
        { text: "Matrice technique complète →", url: `${basePath}about.html#skills`, primary: true },
        { text: "🚀 Voir les Projets", url: `${basePath}projects.html` },
      ],
      experience:
        "<strong>Expériences Professionnelles & Leadership :</strong><br><br>" +
        "🛡️ <strong>Stagiaire en Cybersécurité — SFM Technologies</strong> (Juillet 2026 – Août 2026)<br>" +
        "• Installation et administration d'un environnement Active Directory (OU, utilisateurs, groupes de sécurité).<br>" +
        "• Mise en place de stratégies de groupe centralisées (GPO).<br>" +
        "• Configuration et tests des services réseau DNS, DHCP et partages SMB.<br>" +
        "• Surveillance de sécurité et analyse d'événements avec <strong>Wazuh SIEM</strong>.<br>" +
        "• Création et validation d'un laboratoire de test virtualisé (Windows Server, Windows 10, Ubuntu, Kali Linux).<br><br>" +
        "🤝 <strong>Enactus — Leadership & Entrepreneuriat :</strong><br>" +
        "• Évolution au sein d'<strong>Enactus ISET Djerba</strong> comme Membre, Vice Team Leader, puis <strong>Team Leader</strong>.<br>" +
        "• Coordination d'équipe sur des projets d'entrepreneuriat social et organisation d'événements (NextDjerba, Hackathon Innovate Tourism).<br>" +
        "• Engagement actuel au développement et à la structuration d'<strong>Enactus ISET Bizerte</strong>.",
      experienceButtons: [
        { text: "Parcours détaillé →", url: `${basePath}about.html#experience`, primary: true },
        { text: "📄 Télécharger CV", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf" },
      ],
      education:
        "<strong>Formation Académique :</strong><br><br>" +
        "🎓 <strong>Institut Supérieur des Études Technologiques (ISET)</strong><br>" +
        "• <strong>Établissement actuel :</strong> ISET Bizerte (anciennement ISET Djerba)<br>" +
        "• <strong>Niveau actuel :</strong> Deuxième année (DSI2)<br>" +
        "• <strong>Spécialité :</strong> DSI — Développement des Systèmes d'Information<br>" +
        "• <strong>Diplôme prévu :</strong> 2027<br>" +
        "• <strong>Domaine :</strong> Informatique, développement logiciel, systèmes d'information et technologies numériques<br><br>" +
        "📜 <strong>Baccalauréat National</strong> (2025) — Tunisie.",
      educationButtons: [
        { text: "Parcours Académique →", url: `${basePath}about.html#journey`, primary: true },
        { text: "📄 Télécharger CV", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf" },
      ],
      goals:
        "<strong>Objectifs de Carrière & Ambition :</strong><br><br>" +
        "• <strong>Ambition à long terme :</strong> Devenir <strong>Ingénieur en Intelligence Artificielle</strong> tout en développant une solide expertise en ingénierie logicielle et développement web.<br>" +
        "• <strong>Axes d'intérêt clés :</strong> Développement Web Full-Stack, IA & Machine Learning, Big Data & Data Engineering, technologies web interactives, cybersécurité et infrastructure.",
      goalsButtons: [
        { text: "Compétences & Stack →", url: `${basePath}about.html#skills`, primary: true },
        { text: "📬 Collaborer", url: `${basePath}contact.html` },
      ],
      cv:
        "Vous pouvez télécharger le CV officiel de Mohamed Amine directement au format PDF (synthèse de ses compétences, projets et coordonnées) :",
      cvButtons: [
        { text: "📄 Télécharger CV (PDF)", url: `${basePath}assets/cv.pdf`, download: "Mohamed_Amine_Ben_Masseoud_CV.pdf", primary: true },
        { text: "📬 Me Contacter", url: `${basePath}contact.html` },
      ],
      contact:
        "Mohamed Amine est basé en <strong>Tunisie — Bizerte / Djerba</strong> et est <strong>ouvert aux opportunités suivantes :</strong><br><br>" +
        "• Stages en développement web<br>" +
        "• Opportunités en développement Front-End et Full-Stack<br>" +
        "• Collaborations en ingénierie informatique & projets étudiants<br>" +
        "• Missions freelance en création de sites web & design UI/UX<br>" +
        "• Développement d'expériences web interactives<br><br>" +
        "Coordonnées directes :",
      contactButtons: [
        { text: "✉️ Envoyer un Email", url: "mailto:mohamedaminebenmasseoud63@gmail.com", primary: true },
        { text: "💬 WhatsApp (+216 50 405 554)", url: "https://wa.me/21650405554", external: true },
        { text: "💼 Profil LinkedIn", url: "https://www.linkedin.com/in/mohamed-amine-ben-masseoud-3336a6242/", external: true },
        { text: "🐙 GitHub", url: "https://github.com/mohamedaminebenmasseoud", external: true },
        { text: "📝 Formulaire de Contact", url: `${basePath}contact.html` },
      ],
      projectsSummary:
        "Mohamed Amine a conçu <strong>5 projets phares interactifs</strong> ainsi que des expérimentations académiques :<br><br>" +
        "1. <strong>StageConnect ISET</strong> (EdTech / Web) — Prototype de gestion des stages universitaires.<br>" +
        "2. <strong>Enactus ISET Djerba</strong> (Web / Impact Social) — Plateforme vitrine associative avec curseurs avant/après.<br>" +
        "3. <strong>Hand Tracking + 3D Particle System</strong> (Creative Coding) — Suivi de la main par webcam et particules Three.js/WebGL.<br>" +
        "4. <strong>Gesture Puzzle: Studio Edition</strong> (Vision par ordinateur) — Puzzle interactif contrôlé par gestes webcam.<br>" +
        "5. <strong>SYZ — My Plot Twist</strong> (Storytelling Interactif) — Narration interactive à embranchements multiples.",
      projectsButtons: [
        { text: "Explorer tous les projets →", url: `${basePath}projects.html`, primary: true },
      ],
      projectStageconnect:
        "<strong>StageConnect ISET</strong> (EdTech / Application Web)<br>" +
        "<em>Prototype de plateforme de gestion des stages</em><br><br>" +
        "• <strong>Concept :</strong> Faciliter et centraliser les démarches administratives liées aux stages dans l'environnement universitaire de l'ISET pour étudiants et entreprises.<br>" +
        "• <strong>Fonctionnalités :</strong> Recherche d'offres, tableaux de bord interactifs et synchronisation Google Sheets.<br>" +
        "• <strong>Technologies :</strong> Vanilla JS, CSS3 Grid, HTML5, API Google Sheets.",
      stageconnectButtons: [
        { text: "Étude de cas →", url: `${basePath}projects/stageconnect/index.html`, primary: true },
        { text: "Démo en direct ↗", url: "https://mohamedaminebenmasseoud.github.io/StageConnect-ISET/", external: true },
      ],
      projectEnactus:
        "<strong>Enactus ISET Djerba</strong> (Développement Web / Impact Social)<br>" +
        "<em>Plateforme de présentation associative</em><br><br>" +
        "• <strong>Concept :</strong> Présenter l'identité d'Enactus ISET Djerba, ses initiatives durables à fort impact social et son équipe.<br>" +
        "• <strong>Fonctionnalités :</strong> Curseurs avant/après de comparaison d'impact, vitrine des projets et équipe.<br>" +
        "• <strong>Technologies :</strong> HTML5, CSS3, JavaScript, SVG, UI Mobile Responsive.",
      enactusButtons: [
        { text: "Étude de cas →", url: `${basePath}projects/enactus-iset/index.html`, primary: true },
        { text: "Démo en direct ↗", url: "https://enactus-alt.github.io/Enactus-ISET-JB-/#home", external: true },
      ],
      projectParticle:
        "<strong>Hand Tracking + 3D Particle System</strong> (Creative Coding / Web 3D)<br>" +
        "<em>Simulation 3D WebGL interactive en temps réel</em><br><br>" +
        "• <strong>Concept :</strong> Suivi des mouvements de la main par webcam via MediaPipe Hands pour manipuler dynamiquement un système de particules 3D dans le navigateur.<br>" +
        "• <strong>Technologies :</strong> Three.js, MediaPipe Hands, WebGL, JavaScript, HTML5 et CSS3.",
      particleButtons: [
        { text: "Étude de cas →", url: `${basePath}projects/particle-heart/index.html`, primary: true },
        { text: "Démo en direct ↗", url: "https://mohamedaminebenmasseoud.github.io/Particle-Heart/", external: true },
      ],
      projectGesture:
        "<strong>Gesture Puzzle: Studio Edition</strong> (Application Web Interactive / Vision par ordinateur)<br>" +
        "<em>Jeu de puzzle contrôlé par gestes webcam</em><br><br>" +
        "• <strong>Concept :</strong> Interaction naturelle permettant de manipuler, faire pivoter et assembler des pièces de puzzle par pincement de doigts devant la webcam.<br>" +
        "• <strong>Technologies :</strong> Canvas API, MediaPipe Hands, Web Audio API, JavaScript.",
      gestureButtons: [
        { text: "Étude de cas →", url: `${basePath}projects/gesture-puzzle/index.html`, primary: true },
        { text: "Démo en direct ↗", url: "https://mohamedaminebenmasseoud.github.io/Gesture-Puzzle/", external: true },
      ],
      projectPlotTwist:
        "<strong>SYZ — My Plot Twist</strong> (Storytelling Interactif / Développement Créatif)<br>" +
        "<em>Plateforme de narration interactive à embranchements</em><br><br>" +
        "• <strong>Concept :</strong> Récit interactif où les choix de l'utilisateur influencent le déroulement de l'histoire à travers de multiples directions narratives immersives.<br>" +
        "• <strong>Technologies :</strong> Vanilla JavaScript, Web Audio, CSS3 animations, localStorage.",
      plotTwistButtons: [
        { text: "Étude de cas →", url: `${basePath}projects/my-plot-twist/index.html`, primary: true },
        { text: "Démo en direct ↗", url: "https://mohamedaminebenmasseoud.github.io/My-Plot-Twist-by-SYZ/", external: true },
      ],
      projectStageconnectTech:
        "<strong>StageConnect ISET — Architecture Technique & Stack :</strong><br><br>" +
        "• <strong>Architecture Front-End :</strong> Développé en <strong>JavaScript Vanilla moderne (ES6+)</strong> modulaire, avec <strong>CSS3 Grid & Flexbox</strong> responsive et HTML5 sémantique.<br>" +
        "• <strong>Gestion des données :</strong> Intégration de <strong>l'API Google Sheets</strong> comme backend cloud léger en temps réel pour la persistance des offres et candidatures sans serveur lourd.<br>" +
        "• <strong>Fonctionnalités clés :</strong> Tableaux de bord multi-rôles pour étudiants et encadrants universitaires, filtrage dynamique des offres et interface mobile responsive.",
      projectEnactusTech:
        "<strong>Enactus ISET Djerba — Architecture Technique & Stack :</strong><br><br>" +
        "• <strong>Front-End :</strong> <strong>HTML5</strong> sémantique, <strong>CSS3</strong> moderne avec animations fluides et <strong>JavaScript Vanilla</strong>.<br>" +
        "• <strong>Composants interactifs :</strong> Curseur de comparaison avant/après sur mesure compatible tactile et souris.<br>" +
        "• <strong>Conception :</strong> Interface mobile-first entièrement adaptative et graphismes vectoriels (SVG).",
      projectParticleTech:
        "<strong>Hand Tracking + 3D Particle System — Architecture Technique & Stack :</strong><br><br>" +
        "• <strong>Graphismes 3D :</strong> <strong>Three.js / WebGL</strong> animant en temps réel des milliers de particules avec gestion de shaders et de caméra.<br>" +
        "• <strong>Vision par ordinateur :</strong> Modèle d'apprentissage automatique <strong>MediaPipe Hands</strong> détectant 21 repères 3D de la main via la webcam.<br>" +
        "• <strong>Interactivité :</strong> Synchronisation temps réel des coordonnées de la main avec la vélocité et la dispersion des particules.",
      projectGestureTech:
        "<strong>Gesture Puzzle: Studio Edition — Architecture Technique & Stack :</strong><br><br>" +
        "• <strong>Vision par ordinateur :</strong> <strong>MediaPipe Hands</strong> exécuté localement dans le navigateur pour la capture de cadre à deux mains et la détection du pincement-glisser.<br>" +
        "• <strong>Rendu graphique :</strong> API <strong>Canvas HTML5</strong> optimisée avec découpage de pièces à courbes de Bézier et enclenchement interactif.<br>" +
        "• <strong>Audio & Retours :</strong> <strong>Web Audio API</strong> pour les effets sonores intégrés et la validation de victoire côté client.",
      projectPlotTwistTech:
        "<strong>SYZ — My Plot Twist — Architecture Technique & Stack :</strong><br><br>" +
        "• <strong>Moteur narratif :</strong> Machine à états finis modulaire en <strong>JavaScript Vanilla</strong> gérant les embranchements de l'histoire.<br>" +
        "• <strong>Audio & Immersion :</strong> <strong>Web Audio API</strong> pour les ambiances sonores et effets acoustiques réagissant aux choix.<br>" +
        "• <strong>Persistance :</strong> Sauvegarde locale via <strong>localStorage</strong> de la progression, de l'inventaire et des fins débloquées.",
      chipsByIntent: {
        career_summary: [
          { label: "🚀 Projets Phares", query: "Quels sont ses projets phares ?" },
          { label: "🛡️ Stage Cyber SFM", query: "Parle-moi de ton stage en cybersécurité chez SFM Technologies" },
          { label: "🌱 Leadership Enactus", query: "Parle-moi de son expérience à Enactus" },
          { label: "💻 Compétences Techniques", query: "Quelles sont ses compétences techniques ?" },
          { label: "📄 Télécharger CV", query: "Comment télécharger le CV de Mohamed Amine ?" },
        ],
        specific_project: [
          { label: "⚙️ Technologies utilisées", query: "Quelles technologies ont été utilisées ?" },
          { label: "🌐 Démo en direct", query: "Quel est le lien de la démo ?" },
          { label: "🚀 Autres projets phares", query: "Quels sont ses projets phares ?" },
          { label: "📬 Me Contacter", query: "Comment contacter Mohamed Amine ?" },
        ],
        projects: [
          { label: "🎓 StageConnect ISET", query: "Parle-moi de StageConnect" },
          { label: "❤️ Particules 3D & Webcam", query: "Parle-moi du projet Particle Heart" },
          { label: "🧩 Puzzle Gestuel", query: "Parle-moi de Gesture Puzzle" },
          { label: "📖 SYZ Narration Interactive", query: "Parle-moi de SYZ My Plot Twist" },
          { label: "🤝 Vitrine Enactus", query: "Présente-moi le site Enactus ISET Djerba" },
        ],
        experience: [
          { label: "🛡️ Lab Cyber SFM", query: "Parle-moi du laboratoire virtualisé chez SFM" },
          { label: "🌱 Leadership Enactus", query: "Parle-moi de son expérience à Enactus" },
          { label: "💻 Compétences", query: "Quelles sont ses compétences techniques ?" },
          { label: "📄 Télécharger CV", query: "Comment télécharger le CV de Mohamed Amine ?" },
        ],
        skills: [
          { label: "🚀 Projets correspondants", query: "Quels sont ses projets phares ?" },
          { label: "🛡️ Outils de Cybersécurité", query: "Quels outils as-tu utilisés chez SFM ?" },
          { label: "🎓 Formation Académique", query: "Où étudie-t-il ?" },
          { label: "📄 Télécharger CV", query: "Comment télécharger le CV de Mohamed Amine ?" },
        ],
        education: [
          { label: "🤖 Ambition Ingénieur IA", query: "Parle-moi de tes objectifs de carrière" },
          { label: "💻 Compétences Techniques", query: "Quelles sont ses compétences techniques ?" },
          { label: "🛡️ Stage en Cybersécurité", query: "Quelles sont ses expériences ?" },
          { label: "📄 Télécharger CV", query: "Comment télécharger le CV de Mohamed Amine ?" },
        ],
        goals_ai: [
          { label: "💻 Compétences Techniques", query: "Quelles sont ses compétences techniques ?" },
          { label: "🚀 Projets Phares", query: "Quels sont ses projets phares ?" },
          { label: "📬 Me Contacter", query: "Comment contacter Mohamed Amine ?" },
        ],
        bio: [
          { label: "🏆 Réalisations Clés", query: "Qu'est-ce qu'il a réalisé ?" },
          { label: "🚀 Projets Phares", query: "Quels sont ses projets phares ?" },
          { label: "🛡️ Stage SFM", query: "Quelles sont ses expériences ?" },
          { label: "📄 Télécharger CV", query: "Comment télécharger le CV de Mohamed Amine ?" },
        ],
        contact: [
          { label: "📄 Télécharger CV", query: "Comment télécharger le CV de Mohamed Amine ?" },
          { label: "🚀 Projets Phares", query: "Quels sont ses projets phares ?" },
          { label: "🛡️ Stage SFM", query: "Quelles sont ses expériences ?" },
        ],
        cv: [
          { label: "🚀 Projets Phares", query: "Quels sont ses projets phares ?" },
          { label: "💻 Compétences Techniques", query: "Quelles sont ses compétences techniques ?" },
          { label: "📬 Me Contacter", query: "Comment contacter Mohamed Amine ?" },
        ],
      },
      fallback:
        "Je ne suis pas certain de cette information précise, mais je connais tout sur le parcours, les réalisations et les compétences d'Amine ! Souhaitez-vous explorer :",
      fallbackChips: [
        { label: "🚀 Projets Phares", query: "Quels projets as-tu créés ?" },
        { label: "💻 Compétences", query: "Quelles sont tes compétences ?" },
        { label: "🛡️ Stage Cyber SFM", query: "Parle-moi de ton stage chez SFM" },
        { label: "🎓 Formation & Buts", query: "Parle-moi de ta formation et de tes buts" },
        { label: "📄 Télécharger CV", query: "Comment télécharger le CV ?" },
        { label: "📬 Contact & Dispo", query: "Comment contacter Mohamed Amine ?" },
      ],
    },
  };

  // ── 4. Weighted NLU Intent Matcher & Conversational State Engine ──
  function matchIntent(userText, lang, state) {
    const norm = normalizeInput(userText);
    const k = KNOWLEDGE[lang] || KNOWLEDGE.en;
    const tokens = norm.split(" ").filter(Boolean);

    const hasPhrase = (p) => norm.includes(p);
    const hasAnyPhrase = (arr) => arr.some((p) => norm.includes(p));

    // ─────────────────────────────────────────────────────────────
    // A. Multi-Turn Follow-Up Resolution (Contextual Memory)
    // ─────────────────────────────────────────────────────────────
    if (state && state.turnCount > 0) {
      // 1. Follow-ups when previous topic was a specific project
      if (state.lastProject) {
        const isTechQuery =
          hasAnyPhrase([
            "what technologies were used in it", "what technologies did he use",
            "what technologies were used", "what technology was used", "what tech was used",
            "technologies used", "technologies were used", "technology used",
            "tech stack", "what is the tech stack", "technologies", "technology", "stack", "tools used",
            "quelles technologies ont ete utilisees", "quelles technologies", "technologies utilisees",
            "quelle stack", "quels outils", "langages utilises", "stack technique"
          ]) ||
          (tokens.includes("technologies") || tokens.includes("technology") || tokens.includes("stack"));

        if (isTechQuery) {
          const techMap = {
            stageconnect: { text: k.projectStageconnectTech, buttons: k.stageconnectButtons },
            enactus: { text: k.projectEnactusTech, buttons: k.enactusButtons },
            particle: { text: k.projectParticleTech, buttons: k.particleButtons },
            gesture: { text: k.projectGestureTech, buttons: k.gestureButtons },
            plotTwist: { text: k.projectPlotTwistTech, buttons: k.plotTwistButtons },
          };
          const pData = techMap[state.lastProject] || techMap.stageconnect;
          return {
            intent: "specific_project",
            project: state.lastProject,
            text: pData.text,
            buttons: pData.buttons,
            chips: k.chipsByIntent ? k.chipsByIntent.specific_project : null,
          };
        }

        const isDemoQuery =
          hasAnyPhrase(["live demo", "demo", "link", "url", "where to see", "lien", "le lien", "la demo", "voir le site", "visiter"]);
        if (isDemoQuery) {
          const demoMap = {
            stageconnect: { text: k.projectStageconnect, buttons: k.stageconnectButtons },
            enactus: { text: k.projectEnactus, buttons: k.enactusButtons },
            particle: { text: k.projectParticle, buttons: k.particleButtons },
            gesture: { text: k.projectGesture, buttons: k.gestureButtons },
            plotTwist: { text: k.projectPlotTwist, buttons: k.plotTwistButtons },
          };
          const pData = demoMap[state.lastProject] || demoMap.stageconnect;
          return {
            intent: "specific_project",
            project: state.lastProject,
            text: pData.text,
            buttons: pData.buttons,
            chips: k.chipsByIntent ? k.chipsByIntent.specific_project : null,
          };
        }
      }

      // 2. Follow-ups when previous topic was career_summary
      if (state.lastIntent === "career_summary") {
        if (norm === "1" || hasAnyPhrase(["cybersecurity", "cyber", "sfm", "security", "securite", "his experience", "ses experiences", "experience"])) {
          return {
            intent: "experience",
            text: k.experience,
            buttons: k.experienceButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.experience : null,
          };
        }
        if (norm === "2" || hasAnyPhrase(["enactus", "leadership"])) {
          return {
            intent: "experience",
            text: k.experience,
            buttons: k.experienceButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.experience : null,
          };
        }
        if (norm === "3" || hasAnyPhrase(["projects", "software", "projets", "logiciel", "web dev"])) {
          return {
            intent: "projects",
            text: k.projectsSummary,
            buttons: k.projectsButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.projects : null,
          };
        }
        if (norm === "4" || hasAnyPhrase(["academic", "formation", "etudes", "studies", "ai", "ia", "skills", "competences"])) {
          return {
            intent: "education",
            text: k.education,
            buttons: k.educationButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.education : null,
          };
        }
        if (
          hasAnyPhrase([
            "tell me more", "more details", "more", "elaborate", "can you elaborate",
            "en savoir plus", "plus de details", "dis m en plus", "raconte m en plus",
            "and after that", "et apres", "the first one", "le premier"
          ])
        ) {
          return {
            intent: "career_summary",
            text:
              lang === "fr"
                ? "Les réalisations de Mohamed Amine s'articulent autour de 3 piliers majeurs :<br><br>" +
                "1. <strong>Cybersécurité chez SFM Technologies :</strong> Sécurisation Active Directory, GPO, DNS, DHCP, partage SMB et détection d'intrusions Wazuh SIEM dans un laboratoire virtualisé.<br>" +
                "2. <strong>Projets Logiciels Phares :</strong> 3D WebGL interactive (Three.js), reconnaissance gestuelle par webcam (MediaPipe), et prototype EdTech (StageConnect ISET).<br>" +
                "3. <strong>Leadership Associatif chez Enactus :</strong> Progression de Membre à Team Leader, coordination d'événements à fort impact social.<br><br>" +
                "Quel volet souhaiteriez-vous approfondir ?"
                : "Mohamed Amine's accomplishments span 3 major pillars:<br><br>" +
                "1. <strong>Cybersecurity at SFM Technologies:</strong> Practical infrastructure hardening with Active Directory, GPO, DNS, DHCP, SMB, and Wazuh SIEM security telemetry in a virtualized lab.<br>" +
                "2. <strong>Flagship Software Projects:</strong> Real-time 3D WebGL (Three.js), computer vision gesture control (MediaPipe), and EdTech prototype (StageConnect ISET).<br>" +
                "3. <strong>Leadership at Enactus:</strong> Progressed from Member to Vice Team Leader and Team Leader, coordinating social innovation hackathons.<br><br>" +
                "Which area would you like to explore in depth?",
            buttons: k.careerSummaryButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.career_summary : null,
          };
        }
      }

      // 3. Generic follow-up
      const isGenericFollowUp =
        norm === "tell me more" ||
        norm === "more details" ||
        norm === "more info" ||
        norm === "more" ||
        norm === "elaborate" ||
        norm === "en savoir plus" ||
        norm === "plus de details" ||
        norm === "dis m en plus" ||
        norm === "developpe";

      if (isGenericFollowUp) {
        if (state.lastIntent === "skills") {
          return {
            intent: "projects",
            text:
              lang === "fr"
                ? "Ces compétences techniques s'illustrent concrètement à travers ses projets logiciels phares :<br><br>" + k.projectsSummary
                : "These technical skills are applied directly across his interactive software projects:<br><br>" + k.projectsSummary,
            buttons: k.projectsButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.projects : null,
          };
        }
        if (state.lastIntent === "experience") {
          return {
            intent: "experience",
            text: k.experience,
            buttons: k.experienceButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.experience : null,
          };
        }
        if (state.lastIntent === "education") {
          return {
            intent: "goals_ai",
            text: k.goals,
            buttons: k.goalsButtons,
            chips: k.chipsByIntent ? k.chipsByIntent.goals_ai : null,
          };
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // B. Specific Projects (Highest Priority when project name mentioned)
    // ─────────────────────────────────────────────────────────────
    if (hasAnyPhrase(["stageconnect", "stage connect", "stage connect iset"])) {
      return {
        intent: "specific_project",
        project: "stageconnect",
        text: k.projectStageconnect,
        buttons: k.stageconnectButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.specific_project : null,
      };
    }

    if (
      hasPhrase("enactus") &&
      hasAnyPhrase(["site", "website", "showcase", "vitrine", "slider", "curseur", "avant apres", "before after", "projet enactus", "enactus project", "web", "plateforme", "demo"])
    ) {
      return {
        intent: "specific_project",
        project: "enactus",
        text: k.projectEnactus,
        buttons: k.enactusButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.specific_project : null,
      };
    }

    if (hasAnyPhrase(["particle", "particule", "heart", "coeur", "mediapipe", "hand tracking", "suivi de main"])) {
      return {
        intent: "specific_project",
        project: "particle",
        text: k.projectParticle,
        buttons: k.particleButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.specific_project : null,
      };
    }

    if (hasAnyPhrase(["gesture", "puzzle", "geste", "gestuel", "jigsaw"])) {
      return {
        intent: "specific_project",
        project: "gesture",
        text: k.projectGesture,
        buttons: k.gestureButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.specific_project : null,
      };
    }

    if (hasAnyPhrase(["plot twist", "plot", "twist", "syz", "branching", "narration", "storytelling", "histoire interactive"])) {
      return {
        intent: "specific_project",
        project: "plotTwist",
        text: k.projectPlotTwist,
        buttons: k.plotTwistButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.specific_project : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // C. Dedicated career_summary (Achievements & Track Record)
    // ─────────────────────────────────────────────────────────────
    const careerSummaryPhrases = [
      "what did he do", "what has he done", "what does he do", "what has he accomplished",
      "what did he accomplish", "tell me about his achievements", "tell me about achievements",
      "his achievements", "his accomplishments", "achievements", "accomplishments",
      "track record", "his track record", "career summary", "everything he did", "his work",
      "what did amine do", "what has amine done", "what did mohamed do", "what has mohamed done",
      "summary of his work", "done so far", "what has he done so far",
      "what is his professional background", "professional background", "his background", "background",
      "qu est ce qu il a fait", "qu a t il fait", "qu est ce qu il a realise", "qu a t il realise",
      "qu a t il accompli", "ses realisations", "son parcours", "ses accomplissements",
      "que fait il", "parle moi de ses realisations", "resume de son parcours", "son bilan",
      "bilan de son parcours", "ce qu il a fait", "ce qu il a realise", "qu a fait amine",
      "qu a realise amine", "qu a fait mohamed", "qu a realise mohamed", "quelles sont ses realisations",
      "quelles sont ses accomplissements", "parle moi de ce qu il a fait", "parle moi de son parcours"
    ];

    const isCareerSummary =
      hasAnyPhrase(careerSummaryPhrases) ||
      (tokens.includes("what") && (tokens.includes("did") || tokens.includes("done") || tokens.includes("accomplished") || tokens.includes("accomplish")) && (tokens.includes("he") || tokens.includes("amine") || tokens.includes("mohamed"))) ||
      (tokens.includes("realisations") || tokens.includes("accomplissements") || tokens.includes("achievements") || tokens.includes("accomplishments")) ||
      (hasPhrase("background") && (tokens.includes("his") || tokens.includes("amine") || tokens.includes("professional")));

    if (isCareerSummary) {
      return {
        intent: "career_summary",
        text: k.careerSummary,
        buttons: k.careerSummaryButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.career_summary : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // D. Experience & SFM Cyber Internship & Enactus Leadership
    // ─────────────────────────────────────────────────────────────
    const isExperience =
      hasAnyPhrase([
        "what is his experience", "what is your experience", "his experience", "your experience",
        "quelles sont ses experiences", "quelles sont vos experiences", "ses experiences", "vos experiences",
        "experience professionnelle", "parcours professionnel", "professional experience",
        "sfm", "sfm technologies", "cybersecurity internship", "cyber internship", "internship", "intern",
        "stage cyber", "stage en cybersecurite", "stage", "stagiaire",
        "active directory", "wazuh", "siem", "gpo", "dns", "dhcp", "smb", "cyber lab", "cybersecurite", "cybersecurity",
        "enactus leadership", "leadership enactus", "enactus team leader", "team leader", "vice team leader",
        "nextdjerba", "hackathon enactus"
      ]) ||
      (tokens.includes("experience") || tokens.includes("experiences") || tokens.includes("stage") || tokens.includes("sfm") || tokens.includes("wazuh"));

    if (isExperience) {
      return {
        intent: "experience",
        text: k.experience,
        buttons: k.experienceButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.experience : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // E. General Projects (Portfolio overview)
    // ─────────────────────────────────────────────────────────────
    const isProjects =
      hasAnyPhrase([
        "what projects has he worked on", "what projects has he built", "what projects have you built",
        "what are his projects", "projects worked on", "his projects", "flagship projects",
        "projets phares", "ses projets", "quels sont ses projets", "quels projets",
        "qu est ce qu il a construit", "projets", "projects", "portfolio"
      ]) ||
      (tokens.includes("projects") || tokens.includes("projets") || tokens.includes("portfolio") || (tokens.includes("built") && tokens.includes("what")));

    if (isProjects) {
      return {
        intent: "projects",
        text: k.projectsSummary,
        buttons: k.projectsButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.projects : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // F. Skills & Technical Stack
    // ─────────────────────────────────────────────────────────────
    const isSkills =
      hasAnyPhrase([
        "what are your skills", "what are his skills", "technical skills", "technical stack",
        "tech stack", "stack technique", "competences techniques", "competences", "skills", "stack",
        "programming languages", "langages de programmation", "languages", "langages",
        "vue js", "vuejs", "vue", "three js", "threejs", "three", "chart js", "chartjs",
        "python", "java", "php", "javascript", "sql", "bash", "linux", "figma",
        "frontend", "backend", "fullstack", "full stack"
      ]) ||
      (tokens.includes("skill") || tokens.includes("skills") || tokens.includes("competence") || tokens.includes("competences") || tokens.includes("stack"));

    if (isSkills) {
      return {
        intent: "skills",
        text: k.skills,
        buttons: k.skillsButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.skills : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // G. Academic Studies & Education
    // ─────────────────────────────────────────────────────────────
    const isEducation =
      hasAnyPhrase([
        "where does he study", "where did he study", "education", "studies", "study",
        "etudes", "formation", "formation academique", "iset", "iset bizerte", "iset djerba",
        "dsi", "dsi2", "baccalaureat", "bac", "diplome", "degree", "university", "universite", "ecole"
      ]) ||
      (tokens.includes("studies") || tokens.includes("study") || tokens.includes("education") || tokens.includes("etudes") || tokens.includes("formation") || tokens.includes("iset") || tokens.includes("dsi") || tokens.includes("dsi2"));

    if (isEducation) {
      return {
        intent: "education",
        text: k.education,
        buttons: k.educationButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.education : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // H. Career Goals & AI Engineer Ambition
    // ─────────────────────────────────────────────────────────────
    const isGoals =
      hasAnyPhrase([
        "ai engineer", "ingenieur ia", "career goals", "long term ambition", "ambition",
        "objectifs de carriere", "objectifs", "buts", "career objective", "future", "futur"
      ]) ||
      (tokens.includes("ambition") || tokens.includes("goal") || tokens.includes("goals") || tokens.includes("objectifs") || tokens.includes("ia") || tokens.includes("ai"));

    if (isGoals) {
      return {
        intent: "goals_ai",
        text: k.goals,
        buttons: k.goalsButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.goals_ai : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // I. Download CV / Resume
    // ─────────────────────────────────────────────────────────────
    const isCV =
      hasAnyPhrase(["download cv", "download resume", "telecharger cv", "cv", "resume", "pdf", "curriculum vitae", "curriculum"]) ||
      tokens.includes("cv") || tokens.includes("resume");

    if (isCV) {
      return {
        intent: "cv",
        text: k.cv,
        buttons: k.cvButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.cv : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // J. Contact / Hire / Location / Availability
    // ─────────────────────────────────────────────────────────────
    const isContact =
      hasAnyPhrase([
        "contact", "hire", "email", "mail", "phone", "telephone", "whatsapp",
        "available", "availability", "disponible", "disponibilite", "recruter",
        "location", "where does he live", "where are you", "ou habite", "tunisia", "tunisie",
        "freelance", "collaboration", "travailler avec"
      ]) ||
      tokens.includes("contact") || tokens.includes("hire") || tokens.includes("recruter") || tokens.includes("email") || tokens.includes("phone") || tokens.includes("whatsapp");

    if (isContact) {
      return {
        intent: "contact",
        text: k.contact,
        buttons: k.contactButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.contact : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // K. Bio / Identity / Overview
    // ─────────────────────────────────────────────────────────────
    const isBio =
      hasAnyPhrase([
        "who is mohamed amine", "who is amine", "who is he", "who are you",
        "qui est mohamed amine", "qui est amine", "qui est il", "qui es tu",
        "about amine", "about mohamed", "a propos", "presentation", "presente toi",
        "bms", "bms creations", "author", "auteur"
      ]) ||
      (tokens.includes("who") && (tokens.includes("is") || tokens.includes("are"))) ||
      (tokens.includes("qui") && tokens.includes("est"));

    if (isBio) {
      return {
        intent: "bio",
        text: k.bio,
        buttons: k.bioButtons,
        chips: k.chipsByIntent ? k.chipsByIntent.bio : null,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // L. Greetings & Thanks
    // ─────────────────────────────────────────────────────────────
    if (
      norm === "hi" ||
      norm === "hello" ||
      norm === "hey" ||
      norm === "bonjour" ||
      norm === "salut" ||
      norm === "coucou" ||
      norm === "asslema" ||
      norm === "aslema" ||
      norm.startsWith("good morning") ||
      norm.startsWith("good evening")
    ) {
      return {
        intent: "greetings",
        text: k.greetings,
        chips: k.starterChips,
      };
    }

    if (
      norm.includes("thank") ||
      norm.includes("thanks") ||
      norm.includes("merci") ||
      norm.includes("thx")
    ) {
      return {
        intent: "thanks",
        text: k.thanks,
        chips: k.starterChips,
      };
    }

    // Fallback
    return {
      intent: "fallback",
      text: k.fallback,
      chips: k.fallbackChips,
    };
  }

  // ── 5. DOM Widget Initialization ──
  function initWidget() {
    if (document.getElementById("bms-chat-launcher")) return;

    let activeLang = getCurrentLang();
    const avatarSrc = `${basePath}assets/images/me.webp`;

    // 1. Launcher Button
    const launcher = document.createElement("button");
    launcher.id = "bms-chat-launcher";
    launcher.className = "bms-chat-launcher";
    launcher.setAttribute("type", "button");
    launcher.setAttribute("aria-label", "Open Portfolio AI Assistant");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "bms-chat-window");

    launcher.innerHTML = `
      <span class="bms-chat-launcher__status" aria-hidden="true"></span>
      <span class="bms-chat-launcher__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </span>
      <span class="bms-chat-launcher__label" id="bms-launcher-label">${KNOWLEDGE[activeLang].launcherLabel}</span>
    `;

    // 2. Chat Window
    const chatWindow = document.createElement("aside");
    chatWindow.id = "bms-chat-window";
    chatWindow.className = "bms-chat-window";
    chatWindow.setAttribute("aria-label", "AI Assistant Dialog");
    chatWindow.setAttribute("role", "dialog");

    chatWindow.innerHTML = `
      <div class="bms-chat-header">
        <div class="bms-chat-header__profile">
          <div class="bms-chat-header__avatar-wrap">
            <img src="${avatarSrc}" alt="Mohamed Amine" class="bms-chat-header__avatar" />
            <span class="bms-chat-header__online-dot" aria-hidden="true"></span>
          </div>
          <div class="bms-chat-header__info">
            <h3 class="bms-chat-header__title" id="bms-chat-title">${KNOWLEDGE[activeLang].headerTitle}</h3>
            <span class="bms-chat-header__subtitle" id="bms-chat-status">${KNOWLEDGE[activeLang].onlineStatus}</span>
          </div>
        </div>
        <div class="bms-chat-header__controls">
          <button type="button" class="bms-chat-header__btn" id="bms-chat-clear" title="${KNOWLEDGE[activeLang].clearTooltip}" aria-label="${KNOWLEDGE[activeLang].clearTooltip}">
            <svg viewBox="0 0 24 24">
              <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <button type="button" class="bms-chat-header__btn" id="bms-chat-close" title="${KNOWLEDGE[activeLang].closeTooltip}" aria-label="${KNOWLEDGE[activeLang].closeTooltip}">
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="bms-chat-messages" id="bms-chat-messages" role="log" aria-live="polite"></div>

      <div class="bms-chat-chips" id="bms-chat-chips"></div>

      <form class="bms-chat-input-area" id="bms-chat-form">
        <input
          type="text"
          class="bms-chat-input"
          id="bms-chat-input"
          placeholder="${KNOWLEDGE[activeLang].placeholder}"
          aria-label="${KNOWLEDGE[activeLang].placeholder}"
          autocomplete="off"
          maxlength="240"
        />
        <button type="submit" class="bms-chat-send" id="bms-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
      <div class="bms-chat-disclaimer" id="bms-chat-disclaimer">${KNOWLEDGE[activeLang].aiDisclaimer}</div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(chatWindow);

    // References
    const messagesContainer = document.getElementById("bms-chat-messages");
    const chipsContainer = document.getElementById("bms-chat-chips");
    const input = document.getElementById("bms-chat-input");
    const form = document.getElementById("bms-chat-form");
    const clearBtn = document.getElementById("bms-chat-clear");
    const closeBtn = document.getElementById("bms-chat-close");
    const launcherLabel = document.getElementById("bms-launcher-label");
    const chatTitle = document.getElementById("bms-chat-title");
    const chatStatus = document.getElementById("bms-chat-status");
    const disclaimer = document.getElementById("bms-chat-disclaimer");

    // Render Quick Starter Chips
    function renderChips(chipsList) {
      chipsContainer.innerHTML = "";
      if (!chipsList || !chipsList.length) return;
      chipsList.forEach((chip) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bms-chip";
        btn.textContent = chip.label;
        btn.addEventListener("click", () => {
          handleUserSubmit(chip.query);
        });
        chipsContainer.appendChild(btn);
      });
    }

    // Append Message Bubble
    function appendMessage(htmlContent, sender = "bot", buttons = null) {
      const bubble = document.createElement("div");
      bubble.className = `bms-chat-bubble bms-chat-bubble--${sender}`;
      if (sender === "user") {
        bubble.textContent = htmlContent;
      } else {
        bubble.innerHTML = htmlContent;
      }

      if (buttons && buttons.length) {
        const actionsWrap = document.createElement("div");
        actionsWrap.className = "bms-chat-actions";
        buttons.forEach((b) => {
          const a = document.createElement("a");
          a.className = `bms-chat-btn ${b.primary ? "bms-chat-btn--primary" : "bms-chat-btn--secondary"}`;
          a.href = b.url;
          a.textContent = b.text;
          if (b.external) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          if (b.download) {
            a.setAttribute("download", b.download);
          }
          actionsWrap.appendChild(a);
        });
        bubble.appendChild(actionsWrap);
      }

      messagesContainer.appendChild(bubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Typing Indicator
    function showTypingIndicator() {
      const typing = document.createElement("div");
      typing.id = "bms-typing-indicator";
      typing.className = "bms-chat-typing";
      typing.innerHTML = `<span></span><span></span><span></span>`;
      messagesContainer.appendChild(typing);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
      const el = document.getElementById("bms-typing-indicator");
      if (el) el.remove();
    }

    let conversationState = {
      lastIntent: null,
      lastProject: null,
      lastLang: null,
      turnCount: 0,
      history: [],
    };

    // Reset Chat to Default Greeting
    function resetChat() {
      messagesContainer.innerHTML = "";
      conversationState = {
        lastIntent: null,
        lastProject: null,
        lastLang: null,
        turnCount: 0,
        history: [],
      };
      activeLang = getCurrentLang();
      appendMessage(KNOWLEDGE[activeLang].welcome, "bot");
      renderChips(KNOWLEDGE[activeLang].starterChips);
    }

    // Handle User Input Submission
    async function handleUserSubmit(userText) {
      const query = (userText || "").trim();
      if (!query) return;

      appendMessage(query, "user");
      if (input) input.value = "";

      const fallbackLang = conversationState.lastLang || getCurrentLang();
      const qLang = detectQuestionLang(query, fallbackLang);
      conversationState.lastLang = qLang;

      showTypingIndicator();

      // ── Cloudflare Worker + Gemini API Integration ──
      if (WORKER_URL && WORKER_URL.trim()) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const res = await fetch(WORKER_URL.trim(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: query,
              lang: qLang,
              history: conversationState.history || [],
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data && data.reply) {
              hideTypingIndicator();
              conversationState.turnCount++;
              if (!Array.isArray(conversationState.history)) {
                conversationState.history = [];
              }
              conversationState.history.push({ role: "user", content: query });
              conversationState.history.push({ role: "assistant", content: data.reply });
              if (conversationState.history.length > 6) {
                conversationState.history = conversationState.history.slice(-6);
              }

              // Render safely escaped AI response (never raw innerHTML)
              const safeHtml = formatAiReply(data.reply);
              appendMessage(safeHtml, "bot");

              // Determine contextual next chips
              const k = KNOWLEDGE[qLang] || KNOWLEDGE.en;
              const nextChips =
                (k.chipsByIntent && k.chipsByIntent.career_summary) || k.starterChips;
              renderChips(nextChips);
              return;
            }
          }
        } catch (err) {
          clearTimeout(timeoutId);
          console.warn("Worker error or timeout, silently falling back to client-side engine:", err.message);
        }
      }

      // ── Client-Side Intent Engine Fallback ──
      setTimeout(() => {
        hideTypingIndicator();
        conversationState.turnCount++;
        const response = matchIntent(query, qLang, conversationState);
        if (response.intent) {
          conversationState.lastIntent = response.intent;
        }
        if (response.project) {
          conversationState.lastProject = response.project;
        }
        appendMessage(response.text, "bot", response.buttons);
        const nextChips =
          response.chips ||
          (KNOWLEDGE[qLang].chipsByIntent && KNOWLEDGE[qLang].chipsByIntent[response.intent]) ||
          KNOWLEDGE[qLang].starterChips;
        renderChips(nextChips);
      }, 350);
    }

    // Toggle Chat Window Open / Close
    function toggleChat(open) {
      const isOpen = typeof open === "boolean" ? open : !chatWindow.classList.contains("open");
      chatWindow.classList.toggle("open", isOpen);
      launcher.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        if (!messagesContainer.children.length) {
          resetChat();
        }
        setTimeout(() => {
          if (input) input.focus();
        }, 150);
      } else {
        launcher.focus();
      }
    }

    // Update Widget Language on Global Switch
    function updateWidgetLanguage(newLang) {
      activeLang = newLang;
      if (launcherLabel) launcherLabel.textContent = KNOWLEDGE[activeLang].launcherLabel;
      if (chatTitle) chatTitle.textContent = KNOWLEDGE[activeLang].headerTitle;
      if (chatStatus) chatStatus.textContent = KNOWLEDGE[activeLang].onlineStatus;
      if (input) input.setAttribute("placeholder", KNOWLEDGE[activeLang].placeholder);
      if (clearBtn) clearBtn.setAttribute("title", KNOWLEDGE[activeLang].clearTooltip);
      if (closeBtn) closeBtn.setAttribute("title", KNOWLEDGE[activeLang].closeTooltip);
      if (disclaimer) disclaimer.textContent = KNOWLEDGE[activeLang].aiDisclaimer;

      if (messagesContainer.children.length <= 1) {
        resetChat();
      }
    }

    // Event Listeners
    launcher.addEventListener("click", () => toggleChat());
    closeBtn.addEventListener("click", () => toggleChat(false));
    clearBtn.addEventListener("click", () => resetChat());

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUserSubmit(input ? input.value : "");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatWindow.classList.contains("open")) {
        toggleChat(false);
      }
    });

    window.addEventListener("bms:langchange", (e) => {
      const nextLang = (e.detail && e.detail.lang) || getCurrentLang();
      updateWidgetLanguage(nextLang);
    });

    // Initial greeting load
    resetChat();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
