# 🚀 Deployment Guide — Yehia Wael Portfolio & Admin Matrix

Your application is a production-ready full-stack Node.js + React application. It serves its compiled frontend statically and utilizes a persistent file-backed SQLite database (`data/portfolio.db`) and uploaded media storage (`uploads/`).

---

## 📋 Step 0: Push Code to GitHub

First, create a new private or public repository on [GitHub](https://github.com/new) (e.g., `yehia-portfolio`), then run these commands from your project folder:

```bash
# In C:\Users\wael1\.gemini\antigravity\scratch\yehia-portfolio
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/yehia-portfolio.git
git branch -M main
git push -u origin main
```

---

## 🥇 Option 1: Railway.app (Recommended — Simplest with Volume Support)

Railway automatically detects the repository's `Dockerfile` or Node configuration and supports persistent volumes.

1. Go to [railway.app](https://railway.app/) and sign in with GitHub.
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your `yehia-portfolio` repository.
4. Railway will automatically pick up `railway.json` and `Dockerfile`.
5. Under your project **Settings / Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(Generate a secure random string)*
   - `ADMIN_EMAIL`: `admin@yehia.dev` *(or your custom email)*
   - `ADMIN_PASSWORD`: *(Your secure strong password)*
6. **Add Persistent Storage (Volume)**:
   - In Railway canvas, click **"+ New"** → **"Volume"**.
   - Mount path: `/app/data` (to persist your SQLite database).
   - *(Optional)* Add a second volume mounted at `/app/uploads` for uploaded files.
7. Under **Settings** → **Networking**, click **"Generate Domain"** to get your live public HTTPS URL (e.g., `https://yehia-portfolio-production.up.railway.app`).

---

## 🥈 Option 2: Render.com (Blueprint 1-Click Deploy)

A `render.yaml` blueprint is already created in the root of your project.

1. Go to [render.com](https://render.com/) and sign in with GitHub.
2. Click **"New +"** → **"Blueprint"**.
3. Connect your `yehia-portfolio` repository.
4. Render will read `render.yaml` and configure the Web Service automatically:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Set your environment variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(Auto-generated or custom)*
   - `ADMIN_EMAIL`: `admin@yehia.dev`
   - `ADMIN_PASSWORD`: *(Your secure password)*
6. Click **"Apply"**. Render will deploy your service with free SSL at `https://yehia-portfolio.onrender.com`.

---

## 🥉 Option 3: Docker & Docker Compose (Any VPS / DigitalOcean / Hetzner / AWS)

If you have a Linux virtual server (VPS) with Docker installed:

1. Clone your repository onto the server:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/yehia-portfolio.git
   cd yehia-portfolio
   ```

2. Edit environment variables in `docker-compose.yml`:
   ```yaml
   environment:
     - NODE_ENV=production
     - PORT=5000
     - JWT_SECRET=your_super_secret_jwt_key_here
     - ADMIN_EMAIL=admin@yehia.dev
     - ADMIN_PASSWORD=YourStrongPasswordHere!
   ```

3. Launch the container in the background:
   ```bash
   docker compose up -d --build
   ```

4. The app will be running on port 5000. Point your domain (e.g. `yehia.dev`) to your server IP using Nginx or Caddy with free Let's Encrypt SSL:
   ```caddy
   # /etc/caddy/Caddyfile
   yehia.dev {
       reverse_proxy localhost:5000
   }
   ```

---

## 🏅 Option 4: Fly.io

1. Install the Fly CLI: [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl/)
2. Log in:
   ```bash
   fly auth login
   ```
3. Initialize the app using the included `fly.toml`:
   ```bash
   fly launch --no-deploy
   ```
4. Create the persistent volume for SQLite:
   ```bash
   fly volumes create portfolio_data --size 1
   ```
5. Set secrets:
   ```bash
   fly secrets set JWT_SECRET="your_secure_random_key" ADMIN_PASSWORD="your_strong_password"
   ```
6. Deploy:
   ```bash
   fly deploy
   ```

---

## 🔒 Post-Deployment Checklist

- [ ] Log in to the Admin Dashboard at `https://your-domain.com` (Click **"ADMIN ACCESS"** in the top navigation).
- [ ] Go to the **"CREDENTIALS"** tab and change your administrator password from the default seed password.
- [ ] Under the **"CREDENTIALS"** tab, test the **"EXPORT SYSTEM BACKUP (JSON)"** button to verify you can take one-click snapshots of your data at any time.
- [ ] Update your contact information, resume PDF, and project links.
