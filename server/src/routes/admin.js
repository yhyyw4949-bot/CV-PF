import express from 'express';
import db from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth to all admin routes
router.use(authenticateAdmin);

// Helper for JSON parsing
function safeJsonStringify(val) {
  if (typeof val === 'string') return val;
  return JSON.stringify(val || []);
}

function safeJsonParse(val, fallback = []) {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : fallback;
  }
}

// GET Overview Stats
router.get('/overview', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const projectsCount = ((await db.prepare('SELECT COUNT(*) as count FROM projects').get()) || {}).count || 0;
    const skillsCount = ((await db.prepare('SELECT COUNT(*) as count FROM skills').get()) || {}).count || 0;
    const expCount = ((await db.prepare('SELECT COUNT(*) as count FROM experience').get()) || {}).count || 0;
    const eduCount = ((await db.prepare('SELECT COUNT(*) as count FROM education').get()) || {}).count || 0;
    const messagesCount = ((await db.prepare('SELECT COUNT(*) as count FROM messages').get()) || {}).count || 0;
    const unreadMessagesCount = ((await db.prepare('SELECT COUNT(*) as count FROM messages WHERE is_read = 0').get()) || {}).count || 0;
    const featuredProjectsCount = ((await db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_featured = 1').get()) || {}).count || 0;
    const articlesCount = ((await db.prepare('SELECT COUNT(*) as count FROM articles').get()) || {}).count || 0;
    const testimonialsCount = ((await db.prepare('SELECT COUNT(*) as count FROM testimonials').get()) || {}).count || 0;

    return res.json({
      projectsCount,
      skillsCount,
      expCount,
      eduCount,
      messagesCount,
      unreadMessagesCount,
      featuredProjectsCount,
      articlesCount,
      testimonialsCount
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PROFILE
router.get('/profile', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const profile = (await db.prepare('SELECT * FROM profile WHERE id = 1').get()) || {};
    return res.json({ profile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const {
      name, title, tagline, bio, avatar_url, resume_url,
      email, phone, location, status_text, github_url,
      linkedin_url, discord_username, steam_url, twitter_url
    } = req.body;

    if (!name || !title) {
      return res.status(400).json({ error: 'Name and title are required.' });
    }

    await db.prepare(`
      UPDATE profile SET
        name = ?,
        title = ?,
        tagline = ?,
        bio = ?,
        avatar_url = ?,
        resume_url = ?,
        email = ?,
        phone = ?,
        location = ?,
        status_text = ?,
        github_url = ?,
        linkedin_url = ?,
        discord_username = ?,
        steam_url = ?,
        twitter_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      name, title, tagline || '', bio || '', avatar_url || '', resume_url || '',
      email || '', phone || '', location || '', status_text || '',
      github_url || '', linkedin_url || '', discord_username || '',
      steam_url || '', twitter_url || ''
    );

    const updated = await db.prepare('SELECT * FROM profile WHERE id = 1').get();
    return res.json({ success: true, profile: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PROJECTS
router.get('/projects', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const rows = await db.prepare('SELECT * FROM projects ORDER BY order_index ASC, id DESC').all();
    const projects = rows.map(p => ({
      ...p,
      technologies: safeJsonParse(p.technologies),
      gallery: safeJsonParse(p.gallery)
    }));
    return res.json({ projects });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const {
      title, slug, tagline, description, technologies,
      image_url, gallery, demo_url, github_url, category,
      is_featured, stars_count, order_index
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `proj-${Date.now()}`;
    const techStr = safeJsonStringify(technologies);
    const galleryStr = safeJsonStringify(gallery);

    const result = await db.prepare(`
      INSERT INTO projects (
        title, slug, tagline, description, technologies,
        image_url, gallery, demo_url, github_url, category,
        is_featured, stars_count, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, cleanSlug, tagline || '', description, techStr,
      image_url || '', galleryStr, demo_url || '', github_url || '',
      category || 'Full-Stack', is_featured ? 1 : 0, Number(stars_count) || 0,
      Number(order_index) || 0
    );

    const created = await db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({
      success: true,
      project: {
        ...created,
        technologies: safeJsonParse(created.technologies),
        gallery: safeJsonParse(created.gallery)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, slug, tagline, description, technologies,
      image_url, gallery, demo_url, github_url, category,
      is_featured, stars_count, order_index
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const techStr = safeJsonStringify(technologies);
    const galleryStr = safeJsonStringify(gallery);

    await db.prepare(`
      UPDATE projects SET
        title = ?,
        slug = ?,
        tagline = ?,
        description = ?,
        technologies = ?,
        image_url = ?,
        gallery = ?,
        demo_url = ?,
        github_url = ?,
        category = ?,
        is_featured = ?,
        stars_count = ?,
        order_index = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title, slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline || '', description, techStr,
      image_url || '', galleryStr, demo_url || '', github_url || '',
      category || 'Full-Stack', is_featured ? 1 : 0, Number(stars_count) || 0,
      Number(order_index) || 0, id
    );

    const updated = await db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({
      success: true,
      project: {
        ...updated,
        technologies: safeJsonParse(updated.technologies),
        gallery: safeJsonParse(updated.gallery)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Project removed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// SKILLS
router.get('/skills', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const skills = await db.prepare('SELECT * FROM skills ORDER BY order_index ASC, id ASC').all();
    return res.json({ skills });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/skills', async (req, res) => {
  try {
    const { name, category, proficiency, icon, order_index } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Skill name and category are required.' });
    }

    const result = await db.prepare(`
      INSERT INTO skills (name, category, proficiency, icon, order_index)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, category, Math.min(100, Math.max(0, Number(proficiency) || 80)), icon || '', Number(order_index) || 0);

    const created = await db.prepare('SELECT * FROM skills WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, skill: created });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon, order_index } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Skill name and category are required.' });
    }

    await db.prepare(`
      UPDATE skills SET
        name = ?,
        category = ?,
        proficiency = ?,
        icon = ?,
        order_index = ?
      WHERE id = ?
    `).run(name, category, Math.min(100, Math.max(0, Number(proficiency) || 80)), icon || '', Number(order_index) || 0, id);

    const updated = await db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
    return res.json({ success: true, skill: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM skills WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// EXPERIENCE
router.get('/experience', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const rows = await db.prepare('SELECT * FROM experience ORDER BY order_index ASC, is_current DESC, id DESC').all();
    const experience = rows.map(e => ({
      ...e,
      technologies: safeJsonParse(e.technologies)
    }));
    return res.json({ experience });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/experience', async (req, res) => {
  try {
    const {
      company, role, location, employment_type,
      start_date, end_date, is_current, description,
      technologies, order_index
    } = req.body;

    if (!company || !role || !start_date || !description) {
      return res.status(400).json({ error: 'Company, role, start date, and description are required.' });
    }

    const techStr = safeJsonStringify(technologies);

    const result = await db.prepare(`
      INSERT INTO experience (company, role, location, employment_type, start_date, end_date, is_current, description, technologies, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      company, role, location || '', employment_type || 'Full-time',
      start_date, end_date || null, is_current ? 1 : 0, description,
      techStr, Number(order_index) || 0
    );

    const created = await db.prepare('SELECT * FROM experience WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({
      success: true,
      experience: {
        ...created,
        technologies: safeJsonParse(created.technologies)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/experience/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company, role, location, employment_type,
      start_date, end_date, is_current, description,
      technologies, order_index
    } = req.body;

    if (!company || !role || !start_date || !description) {
      return res.status(400).json({ error: 'Company, role, start date, and description are required.' });
    }

    const techStr = safeJsonStringify(technologies);

    await db.prepare(`
      UPDATE experience SET
        company = ?,
        role = ?,
        location = ?,
        employment_type = ?,
        start_date = ?,
        end_date = ?,
        is_current = ?,
        description = ?,
        technologies = ?,
        order_index = ?
      WHERE id = ?
    `).run(
      company, role, location || '', employment_type || 'Full-time',
      start_date, end_date || null, is_current ? 1 : 0, description,
      techStr, Number(order_index) || 0, id
    );

    const updated = await db.prepare('SELECT * FROM experience WHERE id = ?').get(id);
    return res.json({
      success: true,
      experience: {
        ...updated,
        technologies: safeJsonParse(updated.technologies)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/experience/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM experience WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Experience entry deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// EDUCATION
router.get('/education', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const education = await db.prepare('SELECT * FROM education ORDER BY order_index ASC, id DESC').all();
    return res.json({ education });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/education', async (req, res) => {
  try {
    const { institution, degree, field_of_study, start_date, end_date, grade, description, order_index } = req.body;
    if (!institution || !degree || !start_date) {
      return res.status(400).json({ error: 'Institution, degree, and start date are required.' });
    }

    const result = await db.prepare(`
      INSERT INTO education (institution, degree, field_of_study, start_date, end_date, grade, description, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(institution, degree, field_of_study || '', start_date, end_date || null, grade || '', description || '', Number(order_index) || 0);

    const created = await db.prepare('SELECT * FROM education WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, education: created });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/education/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { institution, degree, field_of_study, start_date, end_date, grade, description, order_index } = req.body;

    if (!institution || !degree || !start_date) {
      return res.status(400).json({ error: 'Institution, degree, and start date are required.' });
    }

    await db.prepare(`
      UPDATE education SET
        institution = ?,
        degree = ?,
        field_of_study = ?,
        start_date = ?,
        end_date = ?,
        grade = ?,
        description = ?,
        order_index = ?
      WHERE id = ?
    `).run(institution, degree, field_of_study || '', start_date, end_date || null, grade || '', description || '', Number(order_index) || 0, id);

    const updated = await db.prepare('SELECT * FROM education WHERE id = ?').get(id);
    return res.json({ success: true, education: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/education/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM education WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Education entry deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// STATS
router.get('/stats', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const stats = await db.prepare('SELECT * FROM stats ORDER BY order_index ASC, id ASC').all();
    return res.json({ stats });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/stats', async (req, res) => {
  try {
    const { label, value, icon, order_index } = req.body;
    if (!label || !value) {
      return res.status(400).json({ error: 'Label and value are required.' });
    }

    const result = await db.prepare('INSERT INTO stats (label, value, icon, order_index) VALUES (?, ?, ?, ?)')
      .run(label, value, icon || '', Number(order_index) || 0);

    const created = await db.prepare('SELECT * FROM stats WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, stat: created });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/stats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label, value, icon, order_index } = req.body;

    await db.prepare('UPDATE stats SET label = ?, value = ?, icon = ?, order_index = ? WHERE id = ?')
      .run(label, value, icon || '', Number(order_index) || 0, id);

    const updated = await db.prepare('SELECT * FROM stats WHERE id = ?').get(id);
    return res.json({ success: true, stat: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/stats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM stats WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Stat deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// MESSAGES
router.get('/messages', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const messages = await db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    return res.json({ messages });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/messages/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;
    await db.prepare('UPDATE messages SET is_read = ? WHERE id = ?').run(is_read ? 1 : 0, id);
    const updated = await db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    return res.json({ success: true, message: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Message removed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ARTICLES
router.get('/articles', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const rows = await db.prepare('SELECT * FROM articles ORDER BY order_index ASC, id DESC').all();
    const articles = rows.map(a => ({
      ...a,
      tags: safeJsonParse(a.tags)
    }));
    return res.json({ articles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/articles', async (req, res) => {
  try {
    const { title, slug, summary, content, cover_image, tags, read_time, is_published, order_index } = req.body;
    if (!title || !summary || !content) {
      return res.status(400).json({ error: 'Title, summary, and content are required.' });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `art-${Date.now()}`;
    const tagsStr = safeJsonStringify(tags);

    const result = await db.prepare(`
      INSERT INTO articles (title, slug, summary, content, cover_image, tags, read_time, is_published, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, cleanSlug, summary, content, cover_image || '',
      tagsStr, read_time || '5 min read', is_published ? 1 : 0, Number(order_index) || 0
    );

    const created = await db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({
      success: true,
      article: {
        ...created,
        tags: safeJsonParse(created.tags)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, summary, content, cover_image, tags, read_time, is_published, order_index } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ error: 'Title, summary, and content are required.' });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `art-${id}`;
    const tagsStr = safeJsonStringify(tags);

    await db.prepare(`
      UPDATE articles SET
        title = ?,
        slug = ?,
        summary = ?,
        content = ?,
        cover_image = ?,
        tags = ?,
        read_time = ?,
        is_published = ?,
        order_index = ?
      WHERE id = ?
    `).run(
      title, cleanSlug, summary, content, cover_image || '',
      tagsStr, read_time || '5 min read', is_published ? 1 : 0, Number(order_index) || 0, id
    );

    const updated = await db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    return res.json({
      success: true,
      article: {
        ...updated,
        tags: safeJsonParse(updated.tags)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// TESTIMONIALS
router.get('/testimonials', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const testimonials = await db.prepare('SELECT * FROM testimonials ORDER BY order_index ASC, id DESC').all();
    return res.json({ testimonials });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { name, role, company, avatar_url, content, rating, linkedin_url, order_index } = req.body;
    if (!name || !role || !company || !content) {
      return res.status(400).json({ error: 'Name, role, company, and content are required.' });
    }

    const result = await db.prepare(`
      INSERT INTO testimonials (name, role, company, avatar_url, content, rating, linkedin_url, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, role, company, avatar_url || '', content,
      Number(rating) || 5, linkedin_url || '', Number(order_index) || 0
    );

    const created = await db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, testimonial: created });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, company, avatar_url, content, rating, linkedin_url, order_index } = req.body;

    if (!name || !role || !company || !content) {
      return res.status(400).json({ error: 'Name, role, company, and content are required.' });
    }

    await db.prepare(`
      UPDATE testimonials SET
        name = ?,
        role = ?,
        company = ?,
        avatar_url = ?,
        content = ?,
        rating = ?,
        linkedin_url = ?,
        order_index = ?
      WHERE id = ?
    `).run(
      name, role, company, avatar_url || '', content,
      Number(rating) || 5, linkedin_url || '', Number(order_index) || 0, id
    );

    const updated = await db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    return res.json({ success: true, testimonial: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Testimonial removed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// FULL DATABASE EXPORT / BACKUP
router.get('/export-data', async (req, res) => {
  try {
    const profile = (await db.prepare('SELECT * FROM profile WHERE id = 1').get()) || {};
    const projects = await db.prepare('SELECT * FROM projects').all();
    const skills = await db.prepare('SELECT * FROM skills').all();
    const experience = await db.prepare('SELECT * FROM experience').all();
    const education = await db.prepare('SELECT * FROM education').all();
    const articles = await db.prepare('SELECT * FROM articles').all();
    const testimonials = await db.prepare('SELECT * FROM testimonials').all();
    const stats = await db.prepare('SELECT * FROM stats').all();
    const messages = await db.prepare('SELECT * FROM messages').all();

    const snapshot = {
      exported_at: new Date().toISOString(),
      profile,
      projects,
      skills,
      experience,
      education,
      articles,
      testimonials,
      stats,
      messages
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=yehia-portfolio-backup-${Date.now()}.json`);
    return res.json(snapshot);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
