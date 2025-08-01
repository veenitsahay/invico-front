import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDbOM42fnjm95V7A3f7VQE1AyBTwD60LZc";
const genAI = new GoogleGenerativeAI(API_KEY);

const ChatBot: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("invico_bot_messages");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("invico_bot_messages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const playSound = () => {
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1102-pristine.mp3");
    audio.play();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, `You: ${input}`];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input);
      const response = result.response.text();
      playSound();
      setMessages([...newMessages, `🤖: ${response}`]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, "🤖: Sorry, something went wrong."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: darkMode ? "#444" : "#007bff",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {isOpen ? "❌" : "💬"}
      </button>

      {/* Chat Box */}
      <div
        style={{
          position: "fixed",
          bottom: isOpen ? "90px" : "-500px",
          right: "20px",
          width: "320px",
          height: "450px",
          padding: "16px",
          background: darkMode ? "#1e1e1e" : "#fff",
          color: darkMode ? "#fff" : "#000",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          zIndex: 999,
          transition: "bottom 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>🤖 Invico Bot</h3>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>

        <div
          ref={chatRef}
          style={{
            flex: 1,
            overflowY: "auto",
            marginTop: "10px",
            marginBottom: "10px",
            fontSize: "14px",
            paddingRight: "4px",
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>{msg}</div>
          ))}
        </div>

        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={loading ? "Thinking..." : "Ask something..."}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            background: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        />
      </div>
    </>
  );
};

export default ChatBot;