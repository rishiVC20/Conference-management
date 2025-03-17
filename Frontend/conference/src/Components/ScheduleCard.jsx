// import React, { useState } from "react";

// const ScheduleCard = ({ slot }) => {
//   const { time, teamID, presenter, paperTitle, synopsis, day, domain, presentorDetails } = slot;
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <>
//       <div
//         className="p-3 border border-gray-200 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
//         onClick={openModal}
//       >
//         <p className="text-sm font-bold">Time: {time}</p>
//         <p className="text-sm">
//           <span className="font-medium">Team ID:</span> {teamID}
//         </p>
//         <p className="text-sm">
//           <span className="font-medium">Presenter:</span> {presenter}</p>
//         <p className="text-sm">
//           <span className="font-medium">Paper Title:</span> {paperTitle}
//         </p>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
//             <h2 className="text-xl font-bold mb-4">Paper Details</h2>
//             <p><strong>Domain:</strong> {domain}</p>
//             <p><strong>Team ID:</strong> {teamID}</p>
//             <p><strong>Paper Title:</strong> {paperTitle}</p>
//             <p><strong>Day:</strong> Day {day}</p>
//             <p><strong>Time Slot:</strong> {time}</p>
//             <p><strong>Presenters:</strong></p>
//             <ul className="list-disc list-inside">
//               {presentorDetails.map((p, index) => (
//                 <li key={index}>{p.name} - {p.email} - {p.phoneNumber}</li>
//               ))}
//             </ul>
//             <p className="mt-2"><strong>Synopsis:</strong> {synopsis}</p>
//             <div className="mt-4">
//               <button
//                 onClick={closeModal}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ScheduleCard;

import React, { useState } from "react";

const ScheduleCard = ({ slot, currentTime }) => {
  const { time, teamID, presenter, paperTitle, synopsis, day, domain, presentorDetails } = slot;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Check if the slot time matches the current time
  const isCurrentSlot = time === currentTime;

  return (
    <>
      {/* Table Row with Conditional Styling */}
      <tr
        className={`hover:bg-gray-100 cursor-pointer ${
          isCurrentSlot ? "bg-green-100" : ""
        }`}
        onClick={openModal}
      >
        <td className="p-3 border border-gray-300">{time}</td>
        <td className="p-3 border border-gray-300">{teamID}</td>
        <td className="p-3 border border-gray-300">{presenter}</td>
        <td className="p-3 border border-gray-300">{paperTitle}</td>
        <td className="p-3 border border-gray-300">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={openModal}
          >
            View Details
          </button>
        </td>
      </tr>

      {/* Modal for Additional Details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <h2 className="text-xl font-bold mb-4">Paper Details</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border border-gray-300 text-left">Domain</th>
                  <th className="p-3 border border-gray-300 text-left">Team ID</th>
                  <th className="p-3 border border-gray-300 text-left">Paper Title</th>
                  <th className="p-3 border border-gray-300 text-left">Day</th>
                  <th className="p-3 border border-gray-300 text-left">Time Slot</th>
                  <th className="p-3 border border-gray-300 text-left">Presenters</th>
                  <th className="p-3 border border-gray-300 text-left">Synopsis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-300">{domain}</td>
                  <td className="p-3 border border-gray-300">{teamID}</td>
                  <td className="p-3 border border-gray-300">{paperTitle}</td>
                  <td className="p-3 border border-gray-300">Day {day}</td>
                  <td className="p-3 border border-gray-300">{time}</td>
                  <td className="p-3 border border-gray-300">
                    <ul className="list-disc list-inside">
                      {presentorDetails.map((p, index) => (
                        <li key={index}>{p.name} - {p.email} - {p.phoneNumber}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 border border-gray-300">{synopsis}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleCard;
