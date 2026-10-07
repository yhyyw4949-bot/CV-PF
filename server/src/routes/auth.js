import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'yehia_cyber_portfolio_secure_jwt_token_secret_key_2026';

// Login route
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Me route
router.get('/me', authenticateAdmin, (req, res) => {
  const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(req.admin.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user });
});

// Update email / password
router.put('/update-credentials', authenticateAdmin, (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to make security changes' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.admin.id);
    if (!user) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    let updatedEmail = user.email;
    let updatedHash = user.password_hash;

    if (newEmail && newEmail.trim() !== '') {
      updatedEmail = newEmail.trim().toLowerCase();
    }

    if (newPassword && newPassword.length >= 6) {
      const salt = bcrypt.genSaltSync(10);
      updatedHash = bcrypt.hashSync(newPassword, salt);
    } else if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    db.prepare('UPDATE users SET email = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(updatedEmail, updatedHash, user.id);

    // Refresh token with new email
    const token = jwt.sign(
      { id: user.id, email: updatedEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Credentials updated successfully',
      user: { id: user.id, email: updatedEmail }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to update credentials' });
  }
});

export default router;
