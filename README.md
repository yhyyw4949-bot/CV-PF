# ⚡ Yehia Wael — Full-Stack Developer & Systems Architect Portfolio with Admin Suite

A complete, modern personal CV and portfolio web application built for **Yehia Wael**, featuring a high-precision **dark tech / cyber HUD software engineering aesthetic** (modern clean web dev identity, not gaming/esports), responsive for mobile and desktop, with an authenticated **Admin Command Center** backed by a **persistent SQLite database** and **persistent file storage**.

---

## 🚀 Newly Developed Features & Architecture

### 1. ⌨️ Interactive Developer CLI Terminal (Bash-like Shell)
- **Launch via**: Click `[ CLI ]` in the top navigation bar or press the backtick (`` ` ``) key from anywhere on the page.
- **Built-in Commands**:
  - `help`: Lists all available terminal commands.
  - `bio`: Prints operative background and core specialization.
  - `skills`: Displays categorized breakdown of languages, frameworks, and engines.
  - `projects`: Lists all deployed protocols with direct links.
  - `articles`: Prints published technical articles and read times.
  - `contact`: Shows contact channels, email address, and location.
  - `socials`: Quick links to GitHub, LinkedIn, Twitter, Discord.
  - `resume`: Downloads or opens the persistent PDF resume.
  - `sudo`: Secret easter egg command granting administrative matrix access.
  - `clear`: Clears the terminal screen buffer.
- **Features**: Command history traversal (Up/Down arrow keys), tab completion cues, auto-scroll, sound feedback, and maximize/restore window modes.

### 2. 🔍 Global Command Palette (`Ctrl+K` / `⌘K`)
- **Launch via**: Press `Ctrl+K` (or `Cmd+K` on Mac), or click the Search button in the navbar.
- **Capabilities**:
  - Fuzzy searches across all sections, protocols, articles, skills, and admin actions.
  - Real-time categorized results: **Navigation**, **Projects**, **Actions**, and **Tools**.
  - Arrow key navigation (`↑` / `↓`) and `Enter` execution.
  - Direct project preview modals triggered straight from search results.

### 3. 🔊 Web Audio Synthesizer (Cyber Audio FX)
- Zero external audio files required — synthesized in real-time using browser native **Web Audio API** oscillators (`sine`, `triangle`) and exponential decay filters.
- Subtle UI feedback: Blips on hover, click frequencies, modal chimes, terminal keypresses, and transmission sounds.
- **Mute Toggle**: Persistent audio mute switch in the navbar with state saved in `localStorage`.

### 4. 📂 Advanced Project Search, Tag Filtering & Sorting
- Real-time text search filter matching title, description, elevator pitch, or tech stack tags.
- Category pills (`ALL`, `Full-Stack`, `Game Dev`, `Cloud & Systems`, `Tools`, `AI & Robotics`).
- Multi-criteria sorting:
  - **Featured Protocols First**
  - **Most Starred**
  - **Newest Deployed**
- Deep-dive architectural inspection modal with tech chips, live links, and GitHub repo buttons.

### 5. ✍️ Technical Articles & Engineering Blog Section
- Public blog listing technical architectural deep-dives, distributed systems notes, and WebGL case studies.
- Interactive reader modal (`ArticleModal`) with clean typography, code block styling, and tag chips.
- Automatic view counter telemetry (`POST /api/public/articles/:id/view`) incremented when visitors read an article.

### 6. ⭐ Verified Peer Recommendations & Testimonials
- Testimonial grid highlighting endorsements from engineering leads, managers, and clients.
- 5-star rating representations, author avatars, and company affiliations.

### 7. 🛡️ Complete Admin Dashboard Matrix
- **HUD Overview**: Real-time counter metrics for Projects, Skills, Articles, Testimonials, Experience, and Inquiries.
- **Profile & Bio Management**: Full control over title, tagline, bio paragraphs, social handles, and avatar image.
- **Articles CRUD**: Create, edit, publish/draft, and delete technical articles with tags, markdown content, and estimated read times.
- **Testimonials CRUD**: Add, edit, and reorder verified client endorsements.
- **Projects & Skills CRUD**: Full management of all portfolio assets.
- **File & Image Uploading**: Built-in `/api/upload` endpoint supporting images and PDF resumes up to 15MB.
- **Inquiry Transmissions**: Review incoming contact form submissions, toggle read status, and dispatch mailto responses.
- **Data Persistence Snapshot**: One-click **JSON Database Export** button under the `CREDENTIALS` tab allowing instant backups of all portfolio tables.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | Blazing fast HMR, strict type safety, zero runtime overhead. |
| **Styling** | Tailwind CSS v4 + Obsidian Theme | Deep dark tech theme (`#06070a`), neon cyan/emerald/purple accents, and custom glassmorphism. |
| **Audio** | Native HTML5 Web Audio API | Zero asset bandwidth, instant parametric sound generation. |
| **Icons** | Lucide React + Custom Tech SVGs | Modern vector icons and custom SVG monograms. |
| **Backend** | Node.js (v24 native) + Express | REST API, static asset server, and secure file uploader. |
| **Database** | Node SQLite (`node:sqlite DatabaseSync`) | Native C-level SQLite engine built into Node, zero npm compilation dependencies, file-backed in `data/portfolio.db`. |
| **File Storage** | Multer (`uploads/`) | Persistent storage for avatars, project screenshots, and PDF resumes. |
| **Security** | `bcryptjs` + `jsonwebtoken` + `cookie-parser` | Industry-standard password hashing and secure token validation. |

---

## 📁 Directory Structure

```
yehia-portfolio/
├── client/                     # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminLogin, AdminDashboard, FileUpload
│   │   │   ├── AboutTerminal.tsx
│   │   │   ├── ArticleModal.tsx
│   │   │   ├── ArticlesSection.tsx
│   │   │   ├── CommandPalette.tsx     # Ctrl+K fuzzy search modal
│   │   │   ├── ContactSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Icons.tsx
│   │   │   ├── Logo.tsx               # Geometric "YW" Web Dev monogram
│   │   │   ├── Navbar.tsx             # HUD navigation with audio toggle & CLI launcher
│   │   │   ├── ProjectModal.tsx
│   │   │   ├── ProjectsSection.tsx    # Search, sort & tag filtered showcase
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── TerminalModal.tsx      # Interactive developer bash CLI
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── TimelineSection.tsx
│   │   │   └── Toast.tsx
│   │   ├── services/api.ts     # Complete typed API client
│   │   ├── types/index.ts      # TypeScript definitions
│   │   ├── utils/sound.ts      # Web Audio synthesizer
│   │   ├── App.tsx             # Root orchestrator
│   │   └── index.css           # Tailwind v4 theme styling
│   └── package.json
├── server/                     # Express REST API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── admin.js        # Protected CRUD + export-data endpoint
│   │   │   ├── auth.js         # JWT login & session validation
│   │   │   ├── public.js       # Public portfolio data & contact transmissions
│   │   │   └── upload.js       # Multi-file persistent uploader
│   │   ├── middleware/auth.js  # JWT verification
│   │   ├── config.js           # Centralized paths
│   │   ├── db.js               # SQLite schema & automatic seeding
│   │   └── index.js            # Express server entry
│   ├── .env.example
│   └── package.json
├── data/                       # Persistent SQLite database (portfolio.db)
├── uploads/                    # Persistent image & resume storage
├── scripts/
│   └── verify.js               # Comprehensive test suite
├── package.json                # Root automation script
└── README.md
```

---

## 🔑 Default Administrator Credentials

When the SQLite datastore initializes, it automatically provisions the admin operative:

- **Email**: `admin@yehia.dev`
- **Password**: `AdminPass123!`

*(You can update the email or password at any time from the Admin Dashboard under the "CREDENTIALS" tab).*

---

## ⚙️ Environment Configuration

Set up in `server/.env`:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=yehia_cyber_portfolio_secure_jwt_token_secret_key_2026
ADMIN_EMAIL=admin@yehia.dev
ADMIN_PASSWORD=AdminPass123!
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Running the Project

### 1. Start the Production Server
```bash
# From root directory:
npm start
# OR
node server/src/index.js
```
The application will serve both the backend API and the compiled Vite frontend from `http://localhost:5000`.

### 2. Development Mode
To run Vite with Hot Module Replacement and the Express server concurrently:
```bash
# In terminal 1 (server):
cd server && npm run dev

# In terminal 2 (client):
cd client && npm run dev
```

### 3. Run Verification Suite
To test all API endpoints, database operations, views telemetry, and backup exports:
```bash
node scripts/verify.js
```
