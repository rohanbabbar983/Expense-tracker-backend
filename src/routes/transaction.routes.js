import { Router } from 'express';
import * as ctrl from '../controllers/transaction.controller.js';
import { authenticate, sanitizeBody } from '../middlewares/auth.js';
import { allowRoles, mustOwnOrAdmin } from '../middlewares/rbac.js';
import { txnLimiter } from '../middlewares/rateLimits.js';
import { createTxnValidator, updateTxnValidator, filterTxnQuery } from '../validators/transaction.validators.js';
import { paginationQuery, idParam, handleValidation } from '../validators/common.validators.js';
import { getOwnerIdFromTxn } from '../services/transaction.service.js';

const r = Router();

r.use(authenticate);

// List + filter (all roles can view)
r.get('/', txnLimiter, filterTxnQuery, paginationQuery, handleValidation, ctrl.listCtrl);

// Get single
r.get('/:id', txnLimiter, idParam, handleValidation,
  mustOwnOrAdmin(getOwnerIdFromTxn),
  ctrl.getCtrl
);

// Create (admin + user)
r.post('/', txnLimiter,
  allowRoles('admin','user'),
  sanitizeBody,
  createTxnValidator, handleValidation,
  ctrl.createCtrl
);

// Update (admin + owner/user)
r.put('/:id', txnLimiter,
  allowRoles('admin','user'),
  idParam, sanitizeBody, updateTxnValidator, handleValidation,
  mustOwnOrAdmin(getOwnerIdFromTxn),
  ctrl.updateCtrl
);

// Delete (admin + owner/user)
r.delete('/:id', txnLimiter,
  allowRoles('admin','user'),
  idParam, handleValidation,
  mustOwnOrAdmin(getOwnerIdFromTxn),
  ctrl.deleteCtrl
);

export default r;
