import { prisma } from '../db/prismaClient.js';
import { invalidateAnalyticsForUser } from '../middlewares/cache.js';

export async function listTransactions({ user, query }) {
  const {
    page = 1, limit = 10, type, categoryId, dateFrom, dateTo, search, userId
  } = query;

  // Build user scope correctly:
  // - Admin + userId provided -> filter to that user
  // - Admin + no userId -> no user constraint (see ALL)
  // - Non-admin -> force own id
  const userScope =
    user.role === 'admin'
      ? (userId ? { userId } : {})           // <-- key change
      : { userId: user.id };

  const where = {
    ...userScope,
    ...(type ? { type } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(dateFrom || dateTo ? {
      occurredAt: {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {})
      }
    } : {}),
    ...(search ? {
      OR: [{ note: { contains: search, mode: 'insensitive' } }]
    } : {})
  };

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        category: true,
        user: { select: { id: true, email: true, name: true, role: true } }
      },
      orderBy: { occurredAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.transaction.count({ where })
  ]);

  return { page: Number(page), limit: Number(limit), total, items };
}

export async function getTransaction(id) {
  return prisma.transaction.findUnique({
    where: { id },
    include: { category: true, user: true }
  });
}

export async function createTransaction(userId, payload) {
  const txn = await prisma.transaction.create({ data: { ...payload, userId } });
  await invalidateAnalyticsForUser(userId);
  await invalidateAnalyticsAll(); // ALL scope becomes stale
  return txn;
}

export async function updateTransaction(id, userId, data) {
  const txn = await prisma.transaction.update({ where: { id }, data });
  await invalidateAnalyticsForUser(userId);
  await invalidateAnalyticsAll();
  return txn;
}

export async function removeTransaction(id, userId) {
  const txn = await prisma.transaction.delete({ where: { id } });
  await invalidateAnalyticsForUser(userId);
  await invalidateAnalyticsAll();
  return txn;
}

export async function getOwnerIdFromTxn(req) {
  const { id } = req.params;
  const txn = await prisma.transaction.findUnique({ where: { id }, select: { userId: true } });
  return txn?.userId;
}
