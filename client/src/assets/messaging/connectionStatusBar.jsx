import React from 'react';
import './connectionStatusBar.css';

export default function ConnectionStatusBar({ strangerUsername }) {
  return (
    <div className="connection-status-container">
      <div className={`status-indicator ${strangerUsername ? 'connected' : 'searching'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {strangerUsername 
            ? `Connected with ${strangerUsername}` 
            : 'Searching for someone to chat with...'}
        </span>
      </div>
    </div>
  );
}