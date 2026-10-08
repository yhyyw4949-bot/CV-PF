# 🚀 Deployment Guide — Yehia Wael Portfolio & Admin Matrix

Your application is a production-ready full-stack Node.js + React application. It supports **Vercel Serverless**, **Railway**, **Render**, **Docker / VPS**, and **Fly.io**.

---

## 📋 Step 0: Push Code to GitHub

First, create a new repository on [GitHub](https://github.com/new) (e.g., `yehia-portfolio`), then run these commands from your project folder:

```bash
# In your project folder (C:\Users\wael1\.gemini\antigravity\scratch\yehia-portfolio):
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/yehia-portfolio.git
git branch -M main
git push -u origin main
```

---

## ▲ Option 1: Vercel (Fastest & Simplest One-Click Deployment)

The project includes pre-configured [`vercel.json`](./vercel.json) and [`api/index.js`](./api/index.js) serverless functions.

### How it works on Vercel:
- **Frontend**: Built into `client/dist` and distributed worldwide via Vercel Edge Network.
- **Backend**: Express API routes (`/api/*` and `/uploads/*`) run as a Node 22+ Serverless Function via `api/index.js`.
- **Database**: On cold start, the bundled SQLite database (`data/portfolio.db`) and placeholder assets are copied to `/tmp` so the serverless function can read and write without filesystem permission errors.

### Step-by-Step Vercel Deployment:

1. **Import Project into Vercel:**
   - Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
   - Click **"Add New..."** → **"Project"**.
   - Select your `yehia-portfolio` repository and click **"Import"**.

2. **Project Settings (Pre-configured automatically by `vercel.json`):**
   - **Framework Preset**: `Other` (or auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`

3. **Set Environment Variables:**
   Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `(enter any secure random string, e.g., yehia_production_secret_key_2026)`
   - `ADMIN_EMAIL` = `admin@yehia.dev`
   - `ADMIN_PASSWORD` = `(your custom strong admin password)`

4. **Click "Deploy"**:
   - Vercel will install dependencies, compile the React Vite bundle, and deploy the serverless API.
   - Once completed, your portfolio is live at `https://your-project.vercel.app` with instant free SSL!

> [!NOTE]
> **Important Note regarding Vercel Serverless Filesystems:**
> Vercel Lambda functions are ephemeral. Any changes you make in the Admin Dashboard (e.g. creating a new article or modifying bio) will be written to `/tmp/data/portfolio.db` during that serverless session.
> - To keep data permanently synchronized when modifying content from the dashboard, you can click **"EXPORT SYSTEM BACKUP (JSON)"** under the **CREDENTIALS** tab at any time to save a local snapshot.
> - If you plan to make frequent database changes directly from the live admin dashboard that must persist indefinitely across cold starts, consider **Railway.app** or **Render** with persistent volume disks (documented below).

---

## 🥇 Option 2: Railway.app (Recommended for Persistent Disk Storage)

Railway automatically detects the repository's `Dockerfile` or Node configuration and supports persistent volumes.

1. Go to [railway.app](https://railway.app/) and sign in with GitHub.
2. Click **"New Project"** → **"Deploy from GitHub repo"** and select `yehia-portfolio`.
3. Railway automatically detects [`railway.json`](./railway.json) and [`Dockerfile`](./Dockerfile).
4. Under your project **Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `(generate a secure string)`
   - `ADMIN_EMAIL`: `admin@yehia.dev`
   - `ADMIN_PASSWORD`: `(your password)`
5. **Add Persistent Storage (Volume)**:
   - In Railway canvas, click **"+ New"** → **"Volume"**.
   - Mount path: `/app/data` (persists your SQLite database forever).
   - *(Optional)* Add a second volume mounted at `/app/uploads` for uploaded files.
6. Under **Settings** → **Networking**, click **"Generate Domain"** to get your public HTTPS URL.

---

## 🥈 Option 3: Render.com (Blueprint 1-Click Deploy)

A `render.yaml` blueprint is already included in your project root:

1. Sign in to [render.com](https://render.com/).
2. Click **"New +"** → **"Blueprint"** and connect your repository.
3. Render reads `render.yaml` and deploys your Web Service automatically:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Set environment variables in the Render dashboard (`JWT_SECRET`, `ADMIN_PASSWORD`).
5. Click **"Apply"** to deploy.

---

## 🥉 Option 4: Docker & Docker Compose (Any VPS / DigitalOcean / Hetzner / AWS)

If you have a Linux virtual server (VPS) with Docker installed:

1. Clone your repository onto the server:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/yehia-portfolio.git
   cd yehia-portfolio
   ```

2. Start the container:
   ```bash
   docker compose up -d --build
   ```

3. Your site runs on port 5000 with persistent volumes mounted to `./data` and `./uploads`.
   Point your domain to port 5000 using Nginx or Caddy.

---

## 🔒 Post-Deployment Checklist

- [ ] Open your live website URL and verify all sections load.
- [ ] Open the **Developer CLI Terminal** by pressing the backtick (`` ` ``) key or clicking `[ CLI ]`.
- [ ] Press `Ctrl+K` to test the **Command Search Palette**.
- [ ] Click **"ADMIN ACCESS"** and log in with your credentials.
- [ ] Change the admin password under the **"CREDENTIALS"** tab.
- [ ] Test downloading a JSON snapshot using **"EXPORT SYSTEM BACKUP (JSON)"**.
