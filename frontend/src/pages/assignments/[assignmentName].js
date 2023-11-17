// [assignmentName].js
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AssignmentsContext from "../context/assignmentsContext"; // Ensure the path is correct

import Window from "@/components/project/Window";
import UserSection from "@/components/project/UserSection";
import SendMessage from "@/components/project/SendMessage";
import DisplayMessage from "@/components/project/DisplayMessage";

const Assignment = () => {
  const router = useRouter();
  const { assignmentName } = router.query;
  const { assignments } = useContext(AssignmentsContext);

  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [tabColors, setTabColors] = useState(Array(6).fill("green"));
  const [message, setMessage] = useState("");
  const [confirmedTabIndex, setConfirmedTabIndex] = useState(null);

  const [senderFileUploads, setSenderFileUploads] = useState(
    Array(6).fill(false)
  );
  const [receiverFileUploads, setReceiverFileUploads] = useState(
    Array(6).fill(false)
  );

  const handleUpload = (tabIndex, fileName, side) => {
    const newFileUploads =
      side === "Sender" ? [...senderFileUploads] : [...receiverFileUploads];
    newFileUploads[tabIndex] = true;
    side === "Sender"
      ? setSenderFileUploads(newFileUploads)
      : setReceiverFileUploads(newFileUploads);
    const getTabName = (tabIndex) => {
      const tabNames = ["FTP", "HTTP/HTTPS", "TCP", "UDP", "IPv4", "MAC"];
      return tabNames[tabIndex] || "Unknown";
    };
    const selectedTabName = getTabName(tabIndex);
    setMessage(
      `File ${fileName} has been uploaded to ${side}'s ${selectedTabName}.`
    );
  };

  const handleSend = () => {
    if (
      senderFileUploads.includes(true) &&
      receiverFileUploads.includes(true)
    ) {
      setMessage("Tests Passed");
      const updatedTabColors = tabColors.map(() => "green");
      setTabColors(updatedTabColors);
    } else {
      setMessage("Tests Failed");
    }
    setSenderFileUploads(Array(6).fill(false));
    setReceiverFileUploads(Array(6).fill(false));
  };

  useEffect(() => {
    const assignment = assignments.find(a => a.name === assignmentName);
    setCurrentAssignment(assignment);
  
    if (assignment && assignment.data) {
      try {
        // Attempt to parse the JSON data
        const assignmentData = JSON.parse(assignment.data);
        const initialTabColors = Array(6).fill("green");
  
        // Ensure that selectedTab exists in the parsed data
        if (typeof assignmentData.selectedTab === 'number') {
          setConfirmedTabIndex(assignmentData.selectedTab);
          if (assignmentData.selectedTab >= 0 && assignmentData.selectedTab < 6) {
            initialTabColors[assignmentData.selectedTab] = "red"; // Set confirmed tab to red
          }
        }
  
        setTabColors(initialTabColors);
      } catch (error) {
        // Handle JSON parsing errors
        console.error("Error parsing assignment data:", error);
      }
    } else {
      // Default tab colors if no data is available
      setTabColors(Array(6).fill("green"));
    }
  }, [assignmentName, assignments]);

  if (!currentAssignment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
        <Window
          name="Sender"
          isAdmin={false}
          tabColors={tabColors}
          uploadedTabs={senderFileUploads}
        />
        <Window
          name="Receiver"
          isAdmin={false}
          tabColors={tabColors}
          uploadedTabs={receiverFileUploads}
        />

        <UserSection
          selectedTab={confirmedTabIndex} // Use confirmedTabIndex here
          onUpload={handleUpload}
          side="Sender"
          fileUploads={senderFileUploads}
          setMessage={setMessage}
        />

        <UserSection
          selectedTab={confirmedTabIndex} // Use confirmedTabIndex here
          onUpload={handleUpload}
          side="Receiver"
          fileUploads={receiverFileUploads}
          setMessage={setMessage}
        />

        <SendMessage onSend={handleSend} />
        <DisplayMessage message={message} />
      </div>
    </div>
  );
};

export default Assignment;
