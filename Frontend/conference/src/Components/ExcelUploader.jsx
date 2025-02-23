// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import ConferenceSchedule from "./ConferenceSchedule";

// const ExcelUploader = () => {
//   const [data, setData] = useState([]);
//   // 📌 Function to handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (!file) return;

//     const reader = new FileReader();
//     reader.readAsBinaryString(file);

//     reader.onload = (e) => {
//       const binaryString = e.target.result;
//       const workbook = XLSX.read(binaryString, { type: "binary" });

//       // Get first sheet data
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const parsedData = XLSX.utils.sheet_to_json(sheet);

//       setData(parsedData); // Store data in state
//     };
//   };
//   console.log(data);

//   const domainsData = [
//     {
//       TeamID: "T001",
//       Domain: "AI",
//       Presenter: "Alice Smith",
//       Paper: "AI in Healthcare",
//       Synopsis: "A study on AI...",
//     },
//     {
//       TeamID: "T002",
//       Domain: "AI",
//       Presenter: "Bob Johnson",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T003",
//       Domain: "Cloud",
//       Presenter: "Charlie Brown",
//       Paper: "Cloud Security",
//       Synopsis: "Discussing cloud...",
//     },
//     {
//       TeamID: "T004",
//       Domain: "Blockchain",
//       Presenter: "David Miller",
//       Paper: "Smart Contracts",
//       Synopsis: "Exploring Ethereum...",
//     },
//     {
//       TeamID: "T005",
//       Domain: "ML",
//       Presenter: "Emma Wilson",
//       Paper: "Deep Learning",
//       Synopsis: "A novel approach...",
//     },
//     {
//       TeamID: "T006",
//       Domain: "AI",
//       Presenter: "Frank White",
//       Paper: "AI Ethics",
//       Synopsis: "Ethical concerns...",
//     },
//     {
//       TeamID: "T007",
//       Domain: "Cloud",
//       Presenter: "Grace Lee",
//       Paper: "Kubernetes Scaling",
//       Synopsis: "Scaling apps...",
//     },
//     {
//       TeamID: "T008",
//       Domain: "AI",
//       Presenter: "A",
//       Paper: "AI in Healthcare",
//       Synopsis: "A study on AI...",
//     },
//     {
//       TeamID: "T009",
//       Domain: "AI",
//       Presenter: "B",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T010",
//       Domain: "AI",
//       Presenter: "C",
//       Paper: "Cloud Security",
//       Synopsis: "Discussing cloud...",
//     },
//     {
//       TeamID: "T011",
//       Domain: "AI",
//       Presenter: "D",
//       Paper: "Smart Contracts",
//       Synopsis: "Exploring Ethereum...",
//     },
//     {
//       TeamID: "T012",
//       Domain: "AI",
//       Presenter: "E",
//       Paper: "Deep Learning",
//       Synopsis: "A novel approach...",
//     },
//     {
//       TeamID: "T013",
//       Domain: "AI",
//       Presenter: "F",
//       Paper: "AI Ethics",
//       Synopsis: "Ethical concerns...",
//     },
//     {
//       TeamID: "T014",
//       Domain: "AI",
//       Presenter: "G",
//       Paper: "Kubernetes Scaling",
//       Synopsis: "Scaling apps...",
//     },
//     {
//       TeamID: "T015",
//       Domain: "AI",
//       Presenter: "H",
//       Paper: "AI in Healthcare",
//       Synopsis: "A study on AI...",
//     },
//     {
//       TeamID: "T016",
//       Domain: "AI",
//       Presenter: "I",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T022",
//       Domain: "AI",
//       Presenter: "J",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T023",
//       Domain: "AI",
//       Presenter: "K",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T017",
//       Domain: "Cloud",
//       Presenter: "M",
//       Paper: "Cloud Security",
//       Synopsis: "Discussing cloud...",
//     },
//     {
//       TeamID: "T018",
//       Domain: "Blockchain",
//       Presenter: "N",
//       Paper: "Smart Contracts",
//       Synopsis: "Exploring Ethereum...",
//     },
//     {
//       TeamID: "T019",
//       Domain: "Cloud",
//       Presenter: "O",
//       Paper: "Deep Learning",
//       Synopsis: "A novel approach...",
//     },
//     {
//       TeamID: "T020",
//       Domain: "Cloud",
//       Presenter: "P",
//       Paper: "AI Ethics",
//       Synopsis: "Ethical concerns...",
//     },
//     {
//       TeamID: "T021",
//       Domain: "Cloud",
//       Presenter: "Q",
//       Paper: "Kubernetes Scaling",
//       Synopsis: "Scaling apps...",
//     },
//   ];

