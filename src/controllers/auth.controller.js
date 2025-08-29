import { login, register } from '../services/auth.service.js';
import { safeUser } from '../services/auth.service.js';

export async function registerCtrl(req, res, next) {
  try {
    const user = await register(req.body);
    res.status(201).json({ user });
  } catch (e) { next(e); }
}

export async function loginCtrl(req, res, next) {
  try {
    const { token, user } = await login(req.body);
    res.json({ token, user });
  } catch (e) { next(e); }
}

export async function meCtrl(req, res) {
  res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.name, role: req.user.role } });
}
