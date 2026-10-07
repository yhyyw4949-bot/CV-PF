import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { DATA_DIR, ADMIN_EMAIL, ADMIN_PASSWORD } from './config.js';

const DB_PATH = path.join(DATA_DIR, 'portfolio.db');
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode & foreign keys for concurrency and performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      tagline TEXT,
      bio TEXT,
      avatar_url TEXT,
      resume_url TEXT,
      email TEXT,
      phone TEXT,
      location TEXT,
      status_text TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      discord_username TEXT,
      steam_url TEXT,
      twitter_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency INTEGER DEFAULT 85,
      icon TEXT,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      location TEXT,
      employment_type TEXT DEFAULT 'Full-time',
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_current INTEGER DEFAULT 0,
      description TEXT NOT NULL,
      technologies TEXT,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      field_of_study TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      grade TEXT,
      description TEXT,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      tagline TEXT,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL,
      image_url TEXT,
      gallery TEXT,
      demo_url TEXT,
      github_url TEXT,
      category TEXT DEFAULT 'Full-Stack',
      is_featured INTEGER DEFAULT 0,
      stars_count INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      icon TEXT,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      tags TEXT,
      read_time TEXT DEFAULT '5 min read',
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      views_count INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      avatar_url TEXT,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      linkedin_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default admin user if none exists
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (!existingUser) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yehia.dev';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, salt);
    
    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(adminEmail, hash);
    console.log(`[DB] Created default admin user: ${adminEmail}`);
  }

  // Seed initial profile data for Yehia Wael if none exists
  const existingProfile = db.prepare('SELECT id FROM profile WHERE id = 1').get();
  if (!existingProfile) {
    db.prepare(`
      INSERT INTO profile (
        id, name, title, tagline, bio, avatar_url, resume_url, 
        email, phone, location, status_text, github_url, 
        linkedin_url, discord_username, steam_url, twitter_url
      ) VALUES (
        1,
        'Yehia Wael',
        'Senior Full-Stack Engineer & Interactive Systems Architect',
        'Forging high-throughput distributed backends, ultra-responsive web interfaces, and real-time graphics engines.',
        'Hello! I am Yehia Wael, a software engineer and passionate builder immersed in modern web architecture, game tech, and systems engineering. With over 5 years of engineering experience, I specialize in crafting ultra-responsive web applications, resilient distributed APIs, and interactive 3D/canvas experiences with a distinct cyber/gamer aesthetic.\n\nWhen I am not optimizing database queries or crafting sleek frontend interfaces, you will find me participating in game jams, exploring graphics shaders, or competing in tactical FPS games.',
        '/uploads/avatar-placeholder.png',
        '/uploads/Yehia_Wael_CV.pdf',
        'yehia@wael.dev',
        '+20 100 123 4567',
        'Cairo, Egypt / Remote Worldwide',
        'ONLINE // AVAILABLE FOR CONTRACT & FULL-TIME ROLES',
        'https://github.com/yehia-wael',
        'https://linkedin.com/in/yehia-wael',
        'yehia.wael#0001',
        'https://steamcommunity.com/id/yehia_gamer',
        'https://x.com/yehia_codes'
      )
    `).run();
    console.log('[DB] Seeded profile for Yehia Wael');
  }

  // Seed stats if none exist
  const existingStats = db.prepare('SELECT COUNT(*) as count FROM stats').get();
  if (!existingStats || existingStats.count === 0) {
    const defaultStats = [
      { label: 'Years of Experience', value: '5+', icon: 'Terminal', order_index: 1 },
      { label: 'Production Projects', value: '28+', icon: 'Cpu', order_index: 2 },
      { label: 'Technologies Mastered', value: '18+', icon: 'Code2', order_index: 3 },
      { label: 'Coffee & Energy Drinks', value: '1,420+', icon: 'Zap', order_index: 4 },
    ];
    const insertStat = db.prepare('INSERT INTO stats (label, value, icon, order_index) VALUES (?, ?, ?, ?)');
    for (const stat of defaultStats) {
      insertStat.run(stat.label, stat.value, stat.icon, stat.order_index);
    }
    console.log('[DB] Seeded stats');
  }

  // Seed skills if none exist
  const existingSkills = db.prepare('SELECT COUNT(*) as count FROM skills').get();
  if (!existingSkills || existingSkills.count === 0) {
    const defaultSkills = [
      // Languages
      { name: 'TypeScript / JavaScript', category: 'Languages', proficiency: 96, icon: 'FileCode', order_index: 1 },
      { name: 'Python', category: 'Languages', proficiency: 88, icon: 'Terminal', order_index: 2 },
      { name: 'C++ / C#', category: 'Languages', proficiency: 82, icon: 'Cpu', order_index: 3 },
      { name: 'SQL & Database Design', category: 'Languages', proficiency: 92, icon: 'Database', order_index: 4 },
      { name: 'Rust', category: 'Languages', proficiency: 75, icon: 'Shield', order_index: 5 },
      
      // Frontend & Engines
      { name: 'React & Next.js', category: 'Frontend & UI', proficiency: 95, icon: 'Layout', order_index: 6 },
      { name: 'Tailwind CSS & Cyber UI', category: 'Frontend & UI', proficiency: 98, icon: 'Palette', order_index: 7 },
      { name: 'Three.js & WebGL', category: 'Frontend & UI', proficiency: 80, icon: 'Box', order_index: 8 },
      { name: 'Unreal Engine 5 & Unity', category: 'Frontend & UI', proficiency: 78, icon: 'Gamepad2', order_index: 9 },

      // Backend & Cloud
      { name: 'Node.js & Express / NestJS', category: 'Backend & Systems', proficiency: 94, icon: 'Server', order_index: 10 },
      { name: 'PostgreSQL, Redis & SQLite', category: 'Backend & Systems', proficiency: 90, icon: 'Database', order_index: 11 },
      { name: 'Docker & Kubernetes', category: 'Backend & Systems', proficiency: 84, icon: 'Container', order_index: 12 },
      { name: 'GraphQL & RESTful APIs', category: 'Backend & Systems', proficiency: 92, icon: 'Network', order_index: 13 },
      { name: 'AWS & Cloudflare Edge', category: 'Backend & Systems', proficiency: 82, icon: 'Cloud', order_index: 14 }
    ];

    const insertSkill = db.prepare('INSERT INTO skills (name, category, proficiency, icon, order_index) VALUES (?, ?, ?, ?, ?)');
    for (const skill of defaultSkills) {
      insertSkill.run(skill.name, skill.category, skill.proficiency, skill.icon, skill.order_index);
    }
    console.log('[DB] Seeded skills');
  }

  // Seed experience if none exists
  const existingExp = db.prepare('SELECT COUNT(*) as count FROM experience').get();
  if (!existingExp || existingExp.count === 0) {
    const defaultExp = [
      {
        company: 'CyberCore Systems',
        role: 'Lead Full-Stack Engineer',
        location: 'Remote',
        employment_type: 'Full-time',
        start_date: '2023 - Present',
        end_date: null,
        is_current: 1,
        description: '• Architected and shipped low-latency telemetry pipelines and real-time gaming analytics dashboards processing 200M+ events/day.\n• Led a squad of 6 engineers migrating monolithic services to event-driven microservices with Redis Streams and Node.js.\n• Implemented dark cyberpunk UI design systems and interactive 60fps canvas visualizers.',
        technologies: '["TypeScript", "React", "Node.js", "Redis", "Docker", "PostgreSQL", "Tailwind CSS"]',
        order_index: 1
      },
      {
        company: 'Nexus Interactive Studios',
        role: 'Full-Stack & Graphics Developer',
        location: 'Hybrid',
        employment_type: 'Full-time',
        start_date: '2021',
        end_date: '2023',
        is_current: 0,
        description: '• Engineered multiplayer lobby matchmakers, real-time WebSocket communication layers, and player leaderboards.\n• Developed WebGL 3D weapon customizers and interactive character showcases using Three.js and React.\n• Reduced server response latency by 42% through query index optimizations and distributed Redis caching.',
        technologies: '["React", "Three.js", "WebSockets", "Node.js", "C#", "Unity", "MongoDB"]',
        order_index: 2
      },
      {
        company: 'Vanguard Tech Solutions',
        role: 'Software Engineer',
        location: 'Cairo, Egypt',
        employment_type: 'Full-time',
        start_date: '2019',
        end_date: '2021',
        is_current: 0,
        description: '• Built customer-facing responsive web platforms and admin portals with role-based access control (RBAC).\n• Engineered scalable REST APIs and automated CI/CD test suites with 90%+ code coverage.\n• Mentored junior developers and conducted rigorous code reviews.',
        technologies: '["JavaScript", "React", "Express", "PostgreSQL", "Jest", "Git"]',
        order_index: 3
      }
    ];

    const insertExp = db.prepare(`
      INSERT INTO experience (company, role, location, employment_type, start_date, end_date, is_current, description, technologies, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const exp of defaultExp) {
      insertExp.run(
        exp.company, exp.role, exp.location, exp.employment_type,
        exp.start_date, exp.end_date, exp.is_current, exp.description,
        exp.technologies, exp.order_index
      );
    }
    console.log('[DB] Seeded experience');
  }

  // Seed education if none exists
  const existingEdu = db.prepare('SELECT COUNT(*) as count FROM education').get();
  if (!existingEdu || existingEdu.count === 0) {
    const defaultEdu = [
      {
        institution: 'Faculty of Computer and Information Sciences',
        degree: 'Bachelor of Science (B.Sc.)',
        field_of_study: 'Computer Science & Software Engineering',
        start_date: '2015',
        end_date: '2019',
        grade: 'Graduated with Honors (Very Good)',
        description: 'Focused on Distributed Systems, Algorithms & Data Structures, Computer Graphics, Operating Systems, and Compiler Design. Completed Capstone Project: Real-time Multi-Agent Simulation Engine.',
        order_index: 1
      },
      {
        institution: 'Professional Game & Cloud Engineering Specialization',
        degree: 'Advanced Certification',
        field_of_study: 'Interactive 3D Graphics & Cloud Architecture',
        start_date: '2020',
        end_date: '2020',
        grade: 'Distinction',
        description: 'Intensive engineering training covering modern shader programming, high-concurrency microservices, and container orchestration.',
        order_index: 2
      }
    ];

    const insertEdu = db.prepare(`
      INSERT INTO education (institution, degree, field_of_study, start_date, end_date, grade, description, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const edu of defaultEdu) {
      insertEdu.run(
        edu.institution, edu.degree, edu.field_of_study,
        edu.start_date, edu.end_date, edu.grade, edu.description, edu.order_index
      );
    }
    console.log('[DB] Seeded education');
  }

  // Seed projects if none exist
  const existingProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (!existingProjects || existingProjects.count === 0) {
    const defaultProjects = [
      {
        title: 'CyberVanguard Arena',
        slug: 'cybervanguard-arena',
        tagline: 'Real-time multiplayer browser battle arena powered by WebGL & WebSockets',
        description: 'A lightning-fast cyber-themed tactical combat experience rendered in real-time WebGL with custom GLSL neon shaders. Includes low-latency server reconciliation, authoritative physics running on Node.js, and ranked competitive matchmaking.',
        technologies: '["WebGL", "Three.js", "TypeScript", "Node.js", "WebSockets", "Redis", "Tailwind CSS"]',
        image_url: '/uploads/project-cybervanguard.jpg',
        gallery: '[]',
        demo_url: 'https://arena.yehia.dev',
        github_url: 'https://github.com/yehia-wael/cybervanguard-arena',
        category: 'Game Dev',
        is_featured: 1,
        stars_count: 342,
        order_index: 1
      },
      {
        title: 'ShadowMesh Cloud Ops HUD',
        slug: 'shadowmesh-cloud-ops',
        tagline: 'Futuristic multi-cluster telemetry and Kubernetes topology visualizer',
        description: 'An operations command center with real-time node mesh health, animated packet routing flows, and automated incident triage. Features military-grade dark HUD graphics with customizable widget docks and terminal diagnostics.',
        technologies: '["React", "Next.js", "Tailwind CSS", "Go", "Docker", "Prometheus", "D3.js"]',
        image_url: '/uploads/project-shadowmesh.jpg',
        gallery: '[]',
        demo_url: 'https://shadowmesh.yehia.dev',
        github_url: 'https://github.com/yehia-wael/shadowmesh-ops',
        category: 'Cloud & Systems',
        is_featured: 1,
        stars_count: 512,
        order_index: 2
      },
      {
        title: 'QuantumForge Synth Audio Workstation',
        slug: 'quantumforge-synth',
        tagline: 'Web Audio API modular synthesizer with cyber-grid sequencers',
        description: 'A browser-based electronic sound design laboratory featuring wavetable synthesis, frequency modulation, and reactive neon spectrum visualizers. Exports lossless WAV audio and integrates MIDI controller hardware natively.',
        technologies: '["Web Audio API", "Canvas", "TypeScript", "React", "Tailwind CSS", "Web Workers"]',
        image_url: '/uploads/project-quantumforge.jpg',
        gallery: '[]',
        demo_url: 'https://quantumforge.yehia.dev',
        github_url: 'https://github.com/yehia-wael/quantumforge-synth',
        category: 'Full-Stack',
        is_featured: 1,
        stars_count: 189,
        order_index: 3
      },
      {
        title: 'RogueTerminal CLI AI Agent',
        slug: 'rogueterminal-cli',
        tagline: 'High-performance interactive developer terminal with autonomous workflow capabilities',
        description: 'An open-source terminal CLI companion engineered for developers, featuring contextual code search, git command synthesis, and hardware-accelerated TUI animations.',
        technologies: '["Rust", "Tokio", "SQLite", "OpenAI API", "Terminal UI"]',
        image_url: '/uploads/project-rogueterminal.jpg',
        gallery: '[]',
        demo_url: 'https://crates.io/crates/rogueterminal',
        github_url: 'https://github.com/yehia-wael/rogueterminal-cli',
        category: 'Tools',
        is_featured: 0,
        stars_count: 420,
        order_index: 4
      },
      {
        title: 'NeuralPulse Health & Telemetry API',
        slug: 'neuralpulse-api',
        tagline: 'Distributed high-availability health checker and anomaly detector',
        description: 'Microservice mesh monitor with sub-millisecond p99 response times. Features automated canary release verification, distributed tracing with OpenTelemetry, and Slack/Discord incident webhooks.',
        technologies: '["Node.js", "TypeScript", "Express", "SQLite", "Redis", "Docker"]',
        image_url: '/uploads/project-neuralpulse.jpg',
        gallery: '[]',
        demo_url: 'https://api.neuralpulse.dev/health',
        github_url: 'https://github.com/yehia-wael/neuralpulse-api',
        category: 'Cloud & Systems',
        is_featured: 0,
        stars_count: 154,
        order_index: 5
      }
    ];

    const insertProject = db.prepare(`
      INSERT INTO projects (title, slug, tagline, description, technologies, image_url, gallery, demo_url, github_url, category, is_featured, stars_count, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of defaultProjects) {
      insertProject.run(
        p.title, p.slug, p.tagline, p.description, p.technologies,
        p.image_url, p.gallery, p.demo_url, p.github_url, p.category,
        p.is_featured, p.stars_count, p.order_index
      );
    }
    console.log('[DB] Seeded projects');
  }

  // Seed articles if none exist
  const existingArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get();
  if (!existingArticles || existingArticles.count === 0) {
    const defaultArticles = [
      {
        title: 'Architecting Real-Time Microservices with Redis Streams & Node.js',
        slug: 'real-time-microservices-redis-streams',
        summary: 'How we engineered a low-latency event-driven telemetry pipeline processing 200M+ events daily with zero backpressure.',
        content: `Modern distributed web platforms demand near-zero latency telemetry without sacrificing reliability. In this architecture review, we dissect our transition from heavyweight message brokers to Redis Streams and Node.js worker pools.\n\n### 1. The Bottleneck: Monolithic Event Ingestion\nOur initial architecture routed all analytics through relational write pipelines. Under peak traffic of 30,000 req/sec, connection pools became saturated.\n\n### 2. Redis Streams as an Authoritative Ingestion Log\nBy introducing Redis Streams consumer groups, worker pods consume append-only logs in batched pipelines. Key benefits:\n- Sub-millisecond write acknowledgement (ACK)\n- Consumer group checkpointing prevents message loss\n- Automatic dead-letter queue routing for corrupted packets\n\n### 3. Takeaways for Production\nWhen architecting microservice event loops, decouple ingestion from long-term persistence. Redis Streams provided the ideal buffer for our multi-region edge nodes.`,
        cover_image: '/uploads/article-redis-streams.jpg',
        tags: '["Distributed Systems", "Node.js", "Redis", "Architecture"]',
        read_time: '6 min read',
        views_count: 840,
        is_published: 1,
        order_index: 1
      },
      {
        title: 'Mastering WebGL Shaders for Modern Cyber & Tech Interfaces',
        slug: 'webgl-shaders-modern-cyber-interfaces',
        summary: 'A deep dive into writing custom GLSL fragment shaders, neon bloom post-processing passes, and 60 FPS canvas performance.',
        content: `Standard DOM manipulation often falls short when crafting futuristic, particle-driven digital HUDs. WebGL and custom GLSL fragment shaders unlock hardware-accelerated graphics directly in the browser.\n\n### 1. Fragment Shaders & The Canvas Pipeline\nFragment shaders compute the color for each pixel in parallel on the GPU. By calculating signed distance functions (SDF) and chromatic aberration, we achieve ultra-sharp neon scanlines with zero CPU overhead.\n\n### 2. Optimizing Mobile GPU Draw Calls\nTo ensure 60fps on mobile devices, we implemented:\n- Uniform buffer caching\n- Resolution downsampling on battery saver mode\n- OffscreenCanvas execution via Web Workers\n\n### 3. Conclusion\nWebGL transforms static web pages into tactile, cinematic software experiences that captivate users and showcase technical depth.`,
        cover_image: '/uploads/article-webgl-shaders.jpg',
        tags: '["WebGL", "Three.js", "GLSL", "Frontend"]',
        read_time: '5 min read',
        views_count: 1250,
        is_published: 1,
        order_index: 2
      },
      {
        title: 'Why Embedded SQLite with WAL Mode is the Future of Edge Architecture',
        slug: 'sqlite-wal-mode-edge-architecture',
        summary: 'Why single-file ACID storage, in-memory caching, and zero-configuration SQLite outperform complex cloud databases for self-hosted platforms.',
        content: `Over-engineering database clusters has become an industry habit. For many modern SaaS tools, personal platforms, and edge compute services, embedded SQLite with Write-Ahead Logging (WAL) is dramatically faster and simpler.\n\n### 1. The WAL Advantage\nIn WAL mode, readers do not block writers, and writers do not block readers. Reads execute via concurrent shared memory lookups with near zero query overhead.\n\n### 2. Simplicity & Backup Ergonomics\nA complete database snapshot is just a single file on disk. Backups, disaster recovery, and staging environment syncs become trivial file operations.\n\n### 3. Summary\nBefore provisioning a multi-node managed database cluster, measure whether an optimized embedded SQLite database with local NVMe storage solves your throughput requirements.`,
        cover_image: '/uploads/article-sqlite-wal.jpg',
        tags: '["Databases", "SQLite", "DevOps", "Backend"]',
        read_time: '4 min read',
        views_count: 610,
        is_published: 1,
        order_index: 3
      }
    ];

    const insertArticle = db.prepare(`
      INSERT INTO articles (title, slug, summary, content, cover_image, tags, read_time, views_count, is_published, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const a of defaultArticles) {
      insertArticle.run(
        a.title, a.slug, a.summary, a.content,
        a.cover_image, a.tags, a.read_time, a.views_count,
        a.is_published, a.order_index
      );
    }
    console.log('[DB] Seeded articles');
  }

  // Seed testimonials if none exist
  const existingTestimonials = db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
  if (!existingTestimonials || existingTestimonials.count === 0) {
    const defaultTestimonials = [
      {
        name: 'Marcus Vance',
        role: 'VP of Engineering',
        company: 'CyberCore Systems',
        avatar_url: '',
        content: 'Yehia is a powerhouse systems engineer. He re-architected our real-time telemetry pipeline, slicing p99 latency by 45% while delivering an exceptionally polished, responsive dashboard interface. His mastery of both low-level backend throughput and modern frontend UI is extraordinary.',
        rating: 5,
        linkedin_url: 'https://linkedin.com',
        order_index: 1
      },
      {
        name: 'Elena Rostova',
        role: 'Product Director',
        company: 'Nexus Interactive Studios',
        avatar_url: '',
        content: 'Rarely do you find an engineer who excels equally at distributed microservices and high-fidelity WebGL graphics. Yehia delivered our multiplayer matchmaker and character viewer ahead of schedule, setting the engineering bar for our entire squad.',
        rating: 5,
        linkedin_url: 'https://linkedin.com',
        order_index: 2
      },
      {
        name: 'David Chen',
        role: 'CTO & Co-Founder',
        company: 'Vanguard Tech Solutions',
        avatar_url: '',
        content: 'Yehia sets the benchmark for engineering discipline. His clean code, robust automated testing, and proactive communication elevated our team velocity from day one. I would gladly collaborate with him on any mission-critical codebase.',
        rating: 5,
        linkedin_url: 'https://linkedin.com',
        order_index: 3
      }
    ];

    const insertTestimonial = db.prepare(`
      INSERT INTO testimonials (name, role, company, avatar_url, content, rating, linkedin_url, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const t of defaultTestimonials) {
      insertTestimonial.run(
        t.name, t.role, t.company, t.avatar_url,
        t.content, t.rating, t.linkedin_url, t.order_index
      );
    }
    console.log('[DB] Seeded testimonials');
  }
}

export default db;