//   const startTime = 9 * 60; // 9:00 AM in minutes
//   const endTime = 16 * 60; // 4:00 PM in minutes
//   const presentationDuration = 30; // Each presentation lasts 30 minutes
//   const maxSlotsPerRoom = 12; // Maximum presentations a single room can handle in a day

//   const scheduleTimetable = (data) => {
//     // Group papers by domain
//     const groupedDomains = {};
//     data.forEach((item) => {
//       if (!groupedDomains[item.Domain]) {
//         groupedDomains[item.Domain] = [];
//       }
//       groupedDomains[item.Domain].push(item);
//     });

//     const timetable = {}; // Final timetable
//     let roomCounter = 1; // Room numbering starts from Room 1

//     Object.keys(groupedDomains).forEach((domain) => {
//       const papers = groupedDomains[domain];
//       timetable[domain] = []; // Initialize timetable for the domain

//       let currentRoomPapers = []; // Temporary storage for papers in the current room
//       let currentRoomStart = startTime;

//       papers.forEach((paper, index) => {
//         if (currentRoomPapers.length === maxSlotsPerRoom) {
//           // When room capacity is reached, allocate a new room
//           timetable[domain].push({
//             room: `Room ${roomCounter}`,
//             schedule: createRoomSchedule(currentRoomPapers, currentRoomStart),
//           });
//           roomCounter++;
//           currentRoomPapers = []; // Reset for the next room
//           currentRoomStart = startTime; // Start again from 9:00 AM
//         }
//         currentRoomPapers.push(paper); // Add paper to the current room
//       });

//       // Allocate the last set of papers to a room
//       if (currentRoomPapers.length > 0) {
//         timetable[domain].push({
//           room: `Room ${roomCounter}`,
//           schedule: createRoomSchedule(currentRoomPapers, currentRoomStart),
//         });
//         roomCounter++;
//       }
//     });

//     return timetable;
//   };

//   // Helper function to generate a schedule for a room
//   const createRoomSchedule = (papers, start) => {
//     const roomSchedule = [];
//     let currentTime = start;

//     // Define breaks explicitly
//     const breaks = [
//       { start: 11 * 60, duration: 20 }, // 11:00 - 11:20 break
//       { start: 13 * 60 + 20, duration: 40 }, // 13:20 - 14:00 break
//     ];

//     papers.forEach((paper) => {
//       // Check if the current time falls within a break
//       breaks.forEach((b) => {
//         if (currentTime >= b.start && currentTime < b.start + b.duration) {
//           currentTime = b.start + b.duration; // Move time to the end of the break
//         }
//       });

//       // Ensure that the second session starts exactly at 14:00
//       if (currentTime > 13 * 60 + 20 && currentTime < 14 * 60) {
//         currentTime = 14 * 60;
//       }

//       // Add presentation to the room's schedule
//       roomSchedule.push({
//         time: formatTime(currentTime),
//         teamID: paper.TeamId,
//         presenter: paper.Presenter,
//         paperTitle: paper.Paper,
//         synopsis: paper.Synopsis,
//       });

//       currentTime += presentationDuration; // Move to the next slot
//     });

//     return roomSchedule;
//   };

