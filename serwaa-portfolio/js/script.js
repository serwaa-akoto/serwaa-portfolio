const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navList = document.querySelector("#nav-menu ul");
if (navToggle && navMenu && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navMenu.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

const taskForm = document.getElementById("task-form");
if (taskForm) {
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const errorEl = document.getElementById("task-error");
  const countEl = document.getElementById("task-count");
  const clearBtn = document.getElementById("clear-completed");

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem("tasks"));
      return Array.isArray(saved) ? saved : [];
    } catch (err) {
      return [];
    }
  }

  let tasks = loadTasks();

  function saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (err) {
    }
  }

  function renderTasks() {
    list.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const text = document.createElement("span");
      text.textContent = task.text;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const doneBtn = document.createElement("button");
      doneBtn.className = "btn-done";
      doneBtn.dataset.action = "toggle";
      doneBtn.dataset.id = task.id;
      doneBtn.textContent = task.completed ? "Undo" : "Done";

      const delBtn = document.createElement("button");
      delBtn.className = "btn-delete";
      delBtn.dataset.action = "delete";
      delBtn.dataset.id = task.id;
      delBtn.textContent = "Delete";

      actions.append(doneBtn, delBtn);
      li.append(text, actions);
      list.appendChild(li);
    });

    const remaining = tasks.filter((t) => !t.completed).length;
    countEl.textContent = tasks.length
      ? `${remaining} pending, ${tasks.length - remaining} completed`
      : "No tasks yet. Add one above!";
  }

  function addTask(text) {
    tasks.push({ id: Date.now(), text: text, completed: false });
    saveTasks();
    renderTasks();
    list.lastElementChild.classList.add("new");
  }

  function toggleTask(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value === "") {
      errorEl.textContent = "Please enter a task.";
      return;
    }
    errorEl.textContent = "";
    addTask(value);
    input.value = "";
    input.focus();
  });

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === "toggle") toggleTask(id);
    if (btn.dataset.action === "delete") deleteTask(id);
  });

  clearBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
  });

  renderTasks();
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const fields = {
    name: contactForm.elements["name"],
    email: contactForm.elements["email"],
    phone: contactForm.elements["phone"],
    message: contactForm.elements["message"],
  };
  const successEl = document.getElementById("form-success");

  function setError(input, message) {
    input.nextElementSibling.textContent = message;
    input.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", String(message !== ""));
  }

  function validateField(key) {
    const input = fields[key];
    const value = input.value.trim();
    let message = "";

    if (value === "") {
      message = "This field is required.";
    } else if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Please enter a valid email address.";
    } else if (key === "phone" && !/^\d+$/.test(value)) {
      message = "Phone number must contain digits only.";
    }

    setError(input, message);
    return message === "";
  }

  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener("blur", () => validateField(key));
    fields[key].addEventListener("input", () => {
      if (fields[key].classList.contains("invalid")) validateField(key);
    });
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    successEl.textContent = "";
    const results = Object.keys(fields).map(validateField);
    if (results.every(Boolean)) {
      successEl.textContent = `Thank you, ${fields.name.value.trim()}. The form has been validated.`;
    }
  });
}