import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = { userId: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function signJwtForUser(user) {
  const payload = { sub: user._id.toString(), email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: '7d',
  });
  return token;
}