//   const formatTime = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours.toString().padStart(2, "0")}:${mins
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const timetable = scheduleTimetable(data);
//   console.log(JSON.stringify(timetable, null, 2));

//   // Get all rooms across all categories
//   const getAllRooms = () => {
//     const rooms = [];
//     Object.entries(timetable).forEach(([category, categoryRooms]) => {
//       categoryRooms.forEach((room) => {
//         rooms.push({
//           name: room.room,
//           category: category,
//         });
//       });
//     });
//     return rooms;
//   };

//   const generateTimeSlots = () => {
//     return [
//       "09:00-09:30",
//       "09:30-10:00",
//       "10:00-10:30",
//       "10:30-11:00", // 4 slots before 11:00
//       "11:00-11:20", // 20-minute break
//       "11:20-11:50",
//       "11:50-12:20",
//       "12:20-12:50",
//       "12:50-13:20", // 4 slots before 13:20
//       "13:20-14:00", // 40-minute break
//       "14:00-14:30",
//       "14:30-15:00",
//       "15:00-15:30",
//       "15:30-16:00", // 4 slots before 16:00
//     ];
//   };

//   const timeSlots = generateTimeSlots();
//   console.log(timeSlots);
//   // const timeslotArray = timeSlots.split(",");
//   // console.log(timeslotArray);
//   const startTimes = timeSlots.map((slot) => slot.split("-")[0]);

//   console.log(startTimes);
//   // Map over the array and extract only the start time from each timeslot
//   // const startTimes = timeslotArray.map((slot) => slot.split("-")[0].trim());

//   // // For example, you can print them out separated by a space:
//   // console.log(startTimes);

//   const rooms = getAllRooms();

//   const findSession = (room, time) => {
//     const startTime = time.split("-")[0].trim();
//     const category = Object.entries(timetable).find(([_, rooms]) =>
//       rooms.some((r) => r.room === room.name)
//     );
//     // console.log("Checking room:", room.name, "at time:", time);

//     if (!category) {
//       // console.log("No category found for room:", room.name);
//       return null;
//     }

//     const roomData = category[1].find((r) => r.room === room.name);
//     if (!roomData) {
//       // console.log("No data found for room:", room.name);
//       // console.log(
//       //   "Available rooms:",
//       //   category[1].map((r) => r.room)
//       // );
//       return null;
//     }

//     const session = roomData.schedule.find(
//       (session) => session.time === startTime
//     );
//     if (!session) {
//       // console.log(
//       //   "No session found for room:",
//       //   room.name,
//       //   "at time:",
//       //   time,
//       //   "Available times:",
//       //   roomData.schedule.map((s) => s.time)
//       // );
//       return null;
//     }
//     console.log(session);
//     return session;
//   };

//   // Check if time slot is a break (11:00-11:20, 13:50-14:20)
//   const isBreak = (time) => {
//     const breaks = [
//       { start: "11:00", end: "11:20" },
//       { start: "13:20", end: "14:00" },
//     ];

//     return breaks.some((breakTime) => {
//       return time >= breakTime.start && time < breakTime.end;
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         Upload Excel File
//       </h2>

//       {/* 📌 File Upload */}
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         onChange={handleFileUpload}
//         className="mb-4 block w-full text-sm text-gray-500
//         file:mr-4 file:py-2 file:px-4
//         file:rounded-lg file:border-0
//         file:text-sm file:font-semibold
//         file:bg-blue-500 file:text-white
//         hover:file:bg-blue-600"
//       />

//       {/* 📌 Show Table if Data Exists */}

