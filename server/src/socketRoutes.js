import { processUserPairing, soloUserLeftTheChat } from "./userConstroller/userController.js"
import { logger } from './logging/logger.js';
import { metrics } from './metrics/prometheusClient.js';

export function handelSocketConnection(io, socket) {
    // Increment the connections counter
    metrics.socketConnectionsTotal.inc();
    
    // pairing
    console.log("socket.id", socket.id);
    console.log("HANDLING SOCKET CONNECTION");
    socket.on("startConnection", () => processUserPairing(io, socket));
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
