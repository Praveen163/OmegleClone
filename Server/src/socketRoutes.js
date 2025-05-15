import { processUserPairing, soloUserLeftTheChat } from "./userConstroller/userController.js"
import { checkRateLimit } from "./middleware/socketRateLimit.js"
import { logger } from './logging/logger.js';
import { metrics } from './metrics/prometheusClient.js';

export function handelSocketConnection(io, socket) {
    // Increment the connections counter
    metrics.socketConnectionsTotal.inc();
    
    // Track rate limit status for this socket
    socket.isRateLimited = false;
    
    // Create middleware wrapper functions with proper rate limiting
    const withRateLimit = (eventHandler) => {
        return (...args) => {
            // If already rate limited, don't process the request
            if (socket.isRateLimited) {
                socket.emit('error', { message: 'Rate limit exceeded. Please wait before trying again.' });
                return;
            }
            
            const next = () => eventHandler(...args);
            const onLimitExceeded = () => {
                // Set rate limited state
                socket.isRateLimited = true;
                socket.emit('error', { message: 'Rate limit exceeded. Please wait before trying again.' });
                
                // Reset rate limit after cooldown period (e.g., 1 minute)
                setTimeout(() => {
                    socket.isRateLimited = false;
                }, 60000); // 60 seconds cooldown
            };
            
            checkRateLimit(socket, next, onLimitExceeded);
        };
    };

    // pairing
    socket.on("startConnection", withRateLimit(() => processUserPairing(io, socket)));
    socket.on("pairedUserLeftTheChat", to => io.to(to).emit("strangerLeftTheChat"));
    socket.on("soloUserLeftTheChat", () => soloUserLeftTheChat(socket));

    // exchanging video call data(offer and answer)
    socket.on('message', m => io.to(m.to).emit('message', m));

    // private message
    socket.on("private message", ({ content, to }) => io.to(to).emit("private message", {
        content: content,
        from: socket.id,
    }));

    socket.on('disconnect', () => {
        // Decrement the connections counter
        metrics.socketConnectionsTotal.dec();
        try {
            socket.removeAllListeners('startConnection');
            socket.removeAllListeners('pairedUserLeftTheChat');
            socket.removeAllListeners('soloUserLeftTheChat');
            socket.removeAllListeners('message');
            socket.removeAllListeners('private message');
            logger.info('Socket disconnected', { socketId: socket.id });
        } catch (error) {
            console.error(error);
        }
    });
}