//       {data.length > 0 && (
//         <div className="max-w-full p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-xl">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//             Conference Schedule
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse bg-white">
//               <thead>
//                 <tr>
//                   <th className="sticky left-0 z-10 bg-gray-800 text-white p-4 border-b-2 border-gray-600 min-w-[100px]">
//                     Time
//                   </th>
//                   {rooms.map((room, index) => (
//                     <th
//                       key={index}
//                       className="p-4 bg-gray-800 text-white border-b-2 border-gray-600 min-w-[200px]"
//                     >
//                       <div className="font-bold">{room.name}</div>
//                       <div className="text-sm text-gray-300">
//                         {room.category}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {timeSlots.map((time, timeIndex) => {
//                   if (isBreak(time)) {
//                     return (
//                       <tr key={timeIndex} className="bg-gray-100">
//                         <td className="sticky left-0 z-10 p-4 font-medium text-gray-800 border border-gray-200 bg-gray-100">
//                           {time} - Break
//                         </td>
//                         {rooms.map((_, roomIndex) => (
//                           <td
//                             key={roomIndex}
//                             className="p-4 border border-gray-200 text-center text-gray-500 italic"
//                           >
//                             Break Time
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   }

//                   return (
//                     <tr
//                       key={timeIndex}
//                       className="hover:bg-blue-50 transition-colors duration-150"
//                     >
//                       <td className="sticky left-0 z-10 p-4 font-medium text-gray-800 border border-gray-200 bg-white">
//                         {time}
//                       </td>
//                       {rooms.map((room, roomIndex) => {
//                         const session = findSession(room, time);
//                         return (
//                           <td
//                             key={roomIndex}
//                             className="p-4 border border-gray-200"
//                           >
//                             {session ? (
//                               <div className="bg-white shadow-md rounded-lg p-4 transform transition-all duration-200 hover:scale-105">
//                                 <div className="font-semibold text-blue-900 mb-2">
//                                   {session.paperTitle}
//                                 </div>
//                                 <div className="text-sm text-gray-700 flex items-center gap-2">
//                                   <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
//                                   {session.presenter}
//                                 </div>
//                                 <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
//                                   <span>{session.teamID}</span>
//                                   <span className="bg-blue-100 px-2 py-1 rounded-full">
//                                     {session.time}
//                                   </span>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="text-gray-400 text-sm text-center">
//                                 No Session
//                               </div>
//                             )}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExcelUploader;

// import { useState } from "react";

// const CollapsibleRoom = ({ room, timetable }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleCollapse = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="mb-4">
//       <button
//         onClick={toggleCollapse}
//         className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-lg"
//       >
//         {room.name} - {room.category}
//       </button>
//       {isOpen && (
//         <div className="mt-2 p-4 bg-gray-100 rounded-lg">
//           <table className="w-full">
//             <thead>
//               <tr>
//                 <th className="p-2">Time</th>
//                 <th className="p-2">Presenter</th>
//                 <th className="p-2">Paper Title</th>
//                 <th className="p-2">Synopsis</th>
//               </tr>
//             </thead>
//             <tbody>
//               {timetable[room.category]
//                 .find((r) => r.room === room.name)
//                 .schedule.map((session, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="p-2">{session.time}</td>
//                     <td className="p-2">{session.presenter}</td>
//                     <td className="p-2">{session.paperTitle}</td>
//                     <td className="p-2">{session.synopsis}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// const ExcelUploader = () => {
//   // ... existing code ...
//     const [data, setData] = useState([]);
//   // 📌 Function to handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (!file) return;

//     const reader = new FileReader();
//     reader.readAsBinaryString(file);

//     reader.onload = (e) => {
//       const binaryString = e.target.result;
//       const workbook = XLSX.read(binaryString, { type: "binary" });

//       // Get first sheet data
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const parsedData = XLSX.utils.sheet_to_json(sheet);

//       setData(parsedData); // Store data in state
//     };
//   };
//   console.log(data);

