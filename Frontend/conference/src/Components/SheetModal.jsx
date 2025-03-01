import React from "react";

const SheetModal = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Session Details</h2>
        <div className="space-y-2 text-gray-700">
          <p className="text-sm"><strong>Time:</strong> {session.time}</p>
          <p className="text-sm"><strong>Team ID:</strong> {session.teamID}</p>
          <p className="text-sm"><strong>Title:</strong> {session.paperTitle}</p>
          <p className="text-sm"><strong>Presenter:</strong> {session.presenter}</p>
          <p className="text-sm"><strong>Synopsis:</strong> {session.synopsis}</p>
        </div>
      </div>
    </div>
  );
};

export default SheetModal;
