import React from "react";

const DisplayMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-200 border rounded-md">
      <p>{message}</p>
    </div>
  );
};

export default DisplayMessage;