//   const domainsData = [
//     {
//       TeamID: "T001",
//       Domain: "AI",
//       Presenter: "Alice Smith",
//       Paper: "AI in Healthcare",
//       Synopsis: "A study on AI...",
//     },
//     {
//       TeamID: "T002",
//       Domain: "AI",
//       Presenter: "Bob Johnson",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T003",
//       Domain: "Cloud",
//       Presenter: "Charlie Brown",
//       Paper: "Cloud Security",
//       Synopsis: "Discussing cloud...",
//     },
//     {
//       TeamID: "T004",
//       Domain: "Blockchain",
//       Presenter: "David Miller",
//       Paper: "Smart Contracts",
//       Synopsis: "Exploring Ethereum...",
//     },
//     {
//       TeamID: "T005",
//       Domain: "ML",
//       Presenter: "Emma Wilson",
//       Paper: "Deep Learning",
//       Synopsis: "A novel approach...",
//     },
//     {
//       TeamID: "T006",
//       Domain: "AI",
//       Presenter: "Frank White",
//       Paper: "AI Ethics",
//       Synopsis: "Ethical concerns...",
//     },
//     {
//       TeamID: "T007",
//       Domain: "Cloud",
//       Presenter: "Grace Lee",
//       Paper: "Kubernetes Scaling",
//       Synopsis: "Scaling apps...",
//     },
//     {
//       TeamID: "T008",
//       Domain: "AI",
//       Presenter: "A",
//       Paper: "AI in Healthcare",
//       Synopsis: "A study on AI...",
//     },
//     {
//       TeamID: "T009",
//       Domain: "AI",
//       Presenter: "B",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T010",
//       Domain: "AI",
//       Presenter: "C",
//       Paper: "Cloud Security",
//       Synopsis: "Discussing cloud...",
//     },
//     {
//       TeamID: "T011",
//       Domain: "AI",
//       Presenter: "D",
//       Paper: "Smart Contracts",
//       Synopsis: "Exploring Ethereum...",
//     },
//     {
//       TeamID: "T012",
//       Domain: "AI",
//       Presenter: "E",
//       Paper: "Deep Learning",
//       Synopsis: "A novel approach...",
//     },
//     {
//       TeamID: "T013",
//       Domain: "AI",
//       Presenter: "F",
//       Paper: "AI Ethics",
//       Synopsis: "Ethical concerns...",
//     },
//     {
//       TeamID: "T014",
//       Domain: "AI",
//       Presenter: "G",
//       Paper: "Kubernetes Scaling",
//       Synopsis: "Scaling apps...",
//     },
//     {
//       TeamID: "T015",
//       Domain: "AI",
//       Presenter: "H",
//       Paper: "AI in Healthcare",
//       Synopsis: "A study on AI...",
//     },
//     {
//       TeamID: "T016",
//       Domain: "AI",
//       Presenter: "I",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T022",
//       Domain: "AI",
//       Presenter: "J",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T023",
//       Domain: "AI",
//       Presenter: "K",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T024",
//       Domain: "AI",
//       Presenter: "L",
//       Paper: "Neural Networks",
//       Synopsis: "This paper...",
//     },
//     {
//       TeamID: "T017",
//       Domain: "Cloud",
//       Presenter: "M",
//       Paper: "Cloud Security",
//       Synopsis: "Discussing cloud...",
//     },
//     {
//       TeamID: "T018",
//       Domain: "Blockchain",
//       Presenter: "N",
//       Paper: "Smart Contracts",
//       Synopsis: "Exploring Ethereum...",
//     },
//     {
//       TeamID: "T019",
//       Domain: "Cloud",
//       Presenter: "O",
//       Paper: "Deep Learning",
//       Synopsis: "A novel approach...",
//     },
//     {
//       TeamID: "T020",
//       Domain: "Cloud",
//       Presenter: "P",
//       Paper: "AI Ethics",
//       Synopsis: "Ethical concerns...",
//     },
//     {
//       TeamID: "T021",
//       Domain: "Cloud",
//       Presenter: "Q",
//       Paper: "Kubernetes Scaling",
//       Synopsis: "Scaling apps...",
//     },
//   ];

//   const startTime = 9 * 60; // 9:00 AM in minutes
//   const endTime = 16 * 60; // 4:00 PM in minutes
//   const presentationDuration = 30; // Each presentation lasts 30 minutes
//   const maxSlotsPerRoom = 12; // Maximum presentations a single room can handle in a day

