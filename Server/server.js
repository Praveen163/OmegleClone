import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import client from "./src/redisClient.js";
import { handelSocketConnection } from "./src/socketRoutes.js";
import 'dotenv/config'
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { logger, morganStream } from './src/logging/logger.js';
import prometheusMiddleware from 'express-prometheus-middleware';
import { register } from './src/metrics/prometheusClient.js';

const app = express();
const httpServer = createServer(app);

// Setup Morgan middleware for HTTP request logging
app.use(morgan('combined', { stream: morganStream }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many requests, please try again later.",
  handler: (req, res) => {
    // Access rate limit info from the store directly
    res.status(429).json({
      error: "Too many requests, please try again later.",
      windowMs: 1 * 60 * 1000, // 1 minute window
      maxRequests: 5
    });
  }
});

// Apply the rate limiter BEFORE defining routes
app.use(limiter);

// Now define routes after the middleware
app.get('/test-rate-limit', (req, res) => {
  // Access the rate limit info safely here
  const requestsRemaining = req.rateLimit ? req.rateLimit.remaining : 'N/A';
  const resetTime = req.rateLimit ? Math.ceil(req.rateLimit.resetTime / 1000) : 'N/A';
  
  res.json({
    message: "Rate limit test endpoint",
    requestsRemaining,
    resetTime
  });
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.PUBLIC_WEBSOCKET_URL || "http://localhost:5173"
  }
});

// Only validate username, no rate limiting here
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

client.connect()
  .then(() => console.log("database connected"))
  .catch(err => console.log("error connecting db", err))

io.on("connection", (socket) => {
  handelSocketConnection(io, socket)
})

// Add Prometheus middleware
app.use(prometheusMiddleware({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5, 2, 5],
  prefix: 'app_'
}));

// Add a metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

httpServer.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Global error handler', { 
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({ error: 'Internal Server Error' });
});