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

  return (
    <div>
      <h2>Mailbox</h2>
      <table>
        <thead>
          <tr>
            <th>Sender (Slave ID)</th>
            <th>Message</th>
            <th>Reply</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.slave_id}</td>
              <td>{message.content}</td>
              <td>
                {message.replies.map((reply, index) => (
                  <p key={index}>{reply}</p> // Display each reply
                ))}
                <textarea
                  value={replies[message.id]}
                  onChange={(e) =>
                    handleReplyChange(message.id, e.target.value)
                  }
                />
                <button onClick={() => handleReplySubmit(message.id)}>
                  Send Reply
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
