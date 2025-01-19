import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user's message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const response = await axios.post("http://127.0.0.1:5005/chat", {
        message: input,
      });

      // Add chatbot's response to the chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.response || "Hello! How can I help you today?" },
      ]);
    } catch (error) {
      // Add error message to the chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't connect to the server." },
      ]);
    }

    setInput(""); // Clear input field
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", color: "#2E7D32" }}>Consultation Chatbot</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: msg.sender === "user" ? "#daf1da" : "#eee",
                color: "#333",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            backgroundColor: "#2E7D32",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;