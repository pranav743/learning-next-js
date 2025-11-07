import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import MessageList from "./MessageList.jsx";
import UserList from "./UserList.jsx";

const SOCKET_URL = "http://localhost:5000";

export default function ChatRoom({ user }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const bottomRef = useRef();

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);
    s.emit("joinRoom", { username: user.username, room: user.room || "main" });
    s.on("message", msg => setMessages(m => [...m, msg]));
    s.on("roomUsers", users => setUsers(users));
    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("sendMessage", {
      message: input,
      room: user.room || "main",
      username: user.username
    });
    setInput("");
  };

  const handleLeave = () => {
    socket.disconnect();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between bg-blue-600 text-white px-6 py-3">
        <div className="font-bold">Room: {user.room || "main"}</div>
        <button onClick={handleLeave} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Leave</button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 bg-white border-r p-4">
          <UserList users={users} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList messages={messages} currentUser={user.username} />
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="flex p-4 bg-white border-t">
            <input
              className="flex-1 border rounded p-2 mr-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              autoFocus
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
