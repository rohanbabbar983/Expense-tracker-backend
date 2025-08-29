import * as cat from '../services/category.service.js';
import { cache, setCache, keys, TTL } from '../middlewares/cache.js';

export async function listCtrl(req, res, next) {
  try {
    const rows = await cat.listCategories();
    // cache support (if used via route)
    if (res.locals.cacheKey) await setCache(res, rows);
    res.json(rows);
  } catch (e) { next(e); }
}

export async function createCtrl(req, res, next) {
  try {
    const created = await cat.createCategory(req.body.name);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function updateCtrl(req, res, next) {
  try {
    const updated = await cat.updateCategory(req.params.id, req.body.name);
    res.json(updated);
  } catch (e) { next(e); }
}

export async function deleteCtrl(req, res, next) {
  try {
    const del = await cat.deleteCategory(req.params.id);
    res.json({ deleted: true, id: del.id });
  } catch (e) { next(e); }
}
