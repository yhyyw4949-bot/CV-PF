import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all public portfolio data
router.get('/data', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get() || {};
    const skills = db.prepare('SELECT * FROM skills ORDER BY order_index ASC, id ASC').all();
    const experience = db.prepare('SELECT * FROM experience ORDER BY order_index ASC, is_current DESC, id DESC').all();
    const education = db.prepare('SELECT * FROM education ORDER BY order_index ASC, id DESC').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY order_index ASC, is_featured DESC, id DESC').all();
    const stats = db.prepare('SELECT * FROM stats ORDER BY order_index ASC, id ASC').all();
    const articles = db.prepare('SELECT * FROM articles WHERE is_published = 1 ORDER BY order_index ASC, id DESC').all();
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY order_index ASC, id ASC').all();

    // Parse JSON columns safely
    const formattedProjects = projects.map(p => ({
      ...p,
      technologies: safeJsonParse(p.technologies, []),
      gallery: safeJsonParse(p.gallery, [])
    }));

    const formattedExperience = experience.map(e => ({
      ...e,
      technologies: safeJsonParse(e.technologies, [])
    }));

    const formattedArticles = articles.map(a => ({
      ...a,
      tags: safeJsonParse(a.tags, [])
    }));

    return res.json({
      profile,
      skills,
      experience: formattedExperience,
      education,
      projects: formattedProjects,
      stats,
      articles: formattedArticles,
      testimonials
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch portfolio data' });
  }
});

// Increment article view count
router.post('/articles/:id/view', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE articles SET views_count = views_count + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT views_count FROM articles WHERE id = ?').get(id);
    return res.json({ success: true, views_count: updated ? updated.views_count : 0 });
  } catch {
    return res.json({ success: false });
  }
});

// POST contact message
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    db.prepare(`
      INSERT INTO messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), email.trim(), (subject || '').trim(), message.trim());

    return res.status(201).json({
      success: true,
      message: 'Transmission received. Thank you for reaching out!'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to transmit message' });
  }
});

function safeJsonParse(val, fallback) {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    // If it's comma separated
    return typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : fallback;
  }
}

export default router;
