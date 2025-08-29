import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const hash = (plain) => argon2.hash(plain);
export const verify = (hashStr, plain) => argon2.verify(hashStr, plain);

export const signJwt = (payload) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

export const verifyJwt = (token) =>
  jwt.verify(token, config.jwt.secret);
