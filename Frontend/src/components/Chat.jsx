import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages([...messages, userMessage]);

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, language: "en" }),
    });

    const data = await res.json();
    const botMessage = { sender: "UpliftAI", text: data.reply };
    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h2>Chat</h2>
      <div style={{ minHeight: "150px", maxHeight: "300px", overflowY: "auto", border: "1px solid #eee", padding: "5px" }}>
        {messages.map((m, i) => (
          <div key={i}><strong>{m.sender}:</strong> {m.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%" }}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} style={{ width: "18%", marginLeft: "2%" }}>Send</button>
    </div>
  );
}

export default Chat;
