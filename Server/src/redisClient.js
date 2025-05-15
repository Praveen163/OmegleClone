import { createClient } from 'redis';
import 'dotenv/config'
import { logger } from './logging/logger.js';
import { metrics } from './metrics/prometheusClient.js';

const client = createClient({
    password: process.env.REDIS_PWD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  });

client.on('connect', () => {
  logger.info('Redis client connected');
});

client.on('error', (err) => {
  logger.error('Redis client error', { error: err.message, stack: err.stack });
});

// Modified Redis client with metrics
const originalRedisMethod = client.originalMethod; // Replace with actual method names

// Example of wrapping Redis methods with metrics
const wrapRedisMethod = (methodName) => {
  const originalMethod = client[methodName];
  client[methodName] = async (...args) => {
    try {
      const result = await originalMethod.apply(client, args);
      metrics.redisOperationsTotal.inc({ operation: methodName, status: 'success' });
      return result;
    } catch (error) {
      metrics.redisOperationsTotal.inc({ operation: methodName, status: 'error' });
      throw error;
    }
  };
};

// Wrap common Redis methods
['get', 'set', 'del', 'hget', 'hset', 'incr', 'decr'].forEach(wrapRedisMethod);

export default client