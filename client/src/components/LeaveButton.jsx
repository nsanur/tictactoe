import React from 'react';

const LeaveButton = ({ onLeave }) => {


  const handleLeave = () => {
    onLeave(); // Oyundan çıkma işlemi yapılacak
  };

  return (
    <button
      onClick={handleLeave}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Leave
    </button>
  );
};

export default LeaveButton;
