import * as redis from 'redis';

export type redisClient = redis.RedisClient;

const createRedisClient = (options: any): redis.RedisClient => {
  const host = process.env.REDIS_HOST || 'redis://localhost:6379';
  return redis.createClient(host);
};

export default {
  createRedisClient
};
