import React from 'react';
import { useGameStore } from '../store/gameStore';

export const GameStatus = () => {
  const { winner, currentPlayer, playerName } = useGameStore();

  return (
    <div className="text-center mb-8">
      {winner ? (
        <h2 className="text-2xl font-bold">
          {winner === 'draw' ? "It's a draw!" : `${winner} wins!`}
        </h2>
      ) : (
        <h2 className="text-2xl font-bold">
          {currentPlayer === playerName 
            ? "Your turn!"
            : `Waiting for ${currentPlayer}'s move...`}
        </h2>
      )}
    </div>
  );
};

export default GameStatus;