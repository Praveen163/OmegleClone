import { useRef, useEffect } from "react";
import './messageBox.css'; // Make sure to create this CSS file

export default function MessagBox({ message, username, socket, setMessage, strangerUsername, strangerUserId, connectionStatus }) {

    const scrollMessageDiv = useRef(null)

    useEffect(() => {
        scrollMessageDiv.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [message])

    useEffect(() => {
        if (socket) {
            socket.on("private message", ({ content, from }) => {
                if (strangerUserId === from) {
                    setMessage(prevMessages => [...prevMessages, content]);
                }
            })

            return () => {
                socket.removeAllListeners("private message")
            }
        }
    }, [strangerUserId])

    return (
        <div id="messageBox">
            {(connectionStatus !== null && message.length === 0) && (
                <div id="overlayStatus">
                    {connectionStatus ? (
                        <p>{username} is connected with {strangerUsername}</p>
                    ) : (
                        <p>Looking For Stranger...</p>
                    )}
                </div>
            )}
            {message.map((item, index) => {
                const isCurrentUser = item.username === username;
                
                return (
                    <div 
                        key={index} 
                        className={`message ${isCurrentUser ? 'sent-message' : 'received-message'}`}
                    >
                        <div className="message-content">{item.message}</div>
                        {item.timestamp && (
                            <div className="message-timestamp">{item.timestamp}</div>
                        )}
                    </div>
                );
            })}
            <div ref={scrollMessageDiv}></div>
        </div>
    )
}