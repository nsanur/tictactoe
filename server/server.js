import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express server oluşturuluyor
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://tictactoe-byn.netlify.app",
    methods: ["GET", "POST"]
  }
});

// React build dosyalarını sunmak için
app.use(express.static(join(__dirname, 'client', 'build')));

const gameState = {
  board: Array(9).fill(''),
  currentPlayer: '',
  players: [],
  spectators: [],
  winner: null
};

// Kazananı kontrol eden fonksiyon
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // satırlar
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // sütunlar
    [0, 4, 8], [2, 4, 6] // çaprazlar
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== '')) return 'draw';
  return null;
};

// Oyunu sıfırlama fonksiyonu
const resetGame = () => {
  gameState.board = Array(9).fill('');
  gameState.winner = null;
  gameState.currentPlayer = gameState.players[0]?.name || '';
  io.emit('gameState', gameState);
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Oyuncu katıldığında
  socket.on('join', ({ name }) => {
    if (gameState.players.some(p => p.name === name)) {
      socket.emit('error', { message: 'Name already taken' });
      return;
    }

    const player = {
      id: socket.id,
      name,
      wins: 0,
      losses: 0
    };

    if (gameState.players.length < 2) {
      gameState.players.push(player);
      if (gameState.players.length === 1) {
        gameState.currentPlayer = name;
      }
    } else {
      gameState.spectators.push(name);
    }

    socket.emit('joinSuccess', { name });
    io.emit('gameState', gameState);
  });

  // Hamle yapıldığında
  socket.on('move', ({ index }) => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (!player || player.name !== gameState.currentPlayer || gameState.board[index]) return;

    const symbol = gameState.players.indexOf(player) === 0 ? 'X' : 'O';
    gameState.board[index] = symbol;

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
      const nextPlayerIndex = (gameState.players.indexOf(player) + 1) % 2;
      gameState.currentPlayer = gameState.players[nextPlayerIndex].name;
    }

    io.emit('gameState', gameState);
  });

  // Bağlantı kesildiğinde
  socket.on('disconnect', () => {
    const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      gameState.players.splice(playerIndex, 1);
      if (gameState.spectators.length > 0) {
        const newPlayer = {
          id: '',
          name: gameState.spectators[0],
          wins: 0,
          losses: 0
        };
        gameState.players.push(newPlayer);
        gameState.spectators.shift();
      }
      resetGame();
    } else {
      const spectatorName = gameState.spectators.find(name => name === socket.data.name);
      if (spectatorName) {
        gameState.spectators = gameState.spectators.filter(name => name !== spectatorName);
      }
    }
    io.emit('gameState', gameState);
  });
});

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
