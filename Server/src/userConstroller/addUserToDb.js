import client from "../redisClient.js";
import { metrics } from '../metrics/prometheusClient.js';

export default async function addUserTODb(socket) {
    try {
        const result = await client.rPush("users", JSON.stringify({
            socketId: socket.id,
            username: socket.username
        }));
        console.log("added", socket.username, "to redis", result);
        
        // Increment the user signups counter
        metrics.userSignupsTotal.inc();
        
        return result;
    } catch (err) {
        console.log("err adding user to redis", err);
        socket.emit("errSelectingPair");
        throw err;
    }
}
