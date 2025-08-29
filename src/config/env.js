import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  dbUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d'
  },
  redisUrl: process.env.REDIS_URL,
  cacheTtl: {
    analytics: Number(process.env.CACHE_TTL_ANALYTICS ?? 900),
    categories: Number(process.env.CACHE_TTL_CATEGORIES ?? 3600)
  }
};
