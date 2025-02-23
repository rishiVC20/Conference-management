// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Timetable = () => {
//     const [timetable, setTimetable] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:5000/api/timetable')
//             .then((response) => setTimetable(response.data))
//             .catch((error) => console.error(error));
//     }, []);

//     const groupedData = {};
//     timetable.forEach((slot) => {
//         if (!groupedData[slot.domain]) groupedData[slot.domain] = {};
//         if (!groupedData[slot.domain][slot.time]) groupedData[slot.domain][slot.time] = [];
//         groupedData[slot.domain][slot.time].push(slot);
//     });

//     const domains = Object.keys(groupedData);
//     const times = [...new Set(timetable.map((slot) => slot.time))].sort();

//     return (
//         <div>
//             <h1>Conference Timetable</h1>
//             <table border="1" cellPadding="10" cellSpacing="0">
//                 <thead>
//                     <tr>
//                         <th>Time Slot</th>
//                         {domains.map((domain) => (
//                             <th key={domain} colSpan={2}>
//                                 {domain}
//                             </th>
//                         ))}
//                     </tr>
//                     <tr>
//                         <th></th>
//                         {domains.map((domain) => (
//                             <React.Fragment key={domain}>
//                                 <th>Room 1</th>
//                                 <th>Room 2</th>
//                             </React.Fragment>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {times.map((time) => (
//                         <tr key={time}>
//                             <td>{time}</td>
//                             {domains.map((domain) => (
//                                 <React.Fragment key={domain}>
//                                     {groupedData[domain][time] ? (
//                                         groupedData[domain][time].map((slot, index) => (
//                                             <td key={index}>{slot.teamId}</td>
//                                         ))
//                                     ) : (
//                                         <td colSpan={2}></td>
//                                     )}
//                                 </React.Fragment>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Timetable;



import React from "react";
import DomainCard from "./DomainCard";

const Timetable = ({ data }) => {
  const domains = Object.keys(data);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Conference Timetable</h1>
      <div className="space-y-6">
        {domains.map((domain) => (
          <DomainCard key={domain} domain={domain} rooms={data[domain]} />
        ))}
      </div>
    </div>
  );
};

export default Timetable;