//   const scheduleTimetable = (data) => {
//     // Group papers by domain
//     const groupedDomains = {};
//     data.forEach((item) => {
//       if (!groupedDomains[item.Domain]) {
//         groupedDomains[item.Domain] = [];
//       }
//       groupedDomains[item.Domain].push(item);
//     });

//     const timetable = {}; // Final timetable
//     let roomCounter = 1; // Room numbering starts from Room 1

//     Object.keys(groupedDomains).forEach((domain) => {
//       const papers = groupedDomains[domain];
//       timetable[domain] = []; // Initialize timetable for the domain

//       let currentRoomPapers = []; // Temporary storage for papers in the current room
//       let currentRoomStart = startTime;

//       papers.forEach((paper, index) => {
//         if (currentRoomPapers.length === maxSlotsPerRoom) {
//           // When room capacity is reached, allocate a new room
//           timetable[domain].push({
//             room: `Room ${roomCounter}`,
//             schedule: createRoomSchedule(currentRoomPapers, currentRoomStart),
//           });
//           roomCounter++;
//           currentRoomPapers = []; // Reset for the next room
//           currentRoomStart = startTime; // Start again from 9:00 AM
//         }
//         currentRoomPapers.push(paper); // Add paper to the current room
//       });

//       // Allocate the last set of papers to a room
//       if (currentRoomPapers.length > 0) {
//         timetable[domain].push({
//           room: `Room ${roomCounter}`,
//           schedule: createRoomSchedule(currentRoomPapers, currentRoomStart),
//         });
//         roomCounter++;
//       }
//     });

//     return timetable;
//   };

//   // Helper function to generate a schedule for a room
//   const createRoomSchedule = (papers, start) => {
//     const roomSchedule = [];
//     let currentTime = start;

//     // Define breaks explicitly
//     const breaks = [
//       { start: 11 * 60, duration: 20 }, // 11:00 - 11:20 break
//       { start: 13 * 60 + 20, duration: 40 }, // 13:20 - 14:00 break
//     ];

//     papers.forEach((paper) => {
//       // Check if the current time falls within a break
//       breaks.forEach((b) => {
//         if (currentTime >= b.start && currentTime < b.start + b.duration) {
//           currentTime = b.start + b.duration; // Move time to the end of the break
//         }
//       });

//       // Ensure that the second session starts exactly at 14:00
//       if (currentTime > 13 * 60 + 20 && currentTime < 14 * 60) {
//         currentTime = 14 * 60;
//       }

//       // Add presentation to the room's schedule
//       roomSchedule.push({
//         time: formatTime(currentTime),
//         teamID: paper.TeamId,
//         presenter: paper.Presenter,
//         paperTitle: paper.Paper,
//         synopsis: paper.Synopsis,
//       });

//       currentTime += presentationDuration; // Move to the next slot
//     });

//     return roomSchedule;
//   };

//   const formatTime = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours.toString().padStart(2, "0")}:${mins
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const timetable = scheduleTimetable(data);
//   console.log(JSON.stringify(timetable, null, 2));

//   // Get all rooms across all categories
//   const getAllRooms = () => {
//     const rooms = [];
//     Object.entries(timetable).forEach(([category, categoryRooms]) => {
//       categoryRooms.forEach((room) => {
//         rooms.push({
//           name: room.room,
//           category: category,
//         });
//       });
//     });
//     return rooms;
//   };

//   const generateTimeSlots = () => {
//     return [
//       "09:00-09:30",
//       "09:30-10:00",
//       "10:00-10:30",
//       "10:30-11:00", // 4 slots before 11:00
//       "11:00-11:20", // 20-minute break
//       "11:20-11:50",
//       "11:50-12:20",
//       "12:20-12:50",
//       "12:50-13:20", // 4 slots before 13:20
//       "13:20-14:00", // 40-minute break
//       "14:00-14:30",
//       "14:30-15:00",
//       "15:00-15:30",
//       "15:30-16:00", // 4 slots before 16:00
//     ];
//   };

