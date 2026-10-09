import { createClient } from '@libsql/client';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { DATA_DIR, ADMIN_EMAIL, ADMIN_PASSWORD } from './config.js';

const DB_PATH = path.join(DATA_DIR, 'portfolio.db');
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

export const client = createClient({
  url: tursoUrl || `file:${DB_PATH}`,
  authToken: tursoToken
});

const localClient = createClient({
  url: `file:${DB_PATH}`
});

console.log(`[DB] Primary: ${tursoUrl ? 'Turso Cloud SQLite (' + tursoUrl + ')' : 'Local SQLite (' + DB_PATH + ')'}`);

async function executeWithFallback(stmt) {
  if (tursoUrl) {
    try {
      return await client.execute(stmt);
    } catch (err) {
      console.warn(`[DB Fallback] Turso query failed (${err.code || err.message}). Serving from local SQLite.`);
      return await localClient.execute(stmt);
    }
  }
  return await localClient.execute(stmt);
}

const db = {
  prepare(sql) {
    return {
      all: async (...args) => {
        const flatArgs = args.flat();
        const res = await executeWithFallback({ sql, args: flatArgs });
        return res.rows;
      },
      get: async (...args) => {
        const flatArgs = args.flat();
        const res = await executeWithFallback({ sql, args: flatArgs });
        return res.rows[0] || null;
      },
      run: async (...args) => {
        const flatArgs = args.flat();
        const res = await executeWithFallback({ sql, args: flatArgs });
        return {
          lastInsertRowid: res.lastInsertRowid ? Number(res.lastInsertRowid) : 0,
          changes: res.rowsAffected
        };
      }
    };
  },
  async exec(sql) {
    return executeWithFallback(sql);
  }
};

export async function initDatabase() {
  try {
    await client.batch([
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS profile (
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
      );`,
      `CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        proficiency INTEGER DEFAULT 85,
        icon TEXT,
        order_index INTEGER DEFAULT 0
      );`,
      `CREATE TABLE IF NOT EXISTS experience (
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
      );`,
      `CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution TEXT NOT NULL,
        degree TEXT NOT NULL,
        field_of_study TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        grade TEXT,
        description TEXT,
        order_index INTEGER DEFAULT 0
      );`,
      `CREATE TABLE IF NOT EXISTS projects (
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
      );`,
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        icon TEXT,
        order_index INTEGER DEFAULT 0
      );`,
      `CREATE TABLE IF NOT EXISTS articles (
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
      );`,
      `CREATE TABLE IF NOT EXISTS testimonials (
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
      );`
    ], 'write');

    // Ensure admin user exists and synchronize with environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yehia.dev';
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingUser = await db.prepare('SELECT id, email, password_hash FROM users LIMIT 1').get();
    if (!existingUser) {
      const passwordToSet = adminPassword || 'AdminPass123!';
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(passwordToSet, salt);
      await db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(adminEmail, hash);
      console.log(`[DB] Created admin user: ${adminEmail}`);
    } else if (adminPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(adminPassword, salt);
      await db.prepare('UPDATE users SET email = ?, password_hash = ? WHERE id = ?').run(adminEmail, hash, existingUser.id);
      console.log(`[DB] Synchronized admin credentials from environment: ${adminEmail}`);
    }

    // Seed initial profile data for Yehia Wael if none exists
    const existingProfile = await db.prepare('SELECT id FROM profile WHERE id = 1').get();
    if (!existingProfile) {
      await db.prepare(`
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
          'https://steamcommunity.com',
          'https://twitter.com/yehia_dev'
        )
      `).run();
      console.log('[DB] Seeded profile for Yehia Wael');
    }
  } catch (err) {
    console.error('[DB INIT ERROR]', err.message);
  }
}

export default db;
