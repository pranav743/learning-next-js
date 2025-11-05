

import TodosList from "../../components/TodosList";
import RenderTime from "../../components/RenderTime";

export default async function TodosSSR() {

  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5", {
    cache: "no-store", 
  });
  const todos = await res.json();

  const time = new Date().toLocaleString();

  return (
    <div>
      <h1>Todos - SSR (Server-Side Rendering)</h1>
      <RenderTime label="Server Render Time:" time={time} />
      <TodosList todos={todos} />
    </div>
  );
}
