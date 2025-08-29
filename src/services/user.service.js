import { prisma } from '../db/prismaClient.js';

export const listUsers = async ({ page = 1, limit = 20 }) => {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    }),
    prisma.user.count()
  ]);
  return { page: Number(page), limit: Number(limit), total, items };
};
