const path = require('path');
const fs = require('fs');

let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch {
  PDFDocument = require(path.resolve(__dirname, '../server/node_modules/pdfkit/js/pdfkit.js'));
}

const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATHS = [
  path.resolve(PROJECT_ROOT, 'client/public/Yehia_Wael_CV.pdf'),
  path.resolve(PROJECT_ROOT, 'client/public/uploads/Yehia_Wael_CV.pdf'),
  path.resolve(PROJECT_ROOT, 'uploads/Yehia_Wael_CV.pdf')
];

// Ensure parent directories exist
OUTPUT_PATHS.forEach(p => {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const photoPath = path.resolve(PROJECT_ROOT, 'uploads/win-20261008-01-29-01-pro-1791412160383-53342.jpg');
const hasPhoto = fs.existsSync(photoPath);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  autoFirstPage: true,
  info: {
    Title: 'Yehia Wael Saad - Curriculum Vitae',
    Author: 'Yehia Wael Saad',
    Subject: 'Senior Full-Stack Engineer & Interactive Systems Architect',
    Keywords: 'Full-Stack, React, Node.js, TypeScript, Go, Distributed Systems'
  }
});

// Pipe to the first file and copy to the others upon completion
const mainStream = fs.createWriteStream(OUTPUT_PATHS[0]);
doc.pipe(mainStream);

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// Colors
const C_DARK_BG = '#090d16';
const C_SIDE_BG = '#f8fafc';
const C_SIDE_BORDER = '#e2e8f0';
const C_ACCENT_CYAN = '#00f5ff';
const C_ACCENT_BLUE = '#0284c7';
const C_ACCENT_GREEN = '#10b981';
const C_TEXT_DARK = '#0f172a';
const C_TEXT_MUTED = '#475569';
const C_TEXT_LIGHT = '#94a3b8';

// ==========================================
// PAGE 1: HEADER + PROFILE + EXPERIENCE + SKILLS
// ==========================================

function drawHeader() {
  const headerHeight = 115;
  // Header background
  doc.rect(0, 0, PAGE_WIDTH, headerHeight).fill(C_DARK_BG);

  // Top cyan-to-emerald accent line
  doc.rect(0, 0, PAGE_WIDTH * 0.65, 3.5).fill(C_ACCENT_CYAN);
  doc.rect(PAGE_WIDTH * 0.65, 0, PAGE_WIDTH * 0.35, 3.5).fill(C_ACCENT_GREEN);

  // Photo circular portrait (left aligned)
  const avatarSize = 78;
  const avatarX = 28;
  const avatarY = 18;

  if (hasPhoto) {
    // Outer glow ring
    doc.save();
    doc.circle(avatarX + avatarSize / 2, avatarY + avatarSize / 2, (avatarSize / 2) + 2)
       .lineWidth(2.5)
       .stroke(C_ACCENT_CYAN);

    // Circular clip for image
    doc.circle(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2)
       .clip();
    doc.image(photoPath, avatarX, avatarY, { width: avatarSize, height: avatarSize });
    doc.restore();
  }

  // Name & Title
  const textX = avatarX + avatarSize + 22;
  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(21)
     .text('YEHIA WAEL SAAD', textX, 22, { characterSpacing: 1 });

  doc.fillColor(C_ACCENT_CYAN)
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text('SENIOR FULL-STACK ENGINEER & INTERACTIVE SYSTEMS ARCHITECT', textX, 47, { characterSpacing: 0.5 });

  // Contact Info Matrix
  const col1X = textX;
  const col2X = textX + 175;
  const contactY = 66;

  doc.font('Helvetica').fontSize(8).fillColor('#cbd5e1');
  doc.text('Email: yehia@wael.dev', col1X, contactY);
  doc.text('Phone: +20 100 156 4709', col1X, contactY + 13);
  doc.text('Location: Cairo, Egypt (Remote)', col1X, contactY + 26);

  doc.text('GitHub: github.com/yehia-wael', col2X, contactY);
  doc.text('LinkedIn: linkedin.com/in/yehia-wael', col2X, contactY + 13);
  doc.text('Portfolio: yehia-wael.dev', col2X, contactY + 26);
}

function drawSidebarBackground(startY, height) {
  doc.rect(0, startY, 185, height).fill(C_SIDE_BG);
  doc.moveTo(185, startY).lineTo(185, startY + height).lineWidth(0.8).stroke(C_SIDE_BORDER);
}

// Draw Page 1 Layout
drawHeader();
drawSidebarBackground(115, PAGE_HEIGHT - 115);

// ------------------------------------------
// LEFT COLUMN (PAGE 1): SKILLS & EXPERTISE
// ------------------------------------------
let sideY = 130;
const sideX = 18;
const sideWidth = 150;

