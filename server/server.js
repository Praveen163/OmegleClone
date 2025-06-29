import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import client from "./src/redisClient.js";
import { handelSocketConnection } from "./src/socketRoutes.js";
import 'dotenv/config'
import morgan from 'morgan';
import { logger, morganStream } from './src/logging/logger.js';
import prometheusMiddleware from 'express-prometheus-middleware';
import { register } from './src/metrics/prometheusClient.js';

const app = express();
const httpServer = createServer(app);

// Setup Morgan middleware for HTTP request logging
app.use(morgan('combined', { stream: morganStream }));

// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.PUBLIC_WEBSOCKET_URL || "http://localhost:5173"
//   }
// });

const io = new Server(httpServer)


io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  console.log("-----------------------------------------------------\n Socket connection \n-----------------------------------------")
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

client.connect()
  .then(() => console.log("--------------------------------\ndatabase connected\n--------------------------------"))
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

// metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

httpServer.listen(process.env.PORT || 5000, () => {
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