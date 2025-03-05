import React from "react";

const SearchResultsView = ({ data }) => {
  const flattenedResults = [];

  Object.keys(data).forEach((domain) => {
    Object.keys(data[domain]).forEach((room) => {
      data[domain][room].forEach((session) => {
        flattenedResults.push({
          domain,
          room,
          ...session,
        });
      });
    });
  });

  return (
    <div className="space-y-4">
      {flattenedResults.map((item, index) => (
        <div key={index} className="border p-4 rounded-md shadow">
          <p><strong>Domain:</strong> {item.domain}</p>
          <p><strong>Room:</strong> {item.room}</p>
          <p><strong>Day:</strong> Day {item.day}</p>
          <p><strong>Time:</strong> {item.time}</p>
          <p><strong>Team ID:</strong> {item.teamID}</p>
          <p><strong>Paper Title:</strong> {item.paperTitle}</p>
          <p><strong>Synopsis:</strong> {item.synopsis}</p>
          <p><strong>Presenters:</strong></p>
          <ul className="list-disc list-inside pl-4">
            {item.presentorDetails && item.presentorDetails.map((presentor, pIndex) => (
              <li key={pIndex}>
                {presentor.name} - {presentor.email} - {presentor.phoneNumber}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsView;
