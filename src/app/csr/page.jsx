"use client";


import { useEffect, useState } from "react";
import TodosList from "../../components/TodosList";
import RenderTime from "../../components/RenderTime";

export default function TodosCSR() {
  const [todos, setTodos] = useState([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((res) => res.json())
      .then((data) => setTodos(data));

    setTime(new Date().toLocaleString());
  }, []);

  return (
    <div>
      <h1>Todos - CSR (Client-Side Rendering)</h1>
      <RenderTime label="Client Render Time:" time={time} />
      <TodosList todos={todos} />
    </div>
  );
}
