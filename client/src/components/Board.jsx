import React from 'react';
import { useGameStore } from '../store/gameStore';

export const Board = () => {
  const { board, socket, currentPlayer, playerName, winner } = useGameStore();

  const handleCellClick = (index) => {
    if (board[index] || winner || currentPlayer !== playerName) return;
    socket?.emit('move', { index });
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-72 h-72">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => handleCellClick(index)}
          disabled={!!cell || !!winner || currentPlayer !== playerName}
          className={`
            h-24 bg-white rounded-lg shadow-md text-4xl font-bold
            transition-all duration-200 flex items-center justify-center
            ${!cell && currentPlayer === playerName ? 'hover:bg-gray-50' : ''}
            ${cell === 'X' ? 'text-blue-600' : 'text-red-600'}
          `}
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default Board;