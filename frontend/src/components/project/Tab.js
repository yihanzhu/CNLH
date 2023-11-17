import React from "react";

const Tab = ({
  color,
  onClick,
  children,
  isUploaded
}) => {
  let colorClass = "";
  switch (color) {
    case "green":
      colorClass = "bg-green-500";
      break;
    case "red":
      colorClass = "bg-red-500";
      break;
    case "yellow":
      colorClass = "bg-yellow-500";
      break;
    default:
      colorClass = "bg-green-500";
      break;
  }
  if (isUploaded) {
    colorClass = "bg-yellow-500"; // file has been uploaded
  }
  return (
    <div
      className={`p-4  rounded-md cursor-pointer text-center ${colorClass}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Tab;
