import React from 'react';
import { Trophy, User } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const PlayerList = () => {
  const { players, spectators } = useGameStore();

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Players</h2>
      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span>{player.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">{player.wins}</span>
            </div>
          </div>
        ))}
        
        {spectators.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-4">Spectators</h3>
            {spectators.map((spectator) => (
              <div key={spectator} className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>{spectator}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerList;