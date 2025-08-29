import Redis from 'ioredis';
import { config } from './env.js';

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 2,
  enableReadyCheck: true
});

redis.on('connect', () => console.log('[redis] connected'));
redis.on('error', err => console.error('[redis] error', err));
