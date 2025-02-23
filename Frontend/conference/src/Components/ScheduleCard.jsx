import React from "react";

const ScheduleCard = ({ slot }) => {
  const { time, teamID, presenter, paperTitle, synopsis } = slot;

  return (
    <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
      <p className="text-sm font-bold">Time: {time} </p>
      <p className="text-sm">
        <span className="font-medium">Team ID:</span> {teamID}
      </p>
      <p className="text-sm">
        <span className="font-medium">Presenter:</span> {presenter}
      </p>
      <p className="text-sm">
        <span className="font-medium">Paper Title:</span> {paperTitle}
      </p>
      <p className="text-sm">
        <span className="font-medium">Synopsis:</span> {synopsis}
      </p>
    </div>
  );
};

export default ScheduleCard;
