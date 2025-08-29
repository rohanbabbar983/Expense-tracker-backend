import { Router } from 'express';
import * as ctrl from '../controllers/category.controller.js';
import { authenticate, sanitizeBody } from '../middlewares/auth.js';
import { allowRoles } from '../middlewares/rbac.js';
import { cache, keys, TTL } from '../middlewares/cache.js';
import { body, param } from 'express-validator';
import { handleValidation } from '../validators/common.validators.js';

const r = Router();

// all roles can view (cached 1h)
r.get('/', authenticate, cache(() => keys.categories(), TTL.categories), ctrl.listCtrl);

// admin only for CRUD
r.post('/', authenticate, allowRoles('admin'), sanitizeBody, [
  body('name').isString().isLength({ min: 2, max: 40 })
], handleValidation, ctrl.createCtrl);

r.put('/:id', authenticate, allowRoles('admin'), sanitizeBody, [
  param('id').isString(), body('name').isString().isLength({ min: 2, max: 40 })
], handleValidation, ctrl.updateCtrl);

r.delete('/:id', authenticate, allowRoles('admin'), [
  param('id').isString()
], handleValidation, ctrl.deleteCtrl);

export default r;
