import React from "react";
import DomainCard from "./DomainCard";
import SearchResultsView from "./SearchResultsView";

const Timetable = ({ data, isSearchMode }) => {
  const domains = Object.keys(data);

  if (isSearchMode) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Search Results</h1>
        <SearchResultsView data={data} />
      </div>
    );
  }

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
