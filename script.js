const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const priorityInput = document.querySelector("#priorityInput");
const list = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const filters = document.querySelectorAll(".filter");

let tasks = [];
let currentFilter = "all";

document.querySelector("#todayLabel").textContent =
  new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  tasks.unshift({ id: Date.now(), title, priority: priorityInput.value, completed: false });
  input.value = "";
  renderTasks();
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

function renderTasks() {
  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "todo") return !task.completed;
    if (currentFilter === "done") return task.completed;
    return true;
  });

  list.innerHTML = "";
  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task ${task.completed ? "completed" : ""}`;
    item.innerHTML = `
      <input class="task-check" type="checkbox" ${task.completed ? "checked" : ""} aria-label="Mark task complete">
      <span class="task-name"></span>
      <span class="priority ${task.priority}">${task.priority}</span>
      <button class="delete" aria-label="Delete task" title="Delete task">×</button>
    `;
    item.querySelector(".task-name").textContent = task.title;
    item.querySelector(".task-check").addEventListener("change", (event) => {
      task.completed = event.target.checked;
      renderTasks();
    });
    item.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      renderTasks();
    });
    list.appendChild(item);
  });

  emptyState.hidden = visibleTasks.length > 0;
  document.querySelector("#totalCount").textContent = tasks.length;
  document.querySelector("#doneCount").textContent = tasks.filter((task) => task.completed).length;
  document.querySelector("#todoCount").textContent = tasks.filter((task) => !task.completed).length;
}

renderTasks();
