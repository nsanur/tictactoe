import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useGameStore } from './store/gameStore';
import Board from './components/Board';
import PlayerList from './components/PlayerList';
import GameStatus from './components/GameStatus';
import Login from './components/Login';
import LeaveButton from './components/LeaveButton';

const App = () => {
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
    setConnectionError,
    reset,
    cleanup
  } = useGameStore();

  useEffect(() => {
    const SOCKET_URL = import.meta.env.PROD
      ? 'https://tictactoe-4n35.onrender.com'
      : 'http://localhost:3001';
    
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('connect_error', (error) => {
      setConnectionError('Connection failed. Please try again.');
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => setIsConnected(false));

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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const socket = useGameStore.getState().socket;
        if (socket) {
          socket.emit('leave');
        }
      }
    };

    const handleBeforeUnload = () => {
      const socket = useGameStore.getState().socket;
      if (socket) {
        socket.emit('leave');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      newSocket.disconnect();
      cleanup();
    };
  }, []);

  const handleLeave = () => {
    const socket = useGameStore.getState().socket;
    if (socket) {
      socket.emit('leave');
    }
    cleanup();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Connecting to server...</div>
      </div>
    );
  }

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