function drawSideSectionHeader(title) {
  doc.rect(sideX, sideY, 3, 12).fill(C_ACCENT_BLUE);
  doc.fillColor(C_TEXT_DARK)
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text(title.toUpperCase(), sideX + 8, sideY + 1, { characterSpacing: 0.5 });
  sideY += 18;
}

drawSideSectionHeader('Core Technical Arsenal');

function drawSkillCategory(category, skills) {
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C_ACCENT_BLUE).text(category, sideX, sideY);
  sideY += 11;
  doc.font('Helvetica').fontSize(7.5).fillColor(C_TEXT_MUTED).text(skills, sideX, sideY, { width: sideWidth, lineGap: 1.5 });
  sideY += doc.heightOfString(skills, { width: sideWidth, lineGap: 1.5 }) + 8;
}

drawSkillCategory('Languages', 'TypeScript, JavaScript (ESNext), Python, Go (Golang), SQL, HTML5/CSS3');
drawSkillCategory('Frontend Architecture', 'React 19, Next.js, Tailwind CSS, Vite, Redux Toolkit, Zustand, Three.js, WebGL, Canvas 2D API');
drawSkillCategory('Backend & Services', 'Node.js, Express, Fastify, Microservices, RESTful APIs, WebSockets, JWT/OAuth2, gRPC');
drawSkillCategory('Databases & Storage', 'PostgreSQL, LibSQL / Turso, SQLite, Redis, MongoDB, Prisma ORM, Query Optimization');
drawSkillCategory('Cloud & DevOps', 'Docker, Kubernetes, AWS, Vercel, CI/CD GitHub Actions, Linux Systems, Nginx');

sideY += 4;
drawSideSectionHeader('Key Competencies');
const competencies = [
  '• Distributed Systems Design',
  '• Real-Time WebSocket Telemetry',
  '• High-Concurrency Architecture',
  '• Interactive WebGL & 3D Shaders',
  '• Database Tuning & Indexing',
  '• Automated CI/CD Pipelines'
];
doc.font('Helvetica').fontSize(7.5).fillColor(C_TEXT_MUTED);
competencies.forEach(comp => {
  doc.text(comp, sideX, sideY);
  sideY += 12;
});

sideY += 6;
drawSideSectionHeader('Languages');
doc.font('Helvetica').fontSize(7.5).fillColor(C_TEXT_MUTED);
doc.text('English: Fluent / Professional (C1)', sideX, sideY);
sideY += 12;
doc.text('Arabic: Native', sideX, sideY);

// ------------------------------------------
// RIGHT COLUMN (PAGE 1): SUMMARY & EXPERIENCE
// ------------------------------------------
let mainY = 130;
const mainX = 205;
const mainWidth = PAGE_WIDTH - mainX - 25;

function drawMainSectionHeader(title) {
  doc.rect(mainX, mainY, 3.5, 13).fill(C_ACCENT_BLUE);
  doc.fillColor(C_TEXT_DARK)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text(title.toUpperCase(), mainX + 9, mainY + 1, { characterSpacing: 0.5 });
  doc.moveTo(mainX, mainY + 16).lineTo(mainX + mainWidth, mainY + 16).lineWidth(0.5).stroke('#cbd5e1');
  mainY += 24;
}

// Executive Summary
drawMainSectionHeader('Executive Summary');
const summaryText =
  'Accomplished Senior Full-Stack Engineer and Systems Architect with over 5+ years of specialized engineering experience forging distributed high-throughput backends, fault-tolerant microservices, and cutting-edge interactive web experiences. Proven track record scaling low-latency API architectures handling 120M+ monthly requests, architecting real-time WebSocket telemetry pipelines, and engineering high-performance WebGL graphics applications.';

doc.font('Helvetica')
   .fontSize(8.5)
   .fillColor(C_TEXT_DARK)
   .text(summaryText, mainX, mainY, { width: mainWidth, align: 'justify', lineGap: 2.5 });
mainY += doc.heightOfString(summaryText, { width: mainWidth, lineGap: 2.5 }) + 16;

// Professional Experience
drawMainSectionHeader('Professional Experience');

function drawExperienceItem(role, company, period, location, bullets, techStack) {
  // Role & Period
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_TEXT_DARK).text(role, mainX, mainY);
  const periodWidth = doc.widthOfString(period);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_ACCENT_BLUE).text(period, mainX + mainWidth - periodWidth, mainY);
  mainY += 12;

  // Company & Location
  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(C_TEXT_MUTED).text(`${company}  |  ${location}`, mainX, mainY);
  mainY += 13;

  // Bullets
  doc.font('Helvetica').fontSize(8).fillColor(C_TEXT_DARK);
  bullets.forEach(b => {
    doc.text(`•  ${b}`, mainX + 4, mainY, { width: mainWidth - 4, lineGap: 2 });
    mainY += doc.heightOfString(`•  ${b}`, { width: mainWidth - 4, lineGap: 2 }) + 4;
  });

  // Technologies Tag
  if (techStack) {
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_ACCENT_BLUE).text('Tech Stack: ', mainX + 4, mainY, { continued: true });
    doc.font('Helvetica').fillColor(C_TEXT_MUTED).text(techStack);
    mainY += 12;
  }
  mainY += 8;
}

