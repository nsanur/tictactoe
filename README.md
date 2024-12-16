# Tic-Tac-Toe Multiplayer Game

This project is a **multiplayer Tic-Tac-Toe game** that supports up to 4 players connected to a central server. The game offers real-time gameplay for participants and spectators, along with features like stats tracking and smooth user experience.

---

## Features

- **Real-time multiplayer gameplay** for up to 4 players. (2 players and 2 spectators)
- **Spectator mode** to watch live matches.
- **Stats tracking** for wins and losses.
- **Mobile-friendly interface** with a minimalist design.
- **Dynamic room management** for multiple games simultaneously.

---

## Preview

Here are some screenshots of the project:

### Login Page
<img src="https://github.com/user-attachments/assets/8fc2c1b9-98ed-4005-a859-a0487a240564" alt="Login Page" />

### Game Room
<img src="https://github.com/user-attachments/assets/c67db50b-6412-4292-9103-456ec1ca33d8" alt="Game Room" />

### Constraints
<img src="https://github.com/user-attachments/assets/dbe77ef4-1699-4f12-b0d5-5d5fe965b3e2" alt="Constraints 1" />
<img src="https://github.com/user-attachments/assets/49153550-9ba1-47b9-8d82-3f95fa6f7671" alt="Constraints 2" />



---

## Requirements

To run this project locally, ensure you have the following installed:

- **Node.js** (v16+ recommended)  
- **NPM** or **Yarn**

---

## Setup and Run

Follow these steps to set up and run the project:


### Client (Frontend)

1. **Install client dependencies**:
   ```bash

   cd client
   
   npm install

   npm run build

   npm run dev
### Server (Backend)

2. **Install server dependencies**:
   ```bash

   cd server
   
   npm install

   npm start
   
## Project Structure
  ```bash
   root/
├── client/      # Frontend (React + Vite)
├── server/      # Backend (Node.js + Socket.io)
└── README.md    # Project documentation

