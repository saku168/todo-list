const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const list = document.querySelector("#tasks");
const empty = document.querySelector("#empty");
const STORAGE_KEY = "tasks";

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(task => task && typeof task.text === "string")
        .map(task => ({ text: task.text, done: Boolean(task.done) }))
      : [];
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    if (empty) empty.textContent = "Storage is unavailable. Your tasks may not be saved.";
  }
  render();
}

function render() {
  if (!list) return;
  list.replaceChildren();

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    if (task.done) item.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      save();
    });

    const label = document.createElement("span");
    label.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Delete";
    remove.className = "delete";
    remove.setAttribute("aria-label", `Delete ${task.text}`);
    remove.addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
    });

    item.append(checkbox, label, remove);
    list.append(item);
  });

  if (empty) empty.hidden = tasks.length > 0;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input?.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = "";
  save();
  input.focus();
});

render();