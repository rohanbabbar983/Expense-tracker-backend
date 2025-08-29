// src/services/analytics.service.js
import { prisma } from '../db/prismaClient.js';
import { Prisma } from '@prisma/client'; // <-- import Prisma namespace

export async function monthlyOverview({ requester, year, targetUserId }) {
  const start = new Date(`${year}-01-01T00:00:00Z`);
  const end = new Date(`${year}-12-31T23:59:59Z`);

  // Scope:
  // - Admin + no target -> ALL users
  // - Admin + target    -> that user
  // - Non-admin         -> own userId
  const userScope =
    requester.role === 'admin'
      ? (targetUserId ? { userId: targetUserId } : {})
      : { userId: requester.id };

  // Totals by type
  const data = await prisma.transaction.groupBy({
    by: ['type'],
    _sum: { amount: true },
    where: {
      ...userScope,
      occurredAt: { gte: start, lte: end }
    }
  });

  // Trends per month by type
  const byMonth = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', "occurredAt") AS month,
      type,
      SUM(amount)::numeric AS total
    FROM "Transaction"
    WHERE "occurredAt" BETWEEN ${start} AND ${end}
      ${userScope.userId ? Prisma.sql`AND "userId" = ${userScope.userId}` : Prisma.empty}
    GROUP BY 1, 2
    ORDER BY 1 ASC;
  `;

  // Category breakdown (expenses only)
  const byCategory = await prisma.$queryRaw`
    SELECT COALESCE(c.name, 'Uncategorized') AS name, SUM(t.amount)::numeric AS total
    FROM "Transaction" t
    LEFT JOIN "Category" c ON c.id = t."categoryId"
    WHERE t.type = 'expense'
      AND t."occurredAt" BETWEEN ${start} AND ${end}
      ${userScope.userId ? Prisma.sql`AND t."userId" = ${userScope.userId}` : Prisma.empty}
    GROUP BY name
    ORDER BY total DESC;
  `;

  return {
    totals: {
      income: (data.find(d => d.type === 'income')?._sum.amount ?? 0).toString(),
      expense: (data.find(d => d.type === 'expense')?._sum.amount ?? 0).toString()
    },
    trends: byMonth.map(r => ({ month: r.month, type: r.type, total: r.total })),
    categoryBreakdown: byCategory.map(r => ({ name: r.name, total: r.total }))
  };
}
