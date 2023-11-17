// index.js
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AssignmentsContext from "@/pages/context/assignmentsContext"; // Ensure the path is correct
import axios from "axios";
import MasterMailbox from "@/components/MasterMailbox";
import SlaveMailbox from "@/components/SlaveMailbox";

const Dashboard = () => {
  const { assignments, setAssignments, fetchAssignments } =
    useContext(AssignmentsContext);
  const router = useRouter();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const isMaster = process.env.NEXT_PUBLIC_MODE === "master";
  const [fetchedSlaveIDs, setFetchedSlaveIDs] = useState([]);
  const [newSlaveID, setNewSlaveID] = useState(""); // State for adding a new slave ID
  const [slaveId, setSlaveId] = useState(null); // Initialize state for slave ID

  const handleAddSlaveID = async () => {
    if (newSlaveID && !fetchedSlaveIDs.includes(newSlaveID)) {
      const updatedSlaveIDs = [...fetchedSlaveIDs, newSlaveID];
      try {
        await axios.post("http://localhost:5000/api/slave-ids", {
          slaveIDs: updatedSlaveIDs,
        });
        setFetchedSlaveIDs(updatedSlaveIDs);
        setNewSlaveID("");
      } catch (error) {
        console.error("Error adding slave ID", error);
      }
    }
  };

  const handleDirectRemoveSlaveID = async (idToRemove) => {
    const updatedSlaveIDs = fetchedSlaveIDs.filter((id) => id !== idToRemove);
    try {
      await axios.post("http://localhost:5000/api/slave-ids", {
        slaveIDs: updatedSlaveIDs,
      });
      setFetchedSlaveIDs(updatedSlaveIDs);
    } catch (error) {
      console.error("Error removing slave ID", error);
    }
  };

  // Function to fetch slave IDs from the backend
  const fetchSlaveIDs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/slave-ids");
      setFetchedSlaveIDs(response.data);
    } catch (error) {
      console.error("Error fetching slave IDs", error);
    }
  };

  useEffect(() => {
    // Set the slave ID from the environment variable on the client side
    setSlaveId(process.env.NEXT_PUBLIC_REACT_APP_SLAVE_ID);
    fetchSlaveIDs();
  }, []);

  // Master mode functionalities
  const handleCreateAssignment = () => {
    setShowTemplateModal(true);
  };

  const handleConfirmTemplate = (template) => {
    router.push(`/template/${template}`);
  };

  // Function to delete an assignment
  const deleteAssignment = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/assignments/${id}`
      );
      if (response.status === 200) {
        // Call fetchAssignments to update the list of assignments
        fetchAssignments(isMaster);
      }
    } catch (error) {
      console.error("Error deleting assignment", error);
      // Handle errors (e.g., show a notification to the user)
    }
  };

  const publishAssignment = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/publish/${id}`
      );
      console.log(response.data.message);
      fetchAssignments(isMaster);
      // Optionally, update the state to reflect that the assignment is published
    } catch (error) {
      console.error("Error publishing assignment", error);
    }
  };

  useEffect(() => {
    fetchAssignments(isMaster); // Pass 'true' for master mode, 'false' for slave mode
  }, [isMaster]);

  return (
    <div>
      {isMaster ? (
        // Master Dashboard UI

        <div>
          <div>
            {/* Existing Slave IDs Display with Remove Button */}
            <h2>Slave IDs</h2>
            {fetchedSlaveIDs.map((id, index) => (
              <div key={index}>
                {id}{" "}
                <button onClick={() => handleDirectRemoveSlaveID(id)}>
                  Remove
                </button>
              </div>
            ))}

            {/* Add New Slave ID */}
            <div>
              <input
                type="text"
                value={newSlaveID}
                onChange={(e) => setNewSlaveID(e.target.value)}
                placeholder="Enter Slave ID"
              />
              <button onClick={handleAddSlaveID}>Add Slave ID</button>
            </div>
          </div>

          <button onClick={handleCreateAssignment}>
            Create New Assignment
          </button>
          {showTemplateModal && (
            <div className="modal">
              <div className="modal-content">
                <button onClick={() => handleConfirmTemplate("TCP-IP")}>
                  TCP-IP
                </button>
                {/* Additional template buttons */}
              </div>
              <button onClick={() => setShowTemplateModal(false)}>Close</button>
            </div>
          )}
          {/* List of assignments with delete and publish options */}
          {assignments.map((assignment) => (
            <div key={assignment.id}>
              {assignment.name}
              <Link href={`/assignments/${assignment.name}`}>Access</Link>
              <button onClick={() => deleteAssignment(assignment.id)}>
                Delete
              </button>
              <button onClick={() => publishAssignment(assignment.id)}>
                Publish
              </button>
            </div>
          ))}
          <MasterMailbox />
        </div>
      ) : (
        // Slave Dashboard UI
        <div>
          <h2>Slave Dashboard ID: {slaveId}</h2>
          <h1>Published Assignments</h1>
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div key={assignment.id}>
                {assignment.name}
                <Link href={`/assignments/${assignment.name}`}>Access</Link>
              </div>
            ))
          ) : (
            <p>No published assignments available.</p>
          )}
          <SlaveMailbox slaveId={slaveId} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
