import pino from 'pino';
export const logger = pino({
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  level: 'info'
});
