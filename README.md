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
![Screenshot 2024-12-16 102130](https://github.com/user-attachments/assets/407adc12-f875-4532-ae43-5db02d454f60)

### Game Room
![Screenshot 2024-12-16 102643](https://github.com/user-attachments/assets/bf922b7d-d88d-4da1-831c-8892e3c94605)

### Constraints
![Screenshot 2024-12-16 102150](https://github.com/user-attachments/assets/eaa7eb12-ab1e-4b5f-abbd-7faa1c10fe06)
![Screenshot 2024-12-16 102934](https://github.com/user-attachments/assets/082046f0-ea82-4bb6-8371-8656b545ee2b)


---

## Requirements

To run this project locally, ensure you have the following installed:

- **Node.js** (v16+ recommended)  
- **NPM** or **Yarn**

---

## Setup and Run

Follow these steps to set up and run the project:


### 1. Client

1. **Install client dependencies**:
   ```bash

   cd client
   
   npm install

   npm run build

   npm run dev

1. **Install server dependencies**:
   ```bash

   cd server
   
   npm install

   npm start

   root/
├── client/      # Frontend (React + Vite)
├── server/      # Backend (Node.js + Socket.io)
└── README.md    # Project documentation