//   const timeSlots = generateTimeSlots();
//   console.log(timeSlots);
//   // const timeslotArray = timeSlots.split(",");
//   // console.log(timeslotArray);
//   const startTimes = timeSlots.map((slot) => slot.split("-")[0]);

//   console.log(startTimes);
//   // Map over the array and extract only the start time from each timeslot
//   // const startTimes = timeslotArray.map((slot) => slot.split("-")[0].trim());

//   // // For example, you can print them out separated by a space:
//   // console.log(startTimes);

//   const rooms = getAllRooms();

//   const findSession = (room, time) => {
//     const startTime = time.split("-")[0].trim();
//     const category = Object.entries(timetable).find(([_, rooms]) =>
//       rooms.some((r) => r.room === room.name)
//     );
//     // console.log("Checking room:", room.name, "at time:", time);

//     if (!category) {
//       // console.log("No category found for room:", room.name);
//       return null;
//     }

//     const roomData = category[1].find((r) => r.room === room.name);
//     if (!roomData) {
//       // console.log("No data found for room:", room.name);
//       // console.log(
//       //   "Available rooms:",
//       //   category[1].map((r) => r.room)
//       // );
//       return null;
//     }

//     const session = roomData.schedule.find(
//       (session) => session.time === startTime
//     );
//     if (!session) {
//       // console.log(
//       //   "No session found for room:",
//       //   room.name,
//       //   "at time:",
//       //   time,
//       //   "Available times:",
//       //   roomData.schedule.map((s) => s.time)
//       // );
//       return null;
//     }
//     console.log(session);
//     return session;
//   };

//   // Check if time slot is a break (11:00-11:20, 13:50-14:20)
//   const isBreak = (time) => {
//     const breaks = [
//       { start: "11:00", end: "11:20" },
//       { start: "13:20", end: "14:00" },
//     ];

//     return breaks.some((breakTime) => {
//       return time >= breakTime.start && time < breakTime.end;
//     });
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         Upload Excel File
//       </h2>

//       {/* 📌 File Upload */}
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         onChange={handleFileUpload}
//         className="mb-4 block w-full text-sm text-gray-500
//         file:mr-4 file:py-2 file:px-4
//         file:rounded-lg file:border-0
//         file:text-sm file:font-semibold
//         file:bg-blue-500 file:text-white
//         hover:file:bg-blue-600"
//       />

//       {/* 📌 Show Table if Data Exists */}
//       {data.length > 0 && (
//         <div className="max-w-full p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-xl">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//             Conference Schedule
//           </h2>
//           <div className="overflow-x-auto">
//             {rooms.map((room, index) => (
//               <CollapsibleRoom key={index} room={room} timetable={timetable} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExcelUploader;

