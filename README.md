# Real-Time Chat App

A full-stack real-time chat application using React (frontend) and Node.js + Express + Socket.io (backend).

## Features
- Join a room with a username and optional room number
- Real-time messaging via Socket.io
- See online users in the same room
- Notifications for join/leave events
- Admin broadcast messages (optional)
- All data stored in memory (resets on server restart)

## Project Structure
```
chat-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── UserList.jsx
│   │   ├── App.jsx
│   │   ├── index.jsx
│   ├── package.json
│   ├── yarn.lock
│   ├── tailwind.config.js
│   └── README.md
└── backend/
	├── server.js
	├── package.json
	├── yarn.lock
	└── README.md
```

## Setup & Run

### 1. Backend
```bash
cd backend
yarn install
yarn start
```
- Runs on http://localhost:5000

### 2. Frontend
```bash
cd frontend
yarn install
yarn dev
```
- Runs on http://localhost:3000

## Usage
- Open http://localhost:3000 in multiple tabs/windows
- Enter a username and (optionally) a room
- Chat in real time with others in the same room

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Socket.io-client
- Backend: Node.js, Express, Socket.io

## Notes
- All chat data and users are stored in memory and reset on server restart
- No database required
- Admin broadcast available via backend event

---
# learning-next-js