drawExperienceItem(
  'Lead Architect & Senior Full-Stack Engineer',
  'Apex Cyber Systems',
  '2023 - Present',
  'Cairo / Remote',
  [
    'Architected and deployed distributed event-driven microservices handling 120M+ monthly transactions with 99.99% system availability.',
    'Engineered real-time bidirectional WebSocket telemetry pipeline with sub-15ms packet latency, reducing data lag by 45%.',
    'Spearheaded database partitioning, indexing strategies, and multi-tier Redis caching, reducing server load by 55%.',
    'Mentored squad of 8 software engineers, instituted code quality gates, automated testing, and zero-downtime CI/CD workflows.'
  ],
  'TypeScript, Node.js, Go, PostgreSQL, Redis, Docker, WebSockets, Tailwind CSS'
);

drawExperienceItem(
  'Senior Full-Stack Engineer',
  'Nexus Interactive',
  '2021 - 2023',
  'Remote Worldwide',
  [
    'Engineered reactive modular web applications and enterprise dashboards using React 19, Next.js, and TypeScript.',
    'Optimized complex SQL and NoSQL aggregation queries, trimming P95 query execution times from 420ms to 85ms.',
    'Implemented 2D/3D procedural WebGL canvas rendering tools for interactive data visualization with 60 FPS performance.'
  ],
  'React, TypeScript, Next.js, Tailwind CSS, Express, MongoDB, WebGL, Jest'
);

// Footer page 1
doc.font('Helvetica').fontSize(7).fillColor(C_TEXT_LIGHT)
   .text('Yehia Wael Saad  •  Curriculum Vitae', 28, PAGE_HEIGHT - 22)
   .text('Page 1 of 2', PAGE_WIDTH - 60, PAGE_HEIGHT - 22);

// ==========================================
// PAGE 2: PROJECTS + EDUCATION + TESTIMONIALS
// ==========================================
doc.addPage();

// Page 2 Mini Header
doc.rect(0, 0, PAGE_WIDTH, 42).fill(C_DARK_BG);
doc.rect(0, 0, PAGE_WIDTH, 2.5).fill(C_ACCENT_CYAN);

doc.fillColor('#ffffff')
   .font('Helvetica-Bold')
   .fontSize(11)
   .text('YEHIA WAEL SAAD', 28, 14, { characterSpacing: 1, continued: true });
doc.font('Helvetica').fontSize(9).fillColor(C_ACCENT_CYAN).text('  |  Curriculum Vitae & Architectural Portfolio');

// Sidebar for Page 2
drawSidebarBackground(42, PAGE_HEIGHT - 42);

// ------------------------------------------
// LEFT COLUMN (PAGE 2): EDUCATION & CERTS
// ------------------------------------------
sideY = 62;
drawSideSectionHeader('Education');

function drawEducationItem(degree, inst, period, grade, details) {
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_TEXT_DARK).text(degree, sideX, sideY, { width: sideWidth });
  sideY += doc.heightOfString(degree, { width: sideWidth }) + 2;

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_ACCENT_BLUE).text(`${inst} (${period})`, sideX, sideY);
  sideY += 10;

  if (grade) {
    doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(C_TEXT_MUTED).text(`Honors: ${grade}`, sideX, sideY);
    sideY += 10;
  }

  if (details) {
    doc.font('Helvetica').fontSize(7).fillColor(C_TEXT_LIGHT).text(details, sideX, sideY, { width: sideWidth, lineGap: 1 });
    sideY += doc.heightOfString(details, { width: sideWidth, lineGap: 1 }) + 8;
  }
}

drawEducationItem(
  'B.Sc. in Computer Science & Software Engineering',
  'Cairo University',
  '2017 - 2021',
  'Excellent / First Class Honors',
  'Focused on Distributed Algorithms, Advanced Operating Systems, Cryptography, and Database Systems Engineering.'
);

drawEducationItem(
  'Advanced Cloud Architecture & Systems Design',
  'Institute of Software Systems',
  '2021 - 2022',
  'Certified Systems Architect',
  'Specialization in high-concurrency microservices, multi-region database failover, and zero-trust security topologies.'
);

sideY += 4;
drawSideSectionHeader('Key Metrics');
const metrics = [
  { label: 'Production Deployments', val: '28+ Systems' },
  { label: 'Industry Experience', val: '5+ Years' },
  { label: 'Uptime Reliability', val: '99.99% SLA' },
  { label: 'Code Quality Benchmark', val: 'A+ / Clean Arch' }
];

