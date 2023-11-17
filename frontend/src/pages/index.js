// index.js
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AssignmentsContext from "@/pages/context/assignmentsContext";
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
  const [newSlaveID, setNewSlaveID] = useState("");
  const [slaveId, setSlaveId] = useState(null);

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
    <div className="main">
      <h1 className="text-2xl font-bold mb-4">
        {isMaster ? "Master Dashboard" : "Slave Dashboard"}
      </h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          {/* Slave ID Section */}
          <div className="border p-4 rounded-md">
            <h2 className="text-xl mb-4">
              {isMaster ? "Slave IDs" : `Slave ID: ${slaveId}`}
            </h2>
            {isMaster &&
              fetchedSlaveIDs.map((id, index) => (
                <div key={index} className="mb-2">
                  {id}{" "}
                  <button
                    onClick={() => handleDirectRemoveSlaveID(id)}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            {isMaster && (
              <div className="mt-4">
                <input
                  type="text"
                  value={newSlaveID}
                  onChange={(e) => setNewSlaveID(e.target.value)}
                  placeholder="Enter Slave ID"
                  className="w-full p-2 rounded-md border mb-2"
                />
                <button
                  onClick={handleAddSlaveID}
                  className="p-2 bg-green-500 text-white rounded-md"
                >
                  Add Slave ID
                </button>
              </div>
            )}
          </div>

          {/* Assignments Section */}
          <div className="border p-4 rounded-md mt-4">
            <h2 className="text-xl mb-4">
              {isMaster ? "Manage Assignments" : "Published Assignments"}
            </h2>
            {isMaster && (
              <button
                onClick={handleCreateAssignment}
                className="p-2 bg-green-500 text-white rounded-md"
              >
                Create New Assignment
              </button>
            )}
            {showTemplateModal && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-md w-1/3">
                  <button
                    onClick={() => handleConfirmTemplate("TCP-IP")}
                    className="p-2 bg-blue-500 text-white rounded-md mr-2"
                  >
                    TCP-IP
                  </button>
                  {/* Additional template buttons */}
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="p-2 bg-red-500 text-white rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            <div className="mt-4">
              <ul>
                {assignments.map((assignment) => (
                  <li
                    key={assignment.id}
                    className="mb-2 flex justify-between items-center"
                  >
                    <span className="flex-1 truncate">{assignment.name}</span>
                    <Link
                      href={`/assignments/${assignment.name}`}
                      className="text-blue-500 cursor-pointer ml-2"
                    >
                      Access
                    </Link>
                    {isMaster && (
                      <>
                        <button
                          onClick={() => deleteAssignment(assignment.id)}
                          className="text-red-500 cursor-pointer ml-4"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => publishAssignment(assignment.id)}
                          className="text-green-500 cursor-pointer ml-4"
                        >
                          Publish
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mailbox Section */}
        <div className="col-span-2 border p-4 rounded-md">
          {isMaster ? <MasterMailbox /> : <SlaveMailbox slaveId={slaveId} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
