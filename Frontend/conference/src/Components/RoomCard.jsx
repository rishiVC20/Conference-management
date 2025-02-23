import React from "react";
import ScheduleCard from "./ScheduleCard";

const RoomCard = ({ room, schedule }) => {
  return (
    <div className="border border-gray-300 rounded-md p-4 shadow-sm">
      <h3 className="text-xl font-medium mb-3">{room}</h3>
      <div className="space-y-2">
        {schedule.map((slot, index) => (
          <ScheduleCard key={index} slot={slot} />
        ))}
      </div>
    </div>
  );
};

export default RoomCard;
