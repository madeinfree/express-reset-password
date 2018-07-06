import * as redis from 'redis';

const createRedisClient = (options: any): redis.RedisClient => {
  const host = process.env.REDIS_HOST || 'redis://localhost:6379';
  return redis.createClient(host);
};

export default {
  createRedisClient
};
