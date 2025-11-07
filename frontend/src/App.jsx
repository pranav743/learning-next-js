import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import ChatRoom from "./components/ChatRoom.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path="/" element={<LoginPage setUser={setUser} />} />
      <Route
        path="/chat"
        element={user ? <ChatRoom user={user} /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
