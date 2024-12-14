import { create } from 'zustand';

// Define the initial state and actions
export const useGameStore = create((set) => ({
  socket: null, // WebSocket instance
  board: Array(9).fill(''), // Tic-Tac-Toe board
  currentPlayer: '', // ID of the current player
  players: [], // List of players with their details
  spectators: [], // List of spectators
  winner: null, // Winner ID or null if no winner yet
  playerName: '', // Name of the current player
  isConnected: false, // Connection status to the server
  error: null, // Error message if any

  // Actions to update the state
  setSocket: (socket) => set({ socket }),
  setBoard: (board) => set({ board }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setPlayers: (players) => set({ players }),
  setSpectators: (spectators) => set({ spectators }),
  setWinner: (winner) => set({ winner }),
  setPlayerName: (name) => set({ playerName: name }),
  setIsConnected: (status) => set({ isConnected: status }),
  setError: (error) => set({ error }),

  // Reset the game state
  reset: () => set({
    board: Array(9).fill(''),
    currentPlayer: '',
    winner: null,
    error: null,
    playerName: '', // Reset playerName here
  }),
}));  
