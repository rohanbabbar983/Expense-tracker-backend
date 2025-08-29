import { param, query, body } from 'express-validator';

export const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
];

export const idParam = [param('id').isString().isLength({ min: 10 })];

export const handleValidation = async (req, res, next) => {
  const { validationResult } = await import('express-validator');
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ errors: result.array() });
  next();
};
