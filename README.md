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

![tictactoe-speed](https://github.com/user-attachments/assets/4fa06433-972f-4a22-9cd9-0db7b5079290)


Here are some screenshots of the project:

### Login Page
<img src="https://github.com/user-attachments/assets/ca8843e7-c1c9-42f9-9e7a-ab7158e7514d" alt="Login Page"/>

### Game Room
<img src="https://github.com/user-attachments/assets/19757703-89c1-4c2e-9d28-906375a00d48" alt="Game Room"/>

### Constraints
<img src="https://github.com/user-attachments/assets/99fe6a8d-e4cb-4ab3-b709-42653614051b" alt="Constraints 1"/>
<img src="https://github.com/user-attachments/assets/94330fcc-4792-4b31-b95c-a2a3abec708d" alt="Constraints 2"/>
<img src="https://github.com/user-attachments/assets/0a75fdd0-23ac-43f8-8f5c-699bde6ce443" alt="Constraints 2"/>


---

## Requirements

To run this project locally, ensure you have the following installed:

- **Node.js** (v16+ recommended)  
- **NPM** or **Yarn**
- **A compatible browser for the client (modern browsers like Chrome or Firefox)**

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

