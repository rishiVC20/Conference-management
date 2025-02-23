import React from "react";

const ConferenceSchedule = () => {
  // Generate all time slots from 9:00 to 16:00 in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const data = {
    AI: [
      {
        room: "Room 1",
        schedule: [
          {
            time: "9:00",
            teamID: "T001",
            presenter: "Alice Smith",
            paperTitle: "AI in Healthcare",
            synopsis: "A study on AI...",
          },
          // ... rest of the data
        ],
      },
      // ... other rooms
    ],
    Cloud: [
      /* ... */
    ],
    Blockchain: [
      /* ... */
    ],
    ML: [
      /* ... */
    ],
  };

  // Get all rooms across all categories
  const getAllRooms = () => {
    const rooms = [];
    Object.entries(data).forEach(([category, categoryRooms]) => {
      categoryRooms.forEach((room) => {
        rooms.push({
          name: room.room,
          category: category,
        });
      });
    });
    return rooms;
  };

  const timeSlots = generateTimeSlots();
  const rooms = getAllRooms();

  // Find session for a specific room and time
  const findSession = (room, time) => {
    const category = Object.entries(data).find(([_, rooms]) =>
      rooms.some((r) => r.room === room.name)
    );

    if (!category) return null;

    const roomData = category[1].find((r) => r.room === room.name);
    if (!roomData) return null;

    return roomData.schedule.find((session) => session.time === time);
  };

  // Check if time slot is a break (11:00-11:20, 13:50-14:20)
  const isBreak = (time) => {
    const breaks = [
      { start: "11:00", end: "11:20" },
      { start: "13:50", end: "14:20" },
    ];

    return breaks.some((breakTime) => {
      return time >= breakTime.start && time < breakTime.end;
    });
  };

  return (
    <div className="max-w-full p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Conference Schedule
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-gray-800 text-white p-4 border-b-2 border-gray-600 min-w-[100px]">
                Time
              </th>
              {rooms.map((room, index) => (
                <th
                  key={index}
                  className="p-4 bg-gray-800 text-white border-b-2 border-gray-600 min-w-[200px]"
                >
                  <div className="font-bold">{room.name}</div>
                  <div className="text-sm text-gray-300">{room.category}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIndex) => {
              if (isBreak(time)) {
                return (
                  <tr key={timeIndex} className="bg-gray-100">
                    <td className="sticky left-0 z-10 p-4 font-medium text-gray-800 border border-gray-200 bg-gray-100">
                      {time} - Break
                    </td>
                    {rooms.map((_, roomIndex) => (
                      <td
                        key={roomIndex}
                        className="p-4 border border-gray-200 text-center text-gray-500 italic"
                      >
                        Break Time
                      </td>
                    ))}
                  </tr>
                );
              }

              return (
                <tr
                  key={timeIndex}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="sticky left-0 z-10 p-4 font-medium text-gray-800 border border-gray-200 bg-white">
                    {time}
                  </td>
                  {rooms.map((room, roomIndex) => {
                    const session = findSession(room, time);
                    return (
                      <td
                        key={roomIndex}
                        className="p-4 border border-gray-200"
                      >
                        {session ? (
                          <div className="bg-white shadow-md rounded-lg p-4 transform transition-all duration-200 hover:scale-105">
                            <div className="font-semibold text-blue-900 mb-2">
                              {session.paperTitle}
                            </div>
                            <div className="text-sm text-gray-700 flex items-center gap-2">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              {session.presenter}
                            </div>
                            <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
                              <span>{session.teamID}</span>
                              <span className="bg-blue-100 px-2 py-1 rounded-full">
                                {session.time}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm text-center">
                            No Session
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConferenceSchedule;
