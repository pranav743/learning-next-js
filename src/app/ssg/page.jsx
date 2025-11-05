

import TodosList from "../../components/TodosList";
import RenderTime from "../../components/RenderTime";

export const dynamic = "force-static";

export default async function TodosSSG() {

  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5", {
    cache: "force-cache", 
  });
  const todos = await res.json();

  const time = new Date().toLocaleString();

  return (
    <div>
      <h1>Todos - SSG (Static Site Generation)</h1>
      <RenderTime label="Build Time:" time={time} />
      <TodosList todos={todos} />
      <p style={{ marginTop: "20px", color: "gray" }}>
        (This page is generated <b>once at build time</b> and stays the same until you rebuild.)
      </p>
    </div>
  );
}
