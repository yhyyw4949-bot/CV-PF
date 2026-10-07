import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yehia_cyber_portfolio_secure_jwt_token_secret_key_2026';

export function authenticateAdmin(req, res, next) {
  let token = null;

  // Check HTTP-only cookie first
  if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }
  // Check Authorization Bearer header as fallback
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}
