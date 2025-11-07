import React from "react";

export default function UserList({ users }) {
  return (
    <div>
      <div className="font-bold mb-2">Online Users</div>
      <ul className="space-y-1">
        {users.map((u, i) => (
          <li key={i} className="text-gray-700">{u.username}</li>
        ))}
      </ul>
    </div>
  );
}
