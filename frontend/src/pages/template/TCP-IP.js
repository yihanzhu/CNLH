// TCP-IP.js

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AssignmentsContext from "../context/assignmentsContext";

import Window from "@/components/project/Window";
import AdminSection from "@/components/project/AdminSection";

const TCP_IP = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const [tabColors, setTabColors] = useState(Array(6).fill("green"));
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [assignmentName, setAssignmentName] = useState("");
  const router = useRouter();
  const { addAssignment } = useContext(AssignmentsContext);

  const handleTabSelect = (tabIndex) => {
    setSelectedTab(tabIndex);
    const updatedColors = Array(6).fill("green");
    updatedColors[tabIndex] = "red";
    setTabColors(updatedColors);
  };

  const saveAssignment = () => {
    const sanitizedName = assignmentName
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    addAssignment({ name: sanitizedName, data: { selectedTab } });
    setShowSaveModal(false);
    router.push("/");
  };

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <AdminSection selectedTab={selectedTab} />
        <button onClick={() => setShowSaveModal(true)}>Save As</button>
      </div>

      {showSaveModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h3 className="text-lg font-bold mb-4">Save As</h3>
            <input
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              placeholder="Enter assignment name (e.g., Assignment 1)"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  saveAssignment();
                  setShowSaveModal(false);
                  router.push("/"); // Redirects to the Instructor Dashboard after saving
                }}
                className="p-2 bg-blue-500 text-white rounded-md mr-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-2 bg-red-500 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
        <Window
          name="Sender"
          isAdmin={true}
          onTabSelect={handleTabSelect}
          tabColors={tabColors}
        />
        <Window
          name="Receiver"
          isAdmin={true}
          onTabSelect={handleTabSelect}
          tabColors={tabColors}
        />
      </div>
    </div>
  );
};

export default TCP_IP;
