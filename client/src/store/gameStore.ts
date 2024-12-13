import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
}

interface GameState {
  socket: Socket | null;
  board: string[];
  currentPlayer: string;
  players: Player[];
  spectators: string[];
  winner: string | null;
  playerName: string;
  isConnected: boolean;
  error: string | null;
  setSocket: (socket: Socket) => void;
  setBoard: (board: string[]) => void;
  setCurrentPlayer: (player: string) => void;
  setPlayers: (players: Player[]) => void;
  setSpectators: (spectators: string[]) => void;
  setWinner: (winner: string | null) => void;
  setPlayerName: (name: string) => void;
  setIsConnected: (status: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  socket: null,
  board: Array(9).fill(''),
  currentPlayer: '',
  players: [],
  spectators: [],
  winner: null,
  playerName: '',
  isConnected: false,
  error: null,
  setSocket: (socket) => set({ socket }),
  setBoard: (board) => set({ board }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setPlayers: (players) => set({ players }),
  setSpectators: (spectators) => set({ spectators }),
  setWinner: (winner) => set({ winner }),
  setPlayerName: (name) => set({ playerName: name }),
  setIsConnected: (status) => set({ isConnected: status }),
  setError: (error) => set({ error }),
  reset: () => set({
    board: Array(9).fill(''),
    currentPlayer: '',
    winner: null,
    error: null
  })
}));