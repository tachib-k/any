"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // ← 追加！

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]); // ← prevを使って安全に！
    setInput("");
    setLoading(true); // ← 追加！

    try {
      const response = await fetch("https://any-5tp4.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "エラーが発生しちゃったみたい！🙈" }]);
    } finally {
      setLoading(false); // ← 追加！
    }
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
        {loading && (
          <p className="text-center text-gray-500 italic mt-2">エニーが考え中だよ…🧠💭</p>
        )}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="エニーに話しかけてみよう！"
        className="border p-2 w-full"
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "送信中..." : "送信"}
      </button>
    </div>
  );
}