import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelUploader = () => {
  const [data, setData] = useState([]);
  const [expandedRooms, setExpandedRooms] = useState({});

  // Handle file upload and parse Excel file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  // Scheduling Logic
  const startTime = 9 * 60; // 9:00 AM in minutes
  const presentationDuration = 30; // in minutes
  const maxSlotsPerRoom = 12; // Maximum presentations per room

  // Groups papers by domain and schedules sessions into rooms
  const scheduleTimetable = (data) => {
    const groupedDomains = {};
    data.forEach((item) => {
      if (!groupedDomains[item.Domain]) {
        groupedDomains[item.Domain] = [];
      }
      groupedDomains[item.Domain].push(item);
    });

    const timetable = {};
    let roomCounter = 1;
    Object.keys(groupedDomains).forEach((domain) => {
      const papers = groupedDomains[domain];
      timetable[domain] = [];
      let currentRoomPapers = [];
      let currentRoomStart = startTime;
      papers.forEach((paper) => {
        if (currentRoomPapers.length === maxSlotsPerRoom) {
          timetable[domain].push({
            room: `Room ${roomCounter}`,
            schedule: createRoomSchedule(currentRoomPapers, currentRoomStart),
          });
          roomCounter++;
          currentRoomPapers = [];
          currentRoomStart = startTime;
        }
        currentRoomPapers.push(paper);
      });
      if (currentRoomPapers.length > 0) {
        timetable[domain].push({
          room: `Room ${roomCounter}`,
          schedule: createRoomSchedule(currentRoomPapers, currentRoomStart),
        });
        roomCounter++;
      }
    });
    return timetable;
  };

  // Generates a room's schedule while accounting for breaks
  const createRoomSchedule = (papers, start) => {
    const roomSchedule = [];
    let currentTime = start;
    // Define breaks
    const breaks = [
      { start: 11 * 60, duration: 20 }, // 11:00 - 11:20 break
      { start: 13 * 60 + 20, duration: 40 }, // 13:20 - 14:00 break
    ];

    papers.forEach((paper) => {
      // Adjust for breaks
      breaks.forEach((b) => {
        if (currentTime >= b.start && currentTime < b.start + b.duration) {
          currentTime = b.start + b.duration;
        }
      });
      // Ensure session after break starts exactly at 14:00 if needed
      if (currentTime > 13 * 60 + 20 && currentTime < 14 * 60) {
        currentTime = 14 * 60;
      }
      roomSchedule.push({
        time: formatTime(currentTime),
        teamID: paper.TeamID, // using TeamID from your data
        presenter: paper.Presenter,
        paperTitle: paper.Paper,
        synopsis: paper.Synopsis,
      });
      currentTime += presentationDuration;
    });

    return roomSchedule;
  };

  // Format minutes into HH:MM format
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  // Compute timetable using the uploaded data
  const timetable = scheduleTimetable(data);

  // Gather a list of all rooms with their schedule details
  const getAllRooms = () => {
    const rooms = [];
    Object.entries(timetable).forEach(([category, categoryRooms]) => {
      categoryRooms.forEach((room) => {
        rooms.push({
          name: room.room,
          category,
          schedule: room.schedule,
        });
      });
    });
    return rooms;
  };

  const rooms = getAllRooms();

  // Toggle collapsible view for a room
  const toggleRoom = (roomName) => {
    setExpandedRooms((prev) => ({ ...prev, [roomName]: !prev[roomName] }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Upload Excel File
      </h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
               file:text-sm file:font-semibold file:bg-blue-500 file:text-white
               hover:file:bg-blue-600"
      />

      {data.length > 0 && (
        <div className="max-w-full p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Conference Schedule
          </h2>
          <div className="space-y-4">
            {rooms.map((room, idx) => (
              <div key={idx} className="border rounded-lg shadow">
                {/* Room header as a collapsible trigger */}
                <div
                  className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRoom(room.name)}
                >
                  <div>
                    <span className="font-bold">{room.name}</span> -{" "}
                    <span>{room.category}</span>
                  </div>
                  <div>{expandedRooms[room.name] ? "▲" : "▼"}</div>
                </div>
                {/* Collapsible session details */}
                {expandedRooms[room.name] && (
                  <div className="px-4 py-2">
                    {room.schedule && room.schedule.length > 0 ? (
                      room.schedule.map((session, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-4 p-2 mb-2 border-b last:border-0"
                        >
                          {/* Time column */}
                          <div className="w-24 text-gray-600 font-bold text-center">
                            {session.time}
                          </div>
                          {/* Details column */}
                          <div className="flex flex-col flex-1">
                            <div className="font-semibold text-blue-900">
                              {session.paperTitle}
                            </div>
                            <div className="text-sm text-gray-700 flex items-center gap-2">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              {session.presenter}
                            </div>
                            <div className="text-xs text-gray-500">
                              Team: {session.teamID}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {session.synopsis}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm text-center">
                        No Session
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
