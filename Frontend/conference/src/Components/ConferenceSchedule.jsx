import React, { useEffect, useState } from "react";
import axios from "axios";
import Timetable from "./Timetable";

const ConferenceSchedule = () => {
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("default");
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/schedule");
      setData(response.data);
      setIsSearchMode(false);  // Switch to full timetable mode
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchSchedule();  // Empty search triggers full view
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/schedule/search?term=${searchTerm}&type=${searchType}`
      );
      setData(response.data);
      setIsSearchMode(true);  // Switch to search results mode
    } catch (error) {
      console.error("Error searching schedule:", error);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Conference Schedule</h2>

      {/* Search Controls */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="ml-2 border p-2 rounded"
        >
          <option value="default">Default</option>
          <option value="teamID">Team ID</option>
          <option value="presenter">Presenter</option>
          <option value="paperTitle">Paper Title</option>
        </select>
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white p-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Show Full Timetable Button (Only in Search Mode) */}
      {isSearchMode && (
        <div className="mb-4">
          <button
            onClick={fetchSchedule}
            className="bg-gray-700 text-white p-2 rounded"
          >
            Show Full Timetable
          </button>
        </div>
      )}

      {/* Timetable Component */}
      <Timetable data={data} isSearchMode={isSearchMode} />
    </div>
  );
};

export default ConferenceSchedule;
