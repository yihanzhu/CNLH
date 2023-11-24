// assignmentsContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AssignmentsContext = createContext({
  assignments: [],
  setAssignments: () => {},
  addAssignment: () => {},
  fetchAssignments: () => {},
});

export const AssignmentsProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchAssignments = async (includeUnpublished = false) => {
    try {
      let url = `http://${backendUrl}:5000/api/assignments`;
      if (!includeUnpublished) {
        url += "?published=true"; // Fetch only published assignments for slave mode
      }
      const response = await axios.get(url);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments', error);
    }
  };

  const addAssignment = async (assignment) => {
    try {
      const response = await axios.post(`http://${backendUrl}:5000/api/assignments`, assignment);
      setAssignments([...assignments, response.data]);
    } catch (error) {
      console.error('Error adding assignment', error);
    }
  };

  return (
    <AssignmentsContext.Provider value={{ assignments, setAssignments, addAssignment, fetchAssignments }}>
      {children}
    </AssignmentsContext.Provider>
  );
};

export default AssignmentsContext;
