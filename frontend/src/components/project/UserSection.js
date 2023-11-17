import React, { useState } from "react";

const getTabName = (tabIndex) => {
  const tabNames = ["FTP", "HTTP/HTTPS", "TCP", "UDP", "IPv4", "MAC"];
  return tabNames[tabIndex] || "Unknown";
};

const UserSection = ({ selectedTab, onUpload, side, setMessage }) => {
  const [file, setFile] = useState(null);
  const selectedTabName = getTabName(selectedTab);

  const handleFileChange = (e) => {
    const chosenFile = e.target.files[0];
    setFile(chosenFile);
  };

  const handleUploadClick = async () => {
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("part", selectedTab);

      try {
        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setMessage(responseData.message);
        onUpload(selectedTab, file.name, side);
      } catch (error) {
        console.error("Upload Error:", error);
        setMessage(error.message || "An error occurred while uploading the file.");
      }
    } else {
      setMessage("No file selected.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 border rounded-md">
      <h2 className="mb-4 text-lg font-bold">
        {`Upload to ${side}'s ${selectedTabName}`}
      </h2>
      <input className="text-center" type="file" onChange={handleFileChange} />
      <button
        onClick={handleUploadClick}
        className="rounded-md p-2 text-white bg-blue-500"
      >
        Upload
      </button>
    </div>
  );
};

export default UserSection;
