import React, { useState, useEffect } from "react";
import axios from "axios";

const MasterMailbox = () => {
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState({}); // Store replies keyed by message ID

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/messages")
      .then((response) => {
        setMessages(response.data);
        const initialReplies = {};
        response.data.forEach((message) => {
          initialReplies[message.id] = "";
        });
        setReplies(initialReplies);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleReplyChange = (messageId, content) => {
    setReplies({ ...replies, [messageId]: content });
  };

  const handleReplySubmit = (messageId) => {
    axios
      .post("http://localhost:5000/api/replies", {
        message_id: messageId,
        content: replies[messageId],
      })
      .then((response) => {
        console.log(response.data.message);
        setReplies({ ...replies, [messageId]: "" });
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteMessage = (messageId) => {
    axios
      .delete(`http://localhost:5000/api/messages/${messageId}`)
      .then(() => {
        // Update the messages state to remove the deleted message
        setMessages(messages.filter((message) => message.id !== messageId));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Mailbox</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Sender (Slave ID)</th>
            <th className="p-2">Message</th>
            <th className="p-2">Reply</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id} className="border-b">
              <td className="p-2">{message.slave_id}</td>
              <td className="p-2">{message.content}</td>
              <td className="p-2">
                {message.replies.map((reply, index) => (
                  <p key={index}>{reply}</p>
                ))}
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={replies[message.id]}
                  onChange={(e) =>
                    handleReplyChange(message.id, e.target.value)
                  }
                />
              </td>
              <td className="p-2 mt-2">
                <button
                  className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                  onClick={() => handleReplySubmit(message.id)}
                >
                  Send Reply
                </button>
                <button
                  className="p-2 bg-red-500 text-white rounded-md"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MasterMailbox;
