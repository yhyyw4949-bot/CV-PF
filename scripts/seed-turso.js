import { createClient } from '@libsql/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOCAL_DB_PATH = path.resolve(PROJECT_ROOT, 'data', 'portfolio.db');

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  console.error('❌ Error: TURSO_DATABASE_URL is not set in environment or .env');
  console.error('Usage: TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." node scripts/seed-turso.js');
  process.exit(1);
}

console.log('⚡ [TURSO SEED] Connecting to local SQLite datastore...');
const localClient = createClient({ url: `file:${LOCAL_DB_PATH}` });

console.log(`⚡ [TURSO SEED] Connecting to Turso Cloud at ${tursoUrl}...`);
const tursoClient = createClient({
  url: tursoUrl,
  authToken: tursoToken
});

async function migrateToTurso() {
  try {
    console.log('🔨 1. Initializing schema on Turso Cloud...');
    await tursoClient.batch([
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
    console.log('✅ Schema created successfully on Turso Cloud.');

    // Migrate tables
    const tables = [
      'users', 'profile', 'skills', 'experience', 'education',
      'projects', 'stats', 'articles', 'testimonials', 'messages'
    ];

    for (const table of tables) {
      console.log(`📦 Copying table: ${table}...`);
      const localRows = (await localClient.execute(`SELECT * FROM ${table}`)).rows;
      if (localRows.length === 0) continue;

      // Clear remote table to avoid primary key conflicts
      await tursoClient.execute(`DELETE FROM ${table}`);

      for (const row of localRows) {
        const columns = Object.keys(row);
        const placeholders = columns.map(() => '?').join(', ');
        const values = columns.map(col => row[col]);
        await tursoClient.execute({
          sql: `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`,
          args: values
        });
      }
      console.log(`   ↳ Migrated ${localRows.length} rows into ${table}`);
    }

    console.log('\n🚀 [SUCCESS] Your Turso Cloud database is fully populated and synchronized!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrateToTurso();
