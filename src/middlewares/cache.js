import { redis } from '../config/redis.js';
import { config } from '../config/env.js';

export const cache = (keyBuilder, ttlSec) => async (req, res, next) => {
  try {
    const key = keyBuilder(req);
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));
    res.locals.cacheKey = key;
    res.locals.cacheTtl = ttlSec;
    return next();
  } catch {
    return next(); // fail-open
  }
};

export const setCache = async (res, payload) => {
  const key = res.locals.cacheKey;
  const ttl = res.locals.cacheTtl || 60;
  if (!key) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(payload));
  } catch {}
};

export const keys = {
  categories: () => `categories:v1`,
  // pass a targetKey (userId OR 'ALL') and a query string
  analytics: (targetKey, q) => `analytics:${targetKey}:v1:${q}`
};

export const TTL = {
  categories: config.cacheTtl.categories,
  analytics: config.cacheTtl.analytics
};

// Invalidation helpers
export async function invalidateCategories() {
  await redis.del(keys.categories());
}
export async function invalidateAnalyticsForUser(userId) {
  // Wildcard delete: scan
  const pattern = `analytics:${userId}:v1:*`;
  const stream = redis.scanStream({ match: pattern });
  const keysToDelete = [];
  for await (const resultKeys of stream) keysToDelete.push(...resultKeys);
  if (keysToDelete.length) await redis.del(keysToDelete);
}

export async function invalidateAnalyticsAll() {
  // delete any ALL-users analytics cache
  const pattern = `analytics:ALL:v1:*`;
  const stream = redis.scanStream({ match: pattern });
  const keysToDelete = [];
  for await (const resultKeys of stream) keysToDelete.push(...resultKeys);
  if (keysToDelete.length) await redis.del(keysToDelete);
}