metrics.forEach(m => {
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C_TEXT_DARK).text(m.label, sideX, sideY);
  sideY += 10;
  doc.font('Helvetica').fontSize(7.5).fillColor(C_ACCENT_BLUE).text(m.val, sideX, sideY);
  sideY += 12;
});

// ------------------------------------------
// RIGHT COLUMN (PAGE 2): EXPERIENCE CONT + PROJECTS
// ------------------------------------------
mainY = 62;

drawMainSectionHeader('Past Experience (Continued)');
drawExperienceItem(
  'Full-Stack Web & Software Developer',
  'Kinetic Software Labs',
  '2019 - 2021',
  'Cairo, Egypt',
  [
    'Developed and deployed mission-critical RESTful APIs and payment processing integrations for consumer-facing portals.',
    'Engineered client portals with dynamic responsive layouts, cross-browser consistency, and rigorous unit/integration test coverage.'
  ],
  'JavaScript, Node.js, Express, PostgreSQL, Redis, REST APIs, HTML5/CSS3'
);

mainY += 4;
drawMainSectionHeader('Flagship Engineering Projects');

function drawProjectItem(title, category, role, description, techStack, highlights) {
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_TEXT_DARK).text(title, mainX, mainY, { continued: true });
  doc.font('Helvetica').fontSize(8).fillColor(C_ACCENT_BLUE).text(`  [${category}]`);
  mainY += 12;

  doc.font('Helvetica').fontSize(8).fillColor(C_TEXT_DARK).text(description, mainX, mainY, { width: mainWidth, lineGap: 1.5 });
  mainY += doc.heightOfString(description, { width: mainWidth, lineGap: 1.5 }) + 4;

  if (highlights) {
    doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(C_TEXT_MUTED).text(`Key Architecture: ${highlights}`, mainX, mainY, { width: mainWidth });
    mainY += doc.heightOfString(`Key Architecture: ${highlights}`, { width: mainWidth }) + 3;
  }

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_ACCENT_BLUE).text('Technologies: ', mainX, mainY, { continued: true });
  doc.font('Helvetica').fillColor(C_TEXT_MUTED).text(techStack);
  mainY += 15;
}

drawProjectItem(
  'AI Cyber Sentinel',
  'Security & Artificial Intelligence',
  'Lead Engineer',
  'Autonomous neural threat intelligence platform performing real-time packet inspection, automated intrusion detection, and instant threat neutralization telemetry.',
  'React 19, TypeScript, Node.js, TensorFlow, WebSockets, Tailwind CSS',
  'Distributed worker pool processing 25,000 security events per second.'
);

drawProjectItem(
  'Quantum Flow Canvas',
  'Interactive Graphics & 3D WebGL',
  'Creator & Architect',
  'High-performance procedural graphics editor featuring node-based compositing, custom WebGL fragment shader execution, and hardware-accelerated canvas exporting.',
  'TypeScript, HTML5 Canvas, WebGL 2.0, Vite, Tailwind CSS',
  'Sub-16ms render loop maintaining consistent 60 FPS under complex particle simulations.'
);

drawProjectItem(
  'Hyper-Scale FinTech Core',
  'Distributed Ledger & FinTech',
  'Backend Architect',
  'High-concurrency distributed financial transaction ledger engine with ACID guarantees, double-entry bookkeeping, and real-time reconciliation audits.',
  'Go (Golang), Node.js, PostgreSQL, Redis, Docker, Microservices',
  'Benchmarked at 50,000+ financial transactions per second with zero drift.'
);

drawProjectItem(
  'Matrix Game Engine & ECS',
  'Game Tech & Distributed Multi-Player',
  'Lead Developer',
  'Web-based high-concurrency Entity Component System engine for real-time multiplayer simulation with server-authoritative state reconciliation.',
  'TypeScript, WebAssembly, WebSockets, Three.js, Node.js',
  'Client-side prediction and lag compensation for up to 64 concurrent players.'
);

// Footer page 2
doc.font('Helvetica').fontSize(7).fillColor(C_TEXT_LIGHT)
   .text('Yehia Wael Saad  •  Curriculum Vitae', 28, PAGE_HEIGHT - 22)
   .text('Page 2 of 2', PAGE_WIDTH - 60, PAGE_HEIGHT - 22);

// End document
doc.end();

mainStream.on('finish', () => {
  // Copy to remaining output paths
  OUTPUT_PATHS.slice(1).forEach(dest => {
    fs.copyFileSync(OUTPUT_PATHS[0], dest);
  });
  console.log('✅ Generated Professional PDF CV across all target directories:');
  OUTPUT_PATHS.forEach(p => console.log('   ->', p, `(${fs.statSync(p).size} bytes)`));
});
