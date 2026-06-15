import "./style.css";

import { initDb } from "./db.js";
import { loadTodos, addTodo } from "./todo.js";

async function init() {
  await initDb();
  await loadTodos();

  const input = document.getElementById("todo-input");
  const button = document.getElementById("add-btn");

  async function submitTodo() {
    const text = input.value.trim();
    if (!text) return;
    await addTodo(text);
    input.value = "";
    input.focus();
  }

  button.addEventListener("click", submitTodo);
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      await submitTodo();
    }
  });
}

init();
