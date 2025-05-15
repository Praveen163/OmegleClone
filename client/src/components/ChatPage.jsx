import { useState, useRef } from 'react'
import LocalVideo from '../assets/videoCall/localVideo';
import RemoteVideo from '../assets/videoCall/remoteVideo';
import MessagBox from '../assets/messaging/messageBox';
import InputBox from '../assets/messaging/inputBox';

import useSocket from '../hooks/useSocket';
import usePeerConnection from '../hooks/usePeerConnection';
import ConnectionStatusBar from '../assets/messaging/connectionStatusBar';
import startWebRtcNegotiation from '../utils/startWebRtcNegotiation';
import ChangeLocalMediaStream from '../assets/videoCall/changeCam'
import './ChatPage.css';

const ChatPage = ({ username, setUsername }) => {
    const [message, setMessage] = useState([])
    const [peerConnection, setPeerConnection] = useState(null)
    const [ChangeCamOverly, setChangeCamOverly] = useState(null)
    const [updateUser, setUpdateUser] = useState(0)
    const [stream, setStream] = useState(null)
    const [selectedDeviceId, setSelectedDeviceId] = useState(null)
    const [strangerdata, setStrangerData] = useState(null)
    const localVideo = useRef(null)
    const remoteVideo = useRef(null)
    const { socket, strangerUserId, strangerUsername, connectionStatus } = useSocket(
        username, remoteVideo.current, setMessage, updateUser, peerConnection, setPeerConnection, setStrangerData)

    usePeerConnection(setPeerConnection)
    startWebRtcNegotiation(socket, strangerdata, peerConnection, stream)

    const handleSendMessage = (messageContent) => {
        // Add logic to send message
        // const newMessage = {
        //   content: messageContent,
        //   sender: currentUser,
        //   timestamp: new Date().toLocaleTimeString()
        // };
        // setMessages([...messages, newMessage]);
    };

    return (
        <div id='chatPage' className="omegle-style">
            <div className="omegle-header">
                <div className="logo">Omegle Clone</div>
                <h1 className="slogan">Talk to strangers!</h1>
                <div className="omegle-header-right">
                    <div className="social-buttons">
                        <a href="#" className="social-button-facebook" title="Share on Facebook">f</a>
                        <a href="#" className="social-button-twitter" title="Share on Twitter">t</a>
                    </div>
                </div>
            </div>
            
            <div className="chat-container">
                <div id='videoCall' className="video-container">
                    <ChangeLocalMediaStream
                        peerConnection={peerConnection}
                        localVideo={localVideo.current}
                        ChangeCamOverly={ChangeCamOverly}
                        setChangeCamOverly={setChangeCamOverly}
                        selectedDeviceId={selectedDeviceId}
                        setSelectedDeviceId={setSelectedDeviceId}
                        setStream={setStream}
                    />
                    <RemoteVideo
                        remoteVideo={remoteVideo}
                        peerConnection={peerConnection}
                        setChangeCamOverly={setChangeCamOverly}
                    />
                    <LocalVideo
                        localVideo={localVideo}
                        peerConnection={peerConnection}
                        setChangeCamOverly={setChangeCamOverly}
                        setStream={setStream}
                        stream={stream}
                        selectedDeviceId={selectedDeviceId}
                        socket={socket}
                        strangerUserId={strangerUserId}
                    />
                    
                </div>
                
                <div id='messaging' className="messaging-container">
                    <div className="connection-info">
                        <ConnectionStatusBar strangerUsername={strangerUsername} />
                        <div className="location-indicator">
                            {strangerUsername && "Location information"}
                        </div>
                    </div>
                    
                    <MessagBox
                        message={message}
                        username={username}
                        socket={socket}
                        setMessage={setMessage}
                        strangerUsername={strangerUsername}
                        strangerUserId={strangerUserId}
                        connectionStatus={connectionStatus}
                    />
                    
                    <div className="input-container">
                    
                        <InputBox
                            socket={socket}
                            setMessage={setMessage}
                            setUsername={setUsername}
                            setUpdateUser={setUpdateUser}
                            strangerUserId={strangerUserId}
                            username={username}
                            strangerUsername={strangerUsername}
                            onSendMessage={handleSendMessage}
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPage