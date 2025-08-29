import { body, query } from 'express-validator';

export const createTxnValidator = [
  body('amount').isFloat({ gt: 0 }),
  body('type').isIn(['income','expense']),
  body('categoryId').optional({ checkFalsy: true }).isString(),
  body('note').optional({ checkFalsy: true }).isString().isLength({ max: 300 }),
  body('occurredAt').optional({ checkFalsy: true }).isISO8601(),
  // ⬇️ admin may pass this; controller enforces role
  body('userId').optional({ checkFalsy: true }).isString()
];

export const updateTxnValidator = [
  body('amount').optional().isFloat({ gt: 0 }),
  body('type').optional().isIn(['income','expense']),
  body('categoryId').optional({ checkFalsy: true }).isString(),
  body('note').optional({ checkFalsy: true }).isString().isLength({ max: 300 }),
  body('occurredAt').optional({ checkFalsy: true }).isISO8601()
];

export const filterTxnQuery = [
  query('type').optional({ checkFalsy: true }).isIn(['income','expense']),
  query('categoryId').optional({ checkFalsy: true }).isString(),
  query('dateFrom').optional({ checkFalsy: true }).isISO8601(),
  query('dateTo').optional({ checkFalsy: true }).isISO8601(),
  query('search').optional({ checkFalsy: true }).isString().isLength({ max: 100 }),
  // ⬇️ admin only — controller/service handle it
  query('userId').optional({ checkFalsy: true }).isString()
];
