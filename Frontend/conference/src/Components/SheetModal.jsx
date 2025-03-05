import React from "react";

const SheetModal = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Session Details</h2>
        <p><strong>Time:</strong> {session.time}</p>
        <p><strong>Team ID:</strong> {session.teamID}</p>
        <p><strong>Presenter(s):</strong> {session.presenter}</p>
        <p><strong>Paper Title:</strong> {session.paperTitle}</p>
        <p><strong>Synopsis:</strong> {session.synopsis}</p>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SheetModal;
