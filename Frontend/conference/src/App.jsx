
import React from "react";
import Timetable from "./Components/Timetable";
import ExcelUploader from "./Components/ConferenceSchedule";
import Trail from "./Components/Trail";
import "./index.css";
import ConferenceSchedule from "./Components/ConferenceSchedule";

const App = () => {
  return (
    <div>
      <ConferenceSchedule />
      {/* <Trail/> */}
    </div>
  );
};

export default App;
