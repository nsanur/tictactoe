import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const Login = () => {
  const [name, setName] = useState('');
  const { socket, error } = useGameStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      socket?.emit('join', { name: name.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Join Tic-Tac-Toe</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;