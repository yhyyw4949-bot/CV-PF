import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of the server package is __dirname/..
export const SERVER_ROOT = path.resolve(__dirname, '..');
// Root of the portfolio project is SERVER_ROOT/..
export const PROJECT_ROOT = path.resolve(SERVER_ROOT, '..');

const isVercel = Boolean(process.env.VERCEL);

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : (isVercel ? '/tmp/data' : path.resolve(PROJECT_ROOT, 'data'));

export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : (isVercel ? '/tmp/uploads' : path.resolve(PROJECT_ROOT, 'uploads'));

export const CLIENT_DIST = process.env.CLIENT_DIST
  ? path.resolve(process.env.CLIENT_DIST)
  : path.resolve(PROJECT_ROOT, 'client', 'dist');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// On Vercel serverless environment, copy seed database and uploads to /tmp
if (isVercel) {
  try {
    const bundledDb = path.resolve(PROJECT_ROOT, 'data', 'portfolio.db');
    const targetDb = path.join(DATA_DIR, 'portfolio.db');
    if (fs.existsSync(bundledDb) && !fs.existsSync(targetDb)) {
      fs.copyFileSync(bundledDb, targetDb);
      console.log('[VERCEL] Copied bundled database to /tmp/data/portfolio.db');
    }

    const bundledUploads = path.resolve(PROJECT_ROOT, 'uploads');
    if (fs.existsSync(bundledUploads)) {
      const files = fs.readdirSync(bundledUploads);
      for (const file of files) {
        const src = path.join(bundledUploads, file);
        const dest = path.join(UPLOAD_DIR, file);
        if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
          fs.copyFileSync(src, dest);
        }
      }
    }
  } catch (err) {
    console.warn('[VERCEL] Seed copy warning:', err.message);
  }
}

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || 'yehia_cyber_portfolio_secure_jwt_token_secret_key_2026';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yehia.dev';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass123!';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
