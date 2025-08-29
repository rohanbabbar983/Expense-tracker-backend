import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
const prisma = new PrismaClient();

async function main() {
  const categories = ['Food','Transport','Entertainment','Rent','Utilities','Shopping','Salary','Investments'];
  await Promise.all(categories.map(name => prisma.category.upsert({
    where: { name }, update: {}, create: { name }
  })));

  const adminPwd = await argon2.hash('Admin@123');
  const userPwd = await argon2.hash('User@123');
  const roPwd = await argon2.hash('Read@123');

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Admin', passwordHash: adminPwd, role: 'admin' }
  });
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { email: 'user@example.com', name: 'User', passwordHash: userPwd, role: 'user' }
  });
  await prisma.user.upsert({
    where: { email: 'readonly@example.com' },
    update: {},
    create: { email: 'readonly@example.com', name: 'ReadOnly', passwordHash: roPwd, role: 'read_only' }
  });
}
main().finally(() => prisma.$disconnect());
