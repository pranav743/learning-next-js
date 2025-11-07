import React from "react";

export default function MessageList({ messages, currentUser }) {
  return (
    <div className="space-y-2">
      {messages.map((msg, i) => (
        <div key={i} className={
          msg.isAdmin
            ? "text-center text-xs text-gray-500 bg-yellow-100 rounded p-1"
            : msg.username === currentUser
            ? "text-right"
            : "text-left"
        }>
          {!msg.isAdmin && (
            <span className="font-semibold mr-2 text-blue-700">{msg.username}</span>
          )}
          <span>{msg.message}</span>
          <span className="ml-2 text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
}
