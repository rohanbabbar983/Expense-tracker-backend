import { monthlyOverview } from '../services/analytics.service.js';
import { setCache } from '../middlewares/cache.js';

export async function monthlyCtrl(req, res, next) {
  try {
    const year = Number(req.query.year ?? (new Date()).getFullYear());
    const targetUserId = (req.user.role === 'admin' && req.query.userId) ? req.query.userId : undefined;

    const data = await monthlyOverview({ requester: req.user, year, targetUserId });

    if (res.locals.cacheKey) await setCache(res, data);
    res.json(data);
  } catch (e) { next(e); }
}
