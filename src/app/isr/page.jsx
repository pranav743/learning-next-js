

import TodosList from "../../components/TodosList";
import RenderTime from "../../components/RenderTime";

export const revalidate = 10;
export default async function TodosISR() {

  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5", {
    next: { revalidate: 10 }, 
  });
  const todos = await res.json();

  const time = new Date().toLocaleString();

  return (
    <div>
      <h1>Todos - ISR (Incremental Static Regeneration)</h1>
      <RenderTime label="Generated At:" time={time} />
      <TodosList todos={todos} />
      <p style={{ marginTop: "20px", color: "gray" }}>
        (This page regenerates every <b>10 seconds</b> in the background.)
      </p>
    </div>
  );
}
