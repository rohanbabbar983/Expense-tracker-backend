import { prisma } from '../db/prismaClient.js';
import { invalidateCategories } from '../middlewares/cache.js';

export const listCategories = () => prisma.category.findMany({ orderBy: { name: 'asc' } });

export const createCategory = async (name) => {
  const cat = await prisma.category.create({ data: { name } });
  await invalidateCategories();
  return cat;
};

export const updateCategory = async (id, name) => {
  const cat = await prisma.category.update({ where: { id }, data: { name } });
  await invalidateCategories();
  return cat;
};

export const deleteCategory = async (id) => {
  const cat = await prisma.category.delete({ where: { id } });
  await invalidateCategories();
  return cat;
};
