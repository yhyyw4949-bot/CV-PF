# ⚡ Yehia Wael — Cyber/Tech CV & Portfolio with Secure Admin Matrix

A full-stack personal portfolio and CV web application tailored for **Yehia Wael**, featuring a high-octane **cyberpunk / dark gamer / tech HUD aesthetic**, responsive across mobile and desktop devices, with an authenticated **Admin Command Center** backed by a **persistent SQLite database** and **persistent file/image storage**.

---

## 🎮 Highlights & Features

- **Public Portfolio Experience**:
  - **Hero & Identity HUD**: Cyber callsigns, active status badge (`ONLINE // LEVEL 99 ARCHITECT`), dynamic stats counters (Years Exp, Shipped Systems, Tech Mastered, Caffeine consumed).
  - **Operative Bio & Terminal**: Terminal interface presenting multi-paragraph bio, profile avatar with holographic scanline overlay, and direct links to GitHub, LinkedIn, Discord, Steam, and X/Twitter.
  - **Technical Arsenal (Skills Matrix)**: Interactive category filters (Languages, Frontend & UI, Backend & Systems, Engines & Tools) with animated neon progress meters and proficiency percentages.
  - **Shipped Protocols (Projects Showcase)**: Filterable project showcase with featured markers, star counts, tech tags, live demo buttons, source code inspection, and a modal for deep architectural overviews.
  - **Career & Academic Trajectory**: Dual-track timeline with glowing nodes for professional experience and computer science degrees / honors.
  - **Secure Transmission Console (Contact Form)**: Direct message dispatch saved to the persistent datastore with instant toast notifications.
- **Admin Command Center (`/admin` or top navigation trigger)**:
  - **Authentication**: JWT authentication stored in HTTP-only cookies with bcrypt password verification.
  - **Profile & Bio Management**: Real-time editor for name, title, tagline, bio, contact details, status HUD, and social URLs.
  - **Persistent File Storage**: Integrated file upload component (`/api/upload`) supporting images (PNG, JPG, WEBP, SVG) and resume PDFs up to 15MB with live preview and direct URL fallback.
  - **Projects CRUD**: Create, edit, and delete projects, upload project banners, configure tech tags, toggle featured state, and update star counts.
  - **Skills CRUD**: Add, edit, and remove skills with category selection and 0–100% proficiency sliders.
  - **Experience & Education CRUD**: Manage job roles, companies, dates, current employment toggles, and degree records.
  - **Transmission Inbox**: Review messages sent via the contact form, mark as read/unread, delete, or trigger one-click email replies.
  - **Security Settings**: Self-service administrator email and password changes.

---

## 🛠️ Technology Stack Rationale

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | Ultra-fast HMR, type safety, optimal client performance. |
| **Styling** | Tailwind CSS v4 + Custom Cyber Theme | Deep obsidian backgrounds (`#06070a`), neon cyan/emerald/purple accents, custom scanline animations, and glassmorphic panels. |
| **Icons** | Lucide React + Custom Tech SVGs | Modern iconography with crisp brand and gamer logos (GitHub, LinkedIn, Discord, Steam, Twitter). |
| **Backend** | Node.js + Express | Clean REST API handling file uploads, sessions, and static SPA serving. |
| **Database** | Node SQLite (`DatabaseSync`) | Zero-dependency, native, ACID-compliant file-backed database (`data/portfolio.db`) with WAL mode and auto-seeding. |
| **File Storage** | Multer (`uploads/`) | Persistent local disk storage served directly at `/uploads/*`. |
| **Security** | `bcryptjs` + `jsonwebtoken` + `cookie-parser` | Industry-standard password hashing and HTTP-only cookie JWT auth. |

---

## 📁 Project Structure

```
yehia-portfolio/
├── client/                     # Vite + React + Tailwind frontend
│   ├── src/
│   │   ├── components/         # Hero, About, Skills, Projects, Timeline, Contact, Navbar, Toast
│   │   │   ├── admin/          # AdminLogin, AdminDashboard, FileUpload
│   │   │   └── Icons.tsx       # High-fidelity custom tech SVGs
│   │   ├── services/api.ts     # Complete typed API client
│   │   ├── types/index.ts      # TypeScript interfaces
│   │   ├── App.tsx             # Root application orchestrator
│   │   └── index.css           # Cyber theme variables & animations
│   └── package.json
├── server/                     # Express REST API
│   ├── src/
│   │   ├── routes/             # auth.js, public.js, admin.js, upload.js
│   │   ├── middleware/auth.js  # JWT verification middleware
│   │   ├── db.js               # SQLite connection, tables & seed script
│   │   ├── config.js           # Centralized paths and environment defaults
│   │   └── index.js            # Express app entry & static build serving
│   ├── .env.example
│   └── package.json
├── data/                       # Persistent SQLite datastore (portfolio.db)
├── uploads/                    # Persistent image & resume storage
├── scripts/
│   └── verify.js               # Automated system probe & verification
├── package.json                # Root orchestration package
└── README.md
```

---

## 🔑 Default Seed Admin Credentials

When the database initializes for the first time, default administrator credentials are automatically provisioned:

- **Email**: `admin@yehia.dev`
- **Password**: `AdminPass123!`

*(You can update these anytime inside the Admin Dashboard under the "CREDENTIALS" tab).*

---

## ⚙️ Environment Variables

Located at `server/.env` (or configured via deployment environment variables):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=yehia_cyber_portfolio_secure_jwt_token_secret_key_2026
ADMIN_EMAIL=admin@yehia.dev
ADMIN_PASSWORD=AdminPass123!
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Running the Project

### 1. Development Mode (Frontend + Backend concurrently)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 2. Production Mode
```bash
npm run build
npm start
```
The server will build the client and serve both the API, file uploads, and the optimized frontend from `http://localhost:5000`.

### 3. Verification Suite
```bash
npm test
```
Runs the automated health check, datastore probe, authentication verification, and static asset delivery check.

---

## 🚢 Deployment Guidelines

- **Render / Railway / Fly.io**:
  - Build Command: `npm install && cd server && npm install && cd ../client && npm install && npm run build`
  - Start Command: `cd server && node src/index.js`
  - Set `PORT` and a random `JWT_SECRET`.
  - For persistent uploads on Docker/Fly/Railway, mount a persistent volume at `/uploads` and `/data`.
