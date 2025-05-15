import promClient from 'prom-client';

// Create a Registry to register metrics
const register = new promClient.Registry();

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const socketConnectionsTotal = new promClient.Gauge({
  name: 'socket_connections_total',
  help: 'Total number of active socket connections'
});

const redisOperationsTotal = new promClient.Counter({
  name: 'redis_operations_total',
  help: 'Total number of Redis operations',
  labelNames: ['operation', 'status']
});

const userSignupsTotal = new promClient.Counter({
  name: 'user_signups_total',
  help: 'Total number of user signups'
});

// Register the metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(socketConnectionsTotal);
register.registerMetric(redisOperationsTotal);
register.registerMetric(userSignupsTotal);

export const metrics = {
  httpRequestDurationMicroseconds,
  socketConnectionsTotal,
  redisOperationsTotal,
  userSignupsTotal
};

export { register };