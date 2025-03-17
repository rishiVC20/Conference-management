import React from "react";
import ScheduleCard from "./ScheduleCard"; // Import the ScheduleCard component

const ScheduleList = ({ slots }) => {
  // Get the current time in "HH:MM AM/PM" format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const currentTime = getCurrentTime();

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Schedule</h2>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border border-gray-300 text-left">Time</th>
            <th className="p-3 border border-gray-300 text-left">Team ID</th>
            <th className="p-3 border border-gray-300 text-left">Presenter</th>
            <th className="p-3 border border-gray-300 text-left">Paper Title</th>
            <th className="p-3 border border-gray-300 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, index) => (
            <ScheduleCard key={index} slot={slot} currentTime={currentTime} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;