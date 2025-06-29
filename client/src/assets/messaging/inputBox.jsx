import './inputBox.css'; // Make sure to create this CSS file
import { useState } from "react";

export default function InputBox({ socket, setMessage, strangerUserId, username, setUpdateUser }) {

    const [messageInputValue, setMessageInputValue] = useState('')

    function sendMessage(e) {
        e.preventDefault()
        socket.emit("private message", {
            content: {
                username: username,
                message: messageInputValue,
                userid: socket.id
            },
            to: strangerUserId
        })

        setMessage(prevMessages => [...prevMessages, {
            username: username,
            message: messageInputValue,
        }]);
        setMessageInputValue("")
    }

    function getNewUser(e) {
        e.preventDefault()
        setUpdateUser(prev => prev + 1)
    }

    return (
        <div className="input-box-container">
            <form onSubmit={sendMessage} className="input-form">
                <input type="button" value="ESC" id="changeNewUser" onClick={getNewUser} />
                <input
                    type="text"
                    name="sendMessage"
                    id="sendMessageBox"
                    value={messageInputValue}
                    onChange={(e) => setMessageInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    )
}