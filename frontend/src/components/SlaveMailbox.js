import React, { useState, useEffect } from "react";
import axios from "axios";

const SlaveMailbox = ({ slaveId }) => {
  const [messageContent, setMessageContent] = useState("");
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/replies/${slaveId}`)
      .then((response) => setReplies(response.data))
      .catch((error) => console.error(error));
  }, [slaveId]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/messages", {
        slave_id: slaveId,
        content: messageContent,
      })
      .then((response) => {
        console.log(response.data.message);
        setMessageContent("");
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteReply = (replyId) => {
    axios
      .delete(`http://localhost:5000/api/replies/${replyId}`)
      .then(() => {
        // Update the replies state to remove the deleted reply
        setReplies(replies.filter((reply) => reply.id !== replyId));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Send Message to Master</h1>
      <form onSubmit={handleMessageSubmit} className="mb-4">
        <textarea
          className="w-full p-2 border rounded-md mb-2"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded-md"
        >
          Send Message
        </button>
      </form>
      <h1 className="text-2xl font-bold mb-4">Mailbox</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Sent Message</th>
            <th className="p-2">Reply from Master</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {replies.map((reply) => (
            <tr key={reply.id} className="border-b">
              <td className="p-2">{reply.original_message}</td>
              <td className="p-2">{reply.content || "No reply yet"}</td>
              <td className="p-2">
                <button
                  className="p-2 bg-red-500 text-white rounded-md"
                  onClick={() => handleDeleteReply(reply.id)}
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

export default SlaveMailbox;
