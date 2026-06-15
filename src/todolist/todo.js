import { getTodos, saveTodo, deleteTodo } from "./db.js";

let todos = [];
let draggedId = null;

export async function loadTodos() {
  todos = await getTodos();
  todos.sort((a, b) => a.sortOrder - b.sortOrder);
  renderTodos();
}

export async function addTodo(text) {
  const todo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    sortOrder: Date.now(),
  };
  await saveTodo(todo);
  await loadTodos();
}

async function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  todo.completed = !todo.completed;
  await saveTodo(todo);
  renderTodos();
}

async function saveEdit(id, text) {
  const todo = todos.find((t) => t.id === id);
  todo.text = text.trim();
  await saveTodo(todo);
}

async function removeTodo(id) {
  await deleteTodo(id);
  await loadTodos();
}

async function saveOrdering() {
  for (let i = 0; i < todos.length; i++) {
    todos[i].sortOrder = i;
    await saveTodo(todos[i]);
  }
}

function moveTodo(sourceId, targetId) {
  if (sourceId === targetId) return;
  const sourceIndex = todos.findIndex((t) => t.id === sourceId);
  const targetIndex = todos.findIndex((t) => t.id === targetId);
  const [item] = todos.splice(sourceIndex, 1);
  todos.splice(targetIndex, 0, item);
}

export function renderTodos() {
  const list = document.getElementById("todo-list");

  list.innerHTML = "";

  todos.forEach((todo) => {
    const row = document.createElement("div");

    row.className = "todo-row";
    row.draggable = true;
    row.dataset.id = todo.id;

    row.innerHTML = `
      <input
        class="todo-checkbox"
        type="checkbox"
        ${todo.completed ? "checked" : ""}
      />
      <input
        class="todo-text ${todo.completed ? "completed" : ""}"
        value="${todo.text}"
        readonly
      />
      <div class="actions">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
      </div>
    `;

    const checkbox = row.querySelector(".todo-checkbox");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const editBtn = row.querySelector(".edit-btn");
    const input = row.querySelector(".todo-text");

    editBtn.addEventListener("click", () => {
      input.removeAttribute("readonly");
      input.focus();
      input.select();
    });

    async function finishEdit() {
      input.setAttribute("readonly", true);
      await saveEdit(todo.id, input.value);
    }

    input.addEventListener("blur", finishEdit);
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        await finishEdit();
      }
    });

    row
      .querySelector(".delete-btn")
      .addEventListener("click", () => removeTodo(todo.id));

    row.addEventListener("dragstart", () => {
      draggedId = todo.id;
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", async () => {
      row.classList.remove("dragging");
      await saveOrdering();
      renderTodos();
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    row.addEventListener("drop", () => {
      moveTodo(draggedId, todo.id);
      renderTodos();
    });

    list.appendChild(row);
  });
}
