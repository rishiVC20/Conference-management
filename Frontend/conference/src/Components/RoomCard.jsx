import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ScheduleCard from "./ScheduleCard";

const RoomCard = ({ room, schedule }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="border border-gray-300 rounded-md shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer p-3 bg-gray-100 hover:bg-gray-200"
        onClick={toggleExpand}
      >
        <h3 className="text-xl font-medium">{room}</h3>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {expanded && (
        <div className="space-y-2 mt-2 p-2">
          {schedule.map((slot, index) => (
            <ScheduleCard key={index} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCard;