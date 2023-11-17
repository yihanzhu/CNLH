import React from "react";

const AdminSection = ({ selectedTab, selectedTabName }) => {
  return (
    <div className="flex items-center justify-center p-2 bg-gray-200 border rounded-md text-sm font-bold">
      <span>Chosen tab: {selectedTabName}</span>
    </div>
  );
};

export default AdminSection;
