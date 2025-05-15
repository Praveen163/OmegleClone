import client from '../redisClient.js'; // Make sure to import your Redis client

const RATE_LIMIT = 70; // Maximum number of requests
const RATE_LIMIT_PERIOD = 60; // Time period in seconds

/**
 * Rate limiting middleware for socket.io
 * @param {Object} socket - The socket object
 * @param {Function} next - The next function to call if rate limit is not exceeded
 * @param {Function} onLimitExceeded - The function to call when rate limit is exceeded
 */
export async function checkRateLimit(socket, next, onLimitExceeded) {
    const rateKey = `ratelimit:pair:${socket.id}`;
    
    try {
        // Get current count of requests within time period
        const currentCount = await client.get(rateKey) || 0;
        
        if (parseInt(currentCount) >= RATE_LIMIT) {
            socket.emit("errMakingPair", "Rate limit exceeded. Please try again later.");
            console.log("Rate limit exceeded");
            onLimitExceeded();
            return; // Don't call next, effectively blocking the action
        }
        
        // Increment the counter
        await client.incr(rateKey);
        
        // Set expiry if it's a new key
        if (currentCount == 0) {
            await client.expire(rateKey, RATE_LIMIT_PERIOD);
        }
        
        // Call next to allow the event handler to proceed
        next();
    } catch (err) {
        console.error("Error checking rate limit:", err);
        next(); // Call next even on errors to avoid blocking on rate limiting failures
    }
}