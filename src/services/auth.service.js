import { prisma } from '../db/prismaClient.js';
import { hash, verify, signJwt } from '../utils/crypto.js';

export async function register({ email, password, name }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw Object.assign(new Error('Email already registered'), { status: 400 });
  const passwordHash = await hash(password);
  const user = await prisma.user.create({ data: { email, passwordHash, name, role: 'user' } });
  return safeUser(user);
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await verify(user.passwordHash, password);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const token = signJwt({ sub: user.id, role: user.role, email: user.email, name: user.name });
  return { token, user: safeUser(user) };
}

export function safeUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}
