import React, { useState } from "react";

const SendMessage = ({ onSend }) => {
  const handleSend = () => {
    onSend("Tests Passed");
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-200 border rounded-md">
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-white  rounded-md "
      >
        Test
      </button>
    </div>
  );
};

export default SendMessage;
