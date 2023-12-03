// pages/index.js
import React, { useState } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [showIdInput, setShowIdInput] = useState(false);
  const router = useRouter();

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setShowIdInput(true);
  };

  const handleSubmit = () => {
    if (role && id) {
      router.push(`/dashboard/${role}/${id}`);
    }
  };

  return (
    <div className="main flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Computer Network Learning Hub</h1>

      <div className="role-selection-section">
        <div className="text-2xl font-bold mb-4">Select your role</div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => handleRoleSelection("master")}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Master
          </button>
          <button
            onClick={() => handleRoleSelection("slave")}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Slave
          </button>
        </div>

        {showIdInput && (
          <div className="modal-background absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal p-4 rounded-md bg-white">
              <h2 className="text-xl font-bold mb-4">Enter your {role} ID</h2>
              <input
                type="text"
                placeholder={`Enter your ${role} ID`}
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full p-2 rounded-md border mb-2"
              />
              <button
                onClick={handleSubmit}
                className="p-2 bg-green-500 text-white rounded-md"
              >
                Submit
              </button>
              <button
                onClick={() => setShowIdInput(false)}
                className="p-2 bg-red-500 text-white rounded-md ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
