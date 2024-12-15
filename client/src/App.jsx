import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useGameStore } from './store/gameStore';
import Board from './components/Board';
import PlayerList from './components/PlayerList';
import GameStatus from './components/GameStatus';
import Login from './components/Login';
import LeaveButton from './components/LeaveButton';

const App = () => {
  // Get state and actions from game store
  const {
    setSocket,
    isConnected,
    playerName,
    setIsConnected,
    setBoard,
    setCurrentPlayer,
    setPlayers,
    setSpectators,
    setWinner,
    setPlayerName,
    setError,
    reset
  } = useGameStore();

  // Handle player leaving the game
  const handleLeave = () => {
    const socket = useGameStore.getState().socket;
    if (socket) {
      socket.emit('leave');
    }
    // Reset all game state
    reset();
    setPlayerName('');
    setPlayers([]);
    setSpectators([]);
    setWinner(null);
  };

  // Setup socket connection and event handlers
  useEffect(() => {
    const SOCKET_URL = import.meta.env.PROD
      ? 'https://tictactoe-4n35.onrender.com'
      : 'http://localhost:3001';

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    // Game events
    newSocket.on('spectatorPromoted', ({ playerName }) => {
      if (playerName === useGameStore.getState().playerName) {
        newSocket.emit('updatePlayerId', { playerName });
      }
    });

    newSocket.on('gameState', ({ board, currentPlayer, players, spectators, winner }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setPlayers(players);
      setSpectators(spectators);
      setWinner(winner);
    });

    newSocket.on('joinSuccess', ({ name }) => {
      setPlayerName(name);
      setError(null);
    });

    newSocket.on('error', ({ message }) => {
      setError(message);
    });

    newSocket.on('gameReset', () => {
      reset();
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle page visibility and unload events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleLeave();
      }
    };

    const handleBeforeUnload = (e) => {
      handleLeave();
      e.preventDefault();
      e.returnValue = '';
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleLeave);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleLeave);
    };
  }, []);

  // Show loading state
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Connecting to server...</div>
      </div>
    );
  }

  // Render game or login
  return (
    <div className="min-h-screen bg-gray-50">
      {!playerName ? (
        <Login />
      ) : (
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
            <PlayerList />
            <div className="flex flex-col items-center">
              <GameStatus />
              <Board />
              <LeaveButton onLeave={handleLeave} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
