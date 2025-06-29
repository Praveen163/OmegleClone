import client from "../redisClient.js";
import { metrics } from '../metrics/prometheusClient.js';

async function isRateLimited(username, socket) {
    const rateLimitKey = `user:add:${username}`;
    const attempts = await client.incr(rateLimitKey);
    if (attempts === 1) {
        await client.expire(rateLimitKey, 60);
    }
    if (attempts > 8) {
        console.log(`Rate limit exceeded for user ${username}`);
        socket.emit("rateLimitExceeded", { message: "Too many attempts. Please try again later." });
        return true;
    }
    return false;
}

export default async function addUserTODb(socket) {
    try {
        const username = socket.username;
        // Check rate limit
        if (await isRateLimited(username, socket)) {
            return null;
        }

        console.log("-------------------------------- adding user to redis --------------------------------\nusername: ", username);
        const result = await client.rPush("users", JSON.stringify({
            socketId: socket.id,
            username: username
        }));
        
        // Increment the user signups counter
        metrics.userSignupsTotal.inc();
        
        return result;
    } catch (err) {
        console.log("err adding user to redis", err);
        socket.emit("errSelectingPair");
        throw err;
    }
}
