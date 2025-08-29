import { body } from 'express-validator';
export const registerValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({ minLength: 8 }),
  body('name').isString().isLength({ min: 2, max: 60 })
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8 })
];
