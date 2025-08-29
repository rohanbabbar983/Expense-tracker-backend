import { Router } from 'express';
import { monthlyCtrl } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { analyticsLimiter } from '../middlewares/rateLimits.js';
import { cache, keys, TTL } from '../middlewares/cache.js';

const r = Router();

r.get('/monthly', authenticate, analyticsLimiter,
  cache(req => {
    const year = req.query.year ?? '';
    const targetKey =
      req.user.role === 'admin'
        ? (req.query.userId ? req.query.userId : 'ALL')
        : req.user.id;
    return keys.analytics(targetKey, `y=${year}`);
  }, TTL.analytics),
  monthlyCtrl
);

export default r;
