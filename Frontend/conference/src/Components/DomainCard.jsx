import React from "react";
import RoomCard from "./RoomCard";

const DomainCard = ({ domain, rooms }) => {
  return (
    <div className="border border-gray-400 rounded-md p-4">
      <h2 className="text-2xl font-semibold mb-4">{domain}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room, index) => (
          <RoomCard key={index} room={room.room} schedule={room.schedule} />
        ))}
      </div>
    </div>
  );
};

export default DomainCard;
