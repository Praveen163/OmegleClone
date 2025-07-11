### ⚠️ **Note**
> 🟡 **This app is deployed on Amazon AWS without an SSL certificate** (i.e., served over **HTTP only**).  
> 📸 Because of this, **some browsers might block camera permissions**.  
> 💬 **However, the chat functionality will still work fine.**



# Omegle Clone

A full-stack real-time chat application inspired by Omegle, allowing users to connect and chat (text and video) with random strangers. The project is containerized using Docker and includes monitoring with Prometheus and Grafana.

---

## Features

- **Anonymous Chat**: Connect with random users for text and video chat.
- **WebRTC Video Calls**: Peer-to-peer video communication using WebRTC.
- **Real-time Messaging**: Instant messaging with Socket.IO.
- **User Pairing**: Random user matching logic.
- **Connection Status**: Live status bar for connection updates.
- **Device Switching**: Change camera during video calls.
- **Monitoring**: Prometheus metrics and Grafana dashboards for observability.
- **Dockerized**: All services run in containers for easy setup.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Socket.IO Client, WebRTC
- **Backend**: Node.js, Express, Socket.IO, Redis, Prometheus, Winston (logging)
- **Database**: Redis (for user/session management)
- **Monitoring**: Prometheus, Grafana
- **Reverse Proxy**: Nginx
- **Containerization**: Docker, Docker Compose

---

## Architecture

```
[Client (React)] <-> [Nginx] <-> [Server (Node.js/Express)] <-> [Redis]
                                         |                
                                         v                
                                [Prometheus, Grafana]
```
- **Nginx** proxies requests to the client, server, and monitoring tools.
- **Server** handles user pairing, messaging, and video signaling.
- **Redis** stores user/session data for fast access.
- **Prometheus** scrapes metrics from the server; **Grafana** visualizes them.

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Omegle
   ```
2. **Start all services:**
   ```bash
   docker-compose up --build
   ```
3. **Access the app:**
   - Frontend: [http://localhost](http://localhost)
   - Grafana: [http://localhost/grafana](http://localhost/grafana)
   - Prometheus: [http://localhost/prometheus](http://localhost/prometheus)

---

## Project Structure

```
Omegle/
  client/      # React frontend
  server/      # Node.js backend
  nginx/       # Nginx reverse proxy config
  docker-compose.yml
  README.md
```

---

## Monitoring & Observability
- **Prometheus** scrapes metrics from `/metrics` endpoint on the server.
- **Grafana** provides dashboards (see `server/grafana-dashboard.json`).
- **Logs** are managed with Winston and viewable in the server container.

---

## Development

### Frontend
```bash
cd client
npm install
npm run dev
```

### Building the Client
```bash
cd client
npm run build
```

### Testing the Client
```bash
cd client
npm test
```

### Backend
```bash
cd server
npm install
npm start
```

---


## License
Developed by Praveen Kumar
This project is for educational purposes only and is not affiliated with Omegle.
