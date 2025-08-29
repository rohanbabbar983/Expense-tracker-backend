import { verifyJwt } from '../utils/crypto.js';
import sanitizeHtml from 'sanitize-html';

export function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    const clean = (obj) => {
      Object.keys(obj).forEach(k => {
        const v = obj[k];
        if (typeof v === 'string') obj[k] = sanitizeHtml(v, { allowedTags: [], allowedAttributes: {} });
        else if (v && typeof v === 'object') clean(v);
      });
    };
    clean(req.body);
  }
  next();
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const claims = verifyJwt(token);
    req.user = { id: claims.sub, role: claims.role, email: claims.email, name: claims.name };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
