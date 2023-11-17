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

  return (
    <div>
      <h2>Send Message to Master</h2>
      <form onSubmit={handleMessageSubmit}>
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button type="submit">Send Message</button>
      </form>
      <h2>Replies from Master</h2>
      <table>
        <thead>
          <tr>
            <th>Original Message</th>
            <th>Reply from Master</th>
          </tr>
        </thead>
        <tbody>
          {replies.map((reply) => (
            <tr key={reply.id}>
              <td>{reply.original_message}</td>{" "}
              {/* Use the correct property name based on your backend response */}
              <td>{reply.content || "No reply yet"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SlaveMailbox;
