import React from "react";

const CommonTable = ({ headers, data }) => {
  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-200">
          {headers.map((header, index) => (
            <th key={index} className="p-2 border border-gray-300">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          {data.map((cell, index) => (
            <td key={index} className="p-2 border border-gray-300">
              {cell}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default CommonTable;