// Import required modules
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Setup file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create HTTP server and configure Socket.IO
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://tictactoe-eosin-rho.vercel.app",
    methods: ["GET", "POST"]
  }
});

// Initial game state
const gameState = {
  board: Array(9).fill(''),
  currentPlayer: '',
  players: [],
  spectators: [],
  winner: null
};

// Rate limiting for moves
const moveTimeouts = new Map();

// Check for winning combinations
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // Check for draw
  if (board.every(cell => cell !== '')) return 'draw';
  return null;
};

// Reset game state
const resetGame = (resetWins = false) => {
  // Reset wins if needed (new player joining)
  if (resetWins) {
    gameState.players.forEach(player => {
      player.wins = 0;
      player.losses = 0;
    });
  }

  // Reset board and game state
  gameState.board = Array(9).fill('');
  gameState.winner = null;
  
  // Set current player if we have enough players
  if (gameState.players.length < 2) {
    gameState.currentPlayer = '';
  } else {
    gameState.currentPlayer = gameState.players[0].name;
  }

  // Update all clients
  io.emit('gameState', gameState);
};

// Socket connection handling
io.on('connection', (socket) => {
  // Handle player joining
  socket.on('join', ({ name }) => {
    // Validate username length
    if (name.length > 10) {
      socket.emit('error', { message: 'Username can be at most 10 characters long.' });
      return;
    }

    // Check for duplicate names
    if (gameState.players.some(p => p.name === name)) {
      socket.emit('error', { message: 'Username is already taken.' });
      return;
    }

    // Check room capacity
    if (gameState.players.length === 2 && gameState.spectators.length >= 2) {
      socket.emit('error', { message: 'The room is full. Spectator limit reached.' });
      return;
    }

    // Create new player object
    const player = {
      id: socket.id,
      name,
      wins: 0,
      losses: 0
    };

    // Add as player or spectator
    if (gameState.players.length < 2) {
      gameState.players.push(player);
      if (gameState.players.length === 1) {
        gameState.currentPlayer = name;
      }
    } else {
      gameState.spectators.push(name);
    }

    socket.data.name = name;
    socket.emit('joinSuccess', { name });
    io.emit('gameState', gameState);
  });

  // Handle game moves
  socket.on('move', ({ index }) => {
    // Rate limiting
    const lastMove = moveTimeouts.get(socket.id);
    const now = Date.now();
    if (lastMove && now - lastMove < 500) return;
    moveTimeouts.set(socket.id, now);

    // Validate move
    const player = gameState.players.find(p => p.id === socket.id);
    if (!player || player.name !== gameState.currentPlayer || gameState.board[index]) return;

    // Make move
    const symbol = gameState.players.indexOf(player) === 0 ? 'X' : 'O';
    gameState.board[index] = symbol;

    // Check for winner
    const winner = checkWinner(gameState.board);
    if (winner) {
      gameState.winner = winner;
      if (winner !== 'draw') {
        const winningPlayer = gameState.players.find(p => p.name === gameState.currentPlayer);
        const losingPlayer = gameState.players.find(p => p.name !== gameState.currentPlayer);
        if (winningPlayer) winningPlayer.wins++;
        if (losingPlayer) losingPlayer.losses++;
      }
      setTimeout(resetGame, 3000);
    } else {
      // Switch turns
      const nextPlayerIndex = (gameState.players.indexOf(player) + 1) % 2;
      gameState.currentPlayer = gameState.players[nextPlayerIndex].name;
    }

    io.emit('gameState', gameState);
  });

  // Handle player leaving
  socket.on('leave', () => {
    const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      const playerName = gameState.players[playerIndex].name;
      gameState.players.splice(playerIndex, 1);

      // Promote spectator if available
      if (gameState.spectators.length > 0) {
        const newPlayer = {
          id: '',
          name: gameState.spectators[0],
          wins: 0,
          losses: 0
        };
        gameState.players.push(newPlayer);
        gameState.spectators.shift();
        io.emit('spectatorPromoted', { playerName: newPlayer.name });
        resetGame(true);
      } else {
        resetGame();
      }

      console.log(`${playerName} has left the game.`);
    } else {
      gameState.spectators = gameState.spectators.filter(name => name === socket.data.name);
    }

    io.emit('gameState', gameState);
    socket.emit('redirectToHomePage');
  });

  // Handle spectator promotion
  socket.on('updatePlayerId', ({ playerName }) => {
    const player = gameState.players.find(p => p.name === playerName);
    if (player) {
      player.id = socket.id;
      io.emit('gameState', gameState);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      const leavingPlayer = gameState.players[playerIndex];
      console.log(`Player ${leavingPlayer.name} disconnected`);
      
      gameState.players = gameState.players.filter(p => p.id !== socket.id);

      if (gameState.spectators.length > 0) {
        const newPlayer = {
          id: '',
          name: gameState.spectators[0],
          wins: 0,
          losses: 0
        };
        gameState.players.push(newPlayer);
        gameState.spectators.shift();
        io.emit('spectatorPromoted', { playerName: newPlayer.name });
      }
      resetGame(true);
    } else {
      gameState.spectators = gameState.spectators.filter(name => name !== socket.data.name);
    }
    
    io.emit('gameState', gameState);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
