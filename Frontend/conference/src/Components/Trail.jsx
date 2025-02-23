import React from "react";

const Trail = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl w-full p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-t-2xl">
          <h2 className="text-xl font-semibold">
            AI & Machine Learning Conference
          </h2>
          <p className="text-sm opacity-90">📅 Feb 20, 2025 • 📍 Room A1</p>
        </div>

        {/* Schedule Details */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-indigo-600">10:30 AM</span>
            <h3 className="text-gray-800 text-lg font-medium">
              AI in Healthcare
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">Speaker: Dr. Jane Doe</p>

          <hr className="my-4 border-gray-300" />

          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-indigo-600">11:00 AM</span>
            <h3 className="text-gray-800 text-lg font-medium">
              Deep Learning Trends
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Speaker: Prof. John Smith
          </p>

          <hr className="my-4 border-gray-300" />

          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-indigo-600">11:30 AM</span>
            <h3 className="text-gray-800 text-lg font-medium">Break Time ☕</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Networking & Refreshments
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 py-3 px-6 rounded-b-2xl flex justify-between items-center">
          <button className="text-sm text-indigo-600 font-medium hover:underline">
            View More
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-indigo-700 transition">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trail;
