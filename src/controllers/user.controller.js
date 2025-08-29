import { listUsers } from '../services/user.service.js';

export async function listCtrl(req, res, next) {
  try {
    const data = await listUsers(req.query);
    res.json(data);
  } catch (e) { next(e); }
}
