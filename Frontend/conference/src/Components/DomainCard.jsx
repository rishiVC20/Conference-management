import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import RoomCard from "./RoomCard";

const DomainCard = ({ domain, rooms }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="border border-gray-300 rounded-md shadow-lg mb-4">
      <div
        className="flex justify-between items-center cursor-pointer p-4 bg-blue-100 hover:bg-blue-200"
        onClick={toggleExpand}
      >
        <h2 className="text-2xl font-bold text-blue-600">{domain}</h2>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {expanded && (
        <div className="space-y-4 mt-2 p-2">
          {Object.keys(rooms).map((room) => (
            <RoomCard key={room} room={room} schedule={rooms[room]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DomainCard;