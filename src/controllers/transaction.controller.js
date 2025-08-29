import * as svc from '../services/transaction.service.js';

export async function listCtrl(req, res, next) {
  try {
    const q = { ...req.query };
    for (const k of ['type','categoryId','dateFrom','dateTo','search','userId']) {
      if (q[k] === '') delete q[k];
    }
    if (req.user.role !== 'admin') delete q.userId;
    const data = await svc.listTransactions({ user: req.user, query: q });
    res.json(data);
  } catch (e) { next(e); }
}

export async function getCtrl(req, res, next) {
  try {
    const txn = await svc.getTransaction(req.params.id);
    if (!txn) return res.status(404).json({ message: 'Not found' });
    res.json(txn);
  } catch (e) { next(e); }
}

export async function createCtrl(req, res, next) {
  try {
    const targetUserId =
      (req.user.role === 'admin' && req.body.userId) ? req.body.userId : req.user.id;

    const payload = { ...req.body };
    delete payload.userId; // never trust incoming when not admin

    const txn = await svc.createTransaction(targetUserId, payload);
    res.status(201).json(txn);
  } catch (e) { next(e); }
}

export async function updateCtrl(req, res, next) {
  try {
    const txn = await svc.updateTransaction(req.params.id, req.user.id, req.body);
    res.json(txn);
  } catch (e) { next(e); }
}

export async function deleteCtrl(req, res, next) {
  try {
    const txn = await svc.removeTransaction(req.params.id, req.user.id);
    res.json({ deleted: true, id: txn.id });
  } catch (e) { next(e); }
}
