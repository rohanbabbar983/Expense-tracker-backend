import { Router } from 'express';
import { listCtrl } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { allowRoles } from '../middlewares/rbac.js';

const r = Router();
r.get('/', authenticate, allowRoles('admin'), listCtrl);
export default r;
