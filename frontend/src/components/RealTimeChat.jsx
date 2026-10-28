import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "../context/AppContext";

/**
 * RealTimeChat Component: Experiment 8 - Enable real-time communication via WebSockets
 */
export function RealTimeChat() {
  const { user } = useAppContext();
  const [username, setUsername] = useState(user?.name || "Student 1");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Sync username when logged-in user changes
  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
    }
  }, [user]);

  useEffect(() => {
    // Connect to WebSocket server on backend (port 5000)
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket connected to server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected from server");
      setConnected(false);
    });

    // Listen for broadcasted chat messages
    socket.on("chatMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!username.trim() || !message.trim()) return;

    const socketMessage = {
      username: username.trim(),
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    if (socketRef.current) {
      socketRef.current.emit("chatMessage", socketMessage);
      setMessage("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-2xl">
            💬
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Real-Time Chat Application
            </h2>
            <p className="text-xs text-slate-400">
              WebSockets & Socket.IO • Experiment 8
            </p>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
            connected
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
            }`}
          />
          <span>{connected ? "Connected" : "Connecting..."}</span>
        </div>
      </div>

      {/* Username Configuration & Quick Switcher */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-medium text-slate-400 whitespace-nowrap">
            Your Name:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full sm:w-48 px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Quick Identity Selector for Lab Testing */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Quick set:</span>
          <button
            type="button"
            onClick={() => setUsername("Student 1")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              username === "Student 1"
                ? "bg-sky-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Student 1
          </button>
          <button
            type="button"
            onClick={() => setUsername("Student 2")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              username === "Student 2"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Student 2
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="p-5 h-80 overflow-y-auto space-y-3 bg-slate-950/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
            <span className="text-3xl mb-2">⚡</span>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-slate-600 mt-1 max-w-xs">
              Open another tab as Student 2 and exchange messages instantly without refreshing!
            </p>
          </div>
        ) : (
          messages.map((item, index) => {
            const isSelf = item.username === username;
            return (
              <div
                key={index}
                className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${
                    isSelf
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <strong
                      className={`text-xs font-bold ${
                        isSelf ? "text-sky-200" : "text-emerald-400"
                      }`}
                    >
                      {item.username}
                    </strong>
                    {item.timestamp && (
                      <span className="text-[10px] text-slate-400">
                        {item.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed break-words">{item.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message Form */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={!connected || !message.trim()}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <span>Send</span>
          <span>✈️</span>
        </button>
      </form>
    </div>
  );
}
