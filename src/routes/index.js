import { Router } from 'express';
import authRoutes from './auth.routes.js';
import txnRoutes from './transaction.routes.js';
import categoryRoutes from './category.routes.js';
import analyticsRoutes from './analytics.routes.js';
import userRoutes from './user.routes.js';

const r = Router();

r.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

r.use('/auth', authRoutes);
r.use('/transactions', txnRoutes);
r.use('/categories', categoryRoutes);
r.use('/analytics', analyticsRoutes);
r.use('/users', userRoutes);

export default r;
