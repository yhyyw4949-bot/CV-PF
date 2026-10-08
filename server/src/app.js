import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';

import { initDatabase } from './db.js';
import { CORS_ORIGIN, UPLOAD_DIR, CLIENT_DIST } from './config.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';

const app = express();

// Initialize persistent SQLite tables and seed data
initDatabase();

// Generate placeholder avatar in uploads if it doesn't exist yet
const placeholderAvatar = path.join(UPLOAD_DIR, 'avatar-placeholder.png');
if (!fs.existsSync(placeholderAvatar)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0e17" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#00f5ff" stop-opacity="0.2" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <circle cx="200" cy="150" r="70" fill="#00f5ff" fill-opacity="0.2" stroke="#00f5ff" stroke-width="4"/>
    <path d="M 100 340 C 100 240, 300 240, 300 340" fill="#00ff88" fill-opacity="0.2" stroke="#00ff88" stroke-width="4"/>
    <text x="200" y="380" font-family="monospace" font-size="20" fill="#00f5ff" text-anchor="middle" letter-spacing="4">YEHIA WAEL // ARCHITECT</text>
  </svg>`;
  try {
    fs.writeFileSync(placeholderAvatar, svg);
  } catch (err) {
    console.warn('Could not write placeholder avatar:', err.message);
  }
}

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin === CORS_ORIGIN || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(UPLOAD_DIR));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Yehia Wael Cyber Portfolio Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Production Static Client Serving (when running standalone Express)
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// 404 Handler for APIs
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
