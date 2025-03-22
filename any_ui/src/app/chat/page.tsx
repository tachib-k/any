"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    setInput("");

    const response = await fetch("https://any-5tp4.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages([...messages, userMessage, { role: "assistant", content: data.reply }]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">エニーとチャット💬</h1>
      <div className="border p-3 h-96 overflow-y-auto mb-4 bg-white">
        {messages.map((msg, i) => (
          <p key={i} className={msg.role === "user" ? "text-right text-blue-600" : "text-left text-green-600"}>
            <strong>{msg.role === "user" ? "あなた" : "エニー"}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="エニーに話しかけてみよう！"
        className="border p-2 w-full"
      />
      <button onClick={sendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        送信
      </button>
    </div>
  );
}
