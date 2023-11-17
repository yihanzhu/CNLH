import React from "react";
import Tab from "./Tab";

const Window = ({
  isAdmin,
  onTabSelect,
  tabColors,
  name,
  uploadedTabs,
}) => {
  return (
    <div className="p-2">
      <h2 className="text-center mb-4 text-lg font-bold">{name}</h2>
      <div className="flex flex-col gap-4 text-center items-center border-2 border-gray-200 rounded-md p-4">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center mb-4 font-bold">Application Layer</h2>
          <div className="flex justify-center gap-2">
            <Tab
              color={tabColors[0]}
              isUploaded={isAdmin ? false : uploadedTabs[0]}
              onClick={() => isAdmin && onTabSelect(0, "FTP")}
            >
              FTP
            </Tab>
            <Tab
              color={tabColors[1]}
              isUploaded={isAdmin ? false : uploadedTabs[1]}
              onClick={() => isAdmin && onTabSelect(1, "HTTP/HTTPS")}
            >
              HTTP/HTTPS
            </Tab>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center mb-4 font-bold">Transport Layer</h2>
          <div className="flex justify-center gap-2">
            <Tab
              color={tabColors[2]}
              isUploaded={isAdmin ? false : uploadedTabs[2]}
              onClick={() => isAdmin && onTabSelect(2, "TCP")}
            >
              TCP
            </Tab>
            <Tab
              color={tabColors[3]}
              isUploaded={isAdmin ? false : uploadedTabs[3]}
              onClick={() => isAdmin && onTabSelect(3, "UDP")}
            >
              UDP
            </Tab>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center mb-4 font-bold">Network Layer</h2>
          <Tab
            color={tabColors[4]}
            isUploaded={isAdmin ? false : uploadedTabs[4]}
            onClick={() => isAdmin && onTabSelect(4, "IPv4")}
          >
            IPv4
          </Tab>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center mb-4 font-bold">Data Link Layer</h2>
          <Tab
            color={tabColors[5]}
            isUploaded={isAdmin ? false : uploadedTabs[5]}
            onClick={() => isAdmin && onTabSelect(5, "MAC")}
          >
            MAC
          </Tab>
        </div>
      </div>
    </div>
  );
};

export default Window;
