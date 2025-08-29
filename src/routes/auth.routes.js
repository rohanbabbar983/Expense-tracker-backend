import { Router } from 'express';
import { authLimiter } from '../middlewares/rateLimits.js';
import { registerCtrl, loginCtrl, meCtrl } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';
import { handleValidation } from '../validators/common.validators.js';
import { authenticate, sanitizeBody } from '../middlewares/auth.js';

const r = Router();
r.post('/register', authLimiter, sanitizeBody, registerValidator, handleValidation, registerCtrl);
r.post('/login',  sanitizeBody, loginValidator, handleValidation, loginCtrl);
r.get('/me', authenticate, meCtrl);
export default r;
